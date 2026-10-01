const KEY="munvarSmartLibraryV3";
const seed={
 users:[
  {id:1,email:"admin@university.edu",password:"admin123",role:"staff",name:"Library Staff",studentId:null},
  {id:3,email:"student@university.edu",password:"student123",role:"student",name:"Rahul Kumar",studentId:"STU2026001"},
  {id:4,email:"teacher@university.edu",password:"teacher123",role:"teacher",name:"Dr. Priya Sharma",teacherId:"TCH2026001",department:"Computer Science & AI",semester:"Faculty",mobile:"9876543211",active:true}
 ],
 students:[
  {id:1,studentId:"STU2026001",name:"Rahul Kumar",department:"Computer Science & AI",semester:"6",mobile:"9876543210",email:"student@university.edu",joined:"2026-08-05"},
  {id:2,studentId:"STU2026002",name:"Aarav Sharma",department:"Data Science",semester:"5",mobile:"9876501234",email:"aarav@university.edu",joined:"2026-08-08"},
  {id:3,studentId:"STU2026003",name:"Fatima Noor",department:"Information Technology",semester:"6",mobile:"9988776655",email:"fatima@university.edu",joined:"2026-08-12"},
  {id:4,studentId:"STU2026004",name:"Zoya Khan",department:"Artificial Intelligence",semester:"4",mobile:"9123456780",email:"zoya@university.edu",joined:"2026-08-17"},
  {id:5,studentId:"STU2026005",name:"Aditya Reddy",department:"Computer Science",semester:"3",mobile:"9012345678",email:"aditya@university.edu",joined:"2026-08-20"},
  {id:6,studentId:"STU2026006",name:"Sana Ali",department:"Data Science",semester:"5",mobile:"9090909090",email:"sana@university.edu",joined:"2026-08-24"}
 ],
 books:[
  {id:1,bookId:"BK001",title:"Python for Data Analysis",author:"Wes McKinney",category:"Data Science",stock:5,total:8,addedAt:"2026-08-01"},
  {id:2,bookId:"BK002",title:"Hands-On Machine Learning",author:"Aurélien Géron",category:"AI/ML",stock:3,total:7,addedAt:"2026-08-04"},
  {id:3,bookId:"BK003",title:"Deep Learning with Python",author:"François Chollet",category:"AI/ML",stock:2,total:6,addedAt:"2026-08-07"},
  {id:4,bookId:"BK004",title:"Clean Code",author:"Robert C. Martin",category:"Programming",stock:8,total:10,addedAt:"2026-08-10"},
  {id:5,bookId:"BK005",title:"Database System Concepts",author:"Silberschatz",category:"Database",stock:6,total:8,addedAt:"2026-08-14"},
  {id:6,bookId:"BK006",title:"Operating System Concepts",author:"Silberschatz",category:"Systems",stock:7,total:9,addedAt:"2026-08-18"},
  {id:7,bookId:"BK007",title:"Designing Data-Intensive Applications",author:"Martin Kleppmann",category:"Data Engineering",stock:2,total:5,addedAt:"2026-09-10"},
  {id:8,bookId:"BK008",title:"Artificial Intelligence: A Modern Approach",author:"Russell & Norvig",category:"AI/ML",stock:4,total:6,addedAt:"2026-09-18"}
 ],
 loans:[
  {id:1001,studentId:1,bookId:2,issueDate:"2026-09-24",issueTime:"10:15",dueDate:"2026-09-29",returnDate:null,status:"Borrowed",fine:0},
  {id:1002,studentId:2,bookId:1,issueDate:"2026-09-22",issueTime:"12:20",dueDate:"2026-09-28",returnDate:null,status:"Borrowed",fine:0},
  {id:1003,studentId:3,bookId:3,issueDate:"2026-09-18",issueTime:"09:40",dueDate:"2026-09-25",returnDate:null,status:"Overdue",fine:15},
  {id:1004,studentId:4,bookId:4,issueDate:"2026-09-20",issueTime:"14:10",dueDate:"2026-09-30",returnDate:null,status:"Borrowed",fine:0},
  {id:1005,studentId:1,bookId:5,issueDate:"2026-09-10",issueTime:"11:05",dueDate:"2026-09-20",returnDate:"2026-09-19",status:"Returned",fine:0},
  {id:1006,studentId:5,bookId:2,issueDate:"2026-09-08",issueTime:"10:35",dueDate:"2026-09-18",returnDate:"2026-09-18",status:"Returned",fine:0},
  {id:1007,studentId:6,bookId:7,issueDate:"2026-09-25",issueTime:"15:30",dueDate:"2026-10-02",returnDate:null,status:"Borrowed",fine:0},
  {id:1008,studentId:3,bookId:8,issueDate:"2026-08-28",issueTime:"13:15",dueDate:"2026-09-07",returnDate:"2026-09-09",status:"Returned",fine:10}
 ],
 notifications:[
  {id:1,studentId:1,loanId:1001,channel:"Email",type:"Due Reminder",message:"Your book 'Hands-On Machine Learning' is due tomorrow.",date:"2026-09-28",time:"08:00",status:"Scheduled"},
  {id:2,studentId:2,loanId:1002,channel:"SMS",type:"Due Reminder",message:"Reminder: Python for Data Analysis is due today.",date:"2026-09-28",time:"08:05",status:"Sent"},
  {id:3,studentId:3,loanId:1003,channel:"SMS",type:"Overdue",message:"Your book is overdue. Current fine: ₹15.",date:"2026-09-26",time:"09:00",status:"Sent"}
 ],
 audit:[
  {time:"2026-09-28 10:15",user:"Library Administrator",action:"Viewed student report"},
  {time:"2026-09-28 10:05",user:"Ayesha Rahman",action:"Issued BK007 to STU2026006"},
  {time:"2026-09-27 16:20",user:"Library Administrator",action:"Generated PDF report"},
  {time:"2026-09-26 09:10",user:"Rahul Kumar",action:"Student account login"}
 ]
};
var db=loadDB(), currentUser=null, chartRefs={};
// Keep the application database shared with firebase-bridge.js.
window.db = db;
window.getLibraryDB = function(){ return db; };
window.setLibraryDB = function(cloud){
  if(!cloud || typeof cloud !== "object") return false;
  db = cloud;
  window.db = db;
  try{ localStorage.setItem(KEY, JSON.stringify(db)); }catch(e){}
  return true;
};
function loadDB(){
 try{
  let x=JSON.parse(localStorage.getItem(KEY));
  const data=x||structuredClone(seed);
  // Staff is the single non-student operational role. Migrate legacy role names for compatibility.
  if(Array.isArray(data.users)) data.users.forEach(u=>{if(u.role==='librarian'){u.role='admin';}});
  return data;
 }catch{return structuredClone(seed)}
}
async function saveDB(){
  // Keep the global reference synchronized for the Firebase bridge.
  window.db = db;

  // localStorage is only a browser cache.
  localStorage.setItem(KEY,JSON.stringify(db));

  // Firestore is the primary database.
  if(window.firebaseDb){
    try{
      await window.firebaseDb.collection("library").doc("state").set({
        data: db,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("Library database saved to Firebase");
    }catch(error){
      console.error("Firebase save failed:",error);
    }
  }
}
// Keep multiple open student/admin tabs on the same live library database.
window.addEventListener("storage",e=>{
  if(e.key!==KEY||!e.newValue)return;
  try{
    const incoming=JSON.parse(e.newValue);
    if(!incoming||!Array.isArray(incoming.loans)||!Array.isArray(incoming.books)||!Array.isArray(incoming.students))return;
    db=incoming;
    window.db = db;
    reconcileInventory();
    normalizeStatuses();
    const page=document.querySelector('.nav-item.active')?.dataset.page||'dashboard';
    if(typeof professionalRoute==='function') professionalRoute(page); else route(page);
    toast("Library data synced from another tab","success");
  }catch(err){console.warn("Library sync failed",err)}
});
function reconcileInventory(){
  if(!Array.isArray(db.books)||!Array.isArray(db.loans))return;
  db.books.forEach(b=>{
    const active=db.loans.filter(l=>Number(l.bookId)===Number(b.id)&&l.status!=="Returned").length;
    const total=Math.max(Number(b.total)||0,active);
    b.total=total;
    b.stock=Math.max(0,total-active);
  });
}
function today(){const d=new Date();const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`}
function nowTime(){return new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
function student(id){return db.students.find(x=>x.id==id)}
function teacher(id){return (db.users||[]).find(x=>x.role==='teacher'&&(String(x.teacherId)===String(id)||String(x.id)===String(id)))}
function borrower(l){
  if(l&&l.teacherId){const t=teacher(l.teacherId); return t?{...t,studentId:t.teacherId||t.id,borrowerType:'Teacher'}:null;}
  const st=student(l?.studentId); return st?{...st,borrowerType:'Student'}:null;
}
function book(id){return db.books.find(x=>x.id==id)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function fmtDate(d){if(!d)return "—";return new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function statusBadge(s){let c=s==="Returned"?"green":s==="Overdue"?"red":s==="Borrowed"?"blue":"orange";return `<span class="badge ${c}">${esc(s)}</span>`}
function toast(msg,type=""){let x=document.createElement("div");x.className="toast "+type;x.textContent=msg;document.getElementById("toast").appendChild(x);setTimeout(()=>x.remove(),3000)}
function addAudit(action){db.audit.unshift({time:`${today()} ${nowTime()}`,user:currentUser.name,action});db.audit=db.audit.slice(0,100);saveDB()}
function getCurrentStudent(){if(!currentUser)return null;return db.students.find(x=>String(x.id)===String(currentUser.studentId)||String(x.studentId)===String(currentUser.studentId)||String(x.email).toLowerCase()===String(currentUser.email||'').toLowerCase())||null}
function dueStatus(l){if(l.status==="Returned")return "Returned"; if(l.dueDate<today())return "Overdue"; return "Borrowed"}
function normalizeStatuses(){
  db.loans.forEach(l=>{
    const endDate=l.status==="Returned"&&l.returnDate?l.returnDate:today();
    const overdueDays=Math.max(0,Math.ceil((new Date(endDate)-new Date(l.dueDate))/864e5));
    l.fine=overdueDays*5;
    if(l.status!=="Returned")l.status=dueStatus(l);
  });
  saveDB();
}
async function boot(){
 // Load the latest database from Firebase before running any local reconciliation.
 if(window.firebaseDb){
   try{
     const snapshot=await window.firebaseDb.collection("library").doc("state").get();
     if(snapshot.exists && snapshot.data()?.data){
       const cloud=snapshot.data().data;
       if(Array.isArray(cloud.users) && Array.isArray(cloud.books)){
         window.setLibraryDB(cloud);
         console.log("Library data loaded from Firebase");
       }
     }else{
       console.log("No Firebase library state found. Initial database will be uploaded.");
     }
   }catch(error){
     console.error("Firebase load failed. Using local cache:",error);
   }
 }

 reconcileInventory();
 normalizeStatuses();
 const saved=localStorage.getItem("munvarCurrentUser") || sessionStorage.getItem("smartLibrarySession");
 document.getElementById("app").classList.add("hidden");
 document.getElementById("loginScreen").classList.remove("hidden");
 if(saved){
   try{
    const parsed=JSON.parse(saved);
    const fresh=db.users.find(u=>u.id===parsed.id&&u.email===parsed.email);
    if(fresh){currentUser={...fresh, role:fresh.role==="librarian"?"admin":fresh.role};localStorage.setItem("munvarCurrentUser",JSON.stringify(currentUser));showApp();}
    else localStorage.removeItem("munvarCurrentUser");
   }catch{localStorage.removeItem("munvarCurrentUser")}
 }
}
function login(e){
 e.preventDefault();
 const email=(loginEmail.value||"").trim().toLowerCase();
 const pass=loginPassword.value||"";
 const u=db.users.find(x=>(x.email||"").trim().toLowerCase()===email && String(x.password)===String(pass));
 if(!u){ toast("Invalid email or password. Use one of the demo accounts shown above.","error"); return; }
 currentUser={...u, role:u.role==="librarian"?"admin":u.role};
 localStorage.setItem("munvarCurrentUser",JSON.stringify(currentUser));
 addAudit(`Logged in as ${u.role}`);
 showApp();
}
function showApp(){
 document.getElementById("loginScreen").classList.add("hidden");document.getElementById("app").classList.remove("hidden");
 roleChip.textContent=currentUser.role==="student"?"STUDENT":"STAFF";
 topName.textContent=currentUser.role==="student"?currentUser.name:"Library Staff";
 topRole.textContent=currentUser.role==="teacher"?"Teacher":currentUser.role==="student"?"Student":"Staff";
 avatar.textContent=currentUser.name[0].toUpperCase();
 buildNav();refreshNotifCount();route("dashboard");
}
function dashboard(){
 if(currentUser.role==="student")return studentDashboard();
 const active=db.loans.filter(l=>l.status!=="Returned"), overdue=active.filter(l=>l.status==="Overdue");
 const totalStudents=db.students.length, activeAccounts=db.users.filter(u=>u.role==="student"&&u.active!==false).length;
 const borrowers=new Set(active.map(l=>l.studentId)).size, overdueStudents=new Set(overdue.map(l=>l.studentId)).size;
 const todayStr=today(), dueToday=active.filter(l=>l.dueDate===todayStr).length, dueSoon=active.filter(l=>l.dueDate===addDays(todayStr,1)).length;
 const returnsToday=db.loans.filter(l=>l.returnDate===todayStr).length;
 const recentBooks=db.books.slice().sort((a,b)=>(b.addedAt||"").localeCompare(a.addedAt||"")).slice(0,5);
 content.innerHTML=`<div class="page-head"><div><span class="eyebrow">STAFF COMMAND CENTER</span><h1>Library Dashboard</h1><p>Today’s circulation, records and attention items in one place.</p></div><div class="actions"><button class="primary" onclick="route('issue')">Open Circulation</button><button class="ghost" onclick="route('reports')">Reports</button></div></div>
 <div class="kpis">
 <button class="kpi kpi-click" onclick="openDashboardKpi('students')"><div class="label">TOTAL STUDENTS</div><div class="value">${totalStudents}</div><div class="trend">Open student records →</div></button>
 <button class="kpi kpi-click" onclick="openDashboardKpi('accounts')"><div class="label">ACTIVE ACCOUNTS</div><div class="value">${activeAccounts}</div><div class="trend">Open login-enabled accounts →</div></button>
 <button class="kpi kpi-click" onclick="openDashboardKpi('borrowers')"><div class="label">CURRENT BORROWERS</div><div class="value">${borrowers}</div><div class="trend">Open active circulation →</div></button>
 <button class="kpi kpi-click" onclick="openDashboardKpi('overdue')"><div class="label">OVERDUE STUDENTS</div><div class="value">${overdueStudents}</div><div class="trend" style="color:${overdueStudents?'#dc2626':'#15803d'}">${overdueStudents?'Needs attention →':'All clear →'}</div></button>
 </div>
 <div class="today-strip"><div><span class="today-label">TODAY</span><b>${fmtDate(todayStr)}</b></div><div><span>Due today</span><strong>${dueToday}</strong></div><div><span>Due tomorrow</span><strong>${dueSoon}</strong></div><div><span>Returns today</span><strong>${returnsToday}</strong></div><div><span>Overdue books</span><strong class="${overdue.length?'danger-text':''}">${overdue.length}</strong></div></div>
 <div class="grid2"><div class="panel analytics-card"><div class="panel-head"><div><h3>Borrowing distribution</h3><small>Hover a slice for book name and borrower count.</small></div></div><div class="chart-box"><canvas id="bookPieChart"></canvas></div></div><div class="panel analytics-card"><div class="panel-head"><div><h3>Monthly borrowing</h3><small>Borrowed, returned and overdue activity by month.</small></div></div><div class="chart-box"><canvas id="monthlyStatusChart"></canvas></div></div></div>
 <div class="grid2"><div class="panel"><div class="panel-head"><div><h3>Newly Added Books</h3><small>Latest inventory additions.</small></div><button class="btn-sm" onclick="route('books')">Manage Books</button></div>${recentBooks.map(newBookCard).join("")}</div><div class="panel"><div class="panel-head"><div><h3>Today’s Work</h3><small>Fast actions for the circulation desk.</small></div></div><div class="quick-grid"><button class="quick-card" onclick="route('issue')"><b>Issue / Return</b><span>Circulation desk</span></button><button class="quick-card" onclick="route('due')"><b>Due & Overdue</b><span>Fines and reminders</span></button><button class="quick-card" onclick="route('students')"><b>Students</b><span>Records and accounts</span></button><button class="quick-card" onclick="route('reports')"><b>Reports</b><span>Export library data</span></button></div></div></div>`;
 renderV5DashboardCharts();
}
function openDashboardKpi(type){
 const active=db.loans.filter(l=>l.status!=="Returned"), overdue=active.filter(l=>l.status==="Overdue");
 let title="", body="";
 if(type==="students"){title="All Students";body=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>ID</th><th>Department</th><th>Semester</th><th>Account</th></tr></thead><tbody>${db.students.map(s=>{const u=db.users.find(x=>x.email===s.email);return `<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.studentId)}</td><td>${esc(s.department)}</td><td>${esc(s.semester)}</td><td>${u?'<span class="badge green">Active</span>':'<span class="badge orange">No login</span>'}</td></tr>`}).join("")}</tbody></table></div>`}
 if(type==="accounts"){title="Active Student Accounts";body=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Student ID</th><th>Status</th></tr></thead><tbody>${db.users.filter(u=>u.role==="student"&&u.active!==false).map(u=>`<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td>${esc(u.studentId||"—")}</td><td><span class="badge green">Login enabled</span></td></tr>`).join("")}</tbody></table></div>`}
 if(type==="borrowers"){title="Current Borrowers";body=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Borrower</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead><tbody>${active.map(l=>`<tr><td><b>${esc(borrower(l)?.name||"Unknown")}</b></td><td>${esc(book(l.bookId)?.title||"Unknown")}</td><td>${fmtDate(l.issueDate)}</td><td>${fmtDate(l.dueDate)}</td><td>${statusBadge(l.status)}</td></tr>`).join("")||'<tr><td colspan="5" class="empty">No active borrowers.</td></tr>'}</tbody></table></div>`}
 if(type==="overdue"){title="Overdue Students";body=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Borrower</th><th>Book</th><th>Due Date</th><th>Days Overdue</th><th>Fine</th></tr></thead><tbody>${overdue.map(l=>{const days=Math.max(1,Math.ceil((new Date(today())-new Date(l.dueDate))/864e5));return `<tr><td><b>${esc(borrower(l)?.name||"Unknown")}</b></td><td>${esc(book(l.bookId)?.title||"Unknown")}</td><td>${fmtDate(l.dueDate)}</td><td><span class="badge red">${days} day${days===1?"":"s"}</span></td><td>₹${Number(l.fine)||0}</td></tr>`}).join("")||'<tr><td colspan="5" class="empty">No overdue students.</td></tr>'}</tbody></table></div>`}
 modal(`<div><div class="panel-head"><div><h2>${title}</h2><p class="muted">Live data from the central library records.</p></div></div>${body}<div class="form-actions"><button class="ghost" onclick="closeModal()">Close</button></div></div>`);
}
function renderEnhancedCharts(){
 if(window.Chart){
  const counts=db.books.map(b=>({name:b.title,count:db.loans.filter(l=>l.bookId===b.id).length}))
    .filter(x=>x.count>0).sort((a,b)=>b.count-a.count);
  if(chartRefs.pie)chartRefs.pie.destroy();
  chartRefs.pie=new Chart(document.getElementById("bookPieChart"),{
   type:"pie",
   data:{labels:counts.map(x=>x.name),datasets:[{data:counts.map(x=>x.count)}]},
   options:{responsive:true,maintainAspectRatio:false,plugins:{
    legend:{position:"right",labels:{font:{size:11},boxWidth:12}},
    tooltip:{callbacks:{label:(ctx)=>` ${ctx.label}: ${ctx.raw} borrower${ctx.raw==1?"":"s"}`}}
   }}
  });

  const months=[];
  const base=new Date(); base.setDate(1);
  for(let i=5;i>=0;i--){const d=new Date(base.getFullYear(),base.getMonth()-i,1);months.push({
   key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,label:d.toLocaleDateString("en-IN",{month:"short",year:"numeric"})
  })}
  const monthly=months.map(m=>{
   const tx=db.loans.filter(l=>String(l.issueDate||"").slice(0,7)===m.key);
   return {month:m.label,borrowed:tx.filter(l=>l.status==="Borrowed"||l.status==="Overdue").length,returned:tx.filter(l=>l.status==="Returned").length,overdue:tx.filter(l=>l.status==="Overdue").length}
  });
  if(chartRefs.month)chartRefs.month.destroy();
  chartRefs.month=new Chart(document.getElementById("monthlyStatusChart"),{
   type:"bar",data:{labels:monthly.map(x=>x.month),datasets:[
    {label:"Borrowed",data:monthly.map(x=>x.borrowed),backgroundColor:"#2563eb"},
    {label:"Returned",data:monthly.map(x=>x.returned),backgroundColor:"#16a34a"},
    {label:"Overdue",data:monthly.map(x=>x.overdue),backgroundColor:"#dc2626"}
   ]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{stacked:true},y:{stacked:true,beginAtZero:true,ticks:{precision:0}}},plugins:{tooltip:{callbacks:{label:(ctx)=>` ${ctx.dataset.label}: ${ctx.raw}`}}}}
  });
 }
}
function renderDashboardAvailability(){
 const q=(document.getElementById("dashboardBookSearch")?.value||"").toLowerCase(), f=document.getElementById("dashboardAvailabilityFilter")?.value||"";
 const arr=db.books.filter(b=>{
  const match=!q||`${b.title} ${b.author} ${b.category} ${b.bookId}`.toLowerCase().includes(q);
  const avail=b.stock>0?"available":"unavailable";
  return match&&(!f||f===avail);
 });
 const box=document.getElementById("dashboardAvailability");if(!box)return;
 box.innerHTML=arr.map(bookAvailabilityCard).join("")||`<div class="empty">No books match your search.</div>`;
}
function bookAvailabilityCard(b){
 const pct=Math.round((b.stock/b.total)*100),available=b.stock>0;
 return `<div class="availability-card"><div class="availability-top"><span class="book-icon">📚</span><span class="badge ${available?"green":"red"}">${available?`${b.stock} available`:"Unavailable"}</span></div><h4>${esc(b.title)}</h4><p>${esc(b.author)}</p><small>${esc(b.category)} · ${esc(b.bookId)}</small><div class="stock-track"><span style="width:${pct}%"></span></div><div class="availability-foot"><span>${b.stock}/${b.total} copies</span><b>${available?"Available now":"All copies issued"}</b></div></div>`;
}
function newBookCard(b){
 return `<div class="new-book-row"><div class="book-icon">📘</div><div class="new-book-info"><b>${esc(b.title)}</b><span>${esc(b.author)} · ${esc(b.category)}</span><small>Added ${fmtDate(b.addedAt||today())}</small></div><span class="badge ${b.stock>0?"green":"red"}">${b.stock>0?`${b.stock} left`:"Issued out"}</span></div>`;
}

function studentDashboard(){
 let s=getCurrentStudent(); if(!s){ content.innerHTML=v8PageHead("My Dashboard","Your student account could not be matched to a library record.")+`<div class="panel"><div class="empty">Student profile is being repaired. Please sign out and sign in again.</div></div>`; return; } let loans=db.loans.filter(l=>String(l.studentId)===String(s.id)), active=loans.filter(l=>l.status!=="Returned"), overdue=active.filter(l=>l.status==="Overdue");
 content.innerHTML=`<div class="page-head"><div><h1>Welcome, ${esc(s.name.split(" ")[0])} 👋</h1><p>Your personal university library account.</p></div><div class="actions"><button class="primary" onclick="route('catalog')">Browse Books</button></div></div>
 <div class="profile"><div class="profile-card"><div class="big-avatar">${esc(s.name[0])}</div><h2>${esc(s.name)}</h2><p>${esc(s.studentId)}</p><p>${esc(s.department)}</p><span class="badge green">Account Active</span></div>
 <div><div class="profile-grid"><div class="info-box"><span>Department</span><b>${esc(s.department)}</b></div><div class="info-box"><span>Semester</span><b>${esc(s.semester)}</b></div><div class="info-box"><span>Mobile</span><b>${esc(s.mobile)}</b></div><div class="info-box"><span>Email</span><b>${esc(s.email)}</b></div><div class="info-box"><span>Currently Borrowed</span><b>${active.length}</b></div><div class="info-box"><span>Overdue</span><b>${overdue.length}</b></div></div></div></div>
 <div class="kpis" style="margin-top:18px"><div class="kpi"><div class="label">TOTAL BORROWED</div><div class="value">${loans.length}</div></div><div class="kpi"><div class="label">OVERDUE</div><div class="value">${overdue.length}</div></div><div class="kpi"><div class="label">TOTAL FINE</div><div class="value">₹${loans.reduce((a,b)=>a+(b.fine||0),0)}</div></div></div>
 <div class="panel"><div class="panel-head"><div><h3>Semester Milestones</h3><small>Important academic dates for your semester.</small></div><button class="btn-sm" onclick="route('schedule')">View Calendar</button></div>${(db.schedule?.milestones||[]).slice().sort((a,b)=>a.date.localeCompare(b.date)).map(m=>`<div class="stat-line"><b>${esc(m.title)}</b><span>${fmtDate(m.date)}</span></div>`).join("")||'<div class="empty">No semester milestones.</div>'}</div>
 <div class="panel"><div class="panel-head"><div><h3>My current books</h3><small>Due dates and live status</small></div><button class="btn-sm" onclick="route('my-books')">Full history</button></div>${loanTableV5(loans.filter(x=>x.status!=="Returned"))}</div>`;
}
function studentsPage(){
 if(currentUser.role==="student")return studentDashboard();
 content.innerHTML=`<div class="page-head"><div><h1>Student Records</h1><p>Manage student identities, accounts, contact details and library activity.</p></div><div class="actions"><button class="primary" onclick="studentModal()">+ Add Student</button><button class="ghost" onclick="downloadXLSX()">↓ Export</button></div></div>
 <div class="kpis"><div class="kpi"><div class="label">TOTAL STUDENTS</div><div class="value">${db.students.length}</div><div class="trend">Central records</div></div><div class="kpi"><div class="label">ACTIVE ACCOUNTS</div><div class="value">${db.users.filter(u=>u.role==="student").length}</div><div class="trend">Login-enabled</div></div><div class="kpi"><div class="label">CURRENT BORROWERS</div><div class="value">${new Set(db.loans.filter(l=>l.status!=="Returned").map(l=>l.studentId)).size}</div><div class="trend">Students with active books</div></div><div class="kpi"><div class="label">OVERDUE STUDENTS</div><div class="value">${new Set(db.loans.filter(l=>l.status==="Overdue").map(l=>l.studentId)).size}</div><div class="trend">Needs attention</div></div></div>
 <div class="panel"><div class="filters"><input id="studentSearch" placeholder="Search name, ID, email, mobile..." oninput="filterStudents()"><select id="deptFilter" onchange="filterStudents()"><option value="">All departments</option>${[...new Set(db.students.map(s=>s.department))].map(x=>`<option>${esc(x)}</option>`).join("")}</select></div>
 <div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>ID</th><th>Mobile</th><th>Email</th><th>Department</th><th>Sem</th><th>Books</th><th>Account</th><th>Actions</th></tr></thead><tbody id="studentRows">${studentRows(db.students)}</tbody></table></div></div>
 <div class="panel"><div class="panel-head"><div><h3>Registered Teachers</h3><small>Teacher accounts registered in the library system.</small></div><span class="badge blue">${db.users.filter(u=>u.role==="teacher").length} TEACHERS</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Teacher</th><th>Teacher ID</th><th>Department</th><th>Email</th><th>Mobile</th><th>Status</th></tr></thead><tbody>${db.users.filter(u=>u.role==="teacher").map(t=>`<tr><td><b>${esc(t.name||"—")}</b></td><td>${esc(t.teacherId||"—")}</td><td>${esc(t.department||"—")}</td><td>${esc(t.email||"—")}</td><td>${esc(t.mobile||"—")}</td><td><span class="badge ${t.active===false?'orange':'green'}">${t.active===false?'Inactive':'Active'}</span></td></tr>`).join("")||'<tr><td colspan="6" class="empty">No teacher accounts registered.</td></tr>'}</tbody></table></div></div>`;
}
function studentRows(arr){
 return arr.map(st=>{
  const active=db.loans.filter(l=>l.studentId===st.id&&l.status!=="Returned").length;
  const u=db.users.find(x=>String(x.studentId)===String(st.studentId));
  return `<tr><td><b>${esc(st.name)}</b><div class="muted">${fmtDate(st.joined)}</div></td><td>${esc(st.studentId)}</td><td>${esc(st.mobile)}</td><td>${esc(st.email)}</td><td>${esc(st.department)}</td><td>${esc(st.semester)}</td><td><span class="badge ${active?'blue':'green'}">${active} active</span></td><td>${u?'<span class="badge green">Active</span>':'<span class="badge orange">No login</span>'}</td><td><div class="row-actions"><button class="btn-sm primary" onclick="viewStudent(${st.id})">View</button><button class="btn-sm" onclick="editStudent(${st.id})">Edit</button><button class="btn-sm danger" onclick="deleteStudent(${st.id})">Delete</button></div></td></tr>`
 }).join("")||`<tr><td colspan="9" class="empty">No students found</td></tr>`;
}
function filterStudents(){let q=studentSearch.value.toLowerCase(),d=deptFilter.value;let arr=db.students.filter(s=>(!q||Object.values(s).join(" ").toLowerCase().includes(q))&&(!d||s.department===d));studentRows;document.getElementById("studentRows").innerHTML=studentRows(arr)}
function editStudent(id){
 const st=student(id),u=db.users.find(x=>String(x.studentId)===String(st?.studentId)||String(x.studentId)===String(id));
 modal(`<h2>Edit Student</h2><p class="muted">Changes are reflected across the central student record.</p><form id="editStudentForm"><div class="form-grid">
 <div class="form-field"><label>Student ID</label><input id="eId" value="${esc(st.studentId)}" required></div>
 <div class="form-field"><label>Full Name</label><input id="eName" value="${esc(st.name)}" required></div>
 <div class="form-field"><label>Mobile</label><input id="eMobile" value="${esc(st.mobile)}" required></div>
 <div class="form-field"><label>Email</label><input id="eEmail" type="email" value="${esc(st.email)}" required></div>
 <div class="form-field"><label>Department</label><input id="eDept" value="${esc(st.department)}" required></div>
 <div class="form-field"><label>Semester</label><input id="eSem" value="${esc(st.semester)}" required></div>
 <div class="form-field"><label>New Password (optional)</label><input id="ePass" type="password" placeholder="Leave blank to keep current"></div>
 </div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Save Changes</button></div></form></div>`);
 document.getElementById("editStudentForm").onsubmit=e=>{
  e.preventDefault();
  const email=eEmail.value.trim().toLowerCase();
  if(db.students.some(x=>x.id!==id&&x.studentId.toLowerCase()===eId.value.trim().toLowerCase()))return toast("Student ID already exists","error");
  if(db.users.some(x=>x.email.toLowerCase()===email&&String(x.studentId)!==String(st.studentId)))return toast("Email already exists","error");
  st.studentId=eId.value.trim();st.name=eName.value.trim();st.mobile=eMobile.value.trim();st.email=email;st.department=eDept.value.trim();st.semester=eSem.value.trim();
  if(u){u.studentId=st.studentId;u.email=email;u.name=st.name;if(ePass.value)u.password=ePass.value}
  saveDB();addAudit(`Updated student ${st.studentId}`);closeModal();toast("Student updated","success");studentsPage();
 };
}
function deleteStudent(id){
 const st=student(id),loans=db.loans.filter(l=>l.studentId===id);
 if(loans.some(l=>l.status!=="Returned"))return toast("Cannot delete a student with active books. Return all books first.","error");
 if(!confirm(`Delete ${st.name} and their login account?`))return;
 db.students=db.students.filter(x=>x.id!==id);db.users=db.users.filter(u=>String(u.studentId)!==String(st.studentId)&&String(u.studentId)!==String(id));db.notifications=db.notifications.filter(n=>n.studentId!==id);saveDB();addAudit(`Deleted student ${st.studentId}`);toast("Student deleted","success");studentsPage();
}
function viewStudent(id){
 let s=student(id), loans=db.loans.filter(l=>l.studentId===id);
 modal(`<h2>${esc(s.name)}</h2><p class="muted">${esc(s.studentId)} · Complete student library record</p><div class="profile-grid">${[["Mobile",s.mobile],["Email",s.email],["Department",s.department],["Semester",s.semester],["Joined",fmtDate(s.joined)],["Total Transactions",loans.length]].map(x=>`<div class="info-box"><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join("")}</div><div class="panel" style="margin-top:16px;padding:0;box-shadow:none"><h3 style="padding:16px 16px 0">Borrowing History</h3>${loanTableV5(loans)}</div>`)
}
function booksPage(){
 const total=db.books.reduce((a,b)=>a+b.total,0),available=db.books.reduce((a,b)=>a+b.stock,0),issued=total-available;
 content.innerHTML=`<div class="page-head"><div><span class="eyebrow">INVENTORY</span><h1>Book Inventory</h1><p>Manage titles, copies, metadata and QR identity records.</p></div><div class="actions"><button class="ghost" onclick="generateAllBookQRs()">QR Library</button><button class="primary" onclick="bookModal()">+ Add New Book</button></div></div>
 <div class="kpis"><div class="kpi"><div class="label">BOOK TITLES</div><div class="value">${db.books.length}</div><div class="trend">Catalog records</div></div><div class="kpi"><div class="label">TOTAL COPIES</div><div class="value">${total}</div><div class="trend">Across all titles</div></div><div class="kpi"><div class="label">AVAILABLE COPIES</div><div class="value">${available}</div><div class="trend">Ready to issue</div></div><div class="kpi"><div class="label">ISSUED COPIES</div><div class="value">${issued}</div><div class="trend">Currently outside</div></div></div>
 <div class="panel"><div class="panel-head"><div><h3>Inventory records</h3><small>Search by title, author, category, Book ID or barcode.</small></div></div>
 <div class="filters"><input id="bookSearch" placeholder="Search inventory..." oninput="filterBooks()"><select id="catFilter" onchange="filterBooks()"><option value="">All categories</option>${[...new Set(db.books.map(x=>x.category))].map(x=>`<option>${esc(x)}</option>`).join("")}</select></div>
 <div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>ID / Barcode</th><th>Author</th><th>Category</th><th>Available</th><th>Total</th><th>Issued</th><th>Added</th><th>Actions</th></tr></thead><tbody id="bookRows">${bookRowsV5(db.books)}</tbody></table></div></div>`;
}
let v5CatalogAvailability="";
function setCatalogAvailability(v){v5CatalogAvailability=v;document.querySelectorAll('.availability-toggle button').forEach(b=>b.classList.remove('active'));document.getElementById(v==="available"?"avAvailable":v==="unavailable"?"avUnavailable":"avAll")?.classList.add('active');renderV5Catalog()}

function bookQRPayload(b){
  return JSON.stringify({
    type:"library-book",
    version:1,
    bookId:b.bookId||"",
    barcode:b.barcode||b.bookId||"",
    isbn:b.isbn||"",
    title:b.title||"",
    author:b.author||"",
    category:b.category||"",
    available:Number(b.stock||0),
    total:Number(b.total||0),
    rack:b.rack||""
  });
}
function openBookQR(bookId){
  const b=db.books.find(x=>String(x.id)===String(bookId)||x.bookId===bookId);
  if(!b)return toast("Book not found","error");
  modal(`<div class="qr-modal"><div class="panel-head"><div><h2>${esc(b.title)}</h2><p class="muted">${esc(b.author)} · ${esc(b.bookId)}</p></div><span class="badge blue">BOOK QR</span></div>
    <div class="qr-layout"><div class="qr-canvas" id="bookQRCanvas"></div><div class="qr-data"><b>QR contains</b><p>Book ID: ${esc(b.bookId)}</p><p>ISBN: ${esc(b.isbn||"—")}</p><p>Category: ${esc(b.category)}</p><p>Stock: ${b.stock}/${b.total}</p><p>Rack: ${esc(b.rack||"—")}</p><small class="muted">Scan this QR from the Scan & Circulate page to instantly open the complete book record.</small></div></div>
    <div class="form-actions"><button class="ghost" onclick="closeModal()">Close</button><button class="primary" onclick="printBookQR('${esc(b.bookId)}')">Print QR</button></div></div>`);
  setTimeout(()=>{
    const target=document.getElementById("bookQRCanvas");
    if(target && window.QRCode) new QRCode(target,{text:bookQRPayload(b),width:220,height:220,colorDark:"#0f172a",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
  },40);
}
function printBookQR(bookId){
  const b=db.books.find(x=>x.bookId===bookId);if(!b)return;
  const payload=bookQRPayload(b);
  const w=window.open("","_blank","width=520,height=680");if(!w)return toast("Allow popups to print the QR","error");
  w.document.write(`<html><head><title>Book QR — ${esc(b.bookId)}</title><style>body{font-family:Arial;text-align:center;padding:32px;color:#111827}h1{font-size:22px}#qr{display:inline-block;margin:20px}p{margin:6px}</style></head><body><h1>${esc(b.title)}</h1><p>${esc(b.author)}</p><p><b>${esc(b.bookId)}</b> · ${esc(b.category)}</p><div id="qr"></div><p>Scan to view book details</p><script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script><script>new QRCode(document.getElementById('qr'),{text:${JSON.stringify(payload)},width:280,height:280});setTimeout(()=>window.print(),500)<\/script></body></html>`);w.document.close();
}
function generateAllBookQRs(){
  const available=db.books.length;
  modal(`<div><div class="panel-head"><div><h2>Book QR Codes</h2><p class="muted">${available} catalog book(s) have QR-ready records.</p></div></div><div class="qr-grid">${db.books.map(b=>`<div class="qr-mini-card"><div id="qr-${b.id}" class="qr-mini"></div><b>${esc(b.title)}</b><span>${esc(b.bookId)}</span><button class="btn-sm" onclick="printBookQR('${esc(b.bookId)}')">Print</button></div>`).join("")}</div><div class="form-actions"><button class="ghost" onclick="closeModal()">Close</button></div></div>`);
  setTimeout(()=>db.books.forEach(b=>{const el=document.getElementById(`qr-${b.id}`);if(el&&window.QRCode)new QRCode(el,{text:bookQRPayload(b),width:120,height:120});}),50);
}
function renderV5Catalog(){
  const q=(document.getElementById("catalogSearchV5")?.value||"").toLowerCase();
  const arr=db.books.filter(b=>{const m=!q||`${b.title} ${b.author} ${b.category} ${b.bookId} ${b.barcode||""}`.toLowerCase().includes(q);const a=b.stock>0?"available":"unavailable";return m&&(!v5CatalogAvailability||a===v5CatalogAvailability)});
  const box=document.getElementById("v5CatalogList");if(!box)return;
  box.innerHTML=`<div class="catalog-row catalog-head"><div>Book</div><div>Author</div><div>Category</div><div>Stock</div><div>Status</div></div>`+arr.map(b=>`<div class="catalog-row"><div class="catalog-book"><b>${esc(b.title)}</b><span>${esc(b.bookId)} · Barcode: ${esc(b.barcode||b.bookId)}</span></div><div>${esc(b.author)}</div><div><span class="badge blue">${esc(b.category)}</span></div><div class="stock-number">${b.stock}/${b.total}</div><div>${b.stock?'<span class="badge green">Available now</span>':'<span class="badge red">Unavailable</span>'} <button class="btn-sm" onclick="openBookQR(${b.id})">QR</button></div></div>`).join("") || `<div class="empty">No books match this search.</div>`;
}
function bookRowsV5(arr){return arr.map(b=>{const issued=Math.max(0,b.total-b.stock);return `<tr><td><b>${esc(b.title)}</b></td><td><b>${esc(b.bookId)}</b><div class="muted">${esc(b.barcode||b.bookId)}</div></td><td>${esc(b.author)}</td><td>${esc(b.category)}</td><td><span class="badge ${b.stock?'green':'red'}">${b.stock}</span></td><td>${b.total}</td><td>${issued}</td><td>${fmtDate(b.addedAt||today())}</td><td><div class="row-actions">${currentUser.role!=="student"?`<button class="btn-sm primary" onclick="editBook(${b.id})">Edit</button><button class="btn-sm danger" onclick="deleteBook(${b.id})">Remove</button>`:'<span class="muted">Catalog only</span>'}</div></td></tr>`}).join("")||`<tr><td colspan="9" class="empty">No books found</td></tr>`}
function filterBooks(){let q=(document.getElementById("bookSearch")?.value||"").toLowerCase(),c=document.getElementById("catFilter")?.value||"";const rows=document.getElementById("bookRows");if(rows)rows.innerHTML=bookRowsV5(db.books.filter(b=>(!q||Object.values(b).join(" ").toLowerCase().includes(q))&&(!c||b.category===c)))}

function openBookScanner(){route("issue");setTimeout(()=>{document.getElementById("scannerInput")?.focus();document.getElementById("scannerInput")?.scrollIntoView({behavior:"smooth",block:"center"})},120)}
let scanStream=null,scanTimer=null;
function issuePage(){
  const active=db.loans.filter(l=>l.status!=="Returned");
  content.innerHTML=`<div class="page-head"><div><h1>QR & Book Scanner</h1><p>Generate book QR codes and scan them to instantly open the complete book record.</p></div><div class="actions"><button class="ghost" onclick="route('books')">← Back to Catalog</button></div></div>
  <div class="scanner-box panel"><div class="panel-head"><div><h3>Scan a Book QR</h3><small>Scan a library-generated QR code. The encoded book data opens automatically; manual Book ID is always available.</small></div><span class="badge blue">QR SCAN</span></div>
    <div class="scanner-layout">
      <div>
        <div class="scan-frame"><div id="html5-qrcode-reader"></div><video id="scannerVideo" class="scanner-video" autoplay muted playsinline></video></div>
        <div id="scannerStatus" class="scanner-status"><span class="dot"></span><span>Camera is off. Press Start Camera.</span></div>
        <div class="scanner-access"><button class="primary" type="button" onclick="startBarcodeScanner()">Start Camera</button><button class="ghost" type="button" onclick="stopBarcodeScanner()">Stop Camera</button></div>
      </div>
      <div class="scanner-result" id="scannerResult"><h3>Ready to scan</h3><p class="muted">Point the camera at a QR code or barcode. The matching library record will appear here.</p><div class="scanner-controls"><input id="scannerInput" placeholder="Enter Book ID / barcode / ISBN"><button class="primary" type="button" onclick="lookupScannedBook()">Find Book</button><button class="ghost" type="button" onclick="generateAllBookQRs()">Generate QR</button></div><p class="mini-note">Tip: camera scanning works on <b>localhost or HTTPS</b> after browser camera permission is allowed.</p></div>
    </div>
  </div>
  <div class="grid2"><div class="panel"><h3>Issue a Book</h3><p class="muted">Circulate books to either a student or a registered teacher.</p><form id="issueForm"><div class="form-field"><label>Borrower Type</label><select id="issueBorrowerType"><option value="student">Student</option><option value="teacher">Teacher</option></select></div><div class="form-field" style="margin-top:10px"><label>Borrower</label><input id="issueBorrower" list="issueBorrowerList" placeholder="Search student or teacher by ID / name" autocomplete="off" required><datalist id="issueBorrowerList"></datalist><small class="muted">Select Student or Teacher above, then search by name or ID.</small></div><div class="form-field" style="margin-top:10px"><label>Book</label><select id="issueBookSelect" required>${db.books.filter(b=>b.stock>0).map(b=>`<option value="${b.id}">${esc(b.bookId)} — ${esc(b.title)} (${b.stock} available)</option>`).join("")}</select></div><div class="form-field" style="margin-top:10px"><label>Due Date</label><input id="issueDue" type="date" value="${addDays(today(),7)}" required></div><button class="primary full">Confirm Issue</button></form></div>
  <div class="panel"><h3>Return a Book</h3><p class="muted">Scan a book to select its active loan, or choose from the list.</p><select id="returnLoan">${active.map(l=>`<option value="${l.id}">${esc(borrower(l)?.studentId)} — ${esc(book(l.bookId)?.title)} — due ${fmtDate(l.dueDate)}</option>`).join("")}</select><button class="primary full" onclick="returnBook(Number(document.getElementById('returnLoan').value))">Mark as Returned</button></div></div>
  <div class="panel"><div class="panel-head"><h3>Latest Transactions</h3><button class="btn-sm" onclick="route('reports')">Open Report</button></div>${loanTableV5(db.loans.slice().reverse().slice(0,10),true)}</div>`;
  const borrowerTypeEl=document.getElementById("issueBorrowerType");
  const borrowerInput=document.getElementById("issueBorrower");
  const borrowerList=document.getElementById("issueBorrowerList");
  function refreshBorrowerSearch(){
    const type=borrowerTypeEl?.value||"student";
    const people=type==="teacher" ? (db.users||[]).filter(u=>u.role==="teacher"&&u.active!==false) : (db.students||[]);
    borrowerList.innerHTML=people.map(p=>{
      const id=type==="teacher" ? (p.teacherId||p.id) : (p.studentId||p.id);
      return `<option value="${esc(id)} — ${esc(p.name||"")}"></option>`;
    }).join("");
    borrowerInput.value="";
    borrowerInput.placeholder=type==="teacher" ? "Search teacher by ID / name" : "Search student by ID / name";
  }
  borrowerTypeEl?.addEventListener("change",refreshBorrowerSearch);
  refreshBorrowerSearch();
  document.getElementById("issueForm").onsubmit=e=>{e.preventDefault();issueBook()};
}
function lookupScannedBook(raw){
  const rawValue=(raw||document.getElementById("scannerInput")?.value||"").trim();if(!rawValue)return toast("Scan a QR code or enter a Book ID","error");
  let code=rawValue.toLowerCase(), qrData=null; try{const parsed=JSON.parse(rawValue);if(parsed?.type==="library-book"){qrData=parsed;code=String(parsed.bookId||parsed.barcode||parsed.isbn||"").toLowerCase()}}catch(e){}
  const b=db.books.find(x=>(x.bookId||"").toLowerCase()===code||(x.barcode||"").toLowerCase()===code||(x.isbn||"").toLowerCase()===code);
  const box=document.getElementById("scannerResult");if(!box)return;
  if(!b){box.innerHTML=`<h3>Book not found</h3><p class="muted">No catalog record matches <b>${esc(rawValue)}</b>.</p><div class="scanner-controls"><input id="scannerInput" value="${esc(raw||code)}"><button class="primary" onclick="lookupScannedBook()">Search Again</button></div>`;return toast("No book matched that barcode","error")}
  const active=db.loans.find(l=>l.bookId===b.id&&l.status!=="Returned");
  if(active){const s=student(active.studentId);const sel=document.getElementById("returnLoan");if(sel)sel.value=String(active.id);box.innerHTML=`<h3>📕 ${esc(b.title)}</h3><p>${esc(b.author)} · <b>${esc(b.bookId)}</b></p><p class="mini-note">Category: ${esc(b.category)} · ISBN: ${esc(b.isbn||"—")} · Rack: ${esc(b.rack||"—")}</p><p>${statusBadge(active.status)} &nbsp; Issued to <b>${esc(s?.name||"Unknown")}</b> (${esc(s?.studentId||"")})</p><p class="mini-note">Due ${fmtDate(active.dueDate)} · Current fine ₹${active.fine||0}</p><button class="primary" onclick="returnBook(${active.id})">Return This Book</button>`;
  }else{const sel=document.getElementById("issueBookSelect");if(sel)sel.value=String(b.id);box.innerHTML=`<h3>📗 ${esc(b.title)}</h3><p>${esc(b.author)} · <b>${esc(b.bookId)}</b></p><p class="mini-note">Category: ${esc(b.category)} · ISBN: ${esc(b.isbn||"—")} · Rack: ${esc(b.rack||"—")}</p><p><span class="badge green">${b.stock} available</span> of ${b.total} copies</p><p class="mini-note">Book selected for issue. Choose the borrower (student or teacher) and confirm issue below.</p><button class="primary" onclick="document.getElementById('issueForm').scrollIntoView({behavior:'smooth'})">Continue to Issue</button>`;}
  if(document.getElementById("scannerInput"))document.getElementById("scannerInput").value=b.barcode||b.bookId;
}
let html5Scanner=null;
let scannerStarting=false;
function setScannerStatus(message,type=""){const el=document.getElementById("scannerStatus");if(!el)return;el.className=`scanner-status ${type}`;el.innerHTML=`<span class="dot"></span><span>${esc(message)}</span>`}
async function startBarcodeScanner(){
  if(scannerStarting)return;
  if(html5Scanner){setScannerStatus("Scanner is already running.","ready");return}
  if(!window.isSecureContext && location.hostname!=="localhost" && location.hostname!=="127.0.0.1"){
    setScannerStatus("Camera needs HTTPS or localhost. Use manual scan below.","error");
    return toast("Open this project through Live Server/localhost for camera access.","error");
  }
  if(!window.Html5Qrcode){setScannerStatus("Scanner library did not load. Use manual Book ID/barcode.","error");return toast("QR scanner library is unavailable. Manual scan is ready.","error")}
  scannerStarting=true;setScannerStatus("Requesting camera permission…");
  try{
    html5Scanner=new Html5Qrcode("html5-qrcode-reader");
    const config={fps:10,qrbox:{width:240,height:240},aspectRatio:1.7777778,disableFlip:false};
    await html5Scanner.start({facingMode:{ideal:"environment"}},config,(decodedText)=>{
      lookupScannedBook(decodedText);setScannerStatus(`Scanned: ${decodedText}`,"ready");stopBarcodeScanner(true);
    },()=>{});
    setScannerStatus("Camera active — point at a QR code or barcode.","ready");
    toast("Camera scanner started","success");
  }catch(err){
    if(html5Scanner){try{await html5Scanner.clear()}catch(e){}}html5Scanner=null;
    setScannerStatus("Camera could not start. Check browser permission or use manual scan.","error");
    toast("Camera unavailable. Use the Book ID/barcode field instead.","error");
  }finally{scannerStarting=false}
}
function stopBarcodeScanner(silent=false){
  if(scanTimer)cancelAnimationFrame(scanTimer);scanTimer=null;
  if(html5Scanner){const scanner=html5Scanner;html5Scanner=null;scanner.stop().catch(()=>{}).finally(()=>scanner.clear().catch(()=>{}))}
  if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null}
  const v=document.getElementById("scannerVideo");if(v){v.srcObject=null;v.style.display="none"}
  if(!silent)setScannerStatus("Camera stopped. Manual Book ID/barcode scan is available.");
}

function loanTableV5(arr){
 if(!arr.length)return `<div class="empty">No borrowing records.</div>`;
 const studentView=currentUser?.role==='student';
 return `<div class="table-wrap"><table class="data-table"><thead><tr>${studentView?'':'<th>Student</th>'}<th>Book</th><th>Issue Date</th><th>Time</th><th>Due Date</th><th>Return Date</th><th>Status</th><th>Fine</th>${studentView?'':'<th>Actions</th>'}</tr></thead><tbody>${arr.map(l=>{
   const cls=l.status==="Overdue"?"overdue-highlight":(l.dueDate<=today()&&l.status!=="Returned"?"due-highlight":"");
   const ownBook=studentView?`<td><b>${esc(book(l.bookId)?.title)}</b></td>`:`<td><b>${esc(borrower(l)?.name)}</b><div class="muted">${esc(borrower(l)?.studentId)}</div></td><td>${esc(book(l.bookId)?.title)}</td>`;
   const fine=`<td>₹${Number(l.fine)||0}</td>`;
   const actions=studentView?'':`<td><div class="row-actions">${l.status!=="Returned"?`<button class="btn-sm primary" onclick="editDueDate(${l.id})">Due Date</button>`:""}</div></td>`;
   return `<tr class="${cls}">${ownBook}<td>${fmtDate(l.issueDate)}</td><td>${esc(l.issueTime)}</td><td>${fmtDate(l.dueDate)}</td><td>${fmtDate(l.returnDate)}</td><td>${statusBadge(l.status)}</td>${fine}${actions}</tr>`;
 }).join("")}</tbody></table></div>`
}
function updateLoanFine(id,value){toast("Fine is calculated automatically from the due date","error")}
function clearLoanFine(id){toast("Fine is calculated automatically from the due date","error")}
function editDueDate(id){const l=db.loans.find(x=>x.id===id);if(!l)return;modal(`<h2>Edit Due Date</h2><p class="muted">Update the due date for this active loan.</p><form id="dueEditForm"><div class="form-field"><label>New due date</label><input id="newDue" type="date" value="${esc(l.dueDate)}" required></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Save</button></div></form>`);document.getElementById("dueEditForm").onsubmit=e=>{e.preventDefault();l.dueDate=newDue.value;l.status=dueStatus(l);saveDB();addAudit(`Changed due date for loan ${id}`);closeModal();toast("Due date updated","success");duePage()}}
function duePage(){
  normalizeStatuses();let active=db.loans.filter(l=>l.status!=="Returned"),overdue=active.filter(l=>l.status==="Overdue"),soon=active.filter(l=>{const d=(new Date(l.dueDate)-new Date(today()))/864e5;return d>=0&&d<=1}),fine=active.reduce((a,l)=>a+(Number(l.fine)||0),0);
  content.innerHTML=`<div class="page-head"><div><h1>Due & Overdue</h1><p>Automatic one-day-before reminders, editable due dates and fines based only on overdue days.</p></div><div class="actions"><button class="ghost" onclick="runReminderCheck()">🔔 Run Reminder Check</button></div></div>
  <div class="kpis"><div class="kpi"><div class="label">DUE TODAY / TOMORROW</div><div class="value">${soon.length}</div></div><div class="kpi"><div class="label">OVERDUE</div><div class="value">${overdue.length}</div></div><div class="kpi"><div class="label">EST. FINES</div><div class="value">₹${fine}</div></div></div>
  <div class="panel"><div class="panel-head"><div><h3>Live Due & Overdue Records</h3><small>Change fine to any amount, clear it, or extend an active due date.</small></div><span class="badge ${overdue.length?'red':'green'}">${overdue.length?overdue.length+" overdue":"No overdue"}</span></div>${loanTableV5(active)}</div>`;
}
function addFineQuick(){toast("Fine is added automatically when a book becomes overdue","error")}

function schedulePage(){
  if(!db.schedule)db.schedule={windows:[],milestones:[]};
  if(currentUser.role==="student"){content.innerHTML=`<div class="page-head"><div><h1>Semester Calendar</h1><p>Important academic dates and university reading milestones.</p></div></div><div class="panel"><div class="panel-head"><div><h3>Semester Milestones</h3><small>Stay ahead of reading weeks, assessments and examinations.</small></div></div>${db.schedule.milestones.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(m=>`<div class="schedule-row"><div><b>${esc(m.title)}</b></div><div><span class="badge blue">${fmtDate(m.date)}</span></div><div class="muted">Academic milestone</div></div>`).join("")||'<div class="empty">No milestones published.</div>'}</div>`;return;} 
  content.innerHTML=`<div class="page-head"><div><h1>Academic Schedule</h1><p>Semester calendar and library operating windows — fully editable.</p></div><button class="primary" onclick="addScheduleMilestone()">+ Add Milestone</button></div>
  <div class="panel"><div class="panel-head"><div><h3>Library Operating Windows</h3><small>Add or remove days, hours and service notes.</small></div><button class="btn-sm primary" onclick="addScheduleWindow()">+ Add Window</button></div>${db.schedule.windows.map(w=>`<div class="schedule-row"><div><b>${esc(w.day)}</b></div><div>${esc(w.time)}</div><div class="muted">${esc(w.label)}</div><div class="row-actions"><button class="btn-sm primary" onclick="editScheduleWindow(${w.id})">Edit</button><button class="btn-sm danger" onclick="removeScheduleWindow(${w.id})">Remove</button></div></div>`).join("")||'<div class="empty">No operating windows.</div>'}</div>
  <div class="panel"><div class="panel-head"><div><h3>Semester Milestones</h3><small>Dates update instantly across the dashboard schedule.</small></div></div>${db.schedule.milestones.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(m=>`<div class="schedule-row"><div><b>${esc(m.title)}</b></div><div><span class="badge blue">${fmtDate(m.date)}</span></div><div class="muted">Semester event</div><div class="row-actions"><button class="btn-sm primary" onclick="editScheduleMilestone(${m.id})">Edit</button><button class="btn-sm danger" onclick="removeScheduleMilestone(${m.id})">Remove</button></div></div>`).join("")||'<div class="empty">No milestones.</div>'}</div>`;
}
function addScheduleWindow(){modal(`<h2>Add Operating Window</h2><form id="windowForm"><div class="form-grid"><div class="form-field"><label>Day / period</label><input id="swDay" placeholder="Mon–Fri" required></div><div class="form-field"><label>Time</label><input id="swTime" placeholder="08:30 – 18:00" required></div><div class="form-field"><label>Service label</label><input id="swLabel" placeholder="Library Open" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Add</button></div></form></div>`);document.getElementById("windowForm").onsubmit=e=>{e.preventDefault();db.schedule.windows.push({id:Date.now(),day:swDay.value.trim(),time:swTime.value.trim(),label:swLabel.value.trim()});saveDB();closeModal();toast("Operating window added","success");schedulePage()}}
function editScheduleWindow(id){const w=db.schedule.windows.find(x=>x.id===id);modal(`<h2>Edit Operating Window</h2><form id="windowEdit"><div class="form-grid"><div class="form-field"><label>Day / period</label><input id="ewDay" value="${esc(w.day)}" required></div><div class="form-field"><label>Time</label><input id="ewTime" value="${esc(w.time)}" required></div><div class="form-field"><label>Service label</label><input id="ewLabel" value="${esc(w.label)}" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Save</button></div></form></div>`);document.getElementById("windowEdit").onsubmit=e=>{e.preventDefault();w.day=ewDay.value.trim();w.time=ewTime.value.trim();w.label=ewLabel.value.trim();saveDB();closeModal();toast("Operating window updated","success");schedulePage()}}
function removeScheduleWindow(id){if(!confirm("Remove this operating window?"))return;db.schedule.windows=db.schedule.windows.filter(x=>x.id!==id);saveDB();toast("Operating window removed","success");schedulePage()}
function addScheduleMilestone(){modal(`<h2>Add Semester Milestone</h2><form id="mileForm"><div class="form-grid"><div class="form-field"><label>Milestone</label><input id="smTitle" required></div><div class="form-field"><label>Date</label><input id="smDate" type="date" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Add</button></div></form></div>`);document.getElementById("mileForm").onsubmit=e=>{e.preventDefault();db.schedule.milestones.push({id:Date.now(),title:smTitle.value.trim(),date:smDate.value});saveDB();closeModal();toast("Milestone added","success");schedulePage()}}
function editScheduleMilestone(id){const m=db.schedule.milestones.find(x=>x.id===id);modal(`<h2>Edit Semester Milestone</h2><form id="mileEdit"><div class="form-grid"><div class="form-field"><label>Milestone</label><input id="emTitle" value="${esc(m.title)}" required></div><div class="form-field"><label>Date</label><input id="emDate" type="date" value="${esc(m.date)}" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Save</button></div></form></div>`);document.getElementById("mileEdit").onsubmit=e=>{e.preventDefault();m.title=emTitle.value.trim();m.date=emDate.value;saveDB();closeModal();toast("Milestone updated","success");schedulePage()}}
function removeScheduleMilestone(id){if(!confirm("Remove this milestone?"))return;db.schedule.milestones=db.schedule.milestones.filter(x=>x.id!==id);saveDB();toast("Milestone removed","success");schedulePage()}

function legacyDashboard(){
  if(currentUser.role==="student")return studentDashboard();
  const active=db.loans.filter(l=>l.status!=="Returned"), overdue=active.filter(l=>l.status==="Overdue"), recentBooks=db.books.slice().sort((a,b)=>(b.addedAt||"").localeCompare(a.addedAt||"")).slice(0,5);
  content.innerHTML=`<div class="page-head"><div><h1>Good morning, ${esc(currentUser.name.split(" ")[0])} 👋</h1><p>Live university library command center.</p></div><div class="actions"><button class="primary" onclick="route('reports')">▥ Generate Report</button></div></div>
  <div class="kpis"><div class="kpi"><div class="label">TOTAL STUDENTS</div><div class="value">${db.students.length}</div><div class="trend">Live central records</div></div><div class="kpi"><div class="label">BOOK TITLES</div><div class="value">${db.books.length}</div><div class="trend">${db.books.reduce((a,b)=>a+b.total,0)} total copies</div></div><div class="kpi"><div class="label">OVERDUE + FINES</div><div class="value">${overdue.length}</div><div class="trend" style="color:${overdue.length?'#dc2626':'#15803d'}">₹${active.reduce((a,l)=>a+(l.fine||0),0)} active fines</div></div></div>
  <div class="grid2"><div class="panel analytics-card"><div class="panel-head"><div><h3>Borrowing distribution</h3><small>Interactive pie chart — hover a slice for book name + borrower count.</small></div></div><div class="chart-box"><canvas id="bookPieChart"></canvas></div></div><div class="panel analytics-card"><div class="panel-head"><div><h3>Monthly borrowing presentation</h3><small>Borrowed, returned and overdue activity by month.</small></div></div><div class="chart-box"><canvas id="monthlyStatusChart"></canvas></div></div></div>
  <div class="panel"><div class="panel-head"><div><h3>Online Catalog</h3><small>Search + availability toggle. Students and staff see the same live stock.</small></div><button class="btn-sm primary" onclick="route('books')">Open Catalog</button></div><div class="catalog-toolbar"><input class="search-wide" id="dashboardBookSearch" placeholder="🔎 Search books..." oninput="renderDashboardAvailabilityV5()"><div class="availability-toggle"><button class="active" id="dAll" onclick="setDashboardAvailability('')">All</button><button id="dAvail" onclick="setDashboardAvailability('available')">Available</button><button id="dUnavail" onclick="setDashboardAvailability('unavailable')">Unavailable</button></div></div><div id="dashboardAvailability" class="catalog-list" style="margin-top:14px"></div></div>
  <div class="grid2"><div class="panel"><div class="panel-head"><div><h3>Newly Added Books</h3><small>Updates instantly after a book is added.</small></div><button class="btn-sm" onclick="route('books')">Manage</button></div>${recentBooks.map(newBookCard).join("")}</div><div class="panel"><div class="panel-head"><h3>Academic Schedule</h3><button class="btn-sm" onclick="route('schedule')">Edit Schedule</button></div>${(db.schedule?.milestones||[]).slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4).map(m=>`<div class="stat-line"><b>${esc(m.title)}</b><span>${fmtDate(m.date)}</span></div>`).join("")}</div></div>`;
  renderV5DashboardCharts();renderDashboardAvailabilityV5();
}
let v5DashboardAvailability="";
function setDashboardAvailability(v){v5DashboardAvailability=v;document.querySelectorAll('.panel .availability-toggle button').forEach(b=>b.classList.remove('active'));document.getElementById(v==="available"?"dAvail":v==="unavailable"?"dUnavail":"dAll")?.classList.add('active');renderDashboardAvailabilityV5()}
function renderDashboardAvailabilityV5(){const q=(document.getElementById("dashboardBookSearch")?.value||"").toLowerCase(),box=document.getElementById("dashboardAvailability");if(!box)return;const arr=db.books.filter(b=>(!q||`${b.title} ${b.author} ${b.category} ${b.bookId}`.toLowerCase().includes(q))&&(!v5DashboardAvailability||(b.stock>0?"available":"unavailable")===v5DashboardAvailability));box.innerHTML=`<div class="catalog-row catalog-head"><div>Book</div><div>Author</div><div>Category</div><div>Stock</div><div>Status</div></div>`+arr.map(b=>`<div class="catalog-row"><div class="catalog-book"><b>${esc(b.title)}</b><span>${esc(b.bookId)}</span></div><div>${esc(b.author)}</div><div><span class="badge blue">${esc(b.category)}</span></div><div class="stock-number">${b.stock}/${b.total}</div><div>${b.stock?'<span class="badge green">Available now</span>':'<span class="badge red">Unavailable</span>'} <button class="btn-sm" onclick="openBookQR(${b.id})">QR</button></div></div>`).join("")||`<div class="empty">No books found.</div>`}
function renderV5DashboardCharts(){
 if(!window.Chart)return;
 const counts=db.books.map(b=>({name:b.title,count:db.loans.filter(l=>l.bookId===b.id).length})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);
 if(chartRefs.pie)chartRefs.pie.destroy();chartRefs.pie=new Chart(document.getElementById("bookPieChart"),{type:"doughnut",data:{labels:counts.map(x=>x.name),datasets:[{data:counts.map(x=>x.count)}]},options:{responsive:true,maintainAspectRatio:false,cutout:"58%",plugins:{legend:{position:"right",labels:{font:{size:12},boxWidth:13}},tooltip:{callbacks:{label:c=>` ${c.label}: ${c.raw} borrower${c.raw===1?"":"s"}`}}}}});
 const months=[];const base=new Date();base.setDate(1);for(let i=5;i>=0;i--){const d=new Date(base.getFullYear(),base.getMonth()-i,1);months.push({key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,label:d.toLocaleDateString("en-IN",{month:"short",year:"numeric"})})}
 const monthly=months.map(m=>{const tx=db.loans.filter(l=>String(l.issueDate||"").slice(0,7)===m.key);return{month:m.label,borrowed:tx.length,returned:tx.filter(l=>l.status==="Returned").length,overdue:tx.filter(l=>l.status==="Overdue").length}});
 if(chartRefs.month)chartRefs.month.destroy();chartRefs.month=new Chart(document.getElementById("monthlyStatusChart"),{type:"bar",data:{labels:monthly.map(x=>x.month),datasets:[{label:"Borrowed",data:monthly.map(x=>x.borrowed)},{label:"Returned",data:monthly.map(x=>x.returned)},{label:"Overdue",data:monthly.map(x=>x.overdue)}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{stacked:false},y:{beginAtZero:true,ticks:{precision:0}}},plugins:{tooltip:{callbacks:{label:c=>` ${c.dataset.label}: ${c.raw}`}}}}});
}

function editBook(id){
 const b=book(id);modal(`<h2>Edit Book</h2><p class="muted">Update metadata, copy count and barcode used by the scanner.</p><form id="editBookForm"><div class="form-grid"><div class="form-field"><label>Book ID</label><input id="ebId" value="${esc(b.bookId)}" required></div><div class="form-field"><label>Barcode / ISBN</label><input id="ebBarcode" value="${esc(b.barcode||b.bookId)}" required></div><div class="form-field"><label>Title</label><input id="ebTitle" value="${esc(b.title)}" required></div><div class="form-field"><label>Author</label><input id="ebAuthor" value="${esc(b.author)}" required></div><div class="form-field"><label>Category</label><input id="ebCat" value="${esc(b.category)}" required></div><div class="form-field"><label>Rack</label><select id="ebRack">${libraryRacks().map(r=>`<option value="${esc(r)}" ${r===(b.rack||"A-01")?"selected":""}>${esc(r)}</option>`).join("")}</select></div><div class="form-field"><label>Available Copies</label><input id="ebStock" type="number" min="0" value="${b.stock}" required></div><div class="form-field"><label>Total Copies</label><input id="ebTotal" type="number" min="${Math.max(1,b.total-b.stock)}" value="${b.total}" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Save Book</button></div></form></div>`);document.getElementById("editBookForm").onsubmit=e=>{e.preventDefault();let total=+ebTotal.value,stock=+ebStock.value;if(stock>total)return toast("Available copies cannot exceed total copies","error");if(db.books.some(x=>x.id!==id&&x.bookId.toLowerCase()===ebId.value.trim().toLowerCase()))return toast("Book ID already exists","error");b.bookId=ebId.value.trim();b.barcode=ebBarcode.value.trim();b.title=ebTitle.value.trim();b.author=ebAuthor.value.trim();b.category=ebCat.value.trim();b.rack=ebRack.value;b.stock=stock;b.total=total;saveDB();addAudit(`Updated book ${b.bookId}`);closeModal();toast("Book updated","success");booksPage()};
}
function bookModal(){modal(`<h2>Add Book</h2><p class="muted">The barcode can be the ISBN, printed barcode value, or Book ID for this demo.</p><form id="bookForm"><div class="form-grid"><div class="form-field"><label>Book ID</label><input id="bId" required></div><div class="form-field"><label>Barcode / ISBN</label><input id="bBarcode" placeholder="Defaults to Book ID"></div><div class="form-field"><label>Title</label><input id="bTitle" required></div><div class="form-field"><label>Author</label><input id="bAuthor" required></div><div class="form-field"><label>Category</label><input id="bCat" required></div><div class="form-field"><label>Rack</label><select id="bRack">${libraryRacks().map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join("")}</select></div><div class="form-field"><label>Available Copies</label><input id="bStock" type="number" min="0" value="1" required></div><div class="form-field"><label>Total Copies</label><input id="bTotal" type="number" min="1" value="1" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Add Book</button></div></form></div>`);document.getElementById("bookForm").onsubmit=e=>{e.preventDefault();let total=+bTotal.value,stock=+bStock.value;if(stock>total)return toast("Available copies cannot exceed total copies","error");if(db.books.some(x=>x.bookId.toLowerCase()===bId.value.trim().toLowerCase()))return toast("Book ID already exists","error");db.books.push({id:Date.now(),bookId:bId.value.trim(),barcode:(bBarcode.value.trim()||bId.value.trim()),title:bTitle.value.trim(),author:bAuthor.value.trim(),category:bCat.value.trim(),rack:bRack.value,stock,total,addedAt:today()});saveDB();addAudit(`Added book ${bId.value}`);closeModal();toast("Book added — catalog and dashboard updated","success");booksPage()}}

/* Theme button is available from every dashboard page. */
const themeBtnEl=document.getElementById("themeBtn");if(themeBtnEl){themeBtnEl.onclick=()=>toggleTheme(document.body.classList.contains("dark-mode")?"light":"dark");themeBtnEl.textContent=document.body.classList.contains("dark-mode")?"☀":"☾"}

/* ========================= SMART LIBRARY PRODUCT LAYER ========================= */
function ensureV8Data(){
  db.users ||= [];
  if(!db.users.some(u=>String(u.email||"").toLowerCase()==="teacher@university.edu")){
    const nextId=Math.max(0,...db.users.map(u=>Number(u.id)||0))+1;
    db.users.push({id:nextId,email:"teacher@university.edu",password:"teacher123",role:"teacher",name:"Dr. Priya Sharma",teacherId:"TCH2026001",department:"Computer Science & AI",semester:"Faculty",mobile:"9876543211",active:true});
  }
  db.reservations ||= [];
  db.reservations = db.reservations.map(r=>({status:"Waiting",createdAt:today(),...r}));
  db.schedule ||= {windows:[{id:1,day:"Mon–Fri",time:"08:30 – 18:00",label:"Library Open"},{id:2,day:"Saturday",time:"09:00 – 14:00",label:"Limited Services"},{id:3,day:"Reminder",time:"08:00 daily",label:"Due-date scan"}],milestones:[{id:1,title:"Mid-semester reading week",date:"2026-10-05"},{id:2,title:"Internal assessments",date:"2026-10-19"},{id:3,title:"End semester preparation",date:"2026-11-09"},{id:4,title:"Final examinations",date:"2026-11-23"}]};
  db.books.forEach(b=>{b.barcode ||= b.bookId;b.rack ||= "A-01";b.isbn ||= b.barcode;});
  saveDB();
}
ensureV8Data();

function v8NavButton(id,icon,label){return `<button class="nav-item" data-page="${id}"><span>${icon}</span>${label}</button>`}
function buildNav(){
  const studentRole=currentUser.role==="student";
  const groups=studentRole ? [
    ["Workspace",[["dashboard","⌂","Dashboard"],["my-books","▣","My Books"],["catalog","▤","Book Catalog"],["online-books","◎","Online Discovery"],["schedule","□","Semester Calendar"]]],
    ["Personal",[["notifications","♢","Notifications"],["reports","▥","My Reports"],["account","◎","My Account"]]]
  ] : [
    ["Workspace",[["dashboard","⌂","Dashboard"],["books","▤","Library Catalog"],["online-books","◎","Online Discovery"],["issue","⇄","Scan & Circulate"],["students","♙","Students"]]],
    ["Operations",[["due","◷","Due & Fines"],["notifications","♢","Notifications"],["schedule","□","Academic Calendar"]]],
    ["Insights",[["analytics","◌","Analytics Studio"],["floor-map","⌗","Library Map"]]],
    ["Management",[["reports","▥","Reports Center"],["activity","•","Activity Log"],["print-center","▤","Print Center"],["settings","⚙","Settings"]]]
  ];
  nav.innerHTML=groups.map(g=>`<div class="nav-group"><div class="nav-group-label">${g[0]}</div>${g[1].map(x=>v8NavButton(...x)).join("")}</div>`).join("");
  document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.onclick=()=>{route(b.dataset.page);sidebar.classList.remove("open")});
}

function route(page){
  // Students may only view their own portal data. Never expose staff-only Due & Fines.
  if(currentUser?.role==='student' && ['due','issue','students','analytics','activity','settings','print-center','reports'].includes(page)){
    if(page==='reports'){ /* My Reports is allowed below through the dedicated page */ }
    else { page='dashboard'; }
  }
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
  document.querySelectorAll(".nav-item[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  const pages={dashboard,students:studentsPage,books:booksPage,issue:issuePage,due:duePage,notifications:notificationsPage,reports:reportsPage,dataset:datasetPage,schedule:schedulePage,settings:settingsPage,"my-books":myBooksPage,catalog:catalogPage,account:accountPage,analytics:v8AnalyticsPage,"floor-map":v8FloorMapPage,"print-center":v8PrintCenterPage,activity:v8ActivityPage};
  (pages[page]||dashboard)();document.scrollingElement?.scrollTo({top:0,behavior:"smooth"});
}

function v8PageHead(title,subtitle,actions=""){return `<div class="page-head v8-head"><div><div class="eyebrow">SMART LIBRARY</div><h1>${title}</h1><p>${subtitle}</p></div><div class="actions">${actions}</div></div>`}
function v8Metric(label,value,meta,cls=""){return `<div class="kpi v8-kpi ${cls}"><div class="label">${label}</div><div class="value">${value}</div><div class="trend">${meta}</div></div>`}

function v8AnalyticsPage(){
  const active=db.loans.filter(l=>l.status!=="Returned"), overdue=active.filter(l=>l.status==="Overdue"), total= db.books.reduce((a,b)=>a+b.total,0), available=db.books.reduce((a,b)=>a+b.stock,0);
  content.innerHTML=v8PageHead("Analytics Studio","Decision-ready library analytics with live browser data.",`<button class="ghost" onclick="route('reports')">Open Reports</button>`)+
  `<div class="kpis">${v8Metric("TOTAL TITLES",db.books.length,"Catalog records")}${v8Metric("TOTAL COPIES",total,"Across all titles")}${v8Metric("AVAILABLE",available,"Ready to issue","good")}${v8Metric("OVERDUE",overdue.length,"Needs attention",overdue.length?"risk":"")}</div>
  <div class="analytics-grid"><div class="panel chart-panel"><div class="panel-head"><div><h3>Borrowing by book</h3><small>Hover for exact transaction count.</small></div><span class="badge blue">LIVE</span></div><div class="chart-box tall"><canvas id="v8BookChart"></canvas></div></div>
  <div class="panel chart-panel"><div class="panel-head"><div><h3>Circulation status</h3><small>Borrowed, returned and overdue.</small></div><span class="badge blue">6 MONTHS</span></div><div class="chart-box tall"><canvas id="v8MonthlyChart"></canvas></div></div></div>
  <div class="grid3"><div class="panel"><h3>Category demand</h3><div id="v8CategoryStats">${v8CategoryStats()}</div></div><div class="panel"><h3>Top borrowers</h3><div id="v8TopStudents">${v8TopBorrowers()}</div></div><div class="panel"><h3>Inventory health</h3><div>${v8InventoryHealth()}</div></div></div>`;
  setTimeout(v8RenderAnalyticsCharts,0);
}
function v8CategoryStats(){const m={};db.loans.forEach(l=>{const b=book(l.bookId);if(b)m[b.category]=(m[b.category]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([k,v])=>`<div class="stat-line"><b>${esc(k)}</b><span>${v} transactions</span></div>`).join("")||`<div class="empty">No transactions yet.</div>`}
function v8TopBorrowers(){const m={};db.loans.forEach(l=>{m[l.studentId]=(m[l.studentId]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([id,v])=>{const s=student(id);return `<div class="person-row"><div class="avatar small">${esc((s?.name||"?")[0])}</div><div><b>${esc(s?.name||"Unknown")}</b><span>${esc(s?.studentId||"")}</span></div><strong>${v}</strong></div>`}).join("")||`<div class="empty">No borrowers yet.</div>`}
function v8InventoryHealth(){const total=db.books.reduce((a,b)=>a+b.total,0),available=db.books.reduce((a,b)=>a+b.stock,0),low=db.books.filter(b=>b.stock<=1).length;return `<div class="health-number">${total?Math.round(available/total*100):0}%</div><p class="muted">copies available</p><div class="progress"><span style="width:${total?available/total*100:0}%"></span></div><div class="stat-line"><b>Low stock</b><span>${low} titles</span></div><div class="stat-line"><b>Issued</b><span>${total-available} copies</span></div>`}
function v8RenderAnalyticsCharts(){if(!window.Chart)return;const labels=db.books.map(b=>b.title),counts=db.books.map(b=>db.loans.filter(l=>l.bookId===b.id).length);if(chartRefs.v8b)chartRefs.v8b.destroy();chartRefs.v8b=new Chart(document.getElementById("v8BookChart"),{type:"doughnut",data:{labels,datasets:[{data:counts}]},options:{responsive:true,maintainAspectRatio:false,cutout:"62%",plugins:{legend:{position:"right"},tooltip:{callbacks:{label:c=>` ${c.label}: ${c.raw} borrower${c.raw===1?"":"s"}`}}}}});const months=[];const base=new Date();base.setDate(1);for(let i=5;i>=0;i--){const d=new Date(base.getFullYear(),base.getMonth()-i,1);months.push({key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,label:d.toLocaleDateString("en-IN",{month:"short"})})}const vals=months.map(m=>{const x=db.loans.filter(l=>String(l.issueDate).slice(0,7)===m.key);return [x.length,x.filter(l=>l.status==="Returned").length,x.filter(l=>l.status==="Overdue").length]});if(chartRefs.v8m)chartRefs.v8m.destroy();chartRefs.v8m=new Chart(document.getElementById("v8MonthlyChart"),{type:"bar",data:{labels:months.map(x=>x.label),datasets:[{label:"Borrowed",data:vals.map(x=>x[0])},{label:"Returned",data:vals.map(x=>x[1])},{label:"Overdue",data:vals.map(x=>x[2])}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,ticks:{precision:0}}}}})}

function v8ReservationsPage(){
  const isStudent=currentUser.role==="student", mine=isStudent?db.reservations.filter(r=>r.studentId===currentUser.studentId):db.reservations;
  content.innerHTML=v8PageHead("Reservations","Reserve unavailable books and manage the waiting queue.",isStudent?`<button class="primary" onclick="v8ReserveModal()">+ Reserve a Book</button>`:`<button class="ghost" onclick="v8ReserveModal()">+ Add Reservation</button>`)+
  `<div class="grid3">${v8Metric("ACTIVE RESERVATIONS",mine.filter(r=>r.status==="Waiting").length,"Waiting in queue")}${v8Metric("AVAILABLE NOW",db.reservations.filter(r=>r.status==="Ready").length,"Ready for pickup")}${v8Metric("FULFILLED",db.reservations.filter(r=>r.status==="Fulfilled").length,"Completed reservations")}</div><div class="panel"><div class="filters"><input id="resSearch" placeholder="Search book or student..." oninput="v8FilterReservations()"><select id="resStatus" onchange="v8FilterReservations()"><option value="">All statuses</option><option>Waiting</option><option>Ready</option><option>Fulfilled</option><option>Cancelled</option></select></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Student</th><th>Requested</th><th>Position</th><th>Status</th><th>Actions</th></tr></thead><tbody id="resRows">${v8ReservationRows(mine)}</tbody></table></div></div>`;
}
function v8ReservationRows(arr){return arr.map(r=>{const b=book(r.bookId),s=student(r.studentId),pos=db.reservations.filter(x=>x.bookId===r.bookId&&x.status==="Waiting"&&x.createdAt<=r.createdAt).length;return `<tr><td><b>${esc(b?.title||"Unknown")}</b><div class="muted">${esc(b?.bookId||"")}</div></td><td>${esc(s?.name||"Unknown")}</td><td>${fmtDate(r.createdAt)}</td><td>${r.status==="Waiting"?`#${pos}`:"—"}</td><td>${statusBadge(r.status)}</td><td><div class="row-actions">${r.status==="Waiting"&&currentUser.role!=="student"?`<button class="btn-sm primary" onclick="v8MarkReady(${r.id})">Mark Ready</button>`:""}${r.status==="Ready"?`<button class="btn-sm primary" onclick="v8FulfillReservation(${r.id})">Fulfill</button>`:""}${r.status==="Waiting"||r.status==="Ready"?`<button class="btn-sm danger" onclick="v8CancelReservation(${r.id})">Cancel</button>`:""}</div></td></tr>`}).join("")||`<tr><td colspan="6" class="empty">No reservations found.</td></tr>`}
function v8FilterReservations(){const q=(document.getElementById("resSearch")?.value||"").toLowerCase(),st=document.getElementById("resStatus")?.value||"",arr=(currentUser.role==="student"?db.reservations.filter(r=>r.studentId===currentUser.studentId):db.reservations).filter(r=>{const b=book(r.bookId),s=student(r.studentId);return (!q||`${b?.title} ${b?.bookId} ${s?.name} ${s?.studentId}`.toLowerCase().includes(q))&&(!st||r.status===st)});document.getElementById("resRows").innerHTML=v8ReservationRows(arr)}
function v8ReserveModal(){const books=db.books.filter(b=>b.stock===0);const students=currentUser.role==="student"?[getCurrentStudent()]:db.students;modal(`<h2>Create Reservation</h2><p class="muted">Reserve a book when no copy is currently available.</p><form id="resForm"><div class="form-grid"><div class="form-field"><label>Book</label><select id="resBook" required>${(books.length?books:db.books).map(b=>`<option value="${b.id}">${esc(b.bookId)} — ${esc(b.title)} ${b.stock?"(available)":"(unavailable)"}</option>`).join("")}</select></div><div class="form-field"><label>Student</label><select id="resStudent" ${currentUser.role==="student"?"disabled":""}>${students.filter(Boolean).map(s=>`<option value="${s.id}">${esc(s.studentId)} — ${esc(s.name)}</option>`).join("")}</select></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Create Reservation</button></div></form></div>`);document.getElementById("resForm").onsubmit=e=>{e.preventDefault();const sid=currentUser.role==="student"?getCurrentStudent().id:+resStudent.value,bid=+resBook.value;if(db.reservations.some(r=>r.studentId===sid&&r.bookId===bid&&["Waiting","Ready"].includes(r.status)))return toast("This student already has an active reservation","error");db.reservations.push({id:Date.now(),studentId:sid,bookId:bid,status:"Waiting",createdAt:today()});saveDB();addAudit("Created book reservation");closeModal();toast("Reservation created","success");v8ReservationsPage()}}
function v8MarkReady(id){const r=db.reservations.find(x=>x.id===id);if(!r)return;r.status="Ready";saveDB();addAudit("Marked reservation ready");toast("Reservation marked ready","success");v8ReservationsPage()}
function v8FulfillReservation(id){const r=db.reservations.find(x=>x.id===id);if(!r)return;r.status="Fulfilled";saveDB();addAudit("Fulfilled book reservation");toast("Reservation fulfilled","success");v8ReservationsPage()}
function v8CancelReservation(id){const r=db.reservations.find(x=>x.id===id);if(!r)return;r.status="Cancelled";saveDB();addAudit("Cancelled book reservation");toast("Reservation cancelled","success");v8ReservationsPage()}

function v8ActivityPage(){const rows=db.audit.slice(0,80);content.innerHTML=v8PageHead("Activity Log","A transparent timeline of important library actions.",`<button class="ghost" onclick="v8ExportActivity()">Export CSV</button>`)+`<div class="panel"><div class="activity-list">${rows.map((x,i)=>`<div class="activity-item"><div class="activity-dot"></div><div class="activity-main"><b>${esc(x.action)}</b><span>${esc(x.user)} · ${esc(x.time)}</span></div><span class="activity-index">${String(i+1).padStart(2,"0")}</span></div>`).join("")||`<div class="empty">No activity yet.</div>`}</div></div>`}
function v8ExportActivity(){const csv="Time,User,Action\n"+db.audit.map(x=>`"${x.time}","${x.user}","${String(x.action).replaceAll('"','""')}"`).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="munvar_activity_log.csv";a.click();URL.revokeObjectURL(a.href);toast("Activity log exported","success")}

function v8PrintCenterPage(){content.innerHTML=v8PageHead("Print Center","Generate clean, print-ready library documents.")+`<div class="grid3"><div class="action-card"><div class="action-icon">▧</div><h3>Book Labels</h3><p>Print Book ID, barcode, title and rack labels.</p><button class="primary full" onclick="v8PrintBookLabels()">Print Labels</button></div><div class="action-card"><div class="action-icon">▤</div><h3>Student Cards</h3><p>Print student ID cards from live records.</p><button class="primary full" onclick="v8PrintStudentCards()">Print Cards</button></div><div class="action-card"><div class="action-icon">▥</div><h3>Circulation Sheet</h3><p>Print a clean current loan register.</p><button class="primary full" onclick="v8PrintCirculation()">Print Sheet</button></div></div><div class="panel"><h3>Print standards</h3><div class="stat-line"><b>Paper</b><span>A4 / browser print</span></div><div class="stat-line"><b>Data</b><span>Live local database</span></div><div class="stat-line"><b>Branding</b><span>Smart Library</span></div></div>`}
function v8PrintWindow(title,html){const w=window.open("","_blank","width=1000,height=800");if(!w)return toast("Allow popups to print","error");w.document.write(`<html><head><title>${esc(title)}</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#172033}h1{font-size:24px}.sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{border:1px solid #ccd4df;border-radius:12px;padding:14px;break-inside:avoid}.muted{color:#64748b;font-size:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d8dee8;padding:8px;text-align:left;font-size:12px}th{background:#eef3f8}@media print{button{display:none}}</style></head><body>${html}<script>setTimeout(()=>print(),300)<\/script></body></html>`);w.document.close()}
function v8PrintBookLabels(){v8PrintWindow("Smart Library Book Labels",`<h1>Smart Library — Book Labels</h1><div class="sheet">${db.books.map(b=>`<div class="card"><b>${esc(b.title)}</b><div class="muted">${esc(b.author)} · ${esc(b.category)}</div><h2>${esc(b.bookId)}</h2><div>Barcode: ${esc(b.barcode||b.bookId)}</div><div class="muted">Rack ${esc(b.rack||"A-01")}</div></div>`).join("")}</div>`)}
function v8PrintStudentCards(){v8PrintWindow("Smart Library Student Cards",`<h1>Smart Library — Student Cards</h1><div class="sheet">${db.students.map(s=>`<div class="card"><b>${esc(s.name)}</b><h2>${esc(s.studentId)}</h2><div>${esc(s.department)} · Semester ${esc(s.semester)}</div><div class="muted">${esc(s.email)}</div><div>${esc(s.mobile)}</div></div>`).join("")}</div>`)}
function v8PrintCirculation(){v8PrintWindow("Munvar Circulation Sheet",`<h1>Current Circulation — ${fmtDate(today())}</h1><table><thead><tr><th>Borrower</th><th>Book</th><th>Issue</th><th>Due</th><th>Status</th><th>Fine</th></tr></thead><tbody>${db.loans.filter(l=>l.status!=="Returned").map(l=>`<tr><td>${esc(borrower(l)?.name)}</td><td>${esc(book(l.bookId)?.title)}</td><td>${fmtDate(l.issueDate)}</td><td>${fmtDate(l.dueDate)}</td><td>${esc(l.status)}</td><td>₹${l.fine||0}</td></tr>`).join("")}</tbody></table>`)}

function libraryRacks(){
 const defaults=["A-01","A-02","A-03","A-04","A-05","B-01","B-02","B-03","B-04","B-05","C-01","C-02","C-03","C-04","C-05"];
 if(!Array.isArray(db.racks)||!db.racks.length){db.racks=defaults;saveDB();}
 return db.racks;
}
function addLibraryRack(){
 modal(`<h2>Add Rack</h2><form id="rackForm"><div class="form-field"><label>Rack ID</label><input id="rackId" placeholder="e.g. D-01" required></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Add Rack</button></div></form></div>`);
 document.getElementById("rackForm").onsubmit=e=>{e.preventDefault();const id=rackId.value.trim().toUpperCase();if(!id)return;if(libraryRacks().some(r=>r.toLowerCase()===id.toLowerCase()))return toast("Rack already exists","error");db.racks.push(id);saveDB();addAudit(`Added rack ${id}`);closeModal();toast("Rack added","success");v8FloorMapPage()};
}
function editLibraryRack(rack){
 modal(`<h2>Rename Rack</h2><form id="rackEditForm"><div class="form-field"><label>Rack ID</label><input id="newRackId" value="${esc(rack)}" required></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Save Changes</button></div></form></div>`);
 document.getElementById("rackEditForm").onsubmit=e=>{e.preventDefault();const next=newRackId.value.trim().toUpperCase();if(!next)return;if(libraryRacks().some(r=>r!==rack&&r.toLowerCase()===next.toLowerCase()))return toast("Rack already exists","error");db.racks=db.racks.map(r=>r===rack?next:r);db.books.forEach(b=>{if((b.rack||"A-01")===rack)b.rack=next});saveDB();addAudit(`Renamed rack ${rack} to ${next}`);closeModal();toast("Rack updated","success");v8FloorMapPage()};
}
function removeLibraryRack(rack){
 if(db.books.some(b=>(b.rack||"A-01")===rack))return toast("Move the books out of this rack before removing it","error");
 if(!confirm(`Remove rack ${rack}?`))return;db.racks=libraryRacks().filter(r=>r!==rack);saveDB();addAudit(`Removed rack ${rack}`);toast("Rack removed","success");v8FloorMapPage();
}
function v8FloorMapPage(){
 const racks=libraryRacks();
 const totalTitles=db.books.length;
 const assigned=db.books.filter(b=>b.rack).length;
 const cards=racks.map(r=>{
  const books=db.books.filter(b=>(b.rack||"A-01")===r);
  const stock=books.reduce((n,b)=>n+Number(b.stock||0),0);
   return `<div class="rack-slot"><button class="rack ${books.length?"occupied":"empty-rack"}" onclick="v8RackDetails('${esc(r)}')"><span class="rack-code">${esc(r)}</span><small>${books.length} title${books.length===1?"":"s"} · ${stock} available</small><em>${books.length?"View shelf":"Empty"}</em></button><div class="rack-actions"><button class="btn-sm" onclick="editLibraryRack('${esc(r)}')">Edit</button><button class="btn-sm danger" onclick="removeLibraryRack('${esc(r)}')">Remove</button></div></div>`;
 }).join("");
 content.innerHTML=v8PageHead("Library Map","Find a rack, then open its live book list.",`<div class="button-row"><span class="badge blue">${assigned}/${totalTitles} titles placed</span><button class="ghost" onclick="v8RackSearch()">Find Rack</button><button class="primary" onclick="addLibraryRack()">+ Add Rack</button></div>`)+`<div class="panel floor-map"><div class="map-header"><div><b>FLOOR 2 · MAIN COLLECTION</b><div class="muted">Click any rack to see titles, stock and availability.</div></div><div class="map-legend"><span><i class="legend-dot occupied-dot"></i> Books assigned</span><span><i class="legend-dot empty-dot"></i> Empty rack</span></div></div><div class="map-floor-label">ENTRANCE</div><div class="rack-grid">${cards}<div class="map-zone reading"><strong>READING AREA</strong><span>Quiet study</span></div><div class="map-zone desk"><strong>LIBRARY DESK</strong><span>Issue · Return · Help</span></div></div><div class="map-footer"><span>Tip: keep rack IDs consistent when adding books.</span><button class="btn-sm" onclick="route('books')">Manage Inventory</button></div></div>`;
}

function v8RackDetails(rack){const books=db.books.filter(b=>(b.rack||"A-01")===rack);modal(`<h2>Rack ${esc(rack)}</h2><p class="muted">${books.length} catalog title(s)</p>${books.map(b=>`<div class="stat-line"><b>${esc(b.title)}</b><span>${b.stock}/${b.total} available</span></div>`).join("")||`<div class="empty">No books assigned to this rack.</div>`}<div class="form-actions"><button class="ghost" onclick="closeModal()">Close</button></div></div>`)}
function v8RackSearch(){const q=prompt("Enter a Book ID or title");if(!q)return;const b=db.books.find(x=>`${x.bookId} ${x.title}`.toLowerCase().includes(q.toLowerCase()));if(!b)return toast("Book not found","error");toast(`${b.title} is on rack ${b.rack||"A-01"}`,"success");v8RackDetails(b.rack||"A-01")}

function confirmResetDemo(){modal(`<h2>Reset demo database?</h2><p class="muted">All local changes in this browser will be replaced by the sample records.</p><div class="form-actions"><button class="ghost" onclick="closeModal()">Cancel</button><button class="danger" onclick="closeModal();resetDemo()">Reset database</button></div>`)}
function backupLibraryData(){const payload=JSON.stringify({version:12,exportedAt:new Date().toISOString(),data:db},null,2);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([payload],{type:"application/json"}));a.download=`smart-library-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href);toast("Library backup exported","success")}
function restoreLibraryData(event){const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);const d=parsed.data||parsed;if(!d.students||!d.books||!d.loans||!d.users)throw new Error("Invalid backup");db=d;reconcileInventory();saveDB();addAudit("Restored library database backup");toast("Backup restored successfully","success");route("dashboard")}catch(e){toast("Invalid library backup file","error")}finally{event.target.value=""}};reader.readAsText(file)}

function v8GlobalSearch(q){q=(q||"").trim().toLowerCase();if(!q)return;const b=db.books.find(x=>`${x.bookId} ${x.title} ${x.author} ${x.barcode||""}`.toLowerCase().includes(q));const s=db.students.find(x=>`${x.studentId} ${x.name} ${x.email}`.toLowerCase().includes(q));if(b){route("books");setTimeout(()=>{const el=document.getElementById("bookSearch");if(el){el.value=q;filterBooks()}},50);return}if(s&&currentUser.role!=="student"){route("students");setTimeout(()=>{const el=document.getElementById("studentSearch");if(el){el.value=q;filterStudents()}},50);return}if(q.includes("overdue")){route("due");return}toast("No matching library record found","error")}
const globalSearchEl=document.getElementById("globalSearch");if(globalSearchEl){globalSearchEl.onkeydown=e=>{if(e.key==="Enter")v8GlobalSearch(e.target.value)}}
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("globalSearch")?.focus()}if(e.key==="Escape")closeModal()});

/* Keep a single theme control in the top bar. */
if(themeBtnEl){themeBtnEl.title="Toggle theme";themeBtnEl.setAttribute("aria-label","Toggle theme")}

/* ===== V12 runtime repair / startup hardening ===== */
function modal(html){
  const root=document.getElementById('modalRoot');
  if(!root)return;
  root.innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal-card">${html}</div></div>`;
  document.body.classList.add('modal-open');
}
function forgotPassword(){
  modal(`<div class="natural-form-modal"><div class="modal-title"><div><span class="eyebrow">ACCOUNT RECOVERY</span><h2>Reset Password</h2><p class="muted">Enter your registered email and choose a new password.</p></div></div><form id="forgotPasswordForm"><div class="form-field"><label for="forgotEmail">Registered Email</label><input id="forgotEmail" type="email" placeholder="you@university.edu" autocomplete="email" required></div><div class="form-grid" style="margin-top:14px"><div class="form-field"><label for="forgotPass">New Password</label><input id="forgotPass" type="password" minlength="6" placeholder="Minimum 6 characters" autocomplete="new-password" required></div><div class="form-field"><label for="forgotPass2">Confirm New Password</label><input id="forgotPass2" type="password" minlength="6" placeholder="Repeat password" autocomplete="new-password" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button type="submit" class="primary">Reset Password</button></div></form></div>`);
  const form=document.getElementById('forgotPasswordForm');
  if(!form)return;
  form.onsubmit=e=>{
    e.preventDefault();
    const email=(document.getElementById('forgotEmail').value||'').trim().toLowerCase();
    const pass=document.getElementById('forgotPass').value||'';
    const pass2=document.getElementById('forgotPass2').value||'';
    const u=(db.users||[]).find(x=>String(x.email||'').trim().toLowerCase()===email);
    if(!u)return toast('No account found with this email.','error');
    if(u.active===false)return toast('This account is inactive. Contact library staff.','error');
    if(pass.length<6)return toast('Password must be at least 6 characters.','error');
    if(pass!==pass2)return toast('Passwords do not match.','error');
    u.password=pass;
    saveDB();
    if(typeof addAudit==='function')addAudit(`Password reset for ${u.email}`);
    closeModal();
    const emailBox=document.getElementById('loginEmail');
    const passBox=document.getElementById('loginPassword');
    if(emailBox)emailBox.value=email;
    if(passBox){passBox.value='';passBox.focus();}
    toast('Password reset successfully. Please sign in with your new password.','success');
  };
}

function closeModal(){
  const root=document.getElementById('modalRoot');
  if(root)root.innerHTML='';
  document.body.classList.remove('modal-open');
}
function resetDemo(){
  localStorage.removeItem(KEY);
  localStorage.removeItem('munvarCurrentUser');
  location.reload();
}
function toggleTheme(mode){
  const dark=mode==='dark';
  document.body.classList.toggle('dark-mode',dark);
  localStorage.setItem('smartLibraryTheme',dark?'dark':'light');
  const b=document.getElementById('themeBtn');
  if(b){b.textContent=dark?'☀':'☾';b.title=dark?'Switch to light mode':'Switch to dark mode';b.setAttribute('aria-label',b.title)}
}
function initTheme(){
  const saved=localStorage.getItem('smartLibraryTheme')||'light';
  toggleTheme(saved);
}
function returnBook(id){
  const l=db.loans.find(x=>x.id===id);
  if(!l||l.status==='Returned')return;
  const b=book(l.bookId);
  l.returnDate=today();l.status='Returned';
  if(b)b.stock=Math.min(Number(b.total)||0,(Number(b.stock)||0)+1);
  reconcileInventory();saveDB();
  if(typeof addAudit==='function')addAudit(`Returned ${b?.bookId||'book'}`);
  closeModal();toast('Book returned successfully','success');route(currentUser?.role==='student'?'my-books':'due');
}
function deleteBook(id){
  const b=book(id);if(!b)return;
  const active=db.loans.some(l=>l.bookId===id&&l.status!=='Returned');
  if(active)return toast('Cannot delete a book with an active loan','error');
  modal(`<h2>Delete book?</h2><p class="muted"><b>${esc(b.title)}</b> (${esc(b.bookId)}) will be removed from the local catalog.</p><div class="form-actions"><button class="ghost" onclick="closeModal()">Cancel</button><button class="danger" onclick="db.books=db.books.filter(x=>x.id!==${id});saveDB();addAudit('Deleted book ${esc(b.bookId)}');closeModal();toast('Book deleted','success');booksPage()">Delete</button></div>`);
}
function runReminderCheck(){
  const tomorrow=addDays(today(),1), active=db.loans.filter(l=>l.status!=='Returned');
  let created=0;
  active.filter(l=>l.dueDate===tomorrow).forEach(l=>{
    const exists=db.notifications.some(n=>n.loanId===l.id&&n.type==='Due Reminder'&&n.date===today());
    if(!exists){db.notifications.push({id:Date.now()+created,studentId:l.studentId,loanId:l.id,channel:'In-app',type:'Due Reminder',message:`${book(l.bookId)?.title||'Your book'} is due tomorrow.`,date:today(),time:'08:00',status:'Scheduled'});created++;}
  });
  saveDB();toast(created?`${created} reminder(s) scheduled`:'No new reminders required',created?'success':'');refreshNotifCount();
}
function downloadXLSX(){
  if(!window.XLSX)return toast('Excel library is still loading. Try again in a moment.','error');
  const rows=db.loans.map(l=>{const s=borrower(l),b=book(l.bookId);return {'Borrower Type':l.teacherId?'Teacher':'Student', 'Borrower ID':s?.studentId||'', 'Borrower Name':s?.name||'', Mobile:s?.mobile||'', Email:s?.email||'', Department:s?.department||'', 'Book Name':b?.title||'', 'Book ID':b?.bookId||'', 'Issue Date':l.issueDate||'', 'Issue Time':l.issueTime||'', 'Due Date':l.dueDate||'', 'Return Date':l.returnDate||'', Status:l.status||'', Fine:Number(l.fine)||0}});
  const ws=XLSX.utils.json_to_sheet(rows),wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Library Report');XLSX.writeFile(wb,'smart-library-report.xlsx');toast('Excel report downloaded','success');
}
function issueBook(){
  const raw=(document.getElementById("issueBorrower")?.value||"").trim();
  const bid=Number(document.getElementById("issueBookSelect")?.value);
  const due=document.getElementById("issueDue")?.value;
  const b=book(bid);

  // One search field handles BOTH registered students and registered teachers.
  const people=[
    ...(db.students||[]).map(s=>({type:"student", id:String(s.studentId||s.id), name:s.name||"", ref:s})),
    ...(db.users||[]).filter(u=>u.role==="teacher"&&u.active!==false).map(t=>({type:"teacher", id:String(t.teacherId||t.id), name:t.name||"", ref:t}))
  ];
  const clean=s=>String(s||"").trim().toLowerCase();
  const query=clean(raw.split(" — ")[0]);
  let targetInfo=people.find(p=>clean(p.id)===query);
  if(!targetInfo){
    const nameQuery=clean(raw);
    const matches=people.filter(p=>clean(p.name)===nameQuery || clean(p.name).includes(nameQuery));
    if(matches.length===1) targetInfo=matches[0];
  }

  if(!targetInfo||!b)return toast("Select a registered student or teacher from the search results and a book","error");
  if(!b.stock||b.stock<1)return toast("This book is currently unavailable","error");
  if(!due||due<today())return toast("Due date must be today or later","error");

  const borrowerId=targetInfo.id;
  const duplicate=db.loans.some(l=>{
    if(Number(l.bookId)!==bid || l.status==="Returned") return false;
    return targetInfo.type==="teacher"
      ? String(l.teacherId||"")===borrowerId
      : String(l.studentId||"")===borrowerId;
  });
  if(duplicate)return toast("This borrower already has this book issued","error");

  const nextId=Math.max(1000,...db.loans.map(l=>Number(l.id)||0))+1;
  const loan={
    id:nextId, bookId:bid, issueDate:today(), issueTime:nowTime(),
    dueDate:due, returnDate:null,
    status:dueStatus({status:"Borrowed",dueDate:due}), fine:0
  };
  if(targetInfo.type==="teacher") loan.teacherId=borrowerId;
  else loan.studentId=Number(targetInfo.ref.id||targetInfo.ref.studentId);

  db.loans.unshift(loan);
  reconcileInventory();
  saveDB();
  addAudit(`Issued ${b.bookId} to ${targetInfo.name} (${targetInfo.type})`);
  toast(`Issued ${b.title} to ${targetInfo.name} (${targetInfo.type})`,"success");
  issuePage();
}
function studentModal(){
  modal(`<h2>Add Student</h2><p class="muted">Create a student record and optional login account.</p><form id="studentForm"><div class="form-grid">
  <div class="form-field"><label>Student ID</label><input id="sId" required></div>
  <div class="form-field"><label>Full Name</label><input id="sName" required></div>
  <div class="form-field"><label>Email</label><input id="sEmail" type="email" required></div>
  <div class="form-field"><label>Mobile</label><input id="sMobile" required></div>
  <div class="form-field"><label>Department</label><input id="sDept" required></div>
  <div class="form-field"><label>Semester</label><input id="sSem" required></div>
  <div class="form-field"><label>Login Password</label><input id="sPass" type="password" minlength="6" required></div>
 </div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Create Student</button></div></form>`);
  document.getElementById('studentForm').onsubmit=e=>{
    e.preventDefault();
    const sid=sId.value.trim(),name=sName.value.trim(),email=sEmail.value.trim().toLowerCase(),pass=sPass.value;
    if(db.students.some(x=>x.studentId.toLowerCase()===sid.toLowerCase()))return toast('Student ID already exists','error');
    if(db.users.some(x=>x.email.toLowerCase()===email))return toast('Email already exists','error');
    const id=Math.max(0,...db.students.map(x=>Number(x.id)||0))+1;
    db.students.push({id,studentId:sid,name,department:sDept.value.trim(),semester:sSem.value.trim(),mobile:sMobile.value.trim(),email,joined:today()});
    db.users.push({id:Math.max(0,...db.users.map(x=>Number(x.id)||0))+1,email,password:pass,role:'student',name,studentId:sid,active:true});
    saveDB();addAudit(`Added student ${sid}`);closeModal();toast('Student created successfully','success');studentsPage();
  };
}
function registerStudentModal(){
  modal(`<h2>Create Student Account</h2><p class="muted">This creates both the student record and login account.</p><form id="registerForm"><div class="form-grid"><div class="form-field"><label>Student ID</label><input id="rStudentId" required></div><div class="form-field"><label>Full Name</label><input id="rName" required></div><div class="form-field"><label>University Email</label><input id="rEmail" type="email" required></div><div class="form-field"><label>Mobile</label><input id="rMobile" required></div><div class="form-field"><label>Department</label><input id="rDept" required></div><div class="form-field"><label>Semester</label><input id="rSem" required></div><div class="form-field"><label>Password</label><input id="rPass" type="password" minlength="6" required></div><div class="form-field"><label>Confirm Password</label><input id="rPass2" type="password" minlength="6" required></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Create Account</button></div></form></div>`);
  document.getElementById('registerForm').onsubmit=e=>{e.preventDefault();const sid=rStudentId.value.trim(),name=rName.value.trim(),email=rEmail.value.trim().toLowerCase(),pass=rPass.value;if(pass!==rPass2.value)return toast('Passwords do not match','error');if(db.students.some(s=>s.studentId.toLowerCase()===sid.toLowerCase()))return toast('Student ID already exists','error');if(db.users.some(u=>u.email.toLowerCase()===email))return toast('Email already exists','error');const id=Math.max(0,...db.students.map(s=>Number(s.id)||0))+1;db.students.push({id,studentId:sid,name,department:rDept.value.trim(),semester:rSem.value.trim(),mobile:rMobile.value.trim(),email,joined:today()});db.users.push({id:Math.max(0,...db.users.map(u=>Number(u.id)||0))+1,email,password:pass,role:'student',name,studentId:sid,active:true});saveDB();closeModal();toast('Student account created successfully','success')};
}
function initRuntime(){
  ensureV8Data();
  initTheme();
  const loginForm=document.getElementById('loginForm');
  if(loginForm)loginForm.addEventListener('submit',login);
  const reg=document.getElementById('showRegister');
  if(reg)reg.onclick=registerStudentModal;
  const teacherReg=document.getElementById('showTeacherRegister');
  if(teacherReg)teacherReg.onclick=registerTeacherModal;
  const logout=document.getElementById('logoutBtn');
  if(logout)logout.onclick=()=>{localStorage.removeItem('munvarCurrentUser');sessionStorage.removeItem('smartLibrarySession');currentUser=null;closeModal();document.getElementById('app').classList.add('hidden');document.getElementById('loginScreen').classList.remove('hidden');const f=document.getElementById('loginForm');f?.reset();};
  const mobile=document.getElementById('mobileMenu');
  if(mobile)mobile.onclick=()=>{document.getElementById('sidebar')?.classList.toggle('open');document.getElementById('sidebarOverlay')?.classList.toggle('show');};
  const overlay=document.getElementById('sidebarOverlay');
  if(overlay)overlay.onclick=()=>{document.getElementById('sidebar')?.classList.remove('open');overlay.classList.remove('show');};
  const notif=document.getElementById('notifBtn');
  if(notif)notif.onclick=()=>currentUser&&route('notifications');
  const theme=document.getElementById('themeBtn');
  if(theme)theme.onclick=()=>toggleTheme(document.body.classList.contains('dark-mode')?'light':'dark');
  boot();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initRuntime);else initRuntime();

/* Missing page handlers restored for safe route-map evaluation. */
function addDays(dateStr,n){const d=new Date(dateStr+'T00:00:00');d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function refreshNotifCount(){const el=document.getElementById('notifCount');if(el)el.textContent=String((db.notifications||[]).filter(n=>n.status!=='Read').length)}
function notificationsPage(){content.innerHTML=v8PageHead('Notifications','Library reminders and account alerts.')+`<div class="panel">${(db.notifications||[]).map(n=>`<div class="stat-line"><div><b>${esc(n.type||'Notification')}</b><div class="muted">${esc(n.message||'')}</div></div><span>${fmtDate(n.date)}</span></div>`).join('')||'<div class="empty">No notifications.</div>'}</div>`}
function reportsPage(){content.innerHTML=v8PageHead('Reports Center','Export live library records.')+`<div class="grid3"><div class="action-card"><h3>Excel Report</h3><p>Full circulation register.</p><button class="primary full" onclick="downloadXLSX()">Download Excel</button></div><div class="action-card"><h3>Backup</h3><p>Save the complete local database.</p><button class="primary full" onclick="backupLibraryData()">Backup JSON</button></div><div class="action-card"><h3>Activity</h3><p>Review recent system actions.</p><button class="primary full" onclick="route('activity')">Open Activity</button></div></div>`}
let onlineBookSearchTimer=null;
function onlineBooksPage(){
  const isAdmin=currentUser?.role==="staff"||currentUser?.role==="admin";
  const pool=isAdmin?`<div class="panel online-books-pool" id="onlineBooksPool"><div class="panel-head"><div><h3>Books Pool</h3><small>Local library catalogue, including titles added from online discovery.</small></div><span class="badge blue" id="onlinePoolCount">${db.books.length} BOOKS</span></div><div class="filters"><input id="onlinePoolSearch" placeholder="Search the books pool..." oninput="renderOnlineBooksPool()"><select id="onlinePoolSource" onchange="renderOnlineBooksPool()"><option value="">All sources</option><option value="online">Online Discovery</option><option value="local">Library Catalogue</option></select></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Author</th><th>Category</th><th>Source</th><th>Available</th><th>Action</th></tr></thead><tbody id="onlinePoolRows"></tbody></table></div></div>`:"";
  content.innerHTML=v8PageHead('Online Discovery','Search real books from Open Library and add selected titles to your local catalogue.',`<span class="badge blue online-source-badge">OPEN LIBRARY</span>`)+
  `<div class="panel online-discovery-panel"><div class="online-discovery-search"><div class="search-field"><span>⌕</span><input id="onlineBookQuery" autocomplete="off" placeholder="Search title, author, ISBN…"><button class="primary" onclick="searchOnlineBooks()">Search</button></div><div class="online-discovery-note"><span class="pulse-dot"></span><span>Live results · Covers and bibliographic details are loaded from Open Library.</span></div></div><div id="onlineBookResults" class="online-book-results"><div class="empty-state-pro"><div class="empty-icon">⌕</div><b>Discover books online</b><span>Search a title, author or ISBN to see live catalogue results.</span></div></div></div>${pool}`;
  const input=document.getElementById('onlineBookQuery');
  input?.addEventListener('keydown',e=>{if(e.key==='Enter')searchOnlineBooks()});
  if(isAdmin)renderOnlineBooksPool();
}
function renderOnlineBooksPool(){
  const rows=document.getElementById('onlinePoolRows');if(!rows)return;
  const q=(document.getElementById('onlinePoolSearch')?.value||'').trim().toLowerCase();
  const source=document.getElementById('onlinePoolSource')?.value||'';
  const books=db.books.filter(b=>{
    const matchesSearch=!q||`${b.title} ${b.author} ${b.category} ${b.bookId} ${b.isbn||''}`.toLowerCase().includes(q);
    const online=!!b.onlineSource;
    return matchesSearch&&(!source||(source==='online'?online:!online));
  });
  const count=document.getElementById('onlinePoolCount');
  if(count)count.textContent=`${books.length} BOOK${books.length===1?'':'S'}`;
  rows.innerHTML=books.map(b=>`<tr><td><b>${esc(b.title)}</b><div class="muted">${esc(b.bookId)}</div></td><td>${esc(b.author)}</td><td>${esc(b.category||'General')}</td><td><span class="badge ${b.onlineSource?'blue':'green'}">${b.onlineSource?'Online Discovery':'Library Catalogue'}</span></td><td>${Number(b.stock)||0}/${Number(b.total)||0}</td><td><button class="btn-sm" onclick="route('books')">Manage</button></td></tr>`).join('')||'<tr><td colspan="6" class="empty">No books match this filter.</td></tr>';
}
async function searchOnlineBooks(){
  const input=document.getElementById('onlineBookQuery'), box=document.getElementById('onlineBookResults');
  const q=(input?.value||'').trim(); if(!q){toast('Enter a title, author or ISBN.','error');input?.focus();return;}
  box.innerHTML='<div class="online-loading"><span class="spinner"></span><b>Searching the live catalogue…</b><small>Fetching current bibliographic results.</small></div>';
  try{
    const res=await fetch('https://openlibrary.org/search.json?limit=18&q='+encodeURIComponent(q),{headers:{Accept:'application/json'}});
    if(!res.ok)throw new Error('Search failed');
    const data=await res.json();
    const docs=(data.docs||[]).filter(x=>x.title).slice(0,18);
    if(!docs.length){box.innerHTML='<div class="empty-state-pro"><div class="empty-icon">⌕</div><b>No matching books</b><span>Try a broader title, author or ISBN.</span></div>';return;}
    box.innerHTML=docs.map((b,i)=>{
      const cover=b.cover_i?`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`:'';
      const author=(b.author_name||[]).slice(0,2).join(', ')||'Unknown author';
      const year=b.first_publish_year||'Year unavailable';
      const isbn=(b.isbn||[])[0]||'';
      const key=b.key||'';
      return `<article class="online-book-card"><div class="online-cover">${cover?`<img loading="lazy" src="${cover}" alt="${esc(b.title)} cover" onerror="this.parentElement.innerHTML='<span>BOOK</span>'">`:'<span>BOOK</span>'}</div><div class="online-book-info"><div class="online-book-top"><span class="badge blue">ONLINE</span><span class="online-year">${esc(year)}</span></div><h3>${esc(b.title)}</h3><p class="online-author">${esc(author)}</p><div class="online-meta"><span>${esc(b.edition_count||1)} edition${b.edition_count===1?'':'s'}</span>${isbn?`<span>ISBN ${esc(isbn)}</span>`:''}</div><div class="online-actions"><button class="ghost btn-sm" onclick='addOnlineBook(${JSON.stringify({title:b.title,author,year,isbn,key}).replace(/'/g,"&#39;")})'>Add to Library</button><a class="btn-sm online-link" target="_blank" rel="noopener" href="https://openlibrary.org${esc(key)}">View source</a></div></div></article>`;
    }).join('');
  }catch(e){box.innerHTML='<div class="empty-state-pro"><div class="empty-icon">!</div><b>Online catalogue unavailable</b><span>Check your internet connection and try again. Your local library remains available.</span><button class="ghost" onclick="searchOnlineBooks()">Try again</button></div>';}
}
function addOnlineBook(info){
  const isAdmin=currentUser?.role==="staff"||currentUser?.role==="admin";
  const refreshPool=()=>{if(isAdmin){renderOnlineBooksPool();document.getElementById('onlineBooksPool')?.scrollIntoView({behavior:'smooth',block:'start'})}else route('books')};
  const existing=db.books.find(b=>String(b.isbn||'')===String(info.isbn||'')&&info.isbn)||db.books.find(b=>b.title.toLowerCase()===String(info.title).toLowerCase()&&b.author.toLowerCase()===String(info.author).toLowerCase());
  if(existing){toast('That book is already in your local catalogue.','error');refreshPool();return;}
  const next=Math.max(0,...db.books.map(b=>Number(b.id)||0))+1, code='OL'+String(next).padStart(3,'0');
  db.books.push({id:next,bookId:code,title:info.title,author:info.author,category:'General',stock:0,total:0,addedAt:today(),isbn:info.isbn||code,barcode:code,rack:'Unassigned',onlineSource:'Open Library',sourceKey:info.key||''});
  addAudit(`Added online book “${info.title}” to catalogue`);toast('Book added to the local catalogue.','success');refreshPool();
}
function datasetPage(){content.innerHTML=v8PageHead('Dataset Lab','Inspect the data used by the dashboard.')+`<div class="panel"><div class="stat-line"><b>Students</b><span>${db.students.length}</span></div><div class="stat-line"><b>Books</b><span>${db.books.length}</span></div><div class="stat-line"><b>Loans</b><span>${db.loans.length}</span></div><div class="form-actions"><button class="primary" onclick="backupLibraryData()">Export Dataset Backup</button></div></div>`}
function myBooksPage(){const s=getCurrentStudent();if(!s)return studentDashboard();const loans=db.loans.filter(l=>String(l.studentId)===String(s.id));content.innerHTML=v8PageHead('My Books','Your current and past library activity.')+`<div class="panel"><div class="panel-head"><div><h3>Borrowing History</h3><small>${loans.length} record(s) linked to your account.</small></div><button class="ghost" onclick="route('catalog')">Browse Books</button></div>${loanTableV5(loans)}</div>`}
function catalogPage(){const arr=db.books;content.innerHTML=v8PageHead('Book Catalog','Browse current library titles and availability.')+`<div class="panel"><div class="filters"><input id="catalogSearch" placeholder="Search title, author or Book ID..." oninput="filterCatalog()"></div><div id="catalogRows" class="catalog-list">${arr.map(b=>`<div class="catalog-row"><div class="catalog-book"><b>${esc(b.title)}</b><span>${esc(b.bookId)}</span></div><div>${esc(b.author)}</div><div><span class="badge blue">${esc(b.category)}</span></div><div>${b.stock}/${b.total}</div><div>${b.stock?'<span class="badge green">Available</span>':'<span class="badge red">Unavailable</span>'}</div></div>`).join('')}</div></div>`}
function filterCatalog(){const q=(document.getElementById('catalogSearch')?.value||'').toLowerCase();const box=document.getElementById('catalogRows');if(!box)return;box.innerHTML=db.books.filter(b=>`${b.title} ${b.author} ${b.bookId} ${b.category}`.toLowerCase().includes(q)).map(b=>`<div class="catalog-row"><div class="catalog-book"><b>${esc(b.title)}</b><span>${esc(b.bookId)}</span></div><div>${esc(b.author)}</div><div><span class="badge blue">${esc(b.category)}</span></div><div>${b.stock}/${b.total}</div><div>${b.stock?'<span class="badge green">Available</span>':'<span class="badge red">Unavailable</span>'}</div></div>`).join('')||'<div class="empty">No books found.</div>'}
function accountPage(){const s=getCurrentStudent();content.innerHTML=v8PageHead('My Account','Account details and session information.')+`<div class="panel"><div class="stat-line"><b>Name</b><span>${esc(currentUser.name)}</span></div><div class="stat-line"><b>Role</b><span>${currentUser.role==='student'?'Student':'Staff'}</span></div>${s?`<div class="stat-line"><b>Student ID</b><span>${esc(s.studentId)}</span></div><div class="stat-line"><b>Department</b><span>${esc(s.department)}</span></div>`:''}</div>`}
function settingsPage(){content.innerHTML=v8PageHead('Settings','Local application preferences and data tools.')+`<div class="grid2"><div class="panel"><h3>Appearance</h3><p class="muted">Use the single theme control in the top bar.</p><button class="primary" onclick="toggleTheme(document.body.classList.contains('dark-mode')?'light':'dark')">Toggle Theme</button></div><div class="panel"><h3>Data</h3><div class="form-actions"><button class="primary" onclick="backupLibraryData()">Backup</button><button class="ghost" onclick="document.getElementById('restoreInput').click()">Restore</button><input id="restoreInput" type="file" accept="application/json" hidden onchange="restoreLibraryData(event)"><button class="danger" onclick="confirmResetDemo()">Reset Demo</button></div></div></div>`}

/* ===== V17 Professional Operations Layer ===== */
const APP_CONFIG={version:17,maxBooksPerStudent:5,defaultLoanDays:7,finePerDay:5,maxReservationDays:3};
function ensureProfessionalData(){
  db.reservations=Array.isArray(db.reservations)?db.reservations:[];
  db.audit=Array.isArray(db.audit)?db.audit:[];
  db.notifications=Array.isArray(db.notifications)?db.notifications:[];
  db.users=Array.isArray(db.users)?db.users:[];
  db.students=Array.isArray(db.students)?db.students:[];
  db.books=Array.isArray(db.books)?db.books:[];
  db.loans=Array.isArray(db.loans)?db.loans:[];
  db.loans.forEach(l=>{l.fine=Math.max(0,Number(l.fine)||0);l.paidFine=Math.max(0,Number(l.paidFine)||0);if(l.paidFine>l.fine)l.paidFine=l.fine;});
  db.users.forEach(u=>{if(u.role==='admin'||u.role==='librarian')u.role='staff';});
  reconcileInventory();
  normalizeStatuses();
  saveDB();
}
function activeLoansForStudent(studentId){return db.loans.filter(l=>Number(l.studentId)===Number(studentId)&&l.status!=='Returned')}
function activeLoanForBook(bookId){return db.loans.filter(l=>Number(l.bookId)===Number(bookId)&&l.status!=='Returned')}
function calculateFine(loan){if(!loan||loan.status==='Returned')return Number(loan?.fine)||0;const due=new Date((loan.dueDate||today())+'T00:00:00');const now=new Date(today()+'T00:00:00');const days=Math.max(0,Math.floor((now-due)/86400000));return Math.max(Number(loan.fine)||0,days*APP_CONFIG.finePerDay)}
function normalizeProfessionalLoans(){
  db.loans.forEach(l=>{if(l.status!=='Returned'){l.status=dueStatus(l);l.fine=calculateFine(l);l.paidFine=Math.min(Number(l.paidFine)||0,l.fine)}});
}
function saveProfessional(){normalizeProfessionalLoans();reconcileInventory();saveDB();}
function professionalIssueBook(){
  const raw=(document.getElementById('issueBorrower')?.value||'').trim();
  const borrowerQuery=raw.split(' — ')[0].trim().toLowerCase();
  const bid=Number(document.getElementById('issueBookSelect')?.value),due=document.getElementById('issueDue')?.value;
  const b=book(bid);
  const students=(db.students||[]).map(s=>({type:'student',id:String(s.studentId||s.id),name:s.name||'',ref:s}));
  const teachers=(db.users||[]).filter(t=>t.role==='teacher'&&t.active!==false).map(t=>({type:'teacher',id:String(t.teacherId||t.id),name:t.name||'',ref:t}));
  const people=[...students,...teachers];
  let target=people.find(p=>p.id.toLowerCase()===borrowerQuery);
  if(!target&&raw){
    const matches=people.filter(p=>p.name.toLowerCase()===raw.toLowerCase());
    if(matches.length===1)target=matches[0];
  }
  if(!target||!b)return toast('Select a registered student or teacher and a book','error');
  if(Number(b.stock)<1)return toast('No available copy of this book','error');
  if(!due||due<today())return toast('Due date must be today or later','error');
  const activeLoans=db.loans.filter(l=>l.status!=='Returned'&&(target.type==='teacher'
    ? String(l.teacherId||'')===target.id
    : Number(l.studentId)===Number(target.ref.id)));
  if(target.type==='student'&&activeLoans.length>=APP_CONFIG.maxBooksPerStudent)return toast(`Borrowing limit reached: ${APP_CONFIG.maxBooksPerStudent} active books`,'error');
  if(activeLoans.some(l=>Number(l.bookId)===bid))return toast('This borrower already has this book','error');
  const reservation=target.type==='student'?db.reservations.find(r=>Number(r.studentId)===Number(target.ref.id)&&Number(r.bookId)===bid&&r.status==='Ready'):null;
  const id=Math.max(1000,...db.loans.map(l=>Number(l.id)||0))+1;
  const loan={id,bookId:bid,issueDate:today(),issueTime:nowTime(),dueDate:due,returnDate:null,status:dueStatus({status:'Borrowed',dueDate:due}),fine:0,paidFine:0};
  if(target.type==='teacher')loan.teacherId=target.id;
  else loan.studentId=Number(target.ref.id||target.ref.studentId);
  db.loans.unshift(loan);
  if(reservation)reservation.status='Fulfilled';
  saveProfessional();addAudit(`Issued ${b.bookId} to ${target.id} (${target.type})`);toast(`Issued ${b.title} to ${target.name}`,'success');issuePage();
}
function professionalReturnBook(id){
  const l=db.loans.find(x=>Number(x.id)===Number(id));
  if(!l)return toast('Loan record not found','error');
  if(l.status==='Returned')return toast('This loan is already returned','error');
  const b=book(l.bookId),s=borrower(l);l.fine=calculateFine(l);l.returnDate=today();l.status='Returned';
  saveProfessional();addAudit(`Returned ${b?.bookId||'book'} from ${s?.studentId||'student'}`);toast(`Returned ${b?.title||'book'} successfully`,'success');
  const waiting=db.reservations.find(r=>Number(r.bookId)===Number(l.bookId)&&r.status==='Waiting');
  if(waiting){waiting.status='Ready';waiting.readyAt=today();db.notifications.push({id:Date.now(),studentId:waiting.studentId,loanId:null,channel:'In-app',type:'Reservation Ready',message:`${b?.title||'Your reserved book'} is now ready for pickup.`,date:today(),time:nowTime(),status:'Unread'});saveDB();toast('Next reservation marked ready','success');}
  closeModal();route(currentUser?.role==='student'?'my-books':'due');
}
function professionalUpdateFine(id,value){const l=db.loans.find(x=>Number(x.id)===Number(id));if(!l)return;l.fine=Math.max(0,Number(value)||0);l.paidFine=Math.min(Number(l.paidFine)||0,l.fine);saveProfessional();addAudit(`Updated fine for loan ${id} to ₹${l.fine}`);toast('Fine updated','success');duePage()}
function professionalPayFine(id,value){const l=db.loans.find(x=>Number(x.id)===Number(id));if(!l)return;const amount=Math.max(0,Number(value)||0),balance=Math.max(0,(Number(l.fine)||0)-(Number(l.paidFine)||0));if(amount>balance)return toast(`Payment cannot exceed ₹${balance}`,'error');l.paidFine=(Number(l.paidFine)||0)+amount;saveDB();addAudit(`Recorded fine payment ₹${amount} for loan ${id}`);toast('Fine payment recorded','success');duePage()}
function professionalLoanTable(arr){if(!arr.length)return '<div class="empty-state-pro"><div class="empty-icon">✓</div><b>No borrowing records</b><span>Active circulation will appear here.</span></div>';return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Borrower</th><th>Book</th><th>Issue</th><th>Due</th><th>Status</th><th>Fine</th><th>Actions</th></tr></thead><tbody>${arr.map(l=>{const fine=calculateFine(l),paid=Number(l.paidFine)||0,balance=Math.max(0,fine-paid),s=borrower(l),b=book(l.bookId);return `<tr class="${l.status==='Overdue'?'overdue-highlight':''}"><td><b>${esc(s?.name||'Unknown')}</b><div class="muted">${esc(s?.studentId||'')}</div></td><td><b>${esc(b?.title||'Unknown')}</b><div class="muted">${esc(b?.bookId||'')}</div></td><td>${fmtDate(l.issueDate)}</td><td>${fmtDate(l.dueDate)}</td><td>${statusBadge(l.status)}</td><td><b>₹${fine}</b><div class="muted">Paid ₹${paid} · Due ₹${balance}</div></td><td><div class="row-actions">${l.status!=='Returned'?`<button class="btn-sm primary" onclick="professionalReturnBook(${l.id})">Return</button><button class="btn-sm" onclick="editDueDate(${l.id})">Due date</button>`:''}${balance?`<button class="btn-sm" onclick="professionalPayFine(${l.id},prompt('Payment amount (₹)','${balance}'))">Pay fine</button>`:''}</div></td></tr>`}).join('')}</tbody></table></div>`}
function professionalDuePage(){normalizeProfessionalLoans();const active=db.loans.filter(l=>l.status!=='Returned'),overdue=active.filter(l=>l.status==='Overdue'),todayDue=active.filter(l=>l.dueDate===today()),fine=active.reduce((n,l)=>n+Math.max(0,(Number(l.fine)||0)-(Number(l.paidFine)||0)),0);content.innerHTML=v8PageHead('Due & Fines','Live due dates, overdue records and outstanding balances.',`<button class="ghost" onclick="runReminderCheck()">Run reminders</button><button class="primary" onclick="addFineQuick()">Add fine</button>`)+`<div class="kpis"><div class="kpi"><div class="label">DUE TODAY</div><div class="value">${todayDue.length}</div></div><div class="kpi"><div class="label">OVERDUE</div><div class="value">${overdue.length}</div></div><div class="kpi"><div class="label">OUTSTANDING FINES</div><div class="value">₹${fine}</div></div><div class="kpi"><div class="label">ACTIVE LOANS</div><div class="value">${active.length}</div></div></div><div class="panel"><div class="panel-head"><div><h3>Circulation exceptions</h3><small>Fine amounts are calculated from overdue days and can be adjusted by staff.</small></div><span class="badge ${overdue.length?'red':'green'}">${overdue.length?overdue.length+' overdue':'All clear'}</span></div>${professionalLoanTable(active)}</div>`}
function professionalReservationsPage(){
  const isStudent=currentUser.role==='student', mine=isStudent?db.reservations.filter(r=>Number(r.studentId)===Number(getCurrentStudent()?.id)):db.reservations;
  content.innerHTML=v8PageHead('Reservations','Reserve unavailable books and manage the pickup queue.',isStudent?'<button class="primary" onclick="v8ReserveModal()">Reserve a book</button>':'<button class="primary" onclick="v8ReserveModal()">Create reservation</button>')+`<div class="panel"><div class="filters"><input id="resSearch" placeholder="Search book or student..." oninput="v8FilterReservations()"><select id="resStatus" onchange="v8FilterReservations()"><option value="">All statuses</option><option>Waiting</option><option>Ready</option><option>Fulfilled</option><option>Cancelled</option></select></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Student</th><th>Created</th><th>Position</th><th>Status</th><th>Action</th></tr></thead><tbody id="resRows">${v8ReservationRows(mine)}</tbody></table></div></div>`;
}
function professionalBuildNav(){
 const studentRole=currentUser.role==='student';const groups=studentRole?[["Workspace",[["dashboard","⌂","Dashboard"],["my-books","▣","My Books"],["catalog","▤","Book Catalog"],["reservations","◫","Reservations"],["schedule","□","Semester Calendar"]]],["Personal",[["notifications","♢","Notifications"],["reports","▥","My Reports"],["account","◎","My Account"]]]]:[["Workspace",[["dashboard","⌂","Dashboard"],["books","▤","Library Catalog"],["online-books","◎","Online Discovery"],["issue","⇄","Scan & Circulate"],["students","♙","Students"],["reservations","◫","Reservations"]]],["Operations",[["due","◷","Due & Fines"],["notifications","♢","Notifications"],["schedule","□","Academic Calendar"]]],["Insights",[["analytics","◌","Analytics Studio"],["floor-map","⌗","Library Map"]]],["Management",[["reports","▥","Reports Center"],["activity","•","Activity Log"],["print-center","▤","Print Center"],["settings","⚙","Settings"]]]];nav.innerHTML=groups.map(g=>`<div class="nav-group"><div class="nav-group-label">${g[0]}</div>${g[1].map(x=>v8NavButton(...x)).join('')}</div>`).join('');document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.onclick=()=>{route(b.dataset.page);sidebar.classList.remove('open');sidebarOverlay?.classList.remove('show')});}
function professionalRoute(page){document.getElementById('sidebar')?.classList.remove('open');document.getElementById('sidebarOverlay')?.classList.remove('show');document.querySelectorAll('.nav-item[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));const pages={dashboard,students:studentsPage,books:booksPage,issue:issuePage,due:professionalDuePage,notifications:notificationsPage,reports:reportsPage,dataset:datasetPage,schedule:schedulePage,settings:settingsPage,'my-books':myBooksPage,catalog:catalogPage,account:accountPage,analytics:v8AnalyticsPage,'floor-map':v8FloorMapPage,'print-center':v8PrintCenterPage,activity:v8ActivityPage,reservations:professionalReservationsPage};(pages[page]||dashboard)();document.scrollingElement?.scrollTo({top:0,behavior:'smooth'});}
function professionalBackup(){normalizeProfessionalLoans();const payload={schema:'smart-library',version:APP_CONFIG.version,exportedAt:new Date().toISOString(),data:db};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`smart-library-v${APP_CONFIG.version}-backup-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Validated backup exported','success')}
function professionalRestore(event){const file=event.target.files?.[0];if(!file)return;if(file.size>10*1024*1024){toast('Backup is too large to import safely','error');event.target.value='';return}const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result),d=parsed.data||parsed;if(!Array.isArray(d.users)||!Array.isArray(d.students)||!Array.isArray(d.books)||!Array.isArray(d.loans))throw new Error('Missing required collections');const bookIds=new Set(d.books.map(b=>Number(b.id)));const studentIds=new Set(d.students.map(s=>Number(s.id)));if(d.loans.some(l=>!bookIds.has(Number(l.bookId))||!studentIds.has(Number(l.studentId))))throw new Error('Orphaned loan');db={...d,reservations:Array.isArray(d.reservations)?d.reservations:[],notifications:Array.isArray(d.notifications)?d.notifications:[],audit:Array.isArray(d.audit)?d.audit:[]};ensureProfessionalData();toast('Backup validated and restored','success');route('dashboard')}catch(e){toast(`Restore rejected: ${e.message}`,'error')}finally{event.target.value=''}};reader.readAsText(file)}
function professionalDashboard(){
 if(currentUser.role==='student')return studentDashboard();normalizeProfessionalLoans();const active=db.loans.filter(l=>l.status!=='Returned'),overdue=active.filter(l=>l.status==='Overdue'),available=db.books.reduce((n,b)=>n+Number(b.stock||0),0),total=db.books.reduce((n,b)=>n+Number(b.total||0),0),outstanding=active.reduce((n,l)=>n+Math.max(0,(Number(l.fine)||0)-(Number(l.paidFine)||0)),0),ready=db.reservations.filter(r=>r.status==='Ready').length;
 content.innerHTML=`<div class="page-head"><div><span class="eyebrow">STAFF COMMAND CENTER · V17</span><h1>Library Dashboard</h1><p>Operational overview with live circulation, inventory and attention items.</p></div><div class="actions"><button class="ghost" onclick="route('reservations')">Reservations <span class="badge orange">${ready}</span></button><button class="primary" onclick="route('issue')">Open Circulation</button></div></div><div class="kpis"><div class="kpi kpi-click" onclick="route('students')"><div class="label">STUDENTS</div><div class="value">${db.students.length}</div><div class="trend">Active records</div></div><div class="kpi kpi-click" onclick="route('books')"><div class="label">AVAILABLE</div><div class="value">${available}</div><div class="trend">of ${total} copies</div></div><div class="kpi kpi-click" onclick="route('due')"><div class="label">OVERDUE</div><div class="value">${overdue.length}</div><div class="trend">${overdue.length?'Needs attention':'All clear'}</div></div><div class="kpi"><div class="label">OUTSTANDING FINES</div><div class="value">₹${outstanding}</div><div class="trend">Unpaid balance</div></div></div><div class="grid2"><div class="panel"><div class="panel-head"><div><h3>Attention required</h3><small>Items that need staff action.</small></div></div>${overdue.slice(0,5).map(l=>`<div class="attention-row"><span class="badge red">OVERDUE</span><div><b>${esc(borrower(l)?.name||'Unknown')}</b><span>${esc(book(l.bookId)?.title||'Unknown')} · ${Math.max(0,Math.floor((new Date(today())-new Date(l.dueDate+'T00:00:00'))/86400000))} day(s) late</span></div><button class="btn-sm" onclick="route('due')">Review</button></div>`).join('')||'<div class="empty-state-pro"><div class="empty-icon">✓</div><b>No urgent circulation issues</b><span>Everything is within the current rules.</span></div>'}</div><div class="panel"><div class="panel-head"><div><h3>Inventory health</h3><small>Availability calculated from active loans.</small></div><button class="btn-sm" onclick="route('analytics')">Analytics</button></div><div class="health-number">${total?Math.round(available/total*100):0}%</div><p class="muted">copies currently available</p><div class="progress"><span style="width:${total?available/total*100:0}%"></span></div><div class="stat-line"><b>Active loans</b><span>${active.length}</span></div><div class="stat-line"><b>Ready reservations</b><span>${ready}</span></div></div></div><div class="panel"><div class="panel-head"><div><h3>Recent activity</h3><small>Latest system actions.</small></div><button class="btn-sm" onclick="route('activity')">View all</button></div>${db.audit.slice(0,6).map(a=>`<div class="stat-line"><div><b>${esc(a.action)}</b><div class="muted">${esc(a.user)}</div></div><span>${esc(a.time)}</span></div>`).join('')||'<div class="empty">No activity yet.</div>'}</div>`;
}
function professionalSettings(){content.innerHTML=v8PageHead('Settings','Appearance, data protection and application diagnostics.')+`<div class="grid2"><div class="panel"><h3>Appearance</h3><p class="muted">Light and dark themes are saved locally for this browser.</p><button class="primary" onclick="toggleTheme(document.body.classList.contains('dark-mode')?'light':'dark')">Toggle Theme</button></div><div class="panel"><h3>Data protection</h3><p class="muted">Export a versioned backup before making major changes.</p><div class="form-actions"><button class="primary" onclick="professionalBackup()">Export Backup</button><button class="ghost" onclick="document.getElementById('restoreInput').click()">Validate & Restore</button><input id="restoreInput" type="file" accept="application/json" hidden onchange="professionalRestore(event)"></div></div></div><div class="panel"><div class="panel-head"><div><h3>System health</h3><small>Local integrity checks.</small></div><span class="badge green">HEALTHY</span></div><div class="health-grid"><div><b>Books</b><span>${db.books.length}</span></div><div><b>Students</b><span>${db.students.length}</span></div><div><b>Loans</b><span>${db.loans.length}</span></div><div><b>Reservations</b><span>${db.reservations.length}</span></div><div><b>Audit events</b><span>${db.audit.length}</span></div><div><b>Schema</b><span>V${APP_CONFIG.version}</span></div></div></div>`}

/* Override selected runtime functions with the V17 operations layer. */
const _oldInitRuntime=initRuntime;
initRuntime=function(){ensureProfessionalData();_oldInitRuntime();buildNav=professionalBuildNav;route=professionalRoute;buildNav();};
buildNav=professionalBuildNav;route=professionalRoute;issueBook=professionalIssueBook;returnBook=professionalReturnBook;duePage=professionalDuePage;backupLibraryData=professionalBackup;restoreLibraryData=professionalRestore;dashboard=professionalDashboard;settingsPage=professionalSettings;
/* Apply the V17 data migration immediately for already-open sessions. */
try{ensureProfessionalData();if(currentUser){buildNav();route('dashboard');}}catch(e){console.warn('V17 startup migration:',e)}

/* Reservation fulfillment now creates the actual loan instead of only changing a label. */
function v8FulfillReservation(id){
  const r=db.reservations.find(x=>Number(x.id)===Number(id));
  if(!r)return toast('Reservation not found','error');
  if(r.status!=='Ready')return toast('Reservation must be Ready before fulfillment','error');
  const b=book(r.bookId),s=student(r.studentId);
  if(!b||!s)return toast('Reservation references missing records','error');
  if(Number(b.stock)<1)return toast('Book is not available yet','error');
  if(activeLoansForStudent(s.id).length>=APP_CONFIG.maxBooksPerStudent)return toast('Student borrowing limit reached','error');
  const due=addDays(today(),APP_CONFIG.defaultLoanDays),loanId=Math.max(1000,...db.loans.map(l=>Number(l.id)||0))+1;
  db.loans.unshift({id:loanId,studentId:s.id,bookId:b.id,issueDate:today(),issueTime:nowTime(),dueDate:due,returnDate:null,status:'Borrowed',fine:0,paidFine:0});
  r.status='Fulfilled';r.fulfilledAt=today();saveProfessional();addAudit(`Fulfilled reservation ${r.id} for ${s.studentId}`);toast(`Reservation fulfilled for ${s.name}`,'success');professionalReservationsPage();
}
function databaseIntegrity(){
 const bookIds=new Set(db.books.map(b=>Number(b.id))),studentIds=new Set(db.students.map(s=>Number(s.id))),users=new Set(db.users.filter(u=>u.role==='student').map(u=>String(u.studentId))),loanOrphans=db.loans.filter(l=>!bookIds.has(Number(l.bookId))||!studentIds.has(Number(l.studentId))).length,userOrphans=db.students.filter(s=>!users.has(String(s.studentId))).length;
 return {loanOrphans,userOrphans,duplicateBookIds:db.books.length-new Set(db.books.map(b=>String(b.bookId).toLowerCase())).size,duplicateStudentIds:db.students.length-new Set(db.students.map(s=>String(s.studentId).toLowerCase())).size};
}
/* SMART LIBRARY — original experience layer */
(function(){
  const $=id=>document.getElementById(id);
  function esc2(v){return typeof esc==='function'?esc(v):String(v??'');}
  function openCommandPalette(){
    if($('commandOverlay')){$('commandOverlay').classList.remove('hidden');$('commandInput')?.focus();return;}
    const overlay=document.createElement('div');overlay.id='commandOverlay';overlay.className='command-overlay';overlay.innerHTML=`<div class="command-box" role="dialog" aria-modal="true" aria-label="Quick actions"><div class="command-search"><input id="commandInput" autocomplete="off" placeholder="Search books, students, or an action…"></div><div class="command-list" id="commandList"></div><div class="command-foot"><span>Enter to open · Esc to close</span><span>Smart Library</span></div></div>`;
    document.body.appendChild(overlay); overlay.addEventListener('click',e=>{if(e.target===overlay)closeCommandPalette()});
    const input=$('commandInput'); input.addEventListener('input',()=>paintCommands(input.value)); input.addEventListener('keydown',e=>{if(e.key==='Escape')closeCommandPalette();if(e.key==='Enter'){const first=document.querySelector('.command-item');if(first)first.click()}}); paintCommands('');
  }
  function closeCommandPalette(){$('commandOverlay')?.classList.add('hidden')}
  function paintCommands(q){
    const term=(q||'').trim().toLowerCase(); const items=[];
    const actions=currentUser?.role==='student' ? [
      ['Browse books','Open the live catalog','catalog'],['My books','View borrowing history','my-books'],['Reservations','View reservations','reservations'],['Semester calendar','Open academic dates','schedule'],['Notifications','See library notices','notifications'],['My account','Open profile','account']
    ]:[['Open circulation','Issue or return a book','issue'],['Library catalog','Search and manage books','books'],['Students','Manage student records','students'],['Due & fines','Review overdue items','due'],['Reservations','Manage reservation queue','reservations'],['Analytics','Open live analytics','analytics'],['Library map','Find a rack','floor-map'],['Activity log','Review system actions','activity'],['Reports','Export and backup data','reports']];
    actions.forEach(a=>{if(!term||a.join(' ').toLowerCase().includes(term))items.push(a)});
    if(typeof db!=='undefined'){
      db.books.filter(b=>`${b.title} ${b.author} ${b.bookId} ${b.barcode||''}`.toLowerCase().includes(term)).slice(0,5).forEach(b=>items.push([b.title,`${b.author} · ${b.bookId}`,'book',b.id]));
      if(currentUser?.role!=='student') db.students.filter(s=>`${s.name} ${s.studentId} ${s.email}`.toLowerCase().includes(term)).slice(0,5).forEach(s=>items.push([s.name,`${s.studentId} · ${s.department}`,'student',s.id]));
    }
    $('commandList').innerHTML=items.slice(0,12).map((a,i)=>`<button class="command-item" data-kind="${a[2]}" data-id="${a[3]??''}"><div><b>${esc2(a[0])}</b><span>${esc2(a[1])}</span></div><span>${a[2]==='book'?'BOOK':a[2]==='student'?'STUDENT':'OPEN'}</span></button>`).join('')||`<div class="empty">No matching library action.</div>`;
    document.querySelectorAll('.command-item').forEach(b=>b.onclick=()=>{const kind=b.dataset.kind,id=b.dataset.id;closeCommandPalette();if(kind==='book'){route('books');setTimeout(()=>{const x=document.getElementById('bookSearch');if(x){x.value=b.querySelector('b')?.textContent||'';filterBooks?.()}},80)}else if(kind==='student'){route('students');setTimeout(()=>{const x=document.getElementById('studentSearch');if(x){x.value=b.querySelector('b')?.textContent||'';filterStudents?.()}},80)}else route(kind)});
  }
  window.openCommandPalette=openCommandPalette;
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommandPalette()}if(e.key==='Escape')closeCommandPalette()});

  window.ownDashboard=function(){
    if(currentUser?.role==='student')return studentDashboard();
    if(typeof normalizeProfessionalLoans==='function')normalizeProfessionalLoans();
    const active=db.loans.filter(l=>l.status!=='Returned'), overdue=active.filter(l=>l.status==='Overdue');
    const available=db.books.reduce((n,b)=>n+Number(b.stock||0),0), total=db.books.reduce((n,b)=>n+Number(b.total||0),0);
    const ready=(db.reservations||[]).filter(r=>r.status==='Ready').length;
    const fines=active.reduce((n,l)=>n+Math.max(0,(Number(l.fine)||0)-(Number(l.paidFine)||0)),0);
    const hour=new Date().getHours(); const greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
    const first=(currentUser.name||'Staff').split(' ')[0];
    const attention=overdue.slice(0,4).map(l=>`<div class="attention-row"><span class="badge red">OVERDUE</span><div><b>${esc2(borrower(l)?.name||'Unknown')}</b><span>${esc2(book(l.bookId)?.title||'Unknown')} · due ${esc2(fmtDate(l.dueDate))}</span></div><button class="btn-sm" onclick="route('due')">Review</button></div>`).join('');
    const recent=db.audit.slice(0,5).map(a=>`<div class="stat-line"><div><b>${esc2(a.action)}</b><div class="muted">${esc2(a.user||'Staff')}</div></div><span>${esc2(a.time||'')}</span></div>`).join('');
    const availability=Math.round(total?available/total*100:0);
    content.innerHTML=`<div class="dashboard-hero"><div><span class="eyebrow" style="color:#9fc2ff!important">STAFF WORKSPACE · LIVE</span><h1>${greeting}, ${esc2(first)}</h1><p>Everything important is visible. Everything else stays out of your way.</p></div><div class="hero-metrics"><div class="hero-metric"><b>${available}</b><span>available</span></div><div class="hero-metric"><b>${active.length}</b><span>on loan</span></div><div class="hero-metric"><b>${overdue.length}</b><span>overdue</span></div></div></div>
      <div class="today-strip panel" style="margin-bottom:18px;padding:14px 18px"><div style="display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:9px"><span class="pulse-dot"></span><b style="font-size:12px">Library workspace is running normally</b><span class="muted" style="font-size:11px">· ${fmtDate(today())}</span></div><span class="command-hint">Quick actions <kbd>Ctrl K</kbd></span></div></div>
      <div class="kpis"><div class="kpi kpi-click" onclick="route('students')"><div class="label">Students</div><div class="value">${db.students.length}</div><div class="trend">Central records</div></div><div class="kpi kpi-click" onclick="route('books')"><div class="label">Available copies</div><div class="value">${available}</div><div class="trend">${availability}% of collection</div></div><div class="kpi kpi-click" onclick="route('due')"><div class="label">Needs attention</div><div class="value">${overdue.length+ready}</div><div class="trend">${overdue.length} overdue · ${ready} ready</div></div><div class="kpi"><div class="label">Outstanding fines</div><div class="value">₹${fines}</div><div class="trend">Across active loans</div></div></div>
      <div class="grid2"><div class="panel"><div class="panel-head"><div><h3>Attention required</h3><small>Only things that need a staff decision.</small></div><button class="btn-sm" onclick="route('due')">View all</button></div>${attention||`<div class="empty-state-pro"><div class="empty-icon">✓</div><b>Nothing urgent right now</b><span>Circulation is within the current library rules.</span></div>`}</div><div class="panel"><div class="panel-head"><div><h3>Collection health</h3><small>Availability calculated from active circulation.</small></div><button class="btn-sm" onclick="route('analytics')">Explore</button></div><div class="health-number">${availability}%</div><p class="muted">of all copies are available</p><div class="progress"><span style="width:${availability}%"></span></div><div class="stat-line"><b>Active loans</b><span>${active.length}</span></div><div class="stat-line"><b>Ready reservations</b><span>${ready}</span></div><div class="stat-line"><b>Total titles</b><span>${db.books.length}</span></div></div></div>
      <div class="panel"><div class="panel-head"><div><h3>Recent activity</h3><small>A quiet timeline of what just happened.</small></div><button class="btn-sm" onclick="route('activity')">Open log</button></div>${recent||'<div class="empty">No activity yet.</div>'}</div>`;
  };
  window.addEventListener('load',()=>{
    const old=window.dashboard; window.dashboard=window.ownDashboard;
    try{if(typeof currentUser!=='undefined'&&currentUser)route('dashboard')}catch(e){}
  });
})();
try{document.getElementById('globalSearchTrigger')?.addEventListener('click',e=>{if(e.target.id!=='globalSearch')openCommandPalette()})}catch(e){}

/* V23 natural form + QR deep-link enhancement */
/* V23: natural student selectors + book QR deep links */
(function(){
  const DEPARTMENTS = [
    'Computer Science & AI','Computer Science','Information Technology','Data Science',
    'Artificial Intelligence','Electronics & Communication','Electrical Engineering',
    'Mechanical Engineering','Civil Engineering','Business Administration','Commerce',
    'Mathematics','Physics','Other'
  ];
  const SEMESTERS = ['1','2','3','4','5','6','7','8'];
  const opts=(items,selected='')=>items.map(v=>`<option value="${esc(v)}" ${String(v)===String(selected)?'selected':''}>${esc(v)}</option>`).join('');
  const select=(id,label,items,required=true)=>`<div class="form-field"><label for="${id}">${label}</label><select id="${id}" ${required?'required':''}><option value="" disabled selected>Select ${label.toLowerCase()}</option>${opts(items)}</select></div>`;

  window.studentModal=function(){
    modal(`<div class="natural-form-modal"><div class="modal-title"><div><span class="eyebrow">STUDENT RECORD</span><h2>Add Student</h2><p class="muted">Create a student record and optional login account.</p></div></div>
      <form id="studentForm"><div class="form-grid">
        <div class="form-field"><label for="sId">Student ID</label><input id="sId" placeholder="e.g. STU2026042" required></div>
        <div class="form-field"><label for="sName">Full Name</label><input id="sName" placeholder="Student full name" required></div>
        <div class="form-field"><label for="sEmail">Email</label><input id="sEmail" type="email" placeholder="student@university.edu" required></div>
        <div class="form-field"><label for="sMobile">Mobile</label><input id="sMobile" inputmode="numeric" placeholder="10-digit mobile number" required></div>
        ${select('sDept','Department',DEPARTMENTS)}
        ${select('sSem','Semester',SEMESTERS)}
        <div class="form-field"><label for="sPass">Login Password</label><input id="sPass" type="password" minlength="6" placeholder="Minimum 6 characters" required></div>
      </div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Create Student</button></div></form></div>`);
    document.getElementById('studentForm').onsubmit=e=>{
      e.preventDefault();
      const sid=sId.value.trim(),name=sName.value.trim(),email=sEmail.value.trim().toLowerCase(),pass=sPass.value;
      if(db.students.some(x=>x.studentId.toLowerCase()===sid.toLowerCase()))return toast('Student ID already exists','error');
      if(db.users.some(x=>x.email.toLowerCase()===email))return toast('Email already exists','error');
      const id=Math.max(0,...db.students.map(x=>Number(x.id)||0))+1;
      db.students.push({id,studentId:sid,name,department:sDept.value,semester:sSem.value,mobile:sMobile.value.trim(),email,joined:today()});
      db.users.push({id:Math.max(0,...db.users.map(x=>Number(x.id)||0))+1,email,password:pass,role:'student',name,studentId:sid,active:true});
      saveDB();addAudit(`Added student ${sid}`);closeModal();toast('Student created successfully','success');studentsPage();
    };
  };

  window.registerStudentModal=function(){
    modal(`<div class="natural-form-modal"><div class="modal-title"><div><span class="eyebrow">STUDENT ACCOUNT</span><h2>Create Student Account</h2><p class="muted">Create your student record and login in one step.</p></div></div>
      <form id="registerForm"><div class="form-grid">
        <div class="form-field"><label for="rStudentId">Student ID</label><input id="rStudentId" placeholder="e.g. STU2026042" required></div>
        <div class="form-field"><label for="rName">Full Name</label><input id="rName" placeholder="Student full name" required></div>
        <div class="form-field"><label for="rEmail">University Email</label><input id="rEmail" type="email" placeholder="you@university.edu" required></div>
        <div class="form-field"><label for="rMobile">Mobile</label><input id="rMobile" inputmode="numeric" placeholder="10-digit mobile number" required></div>
        ${select('rDept','Department',DEPARTMENTS)}
        ${select('rSem','Semester',SEMESTERS)}
        <div class="form-field"><label for="rPass">Password</label><input id="rPass" type="password" minlength="6" placeholder="Minimum 6 characters" required></div>
        <div class="form-field"><label for="rPass2">Confirm Password</label><input id="rPass2" type="password" minlength="6" placeholder="Repeat password" required></div>
      </div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Create Account</button></div></form></div>`);
    document.getElementById('registerForm').onsubmit=e=>{e.preventDefault();const sid=rStudentId.value.trim(),name=rName.value.trim(),email=rEmail.value.trim().toLowerCase(),pass=rPass.value;if(pass!==rPass2.value)return toast('Passwords do not match','error');if(db.students.some(s=>s.studentId.toLowerCase()===sid.toLowerCase()))return toast('Student ID already exists','error');if(db.users.some(u=>u.email.toLowerCase()===email))return toast('Email already exists','error');const id=Math.max(0,...db.students.map(s=>Number(s.id)||0))+1;db.students.push({id,studentId:sid,name,department:rDept.value,semester:rSem.value,mobile:rMobile.value.trim(),email,joined:today()});db.users.push({id:Math.max(0,...db.users.map(u=>Number(u.id)||0))+1,email,password:pass,role:'student',name,studentId:sid,active:true});saveDB();closeModal();toast('Student account created successfully','success');};
  };

  // Teacher account registration
  window.registerTeacherModal=function(){
    modal(`<div class="natural-form-modal"><div class="modal-title"><div>
      <span class="eyebrow">TEACHER ACCOUNT</span><h2>Create Teacher Account</h2>
      <p class="muted">Create a faculty library login in one step.</p></div></div>
      <form id="teacherRegisterForm"><div class="form-grid">
        <div class="form-field"><label for="tTeacherId">Teacher ID</label><input id="tTeacherId" placeholder="e.g. TCH2026042" required></div>
        <div class="form-field"><label for="tName">Full Name</label><input id="tName" placeholder="Teacher full name" required></div>
        <div class="form-field"><label for="tEmail">University Email</label><input id="tEmail" type="email" placeholder="teacher@university.edu" required></div>
        <div class="form-field"><label for="tMobile">Mobile</label><input id="tMobile" inputmode="numeric" placeholder="10-digit mobile number" required></div>
        ${select('tDept','Department',DEPARTMENTS)}
        <div class="form-field"><label for="tPass">Password</label><input id="tPass" type="password" minlength="6" placeholder="Minimum 6 characters" required></div>
        <div class="form-field"><label for="tPass2">Confirm Password</label><input id="tPass2" type="password" minlength="6" placeholder="Repeat password" required></div>
      </div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Create Teacher Account</button></div></form></div>`);
    document.getElementById('teacherRegisterForm').onsubmit=e=>{
      e.preventDefault();
      const tid=tTeacherId.value.trim(),name=tName.value.trim(),email=tEmail.value.trim().toLowerCase(),pass=tPass.value;
      if(pass!==tPass2.value)return toast('Passwords do not match','error');
      if(db.users.some(u=>String(u.teacherId||"").toLowerCase()===tid.toLowerCase()))return toast('Teacher ID already exists','error');
      if(db.users.some(u=>String(u.email||"").toLowerCase()===email))return toast('Email already exists','error');
      const id=Math.max(0,...db.users.map(u=>Number(u.id)||0))+1;
      db.users.push({id,email,password:pass,role:'teacher',name,teacherId:tid,department:tDept.value,semester:'Faculty',mobile:tMobile.value.trim(),active:true});
      saveDB();closeModal();toast('Teacher account created successfully','success');
    };
  };

  // QR payload is a compact deep link when the app is served over HTTP(S).
  // On file:// / offline builds it falls back to self-contained JSON.
  window.bookQRPayload=function(b){
    const base=(location.protocol==='http:'||location.protocol==='https:') ? `${location.origin}${location.pathname}` : '';
    if(base) return `${base}?book=${encodeURIComponent(b.bookId||b.id)}`;
    return JSON.stringify({type:'library-book',version:2,bookId:b.bookId||'',barcode:b.barcode||b.bookId||'',isbn:b.isbn||'',title:b.title||'',author:b.author||'',category:b.category||'',available:Number(b.stock||0),total:Number(b.total||0),rack:b.rack||''});
  };

  window.openPublicBook=function(bookId){
    const b=db.books.find(x=>String(x.id)===String(bookId)||String(x.bookId).toLowerCase()===String(bookId).toLowerCase());
    if(!b){document.getElementById('loginScreen')?.classList.remove('hidden');return;}
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('app')?.classList.add('hidden');
    let el=document.getElementById('publicBookScreen');
    if(!el){el=document.createElement('section');el.id='publicBookScreen';document.body.appendChild(el);}
    const active=db.loans.find(l=>Number(l.bookId)===Number(b.id)&&l.status!=='Returned');
    el.innerHTML=`<div class="public-book-shell"><div class="public-book-brand"><div class="brand-mark">SL</div><div><b>Smart Library</b><span>Book Information</span></div></div><main class="public-book-card"><div class="public-book-top"><span class="eyebrow">LIBRARY CATALOG</span><span class="badge ${b.stock?'green':'red'}">${b.stock?`${b.stock} available`:'Currently unavailable'}</span></div><h1>${esc(b.title)}</h1><p class="public-author">${esc(b.author)}</p><div class="public-book-grid"><div><span>Book ID</span><b>${esc(b.bookId)}</b></div><div><span>ISBN</span><b>${esc(b.isbn||'—')}</b></div><div><span>Category</span><b>${esc(b.category||'—')}</b></div><div><span>Rack</span><b>${esc(b.rack||'—')}</b></div><div><span>Copies</span><b>${b.stock}/${b.total} available</b></div><div><span>Status</span><b>${active?'On loan':'Ready to issue'}</b></div></div>${active?`<div class="public-note">This title is currently issued. Check the library reservation queue for availability.</div>`:`<div class="public-note">This is a live catalog record from Smart Library.</div>`}<button class="primary public-close" onclick="history.back()">Close</button></main></div>`;
  };

  window.lookupScannedBook=function(raw){
    const rawValue=(raw||document.getElementById('scannerInput')?.value||'').trim();if(!rawValue)return toast('Scan a QR code or enter a Book ID','error');
    let code=rawValue.toLowerCase(),qrData=null;
    try{const u=new URL(rawValue,location.href);if(u.searchParams.has('book')){code=u.searchParams.get('book').toLowerCase();qrData={type:'deep-link'};}}catch(e){}
    if(!qrData){try{const parsed=JSON.parse(rawValue);if(parsed?.type==='library-book'){qrData=parsed;code=String(parsed.bookId||parsed.barcode||parsed.isbn||'').toLowerCase()}}catch(e){}}
    const b=db.books.find(x=>(x.bookId||'').toLowerCase()===code||(x.barcode||'').toLowerCase()===code||(x.isbn||'').toLowerCase()===code||(String(x.id)===code));
    const box=document.getElementById('scannerResult')||document.getElementById('circulationScanResult');if(!box)return;
    if(!b){box.innerHTML=`<h3>Book not found</h3><p class="muted">No catalog record matches <b>${esc(rawValue)}</b>.</p><div class="scanner-controls"><input id="scannerInput" value="${esc(rawValue)}"><button class="primary" onclick="lookupScannedBook()">Search Again</button></div>`;return toast('No book matched that QR or barcode','error')}
    const active=db.loans.find(l=>Number(l.bookId)===Number(b.id)&&l.status!=='Returned');
    if(active){const s=student(active.studentId);const sel=document.getElementById('returnLoan');if(sel)sel.value=String(active.id);box.innerHTML=`<div class="scan-book-head"><div><span class="eyebrow">BOOK IDENTIFIED</span><h3>${esc(b.title)}</h3><p>${esc(b.author)} · <b>${esc(b.bookId)}</b></p></div><span class="badge red">ON LOAN</span></div><div class="scan-book-facts"><span>Category <b>${esc(b.category)}</b></span><span>ISBN <b>${esc(b.isbn||'—')}</b></span><span>Rack <b>${esc(b.rack||'—')}</b></span><span>Issued to <b>${esc(s?.name||'Unknown')}</b></span></div><p class="mini-note">Due ${fmtDate(active.dueDate)} · Current fine ₹${active.fine||0}</p><button class="primary" onclick="returnBook(${active.id})">Return This Book</button>`}
    else {const sel=document.getElementById('issueBookSelect');if(sel)sel.value=String(b.id);box.innerHTML=`<div class="scan-book-head"><div><span class="eyebrow">BOOK IDENTIFIED</span><h3>${esc(b.title)}</h3><p>${esc(b.author)} · <b>${esc(b.bookId)}</b></p></div><span class="badge green">AVAILABLE</span></div><div class="scan-book-facts"><span>Category <b>${esc(b.category)}</b></span><span>ISBN <b>${esc(b.isbn||'—')}</b></span><span>Rack <b>${esc(b.rack||'—')}</b></span><span>Copies <b>${b.stock}/${b.total}</b></span></div><p class="mini-note">Book selected for issue. Choose the borrower (student or teacher) and confirm issue below.</p><button class="primary" onclick="document.getElementById('issueForm').scrollIntoView({behavior:'smooth'})">Continue to Issue</button>`;}
    const inp=document.getElementById('scannerInput');if(inp)inp.value=b.barcode||b.bookId;
  };

  function handlePublicQR(){
    const id=new URLSearchParams(location.search).get('book');
    if(id && typeof db!=='undefined'){setTimeout(()=>openPublicBook(id),60);}
  }
  window.addEventListener('load',handlePublicQR);
})();


/* ===== MERGED V24 SCRIPTS ===== */
/* SMART LIBRARY — original experience layer */
(function(){
  const $=id=>document.getElementById(id);
  function esc2(v){return typeof esc==='function'?esc(v):String(v??'');}
  function openCommandPalette(){
    if($('commandOverlay')){$('commandOverlay').classList.remove('hidden');$('commandInput')?.focus();return;}
    const overlay=document.createElement('div');overlay.id='commandOverlay';overlay.className='command-overlay';overlay.innerHTML=`<div class="command-box" role="dialog" aria-modal="true" aria-label="Quick actions"><div class="command-search"><input id="commandInput" autocomplete="off" placeholder="Search books, students, or an action…"></div><div class="command-list" id="commandList"></div><div class="command-foot"><span>Enter to open · Esc to close</span><span>Smart Library</span></div></div>`;
    document.body.appendChild(overlay); overlay.addEventListener('click',e=>{if(e.target===overlay)closeCommandPalette()});
    const input=$('commandInput'); input.addEventListener('input',()=>paintCommands(input.value)); input.addEventListener('keydown',e=>{if(e.key==='Escape')closeCommandPalette();if(e.key==='Enter'){const first=document.querySelector('.command-item');if(first)first.click()}}); paintCommands('');
  }
  function closeCommandPalette(){$('commandOverlay')?.classList.add('hidden')}
  function paintCommands(q){
    const term=(q||'').trim().toLowerCase(); const items=[];
    const actions=currentUser?.role==='student' ? [
      ['Browse books','Open the live catalog','catalog'],['My books','View borrowing history','my-books'],['Reservations','View reservations','reservations'],['Semester calendar','Open academic dates','schedule'],['Notifications','See library notices','notifications'],['My account','Open profile','account']
    ]:[['Open circulation','Issue or return a book','issue'],['Library catalog','Search and manage books','books'],['Students','Manage student records','students'],['Due & fines','Review overdue items','due'],['Reservations','Manage reservation queue','reservations'],['Analytics','Open live analytics','analytics'],['Library map','Find a rack','floor-map'],['Activity log','Review system actions','activity'],['Reports','Export and backup data','reports']];
    actions.forEach(a=>{if(!term||a.join(' ').toLowerCase().includes(term))items.push(a)});
    if(typeof db!=='undefined'){
      db.books.filter(b=>`${b.title} ${b.author} ${b.bookId} ${b.barcode||''}`.toLowerCase().includes(term)).slice(0,5).forEach(b=>items.push([b.title,`${b.author} · ${b.bookId}`,'book',b.id]));
      if(currentUser?.role!=='student') db.students.filter(s=>`${s.name} ${s.studentId} ${s.email}`.toLowerCase().includes(term)).slice(0,5).forEach(s=>items.push([s.name,`${s.studentId} · ${s.department}`,'student',s.id]));
    }
    $('commandList').innerHTML=items.slice(0,12).map((a,i)=>`<button class="command-item" data-kind="${a[2]}" data-id="${a[3]??''}"><div><b>${esc2(a[0])}</b><span>${esc2(a[1])}</span></div><span>${a[2]==='book'?'BOOK':a[2]==='student'?'STUDENT':'OPEN'}</span></button>`).join('')||`<div class="empty">No matching library action.</div>`;
    document.querySelectorAll('.command-item').forEach(b=>b.onclick=()=>{const kind=b.dataset.kind,id=b.dataset.id;closeCommandPalette();if(kind==='book'){route('books');setTimeout(()=>{const x=document.getElementById('bookSearch');if(x){x.value=b.querySelector('b')?.textContent||'';filterBooks?.()}},80)}else if(kind==='student'){route('students');setTimeout(()=>{const x=document.getElementById('studentSearch');if(x){x.value=b.querySelector('b')?.textContent||'';filterStudents?.()}},80)}else route(kind)});
  }
  window.openCommandPalette=openCommandPalette;
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommandPalette()}if(e.key==='Escape')closeCommandPalette()});

  window.ownDashboard=function(){
    if(currentUser?.role==='student')return studentDashboard();
    if(typeof normalizeProfessionalLoans==='function')normalizeProfessionalLoans();
    const active=db.loans.filter(l=>l.status!=='Returned'), overdue=active.filter(l=>l.status==='Overdue');
    const available=db.books.reduce((n,b)=>n+Number(b.stock||0),0), total=db.books.reduce((n,b)=>n+Number(b.total||0),0);
    const ready=(db.reservations||[]).filter(r=>r.status==='Ready').length;
    const fines=active.reduce((n,l)=>n+Math.max(0,(Number(l.fine)||0)-(Number(l.paidFine)||0)),0);
    const hour=new Date().getHours(); const greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
    const first=(currentUser.name||'Staff').split(' ')[0];
    const attention=overdue.slice(0,4).map(l=>`<div class="attention-row"><span class="badge red">OVERDUE</span><div><b>${esc2(borrower(l)?.name||'Unknown')}</b><span>${esc2(book(l.bookId)?.title||'Unknown')} · due ${esc2(fmtDate(l.dueDate))}</span></div><button class="btn-sm" onclick="route('due')">Review</button></div>`).join('');
    const recent=db.audit.slice(0,5).map(a=>`<div class="stat-line"><div><b>${esc2(a.action)}</b><div class="muted">${esc2(a.user||'Staff')}</div></div><span>${esc2(a.time||'')}</span></div>`).join('');
    const availability=Math.round(total?available/total*100:0);
    content.innerHTML=`<div class="dashboard-hero"><div><span class="eyebrow" style="color:#9fc2ff!important">STAFF WORKSPACE · LIVE</span><h1>${greeting}, ${esc2(first)}</h1><p>Everything important is visible. Everything else stays out of your way.</p></div><div class="hero-metrics"><div class="hero-metric"><b>${available}</b><span>available</span></div><div class="hero-metric"><b>${active.length}</b><span>on loan</span></div><div class="hero-metric"><b>${overdue.length}</b><span>overdue</span></div></div></div>
      <div class="today-strip panel" style="margin-bottom:18px;padding:14px 18px"><div style="display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:9px"><span class="pulse-dot"></span><b style="font-size:12px">Library workspace is running normally</b><span class="muted" style="font-size:11px">· ${fmtDate(today())}</span></div><span class="command-hint">Quick actions <kbd>Ctrl K</kbd></span></div></div>
      <div class="kpis"><div class="kpi kpi-click" onclick="route('students')"><div class="label">Students</div><div class="value">${db.students.length}</div><div class="trend">Central records</div></div><div class="kpi kpi-click" onclick="route('books')"><div class="label">Available copies</div><div class="value">${available}</div><div class="trend">${availability}% of collection</div></div><div class="kpi kpi-click" onclick="route('due')"><div class="label">Needs attention</div><div class="value">${overdue.length+ready}</div><div class="trend">${overdue.length} overdue · ${ready} ready</div></div><div class="kpi"><div class="label">Outstanding fines</div><div class="value">₹${fines}</div><div class="trend">Across active loans</div></div></div>
      <div class="grid2"><div class="panel"><div class="panel-head"><div><h3>Attention required</h3><small>Only things that need a staff decision.</small></div><button class="btn-sm" onclick="route('due')">View all</button></div>${attention||`<div class="empty-state-pro"><div class="empty-icon">✓</div><b>Nothing urgent right now</b><span>Circulation is within the current library rules.</span></div>`}</div><div class="panel"><div class="panel-head"><div><h3>Collection health</h3><small>Availability calculated from active circulation.</small></div><button class="btn-sm" onclick="route('analytics')">Explore</button></div><div class="health-number">${availability}%</div><p class="muted">of all copies are available</p><div class="progress"><span style="width:${availability}%"></span></div><div class="stat-line"><b>Active loans</b><span>${active.length}</span></div><div class="stat-line"><b>Ready reservations</b><span>${ready}</span></div><div class="stat-line"><b>Total titles</b><span>${db.books.length}</span></div></div></div>
      <div class="panel"><div class="panel-head"><div><h3>Recent activity</h3><small>A quiet timeline of what just happened.</small></div><button class="btn-sm" onclick="route('activity')">Open log</button></div>${recent||'<div class="empty">No activity yet.</div>'}</div>`;
  };
  window.addEventListener('load',()=>{
    const old=window.dashboard; window.dashboard=window.ownDashboard;
    try{if(typeof currentUser!=='undefined'&&currentUser)route('dashboard')}catch(e){}
  });
})();


