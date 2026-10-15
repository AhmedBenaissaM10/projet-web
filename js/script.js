"use strict";

/* ============ Données ============ */
const TOPICS = { html: "HTML", css: "CSS", js: "JavaScript" };

const BUILTIN = [
  /* ---- HTML ---- */
  {
    topic: "html",
    q: "Quelle balise HTML5 sert à définir le contenu principal d'une page ?",
    options: ["<section>", "<main>", "<article>", "<div>"],
    answer: 1,
    explain: "<main> représente le contenu principal unique de la page, ce qui aide aussi les lecteurs d'écran."
  },
  {
    topic: "html",
    q: "Quel attribut HTML rend une image accessible aux lecteurs d'écran ?",
    options: ["title", "name", "alt", "label"],
    answer: 2,
    explain: "L'attribut alt fournit une description textuelle de l'image."
  },
  {
    topic: "html",
    q: "Quelle balise sert à créer un lien hypertexte ?",
    options: ["<link>", "<a>", "<href>", "<nav>"],
    answer: 1,
    explain: "<a href=\"...\"> crée un lien. <link> sert à relier des ressources externes (feuille de style) dans le <head>."
  },
  {
    topic: "html",
    q: "Quel attribut rend un champ de formulaire obligatoire ?",
    options: ["required", "mandatory", "needed", "validate"],
    answer: 0,
    explain: "required empêche l'envoi du formulaire tant que le champ est vide."
  },
  {
    topic: "html",
    q: "Quelle balise sémantique représente un pied de page ?",
    options: ["<bottom>", "<footer>", "<end>", "<section>"],
    answer: 1,
    explain: "<footer> contient les informations de fin de page ou de section (auteur, liens, mentions)."
  },
  {
    topic: "html",
    q: "Quelle est la déclaration du type de document en HTML5 ?",
    options: ["<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<html5>", "<!HTML version=5>"],
    answer: 0,
    explain: "<!DOCTYPE html> est la forme courte de HTML5. Elle place le navigateur en mode standard."
  },

  /* ---- CSS ---- */
  {
    topic: "css",
    q: "Quelle propriété CSS active le modèle Flexbox sur un conteneur ?",
    options: ["display: flex", "position: flex", "flex: container", "layout: flex"],
    answer: 0,
    explain: "On écrit display: flex sur le conteneur parent pour que ses enfants deviennent des éléments flex."
  },
  {
    topic: "css",
    q: "Quelle fonction CSS crée une grille de 3 colonnes de largeur égale ?",
    options: ["grid-template-columns: repeat(3, 1fr)", "grid-columns: 3", "columns: grid(3)", "display: grid(3)"],
    answer: 0,
    explain: "repeat(3, 1fr) répète 3 colonnes qui se partagent l'espace disponible à parts égales."
  },
  {
    topic: "css",
    q: "Quelle media query cible les écrans de 600px de large ou moins ?",
    options: ["@media (min-width: 600px)", "@media (max-width: 600px)", "@screen (600px)", "@media (width > 600)"],
    answer: 1,
    explain: "max-width: 600px s'applique jusqu'à 600px de largeur : c'est la logique « desktop-first »."
  },
  {
    topic: "css",
    q: "Quelle propriété modifie l'espace entre le contenu d'un élément et sa bordure ?",
    options: ["margin", "padding", "gap", "spacing"],
    answer: 1,
    explain: "padding agit à l'intérieur de la bordure ; margin agit à l'extérieur."
  },
  {
    topic: "css",
    q: "Quelle valeur de box-sizing inclut le padding et la bordure dans la largeur déclarée ?",
    options: ["content-box", "border-box", "padding-box", "inherit"],
    answer: 1,
    explain: "Avec border-box, width: 200px donne bien un élément de 200px au total, bordure et padding compris."
  },
  {
    topic: "css",
    q: "Quelle unité est relative à la taille de police de l'élément racine ?",
    options: ["em", "px", "rem", "vh"],
    answer: 2,
    explain: "rem se calcule à partir de la police de <html>. em dépend, lui, de l'élément parent."
  },

  /* ---- JavaScript ---- */
  {
    topic: "js",
    q: "Que renvoie typeof null en JavaScript ?",
    options: ["\"null\"", "\"undefined\"", "\"object\"", "\"number\""],
    answer: 2,
    explain: "C'est un bug historique du langage : typeof null renvoie \"object\"."
  },
  {
    topic: "js",
    q: "Quelle méthode ajoute un élément à la fin d'un tableau JavaScript ?",
    options: ["shift()", "push()", "pop()", "unshift()"],
    answer: 1,
    explain: "push() ajoute à la fin ; pop() retire le dernier ; shift()/unshift() agissent au début."
  },
  {
    topic: "js",
    q: "Quel mot-clé déclare une variable dont la valeur ne peut pas être réassignée ?",
    options: ["var", "let", "const", "static"],
    answer: 2,
    explain: "const empêche la réassignation (mais un objet const reste modifiable en interne)."
  },
  {
    topic: "js",
    q: "Quel opérateur compare la valeur et le type, sans conversion ?",
    options: ["==", "===", "=", "!="],
    answer: 1,
    explain: "=== est la comparaison stricte : 5 === \"5\" vaut false, alors que 5 == \"5\" vaut true."
  },
  {
    topic: "js",
    q: "Quelle méthode applique une fonction à chaque élément d'un tableau et renvoie un nouveau tableau ?",
    options: ["forEach()", "map()", "filter()", "reduce()"],
    answer: 1,
    explain: "map() transforme chaque élément. filter() ne garde que certains éléments, forEach() ne renvoie rien."
  },
  {
    topic: "js",
    q: "Quelle méthode attache un écouteur d'événement à un élément ?",
    options: ["addEventListener()", "onEvent()", "listen()", "attachEvent()"],
    answer: 0,
    explain: "element.addEventListener(\"click\", handler) est la méthode standard. attachEvent() n'existait que sur les anciens Internet Explorer."
  },

  /* ---- HTML (suite) ---- */
  {
    topic: "html",
    q: "Quelle balise définit le titre de plus haut niveau dans le contenu d'une page ?",
    options: ["<h1>", "<head>", "<header>", "<title>"],
    answer: 0,
    explain: "<h1> est le titre principal visible dans la page. <title> s'affiche dans l'onglet et <header> est une zone d'en-tête."
  },
  {
    topic: "html",
    q: "Quel élément regroupe des champs de formulaire liés, avec une légende ?",
    options: ["<fieldset>", "<group>", "<section>", "<form-group>"],
    answer: 0,
    explain: "<fieldset> regroupe les champs, et <legend> lui donne un titre. C'est aussi utile pour l'accessibilité."
  },
  {
    topic: "html",
    q: "Quelle balise crée une liste ordonnée (numérotée) ?",
    options: ["<ul>", "<ol>", "<li>", "<dl>"],
    answer: 1,
    explain: "<ol> numérote ses éléments <li>. <ul> crée une liste à puces et <dl> une liste de définitions."
  },
  {
    topic: "html",
    q: "Quel attribut relie un <label> à son champ de formulaire ?",
    options: ["for", "name", "href", "target"],
    answer: 0,
    explain: "<label for=\"email\"> correspond au champ qui a id=\"email\". Cliquer sur le label active alors le champ."
  },

  /* ---- CSS (suite) ---- */
  {
    topic: "css",
    q: "Quelle propriété CSS contrôle l'ordre d'empilement des éléments positionnés ?",
    options: ["z-index", "order", "stack", "layer"],
    answer: 0,
    explain: "z-index décide quel élément passe devant. Il ne s'applique qu'aux éléments positionnés (ou aux éléments flex et grid)."
  },
  {
    topic: "css",
    q: "Quelle pseudo-classe cible un élément quand la souris le survole ?",
    options: [":hover", ":active", ":focus", ":over"],
    answer: 0,
    explain: ":hover s'applique au survol. :active s'applique pendant le clic et :focus quand l'élément a le focus clavier."
  },
  {
    topic: "css",
    q: "Quelle valeur de position garde un élément à la même place dans la fenêtre pendant le défilement ?",
    options: ["relative", "absolute", "fixed", "static"],
    answer: 2,
    explain: "position: fixed positionne l'élément par rapport à la fenêtre : il ne bouge pas quand on fait défiler la page."
  },
  {
    topic: "css",
    q: "Quelle propriété Flexbox aligne les éléments sur l'axe principal ?",
    options: ["align-items", "justify-content", "align-content", "flex-flow"],
    answer: 1,
    explain: "justify-content agit sur l'axe principal (horizontal par défaut). align-items agit sur l'axe secondaire."
  },

  /* ---- JavaScript (suite) ---- */
  {
    topic: "js",
    q: "Quelle méthode convertit une chaîne JSON en objet JavaScript ?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "Object.from()"],
    answer: 1,
    explain: "JSON.parse() lit le texte JSON. JSON.stringify() fait l'inverse : il transforme un objet en texte."
  },
  {
    topic: "js",
    q: "Que renvoie Array.isArray([]) ?",
    options: ["true", "false", "\"array\"", "undefined"],
    answer: 0,
    explain: "Array.isArray() est le test fiable pour un tableau, car typeof [] renvoie simplement \"object\"."
  },
  {
    topic: "js",
    q: "Quel mot-clé attend le résultat d'une promesse dans une fonction async ?",
    options: ["wait", "await", "yield", "then"],
    answer: 1,
    explain: "await met la fonction async en pause jusqu'à ce que la promesse soit résolue, puis renvoie sa valeur."
  },
  {
    topic: "js",
    q: "Quelle méthode renvoie le premier élément qui correspond à un sélecteur CSS ?",
    options: ["getElementById()", "querySelector()", "getElementsByClassName()", "findElement()"],
    answer: 1,
    explain: "document.querySelector(\".carte\") accepte n'importe quel sélecteur CSS. querySelectorAll() renvoie tous les éléments."
  }
];

