const n=`<template>
  <div>
    <div class="on-surface-low-contrast-text">
      <slot name="itemTitle">
        <h4 class="item-title text-caption-2 font-weight-regular mb-2">
          {{ title }}
        </h4>
      </slot>
    </div>
    <div
      v-if="$slots.itemContent"
      class="line-height-1 text-body-4"
    >
      <slot name="itemContent" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
<\/script>

<style scoped lang="scss">

:deep(.card-item-list) {

  list-style: none;
  padding: 0;

  li {
    margin-bottom: 6px !important;
  }

}

.item-title {
  line-height: 1;
  letter-spacing: 0 !important;
}
</style>`;export{n as default};
