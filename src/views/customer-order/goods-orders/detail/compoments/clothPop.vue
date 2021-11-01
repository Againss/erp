<!--
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-03-09 15:32:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-16 18:19:15
-->
<template>
  <el-dialog
    title="选择色布/印花编码"
    :visible.sync="visible"
    :show="isVisible"
    top="5vh"
    width="1235px"
    @close="$emit('update:isVisible', false)"
  >
    <!-- 搜索表单 -->
    <div class="search chooseSearch">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <cs-custom-table
      ref="inlineTable"
      tooltip-effect="light"
      :loading="loading"
      :columns="columns"
      :header-cell-style="headerCellStyle"
      :data-source="tableData"
      edit-type="inline"
      :highlight-current-row="true"
      :row-class-name="'heightRow'"
      :pagination="pagination"
      @selection-change="selectionChange"
      @row-click="rowClick"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="ClothSave">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'ClothPop',
  mixins: [PublicCustomer],
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array
    },
    columns: {
      type: Object
    },
    savePop: {
      type: Function
    },
    pagination: {
      type: Object
    },
    searchData: {
      type: Object
    },
    formDatas: {
      type: Object
    }
  },
  data() {
    // 查询表单配置信息
    // const searchData = {
    //   _cloth: {
    //     prop: 'cloth',
    //     itemType: 'select',
    //     itemStyle: { width: '25%' },
    //     label: '布类',
    //     clearable: true,
    //     filterable: true,
    //     className: 'commonRemoteSearch',
    //     placeholder: '输入文字模糊查询',
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getClothSelect()
    //       }
    //     },
    //     dataSource: []
    //   },
    //   _ingredient: {
    //     prop: 'ingredient',
    //     itemType: 'select',
    //     itemStyle: { width: '25%' },
    //     label: '成份',
    //     clearable: true,
    //     filterable: true,
    //     className: 'commonRemoteSearch',
    //     placeholder: '输入文字模糊查询',
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getCompositionSelect()
    //       }
    //     },
    //     dataSource: []
    //   },
    //   _yarn: {
    //     prop: 'yarn',
    //     itemType: 'select',
    //     itemStyle: { width: '25%' },
    //     label: '纱支/细度',
    //     clearable: true,
    //     filterable: true,
    //     className: 'commonRemoteSearch',
    //     placeholder: '输入文字模糊查询',
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getYarnSelect('combine')
    //       }
    //     },
    //     dataSource: []
    //   },
    //   _yarnCategory: {
    //     prop: 'yarnCategory',
    //     itemType: 'select',
    //     itemStyle: { width: '25%' },
    //     label: '纱类/丝类',
    //     clearable: true,
    //     filterable: true,
    //     className: 'commonRemoteSearch',
    //     placeholder: '输入文字模糊查询',
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         // console.log(value)
    //         this.getYarnTypeSelect('combine')
    //       }
    //     },
    //     dataSource: []
    //   },
    //   _suggestWidth: {
    //     prop: 'suggestWidth',
    //     itemType: 'input',
    //     itemStyle: { width: '25%' },
    //     clearable: true,
    //     label: '成品幅宽'
    //   },
    //   _suggestweight: {
    //     prop: 'suggestweight',
    //     itemType: 'input',
    //     itemStyle: { width: '25%' },
    //     clearable: true,
    //     label: '成品克重'
    //   },
    //   _dyeCraft: {
    //     prop: 'dyeCraft',
    //     itemType: 'input',
    //     itemStyle: { width: '25%' },
    //     clearable: true,
    //     label: '染整工艺'
    //   },
    //   _printCraft: {
    //     prop: 'printCraf',
    //     itemType: 'select',
    //     itemStyle: { width: '25%' },
    //     label: '印花工艺',
    //     clearable: true,
    //     filterable: true,
    //     className: 'commonRemoteSearch',
    //     placeholder: '输入文字模糊查询',
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getPrintCraftSelect()
    //       }
    //     },
    //     dataSource: []
    //   },
    //   _customerColor: {
    //     prop: 'customerColor',
    //     itemType: 'input',
    //     itemStyle: { width: '25%' },
    //     clearable: true,
    //     label: '客户颜色'
    //   },
    //   _operate: {
    //     itemType: 'operate',
    //     submitHandle: params => {
    //       console.log(params)
    //     },
    //     submitText: '查询',
    //     resetHandle: () => {
    //       console.log('重置')
    //     }
    //   }
    // }
    // 表格信息
    const orderColumns = {
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '色布/印花布编码',
        minWidth: '180'
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        width: '180',
        showOverflowTooltip: true
      },
      _ingredient: {
        prop: 'ingredient',
        label: '成份',
        width: '180',
        showOverflowTooltip: true
      },
      _yarn: {
        prop: 'yarn',
        label: '纱支/细度',
        width: '180',
        showOverflowTooltip: true
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        label: '纱类/丝类',
        width: '180',
        showOverflowTooltip: true
      },
      _suggestWidth: {
        prop: 'suggestWidth',
        label: '成品幅宽',
        width: '180',
        showOverflowTooltip: true
      },
      _suggestweight: {
        prop: 'suggestweight',
        label: '成品克重（g/m²）',
        width: '180',
        showOverflowTooltip: true
      },
      _dyeCraft: {
        prop: 'dyeCraft',
        label: '染整工艺',
        width: '180',
        showOverflowTooltip: true
      },
      _printCraft: {
        prop: 'printCraft',
        label: '印花工艺',
        width: '180',
        showOverflowTooltip: true
      },
      _colorValue: {
        prop: 'colorValue',
        label: '颜色预览',
        width: '180',
        showOverflowTooltip: true
      },
      _stripeSpacing: {
        prop: 'stripeSpacing',
        label: '条纹间距',
        width: '180',
        showOverflowTooltip: true
      },
      _clothk: {
        prop: 'clothk',
        label: '印花图案',
        width: '180',
        showOverflowTooltip: true
      }
    }
    const headerCellStyle = {
      'background': '#f5f7fa'
    }
    return {
      formOtions: {
        layout: true,
        size: 'small',
        inline: true
      },
      // formDatas: {},
      // searchData,
      orderColumns,
      headerCellStyle,
      visible: this.isVisible,
      chooseClothData: {}
      // pagination: {}
    }
  },
  watch: {
    isVisible() {
      this.visible = this.isVisible
    }
    // choosePagination: {
    //   handler(v) {
    //     if (v) {
    //       console.log(v)
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    console.log('choosePagination', this.choosePagination)
  },
  methods: {
    selectionChange(val) {
      console.log(val)
    },
    DialogSave() {
      console.log('save')
    },
    ClothSave() {
      console.log(this)
      this.savePop(this.chooseClothData)
      // this.$emit('clothsavePop', this.chooseClothData)
      this.chooseClothData = {}
    },
    rowClick(row) {
      if (row) {
        this.chooseClothData = row
      }
    },
    close() {
      console.log(111)
      this.visible = false
      // this.$emit('closepop')
    }
  }
}
</script>
<style lang='scss' scope>
.el-dialog__footer{
  text-align: center;
}
.chooseSearch {
  padding: 0;
}
</style>
