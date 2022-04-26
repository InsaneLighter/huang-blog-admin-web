<template>
  <div>
    <file-pond
      ref="pond"
      :accepted-file-types="accepts"
      :allow-multiple="multiple"
      :allowImagePreview="allowImagePreview"
      :allowRevert="false"
      :files="fileList"
      :label-idle="label"
      :maxFiles="maxFiles"
      :maxParallelUploads="maxParallelUploads"
      :name="name"
      :server="server"
      fileValidateTypeLabelExpectedTypes="请选择 {lastType} 格式的文件"
      labelFileProcessing="上传中"
      labelFileProcessingAborted="取消上传"
      labelFileProcessingComplete="上传完成"
      labelFileProcessingError="上传错误"
      labelFileTypeNotAllowed="不支持当前文件格式"
      labelTapToCancel="点击取消"
      labelTapToRetry="点击重试"
      @init="handleFilePondInit"
    >
    </file-pond>
  </div>
</template>
<script>
import Axios from 'axios'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'

// Plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

// Create component and register plugins
const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType)
export default {
  name: 'FilePondUpload',
  components: {
    FilePond
  },
  props: {
    name: {
      type: String,
      required: false,
      default: 'file'
    },
    field: {
      type: String,
      required: false,
      default: ''
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    accepts: {
      type: Array,
      required: false,
      default: () => {
        return null
      }
    },
    label: {
      type: String,
      required: false,
      default: '点击选择文件或将文件拖拽到此处'
    },
    uploadHandler: {
      type: Function,
      required: true
    }
  },
  computed: {
    maxParallelUploads() {
      return 5
    },
    allowImagePreview() {
      return true
    },
    maxFiles() {
      return 10
    }
  },
  data: function () {
    return {
      server: {
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          const CancelToken = Axios.CancelToken
          const source = CancelToken.source()
          this.uploadHandler(
            file,
            {
              onUploadProgress: progressEvent => {
                if (progressEvent.total > 0) {
                  progress(progressEvent.lengthComputable, progressEvent.loaded, progressEvent.total)
                }
              },
              cancelToken: source.token
            },
            this.field
          )
            .then(response => {
              load(response)
              this.$message.success('上传成功!')
              this.$emit('success', response, file)
            })
            .catch(failure => {
              this.$emit('failure', failure, file)
              error()
            })
          return {
            abort: () => {
              abort()
              source.cancel('Upload operation canceled by the user.')
            }
          }
        }
      },
      fileList: []
    }
  },
  methods: {
    handleFilePondInit() {
    },
    handleClearFileList() {
      this.$refs.pond.removeFiles()
    }
  }
}
</script>
