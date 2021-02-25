import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
// Vue.loadScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBC086AI9HzuotrVMjosi38LnIa8VHn2jQ")
Vue.config.productionTip = false
import router from './router'
import '@/assets/css/global.css'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
