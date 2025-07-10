const n=`<template>
  <div
    class="d-flex align-center"
  >
    <InfoTag
      v-if="totalItems"
      :label="totalItems"
      label-size="12px"
      size="20px"
      class="mr-2 elevation-4"
    />
    <a
      class="ml-1 mr-4 text-info font-weight-medium text-decoration-none"
      target="_blank"
      :href="trackingLink"
    >
      {{ trackingNumber }}
    </a>
    <span
      class="ml-4 text-caption-2"
    >{{ date }}</span>
  </div>
</template>

<script>
import {format, parseISO} from 'date-fns';
import InfoTag from '@/components/base/InfoTag.vue';

export default {
  components: {
    InfoTag
  },
  props: {
    trackingNumber: {
      type: String,
      default: '',
    },
    totalItems: {
      type: Number,
      required: false,
      default: undefined,
    },
    stage: {
      type: String,
      default: null
    },
    timestamp: {
      type: String,
      default: null,
    },
  },
  computed: {
    trackingLink() {
      return \`https://www.ups.com/track?track=yes&trackNums=\${this.trackingNumber}&loc=en_US&requester=ST/\`;
    },
    date() {
      if (!this.timestamp) {
        return;
      }
      const dateObj = parseISO(this.timestamp);
      return format(dateObj, 'MM/dd/yyyy h:mm a').toUpperCase();
    }
  },
};
<\/script>
`;export{n as default};
