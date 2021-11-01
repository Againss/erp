<template>
  <div class="processManage-technology-common">
    <div class="leftBox">工艺流程：</div>
    <div class="rightBox">
      <template v-if="msg.length">
        <div v-for="(i, index) in msg" :key="index" class="content">
          <div>{{ i.name }}</div>
          <div v-if="index !== msg.length - 1">-></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import * as apiPub from "@/views/processing-manage/public/api/index.js";
export default {
  props: {
    custom: {
      type: String,
    },
  },
  data() {
    return {
      msg: [],
    };
  },
  watch: {
    custom(val) {
      this.init();
    },
  },
  created() {},
  methods: {
    async init() {
      const res = await apiPub.techController({
        techDetailId: this.custom,
      });
      if (res.code === 200) {
        this.msg = res.data.processFlow ? JSON.parse(res.data.processFlow) : [];
      }
    },
  },
};
</script>

<style scoped lang="scss">
.processManage-technology-common {
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  .leftBox {
    width: 80px;
    font-size: 12px;
    color: #888e9e;
    text-align: right;
  }
  .rightBox {
    flex: 1;
    font-size: 12px;
    color: #474747;
    .content {
      display: inline-flex;
      margin-bottom: 10px;
      > div {
        margin-right: 10px;
      }
    }
  }
}
</style>