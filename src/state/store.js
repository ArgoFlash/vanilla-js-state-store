// src/state/store.js                                                           // 📄 Emplacement du module "state" (mini useState + store global)

/**
 * OBJECTIF
 * --------
 * 1) createState(initialValue): un mini "useState" vanilla
 *    - get(): lire la valeur
 *    - set(next): mettre à jour (next peut être une valeur ou une fonction updater)
 *    - subscribe(fn): être notifié à chaque changement
 *
 * 2) Un store global minimal pour l'app:
 *    - getState(), setState(patch), subscribeToState(fn)
 *
 * Remarque: on N'UTILISE PAS l'opérateur spread ("..."). On montre des copies avec
 * Object.keys + boucles simples pour les débutants
 */ // ⬅️ En-tête pédagogique : décrit le but du fichier et les règles de style


/* =========================
   1) useState "vanilla"
   ========================= */ // ⬅️ Section 1 : état local façon useState


/**
 * createState(initialValue)
 * @param {*} initialValue - valeur de départ
 * @returns { get, set, subscribe }
 */ // ⬅️ JSDoc : décrit la fonction et son API
export function createState(initialValue) {                                   // ⬅️ Export de la fabrique d’état local
  // valeur courante
  let value = initialValue;                                                   // ⬅️ Stocke la valeur actuelle (modifiable)

  // abonnés (fonctions à appeler quand la valeur change)
  const subs = new Set();                                                     // ⬅️ Ensemble de callbacks à notifier

  /**
   * get(): renvoie la valeur actuelle
   */ // ⬅️ Lecture de l’état
  function get() {                                                            // ⬅️ Définition de get()
    return value;                                                             // ⬅️ Retourne la valeur courante
  }

  /**
   * set(next): met à jour la valeur
   * - si next est une fonction, on lui passe la valeur courante et on utilise son retour
   * - sinon, next est la nouvelle valeur directement
   * - si la valeur ne change pas (Object.is), on ne notifie pas
   */ // ⬅️ Mise à jour de l’état
  function set(next) {                                                        // ⬅️ Définition de set()
    const newValue = typeof next === "function" ? next(value) : next;         // ⬅️ Calcule la nouvelle valeur (supporte updater function)
    if (Object.is(newValue, value)) return;                                   // ⬅️ Rien à faire si pas de changement (évite re-render)
    value = newValue;                                                         // ⬅️ Met à jour la valeur interne
    // notifie chaque abonné                                                  // ⬅️ En résumé : un “abonné”, c’est toute fonction à qui tu veux dire “hé, l’état a changé, mets-toi à jour”
    for (const fn of subs) {                                                  // ⬅️ Parcourt tous les abonnés
      try { fn(value); } catch (e) { console.error(e); }                      // ⬅️ Appelle chaque callback en capturant les erreurs
    }
  }

  /**
   * subscribe(fn): s'abonner aux changements
   * renvoie une fonction "unsubscribe" pour se désabonner
   */ // ⬅️ Abonnement aux changements d’état
  function subscribe(fn) {                                                    // ⬅️ Définition de subscribe()
    subs.add(fn);                                                             // ⬅️ Ajoute le callback à l’ensemble
    return function unsubscribe() {                                           // ⬅️ Retourne une fonction de désabonnement
      subs.delete(fn);                                                        // ⬅️ Retire le callback
    };
  }

  return { get, set, subscribe };                                             // ⬅️ Expose l’API de l’état local
}


/* =========================
   2) Store global de l'app
   ========================= */ // ⬅️ Section 2 : état global partagé


// État global (ex: thème, todos)
let globalState = {                                                           // ⬅️ Objet racine du store global (modifiable par setState)
  theme: "light",     // "light" | "dark"                                     // ⬅️ Thème par défaut
  todos: [],          // { id: number, text: string, done: boolean }[]        // ⬅️ Liste de tâches initialement vide
};

// Liste des listeners abonnés au store global
const listeners = new Set();                                                  // ⬅️ Ensemble de callbacks à notifier sur changement global

/**
 * getState(): lire l'état global courant
 */ // ⬅️ Sélecteur global (lecture)
export function getState() {                                                  // ⬅️ Export de getState()
  return globalState;                                                         // ⬅️ Retourne la référence actuelle du state global
}

/**
 * shallowClone(obj): copie superficielle d'un objet (sans spread)
 */ // ⬅️ Utilitaire : copie d’objet clé→valeur
function shallowClone(obj) {                                                  // ⬅️ Définition de shallowClone()
  const out = {};                                                             // ⬅️ Nouveau conteneur
  for (const k of Object.keys(obj)) {                                         // ⬅️ Parcourt chaque clé propre
    out[k] = obj[k];                                                          // ⬅️ Copie la valeur associée
  }
  return out;                                                                 // ⬅️ Retourne la copie superficielle
}

/**
 * merge(a, b): crée un nouvel objet avec les clés de a, puis celles de b
 * (équivalent simple à { ...a, ...b } mais sans spread)
 */ // ⬅️ Fusion non-destructive : priorise b sur a
