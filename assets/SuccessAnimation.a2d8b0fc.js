const n=`<template>
  <div
    class="d-flex flex-column justify-center align-center position-relative success-wrapper success-animation"
    :class="extendClass"
  >
    <div class="success-icon-wrapper position-relative">
      <VScaleTransition origin="center center">
        <VIcon
          v-if="scaleSuccessCheckIcon && useSuccessCheckIcon"
          class="success-check-icon icon-duotone-success-reversed"
          size="44"
        >
          $duoToneCheckCircle
        </VIcon>
      </VScaleTransition>
      <VScaleTransition origin="center center">
        <div
          v-if="scaleSuccessIcon && usePrimaryIcon"
        >
          <slot name="icon">
            <VIcon
              size="124"
              class="icon-duotone-success mb-4"
            >
              {{ iconPrimary }}
            </VIcon>
          </slot>
        </div>
      </VScaleTransition>
    </div>
    <VExpandTransition>
      <div
        v-if="expandSuccessMessage"
        class="success-text text-center"
      >
        <slot name="heading">
          <p
            class="font-weight-bold mb-1 text-body-3 text-success"
          >
            {{ heading }}
          </p>
        </slot>
        <slot name="message">
          <p class="mb-0 text-body-1">
            {{ message }}
          </p>
        </slot>
      </div>
    </VExpandTransition>
  </div>
</template>

<script>
export default {
  props: {
    iconPrimary: {
      type: String,
      default: '$duoToneCheckCircle'
    },
    useSuccessCheckIcon: {
      type: Boolean,
      default: true
    },
    usePrimaryIcon: {
      type: Boolean,
      default: true
    },
    heading: {
      type: String,
      default: 'Success!'
    },
    message: {
      type: String,
      default: 'Your changes have been saved.'
    },
    extendClass: {
      type: String,
      default: null
    },

  },
  emits: ['animation-complete'],
  data() {
    return {
      expandSuccessMessage: false,
      scaleSuccessIcon: false,
      scaleSuccessCheckIcon: false,
      isAnimationComplete: false,
    };
  },
  mounted() {
    this.displaySuccessAnimation();
  },
  methods: {
    displaySuccessAnimation() {
      setTimeout(() => {
        this.scaleSuccessIcon = true;
      }, 300);
      setTimeout(() => {
        this.expandSuccessMessage = true;
        this.scaleSuccessCheckIcon = true;
      }, 600);
      setTimeout(() => {
        this.isAnimationComplete = true;

        if (this.isAnimationComplete) {
          this.$emit('animation-complete');
        }
      }, 3000);
    },
  }
};
<\/script>

<style lang="scss" scoped>

.success-animation--text {
  .success-check-icon {
    right: -18px !important;
  }
}

.success-check-icon {
  position: absolute !important;
  right: -10px !important;
  top: -8px !important;
  z-index: 2 !important;
  border-radius: 50% !important;
  box-shadow: 0 0 0 4px #fff !important;
}

.success-text {
  width: 100%;
}
</style>`;export{n as default};
