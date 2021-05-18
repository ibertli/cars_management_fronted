
import Layout from '@/module-dashboard/pages/layout'
const _import = require('@/router/import_' + process.env.NODE_ENV)

export default [
  {
    root: true,
    path: '/project',//父路径
    component: Layout,
    redirect: 'noredirect',
    name: 'project',
    meta: {
      title: '城市管理',
      icon: 'component'
    },
    children: [
      {
        path: 'projectList', 
        component: _import('project/pages/projectList'),
        name: 'projectList',
        meta: {title: '项目列表', icon: 'component', noCache: true}
      }
    ]
  }
]
