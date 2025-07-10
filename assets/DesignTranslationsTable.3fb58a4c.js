const n=`<template>
  <div>
    <div class="d-flex justify-end">
      <VBtn
        light
        color="primary"
        @click="showDialog = true"
      >
        Add Translation
      </VBtn>
    </div>
    <VTable>
      <template #default>
        <thead>
          <tr>
            <th style="width: calc(100% / 6)">
              Locale
            </th>
            <th style="width: calc(100% * 4 / 6)">
              Design Name
            </th>
            <th style="width: calc(100% / 6)%; text-align: right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="dn in design.names"
            :key="dn.locale"
          >
            <td>{{ dn.locale }}</td>
            <td>{{ dn.name }}</td>
            <td class="text-right">
              <VBtn
                v-if="dn.id === undefined && dn.locale !== 'en'"
                icon
                @click="deleteTranslation(dn)"
              >
                <VIcon>$vuetify.icons.trash</VIcon>
              </VBtn>
            </td>
          </tr>
        </tbody>
      </template>
    </VTable>

    <VDialog v-model="showDialog">
      <VCard
        color="surface-light"
        class="mt-4"
      >
        <VCardTitle>Add a Translation</VCardTitle>
        <VCardText>
          <VForm
            ref="form"
            v-model="validForm"
          >
            <VCard
              flat
              color="surface"
            >
              <VContainer>
                <VRow class="align-center">
                  <VCol
                    cols="12"
                    sm="4"
                  >
                    <VSelect
                      v-model="newTranslation.locale"
                      label="Locale"
                      :items="availableLocales"
                      :rules="[required]"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    sm="8"
                  >
                    <VTextField
                      v-model="newTranslation.name"
                      label="Design Name"
                      :rules="[required]"
                      @keydown.enter="addTranslation"
                    />
                  </VCol>
                </VRow>
              </VContainer>
            </VCard>
          </VForm>
        </VCardText>
        <VCardActions class="px-4 pt-0 pb-4">
          <VBtnSecondary @click="showDialog = false">
            Cancel
          </VBtnSecondary>
          <VSpacer />
          <VBtnPrimary
            :disabled="!validForm"
            @click="addTranslation"
          >
            Add
          </VBtnPrimary>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
export default {
  props: {
    design: {
      type: Object,
      default: () => ({})
    },
  },
  emits: ['delete-translation', 'add-translation'],
  data: () => ({
    newTranslation: {
      locale: '',
      name: '',
    },
    validForm: undefined,
    showDialog: false,
  }),
  computed: {
    availableLocales() {
      return ['en', 'en_CA', 'en_US', 'es', 'fr', 'fr_CA'].filter(locale => !this.design.names.map(_ => _.locale).includes(locale));
    },
  },
  methods: {
    required(value) {
      return !!value || '*Required';
    },
    async addTranslation(e) {
      e.target.blur();
      await this.$refs.form.validate();

      if (!this.validForm) {
        return;
      }

      this.showDialog = false;
      this.$emit('add-translation', { newTranslation: this.newTranslation, designId: this.design.id});

      this.$refs.form.reset();
    },
    deleteTranslation(item) {
      this.$emit('delete-translation', item);
    }
  }
};
<\/script>`;export{n as default};
