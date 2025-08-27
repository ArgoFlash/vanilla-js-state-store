// src/components/Counter.js                          // 📄 Emplacement du fichier (bonne pratique: un composant = un fichier)
import { el, clear } from "../utils/dom.js";         // ⬅️ On importe deux utilitaires DOM : `el` (crée des éléments) et `clear` (vide un nœud proprement)
import { createState } from "../state/store.js";     // ⬅️ On importe notre mini useState "vanilla" (get/set/subscribe)

export function Counter() {                          // ⬅️ Composant "Counter" : une fonction qui fabrique et renvoie un nœud DOM
  // état local: compteur
  const count = createState(0);                      // ⬅️ État local initialisé à 0 ; `count.get()` lit, `count.set()` met à jour, `count.subscribe()` écoute

  const root = el("div", { className: "card" });     // ⬅️ Conteneur principal du composant (carte visuelle)

  const title = el("h2", { text: "Compteur (useState local)" }); // ⬅️ Titre de la carte (texte sécurisé via textContent)

  const valueStrong = el("strong", { text: "0" });   // ⬅️ Élément qui affichera la valeur du compteur (on le mettra à jour)
  const display = el("div", { className: "row" }, [  // ⬅️ Ligne horizontale : libellé + valeur
    el("span", { className: "small", text: "Valeur actuelle :" }), // ⬅️ Petit libellé à gauche
    valueStrong                                                // ⬅️ La valeur visible (0 au démarrage)
  ]);

  const onDec = () => count.set(v => v - 1);         // ⬅️ Handler "–" : on passe une fonction updater (bon réflexe) pour éviter les états obsolètes
  const onInc = () => count.set(v => v + 1);         // ⬅️ Handler "+" : même principe, on incrémente à partir de la valeur actuelle
  const onReset = () => count.set(0);                // ⬅️ Handler "Reset" : on fixe l'état à 0 (valeur directe)

  const buttons = el("div", { className: "row" }, [  // ⬅️ Ligne des boutons d'action
    el("button", { className: "ghost",   on: { click: onDec } },  ["–"]),  // ⬅️ Bouton décrémentation (style ghost)
    el("button", { className: "primary", on: { click: onInc } },  ["+"]),  // ⬅️ Bouton incrémentation (style primary)
    el("button", {                       on: { click: onReset } },["Reset"])// ⬅️ Bouton reset
  ]);

  root.appendChild(title);                           // ⬅️ On assemble : titre...
  root.appendChild(display);                         // ⬅️ ... puis affichage de la valeur...
  root.appendChild(buttons);                         // ⬅️ ... puis les boutons

  const renderValue = () => {                        // ⬅️ Fonction de rendu de la valeur (appelée au démarrage et à chaque changement d'état)
    clear(valueStrong);                              // ⬅️ On nettoie l'élément (bonne pratique : éviter innerHTML = "")
    valueStrong.appendChild(                         // ⬅️ On ajoute un TextNode avec la valeur du state
      document.createTextNode(String(count.get()))   // ⬅️ `String(...)` assure qu'on met bien du texte (pas de number brut)
    );
  };

  renderValue();                                     // ⬅️ Rendu initial (sinon ça resterait "0" en dur)
  count.subscribe(renderValue);                      // ⬅️ À chaque `count.set(...)`, on relance `renderValue` (UI réactive sans framework)

  return root;                                       // ⬅️ Le composant renvoie son nœud racine pour être monté dans la page
}
