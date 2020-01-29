<template>
  <div id="app">
    <wc-tabs>
      <div slot="tabs">
        <wc-tabcontrol data-selected="true" data-id="tab1">Intro</wc-tabcontrol>
        <wc-tabcontrol data-selected="false" data-id="tab2">Second Tab</wc-tabcontrol>
        <wc-tabcontrol data-selected="false" data-id="tab3">Third Tab</wc-tabcontrol>
      </div>

      <div slot="panels">
        <wc-tabpanel data-tabid="tab1">
          <article>
            <h1>Intro</h1>
            <p>This is a webcomponent for creating tabs based on wai-aria guidelines. https://www.w3.org/TR/wai-aria-practices/#tabpanel</p>
          </article>
        </wc-tabpanel>
        <wc-tabpanel data-tabid="tab2">
          <article>
            <h1>Second Tab</h1>
          </article>
        </wc-tabpanel>
        <wc-tabpanel data-tabid="tab3">
          <article>
            <h1>Third Tab</h1>
          </article>
        </wc-tabpanel>
      </div>
    </wc-tabs>

    <a href="#">link</a>
  </div>
</template>

<script>
import "./components/wc-tabs-vanilla.js";
import "./components/wc-tabcontrol-vanilla.js";
import "./components/wc-tabpanel-vanilla.js";

export default {
  name: "App",
  components: {}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
