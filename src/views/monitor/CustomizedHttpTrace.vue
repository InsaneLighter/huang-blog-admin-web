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
                    valueFormat=""
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="结束日期：">
                <a-date-picker
                    v-model:value="list.params.endDate"
                    @change="endDateChange"
                    placeholder="结束日期"
                />
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
      <div>
        <a-table
            :columns="columns"
            :dataSource="list.data"
            :loading="list.loading"
            :pagination="false"
            :rowKey="log => log.id"
            :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange
          }">
          <template slot="timeTaken" slot-scope="text">
            <a-tag v-if="text < 500" color="green">{{ text }} ms</a-tag>
            <a-tag v-else-if="text < 1000" color="cyan">{{ text }} ms</a-tag>
            <a-tag v-else-if="text < 1500" color="orange">{{ text }} ms</a-tag>
            <a-tag v-else color="red">{{ text }} ms</a-tag>
          </template>

          <template slot="requestMethod" slot-scope="text">
            <a-tag v-if="text === 'GET'" color="#87d068">{{ text }}</a-tag>
            <a-tag v-else-if="text === 'POST'" color="#2db7f5">{{ text }}</a-tag>
            <a-tag v-else-if="text === 'PUT'" color="#ffba5a">{{ text }}</a-tag>
            <a-tag v-else-if="text === 'DELETE'" color="#f50">{{ text }}</a-tag>
            <span v-else>{{ text }} ms</span>
          </template>


          <template slot="requesParams"
                    slot-scope="text, record">
            <div :title="text"
                 :style="{maxWidth: '200px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            wordWrap: 'break-word',
            wordBreak: 'break-all' }"
            >{{ text }}
            </div>
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
import logApi from '@/api/log/index'
import moment from "moment";

export default {
  name: "log",
  data() {
    return {
      columns: [
        {
          title: '请求时间',
          align: "center",
          dataIndex: 'createTime',
          customRender(text) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: '请求方法',
          align: "center",
          dataIndex: 'requestType',
          scopedSlots: {customRender: 'requestMethod'},
          filters: [
            {text: 'GET', value: 'GET'},
            {text: 'POST', value: 'POST'},
            {text: 'PUT', value: 'PUT'},
            {text: 'DELETE', value: 'DELETE'}
          ],
          filterMultiple: true,
          onFilter: (value, record) => record.request.method.includes(value)
        },
        {
          title: '请求地址',
          align: "center",
          dataIndex: 'uri',
          customRender(text) {
            return text.split('?')[0]
          }
        },
        {
          title: '请求参数',
          align: "center",
          dataIndex: 'params',
          scopedSlots: {customRender: 'requesParams'}
        },
        {
          title: '请求IP',
          align: "center",
          dataIndex: 'requestIp'
        },
        {
          title: 'IP来源',
          align: "center",
          dataIndex: 'address'
        },
        {
          title: '浏览器',
          align: "center",
          dataIndex: 'browser'
        },
        {
          title: '异常详情',
          align: "center",
          dataIndex: 'exceptionDetail'
        },
        {
          title: '请求耗时',
          align: "center",
          dataIndex: 'time',
          scopedSlots: {customRender: 'timeTaken'}
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
          endDate: undefined
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
    }
  },
  created() {
    this.list.params.size = this.defaultPageSize
    this.loadData()
  },
  methods: {
    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async handleDeleteInBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }
      this.$confirm({
        title: '提示',
        content: '确定删除所选日志吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            logApi.del(this.selectedRowKeys).then(response => {
              if (response.code === 1) {
                this.$message.success('删除成功！')
              } else {
                this.$message.error(response.msg)
              }
            }).then(res => {
              this.loadData()
            })
          } catch (e) {
            this.$message.error('Failed to delete log in batch', e)
          }
        }
      })
    },
    handleQuery() {
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.loadData()
    },
    async loadData(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }
        await logApi.page(this.list.params).then(response => {
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
      this.loadData()

    },
    handleResetParam() {
      this.list.params.keyword = undefined
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

.ant-calendar-picker {
  width: 100% !important;
}
</style>
