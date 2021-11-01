/**
 * @Description: 拖拽排序
 * @author Roman
 * @date 2021-02-25 09:27:11
 * @edit 2021-02-25 09:27:11
*/
<template>
  <div ref="dragSort" :class="getClass" @click="handle">
    <span v-for="(item,index) in data" :key="JSON.stringify(item)+index">
      <span :key="index" class="item">
        {{ item[getLabel] }}
      </span>
      <span v-if="index<data.length-1" class="separation">{{ options.separation||'>' }}</span>
    </span>
  </div>
</template>
<script>
import Sortable from 'sortablejs'

export default {
  name: 'DragSort',
  props: {
    options: {
      type: [Object],
      default: () => {}
    },
    data: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    getClass() {
      return this.options.className ? 'dragSort ' + this.options.className : 'dragSort'
    },
    props() {
      return this.options.props ? this.options.props : {}
    },
    getLabel() {
      return this.props.label ? this.options.label : 'label'
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
          const list = [...this.data]
          const current = list.splice(oldIndex, 1)[0]
          list.splice(newIndex, 0, current)
          this.options.onEnd && this.options.onEnd(evt, list)
        }
      })
    },
    handle() {
      this.options.handle && this.options.handle()
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
        width: 500px;
        border: 1px solid #f4f4f5;
        border-radius: 2px;
        padding: 20px;
        font-size: 14px;
    .item {
       padding: 3px;
        border-radius: 5px;
        display: inline-block;
        background: #f4f4f5;
    }
    .separation{
        display: inline-block;
        margin: 0px 3px;
    }
    }
</style>