/* ===== MERGED V24 SCRIPTS ===== */
/* Smart Library V22 — navigation + calm dashboard shell */
(function(){
  function v22Nav(){
    const student=currentUser?.role==='student';
    const groups=student?[
      ['Library',[['dashboard','⌂','Dashboard'],['my-books','▣','My Books'],['catalog','▤','Book Catalog'],['online-books','◎','Online Discovery'],['reservations','◫','Reservations'],['schedule','□','Calendar']]],
      ['Personal',[['notifications','♢','Notifications'],['reports','▥','My Reports'],['account','◎','My Account']]]
    ]:[
      ['Library',[['dashboard','⌂','Dashboard'],['books','▤','Books'],['online-books','◎','Online Discovery'],['issue','⇄','Circulation'],['students','♙','Students'],['reservations','◫','Reservations']]],
      ['Operations',[['due','◷','Due & Fines'],['notifications','♢','Notifications'],['schedule','□','Calendar']]],
      ['Insights',[['analytics','◌','Analytics'],['floor-map','⌗','Library Map']]],
      ['Management',[['reports','▥','Reports'],['activity','•','Activity'],['print-center','▤','Print Center'],['settings','⚙','Settings']]]
    ];
    nav.innerHTML=groups.map(g=>`<div class="nav-group"><div class="nav-group-label">${g[0]}</div>${g[1].map(x=>v8NavButton(...x)).join('')}</div>`).join('');
    document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.onclick=()=>{route(b.dataset.page);sidebar?.classList.remove('open');sidebarOverlay?.classList.remove('show')});
  }
  function v22Route(page){
    sidebar?.classList.remove('open');sidebarOverlay?.classList.remove('show');
    document.querySelectorAll('.nav-item[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));
    const pages={dashboard,students:studentsPage,books:booksPage,issue:issuePage,due:professionalDuePage,notifications:notificationsPage,reports:reportsPage,schedule:schedulePage,settings:professionalSettings,'my-books':myBooksPage,catalog:catalogPage,'online-books':onlineBooksPage,account:accountPage,analytics:v8AnalyticsPage,'floor-map':v8FloorMapPage,'print-center':v8PrintCenterPage,activity:v8ActivityPage,reservations:professionalReservationsPage};
    (pages[page]||dashboard)();document.scrollingElement?.scrollTo({top:0,behavior:'smooth'});
  }
  function v22Dashboard(){
    if(currentUser?.role==='student') return studentDashboard();
    normalizeProfessionalLoans();
    const active=db.loans.filter(l=>l.status!=='Returned'), overdue=active.filter(l=>l.status==='Overdue');
    const available=db.books.reduce((n,b)=>n+Number(b.stock||0),0), total=db.books.reduce((n,b)=>n+Number(b.total||0),0);
    const ready=db.reservations.filter(r=>r.status==='Ready').length;
    const fines=active.reduce((n,l)=>n+Math.max(0,(Number(l.fine)||0)-(Number(l.paidFine)||0)),0);
    const first=(currentUser.name||'Staff').split(' ')[0], hour=new Date().getHours(), greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
    const attention=overdue.slice(0,4).map(l=>`<div class="attention-row"><span class="badge red">OVERDUE</span><div><b>${esc(borrower(l)?.name||'Unknown')}</b><span>${esc(book(l.bookId)?.title||'Unknown')} · ${esc(fmtDate(l.dueDate))}</span></div><button class="btn-sm" onclick="route('due')">Review</button></div>`).join('');
    const recent=db.audit.slice(0,5).map(a=>`<div class="stat-line"><div><b>${esc(a.action)}</b><div class="muted">${esc(a.user||'Staff')}</div></div><span>${esc(a.time||'')}</span></div>`).join('');
    const pct=total?Math.round(available/total*100):0;
    content.innerHTML=`<div class="page-head"><div><span class="eyebrow">STAFF WORKSPACE · LIVE</span><h1>${greeting}, ${esc(first)}</h1><p>Everything important, without the visual noise.</p></div><div class="actions"><button class="ghost" onclick="route('reservations')">Reservations ${ready?`<span class="badge orange">${ready}</span>`:''}</button><button class="primary" onclick="route('issue')">Open circulation</button></div></div>
    <div class="kpis"><div class="kpi kpi-click" onclick="route('students')"><div class="label">STUDENTS</div><div class="value">${db.students.length}</div><div class="trend">Active records</div></div><div class="kpi kpi-click" onclick="route('books')"><div class="label">AVAILABLE COPIES</div><div class="value">${available}</div><div class="trend">${pct}% of collection</div></div><div class="kpi kpi-click" onclick="route('due')"><div class="label">OVERDUE</div><div class="value">${overdue.length}</div><div class="trend">${overdue.length?'Needs attention':'All clear'}</div></div><div class="kpi"><div class="label">OUTSTANDING FINES</div><div class="value">₹${fines}</div><div class="trend">Across active loans</div></div></div>
    <div class="grid2"><div class="panel"><div class="panel-head"><div><h3>Attention required</h3><small>Only items that need staff action.</small></div><button class="btn-sm" onclick="route('due')">View all</button></div>${attention||'<div class="empty-state-pro"><div class="empty-icon">✓</div><b>Nothing urgent right now</b><span>Circulation is within the current rules.</span></div>'}</div>
    <div class="panel"><div class="panel-head"><div><h3>Collection</h3><small>Current availability.</small></div><button class="btn-sm" onclick="route('analytics')">Analytics</button></div><div class="health-number">${pct}%</div><p class="muted">of copies are available</p><div class="progress"><span style="width:${pct}%"></span></div><div class="stat-line"><b>Active loans</b><span>${active.length}</span></div><div class="stat-line"><b>Ready reservations</b><span>${ready}</span></div></div></div>
    <div class="panel"><div class="panel-head"><div><h3>Recent activity</h3><small>A simple record of recent changes.</small></div><button class="btn-sm" onclick="route('activity')">Open log</button></div>${recent||'<div class="empty">No activity yet.</div>'}</div>`;
  }
  window.addEventListener('load',()=>{
    try{if(currentUser&&currentUser.role!=='teacher'){dashboard=v22Dashboard;professionalDashboard=v22Dashboard;}if(currentUser){buildNav();route('dashboard');}}catch(e){console.error('V22 shell',e)}
  });
})();


