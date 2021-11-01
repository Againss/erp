<!--
 * @Date: 2021-06-29 15:30:11
 * @Author: Againss
 * @LastEditTime: 2021-07-14 16:19:38
 * @LastEditors: Againss
 * @Descripttion: 面料成份比例
-->
<template>
  <div ref="fabricComposition" class="order-items goods-order-items">
    <div class="header-top">
      <span :class="{'product-is-request':isEdit}">面料成分/比例</span>
      <el-button v-if="isEdit&&rowIndex!==0&&materialData&&materialData.length" type="primary" size="mini" @click="addFabricComposition">选择</el-button>
    </div>
    <div class="material-datainfo ">
      <cs-custom-form ref="fabricCompositionData" :options="{ popError: true}" class="page-table-border" :data-source="fabricCompositionData" />
    </div>
    <div class="pop">
      <cs-custom-pop :options="fabricCompositionPopOptions" />
    </div>
  </div>
</template>

<script>
import radioView from './radio-with-view.vue'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    rowIndex: {
      type: Number
    },
    materialData: {
      type: [Object, Array]
    },
    data: {
      type: [Object, Array]
    },
    syncMoudleDataHandle: {
      type: Function
    }
  },
  data() {
    const validatePassRatio = (rule, value, callback) => {
      const res = /^([1-9]\d*|0)$/g
      if (!res.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9]/g, '')
      return data
    }
    const columns = {
      _elementInfo: {
        prop: 'elementInfo',
        label: '成份',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.type === 1 ? (scope.row.elementInfo && scope.row.elementInfo.label || '') : (scope.row.elementTypeInfo && scope.row.elementTypeInfo.label || '')
        }
      },
      _ratio: {
        prop: 'ratio',
        label: '客户比例',
        showOverflowTooltip: true,
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 50,
          trim: ruleTrim,
          rules: [{ validator: validatePassRatio, trigger: 'blur' }, { required: true, message: '客户比例不能为空', trigger: 'blur' }],
          size: 'small',
          change: (value, form, formDatas, setFormDatas) => {
            // 下面用到客户比例数据
            this.fabricCompositionData._tableForm.dataSource = formDatas.tableForm
            this.syncMoudleDataHandle('fabricElement', formDatas.tableForm || [])
          }
        }
      }
    }
    const fabricCompositionData = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        tooltipEffect: 'light',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: columns
      }
    }
    const fabricCompositionPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择面料成分',
      width: '540px',
      ok: params => {
        console.log(params, this.tempFabricCompositionData)
        const data = this.$utils.deepClone(this.tempFabricCompositionData)
        const tempData = []
        // 整理成后端序号的数据
        data.forEach((item, index) => {
          // 2 成份类型  1  单一成分
          const SameData = this.getSameData(item.type, item.uuid)
          console.log(SameData, SameData)
          if (item.type === 2) {
            tempData.push({
              elementTypeInfo: { value: item.uuid, label: item.name },
              elementTypeNameEn: item.nameEn,
              type: 2,
              edit: true,
              ratio: SameData ? SameData.ratio : ''
            })
          } else {
            item.ingredients.forEach(a => {
              tempData.push({
                elementTypeInfo: { value: item.uuid, label: item.name },
                elementInfo: { value: a.uuid, label: a.name },
                elementTypeNameEn: item.nameEn,
                elementNameEn: a.nameEn,
                type: 1,
                edit: true,
                ratio: SameData ? SameData.ratio : ''
              })
            })
          }
        })
        this.fabricCompositionData._tableForm.dataSource = [...tempData]
        this.fabricCompositionDataResult = [...tempData]
        this.fabricCompositionPopOptions.formDatas.data = this.tempFabricCompositionData

        this.$set(this.fabricCompositionPopOptions, 'visible', false)
      },
      cancel: params => {
        this.$set(this.fabricCompositionPopOptions, 'visible', false)
      },
      close: () => {
        this.$set(this.fabricCompositionPopOptions, 'visible', false)
      },
      formDatas: {
        data: null
      },
      formOptions: {
      },
      content: {
        _radioView: {
          components: {
            radioView
          },
          componentsOptions: {
            change: (data) => {
              this.tempFabricCompositionData = data
            }
          }
        }
      }

    }
    return {
      fabricCompositionData,
      fabricCompositionPopOptions,
      fabricCompositionDataResult: []
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v) {
          const data = this.$utils.deepClone(v) || []
          data.forEach(item => {
            item.edit = this.isEdit
          })
          this.fabricCompositionData._tableForm.dataSource = data
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: function() {
      this.fabricCompositionData._tableForm.dataSource.forEach(item => {
        item.edit = this.isEdit
      })
    },
    'fabricCompositionDataResult': {
      handler(val) {
        this.syncMoudleDataHandle('fabricElement', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async  addFabricComposition() {
      // 提取所有成分，获取成分的对应单一成分以及分类，将所有成分根据分类数据重组，
      const tempData = []
      this.materialData.forEach(item => {
        if (item.naturalFiber) {
          item.naturalFiber.forEach(i => {
            i.element && tempData.push(i.element.value)
          })
        }
        if (item.chemicalFiber) {
          item.chemicalFiber.forEach(i => {
            i.element && tempData.push(i.element.value)
          })
        }
      })
      const data = await this.getFabricComposition({ uuids: Array.from(new Set(tempData)) })
      const resultData = []
      data.forEach(item => {
        item.ingredients.forEach(i => {
          const index = resultData.findIndex(a => a.uuid === i.classification.uuid)
          if (index !== -1) {
            resultData[index].ingredients.push({
              uuid: i.uuid,
              name: i.name,
              nameEn: i.nameEn
            })
          } else {
            resultData.push({
              name: i.classification.name,
              nameEn: i.classification.nameEn,
              uuid: i.classification.uuid,
              type: !this.findTypeIs2(i.classification.uuid) ? 1 : 2, // 根据返回的数据  确定是选择的成分分类还是单一成分
              ingredients: [{
                uuid: i.uuid,
                name: i.name,
                nameEn: i.nameEn
              }]
            })
          }
        })
      })
      this.fabricCompositionPopOptions.formDatas.data = resultData
      this.tempFabricCompositionData = resultData
      console.log(resultData, 'resultData')
      this.$set(this.fabricCompositionPopOptions, 'visible', true)
    },
    findTypeIs2(classificationUuid) {
      return !this.fabricCompositionData._tableForm.dataSource.length || !!this.fabricCompositionData._tableForm.dataSource.find(item => item.type === 2 && item.elementTypeInfo.value === classificationUuid)
    },
    getSameData(type, classificationUuid) {
      const resultData = this.fabricCompositionData._tableForm.dataSource.find(item => {
        return item.type === type && item.elementTypeInfo.value === classificationUuid
      })
      return resultData
    }
  }

}
</script>

<style lang="scss" scoped>
.order-items {
  background: #ffffff;
  .header-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;
    span {
      font-size: 16px;
      display: flex;
      // font-weight: 500;
    }
  }
  .page-table-border {
    margin: 0;
    /deep/ .el-table--mini{
      font-size: 14px !important;
    }
    /deep/tbody .el-table__row td {
      border-bottom-width: 1px !important;
    }
     /deep/.el-table--mini th {
       height: 40px;
    }
  }
}
/deep/.el-dialog__body{
        padding:0 20px 20px;
  }
.material-datainfo{
  padding: 0 20px;
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-form-item__content {
    width: 100%;
  }
  /deep/.el-table tbody tr {
    height: 50px;
    line-height: 50px;
  }
}

.add-btn {
  width: 100%;
  border:1px solid #e6ebf5;
  border-top: 0;
  color: #0986FF;
  text-align: center;
  line-height: 40px;
  height: 40px;
  font-size: 14px;
  cursor: pointer;
}
</style>
