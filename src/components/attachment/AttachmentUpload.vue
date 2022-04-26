<template>
  <a-modal v-model="modalVisible" :afterClose="onClose" :footer="null" destroyOnClose title="上传附件">
    <FilePondUpload ref="upload" :uploadHandler="uploadHandler"></FilePondUpload>
  </a-modal>
</template>
<script>
import attachmentApi from '@/api/attachment/index'
import FilePondUpload from "@/components/tools/FilePondUpload";
export default {
  name: 'AttachmentUpload',
  components: {
    FilePondUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadHandler: (file, options) => attachmentApi.uploadAction(file)
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  methods: {
    onClose() {
      this.$refs.upload.handleClearFileList()
      this.$emit('close')
    }
  }
}
</script>
