const n=`<template>
  <VDialog
    v-model="dialog"
    scrollable
    max-width="400px"
  >
    <template #activator="{ props }">
      <VBtn
        variant="text"
        :color="color"
        class="ml-2"
        v-bind="props"
      >
        <VIcon
          size="small"
          start
        >
          $vuetify.icons.exchange
        </VIcon>
        <span v-if="$vuetify.display.smAndUp">Select Kiosk</span>
      </VBtn>
    </template>

    <VCard>
      <VCardTitle>Select Kiosk</VCardTitle>
      <VTabs
        v-model="tab"
        color="primary"
        class="text-primary-darken-3"
        show-arrows
      >
        <VTab key="mine">
          My Kiosk
        </VTab>
        <VTab key="other">
          Other Kiosks
        </VTab>
      </VTabs>
      <VDivider />

      <VCardText
        style="height: 300px;"
        class="mb-3"
      >
        <VWindow v-model="tab">
          <VWindowItem>
            <VRadioGroup
              v-if="hasKiosk"
              v-model="selectedKiosk"
              :inline="false"
            >
              <VRadioSmall
                v-for="kiosk in filteredUserKiosks"
                :key="kiosk.id"
                :label="kiosk.serialNumber"
                :value="kiosk"
              />
            </VRadioGroup>
            <div v-else>
              <VAlert
                type="error"
                icon="$vuetify.icons.exclamationTriangle"
                variant="outlined"
                border="start"
                align="center"
              >
                You don't have any assigned kiosks
              </VAlert>
            </div>
          </VWindowItem>
          <VWindowItem>
            <VForm
              ref="form"
              v-model="valid"
              @submit.prevent
            >
              <VRow>
                <VCol>
                  <VTextField
                    v-model="kioskId"
                    label="Kiosk Serial Number"
                    :rules="[v => !!v.toString() || 'Required']"
                    @keypress.enter="getKioskById"
                  />
                </VCol>
              </VRow>
              <VRow>
                <VCol align="center">
                  <VBtn
                    color="primary"
                    @click="getKioskById"
                  >
                    find
                  </VBtn>
                </VCol>
              </VRow>
              <VRow>
                <VCol>
                  <VAlert
                    v-if="notFound"
                    type="warning"
                    icon="$vuetify.icons.exclamationTriangle"
                    variant="outlined"
                    border="start"
                    align="center"
                  >
                    {{ message }}
                  </VAlert>
                </VCol>
              </VRow>
            </VForm>
          </VWindowItem>
        </VWindow>
      </VCardText>

      <!-- <v-card-text v-else>
        You have no kiosks assigned
      </v-card-text>-->
      <VDivider />
      <VCardActions class="align-self-center">
        <VBtnSecondary @click="dialog = false">
          Cancel
        </VBtnSecondary>
        <!-- <v-alert
          type="warning"
          v-if="false"
          icon="$vuetify.icons.exclamationTriangle"
          variant="outlined"
          border="start"
          align="center"
        >
          Please select a kiosk to continue
        </v-alert>-->
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    tagMachinesOnly: {
      type: Boolean,
      default: false
    },
    disableAutoOpen: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      selectedKiosk: '',
      dialog: false,
      tab: null,
      kioskId: '',
      valid: false,
      notFound: false,
      validMachineTypes: ['PX','ID','FS','FJ','TX','KX','QZ','PS'],
      warningMessages:{
        notFound: 'Kiosk not found, review the serial number and try again.',
        notAllowed: 'Kiosk type not allowed'
      },
      message:''
    };
  },
  computed: {
    ...mapState('kiosk', ['userKiosks', 'loading']),
    color() {
      return !this.disableAutoOpen && Object.keys(this.selectedKiosk).length === 0
        ? 'error'
        : 'primary-lighten-2';
    },
    filteredUserKiosks() {
      let userKiosk = !this.tagMachinesOnly ? this.userKiosks : this.userKiosks.filter(kiosk => {
        return (
          this.validMachineTypes.indexOf(kiosk.machineType) > -1
        );
      });

      userKiosk.sort(function(a, b) {
        var nameA = a.serialNumber.toUpperCase();
        var nameB = b.serialNumber.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      return userKiosk;
    },
    hasKiosk() {
      return this.filteredUserKiosks.length > 0;
    }
  },
  watch: {
    selectedKiosk: function(selectedKiosk) {
      this.setSelectedKiosk(selectedKiosk);

      this.dialog = false;

      const oldKiosk = this.$route.params.kiosk;
      const currentPath = this.$route.path;
      const basePath = oldKiosk
        ? currentPath.replace(/\\/[^/]*$/, '')
        : currentPath;
      const newPath = basePath + '/' + selectedKiosk.serialNumber;

      if (newPath != currentPath) {
        this.$router.push({ path: newPath });
      }
    },
    $route(to) {
      const serialNumber = to.params.kiosk;

      if(serialNumber != this.selectedKiosk.serialNumber) {
        this.loadKiosk(serialNumber);
      }
    },
    dialog: function() {
      if (this.dialog == false) {
        this.valid = true;
        this.tab = 0;
        this.kioskId = '';
        this.notFound = false;
      }
    }
  },
  beforeMount() {
    const serialNumber = this.$route.params.kiosk;

    if (serialNumber) {
      this.loadKiosk(serialNumber);
    }
  },
  mounted() {
    const hasKioskInUrl = !!this.$route.params.kiosk;
    if (!hasKioskInUrl && !this.disableAutoOpen) {
      this.dialog = true;
    }
  },
  methods: {
    ...mapActions('kiosk', ['setCurrentSelectedKioskCC']),
    setSelectedKiosk(kiosk) {
      this.setCurrentSelectedKioskCC(kiosk);
    },
    async loadKiosk(serialNumber) {
      const userKiosks = await this.userKiosksPromise();
      let kiosk = userKiosks.find(k => k.serialNumber == serialNumber);

      if (kiosk) {
        this.selectedKiosk = kiosk;
      } else {
        let response;

        try {
          response = await this.fetchKiosk(serialNumber);

          if (response) {
            this.selectedKiosk = response.data;
          }
        } catch (err) {
          this.dialog = true;
          this.message = this.warningMessages.notFound;
          this.notFound = true;
          this.tab = 1;
          this.kioskId = this.$route.params.kiosk;
        }
      }
    },
    async fetchKiosk(serialNumber) {
      const response = await this.$store.dispatch('kiosk/loadOtherKiosk', {
        serialNumber
      });

      return response;
    },
    userKiosksPromise() {
      if (this.userKiosks.length > 0) {
        return Promise.resolve(this.userKiosks);
      } else {
        return new Promise(resolve => {
          const watcher = this.$watch('userKiosks', newVal => {
            resolve(newVal);
            watcher();
          });
        });
      }
    },
    async getKioskById() {
      const form = await this.$refs.form.validate();
      if (this.valid && form.valid) {
        let response;

        try {
          response = await this.fetchKiosk(this.kioskId);
        } catch (err) {
          this.message = this.warningMessages.notFound;
          this.notFound = true;
        }

        if (response) {
          if (!this.tagMachinesOnly || this.validMachineTypes.indexOf(response.data.machineType) > -1 ) {
            this.selectedKiosk = response.data;
            this.valid = true;
            this.tab = 0;
            this.kioskId = '';
          } else {
            this.notFound = true;
            this.message = this.warningMessages.notAllowed;
          }
        }
      }
    }
  },
};
<\/script>
`;export{n as default};
