const n=`<template>
  <VTooltip
    location="start"
  >
    <template #activator="{ props }">
      <div>
        <VAvatar
          v-if="userName"
          v-bind="props"
          color="primary"
          size="32"
          class="user-avatar"
        >
          <span>{{ formatInitials }}</span>
        </VAvatar>
        <VAvatar
          v-else
          v-bind="props"
          size="32"
        >
          <VIcon
            class="icon-duotone-circle-user"
            size="32"
          >
            $circleUser
          </VIcon>
        </VAvatar>
      </div>
    </template>
    <div v-if="userName">
      <p>
        Assigned To: <span class="text-uppercase">{{ userName }}</span>
      </p>
      <div v-if="notes">
        <p>Notes:</p>
        <p>{{ notes }}</p>
      </div>
    </div>
    <p v-else>
      Assign to me
    </p>
  </VTooltip>
</template>

<script>
export default {
  props: {
    userName: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  computed: {
    formatInitials() {
      return this.userName.slice(0, 2).toUpperCase();
    }
  },
};
<\/script>

<style scoped lang="scss">

.user-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  &.none {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: black;
      transform: rotate(-45deg);
    }
  }
}

</style>`;export{n as default};
