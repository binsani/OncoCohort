import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditEvents } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function GET(){const user=await getChatGPTUser();if(!user)return Response.json({error:"Authentication required"},{status:401});const events=await getDb().select().from(auditEvents).where(eq(auditEvents.ownerId,user.userId)).orderBy(desc(auditEvents.createdAt)).limit(30);return Response.json({events});}
