import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditEvents, patients } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function GET() {
  const user=await getChatGPTUser(); if(!user)return Response.json({error:"Authentication required"},{status:401});
  const db=getDb(); const rows=await db.select().from(patients).where(eq(patients.ownerId,user.userId)).orderBy(desc(patients.createdAt));
  const fields=["patientCode","age","sex","cancerType","stage","biomarker","status","site","consentStatus"] as const;
  const csv=[["Patient","Age","Sex","Cancer type","Stage","Biomarker","Status","Site","Consent"],...rows.map(row=>fields.map(field=>row[field]))].map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(",")).join("\n");
  await db.insert(auditEvents).values({ownerId:user.userId,actorEmail:user.email,action:"exported",entityType:"patient_directory",entityId:0,detail:`Exported ${rows.length} demonstration records`});
  return new Response(csv,{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":"attachment; filename=oncocohort-patients.csv","cache-control":"no-store"}});
}
