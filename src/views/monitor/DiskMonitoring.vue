<template>
  <a-card title="磁盘监控">
    <a-skeleton v-if="loading" active/>
    <a-row v-else>
      <template v-if="diskInfo && diskInfo.length>0">
        <a-col :span="8" v-for="(item,index) in diskInfo" :key=" 'diskInfo'+index ">
          <dash-chart :title="item.name" :datasource="item.restPPT"></dash-chart>
        </a-col>
      </template>
    </a-row>
  </a-card>
</template>

<script>
import DashChart from '@/components/tools/DashChart'
import ARow from 'ant-design-vue/es/grid/Row'
import redisApi from '@/api/redis/index'

export default {
  name: 'DiskMonitoring',
  components: {
    ARow,
    DashChart,
  },
  data() {
    return {
      loading: true,
      description: '磁盘监控',
      //数据集
      diskInfo: []
    }
  },
  created() {
    this.loading = true
    redisApi.queryDiskInfo().then((res) => {
      if (res.code === 1) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].restPPT = res.data[i].restPPT / 10;
        }
        this.diskInfo = res.data;
      }
    }).finally(() => this.loading = false)
  }
}
</script>
