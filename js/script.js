"use strict";

/* ============================================================
   QuizWeb — script unique
   1. Configuration     2. Questions       3. État
   4. DOM               5. Utilitaires     6. Écrans
   7. Menu              8. Quiz            9. Résultats
   10. Mes questions    11. Événements     12. Démarrage
   ============================================================ */

/* ============ 1. Configuration ============ */
const TIMER_SECONDS = 20;
const BASE_POINTS = 100;
const PENALTY_PER_SECOND = 3;
const MIN_POINTS = 30;
const MAX_BEST_SCORES = 5;
const STORAGE_CUSTOM = "quizweb.custom.v1";
const STORAGE_BEST = "quizweb.best.v1";

const TOPICS = { html: "HTML", css: "CSS", js: "JavaScript" };
const TYPE_LABELS = { qcm: "QCM", truefalse: "Vrai/Faux" };

/* ============ 2. Questions ============ */
const qcm = (topic, q, options, answer, explain) => ({
  topic,
  type: "qcm",
  q,
  options,
  answer,
  explain,
});
const vf = (topic, q, answer, explain) => ({
  topic,
  type: "truefalse",
  q,
  options: ["Vrai", "Faux"],
  answer,
  explain,
});

const QUESTIONS = [
  /* HTML */
  qcm(
    "html",
    "Quelle balise HTML5 sert à définir le contenu principal d'une page ?",
    ["<section>", "<main>", "<article>", "<div>"],
    1,
    "<main> représente le contenu principal unique de la page.",
  ),
  qcm(
    "html",
    "Quel attribut HTML rend une image accessible aux lecteurs d'écran ?",
    ["title", "name", "alt", "label"],
    2,
    "L'attribut alt fournit une description textuelle de l'image.",
  ),
  qcm(
    "html",
    "Quelle balise sert à créer un lien hypertexte ?",
    ["<link>", "<a>", "<href>", "<nav>"],
    1,
    '<a href="..."> crée un lien. <link> relie une ressource externe.',
  ),
  qcm(
    "html",
    "Quel attribut rend un champ de formulaire obligatoire ?",
    ["required", "mandatory", "needed", "validate"],
    0,
    "required empêche l'envoi du formulaire tant que le champ est vide.",
  ),
  qcm(
    "html",
    "Quelle balise sémantique représente un pied de page ?",
    ["<bottom>", "<footer>", "<end>", "<section>"],
    1,
    "<footer> contient les informations de fin de page ou de section.",
  ),
  qcm(
    "html",
    "Quelle est la déclaration du type de document en HTML5 ?",
    ["<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<html5>", "<!HTML version=5>"],
    0,
    "<!DOCTYPE html> place le navigateur en mode standard.",
  ),
  qcm(
    "html",
    "Quelle balise définit le titre de plus haut niveau dans le contenu ?",
    ["<h1>", "<head>", "<header>", "<title>"],
    0,
    "<h1> est le titre principal. <title> s'affiche dans l'onglet.",
  ),
  qcm(
    "html",
    "Quel élément regroupe des champs de formulaire liés, avec une légende ?",
    ["<fieldset>", "<group>", "<section>", "<form-group>"],
    0,
    "<fieldset> regroupe les champs et <legend> lui donne un titre.",
  ),
  qcm(
    "html",
    "Quelle balise crée une liste ordonnée (numérotée) ?",
    ["<ul>", "<ol>", "<li>", "<dl>"],
    1,
    "<ol> numérote ses éléments <li>. <ul> crée une liste à puces.",
  ),
  qcm(
    "html",
    "Quel attribut relie un <label> à son champ de formulaire ?",
    ["for", "name", "href", "target"],
    0,
    '<label for="email"> correspond au champ id="email".',
  ),
  vf(
    "html",
    "La balise <section> fait partie des balises sémantiques HTML5.",
    0,
    "<section> décrit une section thématique du document.",
  ),
  vf(
    "html",
    "La balise <div> possède une signification sémantique précise.",
    1,
    "<div> est un conteneur générique, sans sens particulier.",
  ),
  vf(
    "html",
    "L'attribut href indique la destination d'un lien.",
    0,
    '<a href="page.html"> pointe vers page.html.',
  ),
  vf(
    "html",
    "Les noms de balises HTML sont sensibles à la casse.",
    1,
    "HTML est insensible à la casse : <MAIN> et <main> sont équivalents.",
  ),
  vf(
    "html",
    "Un élément <label> peut être associé à un champ grâce à son attribut for.",
    0,
    'for="email" relie le label au champ dont l\'id est email.',
  ),
  vf(
    "html",
    "Il est recommandé de n'utiliser qu'un seul <h1> par page.",
    0,
    "Un <h1> unique clarifie la structure du document.",
  ),

  /* CSS */
  qcm(
    "css",
    "Quelle propriété CSS active le modèle Flexbox sur un conteneur ?",
    ["display: flex", "position: flex", "flex: container", "layout: flex"],
    0,
    "display: flex sur le parent rend ses enfants flexibles.",
  ),
  qcm(
    "css",
    "Quelle fonction CSS crée une grille de 3 colonnes de largeur égale ?",
    [
      "grid-template-columns: repeat(3, 1fr)",
      "grid-columns: 3",
      "columns: grid(3)",
      "display: grid(3)",
    ],
    0,
    "repeat(3, 1fr) répète 3 colonnes à parts égales.",
  ),
  qcm(
    "css",
    "Quelle media query cible les écrans de 600px de large ou moins ?",
    [
      "@media (min-width: 600px)",
      "@media (max-width: 600px)",
      "@screen (600px)",
      "@media (width > 600)",
    ],
    1,
    "max-width: 600px s'applique jusqu'à 600px de largeur.",
  ),
  qcm(
    "css",
    "Quelle propriété modifie l'espace entre le contenu d'un élément et sa bordure ?",
    ["margin", "padding", "gap", "spacing"],
    1,
    "padding agit à l'intérieur de la bordure ; margin agit à l'extérieur.",
  ),
  qcm(
    "css",
    "Quelle valeur de box-sizing inclut le padding et la bordure dans la largeur ?",
    ["content-box", "border-box", "padding-box", "inherit"],
    1,
    "Avec border-box, width: 200px inclut padding et bordure.",
  ),
  qcm(
    "css",
    "Quelle unité est relative à la taille de police de l'élément racine ?",
    ["em", "px", "rem", "vh"],
    2,
    "rem se calcule à partir de la police de <html> ; em dépend du parent.",
  ),
  qcm(
    "css",
    "Quelle propriété CSS contrôle l'ordre d'empilement des éléments positionnés ?",
    ["z-index", "order", "stack", "layer"],
    0,
    "z-index décide quel élément passe devant.",
  ),
  qcm(
    "css",
    "Quelle pseudo-classe cible un élément quand la souris le survole ?",
    [":hover", ":active", ":focus", ":over"],
    0,
    ":hover s'applique au survol, :active pendant le clic.",
  ),
  qcm(
    "css",
    "Quelle valeur de position garde un élément fixe pendant le défilement ?",
    ["relative", "absolute", "fixed", "static"],
    2,
    "position: fixed positionne l'élément par rapport à la fenêtre.",
  ),
  qcm(
    "css",
    "Quelle propriété Flexbox aligne les éléments sur l'axe principal ?",
    ["align-items", "justify-content", "align-content", "flex-flow"],
    1,
    "justify-content agit sur l'axe principal, align-items sur l'axe secondaire.",
  ),
  vf(
    "css",
    "box-sizing: border-box inclut le padding et la bordure dans la largeur déclarée.",
    0,
    "width: 200px reste 200px au total, padding et bordure compris.",
  ),
  vf(
    "css",
    "La propriété margin crée de l'espace à l'intérieur de la bordure d'un élément.",
    1,
    "C'est padding qui crée l'espace interne ; margin agit à l'extérieur.",
  ),
  vf(
    "css",
    "L'unité rem est relative à la taille de police de l'élément racine.",
    0,
    "1rem correspond à la taille de police de <html>.",
  ),
  vf(
    "css",
    "Flexbox permet d'aligner des éléments sur un axe principal et un axe secondaire.",
    0,
    "justify-content et align-items travaillent sur ces deux axes.",
  ),
  vf(
    "css",
    "Une media query max-width: 600px s'applique aux écrans plus larges que 600px.",
    1,
    "max-width cible les écrans de 600px ou moins.",
  ),
  vf(
    "css",
    "La pseudo-classe :focus cible un élément survolé par la souris.",
    1,
    ":focus s'applique quand l'élément reçoit le focus ; :hover gère le survol.",
  ),

  /* JavaScript */
  qcm(
    "js",
    "Que renvoie typeof null en JavaScript ?",
    ['"null"', '"undefined"', '"object"', '"number"'],
    2,
    'Bug historique du langage : typeof null renvoie "object".',
  ),
  qcm(
    "js",
    "Quelle méthode ajoute un élément à la fin d'un tableau ?",
    ["shift()", "push()", "pop()", "unshift()"],
    1,
    "push() ajoute à la fin ; pop() retire le dernier.",
  ),
  qcm(
    "js",
    "Quel mot-clé déclare une variable dont la valeur ne peut pas être réassignée ?",
    ["var", "let", "const", "static"],
    2,
    "const empêche la réassignation, mais un objet reste modifiable.",
  ),
  qcm(
    "js",
    "Quel opérateur compare la valeur et le type, sans conversion ?",
    ["==", "===", "=", "!="],
    1,
    '=== est la comparaison stricte : 5 === "5" vaut false.',
  ),
  qcm(
    "js",
    "Quelle méthode transforme chaque élément et renvoie un nouveau tableau ?",
    ["forEach()", "map()", "filter()", "reduce()"],
    1,
    "map() transforme chaque élément ; filter() en garde une partie.",
  ),
  qcm(
    "js",
    "Quelle méthode attache un écouteur d'événement à un élément ?",
    ["addEventListener()", "onEvent()", "listen()", "attachEvent()"],
    0,
    'element.addEventListener("click", handler) est la méthode standard.',
  ),
  qcm(
    "js",
    "Quelle méthode convertit une chaîne JSON en objet JavaScript ?",
    ["JSON.stringify()", "JSON.parse()", "JSON.object()", "Object.from()"],
    1,
    "JSON.parse() lit le texte JSON ; stringify() fait l'inverse.",
  ),
  qcm(
    "js",
    "Que renvoie Array.isArray([]) ?",
    ["true", "false", '"array"', "undefined"],
    0,
    'C\'est le test fiable, car typeof [] renvoie "object".',
  ),
  qcm(
    "js",
    "Quel mot-clé attend le résultat d'une promesse dans une fonction async ?",
    ["wait", "await", "yield", "then"],
    1,
    "await met la fonction en pause jusqu'à la résolution de la promesse.",
  ),
  qcm(
    "js",
    "Quelle méthode renvoie le premier élément correspondant à un sélecteur CSS ?",
    [
      "getElementById()",
      "querySelector()",
      "getElementsByClassName()",
      "findElement()",
    ],
    1,
    "querySelector() accepte n'importe quel sélecteur CSS.",
  ),
  vf(
    "js",
    "const empêche la réassignation d'une variable.",
    0,
    "const interdit de réaffecter la variable.",
  ),
  vf(
    "js",
    "L'opérateur === compare uniquement les valeurs, sans tenir compte du type.",
    1,
    "=== compare valeur et type ; c'est == qui convertit.",
  ),
  vf(
    "js",
    'typeof null renvoie "object".',
    0,
    "Comportement historique conservé pour la compatibilité du Web.",
  ),
  vf(
    "js",
    "JSON.parse() transforme un objet JavaScript en chaîne de caractères.",
    1,
    "C'est JSON.stringify() qui sérialise ; parse() fait l'inverse.",
  ),
  vf(
    "js",
    "Array.isArray() permet de vérifier qu'une valeur est un tableau.",
    0,
    'C\'est le test fiable, car typeof [] renvoie "object".',
  ),
  vf(
    "js",
    "addEventListener() permet d'attacher un gestionnaire d'événement à un élément.",
    0,
    'element.addEventListener("click", handler) enregistre une fonction.',
  ),
];

