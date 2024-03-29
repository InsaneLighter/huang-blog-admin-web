<template>
  <a-modal v-model="modalVisible" :afterClose="onClose" :width="512" destroyOnClose :title="title">
    <a-form-model
      ref="categoryForm"
      :label-col="{ span: 4 }"
      :model="form.model"
      :rules="form.rules"
      :wrapper-col="{ span: 20 }"
      labelAlign="left"
    >
      <a-form-model-item help="* 页面上所显示的名称" label="名称：" prop="name">
        <a-input ref="nameInput" v-model="form.model.name" />
      </a-form-model-item>
      <a-form-model-item label="上级目录：" prop="parentId" v-if="!operate">
        <category-select-tree :categories="list.data" :categoryId.sync="form.model.parentId" />
      </a-form-model-item>
      <a-form-model-item label="描述：" prop="description">
        <a-input v-model="form.model.description" :autoSize="{ minRows: 3 }" type="textarea" />
      </a-form-model-item>
    </a-form-model>

    <template #footer>
      <ReactiveButton
        :errored="form.errored"
        :loading="form.saving"
        erroredText="保存失败"
        loadedText="保存成功"
        text="保存"
        type="primary"
        @callback="handleSavedCallback"
        @click="handleSave"
      ></ReactiveButton>
      <a-button @click="modalVisible = false">关闭</a-button>
    </template>
  </a-modal>
</template>
<script>
import CategorySelectTree from '@/components/category/CategorySelectTree'
import ReactiveButton from '@/components/tools/ReactiveButton'
import categoryApi from '@/api/category/index'

export default {
  name: 'CategoryCreate',
  components: {
    CategorySelectTree,
    ReactiveButton
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
    operate: {
      type: Boolean,
      default: false
    },
    record: {
      default: undefined
    }
  },
  data() {
    return {
      list: {
        data: [],
        loading: false
      },
      form: {
        model: {},
        saving: false,
        errored: false,
        rules: {
          name: [
            { required: true, message: '* 分类名称不能为空', trigger: ['change'] },
            { max: 255, message: '* 分类名称的字符长度不能超过 255', trigger: ['change'] }
          ],
          parentId: [
            { required: true, message: '* 父分类不能为空', trigger: ['change'] }
          ],
          description: [{ max: 100, message: '* 分类描述的字符长度不能超过 100', trigger: ['change'] }]
        }
      }
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
  created() {
    this.handleListCategories()
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.nameInput.focus()
        })

        if (this.title === '编辑分类') {
          this.form.model = JSON.parse(this.record)
        }
      }
    }
  },
  methods: {
    async handleListCategories() {
      try {
        this.list.loading = true
        const response = await categoryApi.queryAllTree()
        this.list.data = response.data.list
      } catch (e) {
        this.$message.error('Failed to get categories', e)
      } finally {
        this.list.loading = false
      }
    },
    handleCreate() {
      let flag = true
      this.$refs.categoryForm.validate(async valid => {
        if (valid) {
          try {
            this.form.saving = true
            await categoryApi.queryByName(this.form.model.name).then(response => {
              if (response.code === 1) {
                if (response.category) {
                  this.$message.warning("存在相同分类名称！")
                  this.form.errored = true
                  flag = false
                }
              }else {
                this.$message.error(response.msg)
              }
            }).then(response => {
              if(flag){
                categoryApi.add(this.form.model).then(response => {
                  if (response.code === 1) {
                    this.$message.success('新增分类成功！')
                  } else {
                    this.$message.error(response.msg)
                  }
                })
              }
            })
          } catch (e) {
            this.form.errored = true
            this.$message.error('Failed to create category', e)
          } finally {
            setTimeout(() => {
              this.form.saving = false
            }, 400)
          }
        }
      })
    },
    handleSavedCallback() {
      if (this.form.errored) {
        this.form.errored = false
      } else {
        this.form.model = {}
        this.modalVisible = false
        this.handleListCategories()
      }
    },
    onClose() {
      this.$emit('close')
      this.form.model = {}
    },
    handleSave(){
      switch (this.title) {
        case '新增分类':
          this.handleCreate()
          break
        case '编辑分类':
          this.handleEdit()
          break
        case '添加子分类':
          this.handleAddSub()
      }
    },
    handleEdit(){
      let flag = true
      this.$refs.categoryForm.validate(async valid => {
        if (valid) {
          try {
            this.form.saving = true
            await categoryApi.queryByName(this.form.model.name).then(response => {
              if (response.code === 1) {
                if (response.category) {
                  this.$message.warning("存在相同分类名称！")
                  this.form.errored = true
                  flag = false
                }
              }else {
                this.$message.error(response.msg)
              }
            }).then(response => {
              if(flag){
                categoryApi.edit(this.form.model).then(response => {
                  if (response.code === 1) {
                    this.$message.success('修改分类成功！')
                  } else {
                    this.$message.error(response.msg)
                  }
                })
              }
            })
          } catch (e) {
            this.form.errored = true
            this.$message.error('Failed to create category', e)
          } finally {
            setTimeout(() => {
              this.form.saving = false
            }, 400)
          }
        }
      })
    },
    handleAddSub(){
      this.form.model.parentId = this.record.id
      this.handleCreate()
    }
  }
}
</script>
