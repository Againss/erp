/**
 * @Description:自定义弹框入口
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div class="dialog-footer">
    <el-button v-if="!options.okHidden" class="btn" type="primary" @click="okHandle">{{ options.okText||'确 定' }}</el-button>
    <el-button v-if="options.saveAndadd" class="btn" plain type="primary" @click="saveAndaddHandle">{{ options.saveAndaddText||'提交继续添加' }}</el-button>
    <el-button v-if="!options.cancelHidden" class="btn" @click="cancelHandle">{{ options.cancelText||'取 消' }}</el-button>
  </div>
</template>

<script>

export default {
  name: 'PopFooter',
  components: {
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    getform: {
      type: Function
    },
    getformDatas: {
      type: Function
    }
  },
  data() {
    return {
    }
  },
  computed: {
    form() {
      return this.getform()
    },
    formDatas() {
      return this.getformDatas()
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    okHandle() {
      if (this.form && this.form.validate) {
        this.form.validate((valid) => {
          if (valid) {
            this.options.ok && this.options.ok({ ...this.formDatas }, this.form)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.options.ok && this.options.ok({ ...this.formDatas }, this.form)
      }
    },
    cancelHandle() {
      this.options.cancel && this.options.cancel({ ...this.formDatas }, this.form)
    },
    saveAndaddHandle() {
      this.options.saveAndadd && this.options.saveAndadd({ ...this.formDatas }, this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer{
    text-align: center;
}
    .dialog-footer .btn{ min-width: 90px}
</style>
