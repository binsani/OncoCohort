import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { cohorts } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const rows = await getDb().select().from(cohorts).where(eq(cohorts.ownerId, user.userId)).orderBy(desc(cohorts.createdAt)).limit(50);
  return Response.json({ cohorts: rows });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const body = await request.json() as { name?: string; cancerType?: string };
  const name = body.name?.trim(); const cancerType = body.cancerType?.trim();
  if (!name || !cancerType || name.length > 100 || cancerType.length > 60) return Response.json({ error: "A valid name and cancer type are required" }, { status: 400 });
  const [cohort] = await getDb().insert(cohorts).values({ ownerId: user.userId, name, cancerType }).returning();
  return Response.json({ cohort }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid cohort id" }, { status: 400 });
  await getDb().delete(cohorts).where(and(eq(cohorts.id, id), eq(cohorts.ownerId, user.userId)));
  return new Response(null, { status: 204 });
}
