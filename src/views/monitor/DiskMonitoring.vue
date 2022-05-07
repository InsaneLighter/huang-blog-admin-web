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
      <a-skeleton v-if="loading" active/>
      <a-row v-else>
        <template v-if="diskInfo && diskInfo.length>0">
          <a-col :span="8" v-for="(item,index) in diskInfo" :key=" 'diskInfo'+index ">
            <dash-chart :title="item.name" :datasource="item.restPPT"></dash-chart>
          </a-col>
        </template>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import DashChart from '@/components/chart/DashChart'
import ARow from 'ant-design-vue/es/grid/Row'
import redisApi from '@/api/redis/index'
import moment from "moment";

export default {
  name: 'DiskMonitoring',
  components: {
    ARow,
    DashChart,
  },
  data() {
    return {
      time: '',
      loading: true,
      description: '磁盘监控',
      //数据集
      diskInfo: [],
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      }
    }
  },
  created() {
    this.loadDiskInfo()
  },
  methods: {
    handleClickUpdate() {
      this.loadDiskInfo()
    },
    loadDiskInfo() {
      this.loading = true
      this.time = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
      redisApi.queryDiskInfo().then((res) => {
        if (res.code === 1) {
          this.diskInfo = res.data;
        }
      }).finally(() => this.loading = false)
    }
  }
}
</script>
