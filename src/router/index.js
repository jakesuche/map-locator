import Vue from 'vue'
import Router from 'vue-router'
import UserLocation from '@/pages/UserLocation'


Vue.use(Router)

export default new Router({
    mode:'history',
    routes:[
       {
           path:'/',
           component:UserLocation
       } 

    ]
})