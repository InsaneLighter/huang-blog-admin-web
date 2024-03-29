<template>
  <div style="padding: 1rem">
    <a-row :gutter="12">
      <a-col :lg="10" :md="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
          <div class="mb-6 text-center"  style="min-height: 176px">
            <a-tooltip :trigger="['hover']" placement="right" title="点击可修改头像">
              <a-avatar
                  :size="104"
                  :src="userForm.model.avatar? userForm.model.avatar : '//cn.gravatar.com/avatar/?s=256&d=mm'"
                  class="cursor-pointer"
                  @click="handleOpenUpdateAvatarForm"
              />
            </a-tooltip>
            <div id="name" style="color: rgba(0, 0, 0, 0.85)">
              {{ userForm.model.username }}
            </div>
            <div>{{ userForm.model.description }}</div>
          </div>
          <div>
            <p class="mb-3">
              <a-icon class="mr-3" type="mail"/>
              {{ userForm.model.email || '--'}}
            </p>
            <p class="mb-3">
              <a-icon class="mr-3" type="calendar"/>
              {{ statistics.data.establishDays || 0 }} 天
            </p>
          </div>
          <a-divider/>
          <div style="margin-top: 2.5rem">
            <a-list :loading="statistics.loading" itemLayout="horizontal">
              <a-list-item>累计发表了 {{ statistics.data.postCount || 0 }} 篇文章。</a-list-item>
              <a-list-item>累计发表了 {{ statistics.data.journalCount || 0 }} 篇日记。</a-list-item>
              <a-list-item>累计创建了 {{ statistics.data.categoryCount || 0 }} 个分类。</a-list-item>
              <a-list-item>累计创建了 {{ statistics.data.tagCount || 0 }} 个标签。</a-list-item>
              <a-list-item></a-list-item>
            </a-list>
          </div>
        </a-card>
      </a-col>
      <a-col :lg="14" :md="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '0' }" :bordered="false" title="个人资料">
          <div class="card-container">
            <a-tabs type="card">
              <a-tab-pane key="1">
                <span slot="tab"> <a-icon type="idcard"/>基本资料 </span>
                <a-form-model
                    ref="userForm"
                    :model="userForm.model"
                    :rules="userForm.rules"
                    :wrapperCol="{
                    xl: { span: 15 },
                    lg: { span: 15 },
                    sm: { span: 15 },
                    xs: { span: 24 }
                  }"
                    layout="vertical"
                >
                  <a-form-model-item label="用户名：" prop="username">
                    <a-input v-model="userForm.model.username"/>
                  </a-form-model-item>
                  <a-form-model-item label="电子邮箱：" prop="email">
                    <a-input v-model="userForm.model.email"/>
                  </a-form-model-item>
                  <a-form-model-item label="个人签名：" prop="description">
                    <a-input v-model="userForm.model.description" :autoSize="{ minRows: 5 }" type="textarea"/>
                  </a-form-model-item>
                  <a-form-model-item>
                    <ReactiveButton
                        :errored="userForm.errored"
                        :loading="userForm.saving"
                        erroredText="保存失败"
                        loadedText="保存成功"
                        text="保存"
                        type="primary"
                        @callback="handleUpdatedProfileCallback"
                        @click="handleUpdateProfile"
                    ></ReactiveButton>
                  </a-form-model-item>
                </a-form-model>
              </a-tab-pane>
              <a-tab-pane key="2">
                <span slot="tab"> <a-icon type="lock"/>密码 </span>
                <a-form-model
                    ref="passwordForm"
                    :model="passwordForm.model"
                    :rules="passwordForm.rules"
                    :wrapperCol="{
                    xl: { span: 15 },
                    lg: { span: 15 },
                    sm: { span: 15 },
                    xs: { span: 24 }
                  }"
                    style="min-height: 430px;"
                    layout="vertical"
                >
                  <a-form-model-item label="原密码：" prop="oldPassword">
                    <a-input-password v-model="passwordForm.model.oldPassword" autocomplete="new-password"/>
                  </a-form-model-item>
                  <a-form-model-item label="新密码：" prop="newPassword">
                    <a-input-password v-model="passwordForm.model.newPassword" autocomplete="new-password"/>
                  </a-form-model-item>
                  <a-form-model-item label="确认密码：" prop="confirmPassword">
                    <a-input-password v-model="passwordForm.model.confirmPassword" autocomplete="new-password"/>
                  </a-form-model-item>
                  <a-form-model-item>
                    <ReactiveButton
                        :errored="passwordForm.errored"
                        :loading="passwordForm.saving"
                        erroredText="更改失败"
                        loadedText="更改成功"
                        text="确认更改"
                        type="primary"
                        @callback="handleUpdatedPasswordCallback"
                        @click="handleUpdatePassword"
                    ></ReactiveButton>
                  </a-form-model-item>
                </a-form-model>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-modal v-model="updateAvatarForm.visible" title="修改头像">
      <a-form layout="vertical">
        <a-form-item label="头像链接：">
          <AttachmentInput ref="avatarInput" v-model="updateAvatarForm.avatar"/>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button type="primary" @click="handleUpdateAvatar">确定</a-button>
        <a-button @click="updateAvatarForm.visible = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import ReactiveButton from "@/components/tools/ReactiveButton";
