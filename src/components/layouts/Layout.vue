<template>
  <a-layout id="layout">
    <global-side-menu></global-side-menu>
    <a-layout>
      <global-header></global-header>
      <a-layout-content id="global_content">
        <transition name="page-transition">
          <router-view/>
        </transition>
      </a-layout-content>
    </a-layout>
    <global-footer></global-footer>
  </a-layout>
</template>

<script>
import GlobalFooter from './global/GlobalFooter'
import GlobalHeader from './global/GlobalHeader'
import GlobalSideMenu from './global/GlobalSideMenu'

export default {
  name: "Layout",
  components: {
    GlobalFooter,
    GlobalHeader,
    GlobalSideMenu
  },
  data(){
    return {

    }
  }
}
</script>

<style scoped>
#layout{
  height: 100%;
}

#global_content {
  padding: 15px;
  background: #f0f2f5;
}
</style>
