import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditEvents, cohortPatients, cohorts, patients } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const body = await request.json() as { cohortId?: number; patientId?: number };
  const cohortId=Number(body.cohortId); const patientId=Number(body.patientId);
  if (!Number.isInteger(cohortId)||!Number.isInteger(patientId)) return Response.json({error:"Valid cohort and patient are required"},{status:400});
  const db=getDb();
  const [cohort]=await db.select().from(cohorts).where(and(eq(cohorts.id,cohortId),eq(cohorts.ownerId,user.userId))).limit(1);
  const [patient]=await db.select().from(patients).where(and(eq(patients.id,patientId),eq(patients.ownerId,user.userId))).limit(1);
  if(!cohort||!patient)return Response.json({error:"Cohort or patient not found"},{status:404});
  const existing=await db.select().from(cohortPatients).where(and(eq(cohortPatients.ownerId,user.userId),eq(cohortPatients.cohortId,cohortId),eq(cohortPatients.patientId,patientId))).limit(1);
  if(existing.length)return Response.json({error:"Patient is already enrolled"},{status:409});
  const [enrollment]=await db.insert(cohortPatients).values({ownerId:user.userId,cohortId,patientId}).returning();
  await db.insert(auditEvents).values({ownerId:user.userId,actorEmail:user.email,action:"enrolled",entityType:"patient",entityId:patientId,detail:`Enrolled ${patient.patientCode} in ${cohort.name}`});
  return Response.json({enrollment},{status:201});
}
