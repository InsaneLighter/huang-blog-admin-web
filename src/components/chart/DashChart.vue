<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <v-chart :force-fit="true" :height="400" :scale="scale" :animate="false">
      <v-view :data="dataBackground" :animate="false">
        <v-coord
            type="polar"
            :startAngle="-202.5"
            :endAngle="22.5"
            :innerRadius="0.75"
            :radius="0.8"
        />
        <v-interval
            :position="'type*value'"
            :color="'#CBCBCB'"
            :size="6"
        />
      </v-view>
      <v-view :data="dataFront" :animate="false">
        <v-coord
            :type="'polar'"
            :startAngle="-202.5"
            :endAngle="22.5"
            :innerRadius="0.75"
            :radius="0.8"
        />
        <v-interval
            :position="'type*value'"
            :color="['value', '#3023AE-#53A0FD']"
            :opacity="1"
            :size="6"
        />
        <v-guide
            :type="'text'"
            :position="['50%', '65%']"
            :content="datasource + '%'"
            :vStyle="{
              fill: '#CBCBCB',
              fontSize: 25,
              textAlign: 'center',
              textBaseline: 'middle',
            }"
        />
        <v-guide
            :type="'text'"
            :position="['50%', '120%']"
            :content="title"
            :vStyle="{
              fill: '#CBCBCB',
              fontSize: 20,
              textAlign: 'center',
              textBaseline: 'middle',
            }"
        />
      </v-view>
    </v-chart>
  </div>
</template>

<script>
const scale = [{
  dataKey: 'type',
  range: [0, 1],
}, {
  dataKey: 'value',
  sync: true,
}];

const dataBackground = [];
for (let i = 0; i < 50; i++) {
  dataBackground.push({
    type: i + '',
    value: 10,
  });
}

const insideScale = [{
  dataKey: 'type',
  tickCount: 3
}];

export default {
  name: "DashChart",
  props: {
    datasource: {
      type: Number,
      default: 7
    },
    title: {
      type: String,
      default: ''
    }
  },
  created() {
    if (!this.datasource) {
      this.chartData = data;
    } else {
      this.chartData = [
        {value: this.datasource},
      ];
    }
    this.getChartData()
  },
  watch: {
    'datasource': function (val) {
      this.getChartData();
    }
  },
  methods: {
    getChartData() {
      const num = Math.round(this.datasource/2);
      for (let i = 0; i < 50; i++) {
        const item = {
          type: i + '',
          value: 10,
        };
        if (i === num) {
          item.value = 15;
        }
        if (i > num) {
          item.value = 0;
        }
        this.dataFront.push(item);
      }
    }
  },
  data() {
    return {
      height: 400,
      scale,
      dataBackground,
      dataFront: [],
      insideScale
    };
  },
};
</script>
