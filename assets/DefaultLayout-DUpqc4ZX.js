const n=`<template>
  <section
    class="page-layout"
    :class="{
      'page-layout--no-padding': noContentPadding
    }"
  >
    <VContainer class="page-layout__content">
      <slot name="default" />
    </VContainer>
  </section>
</template>
<script>
import { useLayoutControl } from '@/composables/layoutControl';

export default {
  props: {
    hideNavigation: {
      type: Boolean,
      default: false
    },
    noContentPadding: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { setLayout } = useLayoutControl();
    setLayout({ isNavAvailable: !props.hideNavigation });
  },
};
<\/script>
<style lang="scss" scoped>
.page-layout {

  .page-layout__content {
    position: relative;
  }

  &--no-padding {
    .page-layout__content {
      padding: 0;
      :deep(> .v-row) {
        margin: 0;
      }
    }
  }
}
</style>
`;export{n as default};
