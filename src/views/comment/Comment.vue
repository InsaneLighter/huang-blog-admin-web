<template>
  <div style="padding: 1rem">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="关键字：">
                <a-input v-model="list.params.keyword"
                         placeholder="请输入关键字"
                         @keyup.enter="handleQuery()"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="开始日期：">
                <a-date-picker
                    v-model:value="list.params.startDate"
                    :disabled-date="disabledDate"
                    @change="startDateChange"
                    placeholder="开始日期"
                    valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="结束日期：">
                <a-date-picker
                    v-model:value="list.params.endDate"
                    @change="endDateChange"
                    placeholder="结束日期"
                    valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="审核状态：">
                <a-select allowClear v-model:value="list.params.status" style="width: 183px">
                  <a-select-option value="1">通过</a-select-option>
                  <a-select-option value="0">未通过</a-select-option>
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
      <!-- 操作按钮区域 -->
      <a-divider style="margin: 10px 0 !important;"/>
      <div>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="margin-bottom: .5rem">
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="handleDeleteInBatch">
                <a-icon type="delete"/>
                删除
              </a-menu-item>
              <a-menu-item key="1" @click="handleStatusChangeInBatch">
                <a-icon type="delete"/>
                审核通过
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </div>
        <!-- table区域-begin -->
        <div style="margin-bottom: 2rem">
          <a-table
              :columns="columns"
              :dataSource="list.data"
              :loading="list.loading"
              :pagination="false"
              :rowKey="user => user.id"
              :defaultExpandedRowKeys="defaultExpandedRowKeys"
              :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange,
            getCheckboxProps:onGetCheckboxProps
          }">
            <template #status="text,record">
              <a-switch v-model:checked="record.status === 1"
                        checked-children="审核通过" un-checked-children="审核未通过"
                        @click="handleStatusChange(record)"/>
            </template>
            <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
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
      </div>
    </a-card>
  </div>
</template>

<script>
import commentApi from '@/api/comment/index'
import {mapGetters} from "vuex";

export default {
  name: "comment",
  components: {
  },
  data() {
    return {
      columns: [
        {
          title: '用户名',
          align: "center",
          dataIndex: 'username'
        },
        {
          title: '审核状态',
          align: "center",
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '评论内容',
          align: "center",
          dataIndex: 'content'
        },
        {
          title: '地址',
          align: "center",
          dataIndex: 'address'
        },
        {
          title: '点赞数量',
          align: "center",
          dataIndex: 'likes'
        },
        {
          title: '日期',
          align: "center",
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
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
          keyword: undefined,
          startDate: undefined,
          endDate: undefined,
          status: undefined
        },
        selected: {}
      },
      selectedRowKeys: [],
      defaultExpandedRowKeys: ['0'],
      record: {},
      defaultPageSize: 10
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
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.list.params.size = this.defaultPageSize
    this.handleListComments()
  },
  methods: {
    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onGetCheckboxProps(record) {
      return {props: {disabled: record.id === '0'}}
    },
    async handleDelete(messageId) {
      try {
        commentApi.del(messageId).then(response => {
          if (response.code === 1) {
            this.$message.success('删除成功！')
          } else {
            this.$message.error(response.msg)
          }
        }).then(res => {
          this.handleListComments()
        })
      } catch (e) {
        this.$message.error('Failed to delete comment', e)
      }
    },
    handleQuery() {
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListComments()
    },
    async handleListComments(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }
        await commentApi.page(this.list.params).then(response => {
          if (response.code === 1) {
            this.list.data = response.data.list
            this.list.total = response.data.totalCount
          } else {
            this.$message.error(response.msg)
          }
        });
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.list.loading = false
      }
    },
    handlePageSizeChange(current, size) {
      this.list.params.page = 0
      this.list.params.size = size
      this.handleListComments()

    },
    handleResetParam() {
      this.list.params.keyword = undefined
      this.list.params.startDate = undefined
      this.list.params.endDate = undefined
      this.list.params.status = undefined
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    disabledDate(currentDate) {
      return this.list.params.endDate ? currentDate > this.list.params.endDate : false
    },
    startDateChange(date, dateString) {
      if (dateString === '') {
        this.list.params.startDate = ''
      }
    },
    endDateChange(date, dateString) {
      if (dateString === '') {
        this.list.params.endDate = ''
      }
      if (this.list.params.endDate && this.list.params.endDate < this.list.params.startDate) {
        this.list.params.startDate = this.list.params.endDate
      }
    },
    handleStatusChange(record) {
      commentApi.edit({
        id: record.id,
        status: record.status === 0 ? 1 : 0
      }).then(response => {
        if (response.code === 1) {
          this.$message.success('修改审核状态成功！')
          record.status = (record.status === 0 ? 1 : 0)
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    async handleDeleteInBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }

      this.$confirm({
        title: '提示',
        content: '确定删除所选数据吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            commentApi.del(this.selectedRowKeys).then(response => {
              if (response.code === 1) {
                this.$message.success('删除成功！')
              } else {
                this.$message.error(response.msg)
              }
            }).then(res => {
              this.handleListComments()
            })
          } catch (e) {
            this.$message.error('Failed to delete user in batch', e)
          }
        }
      })
    },
    handleStatusChangeInBatch(){
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }

      this.$confirm({
        title: '提示',
        content: '确定审核通过选中数据吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            commentApi.pass(this.selectedRowKeys).then(response => {
              if (response.code === 1) {
                this.$message.success('审核通过成功！')
              } else {
                this.$message.error(response.msg)
              }
            }).then(res => {
              this.handleListComments()
            })
          } catch (e) {
            this.$message.error('Failed to delete user in batch', e)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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

.ant-calendar-picker {
  width: 100% !important;
}

.message-list-content {
  img {
    width: 50% !important;
  }
}

/deep/ .ant-modal-body {
  background-color: #f0f2f5 !important;
}
</style>
