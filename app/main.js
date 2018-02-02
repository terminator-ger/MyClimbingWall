// Import Vue
import Vue from 'vue'

// Import F7
import Framework7 from 'framework7'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'

// Import Routes
import Routes from './routes.json'

// Import App Component
import App from './app.vue'
import ShowBoulder from './pages/showboulder.vue'
import SearchBoulder from './pages/searchboulder.vue'

import debugPlugin from './framework7.debug'


// install plugin first
Framework7.use(debugPlugin)

// Init F7 Vue Plugin
Vue.use(Framework7Vue)

// Init App
/* eslint-disable no-new */
/* eslint no-unused-vars: ["warn", { "vars": "local" }] */

new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    /* Uncomment to enable Material theme: */
    material: true,
    routes: Routes,
    debugger: true,
  },
  // Register App Component
  components: {
    app: App,
    showboulder: ShowBoulder,
    searchboulder: SearchBoulder,
  },
})

