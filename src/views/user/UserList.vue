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
    <div class="table-operator">
      <a-button @click="handleAdd" style="margin-bottom: 1rem" type="primary" icon="plus">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleDeleteInBatch">
            <a-icon type="delete"/>
            删除
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
          <a-switch v-model:checked="record.status === 0"
                    checked-children="正常" un-checked-children="禁用"
                    @click="handleStatusChange(record)"/>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="record.id !== '0'" type="vertical"/>
          <a-popconfirm v-if="record.id !== '0'" title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <a-divider v-if="record.id !== '0'" type="vertical"/>
          <a-popconfirm v-if="record.id !== '0'" title="确定重置密码吗?" @confirm="() => handleResetPWD(record)">
            <a>重置密码</a>
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

    <user ref="modalForm" @ok="modalFormOk"></user>
  </a-card>
</template>

<script>
import userApi from '@/api/user/index'
import User from "@/views/user/User";

export default {
  name: "UserList",
  components: {
    User
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
          title: '邮件',
          align: "center",
          dataIndex: 'email'
        },
        {
          title: '个人签名',
          align: "center",
          dataIndex: 'description'
        },
        {
          title: '生日',
          align: "center",
          dataIndex: 'birthday'
        },
        {
          title: '状态',
          align: "center",
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'}
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
          keyword: undefined,
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
  },
  created() {
    this.list.params.size = this.defaultPageSize
    this.handleListUsers()
  },
  methods: {
    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onGetCheckboxProps(record) {
      return {props: {disabled: record.id === '0'}}
    },
    onCategoryCreateModalClose() {
      this.loadData()
    },
    async handleDelete(userId) {
      try {
        userApi.del(userId).then(response => {
          if (response.code === 1) {
            this.$message.success('删除成功！')
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (e) {
        this.$message.error('Failed to delete user', e)
      } finally {
        this.loadData()
      }
    },
    async handleDeleteInBatch() {
      let flag = true
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }

      this.$confirm({
        title: '提示',
        content: '确定删除所选用户吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            userApi.del(this.selectedRowKeys).then(response => {
              if (response.code === 1) {
                this.$message.success('删除成功！')
              } else {
                this.$message.error(response.msg)
              }
            })
          } catch (e) {
            this.$message.error('Failed to delete user in batch', e)
          } finally {
            await this.loadData()
          }
        }
      })
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },
    modalFormOk() {
      this.handleQuery()
    },
    handleQuery() {
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListUsers()
    },
    async handleListUsers(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }
        await userApi.page(this.list.params).then(response => {
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
      this.handleListUsers()

    },
    handleResetParam() {
      this.list.params.keyword = undefined
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    handleStatusChange(record) {
      userApi.edit({
        id: record.id,
        status: record.status === 0 ? 1 : 0
      }).then(response => {
        if (response.code === 1) {
          this.$message.success('修改状态成功！')
          record.status = (record.status === 0 ? 1 : 0)
        } else {
          this.$message.error(response.msg)
        }
      }).then(res => {
        if (record.status === 1) {
          userApi.kickOutForUsername({username: record.username}).then(response => {
            if (response.code !== 1) {
              this.$message.error('用户强制退出失败！')
            }
          })
        }
      })
    },
    handleResetPWD(record) {
      userApi.resetPwd({id: record.id}).then(response => {
        if (response.code === 1) {
          this.$message.success('重置密码成功！')
        } else {
          this.$message.error(response.msg)
        }
      }).then(res => {
        if (record.status === 1) {
          userApi.kickOutForUsername({username: record.username}).then(response => {
            if (response.code !== 1) {
              this.$message.error('用户强制退出失败！')
            }
          })
        }
      })
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