/* ===== MERGED V24 SCRIPTS ===== */
/* Smart Library V22.1 — circulation + QR workflow refinement */
(function(){
  function esc2(v){return typeof esc==='function'?esc(v):String(v??'')}

  function circulationPage(){
    normalizeProfessionalLoans?.();
    const active=db.loans.filter(l=>l.status!=='Returned');
    const available=db.books.filter(b=>Number(b.stock)>0);
    const overdue=active.filter(l=>l.status==='Overdue').length;
    const students=db.students||[];
    const teachers=(db.users||[]).filter(u=>u.role==='teacher'&&u.active!==false);
    const people=[
      ...students.map(s=>({type:'Student',id:String(s.studentId||s.id),name:s.name||'',department:s.department||'',ref:s})),
      ...teachers.map(t=>({type:'Teacher',id:String(t.teacherId||t.id),name:t.name||'',department:t.department||'',ref:t}))
    ];

    content.innerHTML=`
      <div class="page-head">
        <div><span class="eyebrow">LIBRARY OPERATIONS</span><h1>Circulation</h1><p>Issue books to registered students or teachers from one focused workspace.</p></div>
        <div class="actions"><button class="ghost" onclick="route('books')">Browse catalog</button><button class="ghost" onclick="generateAllBookQRs()">Book QR codes</button></div>
      </div>

      <div class="circulation-workbench">
        <section class="circulation-card" style="grid-column:1/-1">
          <div class="panel-head">
            <div><h2>Issue a book</h2><small>Search a registered student or teacher by name or ID, then choose a book and due date.</small></div>
            <span class="badge green">${available.length} titles available</span>
          </div>

          <form id="issueForm" class="circulation-form">
            <div class="form-field full-field">
              <label>Student / Teacher</label>
              <input id="issueBorrower" list="issueBorrowerList" placeholder="Search by name or ID..." autocomplete="off" required>
              <datalist id="issueBorrowerList">
                ${people.map(p=>`<option value="${esc2(p.id)} — ${esc2(p.name)}">${esc2(p.type)} · ${esc2(p.department||'')}</option>`).join('')}
              </datalist>
              <small class="muted">Students and registered teachers are both available for circulation.</small>
              <div id="borrowerPreview" class="mini-note" style="margin-top:8px"></div>
            </div>

            <div class="form-field">
              <label>Due date</label>
              <input id="issueDue" type="date" value="${addDays(today(),7)}" min="${today()}" required>
            </div>

            <div class="form-field">
              <label>Book</label>
              <select id="issueBookSelect" required>
                ${available.map(b=>`<option value="${b.id}">${esc2(b.bookId)} — ${esc2(b.title)} · ${b.stock}/${b.total} available</option>`).join('')||'<option value="">No books currently available</option>'}
              </select>
            </div>

            <div class="full-field"><button class="primary" type="submit" style="width:100%">Confirm issue</button></div>
          </form>
        </section>

        <section class="circulation-card">
          <div class="panel-head"><div><h2>Scan & identify</h2><small>Use a library QR/barcode or enter an ID manually.</small></div><span class="badge blue">OPTIONAL</span></div>
          <div class="circulation-scan">
            <div class="scan-frame"><div id="html5-qrcode-reader"></div></div>
            <div id="scannerStatus" class="scanner-status"><span class="dot"></span><span>Camera is off.</span></div>
            <div class="scanner-access"><button class="primary" type="button" onclick="startBarcodeScanner()">Start camera</button><button class="ghost" type="button" onclick="stopBarcodeScanner()">Stop</button></div>
            <div class="circulation-manual"><input id="scannerInput" placeholder="Book ID, barcode or ISBN"><button class="primary" type="button" onclick="lookupScannedBook()">Find</button></div>
            <div id="circulationScanResult" class="circulation-result"><h3>Ready</h3><span class="muted">Scan a book to identify its record and active loan.</span></div>
          </div>
        </section>
      </div>

      <section class="circulation-section panel">
        <div class="panel-head">
          <div><h3>Active circulation</h3><small>${active.length} active loan(s) · ${overdue} overdue</small></div>
          <span class="badge ${overdue?'red':'green'}">${overdue?overdue+' overdue':'All current'}</span>
        </div>
        ${active.length?`
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Borrower</th><th>Type</th><th>Book</th><th>Issued</th><th>Due</th><th>Status</th><th>Fine</th><th></th></tr></thead>
          <tbody>
          ${active.map(l=>{
            const s=borrower(l), b=book(l.bookId), type=l.teacherId?'Teacher':'Student';
            return `<tr>
              <td><b>${esc2(s?.name||'Unknown')}</b><div class="muted">${esc2(s?.studentId||'')}</div></td>
              <td><span class="badge ${type==='Teacher'?'blue':'green'}">${type}</span></td>
              <td><b>${esc2(b?.title||'Unknown')}</b><div class="muted">${esc2(b?.bookId||'')}</div></td>
              <td>${fmtDate(l.issueDate)}</td><td>${fmtDate(l.dueDate)}</td>
              <td>${statusBadge(l.status)}</td><td>₹${Number(l.fine)||0}</td>
              <td><button class="btn-sm primary" onclick="returnBook(${l.id})">Return</button></td>
            </tr>`;
          }).join('')}
          </tbody></table></div>`:
          `<div class="empty-state-pro"><div class="empty-icon">✓</div><b>No active loans</b><span>The circulation desk is clear.</span></div>`}
      </section>`;

    const input=document.getElementById('issueBorrower');
    const preview=document.getElementById('borrowerPreview');
    const updatePreview=()=>{
      const q=(input?.value||'').trim().toLowerCase();
      if(!q){preview.innerHTML='';return;}
      const idq=q.split(' — ')[0].trim();
      const matches=people.filter(p=>p.id.toLowerCase()===idq || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
      if(matches.length===1){
        const p=matches[0];
        preview.innerHTML=`<span class="badge ${p.type==='Teacher'?'blue':'green'}">${p.type}</span> <b>${esc2(p.name)}</b> · ${esc2(p.id)}${p.department?` · ${esc2(p.department)}`:''}`;
      }else if(matches.length>1){
        preview.textContent=`${matches.length} matching records — choose the required name/ID from the suggestions.`;
      }else{
        preview.textContent='No registered student or teacher matched this search.';
      }
    };
    input?.addEventListener('input',updatePreview);
    input?.addEventListener('change',updatePreview);
    document.getElementById('issueForm').onsubmit=e=>{e.preventDefault();issueBook()};
  }

  window.openBookQRNatural=function(bookId){openBookQR(bookId)};
  window.issuePage=circulationPage;
  window.v22CirculationPage=circulationPage;

  /* Route override: preserve every existing page, replace only circulation. */
  window.addEventListener('load',()=>{
    try{
      if(typeof window.route==='function'){
        const base=window.route;
        window.route=function(page){if(page==='issue')return typeof window.issuePage==='function'?window.issuePage():circulationPage();return base(page)};
        if(currentUser) window.route('dashboard');
      }
    }catch(e){console.warn('V22.1 route refinement',e)}
  });

  /* When a scan result is rendered, also mirror it into the compact circulation result. */
  const originalLookup=window.lookupScannedBook;
  if(originalLookup){
    window.lookupScannedBook=function(raw){
      originalLookup(raw);
      setTimeout(()=>{
        const old=document.getElementById('scannerResult'), target=document.getElementById('circulationScanResult');
        if(old&&target) target.innerHTML=old.innerHTML;
      },40);
    };
  }
})();


/* ===== MERGED V24 SCRIPTS ===== */
/* Smart Library V24 - Teacher workspace, popular books and laptop-camera QR scanner */
(function(){
  const teacherSeed = {
    id: 21,
    email: "teacher@university.edu",
    password: "teacher123",
    role: "teacher",
    name: "Dr. Ayesha Rahman",
    teacherId: "TCH2026001",
    department: "Computer Science & AI",
    active: true
  };

  function ensureV24Data(){
    db.users ||= [];
    if(!db.users.some(u=>String(u.email||"").toLowerCase()==="teacher@university.edu")){
      db.users.push({...teacherSeed});
    }
    db.teachers ||= [{
      id:1, teacherId:"TCH2026001", name:"Dr. Ayesha Rahman",
      department:"Computer Science & AI", email:"teacher@university.edu"
    }];
    db.teacherRequests ||= [];
    saveDB();
  }

  function isTeacher(){ return currentUser?.role === "teacher"; }

  function v24RoleText(){
    if(!currentUser) return "Library User";
    if(isTeacher()) return currentUser.name;
    if(currentUser.role==="student") return currentUser.name;
    return currentUser.name || "Library Staff";
  }

  function v24ShowApp(){
    document.getElementById("loginScreen")?.classList.add("hidden");
    document.getElementById("app")?.classList.remove("hidden");
    if(typeof roleChip!=="undefined" && roleChip){
      roleChip.textContent = isTeacher() ? "TEACHER" : currentUser?.role==="student" ? "STUDENT" : "STAFF";
    }
    if(typeof topName!=="undefined" && topName) topName.textContent=v24RoleText();
    if(typeof topRole!=="undefined" && topRole) topRole.textContent=isTeacher()?"Teacher":currentUser?.role==="student"?"Student":"Staff";
    if(typeof avatar!=="undefined" && avatar) avatar.textContent=(currentUser?.name||"U")[0].toUpperCase();
    v24BuildNav();
    refreshNotifCount?.();
    route("dashboard");
  }

  function navButton(id,icon,label){
    return `<button class="nav-item" data-page="${id}"><span>${icon}</span>${label}</button>`;
  }

  function v24BuildNav(){
    if(!currentUser || typeof nav==="undefined" || !nav) return;
    let groups;
    if(isTeacher()){
      groups=[
        ["Teacher Workspace",[
          ["dashboard","⌂","Dashboard"],
          ["teacher-catalog","▤","Book Catalog"],
          ["teacher-requests","◫","Book Requests"],
          ["teacher-books","▣","My Books"]
        ]],
        ["Personal",[
          ["schedule","□","Academic Calendar"],
          ["notifications","♢","Notifications"],
          ["account","◎","My Account"]
        ]]
      ];
    } else if(currentUser.role==="student"){
      groups=[
        ["Workspace",[
          ["dashboard","⌂","Dashboard"],["my-books","▣","My Books"],["catalog","▤","Book Catalog"],
          ["online-books","◎","Online Discovery"],["reservations","◫","Reservations"],["schedule","□","Semester Calendar"]
        ]],
        ["Personal",[["notifications","♢","Notifications"],["reports","▥","My Reports"],["account","◎","My Account"]]]
      ];
    } else {
      groups=[
        ["Workspace",[
          ["dashboard","⌂","Dashboard"],["books","▤","Library Catalog"],["online-books","◎","Online Discovery"],
          ["issue","⇄","Scan & Circulate"],["students","♙","Students"],["reservations","◫","Reservations"]
        ]],
        ["Operations",[["due","◷","Due & Fines"],["notifications","♢","Notifications"],["schedule","□","Academic Calendar"]]],
        ["Insights",[["analytics","◌","Analytics Studio"],["floor-map","⌗","Library Map"]]],
        ["Management",[["reports","▥","Reports Center"],["activity","•","Activity Log"],["print-center","▤","Print Center"],["settings","⚙","Settings"]]]
      ];
    }
    nav.innerHTML=groups.map(g=>`<div class="nav-group"><div class="nav-group-label">${g[0]}</div>${g[1].map(x=>navButton(...x)).join("")}</div>`).join("");
    document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.onclick=()=>{
      route(b.dataset.page);
      document.getElementById("sidebar")?.classList.remove("open");
      document.getElementById("sidebarOverlay")?.classList.remove("show");
    });
  }

  function v24PopularBooks(limit=6){
    return db.books.map(b=>{
      const loans=db.loans.filter(l=>Number(l.bookId)===Number(b.id));
      const active=loans.filter(l=>l.status!=="Returned").length;
      const reservations=(db.reservations||[]).filter(r=>Number(r.bookId)===Number(b.id)&&["Waiting","Ready"].includes(r.status)).length;
      const requests=(db.teacherRequests||[]).filter(r=>Number(r.bookId)===Number(b.id)&&["Pending","Approved"].includes(r.status)).length;
      return {...b,borrowCount:loans.length,activeCount:active,reservationCount:reservations,requestCount:requests,demand:loans.length+reservations+requests};
    }).sort((a,b)=>b.demand-a.demand || b.borrowCount-a.borrowCount || b.activeCount-a.activeCount).slice(0,limit);
  }

  function popularBooksPanel(){
    const arr=v24PopularBooks();
    const max=Math.max(1,...arr.map(b=>b.demand));
    return `<div class="panel v24-popular-panel">
      <div class="panel-head"><div><h3>Popular Books</h3><small>Live borrowing, reservation and teacher request activity.</small></div><span class="badge blue">LIVE</span></div>
      <div class="v24-popular-list">${arr.map((b,i)=>`
        <div class="v24-popular-row">
          <div class="v24-rank">${i+1}</div>
          <div class="v24-popular-main"><b>${esc(b.title)}</b><span>${esc(b.author)} · ${esc(b.category||"General")}</span><div class="v24-demand"><i style="width:${Math.round((b.demand/max)*100)}%"></i></div></div>
          <div class="v24-popular-count"><b>${b.borrowCount}</b><span>borrows</span></div>
        </div>`).join("") || `<div class="empty">No borrowing data yet.</div>`}</div>
      <button class="ghost full" onclick="route('analytics')">Open detailed analytics</button>
    </div>`;
  }

  function v24AdminDashboard(){
    normalizeProfessionalLoans?.();
    const active=db.loans.filter(l=>l.status!=="Returned");
    const overdue=active.filter(l=>l.status==="Overdue");
    const available=db.books.reduce((n,b)=>n+Number(b.stock||0),0);
    const total=db.books.reduce((n,b)=>n+Number(b.total||0),0);
    const ready=(db.reservations||[]).filter(r=>r.status==="Ready").length;
    const fines=active.reduce((n,l)=>n+Math.max(0,(Number(l.fine)||0)-(Number(l.paidFine)||0)),0);
    const attention=overdue.slice(0,4).map(l=>`<div class="attention-row"><span class="badge red">OVERDUE</span><div><b>${esc(borrower(l)?.name||"Unknown")}</b><span>${esc(book(l.bookId)?.title||"Unknown")} · ${esc(fmtDate(l.dueDate))}</span></div><button class="btn-sm" onclick="route('due')">Review</button></div>`).join("");
    content.innerHTML=`<div class="page-head"><div><span class="eyebrow">ADMIN COMMAND CENTER · LIVE</span><h1>Library Dashboard</h1><p>Inventory, circulation and book demand in one place.</p></div><div class="actions"><button class="ghost" onclick="route('books')">Manage Books</button><button class="primary" onclick="route('issue')">Open Circulation</button></div></div>
      <div class="kpis">
        <button class="kpi kpi-click" onclick="route('students')"><div class="label">STUDENTS</div><div class="value">${db.students.length}</div><div class="trend">Active records</div></button>
        <button class="kpi kpi-click" onclick="route('books')"><div class="label">AVAILABLE COPIES</div><div class="value">${available}</div><div class="trend">${total?Math.round(available/total*100):0}% of collection</div></button>
        <button class="kpi kpi-click" onclick="route('due')"><div class="label">OVERDUE</div><div class="value">${overdue.length}</div><div class="trend">${overdue.length?"Needs attention":"All clear"}</div></button>
        <div class="kpi"><div class="label">OUTSTANDING FINES</div><div class="value">₹${fines}</div><div class="trend">Across active loans</div></div>
      </div>
      <div class="grid2">
        <div class="panel"><div class="panel-head"><div><h3>Attention required</h3><small>Only circulation items that need staff action.</small></div></div>${attention||`<div class="empty-state-pro"><div class="empty-icon">✓</div><b>Nothing urgent</b><span>All active circulation is within the current rules.</span></div>`}</div>
        ${popularBooksPanel()}
      </div>
      <div class="panel"><div class="panel-head"><div><h3>Collection health</h3><small>Live inventory availability.</small></div><span class="badge ${available? "green":"red"}">${available? "STOCK AVAILABLE":"EMPTY"}</span></div>
        <div class="health-number">${total?Math.round(available/total*100):0}%</div><p class="muted">copies currently available</p>
        <div class="progress"><span style="width:${total?available/total*100:0}%"></span></div>
        <div class="stat-line"><b>Active loans</b><span>${active.length}</span></div>
        <div class="stat-line"><b>Ready reservations</b><span>${ready}</span></div>
      </div>`;
  }

  window.v24AdminDashboard=v24AdminDashboard;

  function teacherDashboard(){
    const t=currentUser?.teacherId || currentUser?.id;
    const requests=(db.teacherRequests||[]).filter(r=>String(r.teacherId)===String(t));
    const myBooks=(db.loans||[]).filter(l=>String(l.teacherId)===String(t)&&l.status!=="Returned");
    const available=db.books.filter(b=>Number(b.stock)>0).length;
    const popular=v24PopularBooks(4);
    content.innerHTML=`<div class="page-head"><div><span class="eyebrow">TEACHER WORKSPACE · LIVE</span><h1>Welcome, ${esc((currentUser.name||"Teacher").split(" ")[0])}</h1><p>Find library resources, request books and keep your reading list organized.</p></div><div class="actions"><button class="primary" onclick="route('teacher-catalog')">Browse Books</button></div></div>
      <div class="kpis">
        <div class="kpi"><div class="label">ACTIVE BOOKS</div><div class="value">${myBooks.length}</div><div class="trend">Currently borrowed</div></div>
        <div class="kpi"><div class="label">AVAILABLE TITLES</div><div class="value">${available}</div><div class="trend">Ready to issue</div></div>
        <div class="kpi"><div class="label">MY REQUESTS</div><div class="value">${requests.length}</div><div class="trend">Book requests</div></div>
        <div class="kpi"><div class="label">CATALOG</div><div class="value">${db.books.length}</div><div class="trend">Library titles</div></div>
      </div>
      <div class="grid2">
        <div class="panel"><div class="panel-head"><div><h3>Popular in the library</h3><small>Titles with the highest current borrowing activity.</small></div><button class="btn-sm" onclick="route('teacher-catalog')">View catalog</button></div>
          ${popular.map(b=>`<div class="v24-teacher-book"><div><b>${esc(b.title)}</b><span>${esc(b.author)}</span></div><span class="badge blue">${b.borrowCount} borrows</span></div>`).join("")||`<div class="empty">No circulation data yet.</div>`}
        </div>
        <div class="panel"><div class="panel-head"><div><h3>My active books</h3><small>Books linked to your teacher account.</small></div><button class="btn-sm" onclick="route('teacher-books')">Open</button></div>
          ${myBooks.map(l=>{const b=book(l.bookId);return `<div class="v24-teacher-book"><div><b>${esc(b?.title||"Unknown")}</b><span>Due ${fmtDate(l.dueDate)}</span></div>${statusBadge(l.status)}</div>`}).join("")||`<div class="empty-state-pro"><div class="empty-icon">▣</div><b>No active books</b><span>Browse the catalog to find something useful.</span></div>`}
        </div>
      </div>`;
  }

  function teacherCatalog(){
    content.innerHTML=v8PageHead("Teacher Book Catalog","Search library titles and submit a request for an available copy.",`<button class="ghost" onclick="route('dashboard')">Dashboard</button>`)+
      `<div class="panel"><div class="filters"><input id="teacherBookSearch" placeholder="Search title, author, category or Book ID..." oninput="filterTeacherCatalog()"></div><div id="teacherCatalogRows" class="catalog-list"></div></div>`;
    filterTeacherCatalog();
  }

  function filterTeacherCatalog(){
    const q=(document.getElementById("teacherBookSearch")?.value||"").toLowerCase();
    const box=document.getElementById("teacherCatalogRows"); if(!box)return;
    const rows=db.books.filter(b=>`${b.title} ${b.author} ${b.category} ${b.bookId}`.toLowerCase().includes(q));
    box.innerHTML=rows.map(b=>`<div class="catalog-row v24-teacher-catalog-row">
      <div class="catalog-book"><b>${esc(b.title)}</b><span>${esc(b.bookId)}</span></div>
      <div>${esc(b.author)}</div><div><span class="badge blue">${esc(b.category||"General")}</span></div>
      <div>${b.stock}/${b.total}</div><div>${b.stock?'<span class="badge green">Available</span>':'<span class="badge red">Unavailable</span>'}</div>
      <div><button class="btn-sm primary" onclick="teacherRequestBook(${b.id})">Request</button></div>
    </div>`).join("")||`<div class="empty">No books found.</div>`;
  }

  function teacherRequestBook(bookId){
    const b=book(bookId); if(!b)return;
    const teacherId=currentUser.teacherId||currentUser.id;
    const exists=(db.teacherRequests||[]).find(r=>String(r.teacherId)===String(teacherId)&&Number(r.bookId)===Number(bookId)&&["Pending","Approved"].includes(r.status));
    if(exists)return toast("You already have an active request for this book.","error");
    db.teacherRequests ||= [];
    db.teacherRequests.unshift({id:Date.now(),teacherId,bookId,requestedAt:today(),status:"Pending"});
    saveDB(); addAudit(`Teacher requested ${b.bookId}`); toast(`Request sent for ${b.title}`,"success"); route("teacher-requests");
  }

  function teacherRequests(){
    const teacherId=currentUser.teacherId||currentUser.id;
    const arr=(db.teacherRequests||[]).filter(r=>String(r.teacherId)===String(teacherId));
    content.innerHTML=v8PageHead("Book Requests","Track books you have requested from the library.",`<button class="primary" onclick="route('teacher-catalog')">Find a Book</button>`)+
      `<div class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Requested</th><th>Status</th><th>Action</th></tr></thead><tbody>${arr.map(r=>{const b=book(r.bookId);return `<tr><td><b>${esc(b?.title||"Unknown")}</b><div class="muted">${esc(b?.bookId||"")}</div></td><td>${fmtDate(r.requestedAt)}</td><td>${statusBadge(r.status)}</td><td>${r.status==="Pending"?`<button class="btn-sm" onclick="cancelTeacherRequest(${r.id})">Cancel</button>`:"—"}</td></tr>`}).join("")||`<tr><td colspan="4"><div class="empty">No book requests yet.</div></td></tr>`}</tbody></table></div></div>`;
  }

  function cancelTeacherRequest(id){
    const r=(db.teacherRequests||[]).find(x=>Number(x.id)===Number(id)); if(!r)return;
    r.status="Cancelled"; saveDB(); addAudit(`Cancelled teacher request ${id}`); toast("Request cancelled"); teacherRequests();
  }

  function teacherBooks(){
    const teacherId=currentUser.teacherId||currentUser.id;
    const arr=(db.loans||[]).filter(l=>String(l.teacherId)===String(teacherId));
    content.innerHTML=v8PageHead("My Books","Books currently linked to your teacher account and previous returns.")+
      `<div class="panel">${arr.length?professionalLoanTable(arr):`<div class="empty-state-pro"><div class="empty-icon">▣</div><b>No teacher borrowing records</b><span>Your library issues will appear here.</span></div>`}</div>`;
  }

  function teacherAccount(){
    content.innerHTML=v8PageHead("My Account","Teacher account and library access details.")+
      `<div class="panel"><div class="stat-line"><b>Name</b><span>${esc(currentUser.name)}</span></div><div class="stat-line"><b>Role</b><span>Teacher</span></div><div class="stat-line"><b>Teacher ID</b><span>${esc(currentUser.teacherId||"—")}</span></div><div class="stat-line"><b>Department</b><span>${esc(currentUser.department||"—")}</span></div><div class="stat-line"><b>Email</b><span>${esc(currentUser.email)}</span></div></div>`;
  }

  function teacherSchedule(){ schedulePage(); }

  // Wrap the global route after all existing V23/V22 route overrides have loaded.
  const baseRoute = window.route;
  window.route=function(page){
    if(isTeacher()){
      if(page==="dashboard") return teacherDashboard();
      if(page==="teacher-catalog") return teacherCatalog();
      if(page==="teacher-requests") return teacherRequests();
      if(page==="teacher-books") return teacherBooks();
      if(page==="account") return teacherAccount();
      if(page==="schedule") return teacherSchedule();
      if(page==="notifications") return notificationsPage();
      return teacherDashboard();
    }
    return baseRoute ? baseRoute(page) : undefined;
  };

  // Ensure teacher-aware login/session labels even though the original app treats staff as one role.
  const baseLogin=window.login;
  if(typeof baseLogin==="function"){
    // Keep original authentication logic. It already preserves unknown roles.
  }
  window.showApp=v24ShowApp;
  window.v24ShowApp=v24ShowApp;
  window.v24BuildNav=v24BuildNav;

  // Wrap the existing circulation page and add a camera selector.
  const baseIssuePage=window.issuePage;
  function enhanceScannerControls(){
    const access=document.querySelector(".scanner-access");
    if(!access || document.getElementById("qrCameraSelect")) return;
    const wrap=document.createElement("div");
    wrap.className="v24-camera-picker";
    wrap.innerHTML=`<label for="qrCameraSelect">Camera</label><select id="qrCameraSelect"><option value="">Detecting cameras…</option></select><small>On a laptop, choose the built-in webcam or USB webcam. Allow camera access when Chrome asks.</small>`;
    access.parentNode.insertBefore(wrap,access);
    loadCameras();
  }

  async function loadCameras(){
    const select=document.getElementById("qrCameraSelect"); if(!select)return;
    if(!navigator.mediaDevices?.enumerateDevices || !window.Html5Qrcode){
      select.innerHTML='<option value="">Camera API unavailable</option>'; return;
    }
    try{
      const devices=await navigator.mediaDevices.enumerateDevices();
      const cams=devices.filter(device=>device.kind==="videoinput");
      select.innerHTML=cams.length?cams.map((camera,i)=>`<option value="${esc(camera.deviceId)}">${esc(camera.label||`Camera ${i+1}`)}</option>`).join(""):'<option value="">No camera detected</option>';
      const preferred=cams.find(c=>/integrated|built.?in|webcam|camera|hd webcam|usb/i.test(c.label||""));
      if(preferred)select.value=preferred.deviceId;
      else if(cams.length)select.value=cams[0].deviceId;
      select.onchange=()=>{ if(v24ScannerRunning) restartV24Scanner(); };
    }catch(e){
      select.innerHTML='<option value="">Allow camera access, then retry</option>';
    }
  }

  let v24Scanner=null, v24ScannerRunning=false, v24ScannerStarting=false;

  function scannerStatus(msg,type=""){
    const el=document.getElementById("scannerStatus"); if(!el)return;
    el.className=`scanner-status ${type}`;
    el.innerHTML=`<span class="dot"></span><span>${esc(msg)}</span>`;
  }

  async function startV24Scanner(){
    if(v24ScannerStarting)return;
    if(v24Scanner){scannerStatus("Camera scanner is already running.","ready");return;}
    if(!window.isSecureContext && !["localhost","127.0.0.1"].includes(location.hostname)){
      scannerStatus("Camera access requires HTTPS or localhost.","error");
      toast("Run Smart Library through localhost or HTTPS for laptop camera access.","error"); return;
    }
    if(!window.Html5Qrcode){scannerStatus("QR scanner library did not load.","error");return;}
    v24ScannerStarting=true;
    try{
      scannerStatus("Requesting laptop camera permission…");
      const select=document.getElementById("qrCameraSelect");
      const cams=await Html5Qrcode.getCameras();
      if(!cams.length)throw new Error("No camera detected");
      let cameraId=select?.value;
      if(!cams.some(camera=>camera.id===cameraId)){
        const preferred=cams.find(camera=>/integrated|built.?in|webcam|camera|usb/i.test(camera.label||""));
        cameraId=(preferred||cams[0]).id;
        if(select)select.value=cameraId;
      }
      v24Scanner=new Html5Qrcode("html5-qrcode-reader");
      const config={fps:10,qrbox:{width:250,height:250},aspectRatio:16/9,disableFlip:false};
      await v24Scanner.start({deviceId:{exact:cameraId}},config,(decodedText)=>{
        lookupScannedBook(decodedText);
        scannerStatus(`Scanned: ${decodedText}`,"ready");
        stopV24Scanner(true);
      },()=>{});
      v24ScannerRunning=true;
      scannerStatus("Laptop camera is active. Point it at the book QR code.","ready");
      toast("Laptop camera scanner started","success");
    }catch(err){
      if(v24Scanner){try{await v24Scanner.clear()}catch(e){}}
      v24Scanner=null;v24ScannerRunning=false;
      const detail=String(err?.message||err||"Camera unavailable");
      const name=String(err?.name||"");
      const msg=/NotAllowed|PermissionDenied/i.test(`${name} ${detail}`)?"Camera permission was blocked. Allow Chrome camera access for localhost, then try again.":/NotFound|no camera detected/i.test(`${name} ${detail}`)?"No camera was detected. Connect or enable a webcam, then retry.":/NotReadable|TrackStart/i.test(`${name} ${detail}`)?"The camera is busy in another app. Close other camera apps and retry.":/Overconstrained|NotFoundError/i.test(`${name} ${detail}`)?"The selected camera is unavailable. Choose another camera and retry.":/SecurityError/i.test(`${name} ${detail}`)?"Camera access requires HTTPS or localhost.":`Camera could not start: ${detail}`;
      scannerStatus(msg,"error");
      toast(msg,"error");
    }finally{v24ScannerStarting=false;}
  }

  async function stopV24Scanner(silent=false){
    const scanner=v24Scanner;v24Scanner=null;v24ScannerRunning=false;
    if(scanner){try{await scanner.stop()}catch(e){}try{await scanner.clear()}catch(e){}}
    if(!silent)scannerStatus("Camera stopped. Select a camera and press Start Camera when ready.");
  }

  async function restartV24Scanner(){
    await stopV24Scanner(true);
    await startV24Scanner();
  }

  window.startBarcodeScanner=startV24Scanner;
  window.stopBarcodeScanner=stopV24Scanner;
  window.restartV24Scanner=restartV24Scanner;

  if(typeof baseIssuePage==="function"){
    window.issuePage=function(){
      baseIssuePage();
      setTimeout(enhanceScannerControls,80);
    };
  }

  ensureV24Data();

  // Make the existing login/session boot understand teacher labels.
  const loginForm=document.getElementById("loginForm");
  if(loginForm){
    // Original submit handler remains authoritative.
  }

  // Existing boot may already have restored a session before this enhancement file executes.
  if(currentUser){
    v24BuildNav();
    route("dashboard");
  }

  // If the page is still at login, keep the demo teacher credentials visible.
  const demo=document.querySelector(".demo-box");
  if(demo && !Array.from(demo.querySelectorAll("span")).some(s=>/Teacher:/i.test(s.textContent||""))){
    const s=document.createElement("span");
    s.className="teacher-demo";
    s.textContent="Teacher: teacher@university.edu / teacher123";
    demo.appendChild(s);
  }
})();


