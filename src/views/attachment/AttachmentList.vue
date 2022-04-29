<template>
  <div style="padding: 1rem">
    <a-row :gutter="12" align="middle" type="flex">
      <a-col :span="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="关键词：">
                    <a-input v-model="list.params.keyword" @keyup.enter="handleQuery()"/>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="文件类型：">
                    <a-select
                        v-model="list.params.mediaType"
                        :loading="mediaTypes.loading"
                        allowClear
                        @change="handleQuery()"
                    >
                      <a-select-option v-for="(item, index) in mediaTypes.data" :key="index" :value="item"
                      >{{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <span class="table-page-search-submitButtons">
                    <a-space>
                      <a-button type="primary" @click="handleQuery()">查询</a-button>
                      <a-button @click="handleResetParam()">重置</a-button>
                    </a-space>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="table-operator">
            <a-button icon="cloud-upload" type="primary" @click="upload.visible = true">上传</a-button>
            <a-button v-show="list.selected.length" icon="check-circle" type="primary" @click="handleSelectAll">
              全选
            </a-button>
            <a-button v-show="list.selected.length" icon="delete" type="danger" @click="handleDeleteAttachmentInBatch">
              删除
            </a-button>
            <a-button v-show="list.selected.length" icon="close" @click="list.selected = []"> 取消</a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
          <a-list
              :dataSource="list.data"
              :grid="{ gutter: 6, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
              :loading="list.loading"
              class="attachments-group"
          >
            <template #renderItem="item, index">
              <a-list-item
                  :key="index"
                  @click="handleItemClick(item)"
                  @mouseenter="$set(item, 'hover', true)"
                  @mouseleave="$set(item, 'hover', false)"
                  @contextmenu.prevent="handleContextMenu($event, item)"
              >
                <div
                    :class="`${isItemSelect(item) ? 'border-blue-600' : 'border-slate-200'}`"
                    class="border border-solid ant-card-hoverable"
                >
                  <div class="attach-thumb attachments-group-item">
                    <span v-if="!isImage(item)" class="attachments-group-item-type">{{ item.suffix }}</span>
                    <span
                        v-else
                        :style="{ backgroundImage: `url('${encodeURI(item.thumbPath)}')` }"
                        class="attachments-group-item-img"
                        loading="lazy"
                    />
                  </div>
                  <a-card-meta class="p-2 cursor-pointer">
                    <template #description>
                      <a-tooltip :title="item.name">
                        <div class="truncate">{{ item.name }}</div>
                      </a-tooltip>
                    </template>
                  </a-card-meta>
                  <a-icon
                      v-show="!isItemSelect(item) && item.hover"
                      :style="{ fontSize: '18px', color: 'rgb(37 99 235)',right: '0.5rem' }"
                      class="icon"
                      theme="twoTone"
                      type="plus-circle"
                      @click.stop="handleSelect(item)"
                  />
                  <a-icon
                      v-show="isItemSelect(item)"
                      :style="{ fontSize: '18px', color: 'rgb(37 99 235)',right: '0.5rem' }"
                      class="icon"
                      theme="twoTone"
                      type="check-circle"
                  />
                  <a-icon
                      v-show="item.hover && list.selected.length > 0"
                      :style="{ fontSize: '18px' ,left: '0.5rem'}"
                      class="icon"
                      theme="twoTone"
                      type="profile"
                      @click.stop="handleOpenDetail(item)"
                  />
                </div>
              </a-list-item>
            </template>
          </a-list>

          <!--分页-->
          <div class="page-wrapper">
            <a-pagination
                :current="pagination.page"
                :defaultPageSize="pagination.size"
                :pageSizeOptions="['18', '36', '54', '72', '90', '108']"
                :total="pagination.total"
                class="pagination"
                showLessItems
                show-size-changer
                @change="handlePageChange"
                @showSizeChange="handlePageSizeChange"
            >
              <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }}条/页</span>
              </template>
            </a-pagination>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <AttachmentUpload :visible.sync="upload.visible" @close="onUploadClose"/>

    <AttachmentDetail
        :addToPhoto="true"
        :attachment="list.current"
        :visible.sync="detailVisible"
        @delete="handleListAttachments()"
    >
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious">上一项</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext">下一项</a-button>
      </template>
    </AttachmentDetail>
  </div>
</template>

<script>
import attachmentApi from '@/api/attachment/index'
import AttachmentDetail from "@/components/attachment/AttachmentDetail";
import AttachmentUpload from "@/components/attachment/AttachmentUpload";

