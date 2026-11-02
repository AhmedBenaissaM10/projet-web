# QuizWeb

Quiz interactif en HTML5, CSS3 et JavaScript vanilla, sans dépendance et sans build.
QCM et Vrai/Faux, chrono de 20 secondes par question, score avec pénalité de temps, top 5 des scores et questions personnalisées.

## Liens

- **Code source** : <https://github.com/AhmedBenaissaM10/projet-web>
- **Rapport du mini projet** : [rapport-quizweb.pdf](rapport-quizweb.pdf)

## Lancer le projet

Ouvrir **`index.html`** par double-clic. Le projet utilise un script classique (`defer`), donc aucun serveur local, aucune installation et aucune étape de compilation ne sont nécessaires.

Une connexion internet est seulement utile pour charger les polices Google Fonts ; le quiz reste utilisable hors ligne avec les polices système.

## Comment jouer

1. Cocher un ou plusieurs thèmes (HTML, CSS, JavaScript) et choisir de **1 à 8 questions**.
2. Répondre avant la fin des **20 secondes** : la bonne réponse est dévoilée immédiatement avec une explication.
3. Enchaîner les questions puis consulter le score final, le détail des réponses et le classement local.

## Fonctionnalités

- Choix d'un ou plusieurs thèmes (HTML, CSS, JavaScript) et du nombre de questions
- 48 questions intégrées, tirées au hasard (10 QCM + 6 Vrai/Faux par thème)
- Chronomètre de 20 secondes par question, avec barre qui passe au rouge à 3 secondes
- Score avec pénalité : 100 points moins 3 par seconde écoulée, plancher à 30 points
- Feedback immédiat : bonne réponse, mauvaise réponse, temps écoulé et explication
- Meilleurs scores : top 5 conservés dans le navigateur (`localStorage`)
- Rejouer avec remise à zéro complète et nouveau mélange
- Ajout et suppression de ses propres questions (QCM ou Vrai/Faux)
- Barre de progression, responsive, thème clair/sombre
- Clavier : `1` à `4` pour un QCM, `V` / `F` pour un Vrai/Faux
- Accessibilité : focus visibles, annonces `aria-live`, `prefers-reduced-motion`

## Barème

Pour une bonne réponse :

```text
points = 100 − 3 × secondes écoulées
```

Le résultat est borné entre 30 et 100 points. Une mauvaise réponse ou un temps écoulé donne 0 point.

## Structure

```text
index.html          # écran de jeu
error.html          # page d'erreur 404
rapport-quizweb.pdf # rapport du mini projet
css/
  style.css         # feuille de style unique, en sections commentées
js/
  script.js         # script unique, organisé en sections commentées
```

Le script suit cet ordre : configuration, questions, état, DOM, utilitaires, écrans, menu, quiz, résultats, questions personnalisées, événements, démarrage.
La feuille de style regroupe les mêmes composants visuels (thème clair/sombre, cartes, boutons, responsive).

## Ajouter des questions dans le code

Dans `js/script.js`, section **2. Questions**, utiliser les deux fabriques :

```js
// QCM
qcm("js", "Question ?", ["Réponse A", "Réponse B", "Réponse C", "Réponse D"], 0, "Explication.")

// Vrai / Faux (0 = Vrai, 1 = Faux)
vf("css", "Affirmation ?", 1, "Explication.")
```

`topic` vaut `"html"`, `"css"` ou `"js"`, et `answer` est la position de la bonne réponse (en partant de 0).
Les questions ajoutées via l'interface sont enregistrées dans le navigateur et restent compatibles entre les versions.

## Données enregistrées

| Clé `localStorage`  | Contenu                              |
| ------------------- | ------------------------------------ |
| `quizweb.custom.v1` | Questions ajoutées par l'utilisateur |
| `quizweb.best.v1`   | Top 5 des scores (points et date)    |

Si le navigateur bloque le stockage, le quiz continue de fonctionner pour la session en cours.

## Choix techniques

- **Vanilla** : aucun framework, aucune bibliothèque, aucun bundler.
- **Fichiers séparés** : le HTML reste sémantique, les styles et le script sont isolés.
- **Ouverture directe** : `index.html` fonctionne en `file://`, sans serveur local.
- **Responsive** : Flexbox et Grid, mise en page adaptée dès 320 px.
- **Thème clair/sombre** : adaptation automatique via `prefers-color-scheme`.
- **Données versionnées** : clés `localStorage` suffixées `v1` pour préserver les anciennes questions.
