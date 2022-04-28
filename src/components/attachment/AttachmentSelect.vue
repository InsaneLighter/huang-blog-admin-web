<template>
  <a-modal v-model="modalVisible" :afterClose="onAfterClose" :title="title" :width="1024" destroyOnClose>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="关键词：">
              <a-input v-model="list.params.keyword" @keyup.enter="handleListAttachments()"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-if="!type">
            <a-form-item label="文件类型：">
              <a-select
                  v-model="list.params.mediaType"
                  :loading="mediaTypes.loading"
                  allowClear
                  @change="handleListAttachments()"
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
                      <a-button type="primary" @click="handleListAttachments()">查询</a-button>
                      <a-button @click="handleResetParam()">重置</a-button>
                    </a-space>
                  </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-divider/>

    <a-list
        :dataSource="list.data"
        :grid="{ gutter: 6, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
        :loading="list.loading"
        class="attachments-group"
    >
      <template #renderItem="item, index">
        <a-list-item
            @mouseenter="$set(item, 'hover', true)"
            @mouseleave="$set(item, 'hover', false)"
            :key="index"
            @click="handleItemClick(item)"
        >
          <div :class="`${isItemSelect(item) ? 'border-blue-600' : 'border-slate-200'}`" class="border border-solid">
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
                v-show="isItemSelect(item) && !item.hover"
                type="check-circle"
                theme="twoTone"
                class="icon"
                :style="{ fontSize: '18px', color: 'rgb(37 99 235)',right: '0.5rem' }"
            />
            <a-icon
                v-show="item.hover"
                type="profile"
                theme="twoTone"
                class="icon"
                @click.stop="handleOpenDetail(item)"
                :style="{ fontSize: '18px',right: '0.5rem'}"
            />
          </div>
        </a-list-item>
      </template>
    </a-list>

    <div class="flex justify-between">
      <a-popover placement="right" title="预览" trigger="click">
        <template slot="content">
          <a-tabs v-if="list.selected.length" default-active-key="markdown" tab-position="left">
            <a-tab-pane key="markdown" tab="Markdown">
              <div class="text-slate-400" v-html="markdownSyntaxList.join('<br />')"></div>
            </a-tab-pane>
            <a-tab-pane key="html" force-render tab="HTML">
              <div class="text-slate-400">
                <span v-for="(item, index) in htmlSyntaxList" :key="index" class="text-slate-400">
                  {{ item }}<br/>
                </span>
              </div>
            </a-tab-pane>
          </a-tabs>
          <div v-else class="text-slate-400">未选择附件</div>
        </template>
        <a-tooltip placement="top" title="点击预览">
          <div class="self-center text-slate-400 select-none cursor-pointer hover:text-blue-400 transition-all">
            已选择 {{ list.selected.length }} 项
          </div>
        </a-tooltip>
      </a-popover>

      <div class="page-wrapper flex justify-end self-center">
        <a-pagination
            :current="pagination.page"
            :defaultPageSize="pagination.size"
            :pageSizeOptions="['12', '18', '24', '30', '36', '42']"
            :total="pagination.total"
            class="pagination !mt-0"
            showLessItems
            showSizeChanger
            @change="handlePageChange"
            @showSizeChange="handlePageSizeChange"
        />
      </div>
    </div>

    <template slot="footer">
      <a-button @click="modalVisible = false">取消</a-button>
      <a-button type="primary" :disabled="!list.selected.length" @click="handleConfirm">确定</a-button>
    </template>

    <AttachmentUpload :visible.sync="upload.visible" @close="handleSearch"/>

    <AttachmentDetail :attachment="list.current" :visible.sync="detailVisible" @delete="handleListAttachments()">
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious">上一项</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext">下一项</a-button>
        <a-button @click="handleItemClick(list.current)" type="primary">
          {{ list.selected.findIndex(item => item.id === list.current.id) > -1 ? '取消选择' : '选择' }}
        </a-button>
      </template>
    </AttachmentDetail>
  </a-modal>
</template>
<script>
import attachmentApi from '@/api/attachment/index'
import AttachmentDetail from "./AttachmentDetail";
import AttachmentUpload from "./AttachmentDetail";
export default {
  name: 'AttachmentSelect',
  components: {
    AttachmentDetail,
    AttachmentUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择附件'
    },
    multiSelect: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: {
        data: [],
        total: 0,
        hasNext: false,
        hasPrevious: false,
        loading: false,
        params: {
          page: 0,
          size: 12,
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
    modalVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
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
      if(this.list.data){
        return this.list.data.findIndex(attachment => attachment.id === this.list.current.id) === 0
      }else {
        return true
      }
    },
    selectNextButtonDisabled() {
      if(this.list.data){
        return this.list.data.findIndex(attachment => attachment.id === this.list.current.id) === this.list.data.length - 1
      }else {
        return true
      }
    },
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
    markdownSyntaxList() {
      if (!this.list.selected.length) {
        return []
      }
      return this.list.selected.map(item => {
        return `![${item.name}](${encodeURI(item.path)})`
      })
    },
    htmlSyntaxList() {
      if (!this.list.selected.length) {
        return []
      }
      return this.list.selected.map(item => {
        return `<img src="${encodeURI(item.path)}" alt="${item.name}">`
      })
    }
  },
  watch: {
    modalVisible(value) {
      if (value) {
        this.handleListAttachments()
        this.handleListMediaTypes()
        this.handleListTypes()
      }
    }
  },
  methods: {
    /**
     * List attachments
     */
    async handleListAttachments() {
      try {
        this.list.loading = true
        if(this.type){
          this.list.params.mediaType = this.type
        }
        await attachmentApi.page(this.list.params).then(response => {
          if (response.code === 1) {
            this.list.data = response.data.list
            this.list.total = response.data.totalCount
            this.list.hasNext = response.data.hasNext
            this.list.hasPrevious = response.data.hasPrevious
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
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListAttachments()
    },

    /**
     * Search attachments
     */
    handleSearch() {
      this.handlePageChange(1)
    },

    /**
     * Reset search params
     */
    handleResetParam() {
      this.list.params = {
        page: 0,
        size: 12,
        keyword: undefined,
        mediaType: undefined,
        attachmentType: undefined
      }
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListAttachments()
    },

    handleItemClick(attachment) {
      // single select
      if (!this.multiSelect) {
        this.$emit('confirm', {
          raw: [attachment],
          markdown: [`![${attachment.name}](${encodeURI(attachment.path)})`],
          html: [`<img src="${encodeURI(attachment.path)}" alt="${attachment.name}">`]
        })
        this.modalVisible = false
        return
      }

      const isSelect = this.list.selected.findIndex(item => item.id === attachment.id) > -1
      isSelect ? this.handleUnselect(attachment) : this.handleSelect(attachment)
    },

    handleSelect(attachment) {
      this.list.selected = [...this.list.selected, attachment]
    },

    handleUnselect(attachment) {
      this.list.selected = this.list.selected.filter(item => item.id !== attachment.id)
    },

    handleConfirm() {
      this.$emit('confirm', {
        raw: this.list.selected,
        markdown: this.markdownSyntaxList,
        html: this.htmlSyntaxList
      })
      this.modalVisible = false
    },

    handleOpenDetail(attachment) {
      this.list.current = attachment
      this.detailVisible = true
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
    },

    onAfterClose() {
      this.handleResetParam()
      this.list.selected = []
    }
  },
  filters: {
    typeText(type) {
      return this.attachmentTypes[type].text
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
  border-color: #9b9ea0;
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
  color: #9b9ea0
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
