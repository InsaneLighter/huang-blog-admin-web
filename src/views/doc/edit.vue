<template>
  <div>
    <page-view
        :sub-title="postToStage.inProgress ? '当前内容已保存，但还未发布。' : ''"
        :title="postToStage.title ? postToStage.title : '新文章'"
        showHead
    >
      <template #extra>
        <a-space>
          <a-button :loading="previewSaving" @click="handlePreviewClick">预览</a-button>
          <a-button type="primary" @click="postSettingVisible = true">发布</a-button>
        </a-space>
      </template>
    </page-view>
    <a-row
        class="row"
        :gutter="12">
      <a-col :span="24">
        <div class="title">
          <a-input v-model="postToStage.title" placeholder="请输入文章标题" size="large"/>
        </div>
        <div id="editor">
          <v-md-editor v-model="postToStage.originContent"
                       height="40rem"
                       mode="editable"
                       :disabled-menus="[]"
                       @upload-image="handleUploadImage"
                       @change="onContentChange"
                       @save="handleSaveDraft">
          </v-md-editor>
        </div>
      </a-col>
    </a-row>

    <PostSetting
        :post="postToStage"
        :savedCallback="onPostSavedCallback"
        :visible.sync="postSettingVisible"
        @onUpdate="onUpdateFromSetting"
    />
  </div>
</template>

<script>
import PageView from "@/components/tools/PageView";
import PostSetting from '@/components/tools/PostSetting'
import {datetimeFormat} from '@/utils/datetime'
//保存重复提示 利用debounce解决
import debounce from 'lodash.debounce'

import postApi from '@/api/post/index'
import contentApi from '@/api/content/index'

export default {
  name: "edit",
  components: {
    PageView,
    PostSetting
  },
  data() {
    return {
      postSettingVisible: false,
      postToStage: {},
      contentChanges: 0,
      previewSaving: false
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const postId = to.query.postId
    next(async vm => {
      if (postId) {
        const {data} = await postApi.get(postId)
        vm.postToStage = data
      }
    })
  },
  destroyed() {
    if (window.onbeforeunload) {
      window.onbeforeunload = null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.contentChanges <= 1) {
      next()
    } else {
      this.$confirm({
        title: '当前页面数据未保存，确定要离开吗？',
        content: () => <div style="color:red;">如果离开当面页面，你的数据很可能会丢失！</div>,
        onOk() {
          next()
        },
        onCancel() {
          next(false)
        }
      })
    }
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event
      if (e) {
        e.returnValue = '当前页面数据未保存，确定要离开吗？'
      }
      return '当前页面数据未保存，确定要离开吗？'
    }
  },
  beforeMount() {
    document.addEventListener('keydown', this.onRegisterSaveShortcut)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onRegisterSaveShortcut)
  },
  methods: {
    handleSaveDraft: debounce(async function () {
      if (this.postToStage.id) {
        try {
          await contentApi.update({
            id: this.postToStage.id,
            originContent: this.postToStage.originContent,
            content: this.postToStage.content
          })
          this.handleRestoreSavedStatus()
          this.$message.success({
            content: '内容已保存',
            duration: 1
          })
        } catch (e) {
          this.$message.error('Failed to update post content', e)
        }
      } else {
        await this.handleCreatePost()
      }
    }, 300),
    onRegisterSaveShortcut(e) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.keyCode === 83) {
        e.preventDefault()
        e.stopPropagation()
        this.handleSaveDraft()
      }
    },
    async handleCreatePost() {
      const self = this
      if (!this.postToStage.title) {
        this.postToStage.title = datetimeFormat(new Date(), 'YYYY-MM-DD-HH-mm-ss')
      }
      if (!this.postToStage.originContent) {
        this.$confirm({
          title: '当前文章没有数据，确认保存吗？',
          onOk() {
            return new Promise((resolve, reject) => {
              self.handleCreateContent(resolve)
            }).catch(() => console.log('文章保存失败!'))
          },
          onCancel() {
          }
        })
      }

    },
    handleCreateContent(resolve) {
      resolve()
      // Create the post
      try {
        contentApi.add({
          title: this.postToStage.title,
          originContent: this.postToStage.originContent,
          content: this.postToStage.content
        })
        this.handleRestoreSavedStatus()
        // add params to url
        this.$router.push({name: 'DocList'})
        this.$message.success({
          content: '文章已创建',
          duration: 1
        })
      } catch (e) {
        this.$message.error('Failed to create post: ' + e.toString())
      }
    },
    async handlePreviewClick() {
      this.previewSaving = true
      if (this.postToStage.id) {
        // Update the post content
        /*const { data } = await apiClient.post.updateDraftById(
            this.postToStage.id,
            this.postToStage.originContent,
            this.postToStage.content,
            true
        )
        this.postToStage.inProgress = data.inProgress*/
      } else {
        // await this.handleCreatePost()
      }
      await this.handleOpenPreview()
    },

    async handleOpenPreview() {
      try {
        // const response = await apiClient.post.getPreviewLinkById(this.postToStage.id)
        // window.open(response, '_blank')
        this.handleRestoreSavedStatus()
      } catch (e) {
        this.$message.error('Failed to get preview link', e)
      } finally {
        setTimeout(() => {
          this.previewSaving = false
        }, 400)
      }
    },

    handleRestoreSavedStatus() {
      this.contentChanges = 0
    },
    onContentChange(originContent, renderContent) {
      this.contentChanges++
      this.postToStage.originContent = originContent
      this.postToStage.content = renderContent
    },
    onPostSavedCallback() {
      this.contentChanges = 0
      this.$router.push({name: 'DocList'})
    },
    onUpdateFromSetting(post) {
      this.postToStage = post
    },
    handleUploadImage(event, insertImage, files) {
      console.log(files);
      const file = files[0];
      // 此处只做示例
      insertImage({
        url:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
        desc: '七龙珠',
        // width: 'auto',
        // height: 'auto',
      });
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 1rem;
}

.page-head {
  margin-top: 0px !important;
}

.row {
  padding: 1rem 24px 0;;
  background-color: #f0f2f5;
}
</style>
