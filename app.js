/*
Program name: app.js 
Author: Gabriela Cortes
Date created: 11/13/2025
Description: JavaScript for HW4 – Fetch, Cookies, Local Storage
*/


function $(id) { return document.getElementById(id); }

/* ---------------- COOKIE HELPERS ---------------- */
function getCookie(name) {
  let parts = document.cookie.split(";");
  for (let i = 0; i < parts.length; i++) {
    let c = parts[i].trim();
    if (c.startsWith(name + "=")) {
      return c.substring(name.length + 1);
    }
  }
  return "";
}

function setCookie(name, value, hours) {
  let expires = "";
  if (hours) {
    let d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
    expires = "; expires=" + d.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/* ---------------- FETCH FUNCTIONS ---------------- */
// read states.txt with Fetch API
async function loadStates() {
  try {
    let r = await fetch("states.txt");
    let txt = await r.text();
    let lines = txt.split("\n");

    let sel = $("state");
    sel.innerHTML = "<option value=''>Choose state</option>";

    lines.forEach(function (s) {
      s = s.trim();
      if (s.length > 0) {
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


async function loadConditions() {
  try {
    let r = await fetch("conditions.txt");
    let txt = await r.text();
    let out = "";

    txt.split("\n").forEach(function (c) {
      c = c.trim();
      if (c.length > 0) {
        out += '<label><input type="checkbox" class="cond" value="' +
               c + '"> ' + c + '</label><br>';
      }
    });

    $("conditionsBox").innerHTML = out;
  } catch (e) {
    $("conditionsBox").innerHTML = "Error loading conditions";
  }
}

/* ---------------- LOCAL STORAGE ---------------- */
function saveAll() {
  let data = {
    firstname: $("firstname").value,
    lastname: $("lastname").value,
    email: $("email").value,
    state: $("state").value,
    conditions: []
  };

  document.querySelectorAll(".cond").forEach(function (ch) {
    if (ch.checked) data.conditions.push(ch.value);
  });

  localStorage.setItem("formData", JSON.stringify(data));
}

function loadAll() {
  let saved = localStorage.getItem("formData");
  if (!saved) return;

  let data = JSON.parse(saved);

  $("firstname").value = data.firstname || "";
  $("lastname").value  = data.lastname || "";
  $("email").value     = data.email || "";
  $("state").value     = data.state || "";

  document.querySelectorAll(".cond").forEach(function (ch) {
    ch.checked = data.conditions && data.conditions.indexOf(ch.value) !== -1;
  });
}

/* ---------------- WELCOME HEADER ---------------- */
function setupWelcome() {
  let box = $("welcomeBox");
  let name = getCookie("firstname");

  if (name) {
    box.innerHTML = "Welcome back, " + name + "!";

    let div = document.createElement("div");
    div.style.marginTop = "6px";
    div.innerHTML =
      '<label><input type="checkbox" id="notMe"> Not ' +
      name + '? Start as new user</label>';
    box.appendChild(div);

    $("notMe").onchange = function () {
      deleteCookie("firstname");
      localStorage.clear();
      location.reload();
    };
  } else {
    box.textContent = "Hello new user!";
  }
}

/* ---------------- PAGE SETUP ---------------- */
document.addEventListener("DOMContentLoaded", function () {

  setupWelcome();   
  loadStates();     
  loadConditions(); 

  
  if (getCookie("firstname")) {
    setTimeout(loadAll, 400);
  }

  $("btnSave").onclick = function () {
    saveAll();

    if ($("rememberMe").checked) {
      let fn = $("firstname").value.trim();
      if (fn !== "") setCookie("firstname", fn, 48); // 48 hours
    } else {
      deleteCookie("firstname");
      localStorage.clear();
    }

    alert("Saved.");
  };

  $("btnReset").onclick = function () {
    localStorage.clear();
  };
});
