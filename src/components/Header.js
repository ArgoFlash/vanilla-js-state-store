// src/components/Header.js                                   // 📄 Emplacement du composant Header
import { el } from "../utils/dom.js";                         // ⬅️ Helper DOM: `el(tag, props, children)` pour créer des éléments sans innerHTML
import { getState, subscribeToState, toggleTheme } from "../state/store.js"; // ⬅️ Sélecteurs & actions du store global (thème)

// Composant fonctionnel qui renvoie un nœud DOM prêt à être monté
export function Header() {
  // Carte d'en-tête : titre à gauche + badge à droite (conteneur flex via classes utilitaires)
  const root = el("div", { className: "card space-between" }, [      // ⬅️ Conteneur visuel (carte) + distribution horizontale
    el("h1", { text: "JS Vanilla useState —> Store" }),                   // ⬅️ Titre (texte sécurisé via textContent)
    el("div", {}, [                                                  // ⬅️ Petit conteneur à droite
      el("span", { className: "badge", text: "Sans innerHTML" })     // ⬅️ Badge d’info (bonne pratique: aucun innerHTML)
    ])
  ]);

  // Bouton de bascule du thème (light/dark) — action du store global
  const btn = el(
    "button",
    {
      className: "primary",                                          // ⬅️ Style principal (contraste fort)
      attrs: { "aria-label": "Basculer le thème" },                  // ⬅️ Accessibilité: annonce la fonction du bouton aux lecteurs d'écran
      on: { click: () => toggleTheme() }                             // ⬅️ Handler: déclenche l’action globale `toggleTheme()`
    },
    ["🌓 Thème"]                                                      // ⬅️ Contenu du bouton (emoji + libellé)
  );

  root.appendChild(btn);                                             // ⬅️ On insère le bouton à droite de l’en-tête

  // Fonction qui applique la valeur du thème sur <html data-theme="...">
  const applyTheme = () => {                                         // ⬅️ Rendue pure: lit l’état et met à jour l’attribut
    const { theme } = getState();                                    // ⬅️ Lecture du store global (source de vérité)
    document.documentElement.setAttribute("data-theme", theme);      // ⬅️ Le CSS réagit à [data-theme="light|dark"]
  };

  applyTheme();                                                       // ⬅️ Application initiale du thème au montage
  subscribeToState(applyTheme);                                       // ⬅️ Réapplique automatiquement quand l’état global change

  return root;                                                        // ⬅️ Le composant expose sa racine DOM au reste de l’app
}
