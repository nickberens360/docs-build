const n=`<template>
  <VToolbar
    height="64"
    :class="\`bg-\${bgColor}\`"
  >
    <VBtn
      variant="text"
      icon="$times"
      @click="closeCardDrawer"
    />
    <VToolbarTitle>
      {{ title }}
    </VToolbarTitle>

    <VSpacer />
    <template
      v-if="secondaryAction"
      #append
    >
      <VBtn
        variant="text"
        @click="handleSecondaryBtnClick()"
      >
        <VIcon class="mr-2">
          {{ cardDrawer.isSecondaryShown ? '$angleRight' : '$angleLeft' }}
        </VIcon>
        {{ secondaryActionTitle }}
      </VBtn>
    </template>
  </VToolbar>
</template>

<script>
import { getOrderStageColor, getOrderStageName } from '@/utils/orderHelpers';
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    variant: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    ...mapGetters('order', ['orderDetails']),
    ...mapGetters('app', { cardDrawer: 'getCardDrawer' }),
    bgColor() {
      let bgColor = 'primary';
      if (this.variant === 'order') {
        bgColor = this.getOrderStageColor(this?.orderDetails?.stage);
      }
      return bgColor;
    },
    title() {
      let title = 'Details';
      if (this.variant === 'order') {
        title = this.getOrderStageName(this?.orderDetails?.stage);
      }
      return title;
    },
    secondaryActionTitle() {
      let secondaryActionTitle = 'View More';
      if (this.variant === 'order') {
        secondaryActionTitle = 'Activity';
      }
      return secondaryActionTitle;
    },
    secondaryAction() {
      let secondaryAction = '';
      if (this.variant === 'order') {
        secondaryAction = 'toggleSecondaryExpand';
      }
      return secondaryAction;
    },
  },
  methods: {
    getOrderStageColor,
    getOrderStageName,
    ...mapMutations('app', ['setCardDrawer', 'resetCardDrawer']),
    handleSecondaryBtnClick() {
      if (this.secondaryAction === 'toggleSecondaryExpand') {
        this.setCardDrawer({
          isSecondaryShown: !this.cardDrawer.isSecondaryShown,
        });
      }
    },
    closeCardDrawer() {
      this.resetCardDrawer();
    },
  },
};
<\/script>
`;export{n as default};
