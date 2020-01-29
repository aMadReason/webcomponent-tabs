/* global ShadyCSS */

// vanilla web component using web-components polyfill

const tag = "wc-tabpanel";

const template = () => `
<style>
  /*
  It's a good idea to prefix WC styles with :host for scoping in shadow dom. 
  Looky here 👀 : https://developers.google.com/web/fundamentals/web-components/shadowdom
  */


</style>
<div role="tabpanel">
 <slot></slot>
</div>

`;

class Component extends HTMLElement {
  constructor() {
    super(); // !required!
    this._hasShadow = true; // true or fals to disable or enable shadow dom
    this.dom = this._hasShadow ? this.attachShadow({ mode: "open" }) : this;

    // setup your template
    const temp = document.createElement("template");

    // we're using innerHTML but you could manually create each element and add to this._elements for complex use-cases
    temp.innerHTML = template();

    /* Style Polyfill Step 1 */
    if (window.ShadyCSS) ShadyCSS.prepareTemplate(temp, tag); // prepare template
    /* END Style Polyfill Step 1 */

    this.template = document.importNode(temp.content, true); // copy template contents into 'this'

    /* Style Polyfill Step 2 */
    if (window.ShadyCSS) ShadyCSS.styleElement(this);
    /* END Style Polyfill Step 2 */

    this.dom.appendChild(this.template);
    return this;
  }

  static get observedAttributes() {
    return ["data-tabid"];
  }

  dispatch() {
    const attributes = {};
    [].slice
      .call(this.attributes)
      .filter(i => i.name && i.value)
      .map(i => (attributes[i.name] = i.value));

    const event = new CustomEvent("wc-event", {
      detail: { tag, attributes }
    });
    this.dispatchEvent(event);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return false; // if value hadn't changed do nothing
    // respond to attribute changes here
    if ("name" === "data-tabid") this.panel.setAttribute("aria-labelledby", newValue);
    this.dispatch();
    return this;
  }

  connectedCallback() {
    this.panel = this.dom.querySelector('[role="tabpanel"]');
    this.panel.setAttribute("aria-labelledby", this.getAttribute("data-tabid"));
  }

  disconnectedCallback() {}

  // better to use default, predefined tag for css polyfill
  // this could be done externally, but having a method that does it for you is easier
  static register() {
    if (window.customElements.get(tag) === undefined) {
      window.customElements.define(tag, Component);
    }
  }
}

Component.register();
// magic that registers the tag
export default Component;
