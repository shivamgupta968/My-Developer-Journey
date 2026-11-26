const $ = id => document.getElementById(id);
let mode = "login";
function notice(message,type="info"){ $("notice").textContent=message; $("notice").className=`notice show ${type}`; }
function clearNotice(){ $("notice").className="notice"; $("notice").textContent=""; }
function clearErrors(){["nameError","emailError","passwordError","confirmError"].forEach(id=>$(id).textContent="");}
function setMode(next){
 mode=next; const signup=mode==="signup";
 $("loginTab").classList.toggle("active",!signup); $("signupTab").classList.toggle("active",signup);
 $("nameField").hidden=!signup; $("confirmField").hidden=!signup; $("termsRow").hidden=!signup;
 $("loginOptions").hidden=signup; $("strength").hidden=!signup;
 $("eyebrow").textContent=signup?"GET STARTED":"WELCOME BACK";
 $("title").textContent=signup?"Create your account":"Sign in to your account";
 $("subtitle").textContent=signup?"Fill in your details to create a new account.":"Enter your details to access your dashboard.";
 $("submitText").textContent=signup?"Create account":"Sign in";
 $("switchCopy").innerHTML=signup?'Already have an account? <button type="button" id="switchMode">Sign in</button>':'New to SecureSpace? <button type="button" id="switchMode">Create an account</button>';
 $("password").autocomplete=signup?"new-password":"current-password";
 $("switchMode").addEventListener("click",()=>setMode(signup?"login":"signup"));
 clearErrors();clearNotice();
}
function users(){try{return JSON.parse(localStorage.getItem("securespace_demo_users")||"[]")}catch{return []}}
function score(p){return [p.length>=8,/[A-Z]/.test(p),/[a-z]/.test(p),/\d/.test(p),/[^A-Za-z0-9]/.test(p)].filter(Boolean).length}
function strength(){const n=score($("password").value),labels=["Add a password","Very weak","Weak","Fair","Good","Strong"];$("bar").style.width=(n*20)+"%";$("bar").style.background=n<2?"#d65b65":n<4?"#e5a33d":"#36b58a";$("strengthText").textContent=labels[n];}
function showDashboard(user){
 $("welcomeName").textContent=user.name.split(" ")[0];
 $("authShell").hidden=true;$("dashboard").hidden=false;
 document.title="Welcome, "+user.name+" — SecureSpace";
 window.scrollTo({top:0,behavior:"smooth"});
}
$("loginTab").addEventListener("click",()=>setMode("login"));
$("signupTab").addEventListener("click",()=>setMode("signup"));
$("password").addEventListener("input",strength);
$("toggle").addEventListener("click",()=>{const show=$("password").type==="password";$("password").type=show?"text":"password";$("toggle").textContent=show?"Hide":"Show"});
$("forgot").addEventListener("click",()=>{const email=$("email").value.trim();notice(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)?`Demo only: a reset link would be sent to ${email}. No email was sent.`:"Enter a valid email address first. Password reset is demo-only.");});
$("termsLink").addEventListener("click",e=>{e.preventDefault();notice("Demo terms: use this project for learning only. Do not enter real personal information.");});
$("authForm").addEventListener("submit",e=>{
 e.preventDefault();clearErrors();clearNotice();
 const name=$("name").value.trim(),email=$("email").value.trim().toLowerCase(),password=$("password").value;
 let ok=true;
 if(mode==="signup"&&name.length<2){$("nameError").textContent="Enter your name (at least 2 characters).";ok=false}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){$("emailError").textContent="Enter a valid email address.";ok=false}
 if(password.length<8){$("passwordError").textContent="Password must be at least 8 characters.";ok=false}
 if(mode==="signup"){
  if(password!==$("confirm").value){$("confirmError").textContent="Passwords do not match.";ok=false}
  if(score(password)<3){$("passwordError").textContent="Use uppercase, lowercase, numbers or symbols.";ok=false}
  if(!$("terms").checked){notice("Please accept the demo terms to continue.","error");ok=false}
 }
 if(!ok)return;
 const list=users();
 if(mode==="signup"){
  if(list.some(u=>u.email===email)){notice("An account with this email already exists in this browser demo.","error");return}
  // Learning demo only: localStorage password storage is not secure.
  list.push({name,email,password});localStorage.setItem("securespace_demo_users",JSON.stringify(list));
  $("authForm").reset();setMode("login");notice("Account created in this browser demo. You can now sign in.","success");
 }else{
  const user=list.find(u=>u.email===email&&u.password===password);
  if(!user){notice("No matching demo account found. Create an account first or check your details.","error");return}
  showDashboard(user);
 }
});
$("logout").addEventListener("click",()=>{$("dashboard").hidden=true;$("authShell").hidden=false;$("authForm").reset();setMode("login");$("email").value="";$("password").value="";window.scrollTo({top:0,behavior:"smooth"});});
setMode("login");
