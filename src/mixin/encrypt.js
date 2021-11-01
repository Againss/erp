import { deepClone } from '../utils'
export default {
  // activated() {
  //   this.$nextTick(() => {
  //     this.$forceUpdate()
  //   })
  // },
  methods: {
    /**
       * @Description: 字段加密公共方法
       * @param {(object 、array)} options 需要处理的表单、表格-表单配置
       * options.ruleProp 层级较深或多表单字段重复 表单配置项加ruleProp
       * @param {(object)} rules 表单的加密校验规则
       * @param {(string)} type add 、 edit 、 info： add不处理 info只处理隐藏字段
      */
    // this.encryptFn(this.naturalFiberContent, this.orderData['_rule'], 'add')
    encryptFn(options, rules = {}, type = 'edit') {
      if (!(options && typeof options === 'object')) return
      for (const key in options) {
        if (options[key].child) {
          this.encryptFn(options[key].child, rules, type)
        } else {
          const ruleType = Object.keys(rules).find(rname => {
            const ele = rname.endsWith('.label') ? rname.slice(0, -6) : rname
            return ele === options[key].ruleProp || ele === options[key].prop || ele.match(new RegExp(`\\.${options[key].prop}$`))
          })
          if (ruleType && (type === 'edit' || type === 'info')) {
            if (rules[ruleType].t === 'H') {
              // 隐藏不显示
              this.$set(options[key], 'isShow', false)
            } else if (type !== 'info' && (rules[ruleType].t === 'B' || rules[ruleType].t === 'D')) {
              const item = options[key].editOptions || options[key]
              // 加密不可编辑  或 不加密不可编辑
              this.$set(item, 'itemTypeCopy', item.itemTypeCopy || item.itemType)
              this.$set(item, 'itemType', 'itemview')
              this.$set(item, 'rulesCopy', item.rulesCopy || (item.rules && deepClone(item.rules) || null))
              this.$set(item, 'rules', null)
              if (!item.renderContent) {
                item.renderContent = value => {
                  const val = Object.prototype.toString.call(value) === '[object Object]' ? value.label || '' : value || ''
                  return `<span style="color: #999;">${val}</span>`
                }
              }
            }
          } else {
            const item = options[key].editOptions || options[key]
            this.$set(item, 'itemType', item.itemTypeCopy || item.itemType)
            this.$set(item, 'rules', item.rulesCopy || item.rules)
            if (rules[ruleType] && rules[ruleType].t === 'H') {
              this.$set(item, 'isShow', true)
            }
          }
        }
      }
    }
  }
}

