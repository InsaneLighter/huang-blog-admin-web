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
      required: false,
      default: () => []
    },
    root: {
      type: Object,
      required: false,
      default: () => {
        return {
          id: 0,
          title: '根目录',
          value: '0',
          pId: -1
        }
      }
    }
  },
  computed: {
    categoryTreeData() {
      console.log([...this.convertDataToTree(this.categories)])
      return this.categories.length > 0? [...this.convertDataToTree(this.categories)] : [this.root, ...this.convertDataToTree(this.categories)]
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
  methods: {
    handleChange() {
      this.$emit('change')
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
