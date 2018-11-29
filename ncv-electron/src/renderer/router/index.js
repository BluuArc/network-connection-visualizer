import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'visualize',
      component: require('@/views/MainVisualization').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
