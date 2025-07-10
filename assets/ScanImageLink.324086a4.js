const n=`<template>
  <VHover>
    <template #default="{ isHovering, props }">
      <a
        class="scan-image-link text-info-lighten-2"
        v-bind="{ ...props, ...$attrs }"
        :href="imageUrl"
        target="_blank"
      >
        <VIcon
          icon="map-marker-alt"
          size="14"
          class="mr-1"
          color="primary-lighten-2"
        />
        {{ imageType }}
        <div
          v-if="isHovering"
          class="scan-image-link__preview"
        >
          <VSkeletonLoader
            v-if="isImageLoading && !hasImgError"
            type="image"
          />
          <VImg
            :src="imageUrl"
            position="left"
            @loadstart="isImageLoading = true"
            @load="isImageLoading = false"
            @error="hasImgError = true"
          />
        </div>
      </a>
    </template>
  </VHover>
</template>
<script>
import API from '@/services/api';
const apiService = API();
export default {
  inheritAttrs: false,
  props: {
    scanId: {
      type: String,
      required: true,
    },
    imageType: {
      type: String,
      required: true,
      validator: (imageType) => ['heatmap', 'left', 'right'].includes(imageType),
    },
  },
  data: () => ({
    isImageLoading: false,
    hasImgError: false,
    errorImageUrl: new URL('@/assets/images/app/error-image.png', import.meta.url).href
  }),
  computed: {
    imageUrl() {
      return this.hasImgError ? this.errorImageUrl : \`\${apiService.defaults.baseURL}/download/kis2/scanimage/\${this.scanId}/\${this.imageType}\`;
    },
  },
};
<\/script>
<style lang="scss" scoped>
.scan-image-link {
  text-transform: uppercase;
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &__preview {
    position: absolute;
    bottom: -200px;
    left: 0;
    height: 200px;
    width: 200px;
    z-index: 20;
  }
}
</style>
`;export{n as default};