/* ============ 3. État ============ */
const state = {
  custom: loadCustomQuestions(),
  bestScores: loadBestScores(),
  deck: [],
  index: 0,
  score: 0,
  history: [],
  locked: false,
  timerId: null,
  startedAt: 0,
};

/* ============ 4. DOM ============ */
const el = {
  screens: {
    home: byId("screen-home"),
    add: byId("screen-add"),
    quiz: byId("screen-quiz"),
    result: byId("screen-result"),
  },

  setupForm: byId("setup-form"),
  topicAll: byId("topic-all"),
  count: byId("count"),
  countOut: byId("count-out"),
  poolInfo: byId("pool-info"),
  btnStart: byId("btn-start"),
  btnAdd: byId("btn-add"),
  bestList: byId("best-list"),
  bestEmpty: byId("best-empty"),

  addForm: byId("add-form"),
  addStatus: byId("add-status"),
  newType: byId("new-type"),
  newTopic: byId("new-topic"),
  newQ: byId("new-q"),
  newOptionsField: byId("new-options-field"),
  newOption0: byId("new-o0"),
  newOption1: byId("new-o1"),
  newOption2: byId("new-o2"),
  newOption3: byId("new-o3"),
  newAnswer: byId("new-answer"),
  newExplain: byId("new-explain"),
  customList: byId("custom-list"),
  customEmpty: byId("custom-empty"),
  btnBack: byId("btn-back"),

  btnQuit: byId("btn-quit"),
  counter: byId("counter"),
  liveScore: byId("live-score"),
  timer: byId("timer"),
  timerValue: byId("timer-value"),
  timerBar: byId("timer-bar"),
  progress: byId("progress"),
  progressBar: byId("progress-bar"),
  questionBody: byId("question-body"),
  question: byId("question-text"),
  answers: byId("answers"),
  feedback: byId("feedback"),
  next: byId("btn-next"),

  resultGrade: byId("result-grade"),
  resultTitle: byId("result-title"),
  finalScore: byId("final-score"),
  resultSub: byId("result-sub"),
  resultBest: byId("result-best"),
  resultMessage: byId("result-message"),
  reviewList: byId("review-list"),
  btnRestart: byId("btn-restart"),
  btnMenu: byId("btn-menu"),
};

