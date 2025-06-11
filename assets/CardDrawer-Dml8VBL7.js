const r=`<template>
  <div v-click-outside="onClickOutside">
    <VNavigationDrawer
      v-model="cardDrawer.isShown"
      location="end"
      :width="cardDrawer.isSecondaryShown ? '1200' : '600'"
      color="surface-variant"
      disable-route-watcher
      temporary
      floating
    >
      <template #prepend>
        <CardDrawerHeader :variant="cardDrawer?.headerVariant" />
      </template>
      <div class="px-6 py-4 h-100">
        <VRow class="h-100 position-relative mt-0 overflow-auto">
          <VCol class="align-self-start position-sticky top-0">
            <div
              v-for="(item, index) in cardDrawer.components"
              :key="index"
              class="mb-6"
            >
              <Component :is="item" />
            </div>
          </VCol>
          <VCol v-if="cardDrawer.isSecondaryShown">
            <Component
              :is="item"
              v-for="(item, index) in cardDrawer.secondaryComponents"
              :key="index"
            />
          </VCol>
        </VRow>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import KeySkuCard from '@/components/base/Card/KeySkuCard.vue';
import CustomerCard from '@/components/order/CustomerCard.vue';
import OrderCardDetails from '@/components/order/OrderCardDetails.vue';
import OrderCardTracking from '@/components/order/OrderCardTracking.vue';
import OrderActivity from '@/components/order/OrderActivity.vue';
import CardDrawerHeader from '@/components/core/CardDrawerHeader.vue';

export default {
  components: {
    CardDrawerHeader,
    KeySkuCard,
    CustomerCard,
    OrderCardDetails,
    OrderCardTracking,
    OrderActivity,
  },
  computed: {
    ...mapGetters('app', {
      cardDrawer: 'getCardDrawer',
      isTimeoutWarningShown: 'getIsTimeoutWarningShown'
    }),
    secondaryComponents() {
      return this.cardDrawer.secondaryComponents || [];
    },
  },
  methods: {
    ...mapMutations('app', ['setCardDrawer', 'resetCardDrawer']),
    onClickOutside() {
      if (this.cardDrawer.isActive && !this.isTimeoutWarningShown) {
        this.resetCardDrawer();
      }
    },
  }
};
<\/script>
`;export{r as default};
