const n=`<template>
  <div class="print-pick-label">
    <PrintTeleporter
      ref="printTeleporter"
      @printing-complete="handlePrintComplete"
    >
      <template #default="{isPrinting}">
        <div
          v-if="isPrinting"
        >
          <PickLabel
            v-for="order in ordersToPrint"
            :key="order.transactionId"
            :order="order"
          />
        </div>
      </template>
    </PrintTeleporter>
    <VBtnSecondary
      :disabled="ordersToPrint.length === 0"
      prepend-icon="$print"
      @click="handlePrintBtnClick"
    >
      {{ printBtnLabel }}
    </VBtnSecondary>
    <ConfirmDialog
      ref="confirm"
      persistent
      class="d-print-none"
    >
      <template
        v-if="confirmAction === 'print' && isPendingPrintStage"
        #below-actions
      >
        <div class="d-flex justify-end px-4">
          <VCheckbox
            v-model="toggleSkipInitialPrintConfirmation"
            label="Do not show again"
            hide-details
          />
        </div>
      </template>
    </ConfirmDialog>
  </div>
</template>

<script>
import ConfirmDialog from '@/components/base/ConfirmDialog.vue';
import PrintTeleporter from '@/components/base/PrintTeleporter.vue';
import PickLabel from '@/components/order/PickLabel.vue';
import { mapMutations, mapState } from 'vuex';

export default {
  components: { PrintTeleporter, PickLabel, ConfirmDialog },
  props: {
    orders: {
      type: [Array, Object],
      required: true,
    },
    isReprintable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['print-process-complete', 'print-canceled'],
  data() {
    return {
      confirmAction: 'print',
    };
  },
  computed: {
    ...mapState('orders', ['skipInitialPrintConfirmation']),
    printBtnLabel() {
      const orderCount = this.ordersToPrint.length > 1 ? this.ordersToPrint.length : ' ';
      return this.isReprintable && !this.isPendingPrintStage
        ? \`RePrint \${orderCount} \${this.formattedStrings.label}\`
        : \`Print \${orderCount} \${this.formattedStrings.label}\`;
    },
    ordersToPrint() {
      return Array.isArray(this.orders) ? this.orders : [this.orders];
    },
    isPendingPrintStage() {
      return this.ordersToPrint[0]?.stage === 'pending-print';
    },
    formattedStrings() {
      const isPlural = this.ordersToPrint.length > 1;
      return {
        label: isPlural ? 'labels' : 'label',
        has: isPlural ? 'have' : 'has',
      };
    },
    toggleSkipInitialPrintConfirmation: {
      get() {
        return this.skipInitialPrintConfirmation;
      },
      set(value) {
        this.setSkipInitialPrintConfirmation(value);
      }
    },
  },
  methods: {
    ...mapMutations('orders', ['setSkipInitialPrintConfirmation']),
    async showPrintConfirmationDialog() {
      const confirmationContents = {
        rePrintableInitial: {
          title: 'Label Already Printed',
          message: 'This label has already been printed. Are you sure you want to reprint?',
          supportingMessage: !this.skipInitialPrintConfirmation
            ? 'NOTE: You must confirm the label has printed after printing to transition to the next stage.'
            : undefined,
          confirmBtnText: 'Yes, Reprint',
          cancelBtnText: 'Cancel',
        },
        defaultInitial: {
          title: 'ATTENTION',
          message: \`You must confirm the \${this.formattedStrings.label} \${this.formattedStrings.has} printed after printing to transition to the next stage.\`,
          confirmBtnText: 'I Understand, Print',
          cancelBtnText: 'Cancel',
        },
        final: {
          title: \`Confirm the \${this.formattedStrings.label} Printed\`,
          message: \`Did the \${this.formattedStrings.label} print successfully?\`,
          confirmBtnText: 'Yes, submit',
          cancelBtnText: 'No, cancel',
        },
      };

      let content;
      if (this.confirmAction === 'print') {
        if (this.isPendingPrintStage) {
          content = confirmationContents.defaultInitial;
        } else {
          content = confirmationContents.rePrintableInitial;
        }
      } else {
        content = confirmationContents.final;
      }

      const dialogOptions = {
        confirmBtnText: content.confirmBtnText,
        cancelBtnText: content.cancelBtnText,
        supportingMessage: content.supportingMessage,
        width: 400,
        color: 'error',
        titleIcon: '$exclamationTriangle',
        zIndex: 2410,
      };

      return await this.$refs.confirm.open(content.title, content.message, dialogOptions);
    },
    async handlePrintBtnClick() {
      this.confirmAction = 'print';
      let isInitialPrintConfirmed = this.isPendingPrintStage && this.skipInitialPrintConfirmation || await this.showPrintConfirmationDialog();
      if (isInitialPrintConfirmed) {
        this.printLabels();
      } else {
        this.$emit('print-canceled');
      }
    },
    async submitPrintedLabels() {
      const results = await this.postOrderPrinted(this.ordersToPrint);
      const resultType = this.getSubmissionResultType(results);
      this.showSubmissionResultsSnackbar(results, resultType);

      return {
        failedOrders: results.failed,
        result: resultType,
      };
    },

    async postOrderPrinted(orders) {
      const printOrder = async (order) => {
        const sessionId = order.sessionId || order.session?.sessionId;
        try {
          await this.$store.dispatch('order/postOrderPrinted', sessionId);
          return order;
        } catch (error) {
          throw { order, error };
        }
      };

      const results = await Promise.allSettled(orders.map(printOrder));

      return results.reduce((acc, result) => {
        if (result.status === 'rejected') {
          acc.failed.push({
            order: result.reason.order,
            error: result.reason.error.message,
          });
        } else {
          acc.successful.push(result.value);
        }
        return acc;
      }, { successful: [], failed: [] });
    },

    getSubmissionResultType(results) {
      const { successful, failed } = results;
      if (successful.length > 0 && failed.length === 0) {
        return 'successful';
      }
      if (successful.length === 0 && failed.length > 0) {
        return 'failed';
      }
      if (successful.length > 0 && failed.length > 0) {
        return 'partial';
      }
      return 'noOrders';
    },

    showSubmissionResultsSnackbar(results, resultType) {
      const { successful, failed } = results;
      const formattedSuccessOrderString = successful.length > 1 ? 'orders' : 'order';
      const formattedFailedOrderString = failed.length > 1 ? 'orders' : 'order';
      const settings = {
        successful: {
          message: \`Successfully submitted \${successful.length} \${formattedSuccessOrderString} as printed\`,
        },
        failed: {
          color: 'error',
          message: \`Failed to submit \${failed.length} \${formattedFailedOrderString} as printed.\`,
        },
        partial: {
          color: 'warning',
          message: \`Successfully submitted \${successful.length} \${formattedSuccessOrderString} as printed, but failed to submit \${failed.length} \${formattedFailedOrderString}\`,
        },
        noOrders: {
          color: 'info',
          message: 'No data submitted',
        },
      };

      this.$store.dispatch('app/setSnackbar', {
        ...settings[resultType],
      });
    },
    printLabels() {
      this.$refs.printTeleporter.print();
    },
    async handlePrintComplete() {
      this.confirmAction = 'submit';
      const wasPrintSuccessful = await this.showPrintConfirmationDialog();
      if (wasPrintSuccessful) {
        const requestResult = await this.submitPrintedLabels();
        this.$emit('print-process-complete', requestResult);
      }
    },
  },
};
<\/script>
`;export{n as default};
