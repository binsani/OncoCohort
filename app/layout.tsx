import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const sans=Geist({variable:"--sans",subsets:["latin"]}); const mono=Geist_Mono({variable:"--mono",subsets:["latin"]});
export async function generateMetadata():Promise<Metadata>{
  const h=await headers(); const host=h.get("host")??"localhost:3000"; const protocol=host.includes("localhost")?"http":"https"; const image=`${protocol}://${host}/og.png`;
  return {title:"OncoCohort — Clinical Research Workspace",description:"Build, review, and monitor oncology cohorts across participating clinical sites.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title:"OncoCohort — Clinical Research Workspace",description:"Clinical research, clearly connected.",images:[image]},twitter:{card:"summary_large_image",title:"OncoCohort — Clinical Research Workspace",description:"Clinical research, clearly connected.",images:[image]}};
}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>}
