const n=`<template>
  <div v-click-outside="{ handler: recordInteraction, closeConditional: getShouldRecordInteraction }">
    <VDialog
      :model-value="isTimeoutWarningShown"
      persistent
      max-width="460"
      transition="v-scale-transition"
    >
      <VCard class="py-3">
        <VCardTitle class="text-h5">
          Still Here?
        </VCardTitle>
        <VCardText>You have been idle for {{ displayedIdleTime }}.</VCardText>
        <VCardText v-show="!!remainingSeconds">
          You will be redirected to the login page in
          <VChip
            size="small"
            color="error"
            variant="flat"
          >
            {{ remainingSeconds }}
          </VChip>
          {{ remainingSeconds === 1 ? "second" : "seconds" }}.
        </VCardText>
        <VCardActions class="px-4">
          <VBtnSecondary
            :disabled="areButtonsDisabled"
            :loading="isLoggingOut"
            @click="logUserOut()"
          >
            Logout now
          </VBtnSecondary>
          <VSpacer />
          <VBtnPrimary
            :disabled="areButtonsDisabled"
            :loading="isRefreshingSession"
            @click="refreshSession()"
          >
            Stay Logged In
          </VBtnPrimary>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDuration } from 'date-fns';

export default {
  inject: ['sessionTimeoutService'],
  data() {
    return {
      isLoggingOut: false,
      isRefreshingSession: false,
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/getIsAuthenticated',
      isTimeoutWarningShown: 'app/getIsTimeoutWarningShown',
    }),
    remainingSeconds() {
      const timeToExpiration = this.sessionTimeoutService.sessionState.timeToExpiration || 0;
      return Math.max(0, Math.round(timeToExpiration / 1000));
    },
    sessionStatus() {
      return this.sessionTimeoutService.sessionState.sessionStatus;
    },
    displayedIdleTime() {
      return formatDuration({ minutes: this.sessionTimeoutService.sessionState.idleThresholdMinutes });
    },
    areButtonsDisabled() {
      return this.isLoggingOut || this.isRefreshingSession;
    }
  },
  watch: {
    isAuthenticated: {
      handler(isAuthenticated, wasAuthenticated) {
        if (isAuthenticated) {
          this.sessionTimeoutService.startSession();
        } else if (wasAuthenticated) {
          this.sessionTimeoutService.endSession();
          if (this.$route.name !== 'login') {
            this.$router.push({ name: 'login' });
          }
        }
      },
      immediate: true
    },
    sessionStatus(status) {
      if (status === 'expired') {
        this.logUserOut();
      } else if (status === 'idle') {
        this.$store.commit('app/setIsTimeoutWarningShown', true);
      } else {
        this.$store.commit('app/setIsTimeoutWarningShown', false);
      }
    }
  },
  beforeUnmount() {
    this.sessionTimeoutService.endSession();
  },
  methods: {
    recordInteraction() {
      this.sessionTimeoutService.recordInteraction();
    },
    logUserOut() {
      if (this.isLoggingOut) {
        return;
      }
      this.isLoggingOut = true;
      this.$store.dispatch('user/logout').finally(() => {
        this.$store.commit('user/resetUser');
        this.isLoggingOut = false;
      });
    },
    refreshSession() {
      if (this.isRefreshingSession) {
        return;
      }
      this.isRefreshingSession = true;
      this.recordInteraction();
      this.$store.dispatch('user/loadUser').finally(() => {
        this.isRefreshingSession = false;
      });
    },
    getShouldRecordInteraction() {
      return this.isAuthenticated && !this.isTimeoutWarningShown;
    }
  },
};
<\/script>

<style lang="scss" scoped>
[role="dialog"] {
  z-index: 2147483647 !important;
}
</style>
`;export{n as default};
