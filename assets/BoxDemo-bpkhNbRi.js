const n=`<template>
  <div
    :style="boxStyle"
    class="custom-box"
    @click="handleClick"
  >
    {{ title }}
    <slot />
  </div>
</template>

<script>
export default {
  // name: 'CustomBox',

  props: {
    title: {
      type: String,
      default: 'Box'
    },
    height: {
      type: String,
      default: '150px'
    },
    width: {
      type: String,
      default: '150px'
    },
    bgColor: {
      type: String,
      default: '#ff0000'
    },
    borderRadius: {
      type: String,
      default: '8px'
    },
  },

  computed: {
    boxStyle() {
      return {
        width: this.width,
        height: this.height,
        backgroundColor: this.bgColor,
        borderRadius: this.borderRadius,
      };
    }
  },

  methods: {
    handleClick() {
      this.$emit('box-clicked');
    }
  },
};
<\/script>

<style scoped>
.custom-box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
</style>`;export{n as default};
