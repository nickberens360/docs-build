const n=`<template>
  <section>
    <VDialog
      model-value
      fullscreen
      persistent
      no-click-animation
      :scrim="false"
      color="transparent"
      :scroll-strategy="hideVApplicationOnPrint ? 'none' : 'block'"
      transition="fade-transition"
      :class="{ 'd-print-none': hideVApplicationOnPrint }"
    >
      <section
        class="full-screen-layout"
        :class="{
          'full-screen-layout--no-padding': noContentPadding,
          'full-screen-layout--has-footer': $slots.footer,
        }"
        v-bind="$attrs"
      >
        <div class="full-screen-layout__header">
          <slot name="header" />
        </div>

        <VContainer class="full-screen-layout__content">
          <slot name="default" />
        </VContainer>

        <div class="full-screen-layout__footer">
          <slot name="footer" />
        </div>
      </section>
    </VDialog>
  </section>
</template>
<script>
import { mapState } from 'vuex';

export default {
  inheritAttrs: false,
  props: {
    noContentPadding: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('app', ['hideVApplicationOnPrint']),
  }
};
<\/script>
<style lang="scss" scoped>
.full-screen-layout {
  --header-height: 64px;
  --footer-height: 0px;
  display: flex;
  flex-direction: column;

  &__header {
    width: 100%;
    z-index: 1;
    height: var(--header-height);
    background-color: transparent;
  }

  &__content {
    overflow: auto;
    height: calc(100vh - var(--header-height) - var(--footer-height));
    background-color: rgb(var(--v-theme-background));
  }

  &__footer {
    height: var(--footer-height);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(var(--v-theme-background));
  }

  &--no-padding {
    .full-screen-layout__content {
      padding: 0;
      :deep(> .v-row) {
        margin: 0;
      }
    }
  }

  &--has-footer {
    --footer-height: 64px;
  }
}

</style>
`;export{n as default};
