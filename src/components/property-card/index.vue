/**
 * @Description: -pms wms产品属性card
 * @author mabeier
 * @date 2021/5/6
*/
<template>
  <div class="PropertyCard">
    <div class="top-all">
      <div v-for="(i, key) in content" :key="key" class="text-all">
        <div class="label">
          <span>{{ `${i.label}：` }}</span>
        </div>
        <span>{{ i.value ? i.value(detail[i.prop]) : detail[i.prop] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { info } from '@/components/property-card/api/index.js'
export default {
  name: 'PropertyCard',
  inheritAttrs: false,
  props: {
    custom: {
      type: String
    }
  },
  data() {
    const getName = (val) => {
      const obj = {
        '0101': '天然纤维',
        '0102': '化学纤维',
        '0103': '组合纤维',
        '0201': '坯布',
        '0202': '色布',
        '0203': '组合布',
        '0204': '花布'
      }
      return obj[val] || ''
    }
    const pro0101 = [
      { label: '物料类型', prop: 'materielType', value: (val) => getName(val) },
      { label: '纱支单位', prop: 'bdYarnCountUnit' },
      {
        label: '纱支',
        prop: 'yarnCount',
        value: (val) => (val && val && val.name) || '' || ''
      },
      {
        label: '成份/组合成份',
        prop: 'ingredients',
        value: (val) => (val && val.name) || ''
      },
      // { label: '比例', prop: 'ratioEasy' },
      {
        label: '梳棉方法',
        prop: 'cardingMethod',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '纺纱方法',
        prop: 'spinningMethod',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '染色适应性',
        prop: 'yarnDyeingAdaptability',
        value: (val) => (val && val.name) || ''
      },
      { label: '股数', prop: 'bdYarnCountStrandsNumber' },
      {
        label: '捻向',
        prop: 'shortWistDirection',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '纱类',
        prop: 'yarnType',
        value: (val) => (val && val.name) || ''
      },
      { label: '染纱颜色', prop: 'yarnColor' },
      { label: '比例', prop: 'ratioEasy', span: 12 }
    ]
    const pro0102 = [
      { label: '物料类型', prop: 'materielType', value: (val) => getName(val) },
      {
        label: '细度',
        prop: 'fineness',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '成份/组合成份',
        prop: 'ingredients',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '品名',
        prop: 'productName',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '光泽度',
        prop: 'gloss',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '捻向',
        prop: 'longWistDirection',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '功能',
        prop: 'functions',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '弹力程度',
        prop: 'stretch',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '网络度',
        prop: 'networkDegree',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '颜色',
        prop: 'colorMethod',
        value: (val) => (val && val.name) || ''
      },
      { label: '染纱颜色', prop: 'yarnColor' },
      { label: '组合方式', prop: 'composeMethod' },
      {
        label: '截面形状',
        prop: 'sectionShape',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '丝类',
        prop: 'silk',
        value: (val) => (val && val.name) || ''
      }
    ]
    // combination[] yarnCode纱线编码  proportion纱线比例
    const pro0103 = [
      { label: '物料类型', prop: 'materielType', value: (val) => getName(val) },
      {
        label: '组合方式',
        prop: 'composeMethod',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '包覆方式',
        prop: 'coatMethod',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '捻向',
        prop: 'longWistDirection',
        value: (val) => (val && val.name) || ''
      },
      { label: '染纱颜色', prop: 'yarnColor' }
    ]
    const pro0201 = [
      { label: '物料类型', prop: 'materielType', value: (val) => getName(val) },
      {
        label: '布种',
        prop: 'fabrication',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '染方式',
        prop: 'fabricationDyed',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '是否弹力',
        prop: 'resilience',
        value: (val) => (val && '是') || '否'
      },
      {
        label: '织造花型',
        prop: 'fabricationKnit',
        value: (val) => (val && val.name) || ''
      },
      {
        label: '主成份',
        prop: 'ingredients',
        value: (val) => (val && val.name) || ''
      },
      { label: '总针数', prop: 'totalNeedleNumber' },
      { label: 'Layout条纹间距', prop: 'spacingEasy' }
    ]
    const pro0202 = [
      { label: '物料类型', prop: 'materielType', value: (val) => getName(val) },
      { label: '坯布编码', prop: 'embryoCode' },
      {
        label: '成品克重',
        prop: 'fabricWeight',
        value: (val) => (val && val + ' g/m2') || ''
      },
      {
        label: '成品布封',
        prop: 'fabricWidth',
        value: (val) => (val && val + ' cm') || ''
      },
      {
        label: '印染类型',
        prop: 'dyePrintType',
        value: (val) => (val && val.name) || ''
      },
      { label: '染色成份', prop: 'dyeElementNameEasy' },
      {
        label: '染整工艺组合',
        prop: 'dyeTech',
        value: (val) => (val && val.name) || ''
      },
      { label: '功能性整理', prop: 'productFunctionEasy' },
      { label: '风格整理', prop: 'productStyleEasy' },
      { label: '手感整理', prop: 'productFeelEasy' },
      { label: '成品颜色', prop: 'clothColor' }
    ]
    const pro0203 = [...pro0202]
    const pro0204 = [
      { label: '物料类型', prop: 'materielType', value: (val) => getName(val) },
      { label: '色布编码', prop: 'colorCode' },
      {
        label: '成品克重',
        prop: 'fabricWeight',
        value: (val) => (val && val + ' g/m2') || ''
      },
      {
        label: '成品布封',
        prop: 'fabricWidth',
        value: (val) => (val && val + ' cm') || ''
      },
      { label: '印花花号', prop: 'flower' }
    ]
    return {
      materielType: '',
      detail: {},
      type: {
        pro0101,
        pro0102,
        pro0103,
        pro0201,
        pro0202,
        pro0203,
        pro0204
      },
      timeout: null,
      content: []
    }
  },
  computed: {},
  watch: {
    custom(val) {
      this.getInfo(val)
    },
    materielType() {
      if (this.type[this.materielType] && this.type[this.materielType].length) {
        this.type[this.materielType].unshift({
          label: '产品编号',
          value: (val) => this.custom,
          span: 24,
          prop: 'custom'
        })
      }
      this.content = this.type[this.materielType] || []
    }
  },
  created() {},
  methods: {
    async getInfo(code) {
      this.detail = (await info(code)).data
      if (this.detail.materielType === '0103') {
        const arr = this.detail.combination.reduce((a, n, i) => {
          a.push(
            { label: '纱线' + (i + 1) + '编码', prop: 'yarnCode' + (i + 1) },
            { label: '纱线' + (i + 1) + '占比', prop: 'proportion' + (i + 1) }
          )
          this.detail['yarnCode' + (i + 1)] = n.yarnCode
          this.detail['proportion' + (i + 1)] = n.proportion
          return a
        }, [])
        this.type.pro0103 = [...this.type.pro0103.slice(0, 5), ...arr]
      }
      this.materielType = 'pro' + this.detail.materielType
      // this.$refs.product.open();
    }
  }
}
</script>

<style lang="scss" scoped>
.PropertyCard {
  .top-all {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .text-all {
      line-height: 28px;
      min-width: 50%;
      justify-content: flex-start;
      .label {
        text-align: right;
        width: 115px;
        display: inline-block;
      }
      :nth-child(even) {
        color: #474747;
        text-align: left;
        min-width: 100%;
      }
      :nth-child(odd) {
        color: #888e9e;
      }
    }
  }
}
</style>
