/* global ShadyCSS */

// vanilla web component using web-components polyfill

const tag = "wc-tabcontrol";

class Component extends HTMLButtonElement {
  constructor() {
    super(); // !required!
    this._hasShadow = true; // true or fals to disable or enable shadow dom
    this.dom = this._hasShadow ? this.attachShadow({ mode: "open" }) : this;

    // this.template = document.importNode(temp.content, true); // copy template contents into 'this'

    // this.dom.appendChild(this.template);
    // this.button = this.dom.querySelector("button");
    return this;
  }

  static get observedAttributes() {
    return ["data-selected", "data-id", "tabIndex", "tabindex"];
  }

  dispatch(options = {}) {
    const attributes = {};
    [].slice
      .call(this.attributes)
      .filter(i => i.name && i.value)
      .map(i => (attributes[i.name] = i.value));

    const event = new CustomEvent("wc-event", {
      detail: { tag, attributes, ...options }
    });
    this.dispatchEvent(event);
  }

  handleButtonClick() {
    this.dispatch({ type: "click" });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return false; // if value hadn't changed do nothing
    // respond to attribute changes here

    if (name === "data-selected") {
      this.button.setAttribute("aria-selected", newValue);
      this.button.setAttribute("tabIndex", newValue ? "0" : -1);
    }
    if (name === "data-id") this.button.id = newValue;
    this.dispatch();
    return this;
  }

  connectedCallback() {
    this.button.addEventListener("click", e => this.handleButtonClick(e));
  }

  disconnectedCallback() {
    this.button.removeEventListener("click", e => this.handleButtonClick(e));
  }

  // better to use default, predefined tag for css polyfill
  // this could be done externally, but having a method that does it for you is easier
  static register() {
    if (window.customElements.get(tag) === undefined) {
      window.customElements.define(tag, Component, { extends: "button" });
    }
  }
}

Component.register();
// magic that registers the tag
export default Component;
