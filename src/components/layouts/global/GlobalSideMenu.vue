<template>
  <a-layout-sider class="side"
                  v-model="$store.state.app.sidebar.open"
                  :theme="$store.state.app.theme"
                  :trigger="null"
                  :collapsible="false">
    <div class="logo">
      <a href="javascript:void(0)" @click="$router.push('/')">
        {{ $store.state.settings.title }}
      </a>
    </div>
    <a-menu
        mode="inline"
        :inline-collapsed="$store.state.app.sidebar.open"
        :theme="$store.state.app.theme"
        @openChange="onOpenChange"
        :selectedKeys="[this.$route.path]"
        :openKeys="openKeys"
    >
      <template v-for="item in list">
        <a-menu-item v-if="!item.children" :key="item.path">
          <router-link :to="item.path">
            <a-icon :type="item.meta.icon"/>
            <span>{{ item.meta.title }}</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else :key="item.path" v-bind="$props" v-on="$listeners">
          <span slot="title">
              <a-icon :type="item.meta.icon"/>
              <span>{{ item.meta.title }}</span>
          </span>
          <template v-for="item in item.children">
            <a-menu-item v-if="!item.children" :key="item.path">
              <router-link :to="item.path">
                <a-icon :type="item.meta.icon"/>
                <span>{{ item.meta.title }}</span>
              </router-link>
            </a-menu-item>
            <sub-menu v-else :key="item.path" :menu-info="item"/>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import {routerMap} from "@/router/routerMap";

export default {
  name: "GlobalSideMenu",
  data() {
    return {
      openKeys: [this.$route.path.substring(0, this.$route.path.substring(1).indexOf("/") + 1)],
      rootSubmenuKeys: routerMap.find(item => item.path === '/').children.map(item => item.path),
      cachedOpenKeys: []
    }
  },
  computed: {
    list() {
      return routerMap.find(item => item.path === '/').children
    },
    collapse() {
      return this.$store.state.app.sidebar.open
    }
  },
  watch: {
    collapse: function (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    menuSelected: function (val) {
      let rootChildren = routerMap.find(item => item.path === '/').children;
      let hasNoChildrenNodes = rootChildren.filter(item => item.children == null).map(item => item.path)
      if (hasNoChildrenNodes.includes(val)) {
        this.openKeys = []
      }
    }
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.side {
  border-right: 1px solid #e8e8e8;;
}

.ant-menu-inline {
  border-right: 0px
}

.logo {
  font-size: 20px;
  text-align: center;
  height: 40px;
  line-height: 40px;

  a {
    color: black;
  }

  a:hover {
    color: #1890ff
  }
}
</style>
