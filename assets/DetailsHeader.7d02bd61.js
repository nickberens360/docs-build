const e=`<template>
  <VRow
    align="center"
    no-gutters
    style="height: 64px"
    class="details-header bg-primary"
  >
    <VCol class="fill-flex-height">
      <h1 class="text-primary-lighten-3 text-h4">
        Transaction ID:
        <span class="d-block font-weight-medium text-primary-lighten-5 text-body-3">{{ transactionId }}</span>
      </h1>
    </VCol>
    <VCol
      :class="\`fill-flex-height text-h4 text-capitalize bg-\${getOrderStageColor(stage)}\`"
    >
      <span>{{ getOrderStageName(stage) }}</span>
    </VCol>
    <VSpacer />
    <VSpacer />
    <VCol class="flex-grow-0 fill-flex-height white-text">
      <VBtn
        variant="text"
        class="text-h4"
        @click="$emit('close-order-dialog')"
      >
        <VIcon>$times</VIcon>
      </VBtn>
    </VCol>
  </VRow>
</template>

<script>
import { getOrderStageColor, getOrderStageName } from '@/utils/orderHelpers';

export default {
  props: {
    stage: {
      type: String,
      default: '',
    },
    transactionId: {
      type: String,
      default: '',
    },
  },
  emits: ['close-order-dialog'],
  methods: {
    getOrderStageColor: getOrderStageColor,
    getOrderStageName: getOrderStageName,
  },
};
<\/script>

<style scoped lang="scss">

.details-header {
  position: relative;
  z-index: 10;
}

.fill-flex-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0 16px !important;
}

:deep(.v-toolbar__content) {
  padding: 0 !important;
}
</style>`;export{e as default};
