const e=`<template>
  <div
    v-if="orderDetails"
    class="key-sku-card"
  >
    <CardBase v-bind="$attrs">
      <template #cardTitle>
        <CardRow>
          <CardItem>
            <template #itemContent>
              <p class="text-h4 font-weight-medium">
                {{ orderDetails.items[0].description }}
              </p>
            </template>
          </CardItem>
          <CardItem>
            <template #itemContent>
              <a
                href="https://mykeycounter.com"
                target="_blank"
              >My Key Counter</a>
            </template>
          </CardItem>
        </CardRow>
      </template>

      <template #cardActions>
        <CardRow justify="flex-start">
          <CardItem title="Key SKU">
            <template #itemContent>
              <div class="d-flex align-center">
                <h3 class="text-h6 line-height-1 font-weight-regular">
                  {{ carKeySku }}
                </h3>
                <SkuResolutionEditor
                  class="ml-2"
                  @sku-resolved="fetchAllOrders"
                />
              </div>
            </template>
          </CardItem>

          <CardItem
            v-if="remoteSku"
            title="Remote SKU"
            class="ml-6"
          >
            <template #itemContent>
              <div class="d-flex align-center">
                <h3 class="text-h6 line-height-1 font-weight-regular">
                  {{ remoteSku }}
                </h3>
                <SkuResolutionEditor
                  sku-type="remote"
                  class="ml-2"
                  @sku-resolved="fetchAllOrders"
                />
              </div>
            </template>
          </CardItem>
        </CardRow>
      </template>
    </CardBase>
  </div>
</template>

<script>
import SkuResolutionEditor from '@/components/order/SkuResolutionEditor.vue';
import { getCarKeySkus } from '@/utils/orderHelpers';
import { mapActions, mapGetters } from 'vuex';
import CardBase from '@/components/base/Card/CardBase.vue';
import CardItem from '@/components/base/Card/CardItem.vue';
import CardRow from '@/components/base/Card/CardRow.vue';

export default {
  components: {
    SkuResolutionEditor,
    CardBase,
    CardRow,
    CardItem
  },
  computed: {
    ...mapGetters('order', ['orderDetails']),
    remoteSku() {
      return getCarKeySkus(this.orderDetails.items?.[0]).remote;
    },
    carKeySku() {
      return getCarKeySkus(this.orderDetails.items?.[0]).key;
    },
  },
  methods: {
    ...mapActions('orders', ['fetchAllOrders']),
  }
};
<\/script>
`;export{e as default};
