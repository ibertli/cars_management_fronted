
import Layout from '@/module-dashboard/pages/layout'
const _import = require('@/router/import_' + process.env.NODE_ENV)

export default [
  {
   // root: true,
    path: '/car',//父路径
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'car',
    meta: {
      title: '车辆管理管理',
      icon: 'component'
    },
    children: [
      {
        path: 'carList', 
        component: _import('car/pages/carList'),
        name: 'carList',
        meta: {title: '车辆列表', icon: 'component', noCache: true}
      },
      {
        path: 'addCar', 
        component: _import('car/pages/addCar'),
        name: 'addCar',
        meta: {title: '添加车辆', icon: 'component', noCache: true}
      }
    ]
  }
]