/* ============ Questions ajoutées par l'utilisateur ============ */
const STORAGE_KEY = "quizweb.custom.v1";

function isValidQuestion(x) {
  return x && typeof x === "object"
    && Object.prototype.hasOwnProperty.call(TOPICS, x.topic)
    && typeof x.q === "string" && x.q.trim() !== ""
    && Array.isArray(x.options) && x.options.length >= 2 && x.options.length <= 4
    && x.options.every((o) => typeof o === "string" && o.trim() !== "")
    && Number.isInteger(x.answer) && x.answer >= 0 && x.answer < x.options.length;
}

function loadCustom() {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(arr) ? arr.filter(isValidQuestion) : [];
  } catch (_) {
    return [];
  }
}

function saveCustom() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    return true;
  } catch (_) {
    return false;
  }
}

let custom = loadCustom();

/* ============ État du quiz ============ */
let deck = [];
let current = 0;
let score = 0;
let locked = false;
let history = [];

/* ============ Éléments ============ */
const $ = (id) => document.getElementById(id);
const screens = {
  home: $("screen-home"),
  add: $("screen-add"),
  quiz: $("screen-quiz"),
  result: $("screen-result")
};

const el = {
  setup: $("setup-form"),
  count: $("count"),
  countOut: $("count-out"),
  poolInfo: $("pool-info"),
  start: $("btn-start"),
  counter: $("counter"),
  liveScore: $("live-score"),
  progress: $("progress"),
  bar: $("progress-bar"),
  question: $("question-text"),
  answers: $("answers"),
  feedback: $("feedback"),
  next: $("btn-next"),
  finalScore: $("final-score"),
  ring: $("score-ring"),
  message: $("result-message"),
  grade: $("result-emoji"),
  review: $("review-list"),
  resultTitle: $("result-title"),
  addForm: $("add-form"),
  addStatus: $("add-status"),
  addTitle: $("add-title"),
  customList: $("custom-list"),
  customEmpty: $("custom-empty")
};

