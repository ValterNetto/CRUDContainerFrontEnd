import Vue from 'vue'
import App from './App.vue'
//Importação do BootstrapVue em todo projeto
import {BootstrapVue} from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import {BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
Vue.use(BootstrapVueIcons)

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import {FormDatepickerPlugin} from 'bootstrap-vue'
Vue.use(FormDatepickerPlugin)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