export default {
  components: {
    AttachmentDetail,
    AttachmentUpload
  },
  filters: {
    typeText(type) {
      return this.attachmentTypes[type].text
    }
  },
  data() {
    return {
      list: {
        data: [],
        loading: false,
        total: 0,
        hasNext: false,
        hasPrevious: false,
        params: {
          page: 0,
          size: 18,
          keyword: undefined,
          mediaType: undefined,
          attachmentType: undefined
        },
        selected: [],
        current: {}
      },

      mediaTypes: {
        data: [],
        loading: false
      },

      types: {
        data: [],
        loading: false
      },

      upload: {
        visible: false
      },
      detailVisible: false,
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
    isImage() {
      return function (attachment) {
        if (!attachment || !attachment.mediaType) {
          return false
        }
        return attachment.mediaType.startsWith('image')
      }
    },
    isItemSelect() {
      return function (attachment) {
        return this.list.selected.findIndex(item => item.id === attachment.id) > -1
      }
    },
    pagination() {
      return {
        page: this.list.params.page + 1,
        size: this.list.params.size,
        total: this.list.total
      }
    },
    selectPreviousButtonDisabled() {
      if (this.list.data) {
        return this.list.data.findIndex(attachment => attachment.id === this.list.current.id) === 0
      } else {
        return true
      }
    },
    selectNextButtonDisabled() {
      if (this.list.data) {
        return this.list.data.findIndex(attachment => attachment.id === this.list.current.id) === this.list.data.length - 1
      } else {
        return true
      }
    }
  },
  created() {
    this.handleListAttachments()
    this.handleListMediaTypes()
    this.handleListTypes()
  },
  methods: {
    /**
     * List attachments
     */
    async handleListAttachments() {
      try {
        this.list.loading = true
        await attachmentApi.page(this.list.params).then(response => {
          if (response.code === 1) {
            this.list.data = response.data.list
            this.list.total = response.data.totalCount
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.list.loading = false
      }
    },

    /**
     * List attachment media types
     */
    async handleListMediaTypes() {
      try {
        this.mediaTypes.loading = true

        await attachmentApi.listMediaTypes().then(response => {
          if (response.code === 1) {
            this.mediaTypes.data = response.data
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.mediaTypes.loading = false
      }
    },

    /**
     * List attachment upload types
     */
    async handleListTypes() {
      try {
        this.types.loading = true

        await attachmentApi.listTypes().then(response => {
          if (response.code === 1) {
            this.types.data = response.data
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.types.loading = false
      }
    },

    /**
     * Handle open attachment detail  event
     */
    handleOpenDetail(attachment) {
      this.list.current = attachment
      this.detailVisible = true
    },

    handleItemClick(attachment) {
      if (this.list.selected.length <= 0) {
        this.handleOpenDetail(attachment)
        return
      }
      this.isItemSelect(attachment) ? this.handleUnselect(attachment) : this.handleSelect(attachment)
    },

    handleSelect(attachment) {
      this.list.selected = [...this.list.selected, attachment]
    },

    handleUnselect(attachment) {
      this.list.selected = this.list.selected.filter(item => item.id !== attachment.id)
    },

    handleSelectAll() {
      this.list.selected = this.list.data
    },

    /**
     * Show context menu
     */
    handleContextMenu(event, item) {
      this.$contextmenu({
        items: [
          {
            label: `复制${this.isImage(item) ? '图片' : '文件'}链接`,
            onClick: () => {
              const text = `${encodeURI(item.path)}`
              this.$copyText(text)
                  .then(message => {
                    this.$message.success('复制成功！')
                  })
                  .catch(err => {
                    this.$message.error('复制失败！')
                  })
            },
            divided: true
          },
          {
            disabled: !this.isImage(item),
            label: '复制 Markdown 格式链接',
            onClick: () => {
              const text = `![${item.name}](${encodeURI(item.path)})`
              this.$copyText(text)
                  .then(message => {
                    this.$message.success('复制成功！')
                  })
                  .catch(err => {
                    this.$message.error('复制失败！')
                  })
            },
            divided: true
          },
          {
            label: '删除',
            onClick: () => {
              this.$confirm({
                title: '提示',
                content: '确定删除该附件？',
                okText: '确定',
                cancelText: '取消',
                onOk: async () => {
                  attachmentApi.del(item.id).then(response => {
                    if (response.code === 1) {
                      this.handleListAttachments()
                      this.handleUnselect(item)
                      this.$message.success('删除成功！')
                    } else {
                      this.$message.error(response.msg)
                    }
                  })
                }
              })
            }
          }
        ],
        event,
        minWidth: 210
      })
      return false
    },

    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListAttachments()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListAttachments()
    },

    /**
     * Reset query params
     */
    handleResetParam() {
      this.list.params.keyword = undefined
      this.list.params.mediaType = undefined
      this.list.params.attachmentType = undefined
      this.handlePageChange()
      this.handleListMediaTypes()
      this.handleListTypes()
    },

    /**
     * Search attachments
     */
    handleQuery() {
      this.handlePageChange()
    },

    onUploadClose() {
      this.handlePageChange()
      this.handleListMediaTypes()
      this.handleListTypes()
    },

    /**
     * Deletes selected attachments
     */
    handleDeleteAttachmentInBatch() {
      const _this = this
      if (this.list.selected.length <= 0) {
        this.$message.warn('你还未选择任何附件，请至少选择一个！')
        return
      }
      this.$confirm({
        title: '确定要批量删除选中的附件吗？',
        content: '一旦删除不可恢复，请谨慎操作',
        async onOk() {
          try {
            const attachmentIds = _this.list.selected.map(attachment => attachment.id)
            attachmentApi.del(attachmentIds).then(response => {
              if (response.code === 1) {
                _this.list.selected = []
                _this.$message.success('删除成功')
                _this.handleListAttachments()
              } else {
                _this.$message.error(response.msg)
              }
            })
          } catch (e) {
            _this.$message.error('Failed to delete selected attachments')
          }
        }
      })
    },

    /**
     * Select previous attachment
     */
    async handleSelectPrevious() {
      const index = this.list.data.findIndex(item => item.id === this.list.current.id)
      if (index > 0) {
        this.list.current = this.list.data[index - 1]
        return
      }
      if (index === 0 && this.list.hasPrevious) {
        this.list.params.page--
        await this.handleListAttachments()
        this.list.current = this.list.data[this.list.data.length - 1]
      }
    },

    /**
     * Select next attachment
     */
    async handleSelectNext() {
      const index = this.list.data.findIndex(item => item.id === this.list.current.id)
      if (index < this.list.data.length - 1) {
        this.list.current = this.list.data[index + 1]
        return
      }
      if (index === this.list.data.length - 1 && this.list.hasNext) {
        this.list.params.page++
        await this.handleListAttachments()
        this.list.current = this.list.data[0]
      }
    }
  }
}
</script>
<style lang="less">
.table-page-search-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 20px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }

      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}

.page-wrapper {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  padding-bottom: 2rem;

  .ant-pagination-options-size-changer.ant-select {
    margin: 0;
  }

  .pagination {
    margin-top: 1rem;
  }
}

// 附件图片样式
.attachments-group,
.photos-group {
  padding: .25rem;

  &-item {
    padding: 0;
    height: 130px;

    &-img {
      display: block;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }

    .attachments-group &-type {
      font-size: 38px;
      text-transform: capitalize;
    }
  }
}


.table-operator button {
  margin-right: 8px
}

button {
  margin-right: 8px
}

.attachments-group-item, .photos-group-item {
  padding: 0;
  height: 130px
}

.attachments-group-item-img, .photos-group-item-img {
  display: block;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%
}

.attachments-group .attachments-group-item-type, .attachments-group .photos-group-item-type {
  font-size: 38px;
  text-transform: capitalize
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  padding: 5px;
}

.border {
  border-width: 1px
}

.border-solid {
  border-style: solid
}

.border-blue-600 {
  --tw-border-opacity: 1;
  //border-color: rgb(37 99 235/var(--tw-border-opacity))
  border-color: #1890ff;
}

.border-slate-200 {
  --tw-border-opacity: 1;
  border-color: #dedcdc;
}

.attach-thumb, .photo-thumb {
  width: 100%;
  padding-bottom: 56%
}

.attach-item, .attach-thumb, .photo-thumb {
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  cursor: pointer
}

.attach-item img, .attach-item span, .attach-thumb img, .attach-thumb span, .photo-thumb img, .photo-thumb span {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0
}

.attach-item span, .attach-thumb span, .photo-thumb span {
  display: flex;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  color: #000
}

.icon {
  position: absolute;
  top: .25rem;
  font-weight: bold;
  cursor: pointer;
  transition-property: all;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s
}
</style>
