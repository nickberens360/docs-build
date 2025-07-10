const n=`<template>
  <div class="comment-box">
    <VToolbar
      class="pl-4"
      color="primary-lighten-2"
      height="32"
    >
      Comments - {{ comments.length }}
    </VToolbar>
    <div class="comment-box__main-content">
      <ul
        v-if="showCommentHistory"
        class="pt-2"
      >
        <li
          v-for="comment in chronologicalComments"
          :key="comment.identifier"
          class="py-1 text-primary"
        >
          <span class="on-surface-low-contrast-text">
            {{ new Date(comment.timestamp).toLocaleDateString() }}
          </span>
          <span class="px-1">{{ comment.message }}</span>
          <span class="on-surface-low-contrast-text">- {{ comment.username }}</span>
        </li>
      </ul>

      <div
        v-else
        class="pt-5"
      >
        <VTextField
          v-model="newComment"
          autofocus
          density="comfortable"
          label="Comment"
          variant="solo"
        />
      </div>
    </div>
    <footer class="comment-box__footer">
      <div
        v-if="showCommentHistory"
        class="comment-box__footer-content"
      >
        <slot name="footer-left">
          <div />
        </slot>
        <VBtnPrimary
          prepend-icon="$commentPlus"
          density="comfortable"
          :loading="loading"
          @click="showCommentHistory = false"
        >
          Add Comment
        </VBtnPrimary>
      </div>
      <div
        v-else
        class="comment-box__footer-content"
      >
        <VBtnSecondary
          density="comfortable"
          prepend-icon="$xmark"
          @click="clearCommentAndShowHistory"
        >
          Cancel
        </VBtnSecondary>
        <VBtnPrimary
          density="comfortable"
          prepend-icon="$check"
          :disabled="!newComment.length"
          @click="submitComment"
        >
          Submit
        </VBtnPrimary>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    comments: {
      type: Array,
      required: true
    },
    height: {
      type: [String, Number],
      default: '230px'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['commentAdded'],
  data: () => ({
    showCommentHistory: true,
    newComment: '',
  }),
  computed: {
    chronologicalComments() {
      return [...this.comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    heightAttribute() {
      let height = this.height;
      const hasUnits = isNaN(+height);
      if (!hasUnits) {
        height += 'px';
      }
      return height;
    },
  },
  methods: {
    clearCommentAndShowHistory() {
      this.newComment = '';
      this.showCommentHistory = true;
    },
    submitComment() {
      this.$emit('commentAdded', this.newComment);
      this.clearCommentAndShowHistory();
    }
  }
};
<\/script>

<style lang="scss" scoped>
.comment-box {
  height: v-bind(heightAttribute) !important;
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--v-theme-surface-light));

  &__main-content {
    overflow-y: auto;
    padding: 0 36px;
    flex-grow: 1;
  }

  &__footer {
    flex-grow: 0;
    display: flex;
    align-items: center;
    padding: 10px;
    height: 48px;
    background-color: rgb(var(--v-theme-surface-variant));
  }

  &__footer-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
`;export{n as default};
