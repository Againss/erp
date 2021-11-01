<!--
 * @Author: xj
 * @Description:原料信息
 * @Date: 2021-04-18 10:20:39
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-27 17:34:27
 * @FilePath: d:\erp\src\views\customer-order\sample-orders\detail\compoments\material.vue
-->
<template>
  <!-- 原料信息 -->
  <div ref="materialList" class="order-items sample-order-items">
    <div class="header-top">
      <span style="font-weight: 400;">原料信息</span>
      <el-button
        v-if="isEdit&&getShowAddBtn"
        type="primary"
        size="mini"
        @click="addMaterialInfo"
      ><span style="font-size: 14px;">新增</span></el-button>
    </div>
    <div class="page-table page-table-border" style="padding: 0 10px;">
      <cs-custom-table
        ref="materialData"
        :header-cell-style="headerCellStyle"
        :columns="materialColumns"
        :data-source="materialData"
        :operates="materialOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 原料信息弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="materialPop" class="sample_materialPop" :options="materialPopOptions" />
    </div>
    <!-- 天然纤维弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="naturalFiberPop" :options="naturalFiberPopOptions" />
    </div>
    <!-- 化学纤维弹窗 -->
    <div class="pop">
      <cs-custom-pop
        ref="chemicalFiberPop"
        :options="chemicalFiberPopOptions"
      />
    </div>
  </div>
</template>

