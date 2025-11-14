/*
Program name: app.js (HW4)
Author: Gabriela Cortes
Date created: 11/13/2025
Description: JavaScript for HW4 
*/


function $(id) { return document.getElementById(id); }




async function loadStates() {
  try {
    let url = "https://raw.githubusercontent.com/gcortes22/mis3371-hw4/main/states.txt";
    let r = await fetch(url);
    let txt = await r.text();
    let lines = txt.split("\n");

    let stateSelect = $("state");
    stateSelect.innerHTML = "<option value=''>Choose state</option>";

    lines.forEach(s => {
      s = s.trim();
      if (s.length > 0) {
        let opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        stateSelect.appendChild(opt);
      }
    });

  } catch (err) {
    $("state").innerHTML = "<option>Error loading states</option>";
  }
}


async function loadConditions() {
  try {
    let url = "https://raw.githubusercontent.com/gcortes22/mis3371-hw4/main/conditions.txt";
    let r = await fetch(url);
    let txt = await r.text();

    let out = "";
    txt.split("\n").forEach(c => {
      c = c.trim();
      if (c.length > 0) {
        out += `<label><input type="checkbox" class="cond" value="${c}"> ${c}</label><br>`;
      }
    });

    $("conditionsBox").innerHTML = out;

  } catch (err) {
    $("conditionsBox").innerHTML = "Error loading conditions.";
  }
}


function saveAll() {
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


function loadAll() {
  let saved = localStorage.getItem("formData");
  if (!saved) return;

  let data = JSON.parse(saved);

  $("firstname").value = data.firstname || "";
  $("lastname").value = data.lastname || "";
  $("email").value = data.email || "";
  $("state").value = data.state || "";

  
  if (data.conditions) {
    document.querySelectorAll(".cond").forEach(ch => {
      if (data.conditions.includes(ch.value)) ch.checked = true;
    });
  }
}



document.addEventListener("DOMContentLoaded", function () {

  loadStates();
  loadConditions();

 
  if (document.cookie.includes("firstname=")) {
    setTimeout(loadAll, 400); 
  }


  $("btnSave").onclick = function () {
    saveAll();


    if ($("rememberMe").checked) {
      let fn = $("firstname").value.trim();
      if (fn !== "") setCookie("firstname", fn, 48); // 48 hrs
    } else {
      deleteCookie("firstname");
      localStorage.clear();
    }

    alert("Saved!");
  };


  $("btnReset").onclick = function () {
    localStorage.clear();
  };

});

