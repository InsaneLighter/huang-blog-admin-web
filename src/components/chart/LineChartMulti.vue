<template>
  <div>
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale" >
      <v-tooltip/>
      <v-axis/>
      <v-legend/>
      <v-line position="type*y" color="x"/>
      <v-point position="type*y" color="x" :size="4" :v-style="style" :shape="'circle'"/>
    </v-chart>
  </div>
</template>

<script>
import { DataSet } from '@antv/data-set'

export default {
  name: 'LineChartMulti',
  mixins: [],
  props: {
    title: {
      type: String,
      default: ''
    },
    dataSource: {
      type: Array,
      default: () => [
      ]
    },
    fields: {
      type: Array,
      default: () => []
    },
    // 别名，需要的格式：[{field:'name',alias:'姓名'}, {field:'sex',alias:'性别'}]
    aliases:{
      type: Array,
      default: () => [{field:'visit',alias:'访客数'}]
    },
    height: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      scale: [{
        type: 'cat',
        dataKey: 'x',
        min: 0,
        max: 1
      }],
      style: { stroke: '#fff', lineWidth: 1 }
    }
  },
  computed: {
    data() {
      const dv = new DataSet.View().source(this.dataSource)
      dv.transform({
        type: 'fold',
        fields: this.fields,
        key: 'x',
        value: 'y'
      })
      let rows =  dv.rows
      // 替换别名
      rows.forEach(row => {
        for (let item of this.aliases) {
          if (item.field === row.x) {
            row.x = item.alias
            break
          }
        }
      })
      return rows
    }
  }
}
</script>

<style scoped>

</style>
