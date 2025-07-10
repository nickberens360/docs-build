const e=`<template>
  <div class="fill-height d-flex flex-column justify-space-between pb-0">
    <div>
      <div class="toolbar-header bg-surface elevation-3">
        <VToolbar
          density="compact"
          class="flex-grow-0 elevation-0 px-4"
        >
          <VBadge
            color="primary"
            inline
            rounded
            :content="numberItemsInOrder"
          />
          <span
            class="text-h4 ml-4 on-surface-low-contrast-text font-weight-medium"
          >Items</span>
          <VSpacer />
          <div
            v-for="(total, index) in orderTotals"
            :key="index"
            class="ml-8"
          >
            <span class="ml-4 on-surface-low-contrast-text text-body-1">{{
              total.title
            }}</span>
            <span class="ml-1 text-error-lighten-1 text-body-1">{{
              total.title === "Shipping" && isShippingRefunded
                ? "(Refunded)"
                : ""
            }}</span>
            <span
              class="ml-3 text-body-1 font-weight-bold"
              :class="total.showValueAsRed ? 'text-error' : 'on-surface-high-contrast-text'"
            >{{ $filters.currency(total.value) }}</span>
          </div>
        </VToolbar>
        <VToolbar
          v-if="!hideActionBar || !machineTypeIsRefundEligible"
          density="compact"
          color="surface-variant"
          class="flex-grow-0 elevation-0 px-4"
          height="62px"
        >
          <VSpacer />

          <div
            v-if="allowRefund"
            class="d-flex py-4 align-center on-surface-low-contrast-text text-caption-2"
          >
            Refund All

            <VIcon
              size="40"
              color="primary-lighten-2"
              class="ml-5"
              @click="selectAll()"
            >
              {{ selectedItems.length === refundableItems.length ? '$checkSquare' : '$checkboxOff' }}
            </VIcon>
          </div>
        </VToolbar>
      </div>
      <div>
        <DetailsListItem
          v-for="item in order.items"
          :key="item.itemId"
          :item="item"
        />
      </div>
    </div>

    <VSpacer />
    <div
      v-if="isFulfillableOrder"
      class="detail-list-footer bg-surface elevation-6"
    >
      <div class="d-flex align-center py-4 px-8 justify-end">
        <VBtnSecondary :to="{ name: 'fulfillmentDetails', params: { sessionId: order?.session?.sessionId } }">
          Fulfillment View
        </VBtnSecondary>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getMachineTypeIsRefundEligible, getPaymentTypeIsRefundEligible, getIsFulfillableOrder } from '@/utils/orderHelpers';
import DetailsListItem from '@/components/base/DetailsListItem/DetailsListItem.vue';

export default {
  components: {
    DetailsListItem,
  },
  props: {
    refundable: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      isRefundAllSelected: false
    };
  },
  computed: {
    ...mapGetters({
      order: 'order/orderDetails',
      selectedItems: 'order/selectedItems',
      refundableItems: 'order/getRefundableItems',
      orderHasShipping: 'order/getOrderHasShipping',
      shippingAlreadyRefunded: 'order/getHasShippingBeenRefunded'
    }),
    machineTypeIsRefundEligible() {
      return getMachineTypeIsRefundEligible(this.order.session.kioskNumber);
    },
    hideActionBar() {
      return this.refundableItems.length === 0;
    },
    isShippingRefunded() {
      return this.orderHasShipping && this.shippingAlreadyRefunded;
    },
    numberItemsInOrder() {
      let numItems = 0;
      this.order?.items.forEach(item => numItems += item.quantity);
      return numItems;
    },
    orderTotals() {
      let totals = [
        {
          title: 'Shipping',
          value: this.order.payment.shippingTotal || 0,
          showValueAsRed: this.isShippingRefunded
        },
        {
          title: 'Subtotal',
          value: this.order.payment.subTotal,
          showValueAsRed: false
        },
        {
          title: 'Taxes',
          value: this.order.payment.tax,
          showValueAsRed: false
        },
        {
          title: 'Discounts',
          value: this.discountAmount,
          showValueAsRed: this.discountAmount > 0
        },
        {
          title: 'Total',
          value:  this.determineTotal,
          showValueAsRed: false
        }
      ];

      if (this.order.payment.type === 'cash') {
        //Taxes are discounted on machines that accept cash
        totals.splice(2, 1);
      }

      return totals;
    },
    discountAmount() {
      let itemizedDiscountAmount = this.order.items.reduce((acc, item) => acc + (item.discountTotal * item.quantity), 0);
      return this.order.payment.couponTotal || itemizedDiscountAmount;
    },
    determineTotal() {
      if (this.order.payment.paidTotal > 0) {
        return this.order.payment.paidTotal;
      } else if (this.order.stage === 'voided') {
        return 0;
      } else {
        return this.order.payment.total;
      }
    },
    allowRefund() {
      return (
        getPaymentTypeIsRefundEligible(this.order.payment.type) &&
        this.machineTypeIsRefundEligible
      );
    },
    isFulfillableOrder() {
      return this.getIsFulfillableOrder(this.order);
    }
  },
  methods: {
    ...mapMutations({
      setSelectedItems: 'order/setSelectedItems'
    }),
    getIsFulfillableOrder,
    selectAll() {
      if (this.selectedItems.length < this.refundableItems.length) {
        this.setSelectedItems(this.refundableItems.slice());
      } else {
        this.setSelectedItems([]);
      }
    },
  }
};
<\/script>

<style scoped lang="scss">
.detail-list-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
}

:deep(.v-input--selection-controls__input) {
  margin-right: 0 !important;
}

.toolbar-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-cursor tbody tr:hover {
  cursor: pointer !important;
}

</style>
`;export{e as default};
