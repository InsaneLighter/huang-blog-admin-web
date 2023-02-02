<template>
  <a-modal
      v-model="modalVisible"
      :afterClose="onClosed"
      :bodyStyle="{ padding: 0 }"
      :maskClosable="false"
      :width="680"
      destroyOnClose
      class="modal"
  >
    <template #title>
      {{ modalTitle }}
      <a-icon v-if="loading" type="loading"/>
    </template>

    <div class="card-container">
      <a-form :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              labelAlign="left"
      >
        <a-form-item label="文章标题">
          <a-input v-model="form.model.title"/>
        </a-form-item>
        <a-form-item label="分类">
          <a-space direction="vertical">
            <category-tree ref="categoryTree"
                           v-model="form.model.categoryIds"/>
            <a-button type="dashed" @click="categoryCreateModalVisible = true">新增</a-button>
          </a-space>
        </a-form-item>
        <a-form-item label="标签">
          <TagSelect v-model="form.model.tagIds"/>
        </a-form-item>
        <a-form-item label="摘要">
          <a-input
              v-model="form.model.summary"
              :autoSize="{ minRows: 5 }"
              placeholder="如不填写，会从文章中自动截取"
              type="textarea"
          />
        </a-form-item>
        <a-form-item label="封面">
          <a-upload
              :customRequest="handleUpload"
              list-type="picture-card"
              :autoSize="{ minRows: 5 }"
              :file-list="fileList"
              :remove="deleteFileItem"
              @change="handleChange"
              @preview="handlePreview"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage"/>
          </a-modal>
        </a-form-item>
        <a-form-item label="是否置顶">
          <a-switch v-model="topPriority"/>
        </a-form-item>
        <a-form-item label="发表时间：">
          <a-date-picker
              :defaultValue="createTimeDefaultValue"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择文章发表时间"
              showTime
              @change="onCreateTimeSelect"
              @ok="onCreateTimeSelect"
          />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <slot name="extraFooter"/>
      <ReactiveButton
          v-if="draftSaveVisible"
          :errored="form.draftSaveErrored"
          :loading="form.draftSaving"
          :text="`${hasId ? '转为' : '保存'}草稿`"
          erroredText="保存失败"
          loadedText="保存成功"
          type="danger"
          @callback="handleSavedCallback()"
          @click="handleSaveDraft()"
      ></ReactiveButton>
      <ReactiveButton
          v-if="publishVisible"
          :errored="form.publishErrored"
          :loading="form.publishing"
          erroredText="发布失败"
          loadedText="发布成功"
          text="转为发布"
          @callback="handleSavedCallback()"
          @click="handlePublish()"
      ></ReactiveButton>
      <ReactiveButton
          :errored="form.saveErrored"
          :erroredText="`${hasId ? '保存' : '发布'}失败`"
          :loadedText="`${hasId ? '保存' : '发布'}成功`"
          :loading="form.saving"
          :text="`${hasId ? '保存' : '发布'}`"
          @callback="handleSavedCallback()"
          @click="handleSave()"
      ></ReactiveButton>
      <a-button :disabled="loading" @click="modalVisible = false">关闭</a-button>
    </template>

    <CategoryCreate :visible.sync="categoryCreateModalVisible"
                    :title="'新增分类'"
                    @close="onCategoryCreateModalClose"/>
  </a-modal>
</template>
<script>
// components
import ReactiveButton from '@/components/tools/ReactiveButton'
import TagSelect from '@/components/tools/TagSelect'
import CategoryTree from '@/components/category/CategoryTree'
import CategoryCreate from '@/components/category/CategoryCreate'

// libs
import {datetimeFormat} from '@/utils/datetime'

import contentApi from '@/api/content/index'
import attachmentApi from '@/api/attachment/index'