import AttachmentInput from "@/components/tools/AttachmentInput";
import userApi from '@/api/user/index'
import {encrypt} from "@/utils/rsaEncrypt";

export default {
  name: 'Profile',
  components: {
    ReactiveButton,
    AttachmentInput
  },
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value && this.passwordForm.model.newPassword !== value) {
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      attachmentSelect: {
        visible: false
      },
      updateAvatarForm: {
        avatar: undefined,
        visible: false,
        saving: false,
        saveErrored: false
      },
      userForm: {
        model: {},
        saving: false,
        errored: false,
        rules: {
          username: [
            {required: true, message: '* 用户名不能为空', trigger: ['change']},
            {max: 50, message: '* 用户名的字符长度不能超过 50', trigger: ['change']}
          ],
          email: [
            {required: true, message: '* 电子邮箱地址不能为空', trigger: ['change']},
            {type: 'email', message: '* 电子邮箱地址格式不正确', trigger: ['change']},
            {max: 127, message: '* 电子邮箱的字符长度不能超过 255', trigger: ['change']}
          ],
          description: [{max: 1023, message: '* 个人签名的字符长度不能超过 1023', trigger: ['change']}]
        }
      },
      statistics: {
        data: {},
        loading: false
      },
      passwordForm: {
        model: {
          oldPassword: null,
          newPassword: null,
          confirmPassword: null
        },
        saving: false,
        errored: false,
        rules: {
          oldPassword: [
            {required: true, message: '* 原密码不能为空', trigger: ['change']},
            {max: 100, min: 8, message: '* 密码的字符长度必须在 8 - 100 之间', trigger: ['blur']}
          ],
          newPassword: [
            {required: true, message: '* 新密码不能为空', trigger: ['change']},
            {max: 100, min: 8, message: '* 密码的字符长度必须在 8 - 100 之间', trigger: ['change']}
          ],
          confirmPassword: [
            {required: true, message: '* 确认密码不能为空', trigger: ['change']},
            {validator: validateConfirmPassword, trigger: ['change']}
          ]
        }
      }
    }
  },
  created() {
    this.handleLoadStatistics()
  },
  methods: {
    handleLoadStatistics() {
      this.statistics.loading = true
      userApi.getCurrentUser()
          .then(response => {
            if (response.code === 1) {
              this.userForm.model = response.data.user
              this.passwordForm.model.id = response.data.user.id
              this.statistics.data = response.data.statistics
            } else {
              this.$message.error(response.msg)
            }
          })
          .finally(() => {
            this.statistics.loading = false
          })
    },
    handleUpdatePassword() {
      const _this = this
      _this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.passwordForm.saving = true
          const pwdParam = {
            id: this.passwordForm.model.id,
            newPassword: encrypt(this.passwordForm.model.newPassword),
            oldPassword: encrypt(this.passwordForm.model.oldPassword)
          }
          userApi.updatePwd(pwdParam)
              .then(response => {
                if (response.code === 1) {
                  this.$message.success('密码修改成功！')
                  this.handleLoadStatistics()
                } else {
                  this.$message.error(response.msg)
                }
              })
              .catch(() => {
                this.passwordForm.errored = true
                this.passwordForm.saving = false
              })
              .finally(() => {
                setTimeout(() => {
                  this.passwordForm.saving = false
                }, 400)
              })
        }
      })
    },
    handleUpdatedPasswordCallback() {
      if (this.passwordForm.errored) {
        this.passwordForm.errored = false
      } else {
        this.passwordForm.model.oldPassword = null
        this.passwordForm.model.newPassword = null
        this.passwordForm.model.confirmPassword = null
      }
    },
    handleUpdateProfile() {
      const _this = this
      _this.$refs.userForm.validate(valid => {
        if (valid) {
          this.userForm.saving = true
          userApi.edit(this.userForm.model)
              .then(response => {
                if (response.code === 1) {
                  this.$store.dispatch('user/setUser', this.userForm.model);
                  this.$message.success('用户信息修改成功！')
                  this.handleLoadStatistics()
                } else {
                  this.$message.error(response.msg)
                }
              })
              .catch(() => {
                this.userForm.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  this.userForm.saving = false
                }, 400)
              })
        }
      })
    },
    handleUpdatedProfileCallback() {
      if (this.userForm.errored) {
        this.userForm.errored = false
      }
    },
    handleOpenUpdateAvatarForm() {
      this.updateAvatarForm.avatar = this.userForm.model.avatar
      this.updateAvatarForm.visible = true
      this.$nextTick(() => {
        this.$refs.avatarInput.focus()
      })
    },
    handleUpdateAvatar() {
      this.userForm.model.avatar = this.updateAvatarForm.avatar
      this.updateAvatarForm.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
#name {
  margin-top: 1rem;
  margin-bottom: .25rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 500;
}
/deep/ .card-container {
  background: #fafafa
}

/deep/ .card-container > .ant-tabs-card > .ant-tabs-content {
  margin-top: -16px
}

/deep/ .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px
}

/deep/ .card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff
}

/deep/ .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border: none !important;
  margin-right: 0 !important;
  background: #fafafa !important;
}

/deep/.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff !important;
  background: #fff !important;
}

</style>
