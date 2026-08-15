export function WorkspaceHeader({active}:{active:"workspace"|"cohorts"|"patients"|"reports"|"activity"|"settings"}){
  const links=[["/","workspace","Workspace"],["/cohorts","cohorts","Cohorts"],["/patients","patients","Patients"],["/reports","reports","Reports"],["/activity","activity","Activity"],["/settings","settings","Settings"]] as const;
  return <header className="topbar"><a className="brand" href="/"><span>O</span>OncoCohort</a><nav>{links.map(([href,key,label])=><a key={key} className={active===key?"active":""} href={href}>{label}</a>)}</nav><a className="backLink" href="/">Dashboard</a></header>
}
