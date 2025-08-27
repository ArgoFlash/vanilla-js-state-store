# JS Vanilla useState —> Démo

Apprendre à gérer l’état **sans framework**, en JavaScript “vanilla”, avec :

* un mini `useState` local (`createState`) : `get` / `set` / `subscribe`
* un **store global** minimal (`getState` / `setState` / `subscribeToState`)
* un DOM propre **sans `innerHTML`**
* un design light/dark moderne

> Objectif pédagogique : montrer comment **déclarer l’UI à partir d’un état** et éviter les pièges classiques (doublons d’écouteurs, mutations directes, XSS, etc.).

---

## ✨ Aperçu

<img width="754" height="322" alt="image" src="https://github.com/user-attachments/assets/f39398a5-741f-4863-b467-7123feb8dd12" />

* Le lien du projet : https://argoflash.github.io/vanilla-js-state-store/
---

## 🧠 Ce que tu vas apprendre

* Construire une petite app **modulaire** en ES Modules (import/export)
* Écrire un **mini-`useState`** (état local) : `createState(initial)`
* Concevoir un **store global** simple et réactif
* Rendre l’UI **déclarativement** (→ re-render quand l’état change)
* Manipuler le DOM **sans `innerHTML`** (sécurité & clarté)
* Gérer un **thème** light/dark via `data-theme` + CSS variables

---

## 🗂️ Structure du projet

```
.
├─ index.html
├─ src/
│  ├─ main.js                 # bootstrap de l’app (monte les composants)
│  ├─ state/
│  │  └─ store.js             # createState + store global (+ actions todo)
│  ├─ components/
│  │  ├─ Header.js            # en-tête + bouton thème (store global)
│  │  ├─ Counter.js           # compteur (useState local)
│  │  └─ Todo.js              # todo list (store global)
│  ├─ utils/
│  │  └─ dom.js               # helpers DOM (el/clear/cls) — pas d’innerHTML
│  └─ styles/
│     └─ main.css             # design moderne + variables de thème
└─ README.md
```

---

## 🚀 Démarrer en local

> Les modules ES ne se chargent pas en `file://`. Servez le dossier via un petit serveur HTTP.

### Lancer le projet — VS Code

1. Ouvre le dossier dans VS Code
2. Installe l’extension **Live Server**
3. Clic droit sur `index.html` → **Open with Live Server**

## 🌐 Déployer sur GitHub Pages

1. Crée un repo et pousse ce projet.
2. Dans **Settings → Pages**, choisis **Deploy from a branch**, branche **main**, dossier **/** (root).
3. Enregistre. Ton site sera disponible à l’URL fournie (attends quelques secondes).

---

## 🧩 Comment ça marche ?

### 1) `createState`: un mini-`useState` vanilla

```js
const count = createState(0);

count.get();                // lire la valeur actuelle
count.set(v => v + 1);      // updater function (évite l’état périmé)
const off = count.subscribe((value) => {
  // cette fonction est appelée à chaque changement
});
off();                      // se désabonner
```

### 2) Store global (thème + todos)

```js
import { getState, setState, subscribeToState } from "./state/store.js";

// lire
const { theme, todos } = getState();

// écrire (immutabilité gérée par le store)
setState({ theme: "dark" });

// écouter
const unsubscribe = subscribeToState((next) => {
  // re-render en fonction du nouvel état global
});
unsubscribe();
```

Les actions **métier** (todo) sont fournies : `addTodo(text)`, `toggleTodo(id)`, `removeTodo(id)`.

---

## ✅ Bonnes pratiques utilisées

* **Aucune** utilisation de `innerHTML` → on manipule le DOM via des **nœuds** (`el`, `TextNode`)
  → sécurité (anti-XSS) + code lisible
* **`const` / `let` uniquement** (pas de `var`)
* **Pas de spread `...`** pour rester lisible aux débutants
  → copies avec `Object.keys` / boucles (pédagogique)
* **Immutabilité** simple : on crée de **nouveaux objets/tableaux** au lieu de muter
* **Modules ES** natifs (`type="module"`) : code structuré, scope isolé
* **Abonnements** (`subscribe`) pour **re-rendre** l’UI quand l’état change
* **Thème** via `data-theme` sur `<html>` + variables CSS (`--color`)

---

## 🧱 Ajouter un nouveau composant (exemple)

```js
// src/components/Clock.js
import { el, clear } from "../utils/dom.js";

export function Clock() {
  const root = el("div", { className: "card" });
  const h2 = el("h2", { text: "Horloge" });
  const out = el("div");

  const render = () => {
    clear(out);
    out.appendChild(document.createTextNode(new Date().toLocaleTimeString()));
  };

  render();
  setInterval(render, 1000);

  root.appendChild(h2);
  root.appendChild(out);
  return root;
}
```

Monter le composant dans `src/main.js` :

```js
import { Clock } from "./components/Clock.js";
// ...
grid.appendChild(Clock());
```

---

## 🧪 Exercices (pour aller plus loin)

* **Persister** `theme` et `todos` dans `localStorage`
* Ajouter un état global `loading` + afficher un **loader** conditionnel
* Ajouter un champ **édition** de todo (inline)
* Créer une **modale** pilotée par un `createState(null)`
* Écrire un **sélecteur dérivé** (ex. nombre de todos `done`)

---

## ❓FAQ & Astuces

* **Pourquoi éviter `innerHTML` ?**
  Pour éviter les injections XSS et garder un code clair : on fabrique l’UI avec de vrais nœuds.

* **Pourquoi des “updater functions” (`set(v => v + 1)`) ?**
  Ça évite d’utiliser une valeur **périmée** quand plusieurs mises à jour s’enchaînent.

* **Pourquoi `100svh` dans le CSS (si tu centres tout) ?**
  Ça corrige les problèmes de viewport sur mobile (barre d’adresse dynamique).

---

## 📄 Licence

MIT — libre d’usage et d’adaptation à but pédagogique. ©Arès Romain
