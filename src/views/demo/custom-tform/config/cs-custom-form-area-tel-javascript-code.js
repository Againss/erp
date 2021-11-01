/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
/* eslint-disable*/
const code = `
<script>
export default {
  components: {},
  props: {
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    }
  },
  data() {
    const ruleRequire = this.$getRules({})
    return {
      ruleRequire,
      dataSource: [{ label: '+86', value: 86 }, { label: '+85', value: 85 }]
    }
  },
  computed: {
    telValue() {
      return this.formDatas.tel
    },
    areaNumValue() {
      return this.formDatas.areaNum
    }
  },
  mounted() {
  },
  methods: {
    areaNumChange(value) {
      this.setFormDatas({ areaNum: value })
    },
    telChange(value) {
      this.setFormDatas({ tel: value })
    }
  }
}
</script>
`
export default code
