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

        <a-input-group compact>
          <a-select v-model="type" style="width: 20%">
            <a-select-option v-for="(item,index) in typeList" :key="index" :value="item.status">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search
              style="width: 80%"
              v-model="value"
              allowClear
              placeholder="想要干点什么呢"
              size="default"
              @search="addItem"
          >
            <template #enterButton>
              <a-button icon="smile"></a-button>
            </template>
          </a-input-search>
        </a-input-group>
      </div>

      <div class="todoList">
        <ul>
          <!--TODO 长度26  超过... 查看详情-->
          <li v-for="(item,index) in todoList" :key="index">
            <span class="todoContent"
                  :style="{textDecoration: item.status === 1? 'line-through':'none'}"
                  @click="completeTodoItem(item)">{{ item.content }}</span>
            <a-icon type="delete" class="deleteBtn" @click="deleteTodoItem(item,index)"></a-icon>
          </li>
          <a-empty :description="false" v-if="todoList.length === 0" style="margin-top: 5vh"/>
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
      typeList: [
        {name: "已删除", status: -1},
        {name: "待完成", status: 0},
        {name: "已完成", status: 1}
      ],
      type: 0,
      value: '',
      todoList: [
        {
          id: 1,
          content: '我最喜欢张蝶啦！',
          status: 0
        },
        {
          id: 2,
          content: '我最喜欢张蝶啦！',
          status: 0
        },
        {
          id: 3,
          content: '我最喜欢张蝶啦！',
          status: 1
        },
        {
          id: 4,
          content: '我最喜欢张蝶啦！',
          status: 0
        },
        {
          id: 5,
          content: '我最喜欢张蝶啦！',
          status: 0
        }
      ]
    }
  },
  methods: {
    addItem() {
      if (!this.value) {
        this.$message.error('输入内容为空！')
        return
      }
      this.todoList.push({content: this.value, status: 0})
      this.value = ''
    },
    completeTodoItem(item) {
      item.status = 1
    },
    deleteTodoItem(item, index) {
      this.todoList.splice(index, 1)
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
  height: 24.7vh;
  overflow-y: auto;
}

li {
  list-style: none;
  width: 98%;
  height: 4vh;
  line-height: 3.9vh;
  border: 1px solid #9b9ea0;
  margin-bottom: 20px;
  border-radius: 25px;
  padding-left: 15px;
}

li:hover {
  color: #eee;
  border-color: #eee;
  background-color: #1890ff;
  animation: fillLi 3s 1;
}

li:hover > span {
  cursor: pointer;
}

@keyframes fillLi {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.todoContent {
  margin-left: 20px;
  font-size: 1rem;
}

.deleteBtn {
  float: right;
  line-height: 4.4vh;
  margin-right: 16px;
}

.deleteBtn:hover {
  cursor: pointer;
  color: #ff6565;
}

.dash {
  float: right;
  line-height: 4.4vh;
  margin-right: 15px;
}

::-webkit-scrollbar {
  width: 6px;

}

::-webkit-scrollbar-thumb {
  background-color: #cdcdce;
  border-radius: 3px;
}
</style>
