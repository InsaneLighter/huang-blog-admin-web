<template>
  <div class="img">
    <a-upload
        name="file"
        listType="picture-card"
        :multiple="isMultiple"
        :action="uploadAction"
        :headers="headers"
        :data="{biz:bizPath}"
        :fileList="fileList"
        :beforeUpload="beforeUpload"
        :disabled="disabled"
        :isMultiple="isMultiple"
        @change="handleChange"
        @preview="handlePreview"
        :class="[!isMultiple?'imgupload':'', (!isMultiple && picUrl)?'image-upload-single-over':'' ]">
      <div>
        <!--<img v-if="!isMultiple && picUrl" :src="getAvatarView()" style="width:100%;height:100%"/>-->
        <div class="iconp">
          <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
          <div class="ant-upload-text">{{ text }}</div>
        </div>
      </div>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel()">
        <img alt="example" style="width: 100%" :src="previewImage"/>
      </a-modal>
    </a-upload>
  </div>
</template>

<script>
const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10);
}
const getFileName = (path) => {
  if (path.lastIndexOf("\\") >= 0) {
    let reg = new RegExp("\\\\", "g");
    path = path.replace(reg, "/");
  }
  return path.substring(path.lastIndexOf("/") + 1);
}
import { getToken } from "@/utils/auth";
export default {
  name: 'ImageUpload',
  data() {
    return {
      uploadAction: "/api/attachment/upload",
      uploadLoading: false,
      picUrl: false,
      headers: {},
      fileList: [],
      previewImage: "",
      previewVisible: false,
    }
  },
  props: {
    text: {
      type: String,
      required: false,
      default: "上传"
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: "temp"
    },
    value: {
      type: [String, Array],
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isMultiple: {
      type: Boolean,
      required: false,
      default: false
    },
    number: {
      type: Number,
      required: false,
      default: 0
    }
  },
  watch: {
    value: {
      handler(val, oldValue) {
        if (val instanceof Array) {
          this.initFileList(val.join(','))
        } else {
          this.initFileList(val)
        }
        if (!val || val.length == 0) {
          this.picUrl = false;
        }
      },
      //立刻执行handler
      immediate: true
    }
  },
  created(){
    const token = getToken();
    this.headers = {"Authorization":token}
  },
  methods: {
    initFileList(paths) {
      if (!paths || paths.length === 0) {
        this.fileList = [];
        return;
      }
      this.picUrl = true;
      let fileList = [];
      let arr = paths.split(",")
      for (var a = 0; a < arr.length; a++) {
        // let url = getFileAccessHttpUrl(arr[a]);
        let url = arr[a];
        fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: "history",
            message: arr[a]
          }
        })
      }
      this.fileList = fileList
    },
    beforeUpload: function (file) {
      var fileType = file.type;
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片');
        return false;
      }
    },
    handleChange(info) {
      this.picUrl = false;
      let fileList = info.fileList
      if (this.number > 0 && this.isMultiple) {
        fileList = fileList.slice(-this.number);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 1) {
          this.picUrl = true;
          fileList = fileList.map((file) => {
            if (file.response) {
              file.url = file.response.data.path;
            }
            return file;
          });
        }
        this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`);
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      if (info.file.status === 'done' || info.file.status === 'removed') {
        this.handlePathChange()
      }
    },
    // 预览
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    getAvatarView() {
      if (this.fileList.length > 0) {
        let url = this.fileList[0].url
        return getFileAccessHttpUrl(url)
      }
    },
    handlePathChange() {
      let uploadFiles = this.fileList
      let path = ''
      if (!uploadFiles || uploadFiles.length === 0) {
        path = ''
      }
      let arr = [];
      if (!this.isMultiple && uploadFiles.length > 0) {
        arr.push(uploadFiles[uploadFiles.length - 1].response.data.path)
      } else {
        for (let a = 0; a < uploadFiles.length; a++) {
          if (uploadFiles[a].status === 'done') {
            arr.push(uploadFiles[a].response.data.path)
          } else {
            return;
          }
        }
      }
      if (arr.length > 0) {
        path = arr.join(",")
      }
      this.$emit('change', path);
    },
    handleDelete(file) {
      //如有需要新增 删除逻辑
      console.log(file)
    },
    handleCancel() {
      this.close();
      this.previewVisible = false;
    },
    close() {

    },
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style scoped>
/deep/ .imgupload .iconp {
  padding: 20px;
}

/deep/ .image-upload-single-over .ant-upload-select {
  display: none
}
</style>