/* ============ Navigation entre écrans ============ */
function show(name) {
  Object.entries(screens).forEach(([key, node]) => {
    const active = key === name;
    node.hidden = !active;
    node.classList.toggle("active", active);
  });
}

/* ============ Menu : thème et nombre de questions ============ */
function allQuestions() {
  return BUILTIN.concat(custom);
}

// Thèmes cochés (plusieurs possibles)
function selectedTopics() {
  return [...el.setup.querySelectorAll('input[name="topic"]:checked')].map((i) => i.value);
}

function poolFor(topics) {
  return allQuestions().filter((x) => topics.includes(x.topic));
}

// La case « Tous » reflète l'état des trois thèmes
function syncAllBox() {
  const boxes = [...el.setup.querySelectorAll('input[name="topic"]')];
  $("topic-all").checked = boxes.every((b) => b.checked);
}

function refreshMenu() {
  // Nombre de questions disponibles par thème
  document.querySelectorAll("[data-n]").forEach((node) => {
    node.textContent = node.dataset.n === "all"
      ? allQuestions().length
      : poolFor([node.dataset.n]).length;
  });

  const topics = selectedTopics();
  const available = poolFor(topics).length;
  const label = topics.map((t) => TOPICS[t]).join(" + ");

  el.count.max = Math.max(available, 1);
  el.count.disabled = available === 0;
  el.start.disabled = available === 0;

  const wanted = Number(el.count.value) || 1;
  el.count.value = Math.min(Math.max(wanted, 1), Math.max(available, 1));
  el.countOut.textContent = el.count.value;

  if (topics.length === 0) {
    el.poolInfo.textContent = "Choisis au moins un thème pour commencer.";
  } else if (available === 0) {
    el.poolInfo.textContent = "Aucune question disponible pour ce choix. Ajoutes-en une.";
  } else {
    el.poolInfo.textContent = `${available} question${available > 1 ? "s" : ""} disponible${available > 1 ? "s" : ""} (${label}).`;
  }
}

