/*
Program name: app.js (HW4)
Author: Gabriela Cortes
Date created: 11/13/2025
Description: JavaScript for HW4 – Fetch, Cookies, Local Storage
*/

/* ---------- helper: get element by id ---------- */
function $(id) { return document.getElementById(id); }

/* ---------- COOKIE FUNCTIONS ---------- */
function getCookie(name) {
  var parts = document.cookie.split(";");
  for (var i = 0; i < parts.length; i++) {
    var c = parts[i].trim();
    if (c.indexOf(name + "=") === 0) {
      return c.substring(name.length + 1);
    }
  }
  return "";
}

function setCookie(name, value, hours) {
  var expires = "";
  if (hours) {
    var d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
    expires = "; expires=" + d.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/* ---------- FETCH FUNCTIONS ---------- */
// load state list from states.txt
async function loadStates() {
  try {
    var r = await fetch("states.txt");
    var txt = await r.text();
    var lines = txt.split("\n");
    var sel = $("state");
    sel.innerHTML = "<option value=''>Choose state</option>";

    lines.forEach(function (s) {
      s = s.trim();
      if (s.length > 0) {
        var opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        sel.appendChild(opt);
      }
    });
  } catch (e) {
    $("state").innerHTML = "<option>Error loading states</option>";
  }
}

// load conditions from conditions.txt
async function loadConditions() {
  try {
    var r = await fetch("conditions.txt");
    var txt = await r.text();
    var out = "";

    txt.split("\n").forEach(function (c) {
      c = c.trim();
      if (c.length > 0) {
        out += '<label><input type="checkbox" class="cond" value="' +
               c + '"> ' + c + '</label><br>';
      }
    });

    $("conditionsBox").innerHTML = out;
  } catch (e) {
    $("conditionsBox").innerHTML = "Error loading conditions.";
  }
}

/* ---------- LOCAL STORAGE ---------- */
function saveAll() {
  if (!$("rememberMe").checked) {
    // if user does NOT want to be remembered, do not store anything
    localStorage.removeItem("formData");
    return;
  }

  var data = {
    firstname: $("firstname").value,
    lastname:  $("lastname").value,
    email:     $("email").value,
    state:     $("state").value,
    conditions: []
  };

  var conds = document.querySelectorAll(".cond");
  for (var i = 0; i < conds.length; i++) {
    if (conds[i].checked) data.conditions.push(conds[i].value);
  }

  localStorage.setItem("formData", JSON.stringify(data));
}

function loadAll() {
  var saved = localStorage.getItem("formData");
  if (!saved) return;

  var data = JSON.parse(saved);

  $("firstname").value = data.firstname || "";
  $("lastname").value  = data.lastname || "";
  $("email").value     = data.email || "";
  $("state").value     = data.state || "";

  // check conditions
  var conds = document.querySelectorAll(".cond");
  for (var i = 0; i < conds.length; i++) {
    conds[i].checked = data.conditions &&
                       data.conditions.indexOf(conds[i].value) !== -1;
  }
}

/* ---------- WELCOME HEADER ---------- */
function setupWelcome() {
  var box = $("welcomeBox");
  var name = getCookie("firstname");

  if (name) {
    box.innerHTML = "Welcome back, " + name +
                    '!<br><label><input type="checkbox" id="notMe"> Not ' +
                    name + '? Start as new user</label>';

    var notBox = $("notMe");
    if (notBox) {
      notBox.onchange = function () {
        deleteCookie("firstname");
        localStorage.clear();
        location.reload();
      };
    }
  } else {
    box.textContent = "Hello new user!";
  }
}

/* ---------- PAGE SETUP ---------- */
document.addEventListener("DOMContentLoaded", function () {

  setupWelcome();
  loadStates();
  loadConditions();

  // after conditions are loaded, restore any localStorage data
  setTimeout(function () {
    if (getCookie("firstname")) {
      loadAll();

      // if first name empty but cookie has name, use cookie
      if (!$("firstname").value) {
        $("firstname").value = getCookie("firstname");
      }
    }
  }, 400);

  // auto-save when fields change (only if Remember Me is checked)
  ["firstname", "lastname", "email"].forEach(function (id) {
    var el = $(id);
    el.onblur = function () { saveAll(); };
  });
  $("sta
