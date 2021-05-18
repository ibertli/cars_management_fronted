
import Layout from '@/module-dashboard/pages/layout'
const _import = require('@/router/import_' + process.env.NODE_ENV)

export default [
  {
    root: true,
    path: '/city',//父路径
    component: Layout,
    redirect: 'noredirect',
    name: 'city',
    meta: {
      title: '城市管理',
      icon: 'component'
    },
    children: [
      {
        path: 'cityList', 
        component: _import('city/pages/cityList'),
        name: 'cityList',
        meta: {title: '城市列表', icon: 'component', noCache: true}
      }
    ]
  }
]
