<template>
  <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
    <template #title>
      待办事项
      <a-tooltip title="今天要完成的工作哦">
        <a-icon class="cursor-pointer hover:text-blue-400 transition-all" type="info-circle-o"/>
      </a-tooltip>
    </template>
  </a-card>
</template>

<script>
export default {
  name: "TodoListCard"
}
</script>

<style scoped>

</style>