el.setup.addEventListener("change", (e) => {
  if (e.target.id === "topic-all") {
    // « Tous » coche ou décoche les trois thèmes d'un coup
    el.setup.querySelectorAll('input[name="topic"]').forEach((b) => { b.checked = e.target.checked; });
    refreshMenu();
  } else if (e.target.name === "topic") {
    syncAllBox();
    refreshMenu();
  }
});
el.count.addEventListener("input", () => {
  el.countOut.textContent = el.count.value;
});

function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============ Quiz ============ */
function startQuiz() {
  const pool = poolFor(selectedTopics());
  if (pool.length === 0) return;
  const n = Math.min(Number(el.count.value) || 1, pool.length);
  deck = shuffle(pool).slice(0, n);

  current = 0;
  score = 0;
  history = [];
  el.liveScore.textContent = "0";
  show("quiz");
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const item = deck[current];

  el.counter.textContent = `Question ${current + 1} / ${deck.length}`;
  const pct = (current / deck.length) * 100;
  el.bar.style.width = pct + "%";
  el.progress.setAttribute("aria-valuenow", Math.round(pct));

  el.question.textContent = item.q;
  el.answers.innerHTML = "";
  el.feedback.hidden = true;
  el.feedback.className = "feedback";
  el.next.hidden = true;

  item.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.dataset.index = i;

    const key = document.createElement("span");
    key.className = "key";
    key.setAttribute("aria-hidden", "true");
    key.textContent = i + 1;

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = text; // textContent : évite toute injection HTML

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.setAttribute("aria-hidden", "true");

    btn.append(key, label, icon);
    btn.addEventListener("click", () => selectAnswer(i));
    el.answers.appendChild(btn);
  });

  el.question.focus({ preventScroll: true });
}

function selectAnswer(index) {
  if (locked) return;
  locked = true;

  const item = deck[current];
  const correct = index === item.answer;
  const buttons = [...el.answers.children];

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    const icon = btn.querySelector(".icon");
    if (i === item.answer) {
      btn.classList.add("correct");
      icon.textContent = "✓";
    } else if (i === index) {
      btn.classList.add("wrong");
      icon.textContent = "✗";
    } else {
      btn.classList.add("dim");
    }
  });

  if (correct) {
    score++;
    el.liveScore.textContent = score;
    el.liveScore.classList.remove("bump");
    void el.liveScore.offsetWidth; // relance l'animation
    el.liveScore.classList.add("bump");
  }

  history.push({ q: item.q, chosen: item.options[index], good: item.options[item.answer], correct });

  const explain = item.explain ? " " + item.explain : "";
  el.feedback.className = "feedback " + (correct ? "good" : "bad");
  el.feedback.textContent = (correct ? "Bonne réponse." : "Raté. La bonne réponse est « " + item.options[item.answer] + " ».") + explain;
  el.feedback.hidden = false;

  el.next.textContent = current === deck.length - 1 ? "Voir mon résultat" : "Question suivante";
  el.next.hidden = false;
  el.next.focus();
}

function nextQuestion() {
  if (current < deck.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResult();
  }
}

/* ============ Résultats ============ */
function showResult() {
  show("result");
  el.bar.style.width = "100%";

  const total = deck.length;
  const pct = Math.round((score / total) * 100);
  el.finalScore.textContent = `${score}/${total}`;
  el.ring.setAttribute("aria-label", `Score final : ${score} sur ${total}`);

  // Animation du cercle de score
  el.ring.style.setProperty("--pct", 0);
  requestAnimationFrame(() => requestAnimationFrame(() => el.ring.style.setProperty("--pct", pct)));

  let grade, msg;
  if (pct === 100)    { grade = "Parfait";   msg = "Parfait ! Tu maîtrises le sujet."; }
  else if (pct >= 70) { grade = "Très bien"; msg = "Très bien joué ! Encore un petit effort pour le sans-faute."; }
  else if (pct >= 40) { grade = "Pas mal";   msg = "Pas mal ! Relis les explications et retente ta chance."; }
  else                { grade = "À revoir";  msg = "Continue d'apprendre, tu vas y arriver. Rejoue pour progresser !"; }
  el.grade.textContent = grade;
  el.message.textContent = msg;

  el.review.innerHTML = "";
  history.forEach((h) => {
    const li = document.createElement("li");
    const status = document.createElement("span");
    status.className = h.correct ? "ok" : "ko";
    status.textContent = h.correct ? "✓ " : "✗ ";
    li.append(status, document.createTextNode(h.q));

    const detail = document.createElement("small");
    detail.textContent = h.correct
      ? `Ta réponse : ${h.chosen}`
      : `Ta réponse : ${h.chosen} — Bonne réponse : ${h.good}`;
    li.appendChild(detail);
    el.review.appendChild(li);
  });

  el.resultTitle.focus({ preventScroll: true });
}

