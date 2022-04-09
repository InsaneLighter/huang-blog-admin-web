<template>
  <div class="footer" v-html="$store.state.settings.footerTxt">
  </div>
</template>

<script>
export default {
  name: "GlobalFooter"
}
</script>

<style lang="less" scoped>
.footer {
  background: none repeat scroll 0 0 white;
  border-top: 1px solid #e7eaec;
  overflow: hidden;
  padding: 8px 6px 0 6px;
  height: 33px;
  font-size: 0.7rem !important;
  letter-spacing: 0.8px;
  font-family: Arial, sans-serif !important;
  position: fixed;
  bottom: 0;
  z-index: 99;
  width: 100%;
  text-align: center;
}

</style>
