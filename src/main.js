import Vue from 'vue'
import App from './App'
import router from './router'
import ui from './components/index'
import './scss/main.scss'

Vue.use(ui)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})
