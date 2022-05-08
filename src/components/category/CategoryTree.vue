<template>
  <div>
    <a-tree
        v-if="!categories.loading"
        :checkedKeys="categoryIds"
        :treeData.sync="categories.data"
        checkStrictly
        checkable
        showLine
        defaultExpandAll
        @check="onCheck"
    >
    </a-tree>
    <a-spin v-else/>
  </div>
</template>

<script>
import categoryApi from '@/api/category/index'
export default {
  name: 'CategoryTree',
  model: {
    prop: 'categoryIds',
    event: 'check'
  },
  props: {
    categoryIds: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      categories: {
        data: [],
        loading: false
      }
    }
  },
  created() {
    this.handleListCategories()
  },
  methods: {
    async handleListCategories() {
      try {
        this.categories.loading = true
        const response = await categoryApi.queryAllTree()
        const treeData = []
        this.setExtraData(treeData, (response.data.list)[0])
        this.categories.data = treeData
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.categories.loading = false
      }
    },
    setExtraData(treeData, node) {
      node = {...node, key: node.id, title: node.name}
      treeData.push(node)
      if (node && node.children && node.children.length > 0) {
        const tempArr = node.children
        node.children = []
        tempArr.forEach(item => {
          this.setExtraData(node.children, item)
        })
      }
    },
    convertDataToTree(categories) {
      const hashMap = {}
      const treeData = []
      categories.forEach(
          category => (hashMap[category.id] = {...category, key: category.id, title: category.name, children: []})
      )
      categories.forEach(category => {
        const current = hashMap[category.id]
        if (category.parentId) {
          hashMap[category.parentId].children.push(current)
        } else {
          treeData.push(current)
        }
      })
      return treeData
    },

    onCheck(checkedKeys, e) {
      this.$emit('check', checkedKeys.checked)
    }
  }
}
</script>
