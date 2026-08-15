"use client";
import { useEffect, useState } from "react";

type Event={id:number;action:string;entityType:string;detail:string;actorEmail:string;createdAt:string};

export default function ActivityPage(){
  const [events,setEvents]=useState<Event[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  async function load(){setLoading(true);const response=await fetch("/api/activity",{cache:"no-store"});if(response.ok){setEvents((await response.json()).events);setError("")}else setError("Activity could not be loaded.");setLoading(false)}
  useEffect(()=>{void load()},[]);
  return <main><header className="topbar"><a className="brand" href="/"><span>O</span>OncoCohort</a><nav><a href="/">Workspace</a><a href="/#cohorts">Cohorts</a><a className="active" href="/activity">Activity</a></nav><a className="backLink" href="/">← Back to dashboard</a></header><div className="activityPage"><div className="activityHero"><div><p>AUDIT & ACTIVITY</p><h1>Workspace activity</h1><span>A chronological record of changes made to your cohorts and demonstration patient records.</span></div><button onClick={()=>void load()} disabled={loading}>{loading?"Refreshing…":"Refresh activity"}</button></div><section className="panel activityLog"><header><b>Recent events</b><span>{events.length} recorded events</span></header>{error&&<div className="activityError">{error}</div>}{loading&&<div className="activityLoading">Loading activity…</div>}{!loading&&!error&&!events.length&&<div className="activityLoading">No activity yet. Create a cohort or demonstration patient to begin the audit trail.</div>}{events.map(event=><article key={event.id}><i>{event.action==="deleted"?"×":"✓"}</i><div><b>{event.detail}</b><p><span>{event.action}</span> {event.entityType.replaceAll("_"," ")} · {event.actorEmail}</p></div><time>{new Date(event.createdAt).toLocaleString()}</time></article>)}</section><p className="activityNote">Audit records are append-only in the application interface. This workspace remains for demonstration data until organizational governance is complete.</p></div></main>
}
