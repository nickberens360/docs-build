const n=`<template>
  <div class="refund-form-item mt-4">
    <VRow
      align="center"
      class="mb-0"
    >
      <VCol
        v-if="orderItem.type !== 'DN'"
        cols="3"
        class="d-flex flex-column align-center justify-center"
      >
        <VImg
          :src="environment.skuImageBaseUrl + orderItem.sku"
          width="65px"
          class="mb-3"
          cover
          :alt="\`\${orderItem.description} image\`"
        />
        <p class="mb-0 text-primary-lighten-1">
          {{ orderItem.sku }}
        </p>
      </VCol>
      <VCol
        v-if="orderItem.type === 'DN'"
        cols="3"
      />
      <VCol cols="6">
        {{ orderItem.description }}
      </VCol>
      <VSpacer />

      <VMenu :disabled="quantityOptions.length <= 1">
        <template #activator="{ props }">
          <VChip
            v-bind="props"
            color="primary"
            size="small"
            :append-icon="quantityOptions.length > 1 ? '$dropdown' : undefined"
          >
            {{ selectedQuantity }}
          </VChip>
        </template>
        <VCard>
          <VCardText>
            <VCheckbox
              v-for="quantityOption in quantityOptions"
              :key="quantityOption"
              v-model="selectedQuantity"
              :value="quantityOption"
              hide-details
              color="primary"
              inline
              density="compact"
            >
              <template #label>
                <span class="text-body-4 font-weight-medium text-no-wrap ml-1">{{ quantityOption }}</span>
              </template>
            </VCheckbox>
          </VCardText>
        </VCard>
      </VMenu>

      <VCol class="d-flex justify-center">
        {{ $filters.currency(amount) }}
      </VCol>
    </VRow>

    <VExpandTransition>
      <VSelect
        v-if="showReason"
        v-model="selectedReason"
        :rules="reasonRules"
        :items="reasonOptions"
        label="Reason"
        variant="outlined"
        density="compact"
        bg-color="white"
        color="primary-lighten-2"
        class="mb-4"
      />
    </VExpandTransition>

    <VExpandTransition>
      <VTextarea
        v-if="selectedReason === 'Other'"
        v-model="refundNotes"
        :rules="notesRules"
        autofocus
        bg-color="white"
        rows="3"
      />
    </VExpandTransition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { refundReasons } from '@/utils/orderHelpers';

export default {
  props: {
    itemId: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      default: null
    },
    quantity: {
      type: Number,
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    reason: {
      type: String,
      default: ''
    },
    showReason: {
      type: Boolean,
      default: false
    },
  },
  emits: [
    'update:quantity',
    'update:reason',
    'update:notes'
  ],
  data() {
    return {
      reasonOptions: refundReasons,
      reasonRules: [(v) => !!v || 'Reason required'],
      notesRules: [(v) => !!v || 'Notes required'],
      quantityOptions: []
    };
  },
  computed: {
    ...mapGetters({ environment: 'app/getEnvConfigs' }),
    orderItem() {
      return this.$store.state.order.selectedItems.find(({ itemId }) => itemId === this.itemId);
    },
    selectedQuantity: {
      get() {
        return this.quantity;
      },
      set(value) {
        this.$emit('update:quantity', value);
      }
    },
    selectedReason: {
      get() {
        return this.reason;
      },
      set(value) {
        this.$emit('update:reason', value);
        if (value !== 'Other') {
          this.refundNotes = '';
        }
      }
    },
    refundNotes: {
      get() {
        return this.notes;
      },
      set(value) {
        this.$emit('update:notes', value);
      }
    }
  },
  mounted() {
    const quantityAlreadyRefunded = (this.orderItem.refunds || []).reduce((acc, refund) => acc + refund.quantity, 0);
    const maxRefundableQuantity = this.orderItem.quantity - quantityAlreadyRefunded;
    this.selectedQuantity = maxRefundableQuantity;
    this.quantityOptions = Array.from({length: maxRefundableQuantity}, (_, i) => i + 1);
  },
};
<\/script>
`;export{n as default};
