const n=`<template>
  <div v-if="orderDetails">
    <CardBase
      elevation="4"
    >
      <template #cardContent>
        <CardRow>
          <CardItem title="Transaction ID">
            <template #itemContent>
              <h3 class="text-h7 line-height-1 text-break">
                {{ transactionId }}
              </h3>
            </template>
          </CardItem>
          <CardItem title="Transaction Date">
            <template #itemContent>
              <h3 class="text-h7 line-height-1">
                {{ transactionDate }}
              </h3>
            </template>
          </CardItem>
        </CardRow>
      </template>
      <template #cardActions>
        <CardRow align="end">
          <CardItem title="Transaction Location">
            <template #itemContent>
              <ul class="card-item-list">
                <li>
                  <a href="#">{{ orderDetails?.session?.kioskNumber || "Kiosk number unavailable" }}</a>
                </li>
                <li class="text-md-body-5 mb-1 mt-2 font-weight-medium">
                  {{ orderDetails?.session?.storeName || "Store name unavailable" }}
                </li>
                <li>{{ orderDetails?.session?.storeAddress || "Store Address unavailable" }}</li>
              </ul>
            </template>
          </CardItem>
          <CardItem
            one-line
            class="d-block"
          >
            <template #itemContent>
              <VBtnPrimary
                elevation="0"
                size="large"
                class="ml-8"
                :to="{name: 'orderDetails', params: {order: orderDetails.session.sessionId}}"
              >
                Order Details
              </VBtnPrimary>
            </template>
          </CardItem>
        </CardRow>
      </template>
    </CardBase>
  </div>
</template>

<script>

import { parseISO, format } from 'date-fns';
import { mapGetters } from 'vuex';
import CardBase from '@/components/base/Card/CardBase.vue';
import CardItem from '@/components/base/Card/CardItem.vue';
import CardRow from '@/components/base/Card/CardRow.vue';

export default {
  components: {
    CardBase,
    CardItem,
    CardRow,
  },
  computed: {
    ...mapGetters({
      orderDetails: 'order/orderDetails',
    }),

    transactionId() {
      return this.orderDetails.transactionId;
    },
    transactionDate() {
      const date = this.orderDetails?.payment.timestamp;

      return format(parseISO(date), 'EE MM/dd/yyyy h:mm a');
    },
  },
};
<\/script>

<style scoped lang="scss">
.item-title{
  position: relative;
  left: 36px;
}
.item-content {
  position: relative;
  top: -5px;
}
</style>
`;export{n as default};
