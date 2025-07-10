const e=`<template>
  <VChip
    :color="stageColor"
    size="small"
  >
    <span class="text-capitalize font-weight-semibold">{{ stageName }}</span>
  </VChip>
</template>

<script>
import { getOrderStageColor, getOrderStageName } from '@/utils/orderHelpers';

export default {
  props: {
    transactionId: {
      type: [String, Number],
      default: ''
    },
    stage: {
      type: String,
      default: ''
    }
  },
  computed: {
    stageColor() {
      return getOrderStageColor(this.stage);
    },
    stageName() {
      return getOrderStageName(this.stage);
    },
  },
};
<\/script>

<style lang="scss" scoped>

</style>`;export{e as default};
