/**
 * @Description:自定义弹框入口
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-drawer
    :title="options.title"
    :visible.sync="options.visible"
    :class="options.className"
    :modal="options.modal"
    :modal-append-to-body="options.modalAppendToBody"
    :append-to-body="options.appendToBody"
    :custom-class="options.customClass?options.customClass+' customDrawerclass':'customDrawerclass'"
    :close-on-press-escape="options.closeOnPressEscape"
    :before-close="beforeClose"
    :destroy-on-close="options.destroyOnClose"
    :with-header="options.withHeader"
    :show-close="options.showClose"
    :wrapper-closable="options.wrapperClosable||false"
    :size="options.size||'480px'"
    :direction="options.direction"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
  >
    <template v-if="options.header" slot="title">
      <component :is="options.header" :options="options" :getform="getform" :getform-datas="getformDatas" />
    </template>
    <div class="drawerBody">
      <div class="content customScrollbar">

        <template v-if="options.components&&Object.keys(options.components).length">
          <component :is="component" v-for="(component, key) in options.components" ref="customform" :key="key" :options="options" :pop-visible="options.visible" />
        </template>
        <template v-else-if="options.component">
          <component :is="options.component" ref="customform" :options="options" :pop-visible="options.visible" />
        </template>
        <template v-else>
          <cs-custom-form ref="customform" :data-source="options.content" :form-datas="options.formDatas" :options="options.formOptions" :pop-visible="options.visible" :reset-errors="options.resetErrors" />
        </template>

      </div>
      <div class="footer">
        <template v-if="options.footer">
          <component :is="options.footer" :options="options" :getform="getform" :getform-datas="getformDatas" />
        </template>
        <div v-else-if="isShow">
          <pop-footer :options="options" :getform="getform" :getform-datas="getformDatas" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import PopFooter from './footer'
export default {
  name: 'DrawerItem',
  components: {
    PopFooter
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {

    }
  },

  computed: {
    isShow() {
      if (Object.prototype.toString.call(this.options.showFooter) !== '[object Undefined]') {
        return this.options.showFooter
      } else {
        return !this.options.okHidden || !this.options.cancelHidden || this.options.saveAndadd
      }
    },
    wrapperClosable() {
      return Object.prototype.toString.call(this.options.wrapperClosable) !== '[object Undefined]' ? this.options.wrapperClosable : true
    },
    form() {
      if (this.options.components && this.options.components.length || this.options.component) {
        return this.$refs.customform
      }
      return this.$refs.customform.form
    },
    formDatas() {
      if (this.options.components && this.options.components.length || this.options.component) {
        return this.$refs.customform
      }
      return this.$refs.customform.dynamicValidateFormRuleForm
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    getform() {
      return this.form
    },
    getformDatas() {
      return this.formDatas
    },
    beforeClose(done) {
      if (this.options.beforeClose) {
        this.options.beforeClose(this.getform, this.getformDatas, done)
      } else {
        done()
      }
    },
    open() {
      this.$emit('open', this.getform, this.getformDatas)
    },
    opened() {
      this.$emit('opened', this.getform, this.getformDatas)
    },
    close() {
      this.form.resetFields && this.form.resetFields()
      document.querySelector('.drawerBody .content').scrollTo && document.querySelector('.drawerBody .content').scrollTo(0, 0)
      this.$emit('close', this.getform, this.getformDatas)
    },
    closed() {
      this.$emit('closed', this.getform, this.getformDatas)
    }
  }
}
</script>

<style lang="scss">
    .el-drawer.customDrawerclass{

    }
    .el-drawer.customDrawerclass .el-drawer__header{ margin-bottom: 15px}
    .el-drawer.customDrawerclass  .el-drawer__body{
        height:  calc(100% - 100px);
        overflow: hidden;
    }
.drawer{
    text-align: right;
}
    .el-drawer.customDrawerclass .drawerBody{  flex-direction: column; flex: 1; height: calc(100vh)}
    .el-drawer.customDrawerclass .content{ padding: 0px 20px;height: calc(100% - 120px);overflow-y: auto}
    .el-drawer.customDrawerclass .footer{text-align: right; padding: 0px 20px; margin-top: 10px}
.el-drawer__header span:focus{
    outline:0;
}

.el-drawer__close-btn:focus{
    outline:0;
}
/*/deep/ .el-drawer.rtl{*/
/*    overflow-y: scroll;*/
/*}*/
</style>
