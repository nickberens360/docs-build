const n=`<template>
  <div class="tracking-number-form">
    <VRow>
      <VCol>
        <VForm
          ref="trackingNumberForm"
          v-model="isValid"
        >
          <VTextField
            v-model="trackingNumberInput"
            variant="outlined"
            :density="inputDensity"
            placeholder="Enter Tracking Number"
            hide-details="auto"
            :rules="trackingValidation"
            @keypress.enter.prevent="() => undefined"
          >
            <template #append>
              <VBtnPrimary
                elevation="0"
                :size="btnSize"
                block
                text="Add"
                :disabled="!isValid"
                @click="handleAddTrackingNumber"
              />
            </template>
          </VTextField>
        </VForm>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getOrderStageName } from '@/utils/orderHelpers';

export default {
  props: {
    noOrderRefresh: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'compact'].includes(value)
    }
  },
  emits: ['tracking-number-added'],
  data() {
    return {
      trackingNumberInput: undefined,
      isValid: false,
      trackingValidation: [
        (v) => !!(v) || 'Tracking number is required',
      ]
    };
  },
  computed: {
    ...mapGetters('order', ['orderDetails']),
    sessionId() {
      return this.orderDetails.session.sessionId;
    },
    inputDensity() {
      const densityMap = {
        default: 'comfortable',
        compact: 'compact'
      };
      return densityMap[this.variant];
    },
    btnSize() {
      const sizeMap = {
        default: 'large',
        compact: 'default'
      };
      return sizeMap[this.variant];
    }
  },
  methods: {
    getOrderStageName,
    ...mapActions('order', ['addTrackingNumber', 'refreshOrderDetailsAndOrders']),
    async handleAddTrackingNumber() {
      try {
        await this.addTrackingNumber({
          sessionId: this.sessionId,
          trackingNumber: this.trackingNumberInput,
        });
        await this.$store.dispatch('app/setSnackbar', {
          message: 'Tracking Number: ' + this.trackingNumberInput + ' Added',
        });
      } catch (error) {
        this.$store.dispatch('app/setSnackbar', {
          message: 'Something went wrong',
          color: 'error',
        });
      }
      if (!this.noOrderRefresh) {
        await this.refreshOrderDetailsAndOrders();
      }
      this.$emit('tracking-number-added');
      this.$refs.trackingNumberForm.reset();
    },
  },
};
<\/script>
`;export{n as default};
