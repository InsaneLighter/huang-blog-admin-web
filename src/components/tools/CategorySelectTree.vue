<template>
  <a-tree-select
      :allowClear="true"
      :treeData="categoryTreeData"
      :treeDataSimpleMode="true"
      v-model="categoryIdString"
      placeholder="请选择上级目录，默认为顶级目录"
      treeDefaultExpandAll
      @change="handleChange"
  >
  </a-tree-select>
</template>

<script>
export default {
  name: 'CategorySelectTree',
  props: {
    categoryId: {
      type: String,
      required: true,
      default: '0'
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  watch: {
    categories(value){ //n为新值,o为旧值;
      console.log(value)
    }
  },
  computed: {
    categoryTreeData() {
      let treeData = []
      this.setExtraData(treeData, this.categories[0])
      return treeData
    },
    categoryIdString: {
      get() {
        return this.categoryId.toString()
      },
      set(value) {
        this.$emit('update:categoryId', value ? value : '0')
      }
    }
  },
  created() {
    this.$emit('update:categoryId', this.categoryId.toString() ? this.categoryId.toString() : '0')
  },
  methods: {
    handleChange() {
      this.$emit('change')
    },
    setExtraData(treeData, node) {
      node = {...node, key: node.id, title: node.name,value: node.id}
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
          category =>
              (hashMap[category.id] = {
                ...category,
                title: category.name,
                value: category.id.toString(),
                pId: category.parentId,
                children: []
              })
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
    }
  }
}
</script>
