const n=`<template>
  <div
    class="receipt-wrapper py-20"
  >
    <div v-if="!formSubmitted">
      <p class="text-h4 text-primary-lighten-2 mb-4">
        Send Coupon
      </p>
      {{ couponTypeLabel }}
      <VRadioGroup
        v-model="formData.couponType"
        class="mb-4 ml-2 mt-0"
        height="32"
      >
        <VRadio
          value="minuteKey"
          class="mr-8"
        >
          <template #label>
            <span class="on-surface-high-contrast-text">MinuteKey</span>
          </template>
        </VRadio>
        <VRadio
          value="quickTag3"
          class="mr-8"
        >
          <template #label>
            <span class="on-surface-high-contrast-text">Quick Tag 3</span>
          </template>
        </VRadio>
      </VRadioGroup>

      <CouponForm
        v-model:amount="formData.amount"
        v-model:reason="formData.reason"
        v-model:is-form-valid="isCouponFormValidated"
      />

      <VRadioGroup
        v-model="emailOrTextForm"
        class="mb-4 ml-2"
        height="32"
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
          value="text"
          class="mr-8"
        >
          <template #label>
            <span class="on-surface-high-contrast-text">Text</span>
          </template>
        </VRadio>
      </VRadioGroup>

      <VRow
        align="end"
      >
        <VCol>
          <VExpandTransition>
            <EmailReceiptForm
              v-show="emailOrTextForm === 'email'"
              v-model:email="formData.email"
              v-model:is-form-valid="isEmailFormValidated"
            />
          </VExpandTransition>
          <VExpandTransition>
            <TextReceiptForm
              v-show="emailOrTextForm === 'text'"
              v-model:phone="formData.phone"
              v-model:is-form-valid="isTextFormValidated"
            />
          </VExpandTransition>
        </VCol>
        <VCol>
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
                :disabled="!isSubmitBtnDisabled"
                @click="handleSubmitClick"
              >
                Send Coupon
              </VBtnPrimary>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </div>
    <SuccessAnimation
      v-if="formSubmitted"
      icon-primary="$duoToneReceipt"
      @animation-complete="handleAnimationComplete"
    >
      <template #message>
        <span class="font-weight-bold">{{ couponTypeLabel }}</span> coupon has been <span class="font-weight-bold">{{ sendMethodLabel }}</span> to <span class="font-weight-bold">{{ name }}.</span>
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
import { required } from '@/utils/validationMethods';
import SuccessAnimation from '@/components/base/SuccessAnimation.vue';
import EmailReceiptForm from '@/components/order/EmailReceiptForm.vue';
import TextReceiptForm from '@/components/order/TextReceiptForm.vue';
import CouponForm from '@/components/order/CouponForm.vue';

export default {
  components: {
    SuccessAnimation,
    EmailReceiptForm,
    TextReceiptForm,
    CouponForm,
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
  },
  data() {
    return {
      formData: {
        email: null,
        phone: null,
        couponType: 'minuteKey',
        amount: null,
        reason: null,
      },
      formSubmitted: false,
      isEmailFormValidated: false,
      isTextFormValidated: false,
      isCouponFormValidated: false,
      errorMessage: null,
      emailOrTextForm: 'email',
      couponTypeLabel: null,
      sendMethodLabel: null,
    };
  },
  computed: {
    isSubmitBtnDisabled() {
      if (this.emailOrTextForm === 'email') {
        return this.isEmailFormValidated && this.isCouponFormValidated;
      } else {
        return this.isTextFormValidated && this.isCouponFormValidated;
      }
    },
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
  },
  methods: {
    required,
    handleCancelClick() {
      this.$store.dispatch('app/closeTopCurtain');
    },

    handleSubmitClick() {
      // Integration Ticket: https://minutekey.atlassian.net/jira/software/projects/MIL/boards/71/backlog?selectedIssue=MIL-226

      if (this.emailOrTextForm === 'email' && this.formData.email && this.isCouponFormValidated) {
        this.formData.phone = null;
        console.log('Form Data:', this.formData); // left comment for integration ticket
        this.setSuccessMessage();
        this.formSubmitted = true;
      } else if (this.emailOrTextForm === 'text' && this.formData.phone  && this.isCouponFormValidated) {
        this.formData.email = null;
        console.log('Form Data:', this.formData); // left comment for integration ticket
        this.setSuccessMessage();
        this.formSubmitted = true;
      } else {
        this.formSubmitted = false;
        this.errorMessage = 'Something went wrong. Please try again, or contact support.';
      }
    },

    setSuccessMessage() {
      if (this.formData.couponType === 'minuteKey') {
        this.couponTypeLabel = 'MinuteKey';
      } else {
        this.couponTypeLabel = 'Quick Tag 3';
      }

      if (this.emailOrTextForm === 'email') {
        this.sendMethodLabel = 'Emailed';
      } else {
        this.sendMethodLabel = 'Texted';
      }
    },
    handleAnimationComplete() {
      this.$store.dispatch('app/closeTopCurtain');
    },

  },

};
<\/script>

<style scoped lang="scss">
.receipt-wrapper {
  max-width: 664px;
  margin: 0 auto;
}

:deep(.v-text-field.v-text-field--enclosed .v-text-field__details) {
  margin-bottom: 0 !important;
}

:deep(.v-text-field__details) {
  height: 0 !important;
  min-height: 0 !important;
  overflow: visible !important;
}

:deep(.v-messages) {
  height: 0 !important;
  min-height: 0 !important;
}

:deep(.v-input__slot) {
  margin-bottom: 0 !important;
}

:deep(.error--text) {
  .v-messages {
    height: unset !important;
    min-height: 14px !important;
    margin-top: 4px !important;
  }

  .v-text-field__details {
    height: unset !important;
    min-height: 14px !important;
  }
}

</style>
`;export{n as default};
