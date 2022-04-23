<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
  </a-card>
</template>

<script>

// import Category from '@components/category'
import categoryApi from '@/api/category/index'

export default {
  name: "CategoryList",
  components: {
    // Category
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
      defaultExpandedRowKeys: ['0']
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
        const response = await categoryApi.queryAll(this.list.params);
        this.list.total = response.data.totalCount
        this.list.data = response.data.list
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.list.loading = false
      }
    },
    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onGetCheckboxProps(record) {
      return {props: {disabled: record.id === '0'}}
    },
    /**
     * Handle page change
     */
    handlePageChange(page = 1) {
      this.list.params.page = page - 1
      this.loadData()
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(current, size) {
      this.list.params.page = 1
      this.list.params.size = size
      this.loadData()

    },
    async handleAdd() {
    },
    async handleDelete(categoryId) {
      try {
        const response = await categoryApi.queryByIds(categoryId);
        if (response.data.list.length > 0) {
          this.$message.warning("存在文章使用到该分类！")
          return
        }
        await categoryApi.del(categoryId)
        this.$message.success('删除成功！')
      } catch (e) {
        this.$message.error('Failed to delete post', e)
      } finally {
        await this.loadData()
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
            const response = await categoryApi.queryByIds(this.selectedRowKeys);
            if (response.data.list.length > 0) {
              this.$message.warning("存在文章使用到该分类！")
              return
            }
            await categoryApi.del(this.selectedRowKeys)
            this.$message.success('删除成功！')
          } catch (e) {
            this.$message.error('Failed to delete posts in batch', e)
          } finally {
            this.selectedRowKeys = []
            await this.loadData()
          }
        }
      })
    },
    handleEdit(record) {

    },
    handleAddSub(record) {

    }
  }
}
</script>

