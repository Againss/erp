<template >
  <div class="process-upload-card">
    <div class="left-box">
      <upload :options="config" ref="upload" />
    </div>
    <div class="right-box">
      <DownloadButton :options="downConfig" />
    </div>
  </div>
</template>

<script>
import DownloadButton from "./download-button.vue";
import upload from "@/components/cs-custom-form/upload-item";
import trigger from "./trigger.vue";
export default {
  components: {
    DownloadButton,
    upload,
  },
  props: {
    options: {
      type: Object,
    },
  },
  data() {
    const configbase = {
      content: [
        {
          component: trigger,
          slot: "trigger",
        },
      ],
    };
    return {
      configbase,
    };
  },
  computed: {
    config() {
      return { ...this.options.content._upload, ...this.configbase };
    },
    downConfig() {
      return this.options.content._down;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.process-upload-card {
  > div {
    display: inline-block;
  }
  .left-box{float: left;margin-right: 30px;}
  // display: flex;
  // justify-content: space-around;
  .left-box {
    .upload-demo {
      margin: 0;
    }
  }
  /deep/.el-upload-list.el-upload-list--text {
    // display: inline-block;
    width: 300px;
  }
  /deep/.el-upload-list .el-upload-list__item-name {
    white-space: normal;
  }
}
</style>