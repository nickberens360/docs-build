const n=`<template>
  <div class="pl-2 overflow-x-hidden text-left font-weight-regular bg-surface">
    <div class="text-center">
      <div class="location-name">
        {{ kiosks[0].locationName }}
      </div>

      <div class="mb-2">
        <div class="text-caption my-1">
          {{ \`\${kiosks.length} Kiosk\${kiosks.length > 1 ? 's' : ''}\` }} at this Location
        </div>
        <div
          v-if="kiosks.length > 1"
          style="display: flex; justify-content: center; border: 2px solid rgb(var(--v-theme-primary))"
        >
          <VBtn
            v-for="(kiosk, i) in kiosks"
            :key="kiosk.kioskId"
            rounded="0"
            size="small"
            variant="flat"
            class="px-0 mx-0"
            style="flex: 1"
            :color="selectedKiosk.kioskId === kiosk.kioskId ? 'primary-lighten-4' : 'surface'"
            @click="selectedKiosk = kiosks[i]"
          >
            <span>{{ kiosk.serialNumber }}</span>
            <svg
              :style="\`fill: \${(kiosk.healthStatus.value > kiosk.serviceStatus.value) ? kiosk.healthStatus.color : kiosk.serviceStatus.color}; \${(kiosk.healthStatus.value || kiosk.serviceStatus.value) ? '' : 'display: none;'}\`"
              class="tab-indicator"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            ><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" /></svg>
          </VBtn>
        </div>
      </div>
    </div>

    <VDivider class="my-2" />

    <div v-if="selectedKiosk">
      <div class="info-container">
        <div style="flex: 2">
          <VImg
            v-if="kioskImageSrc"
            :src="kioskImageSrc"
            height="64"
            width="64"
          />
        </div>
        <div
          class="text-left"
          style="flex: 3;"
        >
          <div class="mb-1 font-weight-bold">
            {{ selectedKiosk.serialNumber }}
          </div>

          <div class="quick-info">
            <svg
              class="xs mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            ><path d="M32,224H64V416H32A31.96166,31.96166,0,0,1,0,384V256A31.96166,31.96166,0,0,1,32,224Zm512-48V448a64.06328,64.06328,0,0,1-64,64H160a64.06328,64.06328,0,0,1-64-64V176a79.974,79.974,0,0,1,80-80H288V32a32,32,0,0,1,64,0V96H464A79.974,79.974,0,0,1,544,176ZM264,256a40,40,0,1,0-40,40A39.997,39.997,0,0,0,264,256Zm-8,128H192v32h64Zm96,0H288v32h64ZM456,256a40,40,0,1,0-40,40A39.997,39.997,0,0,0,456,256Zm-8,128H384v32h64ZM640,256V384a31.96166,31.96166,0,0,1-32,32H576V224h32A31.96166,31.96166,0,0,1,640,256Z" /></svg>
            <div>{{ selectedKiosk.machineTypeDesc }}</div>
          </div>

          <div class="quick-info">
            <div>
              <svg
                class="xs mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 288 512"
              ><path d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z" /></svg>
            </div>
            <div>{{ dePascalCase(selectedKiosk.site.placement) }}</div>
          </div>
        </div>
      </div>

      <VDivider class="my-2" />

      <div>
        <div
          v-if="selectedKiosk.revenueStatus.value"
          class="data-item"
        >
          <svg
            style="fill: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))"
            class="reg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          ><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm24 376v16c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-16.2c-16.5-.6-32.6-5.8-46.4-15.1-8.7-5.9-10-18.1-2.3-25.2l12-11.3c5.4-5.1 13.3-5.4 19.7-1.6 6.1 3.6 12.9 5.4 19.9 5.4h45c11.3 0 20.5-10.5 20.5-23.4 0-10.6-6.3-19.9-15.2-22.7L205 268c-29-8.8-49.2-37-49.2-68.6 0-39.3 30.6-71.3 68.2-71.4v-16c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16.2c16.5.6 32.6 5.8 46.4 15.1 8.7 5.9 10 18.1 2.3 25.2l-12 11.3c-5.4 5.1-13.3 5.4-19.7 1.6-6.1-3.6-12.9-5.4-19.9-5.4h-45c-11.3 0-20.5 10.5-20.5 23.4 0 10.6 6.3 19.9 15.2 22.7l72 21.9c29 8.8 49.2 37 49.2 68.6.2 39.3-30.4 71.2-68 71.4z" /></svg>

          <VDivider
            vertical
            class="mx-2"
          />

          <div>
            <div class="subheading-2 font-weight-bold">
              High Revenue
            </div>
            <div>{{ $filters.currency(selectedKiosk.avgDailyRevenue) }}/day</div>
          </div>
        </div>

        <div
          v-if="isOutOfOrder"
          class="data-item"
        >
          <svg
            style="fill: rgb(var(--v-theme-error))"
            class="reg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          ><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" /></svg>

          <VDivider
            vertical
            class="mx-2"
          />

          <div>
            <div class="subheading-2 font-weight-bold">
              Out of Order Since
            </div>
            <div>{{ dateTime(selectedKiosk.outOfOrderTime) }}</div>
          </div>
        </div>

        <div
          v-if="selectedKiosk.openTicketCount > 0"
          class="data-item"
        >
          <svg
            style="fill: rgb(var(--v-theme-warning))"
            class="reg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          ><path d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z" /></svg>
          <VDivider
            vertical
            class="mx-2"
          />

          <div>
            <div class="subheading-2 font-weight-bold">
              Open Service Tickets
            </div>
            <div>{{ selectedKiosk.openTicketCount }}</div>
          </div>
        </div>
        <div class="data-item">
          <svg
            :style="\`fill: \${selectedKiosk.serviceStatus.color}\`"
            class="reg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          ><path d="M331.1 360.5c2.3 8.5 11.1 13.6 19.6 11.3l117-31.3c8.5-2.3 13.6-11.1 11.3-19.6L447.6 204c-2.3-8.5-11.1-13.6-19.6-11.3L311 224c-8.5 2.3-13.6 11.1-11.3 19.6l31.4 116.9zM0 479.9c0 17.7 14.3 32 32 32s32-14.3 32-32v-74.5C48 391.7.5 350.8 0 350.3v129.6zm503.4-106.1c-1.1-4.3-5.5-6.8-9.8-5.7l-154.1 41.3c-9.8-12.9-24.2-21.9-40.9-24.5l-59.4-221.6c-1.1-4.3-5.5-6.8-9.8-5.7l-30.9 8.3c-4.3 1.1-6.8 5.5-5.7 9.8l12.9 48.2h-39l-33.3-61.8c-11.1-21.1-32.8-34.2-56.7-34.2H48c-26.5 0-48 21.5-48 48v103c0 18.7 8.2 36.4 22.4 48.6l76 65.1 14.1 92.5c1 5.7 10.1 30.7 36.8 26.3 17.4-2.9 29.2-19.4 26.3-36.8l-14.1-92.5c-2.5-14.8-10.1-28.3-21.5-38.1l-44-37.7V228l32 59.9h94.8l28.9 107.8c-16.4 11.6-27.2 30.6-27.2 52.2 0 35.3 28.7 64 64 64 32.7 0 59.3-24.5 63.2-56.1l154.2-41.3c4.3-1.1 6.8-5.5 5.7-9.8l-8.2-30.9zm-214.8 90.1c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.1 16-16 16zM80 96c26.5 0 48-21.5 48-48S106.6 0 80 0 32 21.5 32 48s21.5 48 48 48z" /></svg>

          <VDivider
            vertical
            class="mx-2"
          />

          <div>
            <div class="subheading-2 font-weight-bold">
              Last Serviced
            </div>
            <div>{{ daysAgo(selectedKiosk.daysSinceLastService) }}</div>
          </div>
        </div>

        <div class="data-item">
          <svg
            v-if="selectedKiosk.connectionStatus.value"
            :style="\`fill: \${selectedKiosk.connectionStatus.color}\`"
            class="reg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          ><path d="M216 288h-48c-8.84 0-16 7.16-16 16v192c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V304c0-8.84-7.16-16-16-16zM88 384H40c-8.84 0-16 7.16-16 16v96c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16v-96c0-8.84-7.16-16-16-16zm256-192h-48c-8.84 0-16 7.16-16 16v288c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V208c0-8.84-7.16-16-16-16zm128-96h-48c-8.84 0-16 7.16-16 16v384c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V112c0-8.84-7.16-16-16-16zM600 0h-48c-8.84 0-16 7.16-16 16v480c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V16c0-8.84-7.16-16-16-16z" /></svg>
          <svg
            v-else
            :style="\`fill: \${selectedKiosk.connectionStatus.color}\`"
            class="reg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          ><path d="M633.82 458.1L616 444.33V16c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v366.5l-48-37.1V112c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v171.57l-48-37.1V208c0-8.84-7.16-16-16-16h-48c-1.82 0-3.5.48-5.13 1.04L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c1.22.95 2.04 2.18 2.9 3.37H600c.73 0 1.35-.32 2.06-.42 5.51.8 11.27-1.05 14.93-5.77l19.64-25.27c5.43-6.96 4.17-17.01-2.81-22.44zM88 384H40c-8.84 0-16 7.16-16 16v96c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16v-96c0-8.84-7.16-16-16-16zm80-96c-8.84 0-16 7.16-16 16v192c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V309.32L204.41 288H168zm112 208c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16v-87.75l-80-61.83V496zm128 0c0 8.84 7.16 16 16 16h48c5.49 0 10.1-2.94 12.98-7.15L408 445.35V496z" /></svg>

          <VDivider
            vertical
            class="mx-2"
          />

          <div>
            <div class="subheading-2 font-weight-bold">
              Last Connected
            </div>
            <div>
              {{ (wasConnectedToday ? "Today" : lastConnectTimeDate.toLocaleDateString()) }} at
              <span style="display: inline-block; white-space: nowrap;">{{ lastConnectTimeDate.toLocaleTimeString([], { timeStyle: 'short' }) }}</span>
            </div>
          </div>
        </div>

        <VDivider />
      </div>
    </div>

    <VBtn
      v-if="selectedKiosk"
      width="100%"
      class="mt-2"
      size="small"
      :color="isIncludedInRoute ? 'info' : 'primary-darken-2'"
      @click="$emit('toggle-selection', selectedKiosk.site.location.id)"
    >
      {{ isIncludedInRoute ? "Remove from" : "Add to" }} Route
    </VBtn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'KioskInfoWindow',
  props: {
    kiosks: {
      type: Array,
      required: true
    },
    isIncludedInRoute: {
      type: Boolean,
      default: false
    },
  },
  emits: ['toggle-selection'],
  data: () => ({
    selectedKiosk: null,
  }),
  computed: {
    ...mapGetters('kiosk', ['getMachineTypeChute']),
    wasConnectedToday() {
      const today = new Date();

      return today.getDate() === this.lastConnectTimeDate.getDate() &&
                   today.getMonth() === this.lastConnectTimeDate.getMonth() &&
                   today.getYear() === this.lastConnectTimeDate.getYear();
    },
    lastConnectTimeDate() {
      return new Date(this.selectedKiosk.lastConnectTime);
    },
    isOutOfOrder() {
      return !!this.selectedKiosk.outOfOrderTime;
    },
    kioskImageSrc() {
      return this.getMachineTypeChute.find(mt => mt.type === this.selectedKiosk.machineType)?.imagePath;
    }
  },
  created() {
    this.selectedKiosk = this.kiosks[0];
  },
  methods: {
    dateTime(dateString) {
      const date = new Date(dateString);

      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { timeStyle: 'short' });
    },
    daysAgo(daysAgo) {
      return daysAgo === 0 ? 'Today' : \`\${daysAgo} day\${daysAgo > 1 ? 's' : ''} ago\`;
    },
    dePascalCase(pascalString) {
      return pascalString.replace(/(\\B[A-Z])/g, ' $1');
    },
  },
};
<\/script>

<style scoped lang="scss">
    .tab-indicator {
        position: absolute;
        right: 6px;
        height: 16px;
        width: 16px;
    }

    .quick-info {
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
        padding: 4px 0
    }

    .info-container {
        display: flex;
        align-items: center;
        text-align: left;
    }

    .data-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 6px;
    }

    .reg {
        height: 24px;
        width: 24px;
    }

    .xs {
        position: relative;
        top: 1px;
        fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
        height: 12px;
        width: 16px;
        margin-right: 4px;
    }

    .location-name {
        font-size: 12pt;
        font-weight: bold;
    }

</style>
`;export{n as default};
