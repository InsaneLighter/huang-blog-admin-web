<template>
  <a-card :body-style="{ padding: '24px' }" :bordered="false">
    <div class="analysis-card-container">
      <div class="meta">
        <span class="analysis-card-title">
          <slot name="title">{{ title }}</slot>
        </span>
        <span class="analysis-card-action">
          <slot name="action"></slot>
        </span>
      </div>
      <div class="number">
        <slot name="number">
          <countTo
              :autoplay="true"
              :duration="3000"
              :endVal="(typeof number === 'function' && number()) || number"
              :startVal="startNumber"
          ></countTo>
        </slot>
      </div>
    </div>
  </a-card>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'AnalysisCard',
  components: {
    countTo
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    number: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      startNumber: 0
    }
  },
  watch: {
    number: function (newValue, oldValue) {
      this.startNumber = oldValue
    }
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  .ant-card-head {
    padding: 0 16px !important;

    .ant-card-head-wrapper {
      .ant-card-head-title {
        padding: 12px 0 !important;
      }
    }
  }
}

.analysis-card-container {
  position: relative;
  overflow: hidden;
  width: 100%;

  .meta {
    position: relative;
    overflow: hidden;
    width: 100%;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;

    .analysis-card-action {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .number {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: #000;
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 32px;
    line-height: 38px;
    height: 38px;
  }
}

</style>
