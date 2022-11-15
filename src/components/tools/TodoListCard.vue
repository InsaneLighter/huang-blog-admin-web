<template>
  <a-card :bodyStyle="{ padding: '16px' }" :bordered="false">
    <template #title>
      待办事项
      <a-tooltip title="今天要完成的工作哦">
        <a-icon class="cursor-pointer hover:text-blue-400 transition-all" type="info-circle-o"/>
      </a-tooltip>
    </template>
    <div class="todoContainer">
      <div class="addItem">
        <a-input-search
            v-model="value"
            placeholder="input search text"
            size="default"
            @search="addItem"
            @keyup.enter.native="addItem"
        >
          <template #enterButton>
            <a-button icon="smile"></a-button>
          </template>
        </a-input-search>
      </div>

      <div class="todoList">
        <ul>
          <!--TODO 长度26  超过... 查看详情-->
          <li>
            <a-checkbox></a-checkbox>
            <span class="todoContent">我最喜欢张蝶了</span>
            <a-icon type="delete" class="deleteBtn"></a-icon>
          </li>
          <li>
            <a-checkbox></a-checkbox>
            <span class="todoContent" title="我最喜欢张蝶了我最喜欢张蝶了我最喜欢张蝶我最喜欢张蝶了我最喜欢张蝶了我最喜欢张蝶我最喜欢张蝶了我最喜欢张蝶了我最喜欢张蝶">我最喜欢张蝶了我最喜欢张蝶了我最喜欢张蝶...</span>
            <a-icon type="delete" class="deleteBtn"></a-icon>
            <a-icon type="dash" class="dash"></a-icon>
          </li><li>
          <a-checkbox></a-checkbox>
          <span class="todoContent">我最喜欢张蝶了</span>
          <a-icon type="delete" class="deleteBtn"></a-icon>
        </li><li>
          <a-checkbox></a-checkbox>
          <span class="todoContent">我最喜欢张蝶了</span>
          <a-icon type="delete" class="deleteBtn"></a-icon>
        </li>
        </ul>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: "TodoListCard",
  data() {
    return {
      value: 1
    }
  },
  methods: {
    addItem() {

    }
  }
}
</script>

<style scoped>
.todoContainer {
  width: 100%;
}

.addItem, .todoList {
  width: 100%;
}
.todoList {
  margin-top: 16px;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  width: 100%;
  height: 8vh;
  line-height: 8vh;
  border: 1px solid #9b9ea0;
  margin-bottom: 21px;
  border-radius: 25px;
  padding-left: 15px;
}
.todoContent {
  margin-left: 20px;
  font-size: 1rem;
}
.deleteBtn {
  float: right;
  line-height: 8.5vh;
  margin-right: 16px;
}
.dash {
  float: right;
  line-height: 8.5vh;
  margin-right: 15px;
}
</style>
