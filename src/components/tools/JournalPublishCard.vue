<template>
  <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
    <template #title>
      速记
      <a-tooltip title="内容将保存到日记中">
        <router-link :to="{ name: 'Journal' }" style="color: inherit">
          <a-icon class="cursor-pointer hover:text-blue-400 transition-all" type="info-circle-o" />
        </router-link>
      </a-tooltip>
    </template>
    <a-form-model ref="journalForm"
                  :model="form.model"
                  :rules="form.rules"
                  layout="vertical">
      <a-form-model-item prop="content">
        <a-input
          v-model="form.model.content"
          :autoSize="{ minRows: 8,maxRows: 8 }"
          placeholder="写点什么吧..."
          type="textarea"
        />
      </a-form-model-item>
      <a-form-model-item>
        <ReactiveButton
          :errored="form.errored"
          :loading="form.saving"
          erroredText="发布失败"
          loadedText="发布成功"
          text="发布"
          @callback="
            () => {
              if (!form.errored) form.model = {}
              form.errored = false
            }
          "
          @click="handleCreateJournalClick"
        ></ReactiveButton>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>
<script>
import journalApi from '@/api/journal/index'
import ReactiveButton from "./ReactiveButton";
export default {
  name: 'JournalPublishCard',
  components: {
    ReactiveButton
  },
  data() {
    return {
      form: {
        model: {},
        rules: {
          content: [
            { required: true, message: '* 内容不能为空', trigger: ['change'] },
            { max: 255, message: '* 内容的字符长度不能超过 255', trigger: ['change'] }]
        },
        saving: false,
        errored: false
      }
    }
  },
  methods: {
    handleCreateJournalClick() {
      const _this = this
      this.$refs.journalForm.validate(valid => {
        if (valid) {
          _this.form.saving = true
          _this.form.model.mood = 'Sunny'
          _this.form.model.content = '<p>'+_this.form.model.content+'</p>'
          journalApi.add(_this.form.model)
              .then(response => {
                if(response.code === 1){
                  _this.$message.success('发表成功！')
                }else {
                  _this.$message.error(response.msg)
                }
              })
              .catch(() => {
                _this.form.saveErrored = true
              })
              .finally(() => {
                setTimeout(() => {
                  _this.form.saving = false
                }, 400)
              })
        }
      })
    }
  }
}
</script>
