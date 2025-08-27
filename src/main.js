// src/main.js                                                          // 📄 Point d'entrée de l'application (bootstrap)
import { el } from "./utils/dom.js";                                    // ⬅️ Helper DOM pour créer des éléments sans innerHTML
import { Header } from "./components/Header.js";                        // ⬅️ Composant d'en-tête (thème global)
import { Counter } from "./components/Counter.js";                      // ⬅️ Composant compteur (état local via createState)
import { Todo } from "./components/Todo.js";                            // ⬅️ Composant Todo (état global via store)

// On attend que tout le HTML soit parsé avant de manipuler le DOM
document.addEventListener("DOMContentLoaded", () => {                   // ⬅️ Évite les "undefined" sur #app si le script charge trop vite
  const container = el("div", { className: "container" });             // ⬅️ Conteneur principal centré avec largeur max (cf. CSS)

  container.appendChild(Header());                                      // ⬅️ Monte le Header (titre + bouton thème) en haut de la page

  const grid = el("div", { className: "grid" });                       // ⬅️ Grille responsive (1 → 2 colonnes selon la largeur)
  grid.appendChild(Counter());                                          // ⬅️ Colonne 1 : composant Counter (démo useState local)
  grid.appendChild(Todo());                                             // ⬅️ Colonne 2 : composant Todo (démo store global)

  container.appendChild(grid);                                          // ⬅️ Ajoute la grille au container principal

  const app = document.getElementById("app");                           // ⬅️ Récupère le point de montage défini dans index.html
  app.appendChild(container);                                           // ⬅️ Insère toute l'application dans la page
});
