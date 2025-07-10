const n=`<template>
  <VCard class="complete-service-form">
    <template #title>
      <VCardTitle>
        Complete Service
      </VCardTitle>
    </template>
    <template #default>
      <VCardText>
        <VForm ref="form">
          <VTextField
            v-model="formData.ktUsername"
            label="MKAT Name"
            variant="outlined"
            class="mb-2"
          />
          <VTextarea
            v-model="formData.notes"
            label="Notes"
            variant="outlined"
            hide-details
          />
          <div class="d-flex justify-end">
            <VCheckbox
              v-model="formData.success"
              label="Mark as successful"
              hide-details
            />
          </div>
        </VForm>
      </VCardText>
    </template>
    <template #actions>
      <div class="complete-service-form__actions">
        <VBtnSecondary
          :disabled="loading"
          @click="cancel()"
        >
          Cancel
        </VBtnSecondary>
        <VBtnPrimary
          :loading="loading"
          @click="submit()"
        >
          Submit
        </VBtnPrimary>
      </div>
    </template>
  </VCard>
</template>
<script>
import { mapState } from 'vuex';
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['cancel', 'submit'],
  data: () => ({
    formData: {
      ktUsername: '',
      notes: '',
      success: false,
    },
  }),
  computed: {
    ...mapState('user', ['user']),
  },
  mounted() {
    this.formData.ktUsername = this?.user?.username;
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    submit() {
      this.$emit('submit', JSON.parse(JSON.stringify(this.formData)));
    },
  }
};
<\/script>
<style lang="scss" scoped>
.complete-service-form {
  min-width: 400px;

  &__actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
`;export{n as default};
