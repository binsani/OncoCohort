import vinext from "vinext";
import { defineConfig, type Plugin } from "vite";
import hostingConfig from "./.openai/hosting.json";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const exposeRuntimeEnv = {
  name: "oncocohort:runtime-env",
  enforce: "pre" as const,
  transform(code: string, id: string) {
    if (!id.replaceAll("\\", "/").endsWith("vinext/dist/server/app-router-entry.js")) return null;
    return code.replace(
      "var app_router_entry_default = { async fetch(request, env, ctx) {",
      "var app_router_entry_default = { async fetch(request, env, ctx) { globalThis.__ONCO_RUNTIME_ENV__ = env;",
    );
  },
  renderChunk(code: string, chunk: { fileName: string }) {
    if (chunk.fileName !== "index.js") return null;
    const match = code.match(/,([A-Za-z_$][\w$]*) as default,/);
    if (!match) return null;
    const original = match[1];
    const wrapped = `const __oncoDefault={fetch(request,env,ctx){globalThis.__ONCO_RUNTIME_ENV__=env;return ${original}.fetch(request,env,ctx)}};`;
    return wrapped + code.replace(`,${original} as default,`, ",__oncoDefault as default,");
  },
  generateBundle(_options, bundle) {
    for (const output of Object.values(bundle)) {
      if (output.type !== "chunk" || !output.isEntry || !output.fileName.endsWith("index.js") || output.code.includes("__oncoDefault")) continue;
      const match = output.code.match(/([A-Za-z_$][\w$]*) as default/);
      if (!match) continue;
      const original = match[1];
      output.code = `const __oncoDefault={fetch(request,env,ctx){globalThis.__ONCO_RUNTIME_ENV__=env;return ${original}.fetch(request,env,ctx)}};` + output.code.replace(`${original} as default`, "__oncoDefault as default");
    }
  },
} satisfies Plugin;

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // workerd does not publish a Windows ARM64 binary. Keep local validation
  // available on that host; supported deployment hosts still get Sites and
  // Cloudflare's full Worker build pipeline.
  const isUnsupportedWorkerdHost =
    process.platform === "win32" && process.arch === "arm64";

  if (isUnsupportedWorkerdHost) {
    return {
      server: isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : undefined,
      build: { rolldownOptions: { external: ["cloudflare:workers"] } },
      plugins: [exposeRuntimeEnv, vinext()],
    };
  }

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { sites } = await import("@openai/sites-vite-plugin");
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      exposeRuntimeEnv,
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
