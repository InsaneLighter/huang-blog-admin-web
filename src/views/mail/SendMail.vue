<template>
  <div style="padding: 1rem">
    <a-form-model
        ref="formRef"
        :model="email.model"
        :rules="email.rules"
        :label-col="{ span: 1 }"
        :wrapper-col="{ span: 10 }"
    >
      <a-form-model-item
          label="收件人"
          name="tos"
      >
        <a-input v-model:value="email.model.tos" placeholder="多个收件人邮箱以英文逗号分隔"/>
      </a-form-model-item>
      <a-form-model-item
          label="邮件主题"
          name="subject"
      >
        <a-input v-model:value="email.model.subject" placeholder="请输入邮件主题"/>
      </a-form-model-item>

      <html-editor style="margin-bottom: .5rem"></html-editor>

      <a-form-model-item label="发送时间" name="sendDate">
        <a-date-picker
            v-model:value="email.model.sendDate"
            show-time
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
import {sendEmail} from "@/api/common";
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
            { required: true, message: '收件人不能为空！',trigger: ['blur']}
          ],
          subject: [
            {required: true, message: '邮件主题不能为空！', trigger: ['blur']}
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
    },
  }
}
</script>

<style scoped>

</style>
