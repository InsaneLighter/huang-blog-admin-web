<template>
  <div style="padding: 1rem">
    <a-form-model
        ref="formRef"
        :model="email.model"
        :rules="email.rules"
        :labelAlign="'left'"
        :label-col="{ span: 2}"
        :wrapper-col="{ span: 10 }"
    >
      <a-form-model-item
          label="收件人"
          name="tos"
          prop="tos"
      >
        <a-input v-model:value="email.model.tos" placeholder="多个收件人邮箱以英文逗号分隔"/>
      </a-form-model-item>
      <a-form-model-item
          label="邮件主题"
          name="subject"
          prop="subject"
      >
        <a-input v-model:value="email.model.subject" placeholder="请输入邮件主题"/>
      </a-form-model-item>

      <html-editor :htmlContent.sync="email.model.content" style="margin-bottom: .5rem"></html-editor>
      <a-form-model-item label="发送时间" name="sentDate">
        <a-date-picker
            v-model:value="email.model.sentDate"
            show-time
            placeholder="发送时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-model-item>
      <ReactiveButton
          :errored="email.errored"
          :loading="email.saving"
          erroredText="发送失败"
          loadedText="发送成功"
          text="发送"
          @callback="handleSendCallback()"
          @click="handleSendMail()"
      ></ReactiveButton>
    </a-form-model>
  </div>
</template>

<script>
import HtmlEditor from "@/components/tools/Editor";
import {sendEmail} from "@/api/email/index";
import ReactiveButton from "@/components/tools/ReactiveButton";

export default {
  name: "SendMail",
  components: {
    HtmlEditor,
    ReactiveButton
  },
  data() {
    return {
      email: {
        model: {},
        saving: false,
        errored: false,
        rules: {
          tos: [
            {
              required: true,
              message: '收件人不能为空！',
              trigger: ['blur']
            },
            {
              pattern: new RegExp(
                  /^((([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6},))*(([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})))$/
              ),
              message: '邮件格式错误',
              trigger: ['change']
            }
          ],
          subject: [
            {required: true, max: 100, message: '邮件主题不能为空！', trigger: ['blur']},
          ]
        }
      }
    }
  },
  methods: {
    handleSendMail() {
      const _this = this
      _this.$refs.formRef.validate(valid => {
        if (valid) {
          if (!this.email.model.content || this.email.model.content.trim().length === 0) {
            this.$message.warn("邮件内容为空！")
            return
          }
          this.email.saving = true
          sendEmail(this.email.model)
              .then(response => {
                if (response.code === 1) {
                  this.$message.success('邮件发送成功！')
                  this.email.model = {}
                } else {
                  this.$message.error(response.msg)
                }
              })
              .catch(() => {
                this.email.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  this.email.saving = false
                }, 400)
              })
        }
      })
    },
    handleSendCallback() {
      if (this.email.errored) {
        this.email.errored = false
      }
    }
  }
}
</script>

<style scoped>
/deep/ .ant-form-item-label {
  margin-right: -4rem !important;
}
</style>
