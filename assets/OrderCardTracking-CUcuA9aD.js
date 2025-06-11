const n=`<template>
  <CardBase
    v-if="orderDetails"
    elevation="4"
    v-bind="$attrs"
  >
    <template
      #cardTitle
    >
      Shipping Information
    </template>
    <template #cardContent>
      <TrackingNumberForm
        v-if="hasTrackingForm"
        class="pb-5"
      />
      <div v-if="shipmentActivity.length">
        <p class="on-surface-low-contrast-text text-caption-2 font-weight-regular mb-2">
          Tracking Numbers
        </p>
        <TrackingItem
          v-for="shipmentItem in shipmentActivity"
          :key="shipmentItem.identifier"
          :tracking-number="shipmentItem.identifier"
          :timestamp="shipmentItem.timestamp"
          class="mb-1"
        />
      </div>
      <div v-else>
        <p class="on-surface-low-contrast-text text-body-1 mb-0 d-flex align-end">
          <VIcon
            color="primary-lighten-3"
            size="28"
            class="mr-2"
          >
            $truck
          </VIcon> Shipping information unavailable
        </p>
      </div>
    </template>
  </CardBase>
</template>

<script>
import { mapGetters } from 'vuex';
import CardBase from '@/components/base/Card/CardBase.vue';
import TrackingItem from '@/components/base/TrackingItem.vue';
import TrackingNumberForm from '@/components/order/TrackingNumberForm.vue';

export default {
  components: {
    TrackingNumberForm,
    CardBase,
    TrackingItem,
  },
  computed: {
    ...mapGetters('order', ['orderDetails', 'shipmentActivity']),
    hasTrackingForm() {
      return this.orderDetails?.items?.some(item => item.type === 'CK') && this.orderDetails?.stage !== 'refunded';
    },
  },
};
<\/script>`;export{n as default};
