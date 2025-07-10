const e=`<template>
  <div>
    <div
      v-for="item in itemsReversed"
      :key="item.identifier"
    >
      <VTimeline
        align="start"
        density="compact"
        class="pt-0"
      >
        <VTimelineItem
          :dot-color="item.status === 'success' ? 'success' : 'error'"
          size="small"
        >
          <div class="mb-2  d-flex justify-space-between align-end">
            <span class="font-weight-bold on-surface-high-contrast-text text-h4">{{ item.type }}: <span class="ml-2"> {{ formatDate(item.timestamp) }}</span></span>
            <span class="font-weight-medium text-caption text-primary-darken-2 mr-4"><span> {{ formatTime(item.timestamp) }}</span></span>
          </div>
          <VCard>
            <VCardText>
              <div
                v-for="(value, name, index) in item"
                :key="index"
                class="mb-4 text-body-4"
              >
                <div
                  v-if="name !== 'type' && name !== 'timestamp'"
                >
                  <h3 class="text-capitalize font-weight-medium mb-1">
                    {{ name }}
                  </h3>
                  <p
                    v-if="name === 'amount'"
                  >
                    {{ $filters.currency(value) }}
                  </p>
                  <div v-else-if="name === 'items'">
                    <ul class="list-reset">
                      <li
                        v-for="listItem in value"
                        :key="listItem.id"
                      >
                        <div
                          v-for="(activityValue, activityName, i) in listItem"
                          :key="i"
                          class="text-capitalize"
                        >
                          <span v-if="activityName === 'amount'">{{ activityName }}: {{ $filters.currency(activityValue) }}</span>
                          <span v-else>{{ activityName }}: {{ activityValue }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <p
                    v-else
                    class="mb-2 text-break"
                  >
                    {{ value }}
                  </p>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VTimelineItem>
      </VTimeline>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { parseISO, format } from 'date-fns';

export default {
  computed: {
    ...mapGetters('order', ['orderDetails']),
    itemsReversed() {
      let items = this?.orderDetails?.activity || [];
      return [...items].reverse();
    },
  },
  methods: {
    formatDate(date) {
      return format(parseISO(date), 'EE MM/dd/yyyy');
    },
    formatTime(date) {
      return format(parseISO(date), 'h:mm a');
    },
  },
};
<\/script>

<style scoped lang="scss">
ul {
  li {
    margin-bottom: 4px;
  }
}
:deep(.v-timeline-item__inner-dot).decline {
  background: rgb(var(--v-theme-error)) !important;
}
:deep(.v-timeline--vertical.v-timeline.v-timeline--side-end .v-timeline-item .v-timeline-item__body) {
  width: 100%;
}
</style>
`;export{e as default};
