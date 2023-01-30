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
      </div>
      <a-divider style="margin: 10px 0 !important;"/>
      <div>
        <a-empty v-if="!list.loading && list.data.length === 0"/>
        <a-list v-else :dataSource="list.data" :loading="list.loading" :pagination="false" itemLayout="vertical">
          <template #renderItem="item, index">
            <a-list-item :key="index">
              <template #extra>
                <a-button type="link" @click="handleEdit(item)">编辑</a-button>
                <a-divider type="vertical"/>
                <a-popconfirm
                    cancelText="取消"
                    okText="确定"
                    title="你确定要删除这条日志？"
                    @confirm="handleDelete(item.id)"
                >
                  <a-button type="link">删除</a-button>
                </a-popconfirm>
              </template>

              <a-list-item-meta>
                <template #description>
                  <div class="journal-list-content" v-html="item.mood +'&nbsp;&nbsp;&nbsp;创建于'+item.createTime"></div>
                </template>
                <template #title>
                  <span>{{ item.weather || item.createTime }}</span>
                </template>
                <template #avatar>
                  <a-avatar :src="item.avatar? user.avatar : Avatar" size="large"/>
                </template>
              </a-list-item-meta>
              <div v-html="item.content" class="content"></div>
            </a-list-item>
          </template>
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
        </a-list>
      </div>
    </a-card>

    <journal-create :record="record"
                    :title="journalTitle"
                    :visible.sync="journalCreateModalVisible"
                    @close="onJournalCreateModalClose"></journal-create>
  </div>
</template>

<script>
import JournalCreate from "@/components/journal/JournalCreate";
import journalApi from '@/api/journal/index'
import Avatar from '@/assets/images/avatar.jpg'
import {mapGetters} from "vuex";

export default {
  name: "Journal",
  components: {
    JournalCreate
  },
  data() {
    return {
      Avatar: Avatar,
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
      moodList: [
        {
          mood: 'Sunny',
          description: '开心哦'
        },
        {
          mood: 'Headset',
          description: '听音乐中'
        },
        {
          mood: 'ForkSpoon',
          description: '吃饭中'
        },
        {
          mood: 'CoffeeCup',
          description: '喝咖啡哦'
        },
        {
          mood: 'ShoppingCart',
          description: '买买买'
        },
        {
          mood: 'Moon',
          description: '晚安'
        }
      ],
      journalCreateModalVisible: false,
      journalTitle: '',
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
    ...mapGetters([
      'user'
    ]),
    formTitle() {
      return this.form.model.id ? '编辑' : '发表'
    }
  },
  created() {
    this.list.params.size = this.defaultPageSize
    this.handleListJournals()
  },
  methods: {
    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async handleDelete(journalId) {
      try {
        journalApi.del(journalId).then(response => {
          if (response.code === 1) {
            this.$message.success('删除成功！')
          } else {
            this.$message.error(response.msg)
          }
        }).then(res => {
          this.handleListJournals()
        })
      } catch (e) {
        this.$message.error('Failed to delete journal', e)
      }
    },
    handleAdd() {
      this.journalCreateModalVisible = true
      this.journalTitle = "新增日记"
    },
    handleEdit(record) {
      this.journalCreateModalVisible = true
      this.journalTitle = "编辑日记"
      this.record = JSON.stringify(record)
    },
    handleQuery() {
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.handleListJournals()
    },
    async handleListJournals(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }
        await journalApi.page(this.list.params).then(response => {
          if (response.code === 1) {
            this.list.data = response.data.list
            this.showMoodDesc(this.list.data)
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
      this.handleListJournals()

    },
    handleResetParam() {
      this.list.params.keyword = undefined
      this.list.params.startDate = undefined
      this.list.params.endDate = undefined
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
    onJournalCreateModalClose() {
      this.handleListJournals()
    },
    showMoodDesc(data){
      if (data != null && data.length > 0) {
        data.forEach(i => {
          this.moodList.forEach(item => {
            if(item.mood === i.mood){
              i.mood = item.description
            }
          })
        })
      }
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

.journal-list-content {
  img {
    width: 50% !important;
  }
}

/deep/ .ant-modal-body {
  background-color: #f0f2f5 !important;
}

.content {
  word-break: break-all;
  overflow-y: auto;
  height: 150px;
}
</style>