function byId(id) {
  return document.getElementById(id);
}

/* ============ 5. Utilitaires ============ */
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function computePoints(elapsedMs) {
  const seconds = Math.floor(Math.min(elapsedMs, TIMER_SECONDS * 1000) / 1000);
  return Math.max(MIN_POINTS, BASE_POINTS - seconds * PENALTY_PER_SECOND);
}

function gradeFor(percent) {
  if (percent === 100)
    return { title: "Parfait", message: "Parfait ! Tu maîtrises le sujet." };
  if (percent >= 70)
    return {
      title: "Très bien",
      message: "Très bien joué ! Encore un petit effort pour le sans-faute.",
    };
  if (percent >= 40)
    return {
      title: "Pas mal",
      message: "Pas mal ! Relis les explications et retente ta chance.",
    };
  return {
    title: "À revoir",
    message: "Continue d'apprendre, tu vas y arriver. Rejoue pour progresser !",
  };
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("fr-FR");
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/* ============ Questions personnalisées : stockage ============ */
function isValidQuestion(item) {
  if (!item || typeof item.q !== "string" || !TOPICS[item.topic]) return false;
  if (!Array.isArray(item.options) || item.options.length < 2) return false;
  return (
    Number.isInteger(item.answer) &&
    item.answer >= 0 &&
    item.answer < item.options.length
  );
}

function normalizeQuestion(item) {
  const type = item.type === "truefalse" ? "truefalse" : "qcm";
  return {
    topic: item.topic,
    type: type,
    q: item.q,
    options: type === "truefalse" ? ["Vrai", "Faux"] : item.options,
    answer: item.answer,
    explain: typeof item.explain === "string" ? item.explain : "",
  };
}

function loadCustomQuestions() {
  const stored = readStorage(STORAGE_CUSTOM);
  if (!Array.isArray(stored)) return [];
  return stored.filter(isValidQuestion).map(normalizeQuestion);
}

function saveCustomQuestions() {
  return writeStorage(STORAGE_CUSTOM, state.custom);
}

/* ============ Meilleurs scores : stockage ============ */
function loadBestScores() {
  const stored = readStorage(STORAGE_BEST);
  if (!Array.isArray(stored)) return [];
  return stored
    .filter((score) => score && Number.isFinite(score.points))
    .sort((a, b) => b.points - a.points)
    .slice(0, MAX_BEST_SCORES);
}

function saveBestScore(entry) {
  const scores = loadBestScores();
  scores.push(entry);
  scores.sort((a, b) => b.points - a.points);
  const top = scores.slice(0, MAX_BEST_SCORES);
  writeStorage(STORAGE_BEST, top);
  return top;
}

/* ============ 6. Écrans ============ */
function showScreen(name) {
  const target = el.screens[name];

  Object.values(el.screens).forEach((screen) => {
    screen.hidden = screen !== target;
    screen.classList.remove("active");
  });

  target.classList.add("active");
  window.scrollTo(0, 0);
}

/* ============ 7. Menu ============ */
function allQuestions() {
  return QUESTIONS.concat(state.custom);
}

function selectedTopics() {
  return [...el.setupForm.querySelectorAll('input[name="topic"]:checked')].map(
    (input) => input.value,
  );
}

function poolFor(topics) {
  return allQuestions().filter((question) => topics.includes(question.topic));
}

function syncAllBox() {
  const boxes = [...el.setupForm.querySelectorAll('input[name="topic"]')];
  el.topicAll.checked = boxes.every((box) => box.checked);
}

function refreshMenu() {
  const all = allQuestions();
  const counts = { all: all.length, html: 0, css: 0, js: 0 };
  all.forEach((question) => {
    counts[question.topic] += 1;
  });

  document.querySelectorAll("[data-n]").forEach((node) => {
    node.textContent = String(counts[node.dataset.n]);
  });

  const topics = selectedTopics();
  const available = poolFor(topics).length;
  const labels = topics.map((topic) => TOPICS[topic]);

  el.count.max = Math.max(available, 1);
  el.count.disabled = available === 0;
  el.btnStart.disabled = available === 0;

  const wanted = Number(el.count.value) || 1;
  el.count.value = String(Math.min(Math.max(wanted, 1), el.count.max));
  el.countOut.textContent = el.count.value;

  if (topics.length === 0) {
    el.poolInfo.textContent = "Choisis au moins un thème pour commencer.";
  } else if (available === 0) {
    el.poolInfo.textContent =
      "Aucune question disponible pour ce choix. Ajoutes-en une.";
  } else {
    const plural = available > 1 ? "s" : "";
    el.poolInfo.textContent = `${available} question${plural} disponible${plural} (${labels.join(" + ")}).`;
  }

  renderBestScores();
}

function renderBestScores() {
  el.bestList.innerHTML = "";
  el.bestList.hidden = state.bestScores.length === 0;
  el.bestEmpty.hidden = state.bestScores.length > 0;

  state.bestScores.forEach((score, index) => {
    const item = document.createElement("li");
    item.className = "best-item";

    const rank = document.createElement("span");
    rank.className = "best-rank";
    rank.textContent = String(index + 1);

    const points = document.createElement("strong");
    points.className = "best-points";
    points.textContent = `${score.points} pts`;

    const detail = document.createElement("span");
    detail.className = "best-detail";
    detail.textContent = `${score.correct}/${score.total} · ${formatDate(score.date)}`;

    item.append(rank, points, detail);
    el.bestList.appendChild(item);
  });
}

/* ============ 8. Quiz ============ */
function startQuiz() {
  const pool = poolFor(selectedTopics());
  if (pool.length === 0) return;

  const count = Math.min(Number(el.count.value) || 1, pool.length);

  state.deck = shuffle(pool).slice(0, count);
  state.index = 0;
  state.score = 0;
  state.history = [];
  state.locked = false;

  showScreen("quiz");
  showQuestion();
}

function showQuestion() {
  const question = state.deck[state.index];
  const isTrueFalse = question.type === "truefalse";
  const keys = isTrueFalse ? ["V", "F"] : ["1", "2", "3", "4"];

  el.counter.textContent = `Question ${state.index + 1} / ${state.deck.length}`;
  el.liveScore.textContent = String(state.score);
  el.question.textContent = question.q;
  el.answers.innerHTML = "";
  el.answers.classList.toggle("answers-tf", isTrueFalse);

  question.options.forEach((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";

    const key = document.createElement("span");
    key.className = "key";
    key.setAttribute("aria-hidden", "true");
    key.textContent = keys[index];

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = text;

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.setAttribute("aria-hidden", "true");

    button.append(key, label, icon);
    button.addEventListener("click", () => answerQuestion(index));
    el.answers.appendChild(button);
  });

  el.feedback.hidden = true;
  el.feedback.textContent = "";
  el.next.hidden = true;

  setProgress((state.index / state.deck.length) * 100);
  el.question.focus({ preventScroll: true });
  startTimer();
}

function startTimer() {
  stopTimer();
  state.startedAt = performance.now();
  renderTimer(0);

  state.timerId = setInterval(() => {
    const elapsed = performance.now() - state.startedAt;
    if (elapsed >= TIMER_SECONDS * 1000) {
      renderTimer(TIMER_SECONDS * 1000);
      timeOutQuestion();
      return;
    }
    renderTimer(elapsed);
  }, 100);
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function renderTimer(elapsedMs) {
  const limit = TIMER_SECONDS * 1000;
  const remaining = Math.max(0, limit - Math.min(elapsedMs, limit));
  const seconds = Math.ceil(remaining / 1000);

  el.timerValue.textContent = String(seconds);
  el.timerBar.style.width = `${(remaining / limit) * 100}%`;
  el.timer.classList.toggle("is-danger", remaining <= 3000);
  el.timer.setAttribute(
    "aria-label",
    `Temps restant : ${seconds} seconde${seconds > 1 ? "s" : ""}`,
  );
}

function answerQuestion(index) {
  const question = state.deck[state.index];
  if (state.locked || !question) return;
  if (index < 0 || index >= question.options.length) return;

  const elapsed = Math.min(
    performance.now() - state.startedAt,
    TIMER_SECONDS * 1000,
  );
  stopTimer();

  const correct = index === question.answer;
  const points = correct ? computePoints(elapsed) : 0;

  state.score += points;
  state.locked = true;

  const entry = {
    question: question,
    selected: index,
    correct: correct,
    points: points,
    reason: correct ? "correct" : "wrong",
  };

  state.history.push(entry);
  showAnswer(entry);
}

function timeOutQuestion() {
  if (state.locked || !state.deck[state.index]) return;

  state.locked = true;
  const entry = {
    question: state.deck[state.index],
    selected: null,
    correct: false,
    points: 0,
    reason: "timeout",
  };

  state.history.push(entry);
  stopTimer();
  showAnswer(entry);
}

function showAnswer(entry) {
  const buttons = el.answers.querySelectorAll(".answer");

  buttons.forEach((button, index) => {
    button.disabled = true;
    const icon = button.querySelector(".icon");

    if (index === entry.question.answer) {
      button.classList.add("correct");
      icon.textContent = "✓";
    } else if (index === entry.selected) {
      button.classList.add("wrong");
      icon.textContent = "✗";
    } else {
      button.classList.add("dim");
    }
  });

  const solution = entry.question.options[entry.question.answer];
  let message = "";

  if (entry.reason === "correct") {
    message = `Bonne réponse ! +${entry.points} points.`;
  } else if (entry.reason === "timeout") {
    message = `Temps écoulé ! La bonne réponse était « ${solution} ».`;
  } else {
    message = `Raté. La bonne réponse était « ${solution} ».`;
  }

  if (entry.question.explain) message += " " + entry.question.explain;

  el.feedback.className = `feedback ${entry.correct ? "good" : "bad"}`;
  el.feedback.textContent = message;
  el.feedback.hidden = false;

  el.liveScore.textContent = String(state.score);
  setProgress(((state.index + 1) / state.deck.length) * 100);

  el.next.textContent =
    state.index === state.deck.length - 1
      ? "Voir mon résultat"
      : "Question suivante";
  el.next.hidden = false;
  el.next.focus({ preventScroll: true });
}

function nextQuestion() {
  if (!state.locked) return;

  if (state.index === state.deck.length - 1) {
    finishQuiz();
    return;
  }

  state.index += 1;
  state.locked = false;
  showQuestion();
}

function finishQuiz() {
  stopTimer();

  const total = state.deck.length;
  const correct = state.history.filter((entry) => entry.correct).length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const grade = gradeFor(percent);

  el.resultGrade.textContent = grade.title;
  el.finalScore.textContent = `${state.score} pts`;
  el.finalScore.setAttribute(
    "aria-label",
    `Score final : ${state.score} points`,
  );
  el.resultSub.textContent = `${correct} bonne${correct > 1 ? "s" : ""} réponse${correct > 1 ? "s" : ""} sur ${total}`;
  el.resultMessage.textContent = grade.message;

  renderReview();

  if (state.score > 0) {
    state.bestScores = saveBestScore({
      points: state.score,
      correct: correct,
      total: total,
      date: new Date().toISOString(),
    });
    renderBestScores();
  }

  const best = state.bestScores[0];
  el.resultBest.textContent = best ? `Meilleur score : ${best.points} pts` : "";

  showScreen("result");
  el.resultTitle.focus({ preventScroll: true });
}

function setProgress(percent) {
  const value = Math.max(0, Math.min(100, percent));
  el.progressBar.style.width = `${value}%`;
  el.progress.setAttribute("aria-valuenow", String(Math.round(value)));
}

/* ============ 9. Résultats ============ */
function renderReview() {
  el.reviewList.innerHTML = "";

  state.history.forEach((entry) => {
    const item = document.createElement("li");
    const status = document.createElement("span");
    status.className = entry.correct ? "ok" : "ko";
    status.textContent = entry.correct ? "✓ " : "✗ ";

    const text = document.createElement("span");
    text.textContent = entry.question.q;

    const detail = document.createElement("small");
    const solution = entry.question.options[entry.question.answer];

    if (entry.reason === "timeout") {
      detail.textContent = `Temps écoulé — bonne réponse : ${solution}`;
    } else if (entry.correct) {
      detail.textContent = `Ta réponse : ${entry.question.options[entry.selected]} · +${entry.points} pts`;
    } else {
      detail.textContent = `Ta réponse : ${entry.question.options[entry.selected]} — bonne réponse : ${solution}`;
    }

    item.append(status, text, detail);
    el.reviewList.appendChild(item);
  });
}

function backToMenu() {
  stopTimer();
  refreshMenu();
  showScreen("home");
}

/* ============ 10. Mes questions ============ */
function syncQuestionType() {
  const isTrueFalse = el.newType.value === "truefalse";
  const labels = isTrueFalse ? ["Vrai", "Faux"] : ["A", "B", "C", "D"];

  el.newOptionsField.hidden = isTrueFalse;
  el.newAnswer.innerHTML = "";

  labels.forEach((label, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = label;
    el.newAnswer.appendChild(option);
  });
}

function addQuestionFromForm(event) {
  event.preventDefault();

  const type = el.newType.value === "truefalse" ? "truefalse" : "qcm";
  const text = el.newQ.value.trim();
  const explain = el.newExplain.value.trim();

  if (text === "") {
    setAddStatus("Écris la question avant de l'ajouter.", "err");
    el.newQ.focus();
    return;
  }

  let options;
  let answer;

  if (type === "truefalse") {
    options = ["Vrai", "Faux"];
    answer = el.newAnswer.value === "1" ? 1 : 0;
  } else {
    const slots = [
      el.newOption0,
      el.newOption1,
      el.newOption2,
      el.newOption3,
    ].map((input) => input.value.trim());
    const chosen = Number(el.newAnswer.value);
    const filled = slots.filter((slot) => slot !== "");

    if (filled.length < 2) {
      setAddStatus("Il faut au moins deux réponses.", "err");
      el.newOption0.focus();
      return;
    }
    if (slots[chosen] === "") {
      setAddStatus("La bonne réponse choisie est vide.", "err");
      el.newAnswer.focus();
      return;
    }

    options = filled;
    answer = slots.slice(0, chosen).filter((slot) => slot !== "").length;
  }

  state.custom.push({
    topic: el.newTopic.value,
    type: type,
    q: text,
    options: options,
    answer: answer,
    explain: explain,
  });

  const saved = saveCustomQuestions();
  renderCustomList();
  refreshMenu();
  clearQuestionForm();

  setAddStatus(
    saved
      ? "Question ajoutée. Elle sera proposée dans le quiz."
      : "Question ajoutée pour cette session, mais pas enregistrée sur cet appareil.",
    saved ? "ok" : "err",
  );
  el.newQ.focus();
}

function clearQuestionForm() {
  [
    el.newQ,
    el.newOption0,
    el.newOption1,
    el.newOption2,
    el.newOption3,
    el.newExplain,
  ].forEach((input) => {
    input.value = "";
  });
  el.newAnswer.value = "0";
}

function setAddStatus(message, kind) {
  el.addStatus.textContent = message;
  el.addStatus.className = "status" + (kind ? " " + kind : "");
}

function renderCustomList() {
  el.customList.innerHTML = "";
  el.customEmpty.hidden = state.custom.length > 0;

  state.custom.forEach((question, index) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.className = "t";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `${TOPICS[question.topic]} · ${TYPE_LABELS[question.type]}`;

    text.append(badge, document.createTextNode(question.q));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn-small";
    remove.textContent = "Supprimer";
    remove.setAttribute("aria-label", "Supprimer la question : " + question.q);
    remove.addEventListener("click", () => deleteCustomQuestion(index));

    item.append(text, remove);
    el.customList.appendChild(item);
  });
}

function deleteCustomQuestion(index) {
  state.custom.splice(index, 1);
  saveCustomQuestions();
  renderCustomList();
  refreshMenu();
  setAddStatus("Question supprimée.", "ok");
}

function openAddScreen() {
  setAddStatus("", "");
  renderCustomList();
  showScreen("add");
  el.newQ.focus({ preventScroll: true });
}

/* ============ 11. Événements ============ */
el.setupForm.addEventListener("change", (event) => {
  if (event.target.id === "topic-all") {
    el.setupForm.querySelectorAll('input[name="topic"]').forEach((box) => {
      box.checked = event.target.checked;
    });
    refreshMenu();
  } else if (event.target.name === "topic") {
    syncAllBox();
    refreshMenu();
  }
});

el.setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startQuiz();
});

