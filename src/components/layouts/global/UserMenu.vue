<template>
  <div class="user-wrapper">
    <header-comment class="action" />
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar :src="user.avatar? user.avatar : Avatar" class="avatar" size="small"/>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link :to="{ name: 'Profile' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1" @click="handleLogout">
          <a-icon type="logout" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/assets/images/avatar.jpg'
import HeaderComment from "./HeaderComment";
import {logout} from "@/api/login";
import {removeToken} from "@/utils/auth";
export default {
  name: "UserMenu",
  components: {
    HeaderComment
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
  },
  data(){
    return {
      Avatar: Avatar
    }
  },
  methods: {
    handleLogout() {
      logout().then(response => {
        if(response.code === 1){
          removeToken()
          location.reload()
        }else {
          this.$message.error(response.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-wrapper {
  float: right;
  height: 100%;

  .action {
    cursor: pointer;
    padding: 0 18px;
    display: inline-block;
    transition: all 0.3s;
    height: 100%;
    color: rgba(0, 0, 0, 0.65);

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    .avatar {
      margin: 20px 0 20px 0;
      color: #1890ff;
      background: hsla(0, 0%, 100%, 0.85);
      vertical-align: middle;
    }

    .icon {
      font-size: 16px;
      padding: 4px;
    }
  }
}

.user-dropdown-menu-wrapper.ant-dropdown-menu {
  padding: 4px 0;

  .ant-dropdown-menu-item {
    width: 160px;
  }

  .ant-dropdown-menu-item > .anticon:first-child,
  .ant-dropdown-menu-item > a > .anticon:first-child,
  .ant-dropdown-menu-submenu-title > .anticon:first-child .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
    min-width: 12px;
    margin-right: 8px;
  }
}
</style>