/* ============================================================
   V24 FINAL ROLE ISOLATION PATCH
   Admin and Teacher are separate workspaces.
   ============================================================ */
(function(){
  "use strict";

  function isTeacherUser(){
    return !!(window.currentUser && window.currentUser.role === "teacher");
  }
  function isAdminUser(){
    return !!(window.currentUser && (window.currentUser.role === "admin" || window.currentUser.role === "staff"));
  }

  // Make the final global showApp always respect the authenticated role.
  if(typeof window.v24ShowApp === "function"){
    window.showApp = window.v24ShowApp;
  }

  // Replace the login form handler so teacher login can never fall through
  // to the original staff/admin showApp flow.
  const form=document.getElementById("loginForm");
  if(form){
    const freshForm=form.cloneNode(true);
    form.parentNode.replaceChild(freshForm,form);

    freshForm.addEventListener("submit",function(e){
      e.preventDefault();
      const email=(document.getElementById("loginEmail")?.value||"").trim().toLowerCase();
      const pass=document.getElementById("loginPassword")?.value||"";
      const users=Array.isArray(window.db?.users) ? window.db.users : [];
      const u=users.find(x=>(String(x.email||"").trim().toLowerCase()===email && String(x.password)===String(pass)));
      if(!u){
        if(typeof toast==="function") toast("Invalid email or password. Check the demo credentials.","error");
        return;
      }

      window.currentUser={...u, role:u.role==="librarian"?"admin":u.role};
      localStorage.setItem("munvarCurrentUser",JSON.stringify(window.currentUser));

      if(typeof addAudit==="function") addAudit(`Logged in as ${window.currentUser.role}`);
      if(typeof window.v24ShowApp==="function"){
        window.v24ShowApp();
      }else if(typeof window.showApp==="function"){
        window.showApp();
      }
    });
  }

  // Update the login demo labels.
  const demo=document.querySelector(".demo-box");
  if(demo){
    const spans=[...demo.querySelectorAll("span")];
    if(!spans.some(x=>/Teacher:/i.test(x.textContent||""))){
      const s=document.createElement("span");
      s.textContent="Teacher: teacher@university.edu / teacher123";
      demo.appendChild(s);
    }
    spans.forEach(s=>{
      if(/Staff:/i.test(s.textContent||"")) s.textContent="Admin: admin@university.edu / admin123";
    });
  }

  // Final visual role labels.
  function refreshRoleHeader(){
    const u=window.currentUser;
    if(!u)return;
    const teacher=u.role==="teacher";
    const admin=u.role==="admin"||u.role==="staff";
    const chip=document.getElementById("roleChip");
    const name=document.getElementById("topName");
    const role=document.getElementById("topRole");
    const avatar=document.getElementById("avatar");
    if(chip) chip.textContent=teacher?"TEACHER":admin?"ADMIN":String(u.role||"USER").toUpperCase();
    if(name) name.textContent=u.name||"Library User";
    if(role) role.textContent=teacher?"Teacher":admin?"Administrator":(u.role||"User");
    if(avatar) avatar.textContent=(u.name||"U")[0].toUpperCase();
  }

  // Ensure the teacher/admin navigation is rebuilt after any session restoration.
  function enforceWorkspace(){
    if(!window.currentUser)return;
    refreshRoleHeader();
    if(typeof window.v24BuildNav==="function") window.v24BuildNav();
    else if(typeof v24BuildNav==="function") v24BuildNav();
    if(typeof refreshNotifCount==="function") refreshNotifCount();
  }

  // Expose for debugging and future navigation.
  window.smartLibraryRoleCheck={
    isTeacher:isTeacherUser,
    isAdmin:isAdminUser,
    refresh:enforceWorkspace
  };

  // Current session may have been restored before this final patch loaded.
  setTimeout(function(){
    enforceWorkspace();
    if(window.currentUser && typeof window.route==="function") window.route("dashboard");
  },0);
})();

