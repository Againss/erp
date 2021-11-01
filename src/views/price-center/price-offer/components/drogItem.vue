<!--
 * @Date: 2021-05-17 14:35:59
 * @Author: Againss
 * @LastEditTime: 2021-05-27 10:35:25
 * @LastEditors: Againss
 * @Descripttion:
-->
/**
 * @Description: 拖拽排序
 * @author Roman
 * @date 2021-02-25 09:27:11
 * @edit 2021-02-25 09:27:11
*/
<template>
  <div v-show="componentsOptions.isShow==='add'">
    <div>已选：</div>
    <div ref="dragSort" class="dragSort" @click="handle">
      <el-tag v-for="(item,index) in componentsOptions.data" :key="item.id+'-'+index" class="tag" size="medium" closable @close="close(index)">{{ item[componentsOptions.label] }}</el-tag>
    </div>
  </div>
</template>
<script>
import Sortable from 'sortablejs'

export default {
  name: 'DragSort',
  props: {
    componentsOptions: {
      type: [Object],
      default: () => {
        return {
          data: []
        }
      }
    }
  },
  data() {
    return {
    }
  },
  watch: {

  },
  mounted() {
    this.$nextTick(() => {
      this.setSort()
    })
  },
  beforeDestroy() {
    document.body.removeEventListener('drop', this.originEvent)
  },
  methods: {
    setSort() {
      document.body.addEventListener('drop', this.originEvent)
      const warp = this.$refs.dragSort
      this.sortable = Sortable.create(warp, {
        animation: 180,
        delay: 0,
        preventOnFilter: true,
        onEnd: evt => {
          const { newIndex, oldIndex } = evt
          const list = [...this.componentsOptions.data]
          const current = list.splice(oldIndex, 1)[0]
          list.splice(newIndex, 0, current)
          this.componentsOptions.onEnd && this.componentsOptions.onEnd(list)
        }
      })
    },
    handle() {
      this.componentsOptions.handle && this.componentsOptions.handle()
    },
    close(index) {
      const list = [...this.componentsOptions.data]
      list.splice(index, 1)
      this.componentsOptions.close(list)
    },
    originEvent(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
    .dragSort{
        width: 100%;
        padding: 0 10px;
        font-size: 14px;
        .tag {
          margin: 10px;
        }
    }
</style>
