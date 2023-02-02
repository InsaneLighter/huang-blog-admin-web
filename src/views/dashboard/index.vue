<template>
  <div style="padding: 1rem">
    <a-row :gutter="24">
      <a-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
        <analysis-card :number="statistics.postCount" title="文章">
          <template #action>
            <router-link :to="{ name: 'DocEdit' }">
              <a-icon type="plus"/>
            </router-link>
          </template>
        </analysis-card>
      </a-col>
      <a-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
        <analysis-card :number="statistics.journalCount" title="日记">
          <template #action>
            <router-link :to="{ name: 'Journal' }">
              <a-icon type="dash"/>
            </router-link>
          </template>
        </analysis-card>
      </a-col>
      <a-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
        <analysis-card :number="statistics.categoryCount" title="分类">
          <template #action>
            <router-link :to="{ name: 'Category' }">
              <a-icon type="dash"/>
            </router-link>
          </template>
        </analysis-card>
      </a-col>
      <a-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
        <analysis-card :number="statistics.tagCount" title="标签">
          <template #action>
            <router-link :to="{ name: 'Tag' }">
              <a-icon type="dash"/>
            </router-link>
          </template>
        </analysis-card>
      </a-col>
      <a-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
        <analysis-card :number="statistics.viewPostCount" title="阅读量">
          <template #action>
            <a-tooltip>
              <template #title>文章阅读共 {{ statistics.viewPostCount }} 次</template>
              <span>
                <a-icon type="info-circle-o"/>
              </span>
            </a-tooltip>
          </template>
        </analysis-card>
      </a-col>
      <a-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
        <analysis-card :number="statistics.establishDays" title="建立天数">
          <template #action>
            <a-tooltip>
              <template #title>博客建立于 {{ statistics.birthday }}</template>
              <span>
                <a-icon type="info-circle-o"/>
              </span>
            </a-tooltip>
          </template>
        </analysis-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24" class="mb-3">
        <TodoListCard :style="{ marginTop: '24px' }"/>
      </a-col>
      <a-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24" class="mb-3">
        <JournalPublishCard :style="{ marginTop: '24px' }"/>
      </a-col>
      <a-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24" class="mb-3">
        <Commemoration :style="{ marginTop: '24px' }"/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="最近一周访问量统计" :style="{ marginTop: '12px' }">
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
import LineChartMulti from '@/components/chart/LineChartMulti'
import HeadInfo from '@/components/tools/HeadInfo'
import statisticsApi from '@/api/statistics/index'
import JournalPublishCard from "@/components/tools/JournalPublishCard";
import TodoListCard from "@/components/tools/TodoListCard";
import Commemoration from "@/components/tools/Commemoration";
export default {
  name: "Dashboard",
  components: {
    AnalysisCard,
    LineChartMulti,
    HeadInfo,
    JournalPublishCard,
    TodoListCard,
    Commemoration
  },
  data() {
    return {
      loading: true,
      center: null,
      statistics: {
        postCount: 0,
        viewPostCount: 0,
        categoryCount: 0,
        tagCount: 0,
        establishDays: 0,
        birthday: '--'
      },
      logInfo: {
        todayIp: '1',
        todayVisitCount: '3',
        totalVisitCount: '1126'
      },
      visitFields: ['visit'],
      visitInfo: [],
      indicator: <a-icon type="loading" style="font-size: 24px" spin/>
    }
  },
  created() {
    this.loadData()
    this.loadVisitData()
  },
  methods: {
    loadData() {
      statisticsApi.statistics().then(response => {
        if(response.code === 1){
          this.statistics = response.data
        }else {
          this.$message.error(response.msg)
        }
      })
    },
    loadVisitData(){
      this.loading = true
      statisticsApi.visitStatistics().then(response => {
        if(response.code === 1){
          let data = response.data;
          this.logInfo = data.logInfo
          this.visitInfo = data.visitInfo
        }else {
          this.$message.error(response.msg)
        }
      }).finally(()=>{
        this.loading = false
      })
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
