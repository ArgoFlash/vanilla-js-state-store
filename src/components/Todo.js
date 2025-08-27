// src/components/Todo.js                                                                   // 📄 Composant Todo (liste de tâches) branché sur le store global
import { el, clear, cls } from "../utils/dom.js";                                          // ⬅️ Utilitaires DOM: créer des éléments (el), vider un nœud (clear), gérer des classes (cls)
import { getState, subscribeToState, addTodo, toggleTodo, removeTodo } from "../state/store.js"; // ⬅️ Sélecteurs & actions du store global

export function Todo() {                                                                   // ⬅️ Composant fonctionnel qui renvoie un nœud DOM
  const root = el("div", { className: "card" });                                           // ⬅️ Carte visuelle qui contient toute la Todo

  const title = el("h2", { text: "Todo (store global)" });                                 // ⬅️ Titre de section

  const input = el("input", {                                                              
    className: "input",                                                                    // ⬅️ Style du champ texte
    attrs: { type: "text", placeholder: "Ajouter une tâche..." }                           // ⬅️ Attributs HTML sécurisés (pas d’innerHTML)
  });                                                                                      // ⬅️ Champ où l’utilisateur saisit la nouvelle tâche

  const onAdd = () => {                                                                     // ⬅️ Handler appelé quand on clique sur "Ajouter"
    const value = input.value.trim();                                                      // ⬅️ Nettoie les espaces inutiles au bord
    if (value.length === 0) return;                                                        // ⬅️ Si rien saisi → on ne fait rien
    addTodo(value);                                                                         // ⬅️ Action du store: ajoute une todo (immutabilité gérée dans le store)
    input.value = "";                                                                       // ⬅️ Reset du champ après ajout
    input.focus();                                                                          // ⬅️ UX: remet le focus pour pouvoir enchaîner
  };

  const btnAdd = el("button", { className: "primary", on: { click: onAdd } }, ["Ajouter"]); // ⬅️ Bouton d’ajout (style primary) qui déclenche onAdd
  const formRow = el("div", { className: "row" }, [input, btnAdd]);                         // ⬅️ Ligne qui aligne l’input et le bouton

  const list = el("div");                                                                   // ⬅️ Conteneur où on rendra la liste des tâches

  root.appendChild(title);                                                                  // ⬅️ Assemble: titre...
  root.appendChild(formRow);                                                                // ⬅️ ... puis la barre d’ajout...
  root.appendChild(list);                                                                   // ⬅️ ... puis le conteneur de liste

  const renderList = () => {                                                                // ⬅️ Fonction de rendu (appelée au démarrage et à chaque changement du store)
    clear(list);                                                                            // ⬅️ Toujours repartir d’un conteneur vide (évite l’empilement)

    const { todos } = getState();                                                           // ⬅️ Lecture de la source de vérité (tableau des tâches)
    if (todos.length === 0) {                                                               // ⬅️ Cas "liste vide"
      list.appendChild(                                                                      // ⬅️ Message doux pour encourager à ajouter
        el("p", { className: "small", text: "Aucune tâche. Ajoutez-en une !" })
      );
      return;                                                                               // ⬅️ On sort (rien d’autre à dessiner)
    }

    for (const item of todos) {                                                             // ⬅️ Pour chaque tâche du store...
      const onToggle = () => toggleTodo(item.id);                                           // ⬅️ Handler: coche/décoche (inverse `done`)
      const onRemove = () => removeTodo(item.id);                                           // ⬅️ Handler: supprime la tâche

      const checkbox = el("input", {                                                        // ⬅️ Case à cocher liée à l’état `done`
        attrs: { type: "checkbox" }, 
        on: { change: onToggle }                                                            // ⬅️ Sur changement, on déclenche l’action globale
      });
      checkbox.checked = !!item.done;                                                       // ⬅️ Sync visuelle avec la valeur courante (coché si done)

      const label = el("span", { text: item.text });                                        // ⬅️ Texte de la tâche (texte sécurisé)
      const btn = el("button", { on: { click: onRemove } }, ["Supprimer"]);                 // ⬅️ Bouton suppression

      const row = el("div", { className: "todo-item" }, [checkbox, label, btn]);            // ⬅️ Ligne complète: [☐] [texte] [Supprimer]
      cls(row, "done", !!item.done);                                                        // ⬅️ Ajoute/enlève la classe "done" pour le style (barré/opacité)

      list.appendChild(row);                                                                // ⬅️ Insère la ligne dans la liste
    }
  };

  renderList();                                                                             // ⬅️ Premier rendu initial de la liste
  subscribeToState(renderList);                                                             // ⬅️ Abonnement: à chaque setState global → re-render

  return root;                                                                              // ⬅️ Le composant expose sa racine DOM (montée dans main.js)
}
