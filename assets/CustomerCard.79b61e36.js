const n=`<template>
  <div v-if="orderDetails">
    <CardBase v-bind="$attrs">
      <template #cardTitle>
        <span class="text-h4 text-capitalize font-weight-medium">{{
          orderDetails?.customer?.name || "Customer name unavailable"
        }}</span>
      </template>

      <template #cardContent>
        <CardRow>
          <CardItem title="Shipping Address">
            <template #itemContent>
              <CustomerShippingAddress
                :shipping-address="orderDetails.shippingAddress"
                hide-editor
              />
            </template>
          </CardItem>
          <CardItem title="Contact Info">
            <template #itemContent>
              <ul class="card-item-list">
                <li class="d-flex align-center">
                  <VIcon
                    class="mr-2 icon-16"
                    color="primary"
                  >
                    $circlePhone
                  </VIcon>
                  {{
                    orderDetails?.customer?.phoneNumber ||
                      "Phone data unavailable"
                  }}
                </li>
                <li class="d-flex align-center">
                  <VIcon
                    class="mr-2 icon-16"
                    color="primary"
                  >
                    $at
                  </VIcon>
                  <a
                    :href="\`mailto:\${orderDetails?.customer?.email || '#'} \`"
                  >{{
                    orderDetails?.customer?.email || "Email data unavailable"
                  }}</a>
                </li>
              </ul>
            </template>
          </CardItem>
        </CardRow>
        <VDivider class="my-4" />
        <CardRow>
          <CardItem title="Payment">
            <template #itemContent>
              <PaymentType
                :card-number="orderDetails.payment.card?.pan"
                :card-type="orderDetails.payment.card?.issuer"
                :payment-type="orderDetails.payment.type"
              />
              <ul
                v-if="isValidCard"
                class="card-item-list mt-2"
              >
                <li>
                  <VIcon
                    class="mr-2 icon-16"
                    color="primary"
                  >
                    $duoMicrochip
                  </VIcon>
                  <span class="text-caption-2 text-primary">
                    {{ orderDetails.payment.card.processor }}
                  </span>
                </li>
                <li v-if="orderDetails.payment.card.processor === 'Eport'">
                  <span class="font-weight-bold text-primary">Device Trans Id:</span>
                  <span class="text-caption-2 text-primary">
                    {{ orderDetails.payment?.eportTransactionId || "" }}
                  </span>
                  <span
                    v-show="orderDetails.payment?.serialNumber || false"
                    class="text-caption-2 text-primary ml-4"
                  >
                    <span class="font-weight-bold">Device Serial #:</span>
                    {{ orderDetails.payment.serialNumber }}
                  </span>
                </li>
              </ul>
            </template>
          </CardItem>

          <CardItem>
            <template #itemContent>
              <div class="total text-body-2 mb-2 pr-2 text-right ">
                {{ $filters.currency(transactionTotal) }}
              </div>
              <VBtnPrimary
                elevation="0"
                size="large"
                :to="{name: 'orderRefund', params: {order: orderDetails.session.sessionId}}"
              >
                Refund
              </VBtnPrimary>
            </template>
          </CardItem>
        </CardRow>
      </template>
    </CardBase>
  </div>
</template>

<script>
import CustomerShippingAddress from '@/components/order/CustomerShippingAddress.vue';
import { mapGetters } from 'vuex';
import CardBase from '@/components/base/Card/CardBase.vue';
import CardItem from '@/components/base/Card/CardItem.vue';
import CardRow from '@/components/base/Card/CardRow.vue';
import PaymentType from '@/components/order/PaymentType.vue';
import { getMachineTypeIsRefundEligible, getPaymentTypeIsRefundEligible } from '@/utils/orderHelpers';

export default {
  components: {
    CustomerShippingAddress,
    CardBase,
    CardItem,
    CardRow,
    PaymentType,
  },
  computed: {
    ...mapGetters('order', ['orderDetails']),
    transactionTotal() {
      if (this.orderDetails.stage === 'refunded') {
        return this.orderDetails.payment.subTotal;
      }

      return this.orderDetails.payment.total;
    },
    isValidCard() {
      return this.orderDetails?.payment?.card?.processor;
    },
    showRefundButton() {
      return (
        getPaymentTypeIsRefundEligible(this.orderDetails.payment.type) &&
        getMachineTypeIsRefundEligible(this.orderDetails.session.kioskNumber)
      );
    }
  }
};
<\/script>

<style scoped lang="scss">
.total {
  color: rgb(var(--v-theme-primary));
}
</style>
`;export{n as default};
