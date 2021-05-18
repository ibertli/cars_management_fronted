import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import * as filters from './filters' // global filters
// font-awesome
import 'font-awesome/css/font-awesome.css'
//import './mock' // simulation data
import AMap from 'vue-amap' //map
import VueCropper from 'vue-cropper' //裁剪图片
/*
* 注册 - 业务模块
*/
import dashboard from '@/module-dashboard/' // 面板
import city from '@/module-city/' // 城市管理
import project from '@/module-project/' // 项目管理
import car from '@/module-car/' // 车辆管理
import route from '@/module-route/' // 路线管理

import tools from './utils/common.js'
Vue.prototype.$tools = tools

Vue.use(VueCropper)
Vue.use(AMap)
Vue.use(tools)
Vue.use(dashboard, store)
Vue.use(city,store)
Vue.use(project,store)
Vue.use(car,store)
Vue.use(route,store)

Vue.prototype.Url = 'http://itdipdhmi.hirain.com:9999/'
//Vue.prototype.Url = 'http://localhost:9999/'
Vue.prototype.PhotoUrl = 'http://itdipdhmi.hirain.com/hmiPhoto/'
/*
* 注册 - 组件
*/

// 饿了么
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德的key
  key: 'YOUR_KEY',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});
/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
