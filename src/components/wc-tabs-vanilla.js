/* global ShadyCSS */

// vanilla web component using web-components polyfill

const tag = "wc-tabs";

const template = () => `
<style>
  /*
  It's a good idea to prefix WC styles with :host for scoping in shadow dom. 
  Looky here 👀 : https://developers.google.com/web/fundamentals/web-components/shadowdom
  */

  :host [name="tabs"]::slotted(*)  {
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;  
    width: 100%;
  }
 

  :host [name="panels"]::slotted(*) {    
    transition: all .5s;
    padding: .5rem;
    margin-bottom: .5rem;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);
    border: 1px solid #bbb;
  }

  
</style>
<div>
  <div role="tablist" aria-label="Tabs">
    <slot name="tabs"></slot>
  </div>

  <slot name="panels"></slot>
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
    return ["data-selected"];
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
    this.dispatch();
    return this;
  }

  handleTrapFocus(e) {
    const target = e.explicitOriginalTarget || e.target;
    const last = this.elements[this.elements.length - 1];
    const first = this.elements[0];
    const isLast = target === last && !e.shiftKey;
    const isFirst = target === first && e.shiftKey;

    if (isFirst || isLast) e.preventDefault();
    if (isLast) first.focus();
    if (isFirst) last.focus();
  }

  select(id) {
    this.setAttribute("data-selected", id);
    this.tabControls.map(i => {
      const dataId = i.getAttribute("data-id");
      i.setAttribute("data-selected", dataId === id ? true : false);
      return null;
    });

    this.tabPanels.map(i => {
      if (i.getAttribute("data-tabid") === id) {
        i.removeAttribute("hidden");
        return null;
      }

      i.setAttribute("hidden", true);
      return null;
    });
  }

  handleTabClick(event) {
    const { type, attributes } = event.detail;
    const id = attributes["data-id"];
    if (id && type === "click") this.select(id);
  }

  connectedCallback() {
    this.tablist = this.dom.querySelector('[role="tablist]');
    this.tabControls = [].slice.call(this.querySelectorAll("[slot=tabs] > *"));
    this.tabPanels = [].slice.call(this.querySelectorAll("[slot=panels] > *"));

    this.tabControls.map((tab, i) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", i === 0 ? "true" : false);
      tab.addEventListener("wc-event", e => this.handleTabClick(e));
    });

    const first = this.tabPanels && this.tabPanels.length > 0 ? this.tabPanels[0] : false;
    if (first) this.select(first.getAttribute("data-tabid"));

    this.addEventListener("keydown", e => {
      console.log(e.target.tagName);
      if (e.target.tagName !== "WC-TABCONTROL") return;

      const { tabControls = [] } = this;
      const count = this.tabControls.length - 1;

      const index = this.tabControls.findIndex(i => e.target === i);
      const prev = index - 1 >= 0 && index <= count ? index - 1 : count;
      const next = index >= 0 && index + 1 <= count ? index + 1 : 0;

      if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        return tabControls[prev].button.focus();
      }

      if (["ArrowRight", "ArrowDown"].includes(e.key)) {
        return tabControls[next].button.focus();
      }
    });
  }

  disconnectedCallback() {
    this.tabControls.map(i => i.removeEventListener("wc-event", e => this.handleTabClick(e)));
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