/* ============ Ajouter une question ============ */
function setStatus(text, kind) {
  el.addStatus.textContent = text;
  el.addStatus.className = "status" + (kind ? " " + kind : "");
}

function renderCustomList() {
  el.customList.innerHTML = "";
  el.customEmpty.hidden = custom.length > 0;

  custom.forEach((item) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.className = "t";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = TOPICS[item.topic];
    text.append(badge, document.createTextNode(item.q));

    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn-small";
    del.textContent = "Supprimer";
    del.setAttribute("aria-label", "Supprimer la question : " + item.q);
    del.addEventListener("click", () => {
      custom = custom.filter((x) => x.id !== item.id);
      saveCustom();
      renderCustomList();
      refreshMenu();
      setStatus("Question supprimée.", "ok");
    });

    li.append(text, del);
    el.customList.appendChild(li);
  });
}

function openAdd() {
  setStatus("", "");
  renderCustomList();
  show("add");
  el.addTitle.focus({ preventScroll: true });
}

function backToMenu() {
  refreshMenu();
  show("home");
  window.scrollTo(0, 0);
}

el.addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const topic = $("new-topic").value;
  const q = $("new-q").value.trim();
  const explain = $("new-explain").value.trim();
  const answerSlot = Number($("new-answer").value);
  const slots = [0, 1, 2, 3].map((i) => $("new-o" + i).value.trim());

  if (q === "") {
    setStatus("Écris la question avant de l'ajouter.", "err");
    $("new-q").focus();
    return;
  }
  const filled = slots.filter((s) => s !== "");
  if (filled.length < 2) {
    setStatus("Il faut au moins deux réponses.", "err");
    $("new-o0").focus();
    return;
  }
  if (slots[answerSlot] === "") {
    setStatus("La bonne réponse choisie est vide. Remplis cette réponse ou change la bonne réponse.", "err");
    $("new-answer").focus();
    return;
  }
  if (new Set(filled.map((s) => s.toLowerCase())).size !== filled.length) {
    setStatus("Deux réponses sont identiques. Modifie-en une.", "err");
    return;
  }

  // On retire les cases vides et on recalcule la position de la bonne réponse
  const options = slots.filter((s) => s !== "");
  const answer = slots.slice(0, answerSlot).filter((s) => s !== "").length;

  custom.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    topic, q, options, answer, explain
  });

  const saved = saveCustom();
  renderCustomList();
  refreshMenu();

  ["new-q", "new-o0", "new-o1", "new-o2", "new-o3", "new-explain"].forEach((id) => { $(id).value = ""; });
  $("new-answer").value = "0";

  setStatus(
    saved
      ? "Question ajoutée. Elle sera proposée dans le quiz."
      : "Question ajoutée pour cette session, mais elle n'a pas pu être enregistrée sur cet appareil.",
    saved ? "ok" : "err"
  );
  $("new-q").focus();
});

/* ============ Événements ============ */
el.setup.addEventListener("submit", (e) => {
  e.preventDefault();
  startQuiz();
});
$("btn-add").addEventListener("click", openAdd);
$("btn-back").addEventListener("click", backToMenu);
$("btn-menu").addEventListener("click", backToMenu);
$("btn-quit").addEventListener("click", backToMenu);
$("btn-restart").addEventListener("click", startQuiz);
el.next.addEventListener("click", nextQuestion);

// Raccourcis clavier : 1–4 pour répondre pendant le quiz
document.addEventListener("keydown", (e) => {
  if (screens.quiz.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key >= "1" && e.key <= "4") {
    const idx = Number(e.key) - 1;
    if (idx < deck[current].options.length) selectAnswer(idx);
  }
});

refreshMenu();
