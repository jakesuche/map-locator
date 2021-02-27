import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
// Vue.loadScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBC086AI9HzuotrVMjosi38LnIa8VHn2jQ")
Vue.config.productionTip = false
import router from './router'
import '@/assets/css/global.css'
import "semantic-ui-css/semantic.min.css"
import firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyDjQZ9PnMqrTOru9jGGowMJq325_xgrKik",
  authDomain: "maplocator-ef688.firebaseapp.com",
  projectId: "maplocator-ef688",
  storageBucket: "maplocator-ef688.appspot.com",
  messagingSenderId: "36304029261",
  appId: "1:36304029261:web:a945e50a8d23df056abe04",
  measurementId: "G-FT0BM5LGZB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
