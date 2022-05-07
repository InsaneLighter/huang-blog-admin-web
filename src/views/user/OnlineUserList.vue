<template>
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
    <div class="table-operator" style="margin-bottom: 1rem">
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleKickOutInBatch">
            <a-icon type="delete"/>
            强退
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
          :rowKey="onlineUser => onlineUser.token"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange
          }">
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定强制退出该用户吗?" @confirm="() => handleKickOut(record.token)">
            <a>强退</a>
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
  </a-card>
</template>

<script>
import userApi from '@/api/user/index'
export default {
  name: "OnlineUserList",
  data() {
    return {
      columns: [
        {
          title: '用户名',
          align: "center",
          dataIndex: 'username'
        },
        {
          title: 'IP',
          align: "center",
          dataIndex: 'ip'
        },
        {
          title: '登录地点',
          align: "center",
          dataIndex: 'address'
        },
        {
          title: '浏览器',
          align: "center",
          dataIndex: 'browser'
        },
        {
          title: '登录时间',
          align: "center",
          dataIndex: 'loginTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          scopedSlots: {customRender: 'action'},
        }
      ],
      list: {
        data: [],
        loading: false,
        total: 0,
        params: {
          page: 0,
          size: 10,
          keyword: undefined
        },
        selected: {}
      },
      selectedRowKeys: [],
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
  },
  created() {
    this.list.params.size = this.defaultPageSize
    this.loadData()
  },
  methods: {
    async loadData(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }
        await userApi.queryAllOnlineUser(this.list.params).then(response => {
          if (response.code === 1) {
            this.list.total = response.data.totalCount
            this.list.data = response.data.list
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.list.loading = false
        this.selectedRowKeys = []
      }
    },
    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async handleKickOut(categoryId) {
      try {
        userApi.kickOut(categoryId).then(response => {
          if (response.code === 1) {
            this.$message.success('强制退出用户成功！')
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (e) {
        this.$message.error('强制退出用户失败 ', e)
      }finally {
        const _this = this
        setTimeout(function () {
          _this.loadData()
        },1000)
      }
    },
    async handleKickOutInBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }
      this.$confirm({
        title: '提示',
        content: '确定强制退出所选用户吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            userApi.kickOut(this.selectedRowKeys).then(response => {
              if (response.code === 1) {
                this.$message.success('强制退出用户成功！')
              } else {
                this.$message.error(response.msg)
              }
            })
          } catch (e) {
            this.$message.error('强制退出用户失败 ', e)
          }finally {
            const _this = this
            setTimeout(function () {
              _this.loadData()
            },1000)
          }
        }
      })
    },
    handlePageSizeChange(current, size) {
      this.list.params.page = 0
      this.list.params.size = size
      this.loadData()
    },
    handleResetParam() {
      this.list.params.keyword = undefined
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    handleQuery() {
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.loadData()
    },
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
