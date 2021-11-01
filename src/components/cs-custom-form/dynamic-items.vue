/**
 * @Description: 表单动态配置项入口
 * @author Roman
 * @date 2021-03-31 13:55:16
 * @edit 2021-03-31 13:55:16
*/

<script type="text/jsx">
import defaultItem from './default-item'
export default {
  name: 'DynamicItems',
  components: {
    defaultItem
  },
  inheritAttrs: false,
  props: {
    item: {
      type: Object
    },
    layout: {
      type: Boolean
    },
    getKey: {
      type: Function
    },
    getSpan: {
      type: Function
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    getContent() {
      const content = []
      const formDatas = this.$attrs['form-datas']
      const isShow = this.$attrs['is-show']
      const layout = this.layout
      const deepGet = (item) => {
        const arr = []
        for (const i in item) {
          const item_c = item[i]
          if (isShow(item_c)) {
            arr.push(
              <el-col {...{ props: { ...item_c, span: this.getSpan(item_c, item) }}}>
                <default-item {...{ key: this.getKey(item_c), attrs: { prop: item_c.prop, value: formDatas[item_c.prop], ...this.$attrs }, props: { options: item_c, layout }}} />
              </el-col>)
          }
          if (item_c.children) {
            deepGet(item_c.children)
          }
        }
        const vnode = (<el-row {...{ props: { ...this.item }}}>{arr}</el-row>)
        content.push(vnode)
      }
      if (this.item.children) {
        deepGet(this.item.children)
      } else {
        const vnode = (<default-item {...{ key: this.getKey(this.item), attrs: { prop: this.item.prop, value: formDatas[this.item.prop], ...this.$attrs }, props: { options: this.item, layout }}} />)
        content.push(vnode)
      }

      return content.reverse()
    }
  },
  render(h) {
    const content = this.getContent()
    if (content.length === 1) {
      return content[0]
    }
    return (
      <div>{ content }</div>
    )
  }
}
</script>
