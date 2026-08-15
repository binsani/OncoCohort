"use client";
/* eslint-disable jsx-a11y/label-has-associated-control -- labels are visual section eyebrows */
import { useEffect, useMemo, useState } from "react";
import { CohortManager } from "./cohort-manager";

const patients = [
  ["OC-1042","AM",58,"F","Breast","II","HER2+","On treatment","Lagos","Today"],
  ["OC-1038","KO",64,"M","Prostate","III","BRCA2","Screening","Abuja","Yesterday"],
  ["OC-1031","NI",47,"F","Ovarian","III","HRD+","On treatment","Lagos","2 days ago"],
  ["OC-1024","TO",71,"M","Lung","IV","EGFR","Follow-up","Ibadan","3 days ago"],
  ["OC-1019","ES",52,"F","Breast","I","TNBC","Screening","Enugu","5 days ago"],
] as const;
const filters = ["All patients","Breast","Prostate","Ovarian","Lung"];

export default function Home(){
  const [active,setActive]=useState("All patients"); const [query,setQuery]=useState(""); const [notice,setNotice]=useState("");
  useEffect(()=>{
    const buttons=[...document.querySelectorAll("button")];
    const create=buttons.find(button=>button.textContent?.includes("Create cohort"));
    const exportButton=buttons.find(button=>button.textContent?.includes("Export"));
    const reportButton=buttons.find(button=>button.textContent?.includes("View report"));
    const activityButton=buttons.find(button=>button.textContent?.includes("View all activity"));
    const patientsButton=buttons.find(button=>button.textContent?.includes("View all patients"));
    const createHandler=()=>document.getElementById("cohort-manager")?.scrollIntoView({behavior:"smooth"});
    const exportHandler=()=>{window.location.assign("/api/export")};
    const reportHandler=()=>window.location.assign("/reports");
    const activityHandler=()=>window.location.assign("/activity");
    const patientsHandler=()=>window.location.assign("/patients");
    create?.addEventListener("click",createHandler); exportButton?.addEventListener("click",exportHandler);
    reportButton?.addEventListener("click",reportHandler);activityButton?.addEventListener("click",activityHandler);patientsButton?.addEventListener("click",patientsHandler);
    return()=>{create?.removeEventListener("click",createHandler);exportButton?.removeEventListener("click",exportHandler);reportButton?.removeEventListener("click",reportHandler);activityButton?.removeEventListener("click",activityHandler);patientsButton?.removeEventListener("click",patientsHandler)};
  },[]);
  const filtered=useMemo(()=>patients.filter(p=>(active==="All patients"||p[4]===active)&&p.join(" ").toLowerCase().includes(query.toLowerCase())),[active,query]);
  const ping=(message:string)=>{setNotice(message);window.setTimeout(()=>setNotice(""),2400)};
  return <main>
    {notice&&<div className="toast" role="status">{notice}</div>}
    <header className="topbar"><a className="brand" href="#top"><span>O</span>OncoCohort</a><nav><a className="active" href="#workspace">Workspace</a><a href="/cohorts">Cohorts</a><a href="/patients">Patients</a><a href="/reports">Reports</a><a href="/activity">Activity</a><a href="/settings">Settings</a></nav><a className="user" href="/settings" aria-label="Open admin settings"><i>●</i><span>SA</span><b>Dr. S. Adeyemi</b></a></header>
    <div className="page" id="workspace">
      <section className="hero" id="top"><div><label>RESEARCH WORKSPACE</label><h1>Good morning, Dr. Adeyemi.</h1><p>Your oncology cohort is up to date. Review eligibility, outcomes, and recent changes across participating sites.</p></div><button className="primary" onClick={()=>ping("New cohort workspace created")}>＋ Create cohort</button></section>
      <section className="metrics">
        <article><header><i className="mint">◎</i><em>↑ 8.4%</em></header><strong>1,284</strong><b>Patients enrolled</b><small>+99 this quarter</small></article>
        <article><header><i className="blue">◇</i><em>↑ 4.1%</em></header><strong>842</strong><b>Eligible patients</b><small>65.6% of enrolled</small></article>
        <article><header><i className="lilac">⌁</i><em className="neutral">12 active</em></header><strong>18</strong><b>Clinical cohorts</b><small>6 in follow-up</small></article>
        <article><header><i className="amber">⌖</i><em className="neutral">4 regions</em></header><strong>7</strong><b>Participating sites</b><small>Last sync 14 min ago</small></article>
      </section>
      <CohortManager />
      <div className="grid">
        <section className="panel overview" id="cohorts"><PanelTitle eyebrow="COHORT OVERVIEW" title="Population at a glance" action="View report ↗" onClick={()=>ping("Detailed cohort report opened")}/><div className="population"><div className="donut"><div><strong>66%</strong><span>eligible</span></div></div><div className="legend"><Legend c="green" title="Eligible" detail="842 patients" value="65.6%"/><Legend c="gold" title="Under review" detail="274 patients" value="21.3%"/><Legend c="gray" title="Excluded" detail="168 patients" value="13.1%"/></div></div><div className="sites"><header><b>Enrollment by site</b><span>Patients</span></header>{[["Lagos University Hospital",382,100],["National Hospital Abuja",294,77],["UCH Ibadan",238,62],["UNTH Enugu",184,48]].map(([n,v,w])=><div className="bar" key={n}><span>{n}</span><div><i style={{width:`${w}%`}}/></div><b>{v}</b></div>)}</div></section>
        <aside className="panel activity" id="activity"><PanelTitle eyebrow="LIVE UPDATES" title="Recent activity" action="•••"/><div className="timeline"><Event color="coral" initials="MO"><b>Dr. M. Okafor</b> added 12 patients to <a href="#cohorts">NSCLC Biomarker Study</a><small>18 minutes ago</small></Event><Event color="teal" initials="AI"><b>A. Ibrahim</b> updated eligibility criteria for <a href="#cohorts">Breast Cancer Registry</a><small>1 hour ago</small></Event><Event color="purple" initials="CN"><b>C. Nwosu</b> completed data review for 24 records<small>Yesterday at 16:42</small></Event><Event color="goldBg" initials="SY"><b>System</b> synced 68 records from UCH Ibadan<small>Yesterday at 09:15</small></Event></div><button className="wide" onClick={()=>ping("All activity is now visible")}>View all activity</button></aside>
      </div>
      <section className="panel directory"><div className="directoryHead"><div><label>PATIENT DIRECTORY</label><h2>Recently updated patients</h2></div><div className="actions"><div className="search">⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search patients" aria-label="Search patients"/></div><button onClick={()=>ping("Cohort export prepared")}>⇩ Export</button></div></div><div className="filters">{filters.map(f=><button className={active===f?"selected":""} onClick={()=>setActive(f)} key={f}>{f}{f!=="All patients"&&<span>{patients.filter(p=>p[4]===f).length}</span>}</button>)}</div><div className="tableWrap"><table><thead><tr>{["Patient","Age / Sex","Cancer type","Stage","Biomarker","Status","Site","Updated"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map(p=><tr key={p[0]}><td><i>{p[1]}</i><b>{p[0]}</b></td><td>{p[2]} / {p[3]}</td><td><b>{p[4]}</b></td><td>{p[5]}</td><td><code>{p[6]}</code></td><td><em className={`status ${p[7].replace(" ","-").toLowerCase()}`}>{p[7]}</em></td><td>{p[8]}</td><td>{p[9]}</td></tr>)}</tbody></table>{!filtered.length&&<p className="empty">No patients match this search.</p>}</div><footer><span>Showing {filtered.length} of 1,284 patients</span><button onClick={()=>ping("Patient directory opened")}>View all patients →</button></footer></section>
    </div><footer className="siteFooter"><span>OncoCohort · Clinical Research Workspace</span><span>Data refreshed 14 minutes ago</span></footer>
  </main>
}
function PanelTitle({eyebrow,title,action,onClick}:{eyebrow:string,title:string,action:string,onClick?:()=>void}){return <div className="panelTitle"><div><label>{eyebrow}</label><h2>{title}</h2></div><button onClick={onClick}>{action}</button></div>}
function Legend({c,title,detail,value}:{c:string,title:string,detail:string,value:string}){return <div><i className={c}/><p><b>{title}</b><small>{detail}</small></p><strong>{value}</strong></div>}
function Event({color,initials,children}:{color:string,initials:string,children:React.ReactNode}){return <div className="event"><i className={color}>{initials}</i><p>{children}</p></div>}
