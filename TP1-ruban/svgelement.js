/**
 * Classe utilitaire permettant d'étendre les éléments du DOM <svg>
 * avec un ensemble de méthodes facilitant la création et la gestion
 * d'arborescences SVG. Elle repose sur le principe du "mixin".
 *
 * Exemple :
 *   const svg = SVGelement.fromSelector("#dessin")
 *   const rect = svg.appendElement("rect", { width: 100, height: 50, fill: "red" })
 */
class SVGelement {
  /** Namespace commun à tous les éléments SVG créés */
  static NS = "http://www.w3.org/2000/svg"

  /**
   * Retourne l'élément correspondant au sélecteur CSS fourni,
   * enrichi des méthodes de SVGelement.
   *
   * @param {string} selector - Sélecteur CSS désignant un élément unique <svg>
   * @returns {SVGelement} L'élément sous forme de mixin
   * @throws Erreur si aucun élément ou plusieurs éléments correspondent
   */
  static fromSelector(selector) {
    const nodes = document.querySelectorAll(selector)
    if (nodes.length !== 1) {
      throw new Error(`Element identifier "${selector}" is either absent, or not unique`)
    }
    return SVGelement.fromElement(nodes[0])
  }

  /**
   * Version "instance" de fromSelector,
   * qui permet de sélectionner un descendant relatif à `this`.
   *
   * @param {string} selector - Sélecteur CSS désignant un enfant unique
   * @returns {SVGelement} L'élément enfant enrichi
   */
  fromSelector(selector) {
    const nodes = this.querySelectorAll(selector)
    if (nodes.length !== 1) {
      throw new Error(`Element identifier "${selector}" is either absent, or not unique`)
    }
    return SVGelement.fromElement(nodes[0])
  }

  /**
   * Applique le mixin SVGelement à un élément du DOM existant.
   *
   * @param {Element} element - Élément DOM à enrichir
   * @returns {SVGelement} Le même élément enrichi des méthodes
   */
  static fromElement(element) {
    for (const funcName of Object.getOwnPropertyNames(SVGelement.prototype)) {
      if (funcName !== "constructor") {
        element[funcName] = SVGelement.prototype[funcName]
      }
    }
    return element
  }

  /**
   * Définit plusieurs attributs sur l'élément courant.
   *
   * @param {Object.<string,any>} attributes - Dictionnaire {nom: valeur}
   * @returns {SVGelement} this (chaînage)
   */
  setAttributes(attributes) {
    for (const [name, value] of Object.entries(attributes)) {
      if (value === null) {
        this.removeAttribute(name)
      } else {
        this.setAttribute(name, value)
      }
    }
    return this
  }

  /**
   * Ajoute un enfant SVG en fin de liste.
   *
   * @param {string} name - Nom de la balise SVG (ex: "rect", "circle")
   * @param {object} [attributes={}] - Attributs à appliquer
   * @returns {SVGelement} L'enfant créé
   */
  appendElement(name, attributes = {}) {
    const domChild = document.createElementNS(SVGelement.NS, name)
    const child = SVGelement.fromElement(domChild)
    this.appendChild(child)
    return child.setAttributes(attributes)
  }

  /**
   * Ajoute un enfant SVG en début de liste.
   *
   * @param {string} name - Nom de la balise SVG
   * @param {object} [attributes={}] - Attributs à appliquer
   * @returns {SVGelement} L'enfant créé
   */
  prependElement(name, attributes = {}) {
    const domChild = document.createElementNS(SVGelement.NS, name)
    const child = SVGelement.fromElement(domChild)
    this.prepend(child)
    return child.setAttributes(attributes)
  }

  setText(text) {
    this.textContent = text
    return this
  }

  appendText(text) {
    this.textContent += text
    return this
  }

  getElementsByTagName(name) {
    const list = this.getElementsByTagNameNS(SVGelement.NS, name)
    return Array.from(list).map((elem) => SVGelement.fromElement(elem))
  }

  static makeid() {
    return "id_" + window.crypto.randomUUID().slice(0, 8)
  }
}