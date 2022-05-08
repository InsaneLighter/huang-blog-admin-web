<template>
  <div style="padding: 1rem">
    <a-card :bordered="false">
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
            :rowKey="category => category.id"
            :defaultExpandedRowKeys="defaultExpandedRowKeys"
            :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange,
            getCheckboxProps:onGetCheckboxProps
          }">
        <span v-if="record.id !== '0'" slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a @click="handleAddSub(record)">添加下级</a>
        </span>
        </a-table>
      </div>

      <!--    <category ref="modalForm" @ok="modalFormOk"></category>-->
      <CategoryCreate :operate="operate"
                      :record="record"
                      :title="categoryTitle"
                      :visible.sync="categoryCreateModalVisible"
                      @close="onCategoryCreateModalClose"/>
    </a-card>
  </div>
</template>

<script>

import categoryApi from '@/api/category/index'
import CategoryCreate from "@/components/category/CategoryCreate"

export default {
  name: "CategoryList",
  components: {
    CategoryCreate
  },
  data() {
    return {
      columns: [
        {
          title: '分类名称',
          align: "left",
          dataIndex: 'name'
        },
        {
          title: '描述',
          align: "left",
          dataIndex: 'description'
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
          title: undefined,
          categoryId: undefined,
          status: []
        },
        selected: {}
      },
      selectedRowKeys: [],
      defaultExpandedRowKeys: ['0'],
      categoryCreateModalVisible: false,
      operate: false,
      record: {},
      categoryTitle: ''
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData(enableLoading = true) {
      try {
        if (enableLoading) {
          this.list.loading = true
        }
        await categoryApi.queryAllTree(this.list.params).then(response => {
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
    onGetCheckboxProps(record) {
      return {props: {disabled: record.id === '0'}}
    },
    onCategoryCreateModalClose() {
      this.loadData()
    },
    async handleDelete(categoryId) {
      let flag = true
      try {
        await categoryApi.queryByIds(categoryId).then(response => {
          if (response.code === 1) {
            if (response.data.list.length > 0) {
              this.$message.warning("存在文章使用到该分类！")
              flag = false
              return
            }
            if (!response.hasChildren) {
              this.$message.warning("选中分类含子节点！")
              flag = false
            }
          } else {
            this.$message.error(response.msg)
          }
        }).then(res => {
          if (flag) {
            categoryApi.del(categoryId).then(response => {
              if (response.code === 1) {
                this.$message.success('删除成功！')
              } else {
                this.$message.error(response.msg)
              }
            }).finally(() => {
              this.loadData()
            })
          }
        })
      } catch (e) {
        this.$message.error('Failed to delete post', e)
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
        content: '确定删除所选的分类吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await categoryApi.queryByIds(this.selectedRowKeys).then(response => {
              if (response.code === 1) {
                if (response.data.list.length > 0) {
                  this.$message.warning("存在文章使用到该分类！")
                  flag = false
                }
                if (!response.hasChildren) {
                  this.$message.warning("选中分类含子节点！")
                  flag = false
                }
              } else {
                this.$message.error(response.msg)
              }
            }).then(res => {
              if (flag) {
                categoryApi.del(this.selectedRowKeys).then(response => {
                  if (response.code === 1) {
                    this.$message.success('删除成功！')
                  } else {
                    this.$message.error(response.msg)
                  }
                }).finally(() => {
                  this.loadData()
                })
              }
            })
          } catch (e) {
            this.$message.error('Failed to delete posts in batch', e)
          }
        }
      })
    },
    handleAdd() {
      this.categoryCreateModalVisible = true
      this.operate = false
      this.categoryTitle = "新增分类"
    },
    handleEdit(record) {
      this.categoryCreateModalVisible = true
      this.operate = true
      this.categoryTitle = "编辑分类"
      const tempRecord = record;
      this.record = tempRecord
    },
    handleAddSub(record) {
      this.categoryCreateModalVisible = true
      this.operate = true
      this.record = record
      this.categoryTitle = "添加子分类"
    }
  }
}
</script>

