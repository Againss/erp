/**
 * @Description:icon单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-popover
    :popper-class="popoverOptions.popperClass"
    :placement="popoverOptions.placement||'left'"
    :title="popoverOptions.title"
    :width="popoverOptions.width||760"
    :trigger="popoverOptions.trigger||'click'"
  >
    <div class="iconclass customScrollbar">
      <div v-for="item of svgIcons" :key="item" class="icon-item" :title="item" @click="iconChange(item,$event)">
        <svg-icon :icon-class="item" class-name="disabledbak" />
        <span class="text">{{ item }}</span>
      </div>
    </div>
    <el-input
      slot="reference"
      :type="options.type||'input'"
      :value="value"
      :placeholder="options.placeholder"
      :rows="options.rows"
      :readonly="false"
      @input="iconChange"
    />
  </el-popover>
</template>

<script>
import svgIcons from './components/svg-icons'
export default {
  name: 'TreeItem',
  components: {

  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    value: {
      type: String
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      svgIcons
    }
  },
  computed: {
    popoverOptions() {
      return this.options.popoverOptions ? this.options.popoverOptions : {}
    }
  },
  watch: {},
  mounted() {
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    iconChange(item) {
      this.change(item)
    }
  }
}
</script>

<style lang="scss">
.iconclass{
    max-height: 60vh;
    overflow-y: auto;
    display: flex;
    flex-wrap:  wrap;
}
.iconclass .icon-item{
    text-align: center;
    width: 90px;
    height: 90px;
    padding: 5px;
    font-size: 20px;
    display: flex;
    flex-wrap:  wrap;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    cursor: pointer;
}
.iconclass .icon-item .text{
    margin-top: 10px;
    overflow: hidden;
    width: 100%;
    text-overflow:ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    display: block;
    font-size: 12px;
}
</style>
