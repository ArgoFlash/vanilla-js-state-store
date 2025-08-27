// src/utils/dom.js                                                    // 📄 Module d'utilitaires DOM (création/manipulation d'éléments)

/**
 * el(tag, props?, children?)
 * Crée un élément proprement (sans innerHTML).
 * - props: { id, className, attrs: {…}, dataset: {…}, on: {click: fn, input: fn, …}, text }
 * - children: tableau d'éléments DOM ou chaînes (transformées en TextNode)
 */ // ⬅️ Signature et contrat d'utilisation de la fabrique d'éléments
export function el(tag, props, children) {                            // ⬅️ Fonction principale: fabrique un nœud DOM configurable
  const node = document.createElement(tag);                           // ⬅️ Crée l'élément via l'API DOM (sécurisé)

  if (props) {                                                        // ⬅️ Si des propriétés sont fournies, on les applique
    if (props.id) node.id = props.id;                                 // ⬅️ Affecte un id (facilite la sélection/accessibilité)
    if (props.className) node.className = props.className;            // ⬅️ Affecte les classes CSS (string, pas de tableau)

    if (props.text != null) {                                         // ⬅️ Si un texte est donné (y compris chaine vide)
      node.textContent = String(props.text);                          // ⬅️ textContent évite l'injection HTML (contraire d'innerHTML)
    }

    if (props.attrs) {                                                // ⬅️ Attributs standards (type, placeholder, aria-*, role, etc.)
      for (const key of Object.keys(props.attrs)) {                   // ⬅️ On parcourt proprement les clés de l'objet
        node.setAttribute(key, String(props.attrs[key]));             // ⬅️ setAttribute permet d'ajouter des attributs arbitraires
      }
    }

    if (props.dataset) {                                              // ⬅️ data-* personnalisés (dataset)
      for (const key of Object.keys(props.dataset)) {                 // ⬅️ Chaque clé devient data-key="..."
        node.dataset[key] = String(props.dataset[key]);               // ⬅️ Affectation via dataset, typée en string par sécurité
      }
    }

    if (props.on) {                                                   // ⬅️ Gestionnaires d'événements (click, input, change, etc.)
      for (const ev of Object.keys(props.on)) {                       // ⬅️ Pour chaque type d'événement...
        node.addEventListener(ev, props.on[ev]);                      // ⬅️ ...on attache la fonction correspondante
      }
    }
  }

  if (children && children.length) {                                  // ⬅️ Si des enfants sont fournis, on les insère
    for (const child of children) {                                   // ⬅️ Parcourt du tableau des enfants
      if (typeof child === "string" || typeof child === "number") {   // ⬅️ Si c'est un texte/number, on crée un TextNode
        node.appendChild(document.createTextNode(String(child)));     // ⬅️ Transformation sécurisée en texte
      } else if (child instanceof Node) {                             // ⬅️ Si c'est déjà un nœud DOM...
        node.appendChild(child);                                      // ⬅️ ...on l'attache tel quel (composition de composants)
      }
      // (Sinon: on ignore les valeurs non supportées —> bonne robustesse)
    }
  }

  return node;                                                        // ⬅️ Renvoie le nœud prêt à être inséré dans le DOM
}

/**
 * clear(node): supprime tous les enfants d'un nœud
 */ // ⬅️ Helper pour nettoyer un conteneur (évite innerHTML = "")
export function clear(node) {                                         // ⬅️ Déclare la fonction utilitaire
  while (node.firstChild) node.removeChild(node.firstChild);          // ⬅️ Boucle de retrait des enfants (performante et sûre)
}

/**
 * cls(node, className, present): ajoute/enlève une classe selon present (boolean)
 */ // ⬅️ Helper pour gérer les classes de manière déclarative
export function cls(node, className, present) {                       // ⬅️ Déclare la fonction utilitaire
  if (present) node.classList.add(className);                         // ⬅️ Ajoute la classe si `present` est vrai
  else node.classList.remove(className);                              // ⬅️ Sinon, la retire (pas d'effet si déjà absent)
}
