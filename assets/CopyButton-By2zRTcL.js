const t=`<template>
  <span class="copy-button">
    <VTooltip v-model="isTooltipActive">
      <template #activator="{ props: tooltipProps }">
        <VIcon
          icon="$copy"
          :size="size"
          color="primary"
          v-bind="tooltipProps"
          @click="copyText()"
        />
      </template>
      {{ activeTooltipText }}
    </VTooltip>
  </span>
</template>
<script>
export default {
  props: {
    textToCopy: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '16'
    },
    tooltipText: {
      type: String,
      default: 'Copy'
    }
  },
  data() {
    return {
      showTooltip: false,
      showCopiedTooltip: false
    };
  },
  computed: {
    activeTooltipText() {
      return this.showCopiedTooltip ? 'Copied!' : this.tooltipText;
    },
    isTooltipActive: {
      get() {
        return this.showTooltip;
      },
      set(isTooltipActive) {
        if (isTooltipActive) {
          this.showCopiedTooltip = false;
        }
        this.showTooltip = isTooltipActive;
      }
    }
  },
  methods: {
    copyText() {
      this.showCopiedTooltip = true;
      this.showTooltip = true;
      navigator.clipboard.writeText(this.textToCopy);
      setTimeout(() => {
        this.showTooltip = false;
      }, 700);
    }
  }
};
<\/script>
<style lang="scss" scoped>
.copy-button {
  display: inline-block;
}
</style>
`;export{t as default};
