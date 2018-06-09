import Vue from 'vue'
import Router from 'vue-router'

import Unicode from '@/views/Unicode'
import Common from '@/views/Common'
import Emoticons from '@/views/Emoticons'
import Coding from '@/views/Coding'
import UnicodeHelp from '@/views/UnicodeHelp'
import About from '@/views/About'

Vue.use(Router)

let routes = [
    {
        path: '/',
        redirect: '/unicode'
    },
    {
        path: '/unicode',
        component: Unicode
    },
    {
        path: '/unicode/help',
        component: UnicodeHelp
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