<script>
import popProportion from './pop-proportion'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'Materialcustom',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: [Object, Array]
    },
    syncMoudleDataHandle: {
      type: Function
    },
    rule: {
      type: Object,
      default: () => ({})
    },
    showAddBtn: {
      type: Boolean
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 原料信息列表
    const materialColumns = {
      _type: {
        prop: 'type',
        label: '类型',
        isShow: false
      },
      _yarn: {
        prop: 'yarn',
        label: '纱支/细度',
        className: 'yarn-class-name',
        formater: (scope) => {
          let html = '<div class="icon-itemtext" >'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<div :title="${this.funscope(v.yarn, 2)}">${this.funscope(v.yarn, 2)}</div>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<div  :title="${this.funscope(vm.fineness, 2)}">${this.funscope(vm.fineness, 2)}</div>`
          })
          html += '</div>'
          return html
        }
      },
      _element: {
        prop: 'element',
        label: '成份',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div  class="icon-itemtext">'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<p  :title="${this.funscope(v.element, 2)}">${this.funscope(v.element, 2)}</p>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<p  :title="${this.funscope(vm.element, 2)}">${this.funscope(vm.element, 2)}</p>`
          })
          html += '</div>'
          return html
        }
      },
      _elementRatio: {
        prop: 'elementRatio',
        label: '比例(%)',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div   class="icon-itemtext" >'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<p :title="${v.elementRatio || ''}">${v.elementRatio || ''}</p>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<p >&nbsp;&nbsp;&nbsp;&nbsp;</p>`
          })
          html += '</div>'
          return html
        }
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        label: '纱类/丝类',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div   class="icon-itemtext">'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<p class="borbottom">${this.funscope(v.yarnCategory, 2)}</p>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<p class="borbottom">${this.funscope(vm.wireCategory, 2)}</p>`
          })
          html += '</div>'
          return html
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.certificate && scope.row.certificate.label ? scope.row.certificate.label : ''
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        minWidth: '140',
        showOverflowTooltip: true,
        maxlength: 50,
        formater: (scope) => {
          return scope.row.supplierYarnCode || ''
        }
      }
    }
    // 原料信息操作栏
    const materialOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          const that = this
          that.tab = scope.row.type.toString()
          that.tabChange(this.tab)

          if (this.tab === '0') {
            const com = {
              ...scope.row.naturalFiber[0],
              'indexCode': scope.$index,
              'supplierYarnCode': scope.row.supplierYarnCode,
              'type': scope.row.type,
              'certificate': scope.row.certificate,
              materialId: scope.row.materialId || '',
              orderDetailId: scope.row.orderDetailId || '',
              orderId: scope.row.orderId || ''
            }
            this.ementRatioClick()
            this.naturalFiberData = [com]
            const naturaltData = this.naturalFiberPopOptions.content
            this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', this.naturalFiberData)
            const scopeRow = scope.row.naturalFiber[0]
            this.$set(naturaltData._yarn, 'dataSource', that.funscope(scopeRow.yarn))
            this.$set(naturaltData._element, 'dataSource', that.funscope(scopeRow.element)) // 成份 xw
            this.$set(naturaltData._yarnCategory, 'dataSource', that.funscope(scopeRow.yarnCategory))// 纱类
            this.$set(naturaltData._certificate, 'dataSource', that.funscope(scope.row.certificate)) // 证书要求
            this.isTian = true
            // this.encryptFn(this.naturalFiberContent, this.orderData['_rule'], 'edit')
            this.encryptFn(naturaltData, this.rule, 'edit')
            this.naturalFiberHandle('编辑天然纤维')
            this.setFormDatas(com, 'naturalFiber') // setFormDatas(params, type) {
          } else if (this.tab === '1') {
            const com = {
              ...scope.row.chemicalFiber[0],
              'indexCode': scope.$index,
              'materialId': scope.row.materialId || '',
              'orderDetailId': scope.row.orderDetailId || '',
              'orderId': scope.row.orderId || '',
              'supplierYarnCode': scope.row.supplierYarnCode,
              'type': scope.row.type || '1',
              'certificate': scope.row.certificate || null
            }
            this.chemicalFiberData = [com]
            const chemicaData = this.chemicalFiberPopOptions.content
            const chemica = scope.row.chemicalFiber[0]
            this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', this.chemicalFiberData)
            this.$set(chemicaData._fineness, 'dataSource', that.funscope(chemica.fineness))// 细度
            this.$set(chemicaData._element, 'dataSource', that.funscope(chemica.element))// 成份
            this.$set(chemicaData._wireCategory, 'dataSource', that.funscope(chemica.wireCategory))// 丝类
            this.$set(chemicaData._certificate, 'dataSource', that.funscope(scope.row.certificate)) // 证书要求
            this.isHuan = true
            // this.encryptFn(this.chemicalFiberContent, this.orderData['_rule'], 'edit')
            this.encryptFn(chemicaData, this.rule, 'edit')
            this.chemicalFiberHandle('编辑化学纤维')
            this.setFormDatas(com, 'chemicalFiber')
          } else if (this.tab === '2') {
            const materia = this.materialPopOptions.formDatas
            that.materialHandle('编辑组合纱线')
            const materData = that.materialContent
            that.$set(materData._materialTabs, 'isShow', false)
            const indexdata = that.materialData[scope.$index]
            that.naturalFiberCombineData = JSON.parse(JSON.stringify(indexdata.naturalFiber))
            that.chemicalFiberCombineData = JSON.parse(JSON.stringify(indexdata.chemicalFiber))
            this.$set(materData._certificateCombine, 'dataSource', that.funscope(scope.row.certificate))
            this.$set(materia, 'supplierYarnCodeCombine', scope.row.supplierYarnCode)
            this.$set(materia, 'certificateCombine', scope.row.certificate && scope.row.certificate.label ? scope.row.certificate : null)
            this.$set(materData._naturalCombineTableForm, 'dataSource', that.naturalFiberCombineData || [])
            this.$set(materData._chemicalCombineTableForm, 'dataSource', that.chemicalFiberCombineData || [])
            this.$set(materia, 'materialInfoCopy', scope.row.materialInfoCopy)
            this.$set(materia, 'materiaIndex', scope.$index)
            this.$set(materia, 'materialId', scope.row.materialId || '')
            this.$set(materia, 'orderDetailId', scope.row.orderDetailId || '')
            this.$set(materia, 'orderId', scope.row.orderId || '')
          }
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949', 'line-height': '24px' },
        handle: (scope) => {
          this.$confirm('确认删除该条原料信息数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.materialData.splice(scope.$index, 1)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const materialOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: materialOperatesData
    }
    // 天然纤维table表头
    const naturalFiberColumns = {
      _yarn: {
        prop: 'yarn',
        label: '纱支',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarn && scope.row.yarn.label ? scope.row.yarn.label : ''
        }
      },
      _element: {
        prop: 'element',
        label: '成份',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.element && scope.row.element.label ? scope.row.element.label : ''
        }
      },
      _elementRatio: {
        prop: 'elementRatio',
        label: '比例',
        showOverflowTooltip: true
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        label: '纱类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnCategory && scope.row.yarnCategory.label ? scope.row.yarnCategory.label : ''
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.certificate && scope.row.certificate.label ? scope.row.certificate.label : ''
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        maxlength: 50,
        minWidth: '140',
        showOverflowTooltip: true
      }
    }
    // 原料要求弹窗内容里面的化学
    const chemicalFiberOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          const that = this
          const chemData = this.chemicalFiberPopOptions.content
          this.chemicalFiberClick()
          if (this.tab !== '2') {
            this.$set(chemData._certificate, 'dataSource', that.funscope(scope.row.certificate)) // 证书要求
          }
          this.$set(chemData._fineness, 'dataSource', that.funscope(scope.row.fineness))// 细度
          this.$set(chemData._element, 'dataSource', that.funscope(scope.row.element))// 成份
          this.$set(chemData._wireCategory, 'dataSource', that.funscope(scope.row.wireCategory))// 丝类
          // this.encryptFn(this.chemicalFiberContent, this.orderData['_rule'], 'add')
          this.encryptFn(chemData, this.rule, 'add')
          this.chemicalFiberHandle('编辑化学纤维')
          this.isHuan = false
          this.setFormDatas({ ...scope.row, indexCode: scope.$index }, 'chemicalFiber')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条化学纤维数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              if (this.tab === '2') {
                this.chemicalFiberCombineData.splice(scope.$index, 1)
                this.chemicalFiberCombineData.forEach((item, index) => {
                  item.code = index + 1
                })
              } else {
                this.chemicalFiberData.splice(scope.$index, 1)
                this.chemicalFiberData.forEach((item, index) => {
                  item.code = index + 1
                })
              }
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const chemicalFiberOperates = {
      label: '操作',
      width: '120',
      dataSource: chemicalFiberOperatesData
    }
    // 天然纤维table数据源
    const naturalFiberData = []
    const naturalFiberOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          const naturapop = this.naturalFiberPopOptions.content // 天然弹窗
          // 显示天然和化学弹窗的隐藏列
          this.ementRatioClick()
          if (this.tab !== '2') {
            this.$set(naturapop._certificate, 'dataSource', this.funscope(scope.row.certificate)) // 证书要求
          }
          this.$set(naturapop._yarn, 'dataSource', this.funscope(scope.row.yarn)) // 纱支
          this.$set(naturapop._element, 'dataSource', this.funscope(scope.row.element)) // 成份
          this.$set(naturapop._yarnCategory, 'dataSource', this.funscope(scope.row.yarnCategory)) // 纱类
          // this.encryptFn(this.naturalFiberContent, this.orderData['_rule'], 'edit')
          this.encryptFn(naturapop, this.rule, 'edit')
          this.naturalFiberHandle('编辑天然纤维')
          this.isTian = false
          this.setFormDatas({ ...scope.row, indexCode: scope.$index }, 'naturalFiber')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949', 'line-height': '24px' },
        handle: scope => {
          this.$confirm('确认删除该条天然纤维数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              if (this.tab === '2') {
                this.naturalFiberCombineData.splice(scope.$index, 1)
                this.naturalFiberCombineData.forEach((item, index) => {
                  item.code = index + 1
                })
              } else {
                this.naturalFiberData.splice(scope.$index, 1)
                this.naturalFiberData.forEach((item, index) => {
                  item.code = index + 1
                })
              }
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const naturalFiberOperates = {
      label: '操作',
      width: '120',
      dataSource: naturalFiberOperatesData
    }
    // 化学纤维table表头
    const chemicalFiberColumns = {
      _fineness: {
        prop: 'fineness',
        label: '细度',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.fineness && scope.row.fineness.label ? scope.row.fineness.label : ''
        }
      },
      _element: {
        prop: 'element',
        label: '成份',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.element && scope.row.element.label ? scope.row.element.label : ''
        }
      },
      _wireCategory: {
        prop: 'wireCategory',
        label: '丝类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.wireCategory && scope.row.wireCategory.label ? scope.row.wireCategory.label : ''
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.certificate && scope.row.certificate.label ? scope.row.certificate.label : ''
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        maxlength: 50,
        minWidth: '140',
        showOverflowTooltip: true
      }
    }
    const chemicalFiberData = []
    // 组合的天然化学数据源
    const naturalFiberCombineData = []
    const chemicalFiberCombineData = []
    // 天然纤维弹窗内容
    const naturalFiberContent = {
      _yarn: {
        prop: 'yarn',
        itemType: 'select',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        itemStyle: { 'margin-right': '1px' },
        label: '纱支',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: value => {
          this.getYarnSelect('yarn')
        },
        dataSource: []
      },
      _element: {
        prop: 'element',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { 'margin-right': '1px' },
        label: '成份',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        change: (value, form, formDatas, setFormDatas) => {
          if (value.names && value.names.split('/').length > 1) {
            setFormDatas({ elementRatio: '' })
          } else {
            setFormDatas({ elementRatio: '100' })
          }
        },
        visibleChange: (value) => {
          if (value) {
            this.getCompositionSelect('naturalFiber')
          }
        },
        dataSource: []
      },
      _elementRatio: {
        prop: 'elementRatio',
        itemType: 'input',
        itemStyle: { 'margin-right': '1px' },
        label: '比例',
        kmIndex: this.tab,
        rules: [commonBlurReg],
        components: {
          popProportion
        },
        componentsOptions: {
          prop: 'elementRatio'
          // textType: this.tab+""
        },
        clearable: true
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { 'margin-right': '1px' },
        label: '纱类',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getYarnTypeSelect('yarn')
        },
        dataSource: []
      },
      _certificate: {
        prop: 'certificate',
        itemType: 'select',
        itemStyle: { 'margin-right': '1px' },
        label: '证书要求',
        clearable: true,
        filterable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'naturalFiber')
        },
        dataSource: []
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        itemType: 'input',
        itemStyle: { 'margin-right': '1px' },
        label: '供应商纱线编码',
        minWidth: '140',
        maxlength: 50,
        clearable: true
      }
    }
    // 天然纤维弹窗操作配置
    const naturalFiberPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增天然纤维',
      okText: '保存',
      ok: params => {
        if (this.naturalFiberPopOptions.title === '新增天然纤维') {
          if (this.tab === '2') {
            if (!this.naturalFiberCombineData) { this.naturalFiberCombineData = [] }
            this.naturalFiberCombineData.push({ ...params, code: this.naturalFiberCombineData.length + 1, type: '2' })
            this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', this.naturalFiberCombineData)
          } else {
            this.naturalFiberData.push({ ...params, code: this.naturalFiberData.length + 1, type: '0' })
            this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', this.naturalFiberData)
          }
        } else if (this.naturalFiberPopOptions.title === '编辑天然纤维') {
          const paramsData = {
            materialId: params.materialId || '',
            orderDetailId: params.orderDetailId || '',
            type: params.type || '0',
            orderId: params.orderId || '',
            certificate: params.certificate || null, // 证书要求ID
            supplierYarnCode: params.supplierYarnCode || '' // 供应商纱线编码
          }
          if (this.tab === '2') {
            paramsData.yarn = params.yarn || null
            paramsData.elementRatio = params.elementRatio || ''
            paramsData.element = params.element || null
            paramsData.yarnCategory = params.yarnCategory || null
            this.naturalFiberCombineData.splice(params.indexCode, 1, paramsData)
          } else {
            if (this.isTian) {
              paramsData.naturalFiber = [{ ...params }]
              paramsData.chemicalFiber = []
              this.materialData.splice(params.indexCode, 1, paramsData)
              this.isTian = false
            } else {
              paramsData.yarn = params.yarn || null
              paramsData.elementRatio = params.elementRatio || ''
              paramsData.element = params.element || null
              paramsData.yarnCategory = params.yarnCategory || null
            }
            this.naturalFiberData.splice(params.indexCode, 1, paramsData)
          }
        }
        this.naturalFiberHandle()
      },
      cancel: params => {
        this.naturalFiberHandle()
      },
      formDatas: {
        tab: this.tab
      },
      formOptions: {},
      content: { ...naturalFiberContent }
    }
    // 化学纤维弹窗内容
    const chemicalFiberContent = {
      _fineness: {
        prop: 'fineness',
        itemType: 'select',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '细度',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: value => {
          this.getYarnSelect('fineness')
        },
        dataSource: []
      },
      _element: {
        prop: 'element',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '成份',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getCompositionSelect('chemicalFiber')
          }
        },
        dataSource: []
      },
      _wireCategory: {
        prop: 'wireCategory',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '丝类',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getYarnTypeSelect('silk')
        },
        dataSource: []
      },
      _certificate: {
        prop: 'certificate',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '证书要求',
        clearable: true,
        filterable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'chemicalFiber')
        },
        dataSource: []
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '供应商纱线编码',
        minWidth: '140',
        maxlength: 50,
        clearable: true
      }
    }
    // 化学纤维弹窗操作配置
    const chemicalFiberPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增化学纤维',
      okText: '保存',
      ok: params => {
        if (this.chemicalFiberPopOptions.title === '新增化学纤维') {
          if (this.tab === '2') {
            if (!this.chemicalFiberCombineData) { this.chemicalFiberCombineData = [] }
            this.chemicalFiberCombineData.push({ ...params, code: this.chemicalFiberCombineData.length + 1, type: '2' })
            this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', this.chemicalFiberCombineData)
          } else {
            this.chemicalFiberData.push({ ...params, code: this.chemicalFiberData.length + 1, type: '1' })
            this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', this.chemicalFiberData)
          }
        } else if (this.chemicalFiberPopOptions.title === '编辑化学纤维') {
          const paramsData = {
            type: params.type || 0,
            materialId: params.materialId || '',
            orderDetailId: params.orderDetailId || '',
            orderId: params.orderId || '',
            indexCode: params.indexCode || 0,
            certificate: params.certificate || null, // 证书要求ID
            supplierYarnCode: params.supplierYarnCode || null // 供应商纱线编码
          }
          if (this.tab === '2') {
            paramsData.fineness = params.fineness || ''
            paramsData.element = params.element || ''
            paramsData.wireCategory = params.wireCategory || null
            this.chemicalFiberCombineData.splice(params.indexCode, 1, paramsData)
          } else {
            if (this.isHuan) {
              paramsData.naturalFiber = []
              paramsData.chemicalFiber = [{ ...params }]
              paramsData.indexCode = params.indexCode
              this.materialData.splice(params.indexCode, 1, paramsData)
              this.isHuan = false
            } else {
              paramsData.fineness = params.fineness || null
              paramsData.element = params.element || null
              paramsData.wireCategory = params.wireCategory || null
              paramsData.indexCode = params.indexCode
            }
            this.chemicalFiberData.splice(params.indexCode, 1, paramsData)
          }
        }
        this.chemicalFiberHandle()
      },
      cancel: params => {
        this.chemicalFiberHandle()
      },
      formDatas: {},
      formOptions: {},
      content: { ...chemicalFiberContent }
    }
    // 原料要求弹窗内容
    const materialContent = {
      _materialTabs: {
        prop: 'materialTabs',
        itemType: 'tabs',
        label: '',
        itemStyle: { 'margin-bottom': '10px' },
        labelWidth: '0',
        dataSource: [{
          label: '天然纤维',
          value: '0'
        }, {
          label: '化学纤维',
          value: '1'
        }, {
          label: '组合纱线',
          value: '2'
        }],
        change: (tab) => {
          this.tabChange(tab)
        }
      },
      _naturalFibeAdd: { // 天然纤维 新增
        itemType: 'itemview',
        label: '',
        itemStyle: { width: '100%', display: 'flex', 'flex-direction': 'row-reverse', 'margin-bottom': '16px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addNaturalFiber()
        }
      },
      _naturalFiberTableForm: {// 天然纤维table表头
        prop: 'naturalFiberTableForm',
        tooltipEffect: 'light',
        itemType: 'table-form',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: { ...naturalFiberColumns }, // 1509
        dataSource: naturalFiberData, // 1544
        operates: naturalFiberOperates // 1609
      },
      _chemicalFiberAdd: {
        itemType: 'itemview',
        label: '',
        isShow: false,
        itemStyle: { width: '100%', display: 'flex', 'flex-direction': 'row-reverse', 'margin-bottom': '16px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addChemicalFiber()
        }
      },
      _chemicalFiberTableForm: {// 化学纤维
        prop: 'chemicalFiberTableForm',
        tooltipEffect: 'light',
        itemType: 'table-form',
        isShow: false,
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: { ...chemicalFiberColumns },
        dataSource: chemicalFiberData,
        operates: chemicalFiberOperates
      },
      _certificateCombine: {
        prop: 'certificateCombine',
        itemType: 'select',
        itemStyle: { width: '33%', display: 'inline-block', 'margin-right': '20px', 'margin-bottom': '0' },
        label: '证书要求',
        labelWidth: '68px',
        isShow: false,
        clearable: true,
        valueType: 'object',
        // rules: [commonChangeReg],
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'combine')
        },
        dataSource: []
      },
      _supplierYarnCodeCombine: {
        prop: 'supplierYarnCodeCombine',
        itemType: 'input',
        itemStyle: { width: '33%', display: 'inline-block', 'margin-bottom': '0' },
        label: '供应商纱线编码',
        maxlength: 50,
        minWidth: '140',
        isShow: false,
        clearable: true
      },
      _naturalCombine: {
        itemType: 'view',
        text: '天然纤维',
        isShow: false,
        style: { width: '80%', 'padding': '16px 0', display: 'inline-block' }
      },
      _naturalCombineAdd: {
        itemType: 'itemview',
        label: '',
        isShow: false,
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addNaturalFiber()
        }
      },
      _naturalCombineTableForm: {
        prop: 'naturalCombineTableForm',
        tooltipEffect: 'light',
        itemType: 'table-form',
        isShow: false,
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: { ...naturalFiberColumns },
        dataSource: naturalFiberCombineData,
        operates: naturalFiberOperates
      },
      _chemicalCombine: {
        itemType: 'view',
        text: '化学纤维',
        isShow: false,
        style: { width: '80%', 'padding': '16px 0', display: 'inline-block' }
      },
      _chemicalCombineAdd: {
        itemType: 'itemview',
        label: '',
        isShow: false,
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addChemicalFiber()
        }
      },
      _chemicalCombineTableForm: {
        prop: 'chemicalCombineTableForm',
        tooltipEffect: 'light',
        itemType: 'table-form',
        isShow: false,
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: chemicalFiberColumns,
        dataSource: chemicalFiberCombineData,
        operates: chemicalFiberOperates
      }
    }
    // 原料要求弹窗操作配置
    const materialPopOptions = {
      itemType: 'drawer',
      size: '850px',
      visible: false,
      title: '新增原料信息',
      okText: '保存',
      ok: params => {
        if (this.materialPopOptions.title === '新增原料信息') {
          if (this.tab === '0') {
            if (!this.naturalFiberData || !this.naturalFiberData.length) {
              this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
              return false
            }
            this.RawMaterialExtraction(this.naturalFiberData, [], 0)
          } else if (this.tab === '1') {
            if (!this.chemicalFiberData || !this.chemicalFiberData.length) {
              this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
              return false
            }
            this.RawMaterialExtraction([], this.chemicalFiberData, 1)
          } else if (this.tab === '2') {
            if ((!this.naturalFiberCombineData || !this.naturalFiberCombineData.length) && (!this.chemicalFiberCombineData || !this.chemicalFiberCombineData.length)) {
              this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
              return false
            }
            this.$set(this.materialPopOptions.formDatas, 'supplierYarnCodeCombine', '')
            this.$set(this.materialPopOptions.formDatas, 'certificateCombine', '')
            this.naturalFiberCombineData.forEach((item) => {
              item.supplierYarnCode = params.supplierYarnCodeCombine || ''
              item.certificate = params.certificateCombine || ''
              item.type = '2'
            })
            this.chemicalFiberCombineData.forEach((item) => {
              item.supplierYarnCode = params.supplierYarnCodeCombine || ''
              item.certificate = params.certificateCombine || ''
              item.type = '2'
            })
            this.RawMaterialExtraction(this.naturalFiberCombineData, this.chemicalFiberCombineData, 2)
          }
        } else if (this.materialPopOptions.title === '编辑组合纱线') {
          if ((!params.naturalCombineTableForm || !params.naturalCombineTableForm.length) && (!params.chemicalCombineTableForm || !params.chemicalCombineTableForm.length)) {
            this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
            return false
          }
          const paramsData = {
            certificate: params.certificate || params.certificateCombine || [], supplierYarnCode: params.supplierYarnCodeCombine || '',
            naturalFiber: params.naturalCombineTableForm, chemicalFiber: params.chemicalCombineTableForm,
            type: params.type || '2',
            materialId: params.materialId || '', orderDetailId: params.orderDetailId || '', orderId: params.orderId || ''
          }
          this.materialData.splice(params.materiaIndex, 1, paramsData)
        }
        // 处理新增里类型错误
        this.materialHandle()
      },
      cancel: params => {
        this.materialHandle()
      },
      formDatas: {},
      formOptions: {},
      content: materialContent
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      materialContent, // 原料要求弹窗内容
      materialPopOptions, // 原料要求弹窗操作配置
      naturalFiberPopOptions, // 天然纤维操作配置
      naturalFiberContent, // 天然纤维弹窗内容
      naturalFiberColumns, // 天然纤维table表头
      chemicalFiberContent, // 化学纤维弹窗内容
      chemicalFiberPopOptions, // 化学纤维弹窗操作配置
      naturalFiberOperates,
      chemicalFiberOperatesData, // 化学纤维操作配置
      chemicalFiberOperates, // 原料要求弹窗==>化学纤维操作配置
      materialColumns, // 原料信息list字段
      materialData: [], // 原料信息list data
      materialOperates, // 原料信息list操作栏
      naturalFiberData,
      materialOperatesData,
      naturalFiberCombineData,
      chemicalFiberCombineData,
      pagination,
      tab: '0',
      isTian: false,
      isHuan: false,
      headerCellStyle
    }
  },
  computed: {
    getShowAddBtn() {
      return this.showAddBtn
    }
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        if (val) {
          this.editChange()
        } else {
          this.changeOptionStatus()
        }
      },
      deep: true,
      immediate: true
    },
    'materialData': {
      handler(val) {
        this.syncMoudleDataHandle('materialData', val)
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(v) {
        if (v) {
          this.materialData = this.$utils.deepClone(v)
        }
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) {},
      deep: true
    }
  },
  mounted() { },
  methods: {
    // 点击新增
    addMaterialInfo() {
      this.tab = '0'
      this.tabChange('0')
      this.clearmateria()
      const materialpop = this.materialPopOptions// 原料要求弹窗内容
      this.$set(materialpop.content._materialTabs, 'isShow', true)
      this.materialHandle('新增原料信息')
      this.$set(materialpop, 'content', this.materialContent)
      this.$set(materialpop, 'formDatas', {})
      this.$set(materialpop.formDatas, 'materialTabs', '0')
    },
    clearmateria(type = 0) { // 清空原料信息
      const materialpop = this.materialPopOptions.content// 原料要求弹窗内容
      // 清空天然和化学纤维table表头的数据源
      this.$set(materialpop._naturalFiberTableForm, 'dataSource', [])
      this.$set(materialpop._chemicalFiberTableForm, 'dataSource', [])
      // 清空组合天然和化学纤维table表头的数据源
      this.$set(materialpop._naturalCombineTableForm, 'dataSource', [])
      this.$set(materialpop._chemicalCombineTableForm, 'dataSource', [])
      if (!type) {
        this.naturalFiberData = []
        this.chemicalFiberData = []
        this.naturalFiberCombineData = []
        this.chemicalFiberCombineData = []
      }
    },
    // 点击页面切换
    tabChange(tab) {
      this.tab = tab
      const materData = this.materialContent
      const naturapop = this.naturalFiberPopOptions.content // 天然弹窗
      const chemicapop = this.chemicalFiberPopOptions.content// 化学弹窗
      const materialpop = this.materialPopOptions.content// 原料要求弹窗内容
      // 显示天然和化学弹窗的隐藏列
      const istype = tab !== '2'
      this.$set(naturapop._certificate, 'isShow', istype)
      this.$set(naturapop._supplierYarnCode, 'isShow', istype)
      this.$set(chemicapop._certificate, 'isShow', istype)
      this.$set(chemicapop._supplierYarnCode, 'isShow', istype)
      // 组合的是隐藏tab列的字段 证书和供应商
      this.$set(materData._naturalCombineTableForm.columns._certificate, 'isShow', istype)
      this.$set(materData._naturalCombineTableForm.columns._supplierYarnCode, 'isShow', istype)
      this.$set(materData._chemicalCombineTableForm.columns._certificate, 'isShow', istype)
      this.$set(materData._chemicalCombineTableForm.columns._supplierYarnCode, 'isShow', istype)
      // 组合纱线的组合字段显示
      this.$set(materialpop._naturalCombine, 'isShow', !istype)
      this.$set(materialpop._naturalCombineAdd, 'isShow', !istype)
      this.$set(materialpop._naturalCombineTableForm, 'isShow', !istype)
      this.$set(materialpop._chemicalCombine, 'isShow', !istype)
      this.$set(materialpop._chemicalCombineAdd, 'isShow', !istype)
      this.$set(materialpop._chemicalCombineTableForm, 'isShow', !istype)
      this.$set(materialpop._certificateCombine, 'isShow', !istype)
      this.$set(materialpop._supplierYarnCodeCombine, 'isShow', !istype)
      if (tab === '0') {
        // 原料信息弹窗的显示
        this.$set(materialpop._naturalFibeAdd, 'isShow', true)
        this.$set(materialpop._naturalFiberTableForm, 'isShow', true)
        this.$set(materialpop._chemicalFiberAdd, 'isShow', false)
        this.$set(materialpop._chemicalFiberTableForm, 'isShow', false)
      } else if (tab === '1') {
        this.$set(materialpop._naturalFibeAdd, 'isShow', false)
        this.$set(materialpop._naturalFiberTableForm, 'isShow', false)
        this.$set(materialpop._chemicalFiberAdd, 'isShow', true)
        this.$set(materialpop._chemicalFiberTableForm, 'isShow', true)
      } else if (tab === '2') {
        this.$set(materialpop._naturalFibeAdd, 'isShow', false)
        this.$set(materialpop._naturalFiberTableForm, 'isShow', false)
        this.$set(materialpop._chemicalFiberAdd, 'isShow', false)
        this.$set(materialpop._chemicalFiberTableForm, 'isShow', false)
      }
    },
    addNaturalFiber() { // 新增天然纤维
      // this.encryptFn(this.naturalFiberPopOptions.content, this.orderData['_rule'], 'add')
      this.encryptFn(this.naturalFiberPopOptions.content, this.rule, 'add')
      this.naturalFiberHandle('新增天然纤维')
      this.ementRatioClick()
      this.$set(this.naturalFiberPopOptions, 'formDatas', {})
    },
    addChemicalFiber() {
      this.chemicalFiberClick()// 化学弹窗
      this.chemicalFiberHandle('新增化学纤维')
      this.$set(this.chemicalFiberPopOptions, 'formDatas', {})
      // this.encryptFn(this.chemicalFiberPopOptions.content,this.orderData['_rule'],'add')
      this.encryptFn(this.chemicalFiberPopOptions.content, this.rule, 'add')
    },
    // 原料信息弹窗显隐
    materialHandle(val) {
      // 处理新增里类型错误 原料要求弹窗内容tab
      const matFrom = this.materialPopOptions// 原料要求弹窗内容
      const matformDatas = this.materialPopOptions.formDatas
      this.clearmateria(1)
      this.$set(matFrom, 'visible', !matFrom.visible)
      if (val) { this.$set(matFrom, 'title', val) }
      // 原料要求弹窗操作配置
      this.$set(matFrom.content._certificateCombine, 'dataSource', [])
      this.$set(matformDatas, 'supplierYarnCodeCombine', '')
      this.$set(matformDatas, 'certificateCombine', null)
      this.$set(matformDatas, 'materialInfoCopy', '')
      this.$set(matformDatas, 'materialId', '')
      this.$set(matformDatas, 'orderDetailId', '')
      this.$set(matformDatas, 'orderId', '')
    },
    // 天然纤维弹窗显隐
    naturalFiberHandle(val) {
      this.$set(this.naturalFiberPopOptions, 'visible', !this.naturalFiberPopOptions.visible)
      if (val) {
        this.$set(this.naturalFiberPopOptions, 'title', val)
      }
    },
    // 化学纤维弹窗显隐
    chemicalFiberHandle(val) {
      this.$set(this.chemicalFiberPopOptions, 'visible', !this.chemicalFiberPopOptions.visible)
      if (val) {
        this.$set(this.chemicalFiberPopOptions, 'title', val)
      }
    },

    naturalOne(data1, istype = 0) {
      const comArray = data1 || []
      const spu = []
      if (comArray.length) {
        comArray.forEach((item, index) => {
          const obm = { naturalFiber: [] }
          const omg = {}
          obm.type = '0'
          obm.materialId = item.materialId || ''
          obm.certificate = item.certificate || null
          obm.supplierYarnCode = item.supplierYarnCode || ''
          obm.orderDetailId = item.orderDetailId || ''
          obm.orderId = item.orderId || ''
          omg.yarn = item.yarn || ''
          omg.element = item.element || ''
          omg.elementRatio = item.elementRatio
          omg.yarnCategory = item.yarnCategory
          omg.naturalFiberId = item.naturalFiberId
          obm.naturalFiber.push(omg)
          obm.chemicalFiber = []
          if (istype) {
            spu.push(omg)
          } else {
            this.materialData.push(obm)
          }
        })
        if (istype) { return spu }
      }
    },
    chemiTwo(data2, istype = 0) {
      const comArray = data2 || []
      const spu = []
      if (comArray.length) {
        comArray.forEach((item, index) => {
          const obm = { chemicalFiber: [] }
          const omg = {}
          obm.type = '1'
          obm.orderDetailId = item.orderDetailId || ''
          obm.orderId = item.orderId || ''
          obm.certificate = item.certificate || null
          obm.supplierYarnCode = item.supplierYarnCode || ''
          omg.fineness = item.fineness || null
          omg.element = item.element || null
          omg.wireCategory = item.wireCategory || null
          omg.chemicalFiberId = item.chemicalFiberId || ''
          obm.chemicalFiber.push(omg)
          obm.naturalFiber = []
          if (istype) {
            spu.push(omg)
          } else {
            this.materialData.push(obm)
          }
        })
        if (istype) { return spu }
      }
    },
    // 原料信息提取
    RawMaterialExtraction(data1 = [], data2 = [], tim = 0) {
      if (tim === 0) { // 天然
        this.naturalOne(data1)
      } else if (tim === 1) {
        this.chemiTwo(data2)
      } else if (tim === 2) {
        if ((data1 && data1.length) || (data2 && data2.length)) {
          const that = this
          const cmCate = data1[0].certificate || data2[0].certificate || data1[0].certificateCombine || data2[0].certificateCombine
          const YarnCode = data1[0].supplierYarnCode || data2[0].supplierYarnCode
          const material = data1[0].materialId || data2[0].materialId
          const opm = {
            type: '2',
            certificate: cmCate,
            supplierYarnCode: YarnCode,
            materialId: material,
            chemicalFiber: that.chemiTwo(data2, 2) || [],
            naturalFiber: that.naturalOne(data1, 1) || []
          }
          this.materialData.push(opm)
        }
      }
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'naturalFiber') { // 证书要求
          this.$set(this.naturalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'chemicalFiber') { // 证书要求
          this.$set(this.chemicalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'combine') { // 证书要求
          this.$set(this.materialContent._certificateCombine, 'dataSource', res)
        }
      })
    },
    // 成份下拉
    getCompositionSelect(type) {
      if (type === 'naturalFiber') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(this.naturalFiberContent._element, 'dataSource', res)
        })
      } else if (type === 'chemicalFiber') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(this.chemicalFiberContent._element, 'dataSource', res)
        })
      }
    },
    // 纱支、细度下拉 type: yarn纱支 fineness细度 combine组合
    getYarnSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarn(GenericType).then(res => {
        if (GenericType.type === 'yarn') {
          this.$set(this.naturalFiberContent._yarn, 'dataSource', res)
        } else if (GenericType.type === 'fineness') {
          this.$set(this.chemicalFiberContent._fineness, 'dataSource', res)
        }
      })
    },
    // 纱类、丝类下拉 type: yarn纱类 silk丝类 combine组合
    getYarnTypeSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarnType(GenericType).then(res => {
        if (GenericType.type === 'yarn') {
          this.$set(this.naturalFiberContent._yarnCategory, 'dataSource', res)
        } else if (GenericType.type === 'silk') {
          this.$set(this.chemicalFiberContent._wireCategory, 'dataSource', res)
        }
      })
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'material') {
          this.$set(this.materialPopOptions, 'formDatas', params)
        } else if (type === 'naturalFiber') {
          this.$set(this.naturalFiberPopOptions, 'formDatas', params)
        } else if (type === 'chemicalFiber') {
          this.$set(this.chemicalFiberPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    editChange() {
      this.materialOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.materialOperatesData
      }
    },
    changeOptionStatus() {
      this.materialOperates = null
    },
    // 天然的比例显示样式
    ementRatioClick() {
      const naturapop = this.naturalFiberPopOptions.content // 天然弹窗
      const istype = this.tab !== '2'
      this.$set(naturapop._certificate, 'isShow', istype)
      this.$set(naturapop._supplierYarnCode, 'isShow', istype)
      this.$set(naturapop._elementRatio.componentsOptions, 'textType', (istype ? '0' : '2'))
    },
    chemicalFiberClick() { // 化学弹窗
      const chemi = this.chemicalFiberPopOptions.content
      const istype = this.tab !== '2'
      this.$set(chemi._certificate, 'isShow', istype)
      this.$set(chemi._supplierYarnCode, 'isShow', istype)
    },
    // xw
    funscope(data, type = '1') {
      if (data && data.value) {
        return type === '1' ? [data] : data.label
      } else {
        return type === '1' ? [] : ''
      }
    }

  }
}
</script>
<style lang="scss">
.sample-order-items{
  .icon-itemtext {
    // cursor: pointer;
    p{
      overflow: hidden;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      // margin:  10px 0;
    }
  }

}
.sample-detail{
  .yarn-class-name{
    // padding-left: 15px !important;
  }
}
</style>
<style lang="scss" scoped>
.order-items {
  padding: 0 10px;
  background: #ffffff;
  .header-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
     padding: 15px 10px;
    span {
      font-size: 16px;
      display: flex;
      font-weight: 400;
    }
    .el-button {
      display: flex;
      span {
        font-size: 14px;
      }
    }
    .left {
      display: flex;
      align-items: center;
      .title {
        margin-right: 40px;
      }
      .date-title {
        position: relative;
        .item-title::before {
          display: block;
          content: '*';
          position: absolute;
          left: -8px;
          color: #ff4444;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .total {
        margin: 0 80px;
      }
    }
  }
  .page-table {
    height: auto;
    padding: 0;
    border-bottom-width: 1px;
  }
  .icon-itemtext {
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    // font-size: 12px;
  }
  .borbottom{
    border-bottom: 1px solid #dfe6ec;
  }
  .page-table-border{
    /deep/tbody .el-table__row td{
      border-bottom-width: 1px!important;
      padding: 0!important ;
    }
  }
  .sample_materialPop{
    /deep/.has-gutter{
      background: #000;
      tr th{
        font-size:14px !important;
        height: 44px;
        color: #151222;
        font-weight: 400;
      }
    }
    /deep/.el-table__empty-text{
      font-size: 14px;
    }
  }
}
</style>
