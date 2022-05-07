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
                  <div class="journal-list-content" v-html="item.content"></div>
                </template>
                <template #title>
                  <span>{{ item.weather || item.createTime }}</span>
                </template>
                <template #avatar>
                  <a-avatar :src="item.avatar? user.avatar : Avatar" size="large"/>
                </template>
              </a-list-item-meta>
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

    <a-modal v-model="form.visible" :title="formTitle" :width="820">
      <template #footer>
        <ReactiveButton
            :errored="form.saveErrored"
            :loading="form.saving"
            erroredText="发布失败"
            loadedText="发布成功"
            text="发布"
            type="primary"
            @callback="handleSaveOrUpdateCallback"
            @click="handleSaveOrUpdate"
        ></ReactiveButton>
      </template>
      <a-form-model ref="journalForm" :model="form.model" :rules="form.rules" layout="vertical">
        <a-form-model-item prop="content">
          <div id="editor" style="height: 520px">
            <html-editor
                v-if="form.visible"
                :htmlContent.sync="form.model.content"/>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import ReactiveButton from "@/components/tools/ReactiveButton";
import HtmlEditor from "@/components/tools/Editor";
import journalApi from '@/api/journal/index'
import Avatar from '@/assets/images/avatar.jpg'
import {datetimeFormat} from '@/utils/datetime'
import {mapGetters} from "vuex";

export default {
  name: "Journal",
  components: {
    HtmlEditor,
    ReactiveButton
  },
  data() {
    return {
      Avatar: Avatar,
      columns: [
        {
          title: '天气',
          align: "center",
          dataIndex: 'weather'
        },
        {
          title: '心情',
          align: "center",
          dataIndex: 'mood'
        },
        {
          title: '日记内容',
          align: "center",
          dataIndex: 'content'
        },
        {
          title: '创建时间',
          align: "center",
          dataIndex: 'createTime'
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
          startDate: undefined,
          endDate: undefined
        },
        selected: {}
      },
      form: {
        model: {},
        rules: {
          content: [{ required: true, message: '* 内容不能为空', trigger: [] }]
        },
        visible: false,
        saving: false,
        saveErrored: false,
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
    handleEdit: function (record) {
      debugger
      this.form.model = record
      this.form.visible = true
    },
    handleAdd: function () {
      this.form.visible = true
      this.form.model = {
        content: ''
      }
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
        if(this.list.params.startDate){
          this.list.params.startDate = datetimeFormat(this.list.params.startDate,'YYYY-MM-DD')
        }
        if(this.list.params.endDate){
          this.list.params.endDate = datetimeFormat(this.list.params.endDate,'YYYY-MM-DD')
        }
        await journalApi.page(this.list.params).then(response => {
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
      this.handleListJournals()

    },
    handleResetParam() {
      this.list.params.keyword = undefined
      this.selectedRowKeys = []
      this.handlePageChange(1)
    },
    disabledDate(currentDate) {
      return this.list.params.endDate ? currentDate > this.list.params.endDate : false
    },
    endDateChange() {
      if (this.list.params.endDate < this.list.params.startDate) {
        this.list.params.startDate = this.list.params.endDate
      }
    },
    handleOpenEditModal() {

    },
    handleSaveOrUpdate(){
      const _this = this
      _this.$refs.journalForm.validate(valid => {
        if (valid) {
          _this.form.saving = true
          if (_this.form.model.id) {
            journalApi.edit(_this.form.model)
                .then(response => {
                  if(response.code === 1){
                    _this.$message.success('修改成功！')
                  }else {
                    _this.$message.error(response.msg)
                  }
                })
                .catch(() => {
                  _this.form.saveErrored = true
                })
                .finally(() => {
                  setTimeout(() => {
                    _this.form.saving = false
                  }, 400)
                })
          } else {
            journalApi.add(_this.form.model)
                .then(response => {
                  if(response.code === 1){
                    _this.$message.success('新增日记成功！')
                  }else {
                    _this.$message.error(response.msg)
                  }
                })
                .catch(() => {
                  _this.form.saveErrored = true
                })
                .finally(() => {
                  setTimeout(() => {
                    _this.form.saving = false
                  }, 400)
                })
          }
        }
      })
    },
    handleSaveOrUpdateCallback(){
      if (this.form.saveErrored) {
        this.form.saveErrored = false
      } else {
        this.form.visible = false
        this.handleListJournals()
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
</style>