/* ============================================================
   V24.1 PORTAL ALIGNMENT
   Teacher and Student use the exact same user portal.
   Admin remains on the separate library management workspace.
   ============================================================ */
(function(){
  "use strict";

  const isTeacherPortal=()=>!!(window.currentUser && window.currentUser.role==="teacher");
  const isAdminPortal=()=>!!(window.currentUser && (window.currentUser.role==="admin" || window.currentUser.role==="staff"));

  // Give teachers a student-portal-compatible profile without putting them
  // into the admin-managed student records collection.
  const originalGetCurrentStudent=window.getCurrentStudent;
  window.getCurrentStudent=function(){
    if(isTeacherPortal()){
      const t=window.currentUser;
      return {
        id:t.teacherId || t.id,
        studentId:t.teacherId || t.id,
        name:t.name || "Teacher",
        department:t.department || "",
        semester:t.semester || "Faculty",
        mobile:t.mobile || "—",
        email:t.email || ""
      };
    }
    return typeof originalGetCurrentStudent==="function" ? originalGetCurrentStudent() : null;
  };

  // Exact same sidebar structure for Teacher and Student.
  function portalBuildNav(){
    if(!window.currentUser || typeof nav==="undefined" || !nav)return;
    const studentLike=isTeacherPortal() || window.currentUser.role==="student";
    const groups=studentLike ? [
      ["Workspace",[
        ["dashboard","⌂","Dashboard"],
        ["my-books","▣","My Books"],
        ["catalog","▤","Book Catalog"],
        ["online-books","◎","Online Discovery"],
        ["reservations","◫","Reservations"],
        ["schedule","□","Semester Calendar"]
      ]],
      ["Personal",[
        ["notifications","♢","Notifications"],
        ["reports","▥","My Reports"],
        ["account","◎","My Account"]
      ]]
    ] : [
      ["Workspace",[
        ["dashboard","⌂","Dashboard"],
        ["books","▤","Library Catalog"],
        ["online-books","◎","Online Discovery"],
        ["issue","⇄","Scan & Circulate"],
        ["students","♙","Students"],
        ["reservations","◫","Reservations"]
      ]],
      ["Operations",[
        ["due","◷","Due & Fines"],
        ["notifications","♢","Notifications"],
        ["schedule","□","Academic Calendar"]
      ]],
      ["Insights",[
        ["analytics","◌","Analytics Studio"],
        ["floor-map","⌗","Library Map"]
      ]],
      ["Management",[
        ["reports","▥","Reports Center"],
        ["activity","•","Activity Log"],
        ["print-center","▤","Print Center"],
        ["settings","⚙","Settings"]
      ]]
    ];
    nav.innerHTML=groups.map(g=>`<div class="nav-group"><div class="nav-group-label">${g[0]}</div>${g[1].map(x=>`<button class="nav-item" data-page="${x[0]}"><span>${x[1]}</span>${x[2]}</button>`).join("")}</div>`).join("");
    document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.onclick=()=>{
      route(b.dataset.page);
      document.getElementById("sidebar")?.classList.remove("open");
      document.getElementById("sidebarOverlay")?.classList.remove("show");
    });
  }

  // Keep one route map for both teacher and student portals.
  const previousRoute=window.route;
  window.route=function(page){
    if(isTeacherPortal()){
      document.querySelectorAll(".nav-item[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
      document.getElementById("sidebar")?.classList.remove("open");
      document.getElementById("sidebarOverlay")?.classList.remove("show");
      const portalPages={
        dashboard:studentDashboard,
        "my-books":myBooksPage,
        catalog:catalogPage,
        "online-books":onlineBooksPage,
        reservations:professionalReservationsPage,
        schedule:schedulePage,
        notifications:notificationsPage,
        reports:reportsPage,
        account:accountPage
      };
      (portalPages[page]||studentDashboard)();
      document.scrollingElement?.scrollTo({top:0,behavior:"smooth"});
      return;
    }
    return typeof previousRoute==="function" ? previousRoute(page) : dashboard();
  };

  // Header labels follow the shared portal model.
  function refreshPortalHeader(){
    const u=window.currentUser;if(!u)return;
    const teacher=isTeacherPortal(), admin=isAdminPortal();
    const chip=document.getElementById("roleChip");
    const name=document.getElementById("topName");
    const role=document.getElementById("topRole");
    const av=document.getElementById("avatar");
    if(chip)chip.textContent=teacher?"TEACHER":admin?"ADMIN":"STUDENT";
    if(name)name.textContent=u.name||"Library User";
    if(role)role.textContent=teacher?"Teacher":admin?"Administrator":"Student";
    if(av)av.textContent=(u.name||"U")[0].toUpperCase();
  }

  window.v24BuildNav=portalBuildNav;
  window.buildNav=portalBuildNav;

  const alignedShowApp=function(){
    document.getElementById("loginScreen")?.classList.add("hidden");
    document.getElementById("app")?.classList.remove("hidden");
    refreshPortalHeader();
    portalBuildNav();
    if(typeof refreshNotifCount==="function")refreshNotifCount();
    route("dashboard");
  };
  window.showApp=alignedShowApp;
  window.v24ShowApp=alignedShowApp;

  // If a teacher session already exists, immediately move it to the shared portal.
  if(window.currentUser){
    refreshPortalHeader();
    portalBuildNav();
    if(isTeacherPortal())route("dashboard");
  }
})();

