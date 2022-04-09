<template>
  <a-popover
      :arrowPointAtCenter='true'
      :autoAdjustOverflow='true'
      :overlayStyle="{ width: '400px', top: '50px' }"
      overlayClassName='header-comment-popover'
      placement='bottomRight'
      title='工作日志'
      trigger='hover'
  >
    <template #content>
      <div class='custom-tab-wrapper'>
        <a-tabs v-model='activeKey' :animated='{ inkBar: true, tabPane: false }' @change='handleListAuditingComments'>
          <a-tab-pane v-for='target in targets' :key='target.key' :tab='target.label'>
            <CommentListView
                :comments='comments[target.dataKey]'
                :loading='comments.loading'
                clickable
                @click='handleRouteToCommentList(arguments[0], target)'
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    </template>
    <span class='inline-block transition-all'>
      <a-badge v-if='comments.post.length || comments.sheet.length || comments.journal.length' dot>
        <a-icon type='bell' />
      </a-badge>
      <a-badge v-else>
        <a-icon type='bell' />
      </a-badge>
    </span>
  </a-popover>
</template>
<script>

const targets = [
  {
    key: 'posts',
    dataKey: 'post',
    label: '文章'
  },
  {
    key: 'sheets',
    dataKey: 'sheet',
    label: '页面'
  },
  {
    key: 'journals',
    dataKey: 'journal',
    label: '日志'
  }
]

import CommentListView from "./CommentListView";
export default {
  name: 'HeaderComment',
  data() {
    return {
      targets: targets,
      activeKey: 'posts',
      comments: {
        post: [],
        sheet: [],
        journal: [],
        loading: false
      }
    }
  },
  components: {
    CommentListView
  },
  created() {
    this.handleListAuditingComments()
  },
  methods: {
    async handleListAuditingComments() {
    },

    handleRouteToCommentList(comment, target) {
    }
  }
}
</script>
