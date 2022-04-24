<template>
  <iframe :id="id" :src="url" frameborder="0" width="100%" height="800px" scrolling="auto"></iframe>
</template>

<script>
export default {
  name: "IframePageContent",
  data() {
    return {
      url: this.$route.meta.url,
      id: ""
    }
  },
  created() {
  },
  updated() {
  },
  watch: {
  },
  methods: {

  }
}
</script>

<style>
</style>
