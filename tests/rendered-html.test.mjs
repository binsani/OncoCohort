import assert from "node:assert/strict";
import {access, readFile} from "node:fs/promises";
import test from "node:test";

const root=new URL("../",import.meta.url);
const read=(path)=>readFile(new URL(path,root),"utf8");

test("ships the required product routes",async()=>{
  for(const path of ["app/page.tsx","app/cohorts/page.tsx","app/patients/page.tsx","app/reports/page.tsx","app/activity/page.tsx","app/settings/page.tsx","app/compliance/page.tsx","app/login/page.tsx","app/register/page.tsx","app/logout/route.ts"]){
    await access(new URL(path,root));
  }
});

test("keeps authenticated data queries owner scoped",async()=>{
  const routes=await Promise.all(["app/api/cohorts/route.ts","app/api/patients/route.ts","app/api/enrollments/route.ts","app/api/activity/route.ts","app/api/export/route.ts"].map(read));
  for(const source of routes){
    assert.match(source,/getChatGPTUser\(\)|requireChatGPTUser\(/);
    assert.match(source,/ownerId|owner_id/);
  }
});

test("uses platform-owned sign in and sign out endpoints",async()=>{
  const [auth,logout]=await Promise.all([read("app/chatgpt-auth.ts"),read("app/logout/route.ts")]);
  assert.match(auth,/\/signin-with-chatgpt/);
  assert.match(auth,/\/signout-with-chatgpt/);
  assert.match(logout,/chatGPTSignOutPath\("\/login"\)/);
});

test("publishes explicit non-clinical intended use",async()=>{
  const [compliance,intendedUse]=await Promise.all([read("app/compliance/page.tsx"),read("docs/INTENDED_USE.md")]);
  assert.match(compliance,/does not diagnose disease, recommend treatment/i);
  assert.match(intendedUse,/not intended to:[\s\S]*diagnose/i);
  assert.match(intendedUse,/regulatory review/i);
});

test("declares the D1 binding and migrations",async()=>{
  const hosting=JSON.parse(await read(".openai/hosting.json"));
  assert.equal(hosting.d1,"DB");
  await access(new URL("drizzle/0000_oncocohort.sql",root));
  await access(new URL("drizzle/0001_clinical_workflows.sql",root));
});
