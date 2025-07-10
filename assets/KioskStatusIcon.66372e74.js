const n=`<template>
  <VTooltip
    class="kiosk-status-icon"
    location="top left"
    :disabled="!status.tooltip"
  >
    <template #activator="{ props }">
      <div
        v-bind="props"
        class="d-flex align-center"
      >
        <VIcon
          size="32"
          :icon="status.icon"
          :color="status.color"
          class="kiosk-status-icon__icon mr-3"
        />
        <span
          class="kiosk-status-icon__label font-weight-bold"
          :class="\`text-\${status.color}\`"
        >
          {{ status.label }}
          <span class="hidden-screen-only">{{ status.tooltip }}</span>
        </span>
      </div>
    </template>
    <span>{{ status.tooltip }}</span>
  </VTooltip>
</template>

<script>
import { diffInDays } from '@/utils/diffInDays';

export default {
  props: {
    kiosk: {
      type: Object,
      required: true,
    },
    statusType: {
      type: String,
      required: true,
      validator: (value) => ['machineHealth', 'connection', 'service'].includes(value),
    },
  },
  data() {
    return {
      colorMap: {
        machineHealth: {
          default: 'primary-lighten-3',
          OutOfOrder: 'error',
          OK: 'success',
        },
        service: {
          default: 'primary-lighten-3',
          lastServiceSuccess: 'success',
          lastServiceWarning: 'warning',
          lastServiceError: 'error',
        },
        connection: {
          default: 'primary-lighten-3',
          Online: 'success',
          Offline: 'error',
          NeverConnected: 'warning',
        },
      },
      iconMap: {
        machineHealth: {
          default: '$heartCircleExclamation',
          OutOfOrder: '$heartCrack',
          OK: '$heartCircleCheck',
        },
        service: {
          default: '$calendarWrenchSolid',
          lastServiceSuccess: '$calendarWrenchSolid',
          lastServiceWarning: '$calendarWrenchSolid',
          lastServiceError: '$calendarCircleExclamation',
        },
        connection: {
          default: '$wifiSlash',
          Online: '$wifi',
          Offline: '$wifiSlash',
          NeverConnected: '$wifiExclamation',
        },
      },
      tooltipMap: {
        machineHealth: {
          default: 'NA',
          OutOfOrder: 'Out of order',
          OK: 'Healthy',
        },
        service: {
          default: '',
          lastServiceSuccess: '',
          lastServiceWarning: '',
          lastServiceError: '',
        },
        connection: {
          default: '',
          Online: '',
          Offline: '',
          NeverConnected: 'Never Connected',
        },
      },
    };
  },
  computed: {
    labelMap() {
      return {
        machineHealth: {
          default: '',
          OutOfOrder: '',
          OK: '',
        },
        service: {
          default: 'NA',
          lastServiceSuccess: this.kiosk.lastService + ' d',
          lastServiceWarning: this.kiosk.lastService + ' d',
          lastServiceError: this.kiosk.lastService + ' d',
        },
        connection: {
          default: 'NA',
          Online: diffInDays(this.kiosk.lastConnectedTimestamp) + ' d',
          Offline: diffInDays(this.kiosk.lastConnectedTimestamp) + ' d',
          NeverConnected: '',
        },
      };
    },

    status() {
      let type = this.statusType;
      let statusObj = {
        color: this.colorMap[type].default,
        icon: this.iconMap[type].default,
        label: this.labelMap[type].default,
        tooltip: this.tooltipMap[type].default,
      };
      if (type === 'machineHealth' && this.kiosk.machineHealth) {
        statusObj.color = this.colorMap[type][this.kiosk.machineHealth];
        statusObj.icon = this.iconMap[type][this.kiosk.machineHealth];
        statusObj.label = this.labelMap[type][this.kiosk.machineHealth];
        statusObj.tooltip = this.tooltipMap[type][this.kiosk.machineHealth];
      } else if (type === 'service' && this.serviceMapKey) {
        statusObj.color = this.colorMap[type][this.serviceMapKey];
        statusObj.icon = this.iconMap[type][this.serviceMapKey];
        statusObj.label = this.labelMap[type][this.serviceMapKey];
        statusObj.tooltip = this.tooltipMap[type][this.serviceMapKey];
      } else if (type === 'connection' && this.kiosk.connectionStatus) {
        statusObj.color = this.colorMap[type][this.kiosk.connectionStatus];
        statusObj.icon = this.iconMap[type][this.kiosk.connectionStatus];
        statusObj.label = this.labelMap[type][this.kiosk.connectionStatus];
        statusObj.tooltip = this.tooltipMap[type][this.kiosk.connectionStatus];
      }
      return statusObj;
    },

    serviceMapKey() {
      let key = 'default';
      if (this.kiosk.lastService >= 0 && this.kiosk.lastService <= 60) {
        key = 'lastServiceSuccess';
      } else if (this.kiosk.lastService > 60 && this.kiosk.lastService < 100) {
        key = 'lastServiceWarning';
      } else if (this.kiosk.lastService >= 100) {
        key = 'lastServiceError';
      }
      return key;
    },
  },
};
<\/script>`;export{n as default};
