const n=`<template>
  <VTooltip
    location="top"
    theme="dark"
  >
    <template #activator="{ props }">
      <div>
        <VIcon
          v-bind="props"
          size="34"
          class="icon-duotone-circle-exclamation"
        >
          $circleExclamation
        </VIcon>
      </div>
    </template>
    <span class="text-capitalize">{{ reason }}</span>
  </VTooltip>
</template>

<script>
export default {
  props: {
    reason: {
      type: String,
      default: '',
      validator: (value) => {
        return ['could not submit', 'out of stock', 'unpickable', 'invalid address', 'shipment lost', 'return to sender', 'no show', 'miscut'].includes(value);
      },
    },
  },
};
<\/script>
`;export{n as default};
