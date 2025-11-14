/*
Program name: app.js (HW4)
Author: Gabriela Cortes
Date created: 11/13/2025
Description: JavaScript for HW4 — Fetch, Cookies, LocalStorage
*/

// Short helper
function $(id){ return document.getElementById(id); }

/* ============================
      COOKIE FUNCTIONS
=============================*/
function setCookie(name, value, hours) {
  let d = new Date();
  d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  let cname = name + "=";
  let decoded = decodeURIComponent(document.cookie);
  let ca = decoded.split(';');

  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970; path=/;";
}

/* ============================
      FETCH STATES
=============================*/
async function loadStates(){
  try{
    let r = await fetch("states.txt");
    let txt = await r.text();
    let lines = txt.split("\n");

    let sel = $("state");
    sel.innerHTML = "<option value=''>Choose state</option>";

    lines.forEach(s=>{
      s = s.trim();
      if(s.length>0){
        let opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        sel.appendChild(opt);
      }
    });

  } catch(err){
    $("state").innerHTML = "<option>Error loading states</option>";
  }
}

/* ============================
      FETCH CONDITIONS
=============================*/
async function loadConditions(){
  try{
    let r = await fetch("conditions.txt");
    let txt = await r.text();

    let out = "";
    txt.split("\n").forEach(c=>{
      c = c.trim();
      if(c.length>0){
        out += `
          <label>
            <input type="checkbox" class="cond" value="${c}"> ${c}
          </label><br>
        `;
      }
    });

    $("conditionsBox").innerHTML = out;

  } catch(err){
    $("conditionsBox").innerHTML = "Error loading conditions...";
  }
}

/* ============================
      SAVE ALL TO LOCALSTORAGE
=============================*/
function saveAll() {
  let data = {
    firstname: $("firstname").value,
    middle: $("middle").value,
    lastname: $("lastname").value,
    dob: $("dob").value,
    travel: $("travel").value,
    ssn: $("ssn").value,
    email: $("email").value,
    phone: $("phone").value,
    addr1: $("addr1").value,
    addr2: $("addr2").value,
    city: $("city").value,
    state: $("state").value,
    zip: $("zip").value,
    symptoms: $("symptoms").value,
    salary: $("salary").value,
    housing: document.querySelector("input[name='housing']:checked")?.value || "",
    vacc: document.querySelector("input[name='vacc']:checked")?.value || "",
    conditions: []
  };

  document.querySelectorAll(".cond").forEach(ch=>{
    if(ch.checked) data.conditions.push(ch.value);
  });

  localStorage.setItem("formData", JSON.stringify(data));
}

/* ============================
      LOAD ALL FROM LOCALSTORAGE
=============================*/
function loadAll() {
  let saved = localStorage.getItem("formData");
  if(!saved) return;
  
  let data = JSON.parse(saved);

  $("firstname").value = data.firstname || "";
  $("middle").value = data.middle || "";
  $("lastname").value = data.lastname || "";
  $("dob").value = data.dob || "";
  $("travel").value = data.travel || "";
  $("ssn").value = data.ssn || "";
  $("email").value = data.email || "";
  $("phone").value = data.phone || "";
  $("addr1").value = data.addr1 || "";
  $("addr2").value = data.addr2 || "";
  $("city").value = data.city || "";
  $("state").value = data.state || "";
  $("zip").value = data.zip || "";
  $("symptoms").value = data.symptoms || "";
  $("salary").value = data.salary || 50000;
  $("salaryOut").textContent = "$" + Number($("salary").value).toLocaleString();

  // housing
  if(data.housing){
    document.querySelector(`input[name='housing'][value='${data.housing}']`).checked = true;
  }

  // vacc
  if(data.vacc){
    document.querySelector(`input[name='vacc'][value='${data.vacc}']`).checked = true;
  }

  // conditions
  document.querySelectorAll(".cond").forEach(ch=>{
    if(data.conditions.includes(ch.value)) ch.checked = true;
  });
}

/* ============================
      ON PAGE LOAD
=============================*/
document.addEventListener("DOMContentLoaded", ()=>{

  loadStates();
  loadConditions();

  // Salary output
  $("salary").oninput = ()=>{
    $("salaryOut").textContent = "$" + Number($("salary").value).toLocaleString();
  };

  // Remember Me cookie
  let savedName = getCookie("firstname");
  if(savedName){
    $("welcomeBox").innerHTML = "Welcome back, " + savedName + "!";
  } else {
    $("welcomeBox").innerHTML = "Hello new user!";
  }

  // Load localStorage AFTER conditions
  setTimeout(loadAll, 400);

  $("btnSave").onclick = ()=>{
    saveAll();
    if($("rememberMe").checked){
      setCookie("firstname", $("firstname").value, 48);
    } else {
      deleteCookie("firstname");
    }
    alert("Saved!");
  };

  $("btnReset").onclick = ()=>{
    localStorage.clear();
  };

});
