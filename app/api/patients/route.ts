import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditEvents, patients } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const rows = await getDb().select().from(patients).where(eq(patients.ownerId, user.userId)).orderBy(desc(patients.createdAt)).limit(100);
  return Response.json({ patients: rows });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const patientCode = String(body.patientCode ?? "").trim().toUpperCase();
  const age = Number(body.age); const sex = String(body.sex ?? ""); const cancerType = String(body.cancerType ?? "").trim();
  const stage = String(body.stage ?? "").trim(); const site = String(body.site ?? "").trim();
  const consentStatus = String(body.consentStatus ?? "Pending"); const biomarker = String(body.biomarker ?? "Not recorded").trim();
  if (!patientCode || patientCode.length > 30 || !Number.isInteger(age) || age < 0 || age > 120 || !["F","M","Other"].includes(sex) || !cancerType || !stage || !site || !["Pending","Documented","Declined"].includes(consentStatus)) return Response.json({ error: "Please complete all patient fields correctly" }, { status: 400 });
  const db = getDb();
  const [patient] = await db.insert(patients).values({ ownerId:user.userId, patientCode, age, sex, cancerType, stage, site, consentStatus, biomarker }).returning();
  await db.insert(auditEvents).values({ ownerId:user.userId, actorEmail:user.email, action:"created", entityType:"patient", entityId:patient.id, detail:`Created demonstration patient ${patientCode}` });
  return Response.json({ patient }, { status: 201 });
}
