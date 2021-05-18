<template>
  <scroll-bar>
    <el-menu mode="vertical"   :default-active="$route.path" 
      :collapse="isCollapse" 
      text-color="#bfcbd9" 
      class="sidebarBg"
      >
      <router-link to="/">
        <div class="sidebar-logo"><img src="../assets/logo.jpg" /></div>
        <div class="sidebar-logo-mini"><img src="../assets/logo.jpg" /></div>
      </router-link>
      <sidebar-item :routes="permission_routers"></sidebar-item>
      <router-link to="/city/cityList">
        <el-menu-item index="#/city/cityList">
          <i class="el-icon-location" style="color:#fff"></i>
          <span slot="title">城市管理</span>
        </el-menu-item>
      </router-link>
      <router-link to="/project/projectList">
        <el-menu-item index="#/city/cityList">
          <i class="el-icon-set-up" style="color:#fff"></i>
          <span slot="title">项目管理</span>
        </el-menu-item>
      </router-link>
      <el-submenu index="1" >
            <template slot="title">
              <i class="el-icon-position" style="color:#fff"></i>
              <span style="color:#fff">车辆管理</span>
            </template>
          <router-link to="/car/carList">
              <el-menu-item index="1-1">车辆列表</el-menu-item>
          </router-link>
         <router-link to="/car/addCar">
              <el-menu-item index="1-2">添加车辆</el-menu-item>
          </router-link>       
      </el-submenu>
      <el-submenu index="2" style="color:#fff">
            <template slot="title">
              <i class="el-icon-place" style="color:#fff"></i>
              <span style="color:#fff">路线管理</span>
            </template>
          <router-link to="/route/routeList">
              <el-menu-item index="1-1">路线列表</el-menu-item>
          </router-link>
         <router-link to="/route/addRoute">
              <el-menu-item index="1-2">添加路线</el-menu-item>
          </router-link>       
      </el-submenu>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './layoutSidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  name: 'layoutSidebar',
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style>


</style>
