<template>
  <div id="importFile">
    <el-button size="small" type="primary" @click="handle">导入</el-button>
    <cs-custom-pop :options="options" v-if="options.visible" ref="pop" />
  </div>
</template>

<script>
import card from "./upload-card.vue";
export default {
  props: {
    config: {
      type: Object,
    },
    visible: {
      type: Boolean,
    },
  },
  data() {
    const options = {
      top: "10%",
      customClass: "import-file-dialog",
      appendToBody: true,
      itemType: "dialog",
      visible: false,
      title: "进度导入",
      width: "730px",
      okHidden:true,
      cancelHidden:true,
      // cancelText:'关闭',
      // cancelHidden:true,
      // ok: (params) => {
      //   params.$refs.upload.submit();
      // },
      cancel: (params) => {
        this.options.visible = false;
      },
      close: (params) => {
        this.options.visible = false;
      },
      // showFooter: true,
      component: card,
    };
    return {
      options,
    };
  },
  watch: {
    visible(val) {
      this.options.visible = val;
    },
    options: {
      handler(val) {
        this.options = this.deepObjectMerge(this.options, this.config);
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  methods: {
    handle() {
      // 覆盖合并基本配置
      this.options = this.deepObjectMerge(this.options, this.config);
      this.options.visible = true;
    },
    deepObjectMerge(FirstOBJ, SecondOBJ) {
      for (var key in SecondOBJ) {
        FirstOBJ[key] =
          FirstOBJ[key] &&
          FirstOBJ[key].toString() === "[object Object]" &&
          SecondOBJ[key] &&
          SecondOBJ[key].toString() === "[object Object]"
            ? this.deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
            : (FirstOBJ[key] = SecondOBJ[key]);
        if (!FirstOBJ[key]) {
          FirstOBJ[key] =
            SecondOBJ[key] && SecondOBJ[key].toString() === "[object Object]"
              ? this.deepObjectMerge(FirstOBJ[key] === null, SecondOBJ[key])
              : SecondOBJ[key];
        }
      }
      return FirstOBJ;
    },
  },
};
</script>

<style  lang="scss">
.import-file-dialog.customDialogclass {
  .el-dialog__body{
    padding:30px 50px;
  }
}
</style>