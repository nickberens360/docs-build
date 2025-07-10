const n=`<template>
  <div>
    <VToolbar
      color="surface-light"
      v-bind="$attrs"
    >
      <slot name="message">
        <p
          v-if="message"
          class="px-4 text-caption font-italic font-weight-medium text-primary"
        >
          {{ message }}
        </p>
      </slot>
      <VSpacer />
      <a
        ref="downloadLink"
        :download="\`\${csvTitle}.csv\`"
        class="d-none"
      />
      <template v-if="!hideCsvBtn">
        <slot
          name="csv-btn"
          :generate-csv="generateCSV"
        >
          <VBtnSecondary
            prepend-icon="$arrowDownToLine"
            class="mr-2"
            @click="generateCSV"
          >
            CSV
          </VBtnSecondary>
        </slot>
      </template>
      <template v-if="!hidePrintBtn">
        <slot
          name="print-btn"
          :print="print"
        >
          <VBtnSecondary
            prepend-icon="$arrowDownToLine"
            class="mr-2"
            @click="print"
          >
            PDF
          </VBtnSecondary>
        </slot>
      </template>
    </VToolbar>
    <PrintTeleporter
      ref="printTeleporter"
      @printing-complete="$emit('printing-complete')"
    >
      <slot
        name="default"
        :is-printing="hideVApplicationOnPrint"
      />
    </PrintTeleporter>
    <slot name="skeleton-loader">
      <VSkeletonLoader
        v-if="hideVApplicationOnPrint && !hideSkeletonLoader"
        type="table"
      />
    </slot>
  </div>
</template>

<script>
import PrintTeleporter from '@/components/base/PrintTeleporter.vue';
import { mapState } from 'vuex';

export default {
  components: { PrintTeleporter },
  props: {
    csvHeaders: {
      type: Array,
      required: false,
      default: () => [],
    },
    csvItems: {
      type: Array,
      required: false,
      default: () => [],
    },
    csvTitle: {
      type: String,
      required: false,
      default: 'Table Data',
    },
    hideCsvBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
    hidePrintBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
    message: {
      type: String,
      required: false,
      default: '',
    },
    hideSkeletonLoader: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['printing-complete', 'csv-download-complete'],
  exposes: ['print'],
  computed: {
    ...mapState('app', ['hideVApplicationOnPrint']),
  },
  methods: {
    print() {
      this.$refs.printTeleporter.print();
    },
    generateCSVString() {
      const headerRow = this.csvHeaders.map(header => header.title).join(',') + '\\n';
      const dataRows = this.csvItems.map(item => {
        return item.join(',');
      }).join('\\n');
      return headerRow + dataRows;
    },
    generateCSV() {
      if (this.csvItems.length) {
        const csvString = this.generateCSVString();
        const blob = new Blob([csvString], { type: 'text/csv' });
        const link = this.$refs.downloadLink;
        link.href = URL.createObjectURL(blob);
        link.click();
        this.$emit('csv-download-complete');
      }
    },
  },
};
<\/script>`;export{n as default};
