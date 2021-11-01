/**
 * @Description: 详情底部按纽栏配置(可配置上传文件按钮)
 * @author 马贝儿
 * @date 2021/4/25
  config:基本配置
  wipeClass :为true则去除本页所有class,默认不传，false
*/

<template>
  <div :class="{ ButtonBar: !wipeClass }">
    <div :class="{ 'button-group': !wipeClass }">
      <div :class="{ 'btn-groups': !wipeClass }">
        <template v-for="(i, key) in config">
          <template v-if="i.isShow ? i.isShow() : true">
            <el-button
              v-if="!i.upload"
              :key="key"
              :class="[i.buttonClass,i.buttonClassFun&&i.buttonClassFun()]"
              :disabled="i.disabled && i.disabled()"
              :size="i.size || 'small'"
              :type="i.type"
              @click="i.submit()"
            >{{ i.text }}</el-button>
            <upload
              v-else
              :key="key"
              :options="i.upload.options"
              :form-datas="i.upload.formDatas"
              class="speUpload"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import upload from '@/components/cs-custom-form/upload-item.vue'
export default {
  name: 'ButtonBar',
  components: { upload },
  props: {
    config: {
      type: Object
    },
    wipeClass: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.ButtonBar {
  margin-top: 75px;
  margin-left: -20px;
  .button-group {
    bottom: 0;
    z-index: 2000;
    padding: 10px;
    width: 100%;
    background: #fff;
    border-top: 1px solid #ecf0f3;
    position: fixed;
    .btn-groups {
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

<style  lang="scss" >
.ButtonBar {
  .speUpload.upload-demo {
    margin: 0 10px;
  }
}
</style>
