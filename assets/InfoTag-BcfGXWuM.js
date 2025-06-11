const n=`<template>
  <div
    class="info-tag"
    :class="color"
    :style="\`height: \${size}; width: \${size}\`"
  >
    <span
      :class="labelColor"
      :style="\`font-size: \${labelSize}\`"
    >{{
      label
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: [Number, String],
      default: 0
    },
    labelColor: {
      type: String,
      default: undefined,
    },
    labelSize: {
      type: String,
      default: '22px'
    },
    color: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: '32px'
    }
  }
};
<\/script>

<style scoped lang="scss">
.info-tag {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
`;export{n as default};
