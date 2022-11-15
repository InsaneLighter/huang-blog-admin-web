<template>
  <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
    <template #title>
      待办事项
      <a-tooltip title="今天要完成的工作哦">
        <a-icon class="cursor-pointer hover:text-blue-400 transition-all" type="info-circle-o"/>
      </a-tooltip>
      <a-icon type="plus" class="add" @click="openAddPage"/>
    </template>
  </a-card>
</template>

<script>
export default {
  name: "TodoListCard",
  methods: {
    openAddPage(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
.add {
  cursor: pointer;
  float: right;
}
</style>
