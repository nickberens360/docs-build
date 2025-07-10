const n=`<template>
  <VExpandTransition>
    <VCard
      v-if="getTopCurtain.isShown"
      v-click-outside="onClickOutside"
      class="mx-auto rounded-0 elevation-5 d-flex flex-column justify-center"
      :style="curtainStyles"
      :max-height="maxHeight"
    >
      <VCardText
        :style="\`max-width: \${maxWidth};\`"
        class="mx-auto position-relative flex-grow-0"
      >
        <VIcon
          v-if="getTopCurtain.showCloseButton"
          class="close-icon"
          @click="handleCloseClick"
        >
          $times
        </VIcon>
        <Component
          :is="getTopCurtain.component"
          v-bind="getTopCurtain.componentProps"
        />
      </VCardText>
    </VCard>
  </VExpandTransition>
</template>

<script>
import { mapGetters } from 'vuex';
import { useLayout } from 'vuetify';
import ReceiptForms from '@/components/order/ReceiptForms.vue';
import CouponForms from '@/components/order/CouponForms.vue';

export default {
  components: {
    ReceiptForms,
    CouponForms,
  },
  props: {
    curtainComponent: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: '640px'
    },
    maxHeight: {
      type: String,
      default: '525px'
    },
    clippedLeft: {
      type: Boolean,
      default: false
    },
  },
  setup() {
    const {mainRect} = useLayout();
    return {
      mainRectLayout: mainRect
    };
  },
  computed: {
    ...mapGetters('app', {
      getTopCurtain: 'getTopCurtain',
      isTimeoutWarningShown: 'getIsTimeoutWarningShown'
    }),
    curtainStyles() {
      let left = '0px';

      if (this.getTopCurtain.clippedLeft) {
        left = \`\${this.mainRectLayout.left}px\`;
      }

      return {
        position: 'absolute',
        top: \`\${this.mainRectLayout.top}px\`,
        left,
        right: 0,
        height: '100%',
        zIndex: 1020,
      };
    }
  },
  beforeUnmount() {
    this.$store.dispatch('app/closeTopCurtain');
  },
  methods: {
    handleCloseClick() {
      this.$store.dispatch('app/closeTopCurtain');
    },
    onClickOutside() {
      if (this.getTopCurtain.isShown && !this.isTimeoutWarningShown) {
        this.$store.dispatch('app/closeTopCurtain');
      }
    },
  },
};
<\/script>

<style scoped lang="scss">
.close-icon {
  position: absolute !important;
  top: 12px !important;
  right: 20px !important;
}
</style>
`;export{n as default};
