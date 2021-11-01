/**
 * @Description:自定义弹框入口
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-dialog
    v-el-drag-dialog="options.drag"
    :title="options.title"
    :class="options.className"
    :visible.sync="options.visible"
    :width="options.width||'580px'"
    :modal="options.modal"
    :fullscreen="options.fullscreen"
    :modal-append-to-body="options.modalAppendToBody"
    :append-to-body="options.appendToBody"
    :lock-scroll="options.lockScroll"
    :custom-class="options.customClass?options.customClass+' customDialogclass':'customDialogclass'"
    :close-on-click-modal="options.closeOnClickModal||false"
    :close-on-press-escape="options.closeOnPressEscape"
    :show-close="options.showClose"
    :before-close="beforeClose"
    :center="options.center"
    :destroy-on-close="options.destroyOnClose"
    :top="options.top||'5vh'"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
  >
    <template v-if="options.header" slot="title">
      <component :is="options.header" :options="options" :getform="getform" :getform-datas="getformDatas" />
    </template>
    <div>
      <slot name="header" />
      <template v-if="options.components&&Object.keys(options.components).length">
        <component :is="component" v-for="(component, key) in options.components" ref="customform" :key="key" :options="options" :pop-visible="options.visible" />
      </template>
      <template v-else-if="options.component">
        <component :is="options.component" ref="customform" :options="options" :pop-visible="options.visible" />
      </template>
      <template v-else>
        <cs-custom-form ref="customform" :data-source="options.content" :form-datas="options.formDatas" :options="options.formOptions" :pop-visible="options.visible" :reset-errors="options.resetErrors" />
      </template>
      <slot name="content" />
      <slot name="footer" />
    </div>
    <template v-if="options.footer">
      <component :is="slots.footer" slot="footer" :options="options" :getform="getform" :getform-datas="getformDatas" />
    </template>
    <pop-footer v-else-if="isShow" slot="footer" :options="options" :getform="getform" :getform-datas="getformDatas" />
  </el-dialog>
</template>

<script>
import PopFooter from './footer'
import csCustomForm from '../cs-custom-form/form'
export default {
  name: 'DialogItem',
  components: {
    PopFooter,
    csCustomForm
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    slots: {
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
    form() {
      if (!this.$refs.customform) {
        return {}
      }
      if (this.options.components && this.options.components.length || this.options.component) {
        return this.$refs.customform
      }
      return this.$refs.customform.form
    },
    formDatas() {
      if (!this.$refs.customform) {
        return {}
      }
      if (this.options.components && this.options.components.length || this.options.component) {
        return this.$refs.customform
      }
      return this.$refs.customform.dynamicValidateFormRuleForm
    }
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
      this.form && this.form.resetFields && this.form.resetFields()
      document.querySelector('.customDialogclass .el-dialog__body').scrollTo && document.querySelector('.customDialogclass .el-dialog__body').scrollTo(0, 0)
      this.$emit('close', this.getform, this.getformDatas)
    },
    closed() {
      this.$emit('closed', this.getform, this.getformDatas)
    }
  }
}
</script>

<style lang="scss">
    .el-dialog__wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
    }
.customDialogclass {
    margin: 0!important;
    .el-dialog__body{
    max-height: calc(90vh - 132px);
    overflow-y: auto;
}
}
</style>

