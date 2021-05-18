
import Layout from '@/module-dashboard/pages/layout'
const _import = require('@/router/import_' + process.env.NODE_ENV)

export default [
  {
    //root: true,
    path: '/route',//父路径
    component: Layout,
    redirect: 'noredirect',
    name: 'route',
    alwaysShow: true,
    meta: {
      title: '路线管理',
      icon: 'component'
    },
    children: [
      {
        path: 'routeList', 
        component: _import('route/pages/routeList'),
        name: 'routeList',
        meta: {title: '路线列表', icon: 'component', noCache: true}
      },
      {
        path: 'addRoute', 
        component: _import('route/pages/addRoute'),
        name: 'addRoute',
        meta: {title: '添加路线', icon: 'component', noCache: true}
      }
    ]
  }
]
