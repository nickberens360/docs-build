const n=`<template>
  <div class="container">
    <div :class="setClass('S')" />
    <div :class="setClass('M')" />
    <div :class="setClass('L')" />
  </div>
</template>
<script>
export default {
  props:{
    selectedSize: {
      type: String,
      default: ''
    }
  },
  methods:{
    setClass(val){
      if(this.selectedSize === val){
        return 'selected';
      }
    }
  }
};
<\/script>

<style scoped lang="scss">
.container {
  display: inline-flex;
  align-items: center;
  height: 35px;
  line-height: 35px;
  vertical-align: middle;
  & > div {
    border-radius: 20px;
    border: 1px solid gray;

    &:not(:last-child) {
      margin-right: 10px;
    }

    &:nth-child(1) {
      height: 10px;
      width: 10px;

    }
    &:nth-child(2) {
      height: 20px;
      width: 20px;
    }
    &:nth-child(3) {
      height: 30px;
      width: 30px;
    }

     &.selected{
        background-color: gray;
      }
  }
}
</style>`;export{n as default};