/* ============================================================
   V24.2 FINAL SHARED USER PORTAL
   Teacher and Student intentionally use the same portal UI.
   Admin remains on the separate management workspace.
   ============================================================ */
(function(){
  "use strict";

  const teacherPortal=()=>window.currentUser?.role==="teacher";
  const studentPortal=()=>window.currentUser?.role==="student";
  const sharedPortal=()=>teacherPortal()||studentPortal();

  function portalIdentity(){
    const u=window.currentUser||{};
    if(studentPortal()){
      const s=(typeof window.getCurrentStudent==="function"?window.getCurrentStudent():null)||{};
      return {id:s.id, name:s.name||u.name||"Student", code:s.studentId||u.studentId||"—", department:s.department||"—", semester:s.semester||"—", mobile:s.mobile||"—", email:s.email||u.email||"—"};
    }
    return {id:u.teacherId||u.id, name:u.name||"Teacher", code:u.teacherId||u.id||"—", department:u.department||"—", semester:u.semester||"Faculty", mobile:u.mobile||"—", email:u.email||"—"};
  }

  function portalLoans(){
    const id=portalIdentity().id;
    if(teacherPortal()) return (db.loans||[]).filter(l=>String(l.teacherId||"")===String(id));
    return (db.loans||[]).filter(l=>String(l.studentId)===String(id));
  }

  function sharedDashboard(){
    const p=portalIdentity();
    const loans=portalLoans();
    const active=loans.filter(l=>l.status!=="Returned");
    const overdue=active.filter(l=>l.status==="Overdue");
    const fine=loans.reduce((n,l)=>n+(Number(l.fine)||0),0);
    const label=teacherPortal()?"Teacher":"Student";
    content.innerHTML=`
      <div class="page-head"><div><h1>Welcome, ${esc(p.name.split(" ")[0])} 👋</h1><p>Your personal university library account.</p></div><div class="actions"><button class="primary" onclick="route('catalog')">Browse Books</button></div></div>
      <div class="profile">
        <div class="profile-card"><div class="big-avatar">${esc((p.name||"U")[0])}</div><h2>${esc(p.name)}</h2><p>${esc(p.code)}</p><p>${esc(p.department)}</p><span class="badge green">Account Active</span></div>
        <div><div class="profile-grid">
          <div class="info-box"><span>Department</span><b>${esc(p.department)}</b></div>
          <div class="info-box"><span>Semester</span><b>${esc(p.semester)}</b></div>
          <div class="info-box"><span>Mobile</span><b>${esc(p.mobile)}</b></div>
          <div class="info-box"><span>Email</span><b>${esc(p.email)}</b></div>
          <div class="info-box"><span>Currently Borrowed</span><b>${active.length}</b></div>
          <div class="info-box"><span>Overdue</span><b>${overdue.length}</b></div>
        </div></div>
      </div>
      <div class="kpis" style="margin-top:18px">
        <div class="kpi"><div class="label">TOTAL BORROWED</div><div class="value">${loans.length}</div></div>
        <div class="kpi"><div class="label">OVERDUE</div><div class="value">${overdue.length}</div></div>
        <div class="kpi"><div class="label">TOTAL FINE</div><div class="value">₹${fine}</div></div>
      </div>
      <div class="panel"><div class="panel-head"><div><h3>Semester Milestones</h3><small>Important academic dates for your semester.</small></div><button class="btn-sm" onclick="route('schedule')">View Calendar</button></div>${(db.schedule?.milestones||[]).slice().sort((a,b)=>a.date.localeCompare(b.date)).map(m=>`<div class="stat-line"><b>${esc(m.title)}</b><span>${fmtDate(m.date)}</span></div>`).join("")||'<div class="empty">No semester milestones.</div>'}</div>
      <div class="panel"><div class="panel-head"><div><h3>My current books</h3><small>Due dates and live status</small></div><button class="btn-sm" onclick="route('my-books')">Full history</button></div>${loanTableV5(active)}</div>`;
  }

  function sharedMyBooks(){
    const p=portalIdentity(), loans=portalLoans();
    content.innerHTML=v8PageHead("My Books","Your current and past library activity.")+`<div class="panel"><div class="panel-head"><div><h3>Borrowing History</h3><small>${loans.length} record(s) linked to your account.</small></div><button class="ghost" onclick="route('catalog')">Browse Books</button></div>${loanTableV5(loans)}</div>`;
  }

  function sharedAccount(){
    const p=portalIdentity();
    content.innerHTML=v8PageHead("My Account","Account details and session information.")+`<div class="panel"><div class="stat-line"><b>Name</b><span>${esc(p.name)}</span></div><div class="stat-line"><b>Role</b><span>${teacherPortal()?"Teacher":"Student"}</span></div><div class="stat-line"><b>${teacherPortal()?"Teacher ID":"Student ID"}</b><span>${esc(p.code)}</span></div><div class="stat-line"><b>Department</b><span>${esc(p.department)}</span></div><div class="stat-line"><b>Email</b><span>${esc(p.email)}</span></div></div>`;
  }

  function sharedReservations(){
    const mine=teacherPortal()
      ? (db.reservations||[]).filter(r=>String(r.teacherId||"")===String(currentUser.teacherId||currentUser.id))
      : (db.reservations||[]).filter(r=>String(r.studentId)===String(currentUser.studentId));
    content.innerHTML=v8PageHead("Reservations","Reserve unavailable books and manage your waiting queue.",`<button class="primary" onclick="sharedReserveModal()">+ Reserve a Book</button>`)+
      `<div class="grid3">${v8Metric("ACTIVE RESERVATIONS",mine.filter(r=>r.status==="Waiting").length,"Waiting in queue")}${v8Metric("READY",mine.filter(r=>r.status==="Ready").length,"Ready for pickup")}${v8Metric("FULFILLED",mine.filter(r=>r.status==="Fulfilled").length,"Completed reservations")}</div>
      <div class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>${teacherPortal()?"Teacher":"Student"}</th><th>Requested</th><th>Position</th><th>Status</th><th>Actions</th></tr></thead><tbody>${mine.map(r=>{const b=book(r.bookId), who=teacherPortal()?currentUser:student(r.studentId);const pos=(db.reservations||[]).filter(x=>x.bookId===r.bookId&&x.status==="Waiting"&&x.createdAt<=r.createdAt).length;return `<tr><td><b>${esc(b?.title||"Unknown")}</b><div class="muted">${esc(b?.bookId||"")}</div></td><td>${esc(who?.name||"Unknown")}</td><td>${fmtDate(r.createdAt)}</td><td>${r.status==="Waiting"?`#${pos}`:"—"}</td><td>${statusBadge(r.status)}</td><td>${r.status==="Waiting"||r.status==="Ready"?`<button class="btn-sm danger" onclick="sharedCancelReservation(${r.id})">Cancel</button>`:"—"}</td></tr>`}).join("")||`<tr><td colspan="6" class="empty">No reservations found.</td></tr>`}</tbody></table></div></div>`;
  }

  window.sharedReserveModal=function(){
    const books=db.books.filter(b=>b.stock===0);
    const type=teacherPortal()?"Teacher":"Student";
    const options=(books.length?books:db.books).map(b=>`<option value="${b.id}">${esc(b.bookId)} — ${esc(b.title)} ${b.stock?"(available)":"(unavailable)"}</option>`).join("");
    modal(`<h2>Create Reservation</h2><p class="muted">Reserve a book when no copy is currently available.</p><form id="sharedResForm"><div class="form-grid"><div class="form-field"><label>Book</label><select id="sharedResBook" required>${options}</select></div><div class="form-field"><label>${type}</label><input value="${esc(portalIdentity().code)} — ${esc(portalIdentity().name)}" disabled></div></div><div class="form-actions"><button type="button" class="ghost" onclick="closeModal()">Cancel</button><button class="primary">Create Reservation</button></div></form></div>`);
    document.getElementById("sharedResForm").onsubmit=e=>{
      e.preventDefault();
      const bid=+document.getElementById("sharedResBook").value;
      const exists=(db.reservations||[]).some(r=>Number(r.bookId)===bid && (teacherPortal()?String(r.teacherId||"")===String(currentUser.teacherId||currentUser.id):String(r.studentId)===String(currentUser.studentId)) && ["Waiting","Ready"].includes(r.status));
      if(exists)return toast("You already have an active reservation for this book","error");
      db.reservations ||= [];
      const row={id:Date.now(),bookId:bid,status:"Waiting",createdAt:today()};
      if(teacherPortal())row.teacherId=currentUser.teacherId||currentUser.id; else row.studentId=currentUser.studentId;
      db.reservations.push(row);saveDB();addAudit(`Created ${type.toLowerCase()} reservation`);closeModal();toast("Reservation created","success");sharedReservations();
    };
  };
  window.sharedCancelReservation=function(id){const r=(db.reservations||[]).find(x=>Number(x.id)===Number(id));if(!r)return;r.status="Cancelled";saveDB();toast("Reservation cancelled","success");sharedReservations()};

  // Final routing: Teacher uses the exact Student portal pages and dashboard.
  const adminRoute=window.route;
  window.route=function(page){
    if(sharedPortal()){
      const pages={dashboard:sharedDashboard,"my-books":sharedMyBooks,"teacher-books":sharedMyBooks,catalog:teacherPortal()?sharedTeacherCatalog:catalogPage,"teacher-catalog":sharedTeacherCatalog,"online-books":onlineBooksPage,reservations:sharedReservations,"teacher-requests":sharedTeacherRequests,schedule:schedulePage,notifications:notificationsPage,reports:reportsPage,account:sharedAccount};
      document.querySelectorAll(".nav-item[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
      (pages[page]||sharedDashboard)();
      document.scrollingElement?.scrollTo({top:0,behavior:"smooth"});
      return;
    }
    if(page==="online-books")return onlineBooksPage();
    if(page==="teacher-requests")return adminTeacherRequests();
    if(page==="dashboard"&&typeof window.v24AdminDashboard==="function")return window.v24AdminDashboard();
    return typeof adminRoute==="function"?adminRoute(page):dashboard();
  };

  // Rebuild identical Student/Teacher navigation. Admin keeps its own navigation.
  const sharedBuildNav=window.buildNav;
  window.buildNav=function(){
    if(!window.currentUser)return;
    if(!sharedPortal()){
      if(typeof sharedBuildNav==="function")sharedBuildNav();
      const operations=Array.from(nav.querySelectorAll(".nav-group")).find(group=>group.querySelector(".nav-group-label")?.textContent==="Operations");
      if(operations){
        const button=document.createElement("button");button.className="nav-item";button.dataset.page="teacher-requests";button.innerHTML="<span>↗</span>Teacher Requests";button.onclick=()=>route("teacher-requests");operations.append(button);
      }
      return;
    }
    const workspaceItems=[["dashboard","⌂","Dashboard"],["my-books","▣","My Books"],["catalog","▤","Book Catalog"],["online-books","◎","Online Discovery"],["reservations","◫","Reservations"],["schedule","□","Semester Calendar"]];
    if(teacherPortal())workspaceItems.splice(4,0,["teacher-requests","↗","Book Requests"]);
    const groups=[
      ["Workspace",workspaceItems],
      ["Personal",[["notifications","♢","Notifications"],["reports","▥","My Reports"],["account","◎","My Account"]]]
    ];
    nav.innerHTML=groups.map(g=>`<div class="nav-group"><div class="nav-group-label">${g[0]}</div>${g[1].map(x=>`<button class="nav-item" data-page="${x[0]}"><span>${x[1]}</span>${x[2]}</button>`).join("")}</div>`).join("");
    document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.onclick=()=>route(b.dataset.page));
  };

  function renderTeacherCatalogRows(){
    const q=(document.getElementById("teacherCatalogSearch")?.value||"").toLowerCase();
    const rows=db.books.filter(b=>`${b.title} ${b.author} ${b.category} ${b.bookId}`.toLowerCase().includes(q));
    const body=document.getElementById("teacherCatalogRows");if(!body)return;
    body.innerHTML=rows.map(b=>`<tr><td><b>${esc(b.title)}</b><div class="muted">${esc(b.bookId)}</div></td><td>${esc(b.author)}</td><td>${esc(b.category||"General")}</td><td>${b.stock}/${b.total}</td><td><button class="btn-sm primary" onclick="sharedTeacherRequestBook(${b.id})">Request</button></td></tr>`).join("")||`<tr><td colspan="5" class="empty">No books found.</td></tr>`;
  }
  window.renderTeacherCatalogRows=renderTeacherCatalogRows;
  window.sharedTeacherRequestBook=function(bookId){
    if(!teacherPortal())return;
    const b=book(bookId);if(!b)return toast("Book not found","error");
    const teacherId=currentUser.teacherId||currentUser.id;
    db.teacherRequests||=[];
    if(db.teacherRequests.some(r=>String(r.teacherId)===String(teacherId)&&Number(r.bookId)===Number(bookId)&&["Pending","Approved"].includes(r.status)))return toast("You already have an active request for this book","error");
    db.teacherRequests.unshift({id:Date.now(),teacherId,bookId:Number(bookId),requestedAt:today(),status:"Pending"});
    saveDB();addAudit(`Teacher requested ${b.bookId}`);toast(`Request sent for ${b.title}`,"success");route("teacher-requests");
  };
  function sharedTeacherCatalog(){
    content.innerHTML=v8PageHead("Book Catalog","Browse titles and request books from the library.")+`<div class="panel"><div class="filters"><input id="teacherCatalogSearch" placeholder="Search title, author, category or Book ID..." oninput="renderTeacherCatalogRows()"></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Author</th><th>Category</th><th>Available / Total</th><th>Action</th></tr></thead><tbody id="teacherCatalogRows"></tbody></table></div></div>`;
    renderTeacherCatalogRows();
  }
  function sharedTeacherRequests(){
    const teacherId=currentUser.teacherId||currentUser.id;
    const requests=(db.teacherRequests||[]).filter(r=>String(r.teacherId)===String(teacherId));
    content.innerHTML=v8PageHead("Book Requests","Track requests sent to the library.",`<button class="primary" onclick="route('catalog')">Find a Book</button>`)+`<div class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Requested</th><th>Status</th><th>Action</th></tr></thead><tbody>${requests.map(r=>{const b=book(r.bookId);return `<tr><td><b>${esc(b?.title||"Unknown")}</b><div class="muted">${esc(b?.bookId||"")}</div></td><td>${fmtDate(r.requestedAt)}</td><td>${statusBadge(r.status)}</td><td>${r.status==="Pending"?`<button class="btn-sm danger" onclick="cancelSharedTeacherRequest(${r.id})">Cancel</button>`:"—"}</td></tr>`}).join("")||`<tr><td colspan="4" class="empty">No book requests yet.</td></tr>`}</tbody></table></div></div>`;
  }
  window.cancelSharedTeacherRequest=function(id){
    const request=(db.teacherRequests||[]).find(r=>Number(r.id)===Number(id));
    if(!request||request.status!=="Pending"||String(request.teacherId)!==String(currentUser.teacherId||currentUser.id))return;
    request.status="Cancelled";saveDB();addAudit(`Cancelled teacher request ${id}`);toast("Request cancelled","success");sharedTeacherRequests();
  };
  function adminTeacherRequests(){
    const requests=db.teacherRequests||[];
    content.innerHTML=v8PageHead("Teacher Requests","Review book requests submitted by teachers.")+`<div class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Teacher</th><th>Book</th><th>Requested</th><th>Status</th><th>Action</th></tr></thead><tbody>${requests.map(r=>{const t=db.users.find(u=>String(u.teacherId||u.id)===String(r.teacherId)),b=book(r.bookId);return `<tr><td><b>${esc(t?.name||"Unknown teacher")}</b><div class="muted">${esc(t?.email||"")}</div></td><td><b>${esc(b?.title||"Unknown")}</b><div class="muted">${esc(b?.bookId||"")}</div></td><td>${fmtDate(r.requestedAt)}</td><td>${statusBadge(r.status)}</td><td>${r.status==="Pending"?`<div class="row-actions"><button class="btn-sm primary" onclick="reviewTeacherRequest(${r.id},'Approved')">Approve</button><button class="btn-sm danger" onclick="reviewTeacherRequest(${r.id},'Rejected')">Reject</button></div>`:"—"}</td></tr>`}).join("")||`<tr><td colspan="5" class="empty">No teacher requests.</td></tr>`}</tbody></table></div></div>`;
  }
  window.reviewTeacherRequest=function(id,status){
    const request=(db.teacherRequests||[]).find(r=>Number(r.id)===Number(id));
    if(!request||request.status!=="Pending"||!["Approved","Rejected"].includes(status))return;
    if(status==='Approved'){
      const b=book(request.bookId), t=teacher(request.teacherId);
      if(!b||!t)return toast("Teacher or book record not found","error");
      if(!b.stock||b.stock<1)return toast("Book is currently unavailable","error");
      const active=db.loans.some(l=>String(l.teacherId)===String(request.teacherId)&&Number(l.bookId)===Number(request.bookId)&&l.status!=="Returned");
      if(active)return toast("This teacher already has this book","error");
      const loan={id:Math.max(1000,...db.loans.map(l=>Number(l.id)||0))+1,teacherId:String(request.teacherId),bookId:Number(request.bookId),issueDate:today(),issueTime:nowTime(),dueDate:addDays(today(),7),returnDate:null,status:"Borrowed",fine:0};
      db.loans.unshift(loan);request.status="Approved";request.issuedLoanId=loan.id;request.issuedAt=today();reconcileInventory();saveDB();addAudit(`Approved and issued ${b.bookId} to teacher ${t.teacherId||t.id}`);toast(`Approved — ${b.title} issued to ${t.name}`,"success");adminTeacherRequests();
    } else {request.status=status;saveDB();addAudit(`${status} teacher request ${id}`);toast(`Request ${status.toLowerCase()}`,"success");adminTeacherRequests();}
  };

  // Ensure the top bar still identifies the person correctly.
  const oldShowApp=window.showApp;
  window.showApp=function(){
    document.getElementById("loginScreen")?.classList.add("hidden");
    document.getElementById("app")?.classList.remove("hidden");
    const teacher=teacherPortal(), admin=currentUser?.role==="admin"||currentUser?.role==="staff";
    document.getElementById("roleChip").textContent=teacher?"TEACHER":admin?"ADMIN":"STUDENT";
    document.getElementById("topName").textContent=currentUser?.name||"Library User";
    document.getElementById("topRole").textContent=teacher?"Teacher":admin?"Administrator":"Student";
    document.getElementById("avatar").textContent=(currentUser?.name||"U")[0].toUpperCase();
    window.buildNav();
    refreshNotifCount?.();
    route("dashboard");
  };
  window.v24ShowApp=window.showApp;

  // Keep teacher route aliases working after all merged route layers load.
  const finalRoute=window.route;
  const installTeacherRoute=function(){
    const routeBeforeInstall=window.route===installTeacherRoute._wrapper?finalRoute:window.route;
    installTeacherRoute._wrapper=function(page){
      if(teacherPortal() && (page==='catalog'||page==='teacher-catalog'))return sharedTeacherCatalog();
      if(teacherPortal() && (page==='my-books'||page==='teacher-books'))return sharedMyBooks();
      return typeof routeBeforeInstall==='function'?routeBeforeInstall(page):sharedDashboard();
    };
    window.route=installTeacherRoute._wrapper;
  };
  installTeacherRoute();
  window.addEventListener('load',()=>setTimeout(installTeacherRoute,0));
  /* Keep aliases available even when another merged layer replaces route later. */
  window.route=function(page){
    if(studentPortal() && (page==='due'||page==='issue'||page==='students'||page==='settings'||page==='activity'||page==='print-center'))return sharedDashboard();
    if(teacherPortal() && (page==='catalog'||page==='teacher-catalog'))return sharedTeacherCatalog();
    if(teacherPortal() && (page==='my-books'||page==='teacher-books'))return sharedMyBooks();
    return typeof finalRoute==='function'?finalRoute(page):sharedDashboard();
  };

  // If already logged in, refresh the current workspace.
  if(window.currentUser){window.showApp();}
})();

// Keep the sidebar highlight on the item that was actually selected.
document.addEventListener('click',event=>{
  const item=event.target.closest?.('.sidebar .nav-item[data-page]');
  if(!item)return;
  requestAnimationFrame(()=>{
    document.querySelectorAll('.sidebar .nav-item[data-page]').forEach(button=>button.classList.toggle('active',button===item));
  });
});
