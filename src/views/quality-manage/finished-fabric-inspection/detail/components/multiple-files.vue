<!--
 * @name: 选择提示弹框组件
 * @description: 选择提示弹框组件
 * @author: panmr
 * @time: 2021-06-22 16:51:57
-->
<template>
  <div>
    <!--    <span v-for="(item, index) in scope.row[componentsOptions.prop]" :key="index" style="color: #0f89f3;cursor: pointer; margin-right: 10px;" @click="downLoadFile(item)">-->
    <!--      <i class="el-icon-paperclip" />{{ item.originalName }}-->
    <!--    </span>-->
    <div v-for="(item, i) in listSlice" :key="i">
      <span v-for="(subItem, j) in item" :key="j" style="color: #0f89f3;cursor: pointer; margin-right: 10px;" :title="subItem.originalName" @click="downLoadFile(subItem)">
        <i class="el-icon-paperclip" />{{ formatterName(subItem.originalName) }}
      </span>
    </div>
  </div>
</template>

<script>
// import { downFile } from '@/views/quality-manage/finished-cloth/detail/api'

export default {
  name: 'MultipleFiles',
  components: {},
  mixins: [],
  props: {
    scope: {
      type: Object,
      default: () => ({})
    },
    componentsOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: [],
      listSlice: []
    }
  },
  mounted() {
    this.list = this.scope.row[this.componentsOptions.prop] || []
    this.listSlice = this.arrSlice(this.list)
  },
  methods: {
    // 最多15个字符，多了用“...”  这啥玩意儿需求啊 无语
    formatterName(name) {
      if (name.length > 19) { // 这里 19 = 15 + 4 4为.png  .jpg .pdf等后缀的长度
        return name.substr(0, 15) + '...'
      }
      return name
    },
    // 将一个数组中的元素，从前到后两两一组
    arrSlice(arr = []) {
      return arr.sort(() => Math.random() > 0.5) // 打乱
        .map((e, i) => i % 2 ? null : arr.slice(i, i + 2)) // 两两取出
        .filter(Boolean)
    },
    // 文件下载
    async downLoadFile(item) {
      window.open(item.viewUrl)
      // const res = await downFile({ url: item.filePath })
      // this.$utils.downloadStream(res)
    },
    open(viewUrl) {
      window.open(viewUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
