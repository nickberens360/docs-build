const n=`<template>
  <VForm
    v-model="isValid"
    class="assign-order"
  >
    <VCheckbox
      v-model="selected"
      :label="checkbox?.label"
      :value="checkbox?.value"
      color="primary"
      hide-details
      :rules="required"
    />
    <VTextarea
      v-model="notes"
      label="Notes"
      placeholder="Optional"
    />
    <div class="text-right">
      <VBtnSecondary
        class="mr-4"
        @click="$emit('assign-complete')"
      >
        Cancel
      </VBtnSecondary>
      <VBtnPrimary
        id="menu-activator"
        :disabled="!isValid"
        @click="assignUser"
      >
        Submit
      </VBtnPrimary>
    </div>
  </VForm>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    sessionId: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['order-assigned', 'assign-complete'],
  data() {
    return {
      expanded: false,
      selected: undefined,
      notes: undefined,
      isValid: false,
      required: [(v) => !!v || 'Required'],
    };
  },
  computed: {
    ...mapGetters('user', ['user']),
    loggedInUsername() {
      return this.user.username;
    },
    assignedToMe() {
      return this.assignedTo === this.loggedInUsername;
    },
    checkbox() {
      return {
        label: this.assignedToMe ? 'Unassign from me' : 'Assign to me',
        value: this.assignedToMe ? 'unassign' : this.loggedInUsername,
      };
    }
  },
  methods: {
    ...mapActions('order', ['submitAssignUser']),
    ...mapActions('orders', ['fetchAllOrders']),
    async assignUser() {
      try {
        let assignee = null;
        if (this.selected !== 'unassign') {
          assignee = this.selected;
        }
        await this.submitAssignUser({
          assignee: assignee,
          sessionId: this.sessionId,
          notes: this.notes,
        });
        await this.fetchAllOrders();
        this.$emit('order-assigned', true);
        if (this.selected === 'unassign') {
          this.message = 'Order unassigned successfully';
        } else {
          this.message = 'Order assigned successfully to you';
        }
        setTimeout(() => {
          this.$emit('assign-complete');
        }, 1000);
        this.$store.dispatch('app/setSnackbar', {
          message: this.message,
        });
        this.selected = undefined;
      } catch (error) {
        this.$emit('order-assigned', false);
        this.$store.dispatch('app/setSnackbar', {
          message: error.message,
          color: 'error',
        });
        this.selected = undefined;
      }
    },
  },
};
<\/script>

`;export{n as default};
