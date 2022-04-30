<template>
  <a-drawer
      :title="title"
      :maskClosable="true"
      :width="drawerWidth"
      placement="right"
      :closable="true"
      @close="handleCancel"
      :visible="visible"
      style="height: 100%;">
    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="username">
          <a-input placeholder="请输入用户名" v-model="model.username" :readOnly="!!model.id"/>
        </a-form-model-item>

        <template v-if="!model.id">
          <a-form-model-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="password">
            <a-input type="password" placeholder="请输入密码" v-model="model.password"/>
          </a-form-model-item>

          <a-form-model-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="confirmpassword">
            <a-input type="password" @blur="handleConfirmBlur" placeholder="请重新输入登录密码" v-model="model.confirmpassword"/>
          </a-form-model-item>
        </template>

        <a-form-model-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <image-upload class="avatar-uploader" text="上传" v-model="model.avatar"></image-upload>
        </a-form-model-item>

        <a-form-model-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
              style="width: 100%"
              placeholder="请选择生日"
              v-model="model.birthday"
              :format="dateFormat"
              :getCalendarContainer="node => node.parentNode"/>
        </a-form-model-item>

        <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-model="model.gender" placeholder="请选择性别" :getPopupContainer="(target) => target.parentNode">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">
          <a-input placeholder="请输入邮箱" v-model="model.email"/>
        </a-form-model-item>

        <a-form-model-item label="个人签名：" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">
          <a-input placeholder="请输入个人签名" v-model="model.description" :autoSize="{ minRows: 5 }" type="textarea"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import ImageUpload from "@/components/tools/ImageUpload";
import userApi from '@/api/user/index'
import {encrypt} from "@/utils/rsaEncrypt";

export default {
  name: "User",
  components: {
    ImageUpload
  },
  data() {
    return {
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      userId: "", //保存用户id
      disableSubmit: false,
      dateFormat: "YYYY-MM-DD",
      validatorRules: {
        username: [
          {required: true, message: '* 用户名不能为空', trigger: ['change']},
          {max: 50, message: '* 用户名的字符长度不能超过 50', trigger: ['change']}
        ],
        password: [{required: true, message: '* 原密码不能为空', trigger: ['change']},
          {max: 100, min: 8, message: '* 密码的字符长度必须在 8 - 100 之间', trigger: ['blur']},
          {validator: this.validateToNextPassword, trigger: 'change'}],
        confirmpassword: [{required: true, message: '请重新输入登录密码!',},
          {validator: this.compareToFirstPassword,}],
        email: [
          {required: true, message: '* 电子邮箱地址不能为空', trigger: ['change']},
          {type: 'email', message: '* 电子邮箱地址格式不正确', trigger: ['change']},
          {max: 127, message: '* 电子邮箱的字符长度不能超过 255', trigger: ['change']}
        ],
        description: [{max: 1023, message: '* 个人签名的字符长度不能超过 1023', trigger: ['change']}]
      },
      title: "操作",
      visible: false,
      model: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      uploadLoading: false,
      confirmLoading: false,
      headers: {},
      url: {
        fileUpload: "/api/attachment/upload"
      },
    }
  },
  created() {
  },
  computed: {
    uploadAction: function () {
      return this.url.fileUpload;
    }
  },
  methods: {
    add() {
      this.refresh();
      this.edit();
    },
    edit(record) {
      let that = this;
      that.visible = true;
      //根据屏幕宽度自适应抽屉宽度
      this.resetScreenSize();
      if (record && record.id) {
        that.userId = record.id;
      }
      that.model = Object.assign({}, record);
    },
    //窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth;
      } else {
        this.modalWidth = 800;
      }
      this.modaltoggleFlag = !this.modaltoggleFlag;
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth;
      } else {
        this.drawerWidth = 700;
      }
    },
    refresh() {
      this.userId = ""
    },
    close() {
      this.$emit('close');
      this.visible = false;
      this.disableSubmit = false;
      this.departIdShow = false;
      this.$refs.form.resetFields();
    },
    moment,
    handleSubmit() {
      const that = this;
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
          let obj;
          if (!this.model.id) {
            this.model.id = this.userId;
            this.model.status = 0
            this.model.password = encrypt(this.model.password)
            obj = userApi.add(this.model);
          } else {
            obj = userApi.edit(this.model);
          }
          obj.then((res) => {
            if (res.code === 1) {
              if (this.model.id) {
                that.$message.success('修改成功！');
              } else {
                that.$message.success('保存成功！');
              }
              that.$emit('ok');
            } else {
              that.$message.error(res.msg);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })
        } else {
          return false;
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateToNextPassword(rule, value, callback) {
      const confirmpassword = this.model.confirmpassword;
      if (value && confirmpassword && value !== confirmpassword) {
        callback('两次输入的密码不一样！');
      }
      if (value && this.confirmDirty) {
        this.$refs.form.validateField(['confirmpassword']);
      }
      callback();
    },
    compareToFirstPassword(rule, value, callback) {
      if (value && value !== this.model.password) {
        callback('两次输入的密码不一样！');
      } else {
        callback()
      }
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value
    }
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}

.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}

/deep/ .ant-drawer-body {
  padding-bottom: 53px;
}

</style>
