const e=`<template>
  <div
    :class="{'product-image--has-max-width-only': hasMaxWidthOnly}"
    class="product-image"
  >
    <VImg
      :src="productSrc"
      :lazy-src="productLazySrc"
      v-bind="$attrs"
      :class="{'rotate-image': rotated}"
      @error="hasImgError = true"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <VProgressCircular
            color="primary-lighten-5"
            indeterminate
          />
        </div>
      </template>
    </VImg>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  inheritAttrs: false,
  props: {
    productType: {
      type: String,
      required: false,
      default: '',
    },
    sku: {
      type: String,
      required: false,
      default: '',
    },
    rotated: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasImgError: false,
      productLoadingImages: {
        KE: new URL('@/assets/images/product-loading-images/KE.png', import.meta.url).href,
        BA: new URL('@/assets/images/product-loading-images/BA.png', import.meta.url).href,
        BK: new URL('@/assets/images/product-loading-images/BK.png', import.meta.url).href,
        CK: new URL('@/assets/images/product-loading-images/CK.png', import.meta.url).href,
        CN: new URL('@/assets/images/product-loading-images/CN.png', import.meta.url).href,
        CO: new URL('@/assets/images/product-loading-images/CO.png', import.meta.url).href,
        HA: new URL('@/assets/images/product-loading-images/HA.png', import.meta.url).href,
        KA: new URL('@/assets/images/product-loading-images/KA.png', import.meta.url).href,
        LS: new URL('@/assets/images/product-loading-images/LS.png', import.meta.url).href,
        SO: new URL('@/assets/images/product-loading-images/SO.png', import.meta.url).href,
        TA: new URL('@/assets/images/product-loading-images/TA.png', import.meta.url).href,
        TG: new URL('@/assets/images/product-loading-images/TG.png', import.meta.url).href,
        errorImage: new URL('@/assets/images/app/error-image.png', import.meta.url).href,
      }
    };
  },
  computed: {
    ...mapGetters({
      environment: 'app/getEnvConfigs',
    }),
    productSrc() {
      return this.hasImgError ? this.productLoadingImages.errorImage : this.environment.skuImageBaseUrl + this.sku;
    },
    productLazySrc() {
      return this.productLoadingImages[this.productType] || this.productLoadingImages.errorImage;
    },
    imageMaxWidth() {
      return this.formatAttr('max-width');
    },
    hasMaxWidthOnly() {
      return this.$attrs['max-width'] && !this.$attrs['width'];
    },
  },
  methods: {
    formatAttr(value) {
      if (!isNaN(+this.$attrs[value])) {
        return \`\${this.$attrs[value]}px\`;
      }
      return this.$attrs[value];
    },
  },
};
<\/script>

<style scoped lang="scss">
.product-image--has-max-width-only {
  :deep(.v-responsive) {
    width: v-bind(imageMaxWidth) !important;
    max-width: v-bind(imageMaxWidth) !important;
  }
}
.rotate-image {
  transform: rotate(90deg);
}
</style>`;export{e as default};
