<template>
  <a-modal v-model="modalVisible" :afterClose="onClose" destroyOnClose :title="title" :width="820">
    <template #footer>
      <ReactiveButton
          :errored="form.saveErrored"
          :loading="form.saving"
          erroredText="发布失败"
          loadedText="发布成功"
          text="发布"
          type="primary"
          @callback="handleSaveOrUpdateCallback"
          @click="handleSaveOrUpdate"
      ></ReactiveButton>
    </template>

    <a-form-model ref="journalForm"
                  :model="form.model"
                  :rules="form.rules"
                  labelAlign="left">
      <a-form-model-item label="心情："
                         prop="mood"
                         :label-col="{ span: 2 }"
                         :wrapper-col="{ span: 20 }">
        <a-select
            ref="select"
            v-model:value="form.model.mood"
            style="width: 300px"
        >
          <a-select-option v-for="item in moodList" :key="item.mood" :value="item.mood">{{item.description}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item prop="content">
        <div id="editor" style="height: 520px">
          <html-editor
              v-if="modalVisible"
              :htmlContent.sync="form.model.content"/>
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import journalApi from '@/api/journal/index'
import ReactiveButton from "@/components/tools/ReactiveButton";
import HtmlEditor from "@/components/tools/Editor";

export default {
  name: "JournalCreate",
  components: {
    ReactiveButton,
    HtmlEditor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    record: {
      default: undefined
    }
  },
  data(){
    return {
      form: {
        model: {
          mood: 'Sunny'
        },
        saving: false,
        errored: false,
        rules: {
          content: [{ required: true, message: '* 内容不能为空', trigger: [] }]
        }
      },
      moodList: [
        {
          mood: 'Sunny',
          description: '开心哦'
        },
        {
          mood: 'Headset',
          description: '听音乐中'
        },
        {
          mood: 'ForkSpoon',
          description: '吃饭中'
        },
        {
          mood: 'CoffeeCup',
          description: '喝咖啡哦'
        },
        {
          mood: 'ShoppingCart',
          description: '买买买'
        },
        {
          mood: 'Moon',
          description: '晚安'
        }
      ],
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    modalVisible(value) {
      if (value) {
        if (this.title === '编辑日记') {
          this.form.model = JSON.parse(this.record)
        }else {
          this.form.model.mood = 'Sunny'
        }
      }
    },
    visible(value){
      if (value) {
        if (this.title === '编辑日记') {
          this.form.model = JSON.parse(this.record)
        }else {
          this.form.model.mood = 'Sunny'
        }
      }
    }
  },
  methods: {
    handleSaveOrUpdate(){
      const _this = this
      _this.$refs.journalForm.validate(valid => {
        if (valid) {
          _this.form.saving = true
          if (_this.form.model.id) {
            journalApi.edit(_this.form.model)
                .then(response => {
                  if(response.code === 1){
                    _this.$message.success('修改成功！')
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
          } else {
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
        }
      })
    },
    handleSaveOrUpdateCallback(){
      if (this.form.saveErrored) {
        this.form.saveErrored = false
      } else {
        this.modalVisible = false
      }
    },
    onClose() {
      this.$emit('close')
      this.form.model = {}
    },
  }
}
</script>

<style scoped>

</style>
