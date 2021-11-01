/**
* @Description: 拖拽排序例子
* @author Roman
* @date 2021-02-25 09:27:11
* @edit 2021-02-25 09:27:11
*/
<template>
  <div style="background: #fff">
    <div class="custom-demo-title">拖拽排序 demo:
      <span style="font-size: 14px;vertical-align: bottom;margin-left: 10px; cursor: pointer;color:#777">
        <cs-fullscreen :is-full.sync="isFull" :options="fullOptions">
          <span>{{ getFullContent.txt }}<svg-icon :icon-class="getFullContent.icon" /></span>
        </cs-fullscreen>
      </span>
    </div>
    <drag-sort :options="options" :data="data" />
  </div>
</template>

<script>

import DragSort from '@/components/drag-sort/index'

export default {
  components: {
    DragSort
  },
  data() {
    const onEnd = (evt, data) => {
      this.data = data
    }
    const handle = () => {
      console.log(123)
    }
    return {
      isFull: false,
      fullOptions: {
        element: null
      },
      options: {
        onEnd,
        handle
      },
      data: []
    }
  },
  computed: {
    getFullContent() {
      let txt = '全屏'
      let icon = 'fullscreen'
      if (this.isFull) {
        txt = '退出'
        icon = 'exit-fullscreen'
      }
      return { txt, icon }
    }
  },
  mounted() {
    this.fullOptions.element = this.$el
    setTimeout(() => {
      this.data = [
        { label: '工序a', value: 'a' },
        { label: '工序b', value: 'b' },
        { label: '工序c', value: 'c' },
        { label: '工序d', value: 'd' },
        { label: '工序e', value: 'e' },
        { label: '工序f', value: 'f' }]
    }, 0)
  }
}
</script>

<style lang="scss" scoped>
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
