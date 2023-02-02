<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="pic-wall">
        <div class="settings-title">照片墙</div>
        <div class="upload" style="margin-top: 15px;">
          <a-button v-show="allImgData.length < 8" icon="cloud-upload" type="primary" @click="upload.visible = true">上传</a-button>
          <a-button v-show="hasCheckedPic" icon="check-circle" type="primary" @click="handleSelectAll">
            全选
          </a-button>
          <a-button v-show="hasCheckedPic" icon="delete" type="danger" @click="handleDeleteAttachmentInBatch">
            删除
          </a-button>
          <a-button v-show="hasCheckedPic" icon="close" @click="handleCancelSelectAll"> 取消</a-button>
        </div>
        <div class="pic-wall-container">
          <a-spin v-show="loading"/>
          <div class="imgList" v-if="allImgData.length > 0">
            <div class="img-item" v-for="(item, index) in allImgData" :class="{active:item.clickOn}" :key="index"
                 @click="checkImg(index)" :style="index === 0?{marginLeft: '22px'}:''">
              <img :src="item.url">
            </div>
          </div>
          <div v-else>
            <a-empty :image="simpleImage" />
          </div>
        </div>
      </div>
      <div class="daily-article" style="margin-top: 20px">
        <div class="settings-title">日常文案</div>
        <div class="daily-article-container"></div>
      </div>
    </a-card>
    <AttachmentUpload :type="'pic-wall'" :visible.sync="upload.visible" @close="onUploadClose"/>
  </div>
</template>

<script>
import attachmentApi from '@/api/attachment/index'
import AttachmentUpload from "@/components/attachment/AttachmentUpload";
import { Empty } from 'ant-design-vue';
export default {
  name: "Settings",
  components: {
    AttachmentUpload
  },
  data() {
    return {
      loading: false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      upload: {
        visible: false
      },
      allImgData: [
        {
          id: '001',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        },
        {
          id: '002',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        },
        {
          id: '003',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        },
        {
          id: '004',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        },
        {
          id: '005',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        },
        {
          id: '006',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        },
        {
          id: '007',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        },
        {
          id: '008',
          url: "http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg"
        }
      ]
    }
  },
  computed:{
    hasCheckedPic(){
      return this.allImgData.filter(item => item.clickOn).length > 0;
    }
  },
  created() {
    this.handleListPicWalls()
  },
  methods: {
    handleSelectAll(){
      this.allImgData.forEach(item => {
        item.clickOn = true
      })
    },
    handleCancelSelectAll(){
      this.allImgData.forEach(item => {
        item.clickOn = false
      })
    },
    checkImg(index) {
      const temp = this.allImgData[index]
      temp.clickOn = !this.allImgData[index].clickOn
      this.$set(this.allImgData, index, temp)
    },
    handleListPicWalls(){
      try {
        this.loading = true
        attachmentApi.listPicWall().then(response => {
          if (response.code === 1) {
            this.allImgData = response.data.map(function (item) {
              return {
                id: item.id,
                url: item.path,
                clickOn: false
              }
            });
          } else {
            this.$message.error(response.msg)
          }
        })
      } catch (e) {
        this.$message.error('Failed to load pics')
      }finally {
        this.loading = false
      }
    },
    onUploadClose() {
      this.handleListPicWalls()
    },
    handleDeleteAttachmentInBatch() {
      const _this = this
      let arr = this.allImgData.filter(item => item.clickOn);
      if (arr.length <= 0) {
        this.$message.warn('你还未选择任何附件，请至少选择一个！')
        return
      }
      this.$confirm({
        title: '确定要批量删除选中的附件吗？',
        content: '一旦删除不可恢复，请谨慎操作',
        async onOk() {
          try {
            const attachmentIds = arr.map(attachment => attachment.id)
            attachmentApi.del(attachmentIds).then(response => {
              if (response.code === 1) {
                _this.$message.success('删除成功')
                _this.handleListPicWalls()
              } else {
                _this.$message.error(response.msg)
              }
            }).finally(() => {
              _this.handleListPicWalls()
            })
          } catch (e) {
            _this.$message.error('Failed to delete selected pic')
          }
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 1rem;
}

.settings-title {
  font-size: 18px;
  font-weight: bold;
}

.imgList {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;

  .active {
    display: block;
    width: 180px;
    height: 180px;
    line-height: 0;
    font-size: 0;
    vertical-align: middle;
    border: 3px solid #2b89fd;
    -webkit-transform: rotate(0deg);
  }

  .active::before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    border: 12px solid #2b89fd;
    border-top-color: transparent;
    border-left-color: transparent;
  }

  .active::after {
    content: "";
    display: block;
    width: 5px;
    height: 10px;
    position: absolute;
    right: 4px;
    bottom: 5px;
    border: 1px solid #fff;
    border-top-color: transparent;
    border-left-color: transparent;
    transform: rotate(45deg);
    cursor: pointer;
  }

  .img-item {
    width: 180px;
    height: 180px;
    overflow: hidden;
    background-color: #FFFFFF;
    margin: 15px 20px 15px 0;
    cursor: pointer;

    img {
      height: 180px;
    }

  }
}
/deep/ .ant-btn {
  margin-right: 10px;

}
</style>
