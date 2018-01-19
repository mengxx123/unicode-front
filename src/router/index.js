import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/All'
import Common from '@/views/Common'
import Emoticons from '@/views/Emoticons'
import Coding from '@/views/Coding'
import About from '@/views/About'

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/common',
        component: Common
    },
    {
        path: '/emoticons',
        component: Emoticons
    },
    {
        path: '/coding',
        component: Coding
    },
    {
        path: '/about',
        component: About
    }
]

export default new Router({
    mode: 'history',
    routes: routes
})