function merge(a, b) {                                                        // ⬅️ Définition de merge()
  const out = shallowClone(a);                                                // ⬅️ Part d’une copie de a
  for (const k of Object.keys(b)) {                                           // ⬅️ Ajoute/écrase avec les clés de b
    out[k] = b[k];                                                            // ⬅️ Affecte la valeur de b dans out
  }
  return out;                                                                 // ⬅️ Renvoie le nouvel objet fusionné
}

/**
 * setState(patch): met à jour une partie de l'état global
 * ex: setState({ theme: "dark" })
 */ // ⬅️ Mise à jour partielle du store global
export function setState(patch) {                                             // ⬅️ Export de setState()
  const nextState = merge(globalState, patch);                                // ⬅️ Crée un nouvel état (immutabilité basique)

  // Si la référence ne change pas, on pourrait ne pas notifier.
  // Ici, on compare par référence (simpliste) :
  if (nextState === globalState) return;                                      // ⬅️ Si identique par référence, on sort

  globalState = nextState;                                                    // ⬅️ Remplace l’état global par la nouvelle référence

  for (const fn of listeners) {                                               // ⬅️ Notifie tous les abonnés
    try { fn(globalState); } catch (e) { console.error(e); }                  // ⬅️ Appelle les callbacks en capturant les erreurs
  }
}

/**
 * subscribeToState(fn): s'abonner au store global
 */ // ⬅️ Abonnement aux changements du store global
export function subscribeToState(fn) {                                        // ⬅️ Export de subscribeToState()
  listeners.add(fn);                                                          // ⬅️ Ajoute le listener
  return function unsubscribe() {                                             // ⬅️ Retourne la fonction de désabonnement
    listeners.delete(fn);                                                     // ⬅️ Retire le listener
  };
}


/* =========================
   3) Actions Todo (immutables sans spread)
   ========================= */ // ⬅️ Section 3 : actions métier (todos)

/**
 * addTodo(text): ajoute une nouvelle todo
 */ // ⬅️ Action : création d’une todo
export function addTodo(text) {                                               // ⬅️ Export de addTodo()
  const todo = { id: Date.now(), text, done: false };                         // ⬅️ Construit l’objet todo (id simple basé sur l’horodatage)

  // copie du tableau + ajout
  const current = globalState.todos;                                          // ⬅️ Récupère le tableau actuel
  const next = new Array(current.length + 1);                                 // ⬅️ Crée un nouveau tableau (taille +1)
  for (let i = 0; i < current.length; i++) next[i] = current[i];              // ⬅️ Copie chaque item
  next[current.length] = todo;                                                // ⬅️ Ajoute la nouvelle todo en fin

  setState({ todos: next });                                                  // ⬅️ Publie le nouvel état (immutabilité respectée)
}

/**
 * toggleTodo(id): inverse "done" de l'élément ciblé
 */ // ⬅️ Action : bascule l’état d’achèvement
export function toggleTodo(id) {                                              // ⬅️ Export de toggleTodo()
  const current = globalState.todos;                                          // ⬅️ Tableau actuel des todos
  const next = new Array(current.length);                                     // ⬅️ Nouveau tableau de même longueur
  for (let i = 0; i < current.length; i++) {                                  // ⬅️ Parcourt chaque todo
    const item = current[i];                                                  // ⬅️ Todo en cours
    next[i] = item.id === id                                                  // ⬅️ Si l’id correspond...
      ? { id: item.id, text: item.text, done: !item.done }                    // ⬅️ ...on crée un nouvel objet inversant "done"
      : item;                                                                 // ⬅️ ...sinon on réutilise l’objet tel quel
  }
  setState({ todos: next });                                                  // ⬅️ Publie le nouvel état
}

/**
 * removeTodo(id): supprime l'élément ciblé
 */ // ⬅️ Action : suppression d’une todo par id
export function removeTodo(id) {                                              // ⬅️ Export de removeTodo()
  const current = globalState.todos;                                          // ⬅️ Tableau actuel
  let keepCount = 0;                                                           // ⬅️ Compte les éléments à conserver
  for (let i = 0; i < current.length; i++) {                                  // ⬅️ Parcourt le tableau
    if (current[i].id !== id) keepCount++;                                    // ⬅️ Incrémente si l’élément n’est pas celui à supprimer
  }

  const next = new Array(keepCount);                                          // ⬅️ Crée un nouveau tableau de la bonne taille
  let j = 0;                                                                  // ⬅️ Index d’écriture dans le nouveau tableau
  for (let i = 0; i < current.length; i++) {                                  // ⬅️ Deuxième parcours pour copier les éléments à garder
    if (current[i].id !== id) {                                               // ⬅️ Si différent de l’id supprimé...
      next[j] = current[i];                                                   // ⬅️ ...on copie l’élément
      j++;                                                                    // ⬅️ ...et on avance l’index d’écriture
    }
  }
  setState({ todos: next });                                                  // ⬅️ Publie le tableau filtré
}

/**
 * toggleTheme(): bascule light/dark
 */ // ⬅️ Action : change le thème global
export function toggleTheme() {                                               // ⬅️ Export de toggleTheme()
  const nextTheme = globalState.theme === "light" ? "dark" : "light";         // ⬅️ Choisit l’autre valeur
  setState({ theme: nextTheme });                                             // ⬅️ Met à jour le store global
}
