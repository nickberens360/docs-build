const n=`<template>
  <div class="receipt-wrapper">
    <div v-if="!formSubmitted">
      <p class="text-h4 on-surface-low-contrast-text">
        Send Receipt
      </p>
      <VRadioGroup
        v-model="currentActiveForm"
        height="32"
        class="ml-2"
      >
        <VRadio
          value="email"
          class="mr-8"
        >
          <template #label>
            <span class="on-surface-high-contrast-text">Email</span>
          </template>
        </VRadio>
        <VRadio
          v-if="isTextReceiptEnabled"
          value="text"
          class="mr-8"
        >
          <template #label>
            <span class="on-surface-high-contrast-text">Text</span>
          </template>
        </VRadio>
      </VRadioGroup>
      <VExpandTransition>
        <EmailReceiptForm
          v-show="currentActiveForm === 'email'"
          v-model:email="formData.email"
          v-model:is-form-valid="isEmailFormValidated"
        />
      </VExpandTransition>
      <VExpandTransition>
        <TextReceiptForm
          v-show="currentActiveForm === 'text'"
          v-model:phone="formData.phone"
          v-model:is-form-valid="isTextFormValidated"
        />
      </VExpandTransition>
      <VRow
        justify="end"
        align="center"
        class="flex-row"
      >
        <VCol class="flex-grow-0 pr-0">
          <VBtnSecondary
            class="mr-2"
            @click="handleCancelClick"
          >
            Cancel
          </VBtnSecondary>
        </VCol>
        <VCol class="flex-grow-0">
          <VBtnPrimary
            v-if="currentActiveForm === 'email'"
            :disabled="!isEmailFormValidated"
            @click="handleSubmitClick"
          >
            Email Receipt
          </VBtnPrimary>
          <VBtnPrimary
            v-if="currentActiveForm === 'text'"
            :disabled="!isTextFormValidated"
            @click="handleSubmitClick"
          >
            Text Receipt
          </VBtnPrimary>
        </VCol>
      </VRow>
    </div>

    <SuccessAnimation
      v-if="formSubmitted && !errorMessage"
      :icon-primary="successIcon"
      :extend-class="{
        'success-animation--text': currentActiveForm === 'text',
      }"
      @animation-complete="handleAnimationComplete"
    >
      <template #message>
        Receipt has been <span class="font-weight-bold">{{ sendMethodLabel }}</span> to <span class="font-weight-bold">{{ name || email }}.</span>
      </template>
    </SuccessAnimation>
    <VExpandTransition>
      <p
        v-if="errorMessage"
        class="mt-4 text-caption text-error"
      >
        {{ errorMessage }}
      </p>
    </VExpandTransition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SuccessAnimation from '@/components/base/SuccessAnimation.vue';
import EmailReceiptForm from '@/components/order/EmailReceiptForm.vue';
import TextReceiptForm from '@/components/order/TextReceiptForm.vue';

export default {
  components: {
    SuccessAnimation,
    EmailReceiptForm,
    TextReceiptForm,
  },
  props: {
    name: {
      type: String,
      default: 'Customer',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    activeForm: {
      type: String,
      default: 'email',
    },
    isTextReceiptEnabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        email: null,
        phone: null,
      },
      receiptData: {
        notes: null, // optional
        recipient: '', // email address or phone number
        sessionId: '',
        zoneOffset: '-06:00', // timezone offset of CS agent - TODO: get from current user
      },
      currentActiveForm: null,
      expandSuccessMessage: false,
      errorMessage: null,
      formSubmitted: false,
      isEmailFormValidated: false,
      isTextFormValidated: false,
      scaleSuccessCheckIcon: false,
      scaleSuccessIcon: false,
      sendMethodLabel: null,
      successIcon: null,
      successMessage: null,
    };
  },
  watch: {
    email: {
      handler() {
        this.formData.email = this.email;
      },
      immediate: true,
    },
    phone: {
      handler() {
        this.formData.phone = this.phone;
      },
      immediate: true,
    },
    formData: {
      handler() {
        if (this.errorMessage) {
          this.resetErrorMessage();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.currentActiveForm = this.activeForm;
    this.receiptData.sessionId = this.$route.params.order;
  },
  methods: {
    ...mapActions('order', ['sendOrderReceipt']),
    handleCancelClick() {
      this.$store.dispatch('app/closeTopCurtain');
    },
    handleAnimationComplete() {
      this.$store.dispatch('app/closeTopCurtain');
    },
    async handleSubmitClick() {
      if (this.errorMessage) {
        this.resetErrorMessage();
      }

      if (this.currentActiveForm === 'email' && this.formData.email) {
        this.receiptData.recipient = this.formData.email;
      } else {
        this.receiptData.recipient = this.formData.phone;
      }


      try {
        await this.sendOrderReceipt({ ...this.receiptData });
        this.formSubmitted = true;
        this.setSuccessMessage();
      } catch (error) {
        this.formSubmitted = false;

        if (error.response.status === 403) {
          this.errorMessage = 'Something went wrong, this user is not authorized to perform this action. Please try again, or contact support.';
        } else if (error.response.status === 404) {
          this.errorMessage = 'Something went wrong, this order was not found. Please try again, or contact support.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again, or contact support.';
        }
      }
    },
    resetErrorMessage() {
      this.errorMessage = false;
    },
    setSuccessMessage() {
      if (this.currentActiveForm === 'email') {
        this.successIcon = '$duoToneEnvelopeOpenText';
        this.sendMethodLabel = 'emailed';
      } else {
        this.successIcon = '$duoToneMessageText';
        this.sendMethodLabel = 'texted';
      }
    },
  },
};
<\/script>

<style scoped lang="scss">
.receipt-wrapper {
  max-width: 349px;
  margin: 0 auto;
}

.success-wrapper {
  top: -38px; // offset for the success text
}

.success-check-icon {
  position: absolute !important;
  right: 0 !important;
  z-index: 2 !important;
  border-radius: 50% !important;
  box-shadow: 0 0 0 4px #fff !important;
  &.success-check-icon--text {
    right: -12px !important;
    top: -6px;
  }
}

.success-text {
  position: absolute; // stop from pushing icon up when text expands
  top: 144px;
}

</style>
`;export{n as default};