el.count.addEventListener("input", () => {
  el.countOut.textContent = el.count.value;
});

el.btnAdd.addEventListener("click", openAddScreen);
el.btnBack.addEventListener("click", backToMenu);
el.btnQuit.addEventListener("click", backToMenu);
el.btnMenu.addEventListener("click", backToMenu);
el.btnRestart.addEventListener("click", startQuiz);
el.next.addEventListener("click", nextQuestion);

el.newType.addEventListener("change", syncQuestionType);
el.addForm.addEventListener("submit", addQuestionFromForm);

document.addEventListener("keydown", (event) => {
  if (el.screens.quiz.hidden) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const question = state.deck[state.index];
  if (!question || state.locked) return;

  const key = event.key.toLowerCase();

  if (question.type === "truefalse") {
    if (key === "v") {
      event.preventDefault();
      answerQuestion(0);
    } else if (key === "f") {
      event.preventDefault();
      answerQuestion(1);
    }
    return;
  }

  if (key >= "1" && key <= "4") {
    const index = Number(key) - 1;
    if (index < question.options.length) {
      event.preventDefault();
      answerQuestion(index);
    }
  }
});

/* ============ 12. Démarrage ============ */
function init() {
  syncQuestionType();
  renderCustomList();
  refreshMenu();
  showScreen("home");
}

init();
