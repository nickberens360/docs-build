const n=`<template>
  <div class="barcode-generator">
    <canvas
      ref="barcodeCanvas"
      class="barcode-generator__canvas"
    />
    <slot name="barcode-text">
      <p
        v-if="includeText"
        class="barcode-generator__text"
        data-test="barcodeText"
      >
        {{ barcodeText }}
      </p>
    </slot>
  </div>
</template>

<script>
import * as bwipjs from 'bwip-js/browser';

export default {
  props: {
    barcodeText: {
      type: String,
      required: true,
    },
    includeText: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '50px',
    },
    fontSize: {
      type: String,
      default: '13px',
    },
  },
  exposes: ['generateBarcode'],
  mounted() {
    this.generateBarcode();
  },
  methods: {
    generateBarcode() {
      if (!this.$refs.barcodeCanvas) {
        return;
      }
      try {
        const canvas = this.$refs.barcodeCanvas;
        if (!this.barcodeText) {
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          return;
        }
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bwipjs.toCanvas(canvas, {
          bcid: 'code128',
          text: this.barcodeText,
          textxalign: 'center',
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
        this.$store.dispatch('app/setSnackbar', {
          message: 'Error generating barcode',
          color: 'error',
        });
      }
    }
  }
};
<\/script>

<style scoped lang="scss">
.barcode-generator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: v-bind(width);
  &__canvas {
    height: v-bind(height);
    width: 100%;
  }
  &__text {
    font-size: v-bind(fontSize);
  }
}

</style>`;export{n as default};
