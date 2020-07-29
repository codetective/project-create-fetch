window.addEventListener("DOMContentLoaded", () => {
setTimeout(() => {
  
  const loader = document.querySelector(".loader");
  loader.classList.add("no-loader");
}, 1200);
});

const shrinkHeader = () => {
  if (header.classList.contains('shrink')) {
    return
  } else {
    header.classList.add("shrink");
  }
}

const showToast = (msg) => {
  const toastbx = document.createElement("div");
  toastbx.classList.add("toastbx");
  toastbx.textContent = msg;
  tsbx.appendChild(toastbx);
  requestAnimationFrame(() => toastbx.classList.add("sh-toastbx"));

  setTimeout(function () {
    requestAnimationFrame(() => toastbx.classList.remove("sh-toastbx"));
    setTimeout(function () {
      requestAnimationFrame(() => tsbx.removeChild(toastbx));
    }, 500);
  }, 3300);
};

const showSearching = () => {
  srchbar.textContent = "Searching ...";
  srchbar.classList.add("sh-ntfy");

  setTimeout(function () {
    if (srchbar.classList.contains("sh-ntfy")) {
      hideSearching();
    } else {
      return;
    }
  }, 15000);
};
const hideSearching = () => {
  srchbar.textContent = "";
  srchbar.classList.remove("sh-ntfy");
};

const showWikiResults = (wordSearched, results) => {
  srchbar.textContent = "Loading ...";
  if (results[1].length == 0) {
    let li = document.createElement("li");
    li.textContent = "No results for " + "'" + wordSearched + " ' on Wikipedia";
    rbx.appendChild(li);
  } else {
    let wTitle = document.createElement("p");
        wTitle.classList.add("text-center");

    wTitle.textContent =
      "showing results for " + "'" + wordSearched + "'" + " on Wikipedia";
    rbx.appendChild(wTitle);
    for (var i = 0; i < results[1].length; i++) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      let desc = document.createElement("i");

      if (results[2][i] == "") {
        desc.textContent = "No description provided, click to read more";
      } else {
        desc.textContent = results[2][i];
      }
      a.setAttribute("href", results[3][i]);
      a.textContent = results[1][i];
      li.appendChild(a);
      li.appendChild(desc);
      rbx.appendChild(li);
    }
  }
};

const showGuardianResults = (wordSearched, results) => {
  hideSearching();
  const res = results.results;
  if (results.pages == 0) {
    let li = document.createElement("li");
    li.textContent =
      "No results for " + "'" + wordSearched + "' " + "on Guardian";
    gbx.appendChild(li);
  } else {
    let gTitle = document.createElement("p");
    gTitle.classList.add('text-center')
    gTitle.textContent =
      "showing results for " + "'" + wordSearched + "' " + "on Guardian";
    gbx.appendChild(gTitle);
    for (let i = 0; i < res.length; i++) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      let sm = document.createElement("small");

      a.setAttribute("href", res[i].webUrl);
      a.textContent = res[i].webTitle;
      sm.textContent = res[i].sectionName;

      li.appendChild(a);
      li.appendChild(sm);
      gbx.appendChild(li);
    }
  }
};

const fetchGuardian = (wordToSearch) => {
  try {
    $.getJSON(
      "https://content.guardianapis.com/search?q=" +
        wordToSearch +
        "&format=json&&api-key=c31c8431-b15e-44e4-8037-290f7b6f4a4c",
      function (result) {
        gbx.innerHTML = "";
        showGuardianResults(wordToSearch, result.response);
      }
    );
  } catch (err) {
    showToast(err);
  }
};

const fetchWiki = (wordToSearch) => {
  showSearching();
  sb.value = "";
  try {
    $.getJSON(
      "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
        wordToSearch +
        "&format=json&callback=?",
      function (result) {
        rbx.innerHTML = "";
        shrinkHeader()
        showWikiResults(wordToSearch, result);
        fetchGuardian(wordToSearch);
      }
    );
  } catch (err) {
    hideSearching();
    showToast(err);
  }
};

let handleSubmit = (ev) => {
  ev.preventDefault();
  if (sb.value === "") {
    showToast("Search value cannot be empty");
  } else {
    fetchWiki(sb.value);
  }
};

const sb = document.querySelector("#sbi");
const sf = document.querySelector("form");
const header = document.querySelector("header");
const tsbx = document.querySelector(".toastbox");
const rbx = document.querySelector("#results-container");
const gbx = document.querySelector("#gr-container");
const srchbar = document.querySelector(".search-notify");

sf.addEventListener("submit", handleSubmit);

