const n=`<template>
  <div class="payment-type">
    <VChip
      v-if="layoutType === 'chip' && paymentType === 'card'"
      color="accent"
    >
      <span class="mr-2 text-body-4">{{ displayedPan || 'No Pan' }}</span>
      <VIcon
        class="icon-duotone-credit-card"
        icon="$duoToneCreditCard"
        size="24"
      />
    </VChip>
    <VTooltip
      v-else
      location="top left"
      theme="dark"
    >
      <template #activator="{ props }">
        <div
          v-bind="props"
          class="d-flex"
        >
          <VIcon
            v-if="iconProps"
            v-bind="iconProps"
            :size="paymentType=== 'card' ? 22 : 50"
          />
          <span
            v-if="paymentType === 'card'"
            class="ml-2 text-body-1 text-primary"
          >
            {{ displayedPan }}
          </span>
        </div>
      </template>
      <span class="text-capitalize">{{ displayedPaymentType }}</span>
    </VTooltip>
  </div>
</template>

<script>
export default {
  props: {
    cardNumber: {
      type: String,
      default: ''
    },
    cardType: {
      type: String,
      default: ''
    },
    layoutType: {
      type: String,
      default: 'inline',
      validator: (type) => ['chip', 'inline'].includes(type)
    },
    panLength: {
      type: String,
      default: 'full',
      validator: (type) => ['full', 'truncated'].includes(type)
    },
    paymentType: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      iconPropsMap: {
        amex: {
          class: 'text-primary-lighten-3',
          icon: '$ccAmex'
        },
        cash: {
          class: 'icon-duotone-money-bill-1',
          icon: '$moneyBill1'
        },
        coupon: {
          class: 'icon-duotone-coupon',
          icon: '$duoCoupon'
        },
        discover: {
          class: 'text-primary-lighten-3',
          icon: '$ccDiscover'
        },
        defaultCard: {
          class: 'text-primary-lighten-3',
          icon: '$creditCard'
        },
        mastercard: {
          class: 'text-primary-lighten-3',
          icon: '$ccMastercard'
        },
        upc: {
          class: 'icon-duotone-upc',
          icon: '$duoUPC'
        },
        visa: {
          class: 'text-primary-lighten-3',
          icon: '$ccVisa'
        },
      },
    };
  },
  computed: {
    iconProps() {
      let icon = this.paymentType;
      if (this.paymentType === 'card') {
        icon = this.cardType.toLowerCase();
      }
      return this.iconPropsMap[icon] || this.iconPropsMap['defaultCard'];
    },
    displayedPan() {
      let pan = this.cardNumber;
      if (this.panLength === 'truncated') {
        pan = this.cardNumber.substring(this.cardNumber.length - 4);
      }
      return pan;
    },
    displayedPaymentType() {
      let payment = this.paymentType;
      if (payment === 'card') {
        payment = this.cardType || 'credit card';
      }
      return payment;
    }
  },
};
<\/script>
`;export{n as default};
