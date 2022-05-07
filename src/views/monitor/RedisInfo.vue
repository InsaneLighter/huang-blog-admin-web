<template>
  <div style="padding: 1rem">
    <a-card :bordered="false">
      <a-alert type="info" :showIcon="true">
        <div slot="message">
          上次更新时间：{{ this.time }}
          <a-divider type="vertical"/>
          <a @click="handleClickUpdate">立即更新</a>
        </div>
      </a-alert>
      <a-skeleton active :loading="loading" :paragraph="{rows: 17}">
        <a-card>
          <!-- Redis 信息实时监控 -->
          <a-row :gutter="8">
            <a-col :sm="24" :xl="12">
              <area-chart-ty v-bind="memory"/>
            </a-col>
            <a-col :sm="24" :xl="12">
              <area-chart-ty v-bind="key"/>
            </a-col>
          </a-row>

          <h3>Redis 详细信息</h3>
          <a-table
              :loading="tableLoading"
              :columns="columns"
              :dataSource="redisInfo"
              :pagination="false"/>

        </a-card>
      </a-skeleton>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
import AreaChartTy from '@/components/chart/AreaChartTy'
import redisApi from '@/api/redis/index'

export default {
  name: 'RedisInfo',
  components: {
    AreaChartTy
  },
  data() {
    return {
      time: '',
      loading: true,
      tableLoading: true,
      // 定时器ID
      timer: null,
      // 定时器周期
      millisec: 3000,
      // Key 实时数量
      key: {
        title: 'Redis Key 实时数量（个）',
        dataSource: [],
        y: '数量（个）',
        height: 340,
        min: 0,
        max: 100,
        color: '#FF6987',
        lineSize: 8,
        lineColor: '#DC143C'
      },
      // 内存实时占用情况
      memory: {
        title: 'Redis 内存实时占用情况（KB）',
        dataSource: [],
        y: '内存（KB）',
        min: 0,
        max: 3000,
        height: 340,
        lineSize: 8
      },
      redisInfo: [],
      columns: [{
        title: 'Key',
        align: 'center',
        dataIndex: 'key'
      }, {
        title: 'Description',
        align: 'left',
        dataIndex: 'description'
      }, {
        title: 'Value',
        align: 'center',
        dataIndex: 'value'
      }],
      path: '/monitor/redis'
    }
  },
  mounted() {
    this.openTimer()
    this.loadRedisInfo()
    setTimeout(() => {
      this.loadData()
    }, 1000)
  },
  beforeDestroy() {
    this.closeTimer()
  },
  methods: {

    /** 开启定时器 */
    openTimer() {
      this.loadData()
      this.closeTimer()
      this.timer = setInterval(() => {
        if (this.$route.path === this.path) {
          this.loadData()
        }
      }, this.millisec)
    },

    /** 关闭定时器 */
    closeTimer() {
      if (this.timer) clearInterval(this.timer)
    },

    /** 查询数据 */
    loadData() {
      Promise.all([
        redisApi.getKeysSize(),
        redisApi.memoryInfo()
      ]).then((res) => {
        let time = moment().format('HH:mm:ss')

        let [{dbSize: currentSize}, memoryInfo] = res
        let currentMemory = memoryInfo.used_memory / 1000

        // push 数据
        this.key.dataSource.push({x: time, y: currentSize})
        this.memory.dataSource.push({x: time, y: currentMemory})
        // 最大长度为6
        if (this.key.dataSource.length > 6) {
          this.key.dataSource.splice(0, 1)
          this.memory.dataSource.splice(0, 1)
        }

        // 计算 Key 最大最小值
        let keyPole = this.getMaxAndMin(this.key.dataSource, 'y')
        this.key.max = Math.floor(keyPole[0]) + 10
        this.key.min = Math.floor(keyPole[1]) - 10
        if (this.key.min < 0) this.key.min = 0

        // 计算 Memory 最大最小值
        let memoryPole = this.getMaxAndMin(this.memory.dataSource, 'y')
        this.memory.max = Math.floor(memoryPole[0]) + 100
        this.memory.min = Math.floor(memoryPole[1]) - 100
        if (this.memory.min < 0) this.memory.min = 0

      }).catch((e) => {
        console.error(e)
        this.closeTimer()
        this.$message.error('获取 Redis 信息失败')
      }).finally(() => {
        this.loading = false
      })

    },

    // 获取一组数据中最大和最小的值
    getMaxAndMin(dataSource, field) {
      let maxValue = null, minValue = null
      dataSource.forEach(item => {
        let value = Number.parseInt(item[field])
        // max
        if (maxValue == null) {
          maxValue = value
        } else if (value > maxValue) {
          maxValue = value
        }
        // min
        if (minValue == null) {
          minValue = value
        } else if (value < minValue) {
          minValue = value
        }
      })
      return [maxValue, minValue]
    },

    loadRedisInfo() {
      this.tableLoading = true
      this.time = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
      redisApi.getRedisInfo().then((response) => {
        if (response.code === 1) {
          this.redisInfo = response.data
        } else {
          this.$message.error(response.msg)
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleClickUpdate() {
      this.loadRedisInfo()
    },

  }
}
</script>
<style lang="less" scoped>
.ant-card-bordered {
  border: 0px !important;
}
</style>
