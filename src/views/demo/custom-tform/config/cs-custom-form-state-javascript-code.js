/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
/* eslint-disable*/
const code = `
<script>
export default {
  name: 'StateColumn',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    editType: {
      type: String
    },
    column: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: String
    }
  },
  data() {
    return {
    }
  },
  computed: {
    editabled() {
      return this.scope.row.edit && this.editType === 'inline'
    },
    rules() {
      return this.column.editOptions.rules
    },
    prop() {
      return [this.scope.$index] + '.' + [this.scope.column.property]
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    selectChange(value) {
      const obj = { ...this.formDatas[this.scope.$index], [this.scope.column.property]: value }
      this.setFormDatas({ [this.scope.$index]: obj })
    }
  }
}
</script>
`
export default code
