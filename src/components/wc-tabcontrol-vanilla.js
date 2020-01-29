/* global ShadyCSS */

// vanilla web component using web-components polyfill

const tag = "wc-tabcontrol";

const template = () => `
<style>
  /*
  It's a good idea to prefix WC styles with :host for scoping in shadow dom. 
  Looky here 👀 : https://developers.google.com/web/fundamentals/web-components/shadowdom
  */

  :host {       
    flex: 1 100%;   
    // margin: .2rem  auto 0;  /* Magic! */  
    min-height: 30px;
    transform: translateY(1px);
  }

  :host button {
    height: 100%;
    width: 100%;
    margin: 0;
    border: 1px solid #bbb;
    background: #ddd;
    color: #000;
    border-radius: 5px;
    box-shadow: inset 0 -2px 5px #bbb;
    cursor: pointer;
  }

  :host button[aria-selected="true"] {
    box-shadow: none;
    background: white;
    border: 1px solid #bbb;
  }

  
  /* Medium devices (tablets, 768px and up) */
  @media screen and (min-width: 768px) and (orientation: landscape) {

  }

  /* Large devices (desktops, 992px and up) */
  @media screen and (min-width: 992px) and (orientation: landscape) {
    :host { 
      flex: 1 1 auto;  
    }
    
    :host button {
      border-radius: 5px 5px 0 0;
      margin-right: .2rem;
    }

    :host button[aria-selected="true"] {
      border-bottom: 0;
    }
  }
</style>

<button role="tab"><slot></slot></button>

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
    this.button = this.dom.querySelector("button");
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

    if (name === "data-selected") {
      this.button.setAttribute("aria-selected", newValue);
      this.button.setAttribute("tabIndex", newValue === "true" ? "0" : -1);
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
      window.customElements.define(tag, Component);
    }
  }
}

Component.register();
// magic that registers the tag
export default Component;
