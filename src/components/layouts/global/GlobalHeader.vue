<template>
  <div>
    <a-layout-header style="background: #fff; padding: 0">
      <a-icon
          class="trigger"
          :type="$store.state.app.sidebar.open ? 'menu-unfold' : 'menu-fold'"
          @click="toggle"
      />
      <user-menu class="header-right" :theme="$store.state.app.theme"/>
    </a-layout-header>
    <page-view></page-view>
  </div>
</template>
<script>
import UserMenu from "./UserMenu";
import PageView from "@/components/tools/PageView";

export default {
  name: 'GlobalHeader',
  components: {
    PageView,
    UserMenu
  },
  data() {
    return {};
  },
  methods: {
    toggle() {
      this.$store.dispatch('app/ToggleSidebar');
    }
  }
};
</script>
<style scoped>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.header-right {
  float: right;
  height: 59px;
  overflow: hidden;
  white-space: nowrap;
}

</style>
