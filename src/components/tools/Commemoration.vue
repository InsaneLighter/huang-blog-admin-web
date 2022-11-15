<template>
  <div class="container">
    <div class="head">距离2022年2月12日已经过了</div>
    <a-divider></a-divider>
    <div class="content" >{{result}}</div>
    <canvas id="heartBeat"></canvas>
  </div>
</template>

<script>
import {heartBeat} from "@/utils/heartBeat";
export default {
  name: "Commemoration",
  data(){
    return {
      result: ''
    }
  },
  created() {
    this.timingTime()
    this.calculateDate()
  },
  mounted() {
    heartBeat()
  },
  methods: {
    timingTime(){
      let start = '2022-2-14'
      let startTime = new Date(start).getTime()
      let currentTime = new Date().getTime()
      let difference = currentTime - startTime
      let m =  Math.floor(difference / (1000))
      let mm = m % 60  // 秒
      let f = Math.floor(m / 60)
      let ff = f % 60 // 分钟
      let s = Math.floor(f/ 60) // 小时
      let ss = s % 24
      let day = Math.floor(s  / 24 ) // 天数
      return day + "天" + ss + "时" + ff + "分" + mm +'秒'
    },
    calculateDate(){
      setInterval(()=>{
        this.result = this.timingTime()
      },1000)
    }
  }
}
</script>

<style scoped>
.container {
  height: 366px;
  background: #fff;
}
.head,.content {
  text-align: center;
  margin: 0;
  padding: 16px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  border-radius: 2px;
  transition: all 0.3s;
}
.head {
  font-size: 1.5rem;
  line-height: 6rem;
  height: 30%;
}
.content {
  font-size: 1.2rem;
  height: 20%;
}
#heartBeat {
  width: 100%;
  height: 100px;
}
</style>