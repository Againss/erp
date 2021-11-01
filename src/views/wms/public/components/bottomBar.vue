<template>
  <div class="bottomBar">
    <div class="wms-btn-group">
      <div class="btn-groups" v-if="!config">
        <el-button
          v-if="options.customShow"
          @click="options.customSubmit"
          :type="options.customType ? options.customType : 'default'"
          >{{ options.customSubmitText }}</el-button
        >
        <el-button @click="options.cancelSubmit" v-if="!options.cancelHidden">{{
          options.cancelText
        }}</el-button>
        <el-button
          type="primary"
          @click="options.submit"
          v-if="!options.submitHidden"
          >{{ options.submitText }}</el-button
        >
      </div>
      <div class="btn-groups" v-else>
        <template v-for="(i, key) in config">
          <template v-if="(i.isHidden ? !i.isHidden() : true) && !i.upload">
            <el-button :key="key" :type="i.type" @click="i.submit()">{{
              i.text
            }}</el-button>
            <upload
              v-if="i.upload"
              :key="key"
              :options="i.upload.options"
              :formDatas="i.upload.formDatas"
              class="speUpload"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import upload from "@/components/cs-custom-form/upload-item.vue";
export default {
  name: "bottomBar",
  components: { upload },
  props: {
    options: {
      type: Object,
    },
    config: {
      default: null,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.bottomBar {
  margin-top: 75px;
  margin-left: -20px;
  .wms-btn-group {
    bottom: 0;
    z-index: 2000;
    padding: 10px;
    width: 100%;
    background: #fff;
    border-top: 1px solid #ecf0f3;
    position: fixed;
    .btn-groups {
      // position: relative;
      // left: 40%;
      margin-left: -8%;
      display: flex;
      justify-content: center;
      .speUpload {
        display: inline-block;
        /deep/.el-button--small {
          width: 98px;
          height: 36px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>