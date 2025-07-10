const n=`<template>
  <div class="customer-shipping-address">
    <ul
      v-if="shippingAddress"
      class="customer-shipping-address__data list-reset"
    >
      <li>
        {{ shippingAddress.street }}
        <span v-if="shippingAddress.street2">,
          {{ shippingAddress.street2 }}
        </span>
      </li>
      <li>
        {{ shippingAddress.city }},
        {{ shippingAddress.state }}
        {{ shippingAddress.zip }}
      </li>
      <li v-if="shippingAddress?.county">
        {{ shippingAddress.county }} County
      </li>
      <li v-if="shippingAddress?.country">
        {{ shippingAddress.country }}
      </li>
    </ul>
    <ul
      v-else
      class="customer-shipping-address__no-data list-reset"
    >
      <li>Shipping address not provided</li>
    </ul>
    <div
      v-if="hasActions"
      class="customer-shipping-address__actions ml-2"
    >
      <OrderAddressEditor
        v-if="!hideEditor"
        class="mb-2"
      />
      <CopyButton
        v-if="easyCopy && shippingAddress"
        :text-to-copy="copyAddressText"
        tooltip-text="Copy address"
      />
    </div>
  </div>
</template>

<script>
import OrderAddressEditor from '@/components/order/OrderAddressEditor.vue';
import CopyButton from '@/components/base/CopyButton.vue';

export default {
  components: {
    OrderAddressEditor,
    CopyButton
  },
  props: {
    shippingAddress: {
      type: Object,
      required: false,
      default: () => null,
    },
    hideEditor: {
      type: Boolean,
      default: false,
    },
    easyCopy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showCopiedTooltip: false
    };
  },
  computed: {
    hasActions() {
      return !this.hideEditor || this.easyCopy;
    },
    copyAddressText() {
      let addressString = '';
      if (this.shippingAddress.name) {
        addressString += \`\${this.shippingAddress.name}\\n\`;
      }
      addressString += \`\${this.shippingAddress.street}\\n\`;
      if (this.shippingAddress.street2) {
        addressString += \`\${this.shippingAddress.street2}\\n\`;
      }
      addressString += \`\${this.shippingAddress.city}, \${this.shippingAddress.state} \${this.shippingAddress.zip}\`;
      return addressString;
    }
  },
};
<\/script>

<style scoped lang="scss">
.customer-shipping-address {
  display: flex;
  &__data,
  &__no-data {
    line-height: 1.25;
  }
  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
`;export{n as default};
