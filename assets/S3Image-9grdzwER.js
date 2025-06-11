const n=`<template>
  <VImg
    :aspect-ratio="aspectRatio"
    :style="vImgStyle"
    :height="height"
    :src="imgSrc"
    :lazy-src="\`https://\${bucket}.s3.amazonaws.com/\${lazyKey}\`"
    @load="$emit('load', $el)"
    @error="imageLoadError = true"
  >
    <p
      v-if="imageLoadError"
      class="load-failed py-3"
    >
      Image failed to load
    </p>
  </VImg>
</template>

<script>
export default {
  props: {
    bucket: {
      type: String,
      default: '',
    },
    objectKey: {
      type: String,
      default: '',
    },
    lazyKey: {
      type: String,
      default: '',
    },
    blob: {
      type: String,
      default: null
    },
    vImgStyle: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: undefined,
    },
    aspectRatio: {
      type: String,
      default: undefined,
    }
  },
  emits: ['load'],
  data: () => ({
    imageLoadError: false,
  }),
  computed: {
    imgSrc() {
      return this.blob || \`https://\${this.bucket}.s3.amazonaws.com/\${this.objectKey}\`;
    },
  },
};
<\/script>

<style lang="scss" scoped>
  .load-failed {
      background: rgba(0, 0, 0, 0.4);
      text-align: center;
      color: white;
      position: absolute;
      top: 48%;
      left: 0;
      width: 100%;
  }
</style>`;export{n as default};
