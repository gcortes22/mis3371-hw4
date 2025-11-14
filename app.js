/*
Program name: app.js (HW4)
Author: Gabriela Cortes
*/

function $(id) { return document.getElementById(id); }

/* COOKIE FUNCTIONS */
function getCookie(name) {
  let c = document.cookie.split(";");
  for (let i of c) {
    i = i.trim();
    if (i.startsWith(name + "=")) {
      return i.split("=")[1];
    }
  }
  return "";
}

function setCookie(name, value, hours) {
  let d = new Date();
  d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970; path=/`;
}

/* FETCH STATES */
async function loadStates() {
  try {
    let r = await fetch("states.txt");
    let txt = await r.text();
    let sel = $("state");
    sel.innerHTML = "";

    txt.split("\n").forEach(s => {
      s = s.trim();
      if (s) {
        let opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        sel.appendChild(opt);
      }
    });

  } catch (e) {
    $("state").innerHTML = "<option>Error loading states</option>";
  }
}

/* FETCH CONDITIONS */
async function loadConditions() {
  try {
    let r = await fetch("conditions.txt");
    let txt = await r.text();
    let out = "";

    txt.split("\n").forEach(c => {
      c = c.trim();
      if (c)
        out += `<label><input type="checkbox" class="cond" value="${c}"> ${c}</label><br>`;
    });

    $("conditionsBox").innerHTML = out;

  } catch (e) {
    $("conditionsBox").textContent = "Error loading conditions.";
  }
}

/* SAVE EVERYTHING TO LOCAL STORAGE */
function saveAll() {
  if (!$("rememberMe").checked) return;

  let data = {
    firstname: $("firstname").value,
    lastname: $("lastname").value,
    email: $("email").value,
    state: $("state").value,
    conditions: []
  };

  document.querySelectorAll(".cond").forEach(ch => {
    if (ch.checked) data.conditions.push(ch.value);
  });

  localStorage.setItem("formData", JSON.stringify(data));
}

/* LOAD EVERYTHING FROM LOCAL STORAGE */
function loadAll() {
  let saved = localStorage.getItem("formData");
  if (!saved) return;

  let d = JSON.parse(saved);

  $("firstname").value = d.firstname || "";
  $("lastname").value  = d.lastname || "";
  $("email").value     = d.email || "";
  $("state").value     = d.state || "";

  document.querySelectorAll(".cond").forEach(ch => {
    if (d.conditions.includes(ch.value)) ch.checked = true;
  });
}

/* WELCOME HEADER */
function setupWelcome() {
  let name = getCookie("firstname");
  let box = $("welcomeBox");

  if (name) {
    box.innerHTML = `Welcome back, ${name}! 
      <label><input type="checkbox" id="notMe"> Not ${name}? Click here</label>`;

    $("notMe").onchange = () => {
      deleteCookie("firstname");
      localStorage.clear();
      location.reload();
    };
  } else {
    box.textContent = "Hello new user!";
  }
}

/* PAGE LOAD */
document.addEventListener("DOMContentLoaded", () => {

  loadStates();
  loadConditions();
  setupWelcome();

  // Load stored values AFTER checkboxes load
  setTimeout(loadAll, 300);

  $("btnSave").onclick = () => {
    saveAll();
    if ($("rememberMe").checked) {
      let fn = $("firstname").value.trim();
      if (fn) setCookie("firstname", fn, 48);
      alert("Saved!");
    }
  };

  $("btnReset").onclick = () => {
    localStorage.clear();
    deleteCookie("firstname");
  };
});
