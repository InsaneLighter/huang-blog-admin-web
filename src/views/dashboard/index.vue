<template>
  <div>
    <a-row :gutter="12">
      <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
        <analysis-card :number="statisticsData.postCount" title="文章">
          <template #action>
            <router-link :to="{ name: 'Dashboard' }">
              <a-icon type="plus"/>
            </router-link>
          </template>
        </analysis-card>
      </a-col>
      <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
        <analysis-card :number="statisticsData.visitCount" title="阅读量">
          <template #action>
            <a-tooltip>
              <template #title>文章阅读共 {{ statisticsData.visitCount }} 次</template>
              <span>
                <a-icon type="info-circle-o"/>
              </span>
            </a-tooltip>
          </template>
        </analysis-card>
      </a-col>
      <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
        <analysis-card :number="statisticsData.establishDays" title="建立天数">
          <template #action>
            <a-tooltip>
              <template #title>博客建立于 {{ statisticsData.birthday }}</template>
              <span>
                <a-icon type="info-circle-o"/>
              </span>
            </a-tooltip>
          </template>
        </analysis-card>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="最近一周访问量统计" :style="{ marginTop: '24px' }">
          <a-row>
            <a-col :span="6">
              <head-info title="今日IP" :content="logInfo.todayIp"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="environment" style="font-size: 24px"/>
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="今日访问" :content="logInfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 24px"/>
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="总访问量" :content="logInfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 24px"/>
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multi :fields="visitFields" :dataSource="visitInfo"></line-chart-multi>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import AnalysisCard from '@/components/tools/AnalysisCard'
import LineChartMulti from '@/components/tools/LineChartMulti'
import HeadInfo from '@/components/tools/HeadInfo'

export default {
  name: "Dashboard",
  components: {
    AnalysisCard,
    LineChartMulti,
    HeadInfo
  },
  data() {
    return {
      loading: true,
      center: null,
      statisticsData: {
        postCount: 7,
        visitCount: 7,
        establishDays: 7,
        birthday: '2022-04-01 19:13'
      },
      logInfo: {
        todayIp: '1',
        todayVisitCount: '3',
        totalVisitCount: '1126'
      },
      visitFields: ['visit'],
      visitInfo: [
        {
          type: "04-10",
          visit: 422
        },
        {
          type: "04-11",
          visit: 123
        },
        {
          type: "04-12",
          visit: 3213
        },
        {
          type: "04-13",
          visit: 3213
        },
        {
          type: "04-14",
          visit: 311
        },
        {
          type: "04-15",
          visit: 321
        }
        ],
      indicator: <a-icon type="loading" style="font-size: 24px" spin/>
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.initLogInfo();
  },
  methods: {
    initLogInfo() {
    }
  }
}
</script>

<style lang="less" scoped>
.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    font-size: .95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }

  p {
    line-height: 42px;
    margin: 0;

    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>
