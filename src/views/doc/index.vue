<template>
  <div style="padding: 1rem">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="标题：">
                <a-input v-model="list.params.title"
                         placeholder="请输入文章标题"
                         @keyup.enter="handleQuery()"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="文章状态：">
                <a-select
                    v-model="list.params.status"
                    allowClear
                    placeholder="请选择文章状态"
                    @change="handleChangeQueryStatus"
                >
                  <a-select-option v-for="status in Object.keys(postStatuses)" :key="status" :value="status">
                    {{ postStatuses[status].text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="分类：">
                <a-select
                    v-model="list.params.categoryId"
                    allowClear
                    placeholder="请选择分类"
                    @change="handleChangeQueryCategoryId"
                >
                  <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
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

      <div style="margin-bottom: 10px">
        <router-link :to="{ name: 'DocEdit' }">
          <a-button icon="plus" type="primary">写文章</a-button>
        </router-link>
        <a-space style="margin-left: 0.5rem">
          <slot name="operator-before"/>
          <a-dropdown v-if="selectedRowKeys.length">
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleChangeStatusInBatch(postStatuses.PUBLISHED.value)">发布</a-menu-item>
                <a-menu-item @click="handleChangeStatusInBatch(postStatuses.DRAFT.value)">转为草稿</a-menu-item>
                <a-menu-item @click="handleChangeStatusInBatch(postStatuses.RECYCLE.value)">删除</a-menu-item>
                <a-menu-item @click="handleDeleteInBatch">
                  永久删除
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
          <slot name="operator-after"/>
        </a-space>
      </div>

      <div>
        <a-table
            :columns="columns"
            :dataSource="list.data"
            :loading="list.loading"
            :pagination="false"
            :rowKey="post => post.id"
            :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange
          }"
            :scrollToFirstRowOnChange="true"
        >
          <!--标题-->
          <template #postTitle="text, record">
            <a-icon
                v-if="record.topPriority !== 0"
                style="margin-right: 3px"
                theme="twoTone"
                twoToneColor="red"
                type="pushpin"
            />
            <a-tooltip v-if="record.inProgress" placement="top" title="当前有内容已保存，但还未发布。">
              <a-icon
                  class="cursor-pointer"
                  style="margin-right: 3px"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                  type="info-circle"
                  @click="handleEditClick(record)"
              />
            </a-tooltip>
            <a-tooltip
                v-if="[postStatuses.PUBLISHED.value].includes(record.status)"
                :title="'点击访问【' + text + '】'"
                placement="top"
            >
              <a class="no-underline" href="javascript:void(0);" @click="handleEditClick(record)">
              {{ text }}
              </a>
            </a-tooltip>
            <a-tooltip
                v-else-if="record.status === postStatuses.DRAFT.value"
                :title="'点击预览【' + text + '】'"
                placement="top"
            >
              <a class="no-underline" href="javascript:void(0);" @click="handleEditClick(record)">
                {{ text }}
              </a>
            </a-tooltip>
            <a v-else class="no-underline" href="javascript:void(0);" disabled>
              {{ text }}
            </a>
          </template>
          <!--状态-->
          <template #status="status">
            <a-badge :status="postStatuses[status].status" :text="status"/>
          </template>
          <!--分类-->
          <template #categories="categories">
            <a-tag v-for="(category, index) in categories" :key="index" color="blue" style="margin-left: 1vh;">
              {{ category.name }}
            </a-tag>
          </template>
          <!--标签-->
          <template #tags="tags">
            <post-tag v-for="(tag, index) in tags" :key="index" :tag="tag" style="margin-bottom: 8px"/>
          </template>
          <!--访问-->
          <template #visit="visit">
            <a-badge
                :count="visit"
                :numberStyle="{ backgroundColor: '#00e0ff' }"
                :overflowCount="9999"
                :showZero="true"
                class="cursor-pointer"
            />
          </template>
          <!--发布时间-->
          <template #createTime="createTime">
            <a-tooltip placement="top">
              <template #title>
                {{ createTime }}
              </template>
              {{ createTime }}
            </a-tooltip>
          </template>
          <!--操作-->
          <template #action="text, post">
            <a-button
                v-if="
                [postStatuses.PUBLISHED.value, postStatuses.DRAFT.value].includes(
                  post.status
                )
              "
                class="operate"
                type="link"
                @click="handleEditClick(post)"
            >
              编辑
            </a-button>

            <a-popconfirm
                v-else-if="post.status === postStatuses.RECYCLE.value"
                :title="'确定要发布【' + post.title + '】文章？'"
                cancelText="取消"
                okText="确定"
                @confirm="handleChangeStatus(post.id, postStatuses.PUBLISHED.value)"
            >
              <a-button class="operate" type="link">还原</a-button>
            </a-popconfirm>

            <a-divider type="vertical"/>

            <a-popconfirm
                v-if="
                [postStatuses.PUBLISHED.value, postStatuses.DRAFT.value].includes(
                  post.status
                )
              "
                :title="'确定要删除【' + (post.title.length > 15 ? post.title.substring(0,15) + '...':post.title) + '】文章？'"
                cancelText="取消"
                okText="确定"
                @confirm="handleChangeStatus(post.id, postStatuses.RECYCLE.value)"
            >
              <a-button class="operate" type="link">删除</a-button>
            </a-popconfirm>

            <a-popconfirm
                v-else-if="post.status === postStatuses.RECYCLE.value"
                :title="'确定要永久删除【' + post.title + '】文章？'"
                cancelText="取消"
                okText="确定"
                @confirm="handleDelete(post.id)"
            >
              <a-button class="operate" type="link">删除</a-button>
            </a-popconfirm>

            <a-divider type="vertical"/>

            <a-button class="operate" type="link" @click="handleOpenPostSettings(post)">设置</a-button>
          </template>
        </a-table>
        <!--分页-->
        <div class="page-wrapper">
          <a-pagination
              :current="pagination.page"
              :defaultPageSize="pagination.size"
              :page-size-options="['5', '10', '20', '50', '100']"
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
      </div>
    </a-card>

    <PostSetting
        :loading="postSettingLoading"
        :post="list.selected"
        :savedCallback="onPostSavedCallback"
        :visible.sync="postSettingVisible"
        @onClose="list.selected = {}"
    >
      <template #extraFooter>
        <a-button :disabled="selectPreviousButtonDisabled" @click="handleSelectPrevious"> 上一篇</a-button>
        <a-button :disabled="selectNextButtonDisabled" @click="handleSelectNext"> 下一篇</a-button>
      </template>
    </PostSetting>
  </div>
</template>

<script>
import postApi from '@/api/post/index'
import categoryApi from '@/api/category/index'
import PostTag from '@/components/tools/PostTag'
import PostSetting from "@/components/tools/PostSetting";
export default {
  name: 'DocList',
  components: {
    PostTag,
    PostSetting
  },
  props: {
    defaultPageSize: {
      type: Number,
      default: 10
    },
    searchWrapper: {
      type: Boolean,
      default: true
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
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          ellipsis: true,
          align: 'center',
          scopedSlots: {customRender: 'postTitle'}
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '150px',
          align: 'center',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '分类',
          dataIndex: 'categories',
          width: '250px',
          align: 'center',
          scopedSlots: {customRender: 'categories'}
        },
        {
          title: '标签',
          dataIndex: 'tags',
          width: '250px',
          align: 'center',
          scopedSlots: {customRender: 'tags'}
        },
        {
          title: '访问',
          width: '100px',
          dataIndex: 'visit',
          align: 'center',
          scopedSlots: {customRender: 'visit'}
        },
        {
          title: '发布时间',
          dataIndex: 'createTime',
          width: '200px',
          align: 'center',
          scopedSlots: {customRender: 'createTime'}
        },
        {
          title: '操作',
          width: '200px',
          align: 'center',
          scopedSlots: {customRender: 'action'}
        }
      ],
      list: {
        data: [],
        loading: false,
        total: 0,
        params: {
          page: 0,
          size: 10,
          title: undefined,
          categoryId: undefined,
          status: undefined
        },
        selected: {}
      },
      categories: [],
      selectedRowKeys: [],
      postSettingVisible: false,
      postSettingLoading: false,
      postCommentVisible: false
    }
  },
  computed: {
    pagination() {
      return {
        page: this.list.params.page + 1,
        size: this.list.params.size,
        total: this.list.total
      }
    },
    selectPreviousButtonDisabled() {
      if(this.list.data){
        return this.list.data.findIndex(post => post.id === this.list.selected.id) === 0
      }else {
        return true
      }
    },
    selectNextButtonDisabled() {
      if(this.list.data){
        return this.list.data.findIndex(post => post.id === this.list.selected.id) === this.list.data.length - 1
      }else {
        return true
      }
    }
  },
  created() {
    this.list.params.size = this.defaultPageSize
    this.handleListCategories()
    this.handleListPosts()
  },
  methods: {
    /**
     * Fetch post data
     */
    async handleListPosts(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }
        await postApi.page(this.list.params).then(response => {
          if(response.code === 1){
            this.list.data = response.data.list
            this.list.total = response.data.totalCount
          }else {
            this.$message.error(response.msg)
          }
        });

      } catch (error) {
        this.$message.error(error)
      } finally {
        this.list.loading = false
      }
    },

    /**
     * Fetch categories data
     */
    async handleListCategories() {
      try {
        await categoryApi.queryAll().then(response => {
          if(response.code === 1){
            this.categories = response.data.list
          }else {
            this.$message.error(response.msg)
          }
        })
      } catch (error) {
        this.$message.error(error)
      }
    },

    handleEditClick(post) {
      this.$router.push({name: 'DocEdit', query: {postId: post.id}})
    },

    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListPosts()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListPosts()

    },

    /**
     * Reset query params
     */
    handleResetParam() {
      this.list.params.title = undefined
      this.list.params.categoryId = undefined
      this.list.params.status = undefined
      this.selectedRowKeys = []
      this.handlePageChange(1)
      this.handleListCategories()
    },

    handleQuery() {
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },

    handleChangeQueryStatus(status) {
      if (status) {
        this.list.params.status = status
      } else {
        this.list.params.status = undefined
      }
      this.handleQuery()
    },
    handleChangeQueryCategoryId(categoryId) {
      if (categoryId) {
        this.list.params.categoryId = categoryId
      } else {
        this.list.params.categoryId = this.undefined
      }
      this.handleQuery()
    },
    async handleChangeStatus(postId, status) {
      try {
        await postApi.updateStatus({id: postId, status: status}).then(response => {
          if(response.code === 1){
            this.$message.success('操作成功！')
          }else {
            this.$message.error(response.msg)
          }
        })
      } catch (e) {
        this.$message.error('Failed to change post status', e)
      } finally {
        await this.handleListPosts()
      }
    },

    async handleChangeStatusInBatch(status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }

      this.$confirm({
        title: '提示',
        content: `确定要将所选的文章转为${this.postStatuses[status].text}状态吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await postApi.updateStatusInBatch({ids: this.selectedRowKeys, status: status}).then(response => {
              if(response.code === 1){
                this.selectedRowKeys = []
                this.$message.success('操作成功！')
              }else {
                this.$message.error(response.msg)
              }
            })
          } catch (e) {
            this.$message.error('Failed to change status in batch', e)
          } finally {
            await this.handleListPosts()
          }
        }
      })
    },

    async handleDelete(postId) {
      try {
        await postApi.del(postId).then(response => {
          if(response.code === 1){
            this.$message.success('删除成功！')
          }else {
            this.$message.error(response.msg)
          }
        }).finally(() => {
          this.handleListPosts()
        })
      } catch (e) {
        this.$message.error('Failed to delete post', e)
      }
    },

    async handleDeleteInBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }

      this.$confirm({
        title: '提示',
        content: '确定删除所选的文章吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await postApi.del(this.selectedRowKeys).then(response => {
              if(response.code === 1){
                this.selectedRowKeys = []
                this.$message.success('删除成功！')
              }else {
                this.$message.error(response.msg)
              }
            }).finally(() => {
              this.handleListPosts()
            })
          } catch (e) {
            this.$message.error('Failed to delete posts in batch', e)
          }
        }
      })
    },

    async handleOpenPostSettings(post) {
      try {
        this.postSettingVisible = true
        this.postSettingLoading = true
        await postApi.get(post.id).then(response => {
          if(response.code === 1){
            this.list.selected = response.data
          }else {
            this.$message.error(response.msg)
          }
        })
      } catch (e) {
        this.$message.error('Failed to open post settings', e)
      } finally {
        this.postSettingLoading = false
      }
    },
    handlePreview(postId) {
      /*apiClient.post.getPreviewLinkById(postId).then(response => {
        window.open(response, '_blank')
      })*/
    },
    onPostSavedCallback() {
      this.handleListPosts(false)
    },
    /**
     * Select previous post
     */
    async handleSelectPrevious() {
      let flag = true
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      if ( index > 0) {
        this.postSettingLoading = true
        await postApi.get(this.list.data[index - 1].id).then(response => {
          if(response.code === 1){
            this.list.selected = response.data
            this.postSettingLoading = false
            flag = false
          }else {
            this.$message.error(response.msg)
          }
        })
      }
      if (index === 0 && this.list.hasPrevious && flag) {
        this.list.params.page--
        await this.handleListPosts()
        this.postSettingLoading = true
        await postApi.get(this.list.data[this.list.data.length - 1].id).then(response => {
          if(response.code === 1){
            this.list.selected = response.data
            this.postSettingLoading = false
          }else {
            this.$message.error(response.msg)
          }
        })
      }
    },

    /**
     * Select next post
     */
    async handleSelectNext() {
      const index = this.list.data.findIndex(post => post.id === this.list.selected.id)
      if ( index < this.list.data.length - 1) {
        this.postSettingLoading = true
        await postApi.get(this.list.data[ index + 1].id).then(response => {
          if(response.code === 1){
            this.list.selected = response.data
            this.postSettingLoading = false
          }else {
            this.$message.error(response.msg)
          }
        })
      }
      if ( index === this.list.data.length - 1 && this.list.hasNext) {
        this.list.params.page++
        await this.handleListPosts()
        this.postSettingLoading = true
        await postApi.get(this.list.data[0].id).then(response => {
          if(response.code === 1){
            this.list.selected = response.data
            this.postSettingLoading = false
          }else {
            this.$message.error(response.msg)
          }
        })
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


  .ant-pagination-options-size-changer.ant-select {
    margin: 0;
  }

  .pagination {
    margin-top: 1rem;
  }
}

.operate {
  padding: 0;
}
</style>
