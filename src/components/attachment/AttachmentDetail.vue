<template>
  <a-modal v-model="modalVisible" :width="'50%'" title="附件详情">
    <a-row :gutter="24" type="flex">
      <a-col :lg="9" :md="24" :sm="24" :xl="9" :xs="24">
        <div class="attach-detail-img pb-3">
          <a v-if="isImage" :href="attachment.path" target="_blank">
            <img :src="attachment.path" width="300px" loading="lazy"/>
          </a>
          <div v-else>此文件不支持预览</div>
        </div>
      </a-col>
      <a-col :lg="15" :md="24" :sm="24" :xl="15" :xs="24">
        <a-list itemLayout="horizontal">
          <a-list-item style="padding-top: 0">
            <a-list-item-meta>
              <template v-if="editable" slot="description">
                <a-input ref="nameInput" v-model="attachment.name" @blur="handleUpdateName"/>
              </template>
              <template v-else slot="description">{{ attachment.name }}</template>
              <span slot="title">
                附件名：
                <a-button class="!p-0" type="link" @click="handleEditName">
                  <a-icon type="edit"/>
                </a-button>
              </span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="attachment.mediaType">
              <span slot="title">附件类型：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="attachment.type">
              <span slot="title">存储位置：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template slot="description">
                {{ attachment.size }}
              </template>
              <span slot="title">附件大小：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item v-if="isImage">
            <a-list-item-meta :description="attachment.height + 'x' + attachment.width">
              <span slot="title">图片尺寸：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template slot="description">
                {{ attachment.createTime }}
              </template>
              <span slot="title">上传日期：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <a :href="attachment.path" target="_blank">{{ attachment.path }}</a>
              </template>
              <span slot="title">
                普通链接：
                <a-button class="!p-0" type="link" @click="handleCopyLink(`${encodeURI(attachment.path)}`)">
                  <a-icon type="copy"/>
                </a-button>
              </span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item v-if="isImage">
            <a-list-item-meta>
              <span slot="description">![{{ attachment.name }}]({{ attachment.path }})</span>
              <span slot="title">
                Markdown 格式：
                <a-button
                    class="!p-0"
                    type="link"
                    @click="handleCopyLink(`![${attachment.name}](${encodeURI(attachment.path)})`)"
                >
                  <a-icon type="copy"/>
                </a-button>
              </span>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>

    <template #footer>
      <slot name="extraFooter"/>
      <a-popconfirm cancelText="取消" okText="确定" title="你确定要删除该附件？" @confirm="handleDelete">
        <ReactiveButton
            :errored="deleteErrored"
            :loading="deleting"
            erroredText="删除失败"
            icon="delete"
            loadedText="删除成功"
            text="删除"
            type="danger"
            @callback="handleDeletedCallback"
        ></ReactiveButton>
      </a-popconfirm>
    </template>
  </a-modal>
</template>

<script>
import attachmentApi from '@/api/attachment/index'
import ReactiveButton from "@/components/tools/ReactiveButton";
export default {
  name: 'AttachmentDetail',
  components: {
    ReactiveButton
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    attachment: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editable: false,
      deleting: false,
      deleteErrored: false,
      attachmentTypes: {
        LOCAL: {
          type: 'LOCAL',
          text: '本地'
        },
        OSS: {
          type: 'OSS',
          text: '阿里云'
        },
        MINIO: {
          type: 'MINIO',
          text: 'MinIO'
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
    },
    isImage() {
      if (!this.attachment || !this.attachment.mediaType) {
        return false
      }
      return this.attachment.mediaType.startsWith('image')
    }
  },
  methods: {
    /**
     * Deletes the attachment
     */
    async handleDelete() {
      try {
        this.deleting = true

        await attachmentApi.del(this.attachment.id).then(response => {
          if (response.code === 1) {
            this.$message.success('删除成功！')
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (error) {
        this.$message.error(error)
        this.deleteErrored = true
      } finally {
        setTimeout(() => {
          this.deleting = false
        }, 400)
      }
    },

    /**
     * Handles the deletion callback event
     */
    handleDeletedCallback() {
      this.$emit('delete', this.attachment)
      this.deleteErrored = false
      this.modalVisible = false
    },

    /**
     * Shows the edit name input
     */
    handleEditName() {
      this.editable = !this.editable
      if (this.editable) {
        this.$nextTick(() => {
          this.$refs.nameInput.focus()
        })
      }
    },

    /**
     * Updates the attachment name
     */
    async handleUpdateName() {
      if (!this.attachment.name) {
        this.$notification['error']({
          message: '提示',
          description: '附件名称不能为空！'
        })
        return
      }
      try {
        await attachmentApi.edit({id: this.attachment.id, name: this.attachment.name}).then(response => {
          if (response.code === 1) {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.editable = false
      }
    },

    /**
     * Handles the copy link event
     * @param {String} link
     */
    handleCopyLink(link) {
      this.$copyText(link)
          .then(message => {
            this.$message.success('复制成功！')
          })
          .catch(err => {
            this.$message.error('复制失败！')
          })
    }
  },
  filters: {
    typeText(type) {
      return type ? this.attachmentTypes[type].text : ''
    }
  }
}
</script>