export default {
  name: 'PostSetting',
  components: {
    ReactiveButton,
    TagSelect,
    CategoryTree,
    CategoryCreate
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    post: {
      type: Object,
      default: () => ({})
    },
    savedCallback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      postStatuses: {
        PUBLISHED: {
          value: 'PUBLISHED',
          color: 'green',
          status: 'success',
          text: '已发布'
        },
        DRAFT: {
          value: 'DRAFT',
          color: 'yellow',
          status: 'warning',
          text: '草稿'
        },
        RECYCLE: {
          value: 'RECYCLE',
          color: 'red',
          status: 'error',
          text: '待回收'
        }
      },
      form: {
        model: {},
        saving: false,
        saveErrored: false,
        draftSaving: false,
        draftSaveErrored: false,
        publishing: false,
        publishErrored: false
      },
      templates: [],
      attachmentSelectVisible: false,
      categoryCreateModalVisible: false,
      previewVisible: false,
      previewImage: '',
      fileList: []
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
    },
    modalTitle() {
      return this.form.model.id ? '文章设置' : '文章发布'
    },
    createTimeDefaultValue() {
      if (this.form.model.createTime) {
        const date = new Date(this.form.model.createTime)
        return datetimeFormat(date, 'YYYY-MM-DD HH:mm:ss')
      }
      this.form.model.createTime = datetimeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
      return this.form.model.createTime
    },
    topPriority: {
      get() {
        if (this.form.model.topPriority === undefined) {
          return false
        }
        return this.form.model.topPriority !== 0
      },
      set(value) {
        this.$set(this.form.model, 'topPriority', value ? 1 : 0)
      }
    },
    hasId() {
      return !!this.form.model.id
    },
    draftSaveVisible() {
      const {draftSaving, publishing} = this.form
      return (this.form.model.status !== this.postStatuses.DRAFT.value || !this.hasId || draftSaving) && !publishing
    },
    publishVisible() {
      const {draftSaving, publishing} = this.form
      return ((this.form.model.status === this.postStatuses.DRAFT.value && this.hasId) || publishing) && !draftSaving
    }
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.form.model = Object.assign({}, this.post)
      }
    },
    post: {
      deep: true,
      handler(value) {
        this.form.model = Object.assign({}, value)
        if (this.form.model.cover) {
          this.fileList = [{
            name: "temp.jpg",
            status: "done",
            uid: "2022-02-12",
            url: this.form.model.cover
          }]
        }
      }
    }
  },
  methods: {
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    /**
     * Creates or updates a post
     */
    async handleCreateOrUpdate() {
      if (!this.form.model.title) {
        this.$notification['error']({
          message: '提示',
          duration: 1,
          description: '文章标题不能为空！'
        })
        throw new Error('文章标题不能为空！')
      }
      try {
        if (this.hasId) {
          await contentApi.update(this.form.model)
        } else {
          await contentApi.add(this.form.model)
        }
      } catch (error) {
        this.$message.error(error)
        throw new Error(error)
      }
    },

    async handleSave() {
      try {
        this.form.saving = true
        const {status} = this.form.model
        if (!status) {
          this.form.model.status = this.postStatuses.PUBLISHED.value
        }

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.saveErrored = true
      } finally {
        setTimeout(() => {
          this.form.saving = false
        }, 400)
      }
    },

    async handlePublish() {
      try {
        this.form.publishing = true
        this.form.model.status = this.postStatuses.PUBLISHED.value

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.publishErrored = true
      } finally {
        setTimeout(() => {
          this.form.publishing = false
        }, 400)
      }
    },

    async handleSaveDraft() {
      try {
        this.form.draftSaving = true
        this.form.model.status = this.postStatuses.DRAFT.value

        await this.handleCreateOrUpdate()
      } catch (e) {
        this.form.draftSaveErrored = true
      } finally {
        setTimeout(() => {
          this.form.draftSaving = false
        }, 400)
      }
    },

    /**
     * Handle saved callback event
     */
    handleSavedCallback() {
      if (this.form.saveErrored || this.form.draftSaveErrored || this.form.publishErrored) {
        this.form.saveErrored = false
        this.form.draftSaveErrored = false
        this.form.publishErrored = false
      } else {
        this.savedCallback && this.savedCallback()
        this.modalVisible = false
      }
    },

    /**
     * Handle create time selected event
     */
    onCreateTimeSelect(value) {
      this.form.model.createTime = value.valueOf()
    },

    /**
     * Select post thumbnail
     * @param data
     */
    handleSelectPostThumbnail({raw}) {
      if (raw.length) {
        this.form.model.thumbnail = encodeURI(raw[0].path)
      }
      this.attachmentSelectVisible = false
    },

    /**
     * Handle modal close event
     */
    onClosed() {
      this.$emit('onClose')
      this.$emit('onUpdate', this.form.model)
    },

    onCategoryCreateModalClose() {
      this.$refs.categoryTree.handleListCategories()
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = (await this.getBase64(file.originFileObj));
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange(newFileList) {
      this.fileList = newFileList.fileList;
      console.log(this.fileList)
    },
    handleUpload(info) {
      attachmentApi.uploadAction(info.file).then(res => {
            if (res.code === 1) {
              this.fileList[0].status = "done"
              this.form.model.cover = res.data.path
              console.log(this.fileList)
              this.$message.success("封面上传成功!")
            } else {
              this.fileList[0].status = "error"
              this.$message.error("封面上传失败!")
            }
          }
      ).catch(error => {
        this.$message.error(error)
      })
    },
    deleteFileItem(file) {
      //找到当前文件所在列表的索引
      let index = this.fileList.indexOf(file);
      //从列表中移除该文件
      this.fileList.splice(index, 1);
      return true;
    },
  }
}
</script>
<style lang="less" scoped>
.card-container {
  padding: 16px;
}
</style>
