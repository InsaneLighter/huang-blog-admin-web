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
          <a-select v-model="status" style="width: 20%">
            <a-select-option v-for="(item,index) in statusList" :key="index" :value="item.status">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search
              style="width: 80%"
              v-model="value"
              :max-length="parseInt('50')"
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
          <li v-for="(item,index) in todoList" :key="index">
            <span class="todoContent"
                  :style="{textDecoration: item.status === 1? 'line-through':'none'}"
                  @click="completeTodoItem(item)">{{ item.content.length > 20 ? item.content.substr(0,20)+"...":item.content }}</span>
            <a-icon type="delete" class="deleteBtn" @click="deleteTodoItem(item)" v-if="item.status === 0 || item.status === -1"></a-icon>
            <a-icon type="redo" class="toolIcon" @click="redoTodoItem(item)" v-if="item.status === 1"></a-icon>
            <a-icon type="undo" class="toolIcon" @click="redoTodoItem(item)" v-if="item.status === -1"></a-icon>
            <a-tooltip placement="top" v-if="item.content.length > 20">
              <template #title>
                <span>{{ item.content }}</span>
              </template>
              <a-icon type="ellipsis" class="toolIcon"></a-icon>
            </a-tooltip>
          </li>
          <a-empty :description="false" v-if="todoList.length === 0" style="margin-top: 5vh"/>
        </ul>
      </div>
    </div>
  </a-card>
</template>

<script>
import todoApi from '@/api/todo/index'
export default {
  name: "TodoListCard",
  data() {
    return {
      statusList: [
        {name: "全部", status: 9},
        {name: "待完成", status: 0},
        {name: "已完成", status: 1},
        {name: "回收站", status: -1}
      ],
      status: 0,
      value: '',
      todoList: [
      ]
    }
  },
  watch: {
    status(value) {
        this.loadData()
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData(){
      try {
        todoApi.queryAll({status: this.status}).then(response => {
          if (response.code === 1) {
            this.todoList = response.data
          }else {
            this.$message.error(response.msg)
          }
        })
      } catch (e) {
        this.$message.error('Failed to load list', e)
      }
    },
    addItem() {
      if (!this.value) {
        this.$message.error('输入内容为空！')
        return
      }
      try {
        todoApi.add({content:this.value,status: 0}).then(response => {
          if (response.code === 1) {
            this.$message.success('添加待办任务成功！')
          } else {
            this.$message.error(response.msg)
          }
        }).then(res => {
          this.loadData()
          this.value = ''
        })
      } catch (e) {
        this.$message.error('Failed to add task', e)
      }
    },
    completeTodoItem(item) {
      try {
        todoApi.edit({id:item.id,status:1}).then(response => {
          if (response.code === 1) {
            this.$message.success('完成任务！')
          } else {
            this.$message.error(response.msg)
          }
        }).then(res => {
          this.loadData()
        })
      } catch (e) {
        this.$message.error('Failed to complete task', e)
      }
    },
    deleteTodoItem(item) {
      try {
        if(item.status === -1){
          this.$confirm({
            title: '提示',
            content: '确定删除该任务？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              todoApi.del(item.id).then(response => {
                if (response.code === 1) {
                  this.$message.success('删除任务成功！')
                } else {
                  this.$message.error(response.msg)
                }
              }).then(res => {
                this.loadData()
              })
            }
          })
        }else {
          todoApi.edit({id:item.id,status:-1}).then(response => {
            if (response.code === 1) {
              this.$message.success('加入回收站成功！')
            } else {
              this.$message.error(response.msg)
            }
          }).then(res => {
            this.loadData()
          })
        }
      } catch (e) {
        this.$message.error('Failed to complete task', e)
      }
    },
    redoTodoItem(item){
      try {
        todoApi.edit({id:item.id,status:0}).then(response => {
          if (response.code === 1) {
            this.$message.success('重新添加任务成功！')
          } else {
            this.$message.error(response.msg)
          }
        }).then(res => {
          this.loadData()
        })
      } catch (e) {
        this.$message.error('Failed to complete task', e)
      }
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
  height: 230px;
  overflow-y: auto;
}

li {
  list-style: none;
  width: 98%;
  height: 40px;
  line-height: 40px;
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
  line-height: 43px;
  margin-right: 16px;
}

.deleteBtn:hover {
  cursor: pointer;
  color: #ff6565;
}

.toolIcon {
  float: right;
  line-height: 43px;
  margin-right: 15px;
}
.toolIcon:hover {
  color: #ff8e65;
}

::-webkit-scrollbar {
  width: 6px;

}

::-webkit-scrollbar-thumb {
  background-color: #cdcdce;
  border-radius: 3px;
}
</style>
