<template>
  <div>
    <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
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
                  <a-select-option v-for="status in Object.keys(normalPostStatuses)" :key="status" :value="status">
                    {{ normalPostStatuses[status].text }}
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
        <router-link :to="{ name: 'PostWrite' }">
          <a-button icon="plus" type="primary">写文章</a-button>
        </router-link>
      </div>

      <div>
        <!-- Desktop -->
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
                v-if="[postStatuses.PUBLISHED.value, postStatuses.INTIMATE.value].includes(record.status)"
                :title="'点击访问【' + text + '】'"
                placement="top"
            >
              <a :href="record.fullPath" class="no-underline" target="_blank">
                {{ text }}
              </a>
            </a-tooltip>
            <a-tooltip
                v-else-if="record.status === postStatuses.DRAFT.value"
                :title="'点击预览【' + text + '】'"
                placement="top"
            >
              <a class="no-underline" href="javascript:void(0);" @click="handlePreview(record.id)">
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
            <a-tag v-for="(category, index) in categories" :key="index" color="blue" style="margin-left: 1vh">
              {{ category.name }}
            </a-tag>
          </template>
          <!--标签-->
          <template #tags="tags">
            <post-tag v-for="(tag, index) in tags" :key="index" :tag="tag" style="margin-bottom: 8px"/>
          </template>
          <!--访问-->
          <template #visits="visits">
            <a-badge
                :count="visits"
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
                [postStatuses.PUBLISHED.value, postStatuses.DRAFT.value, postStatuses.INTIMATE.value].includes(
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
                [postStatuses.PUBLISHED.value, postStatuses.DRAFT.value, postStatuses.INTIMATE.value].includes(
                  post.status
                )
              "
                :title="'确定要删除【' + post.title + '】文章？'"
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
  </div>
</template>

<script>
import { articleList } from '../data/const'
import docApi from '@/api/doc/index'
import categoryApi from '@/api/category/index'
import PostTag from '@/components/postTag'
export default {
  name: 'articleList',
  components: {
    PostTag
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
      normalPostStatuses: {
        PUBLISHED: {
          value: 'PUBLISHED',
          color: 'green',
          status: 'success',
          text: '已发布'
        },
        INTIMATE: {
          value: 'INTIMATE',
          color: 'blue',
          status: 'success',
          text: '私密'
        },
        DRAFT: {
          value: 'DRAFT',
          color: 'yellow',
          status: 'warning',
          text: '草稿'
        }
      },
      postStatuses: {
        PUBLISHED: {
          value: 'PUBLISHED',
          color: 'green',
          status: 'success',
          text: '已发布'
        },
        INTIMATE: {
          value: 'INTIMATE',
          color: 'blue',
          status: 'success',
          text: '私密'
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
          text: '回收站'
        }
      },
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'postTitle' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '分类',
          dataIndex: 'categories',
          width: '250px',
          align: 'center',
          scopedSlots: { customRender: 'categories' }
        },
        {
          title: '标签',
          dataIndex: 'tags',
          width: '250px',
          align: 'center',
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: '访问',
          width: '100px',
          dataIndex: 'visits',
          align: 'center',
          scopedSlots: { customRender: 'visits' }
        },
        {
          title: '发布时间',
          dataIndex: 'createTime',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
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
          status: []
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
        const response = await docApi.page(this.list.params);
        this.list.data = response.data.list
        this.list.total = response.data.totalCount
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
        const response = await categoryApi.queryAll()
        console.log(response)
        this.categories = response.data.list
      } catch (error) {
        this.$message.error(error)
      } finally {
      }
    },

    handleEditClick(post) {
      this.$router.push({name: 'PostEdit', query: {postId: post.id}})
    },

    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      console.log(`SelectedRowKeys: ${selectedRowKeys}`)
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
      console.log(`Current: ${current}, PageSize: ${size}`)
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
        // await apiClient.post.updateStatusById(postId, status)
        this.$message.success('操作成功！')
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
            // await apiClient.post.updateStatusInBatch(this.selectedRowKeys, status)
            this.selectedRowKeys = []
            this.$message.success('操作成功！')
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
        // await apiClient.post.delete(postId)
        this.$message.success('删除成功！')
      } catch (e) {
        this.$message.error('Failed to delete post', e)
      } finally {
        await this.handleListPosts()
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
            // await apiClient.post.deleteInBatch(this.selectedRowKeys)
            this.selectedRowKeys = []
            this.$message.success('删除成功！')
          } catch (e) {
            this.$message.error('Failed to delete posts in batch', e)
          } finally {
            await this.handleListPosts()
          }
        }
      })
    },

    async handleDeleteCurrentPage() {
      if (!this.list.data.length) {
        this.$message.info('当前页没有文章')
        return
      }
      this.$confirm({
        title: '提示',
        content: '确定删除当前页的所有文章吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const postIds = this.list.data.map(post => post.id)
            // await apiClient.post.deleteInBatch(postIds)
            this.$message.success('删除成功！')
          } catch (e) {
            this.$message.error('Failed to delete posts in batch', e)
          } finally {
            await this.handleListPosts()
          }
        }
      })
    },

    async handleOpenPostSettings(post) {
      try {
        this.postSettingVisible = true
        this.postSettingLoading = true

        // const {data} = await apiClient.post.get(post.id)
        // this.list.selected = data
      } catch (e) {
        this.$message.error('Failed to open post settings', e)
      } finally {
        this.postSettingLoading = false
      }
    },

    handleOpenPostComments(post) {
      this.list.selected = post
      this.postCommentVisible = true
    },

    handlePreview(postId) {
      /*apiClient.post.getPreviewLinkById(postId).then(response => {
        window.open(response, '_blank')
      })*/
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

.operate {
  padding: 0;
}
</style>
