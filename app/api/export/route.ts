import { getChatGPTUser } from "../../chatgpt-auth";

const rows = [
  ["OC-1042",58,"F","Breast","II","HER2+","On treatment","Lagos"],
  ["OC-1038",64,"M","Prostate","III","BRCA2","Screening","Abuja"],
  ["OC-1031",47,"F","Ovarian","III","HRD+","On treatment","Lagos"],
  ["OC-1024",71,"M","Lung","IV","EGFR","Follow-up","Ibadan"],
  ["OC-1019",52,"F","Breast","I","TNBC","Screening","Enugu"],
];

export async function GET() {
  if (!await getChatGPTUser()) return Response.json({ error: "Authentication required" }, { status: 401 });
  const csv = [["Patient","Age","Sex","Cancer type","Stage","Biomarker","Status","Site"], ...rows].map(row => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(",")).join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=oncocohort-demo-export.csv", "cache-control": "no-store" } });
}
