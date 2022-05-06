<template>
  <div>
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 30rem; overflow-y: hidden;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
    />
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {getToken} from '@/utils/auth'

export default {
  name: 'HtmlEditor',
  components: {Editor, Toolbar},
  data() {
    return {
      editor: null,
      toolbarConfig: {
        toolbarKeys: [
          "headerSelect",
          "bold",
          "underline",
          "italic",
          {
            iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
            key: "group-more-style",
            menuKeys: ['through', 'sup', 'sub', 'clearStyle'],
            title: "更多"
          },
          "color",
          "bgColor",
          "|",
          "fontSize",
          "fontFamily",
          "lineHeight",
          "|",
          "bulletedList",
          "numberedList",
          {
            key: 'group-justify',
            title: '对齐',
            iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
            menuKeys: ["justifyLeft",
              "justifyRight",
              "justifyCenter",
              "justifyJustify"]
          },
          {
            key: 'group-indent',
            title: '缩进',
            iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
            menuKeys: ["indent",
              "delIndent"]
          },
          "|",
          "emotion",
          "insertLink",
          {
            key: 'group-image',
            title: '图片',
            iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
            menuKeys: ["insertImage",
              "uploadImage"]
          },
          "codeBlock",
          "divider",
          "|",
          "undo",
          "redo"
        ],
        excludeKeys: ["uploadVideo", "insertVideo"]
      },
      editorConfig: {
        placeholder: '请输入内容...',
        autoFocus: true,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          uploadImage: {
            // 后端上传地址，必填
            server: "/api/mail/upload/images",
            // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
            fieldName: "file",
            // 1M，单个文件的最大体积限制，默认为 2M
            maxFileSize: 10 * 1024 * 1024,
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 10,
            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: ['image/*'],
            // 15 秒，超时时间，默认为 10 秒
            timeout: 15 * 1000,
            //将 meta 拼接到 url 参数中，默认 false
            metaWithUrl: false,
            //自定义增加 http  header
            headers: {
              Accept: 'application/json, text/plain, */*',
              Authorization: getToken()
            },
            //跨域是否传递 cookie ，默认为 false
            withCredentials: true,
            // 自定义插入图片
            customInsert(res, insertFn) {
              // res 即服务端的返回结果
              if (res.code === 1) {
                insertFn(res.url, '这就是图片咯', '')
              } else {
                this.$message.error(res.msg)
              }
            },
          }
        }
      },
      mode: 'default', // or 'simple'
    }
  },
  props: {
    htmlContent: {
      type: String,
      default: ''
    }
  },
  computed: {
    html: {
      get() {
        return this.htmlContent
      },
      set(value) {
        this.$emit('update:htmlContent', value)
      }
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    }
  },
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>
<style scoped>
/deep/ h1 {
  font-size: 2em;
}
</style>
