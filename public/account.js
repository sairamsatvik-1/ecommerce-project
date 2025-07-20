function showSignup() {
    const box = document.querySelector(".box");
    box.innerHTML = `
      <div class="header">
          <img src="image.png" alt="shop"><p>MYShop</p>
      </div>
      <div class="form">
          <h2>Create Account........</h2>
          <form>
             <div class="inputcontainer"> <label>Enter Username<input type="text" required placeholder="Enter Username" id="username"></label>
              <span id="usererror" style="color:red; font-size:15px;"></span>
              <label>Enter email:<input type="email" required placeholder="Enter your email id" id="email"></label>
              <span id="emailerror" style="color:red; font-size:15px;"></span>
              <label>Enter Password:<input type="password" required placeholder="Enter your Password" id="password"></label>
              <span id="passerror" style="color:red; font-size:15px;"></span>
              <label>Confirm Password:<input type="password" required placeholder="Enter your Password" id="confirmpassword"></label>
              <span id="confirmpasserror" style="color:red; font-size:15px;"></span>
             </div> <label style="display:none" id="otplable">Enter otp send to mail:<input type="text"  placeholder="Enter otp" id="otpid">
              <p id="otperror" style="color:red"></p><button id="verifyotp">verify otp</button></label>
              
              <button class="Signup" type="submit">Create account</button>
          </form>
      </div>
      <div class="bottom">
          <div>Login to your account <button class="loginform">Login</button></div>
          <div>Forgot password<button class="forgotpassword">Forgot password</button></div>
      </div>
    `;
    addListeners();
    document.querySelector("form").addEventListener("submit", handleSingnupSubmit);

    }
  
  function showLogin() {
    const box = document.querySelector(".box");
    box.innerHTML = `
      <div class="header">
          <img src="image.png" alt="shop"><p>MYShop</p>
      </div>
      <div class="form">
          <h2>Please Login........</h2>
          <form>
              <label>Enter email:<input type="email" required placeholder="Enter your email id" id="email"></label>
              <label>Enter Password:<input type="password" required placeholder="Enter your Password" id="password"></label>
              <span id="loginerror" style="color:red"></span>
              <button class="Login" type="submit">Login</button>
          </form>
      </div>
      <div class="bottom">
          <div>Don't you have an account <button class="signupform">Signup</button></div>
          <div>Forgot password<button class="forgotpassword">Forgot password</button></div>
      </div>
    `;
    addListeners();
    document.querySelector("form").addEventListener("submit", handleLoginSubmit);

 
  }
  
  function addListeners() {
    document.querySelector('.signupform')?.addEventListener('click', showSignup);
    document.querySelector('.loginform')?.addEventListener('click', showLogin);
    
  }

  addListeners();
  const loginForm = document.querySelector("form");
if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
}
 async function handleLoginSubmit(e){
    e.preventDefault();
const loginerror=document.getElementById("loginerror")
loginerror.innerHTML="";
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
console.log(email,password)
  const res=await fetch("/Login",{
    method:"POST",
    headers:{
      'Content-Type':"application/json",
    },
    body:JSON.stringify({email,password}),
});
const data=await res.json();
if(res.ok){
  
  window.location.href = '/dashboard'; 
  email.value="";
  password.value="";
}
if (data.redirect) {
  window.location.href = data.redirect;
}
else{
  loginerror.innerHTML="invalid email/password"
  email.value="";
  password.value='';
}
emailInput.value="";
passwordInput.value='';

}
async function handleSingnupSubmit(e){
  e.preventDefault();
  const otperror=document.getElementById("otperror");
  const inputcontainer=document.querySelector(".inputcontainer");
  const createbutton=document.querySelector(".Signup");
  const verifyotp=document.querySelector("#verifyotp");
  const otplable=document.getElementById("otplable");
  const otpid=document.getElementById("otpid");
const passerror=document.getElementById("passerror");
const confirmpasserror=document.getElementById("confirmpasserror");
const usererror=document.getElementById("usererror");
const emailerror=document.getElementById("emailerror");
const passwordInput=document.getElementById("password");
const conpasswordInput=document.getElementById("confirmpassword");
const nameInput=document.getElementById("username");
const emailInput=document.getElementById("email");
usererror.innerHTML = "";
    emailerror.innerHTML = "";
    passerror.innerHTML = "";
    confirmpasserror.innerHTML = "";
    if(nameInput.value.length<6){
 usererror.innerHTML="username length should be at least 6 characters";
 return;
}
if(passwordInput.value!==conpasswordInput.value){
  confirmpasserror.innerHTML="Confirm password should match with password";
  return;
}

const RegExp=/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%&^*]).{8,}$/;
if(!RegExp.test(passwordInput.value)){
  passerror.innerHTML="password should contain alphabets upper and lower cases ,a digit,aspecialsymbol";
  return;
}
const email=emailInput.value;
const password=passwordInput.value;
const username=nameInput.value;
const res=await fetch("/Otpsend",{
  method:"POST",
  headers:{
    "content-type":"application/json",
  },
  body:JSON.stringify({email,password,username})
});
const data=await res.json();
if(res.ok){
  otplable.style.display='block';
createbutton.style.display="none";
inputcontainer.style.display="none";
verifyotp.addEventListener("click",async (e)=>{
  e.preventDefault();
  const otp=otpid.value;
  const ores=await fetch("/otp",{
    method:"POST",
    headers:{
      "content-type":"application/json",
    },
    body:JSON.stringify({email,otp})
  });
  const odata=await ores.json();
  if(ores.ok){
    alert("registration successfull");
  }
  else if(odata==="invalidotp"){
otperror.innerHTML="otp doesn't matched"
  }
  else if(odata==="usernotfound"||odata==="otpexpired"){
    otperror.innerHTML="otp expired";

  }
  else{
    alert("server error try later!");
  }
  otpid.value="";
});
  
 
}
else if(data==="userexits"){
  usererror.innerHTML="username already exits"

}
else if(data==="emailexits"){
  emailerror.innerHTML="email already exits"
}
else{
  alert("servorerror");
}
emailInput.value="";
passwordInput.value="";
  nameInput.value="";
  conpasswordInput.value="";


}
  