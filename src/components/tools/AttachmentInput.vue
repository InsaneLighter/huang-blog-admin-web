<template>
  <div>
    <a-input
      ref="attachmentInput"
      :defaultValue="defaultValue"
      :placeholder="placeholder"
      :value="value"
      @change="onInputChange"
    >
      <template #addonAfter>
        <a-button class="!p-0 !h-auto" type="link" @click="attachmentModalVisible = true">
          <a-icon type="picture" />
        </a-button>
      </template>
    </a-input>
    <AttachmentSelect
      :multiSelect="false"
      :visible.sync="attachmentModalVisible"
      :type="'image'"
      @confirm="handleSelectAttachment"
    />
  </div>
</template>
<script>
import AttachmentSelect from "../attachment/AttachmentSelect";
export default {
  name: 'AttachmentInput',
  components: {
    AttachmentSelect
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '选择附件'
    }
  },
  data() {
    return {
      attachmentModalVisible: false
    }
  },
  methods: {
    onInputChange(e) {
      this.$emit('input', e.target.value)
    },
    handleSelectAttachment({ raw }) {
      if (raw.length) {
        this.$emit('input', encodeURI(raw[0].path))
      }
    },
    focus() {
      this.$refs.attachmentInput.focus()
    }
  }
}
</script>
