# QuizWeb

Quiz interactif en HTML5, CSS3 et JavaScript, sans dépendance.

## Lancer

Ouvrir `index.html` dans un navigateur.

## Fonctionnalités

- Choix d'un ou plusieurs thèmes (HTML, CSS, JavaScript) et du nombre de questions
- 30 questions intégrées (10 par thème), tirées au hasard
- Feedback visuel immédiat avec explication, score en direct, score final et détail des réponses
- Ajout et suppression de ses propres questions (enregistrées dans le navigateur)
- Responsive (Flexbox et Grid), thème clair et sombre, accessible au clavier (touches 1 à 4)

## Structure

```
index.html
css/styles.css
js/script.js
```

## Ajouter des questions dans le code

Dans `js/script.js`, ajouter un objet au tableau `BUILTIN` :

```js
{ topic: "js", q: "Question ?", options: ["A", "B", "C", "D"], answer: 0, explain: "Explication." }
```

`topic` vaut `"html"`, `"css"` ou `"js"`, et `answer` est la position de la bonne réponse (en partant de 0).
