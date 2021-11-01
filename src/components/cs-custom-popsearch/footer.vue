/**
 * @Description:自定义弹框入口
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div class="dialog-footer">
    <el-button v-for="(item,index) in content" :key="index" :style="item.style" :class="item.className" class="btn" :type="item.type" @click="handle(item)">{{ item.name }}</el-button>
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
    },
    gettable: {
      type: Function
    }
  },
  data() {
    return {
    }
  },
  computed: {
    footerOptions() {
      return this.options.footerOptions || {}
    },
    content() {
      return this.footerOptions.content || []
    },
    form() {
      return this.getform()
    },
    formDatas() {
      return this.getformDatas()
    },
    table() {
      return this.gettable()
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    handle(item) {
      item.handle && item.handle({ ...this.formDatas }, this.form, this.table)
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
