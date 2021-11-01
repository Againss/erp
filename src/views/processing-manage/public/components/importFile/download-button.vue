<template>
  <div id="process-download" @click="down">
    <div>
      <img src="@/assets/images/process-down.png" alt="" />
    </div>
    <div>下载模板</div>
  </div>
</template>

<script>
export default {
  name: "process-download",
  props: {
    options: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    down() {
      this.options && this.options.downCallBack && this.options.downCallBack();
    },
  },
};
</script>

<style scoped lang="scss">
#process-download {
  cursor: pointer;
  text-align: center;
  width: 300px;
  height: 146px;
  border: 1px dashed #c5d6f6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  img {
    width: 44px;
    height: 44px;
    display: inline-block;
  }
}
</style>