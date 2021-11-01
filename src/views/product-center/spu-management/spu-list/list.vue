<!--
 * @Author: Sanmao
 * @Date: 2020-09-27 16:05:02
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-26 11:37:20
 * @Descripttion: spu管理列表
-->
<template>
  <div class="product-list-content spu-list">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <!-- <search ref="searchForm" :data-source="searchData" /> -->
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <div class="button">
      <!-- <a id="downloadId" target="_self" /> -->
      <el-button
        v-permission="['catalog:Api:Spu:ProductSpu:store']"
        type="primary"
        size="small"
        @click="addSpu"
      >新增</el-button>
      <el-button
        v-permission="['catalog:Api:Spu:ProductSpu:import']"
        size="small"
        @click="importOrder"
      >批量导入</el-button>
      <el-button
        v-permission="['catalog:Api:Spu:ProductSpu:export']"
        size="small"
        :loading="exportLoadingFlag"
        @click="exportList"
      >批量导出</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :operates="popOperates"
        :class="{ 'list-end': !dataSource.length }"
        table-scrollx
      />
    </div>
    <!-- <dialogs :options="dialogOptions" :form-otions="formOtions" /> -->
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>
<script>
import logMethods from '@/views/product-center/mixin/log-methods.js'
import configData from '@/views/product-center/configDock/index.js'
import { debounce } from '@/utils'
import { publicSelectList, finishedFabric } from '../../api'
import {
  pageList,
  spuDestory,
  specialTecHList,
  clothCategoryList,
  zhuIngredientsList,
  ciIngredientsList,
  dyePrintTypeList,
  clothMaterialList,
  spuExport
} from './api'
export default {
  name: 'SpuManagementList',
  // components: {
  //   dialogs
  // },
  mixins: [logMethods],
  data() {
    // 公共弹出框内容
    const content = [
      {
        prop: 'clothMaterial',
        itemType: 'input',
        label: '面料大类:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'fabricCat',
        itemType: 'input',
        label: '布种大类:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'mainIngredients',
        itemType: 'input',
        label: '主成分:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'minorIngredients',
        itemType: 'input',
        label: '次成分:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'bdMainYarn',
        itemType: 'input',
        label: '主纱支/密度:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'fabricWeight',
        itemType: 'input',
        label: '克重:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'dyePrintType',
        itemType: 'input',
        label: '染整类型:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'materialQuality',
        itemType: 'input',
        label: '原料品质:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'beltloop',
        itemType: 'input',
        label: '毛圈:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'isCatchHair',
        itemType: 'input',
        label: '是否抓毛:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'isSuede',
        itemType: 'input',
        label: '是否磨毛:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'isBrushed',
        itemType: 'input',
        label: '是否刷毛:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'isPolarFleece',
        itemType: 'input',
        label: '是否摇粒:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'bdSpecialTechName',
        itemType: 'input',
        label: '特殊功能:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%',
          overflow: 'hidden',
          'text-overflow': 'ellipsis'
        }
      },
      {
        prop: 'handle',
        itemType: 'input',
        label: '手感:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'hairiness',
        itemType: 'input',
        label: '毛羽:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'updator',
        itemType: 'input',
        label: '更新人:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'operatedTime',
        itemType: 'input',
        label: '更新时间:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'dataSource',
        itemType: 'input',
        label: '数据来源:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      },
      {
        prop: 'sourceOrder',
        itemType: 'input',
        label: '来源单号:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '48%'
        }
      }
    ]
    // pop弹出框配置信息（处理）
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: 'SPU详情',
      width: '900px',
      // okText: '确认',
      cancelText: '关闭',
      cancel: params => {
        this.$set(this.popOptions, 'visible', false)
      },
      customClass: 'paymentPop',
      formOptions: {
        inline: true
      },
      content,
      formDatas: {}
      // ok: params => {
      //   this.clickOk()
      // }

    }
    const columns = [
      // {
      //   prop: 'id',
      //   label: '序号',
      //   minWidth: '50',
      //   fixed: true,
      //   formater: (scope) => {
      //     return (
      //       this.pagination.page &&
      //       (this.pagination.page - 1) * 20 + scope.$index + 1
      //     )
      //   }
      // },
      {
        prop: 'code',
        label: 'SPU编码',
        minWidth: '120',
        fixed: true,
        showOverflowTooltip: true
      },
      {
        prop: 'clothMaterial',
        label: '面料大类',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.clothMaterial && scope.row.clothMaterial.name
            ? scope.row.clothMaterial.name
            : ''
        }
      },
      {
        prop: 'fabricCat',
        label: '布种大类',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.fabricCat && scope.row.fabricCat.name
            ? scope.row.fabricCat.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'mainIngredients',
        label: '主成分',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.mainIngredients && scope.row.mainIngredients.name
            ? scope.row.mainIngredients.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'bdMainYarn',
        label: '主纱支/细度',
        minWidth: '100',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.bdMainYarn
            ? scope.row.bdMainYarn +
            (scope.row.bdMainYarnUnit === 1
              ? 'S'
              : scope.row.bdMainYarnUnit === 2
                ? 'N'
                : 'D')
            : ''
        }
      },
      {
        prop: 'minorIngredients',
        label: '次成分',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.minorIngredients && scope.row.minorIngredients.name
            ? scope.row.minorIngredients.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'fabricWeight',
        label: '克重(g/m²)',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.fabricWeight ? scope.row.fabricWeight : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'dyePrintType',
        label: '染整类型',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.dyePrintType && scope.row.dyePrintType.name
            ? scope.row.dyePrintType.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'materialQuality',
        label: '原料品质',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.materialQuality && scope.row.materialQuality.name
            ? scope.row.materialQuality.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'beltloop',
        label: '毛圈',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.beltloop && scope.row.beltloop.name
            ? scope.row.beltloop.name
            : ''
        }
      },
      {
        prop: 'isCatchHair',
        label: '是否抓毛',
        minWidth: '100',
        formater: (scope) => {
          return scope.row
            ? scope.row.isCatchHair === 2
              ? '轻抓毛'
              : scope.row.isCatchHair === 3
                ? '重抓毛'
                : '无抓毛'
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'isSuede',
        label: '是否磨毛',
        minWidth: '100',
        formater: (scope) => {
          return scope.row
            ? scope.row.isSuede === 1
              ? '是'
              : scope.row.isSuede === 0
                ? '否'
                : ''
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'isBrushed',
        label: '是否刷毛',
        minWidth: '100',
        formater: (scope) => {
          return scope.row
            ? scope.row.isBrushed === 1
              ? '是'
              : scope.row.isBrushed === 0
                ? '否'
                : ''
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'isPolarFleece',
        label: '是否摇粒',
        minWidth: '100',
        formater: (scope) => {
          return scope.row
            ? scope.row.isPolarFleece === 1
              ? '是'
              : scope.row.isPolarFleece === 0
                ? '否'
                : ''
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '120',
        formater: (scope) => {
          let dataSourceName = ''
          switch (scope.row.dataSource) {
            case 1:
              dataSourceName = '产品目录库'
              break
            case 2:
              dataSourceName = '样板开发'
              break
            case 3:
              dataSourceName = '客户订单'
              break
            case 4:
              dataSourceName = '采购订单'
              break
            case 5:
              dataSourceName = '工艺总结'
              break
            default:
              dataSourceName = ''
          }
          return dataSourceName
        },
        showOverflowTooltip: true
      },
      {
        prop: 'sourceOrder',
        label: '来源单号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'specialTech',
        label: '特殊功能',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.bdSpecialTechName &&
            scope.row.bdSpecialTechName.length
            ? scope.row.bdSpecialTechName.join(' / ')
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'handle',
        label: '手感',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.handle && scope.row.handle.name
            ? scope.row.handle.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'hairiness',
        label: '毛羽',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.hairiness && scope.row.hairiness.name
            ? scope.row.hairiness.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'updator',
        label: '更新人',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.updator
            ? scope.row.updator.name
              ? scope.row.updator.name + '/' + scope.row.updator.realName
              : scope.row.updator.realName
            : scope.row.creator
              ? scope.row.creator.name
                ? scope.row.creator.name + '/' + scope.row.creator.realName
                : scope.row.creator.realName
              : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'operatedTime',
        label: '更新时间',
        minWidth: '140',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.operatedTime,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        showOverflowTooltip: true
      }
    ]
    // 搜索
    const searchData = [
      {
        prop: 'code',
        label: 'SPU编码:',
        placeholder: '请输入SPU编码',
        itemType: 'input',
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdClothMaterialUuid',
        label: '面料大类:',
        placeholder: '请选择面料大类',
        itemType: 'select',
        loading: true,
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('面料大类', 1)
          } else {
            this.setSelectData('面料大类', 1, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdFabricCatUuid',
        label: '布种大类:',
        placeholder: '请选择布种大类',
        itemType: 'select',
        loading: true,
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('布种大类', 2)
          } else {
            this.setSelectData('布种大类', 2, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdMainIngredientsUuid',
        label: '主成分:',
        placeholder: '请选择主成分',
        itemType: 'select',
        loading: true,
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('主成分', 3)
          } else {
            this.setSelectData('主成分', 3, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdMinorIngredientsUuid',
        label: '次成分:',
        placeholder: '请选择次成分',
        itemType: 'select',
        loading: true,
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('次成分', 4)
          } else {
            this.setSelectData('次成分', 4, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdDyePrintTypeUuid',
        label: '染整类型:',
        placeholder: '请选择染整类型',
        itemType: 'select',
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('染整类型', 5)
          } else {
            this.setSelectData('染整类型', 5, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdMaterialQualityUuid',
        label: '原料品质:',
        placeholder: '请选择原料品质',
        itemType: 'select',
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('原料品质', 6)
          } else {
            this.setSelectData('原料品质', 6, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'specialTech',
        label: '特殊功能:',
        placeholder: '请选择特殊功能',
        itemType: 'select',
        multiple: true,
        loading: true,
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('特殊功能', 7)
          } else {
            this.setSelectData('特殊功能', 7, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      // {
      //   label: '克重:',
      //   prop: 'fabricWeightTop-fabricWeightEnd',
      //   components: { searchInput },
      //   componentsOptions: {
      //     value: {
      //       fabricWeightTop: '',
      //       fabricWeightEnd: ''
      //     },
      //     textAlign: 'right',
      //     reset: false
      //   }
      // },
      {
        prop: 'fabricWeightTop',
        itemType: 'input',
        label: '克重:',
        itemStyle: { width: '19.3%' }
      },
      {
        prop: 'fabricWeightEnd',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '15.33%', marginLeft: '-1.3%' }
      },
      {
        prop: 'isCatchHair',
        label: '是否抓毛:',
        placeholder: '请选择是否抓毛',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '轻抓毛',
            value: '2'
          },
          {
            label: '重抓毛',
            value: '3'
          },
          {
            label: '无抓毛',
            value: '1'
          }
        ],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'isSuede',
        label: '是否磨毛:',
        placeholder: '请选择是否磨毛',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'isBrushed',
        label: '是否刷毛:',
        placeholder: '请选择是否刷毛',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'isPolarFleece',
        label: '是否摇粒:',
        placeholder: '请选择是否摇粒',
        itemType: 'select',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdHairinessUuid',
        label: '毛羽:',
        placeholder: '请选择毛羽',
        itemType: 'select',
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('毛羽', 14)
          } else {
            this.setSelectData('毛羽', 14, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'bdBeltloopUuid',
        label: '毛圈:',
        placeholder: '请选择毛圈',
        itemType: 'select',
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('毛圈', 15)
          } else {
            this.setSelectData('毛圈', 15, true)
          }
        },
        dataSource: [],
        itemStyle: { width: '33.33%' }
      },
      {
        prop: 'sourceOrder',
        label: '来源单号:',
        placeholder: '请输入来源单号',
        itemType: 'input',
        itemStyle: { width: '33.33%' }
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          // this.setSearchData()
          // this.getList()
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 10,
          page: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageSize: val, page: this.pagination.page || 1 })
        // this.setTableHeight()
      }
    }
    // 表头操作栏里dataSource的配置信息
    let dataList = [
      {
        label: '详情',
        style: { color: '##0986ff' },
        isShow: true,
        handle: async(params) => {
          const objs = { clothMaterial: params.row.clothMaterial && params.row.clothMaterial.name ? params.row.clothMaterial.name : '', // 面料大类
            fabricCat: params.row.fabricCat && params.row.fabricCat.name ? params.row.fabricCat.name : '', // 布种大类
            mainIngredients: params.row.mainIngredients && params.row.mainIngredients.name ? params.row.mainIngredients.name : '', // 主成分
            minorIngredients: params.row.minorIngredients && params.row.minorIngredients.name ? params.row.minorIngredients.name : '', // 次成分
            bdMainYarn: params.row.bdMainYarn ? params.row.bdMainYarn + (params.row.bdMainYarnUnit === 1 ? 'S' : params.row.bdMainYarnUnit === 2 ? 'N' : 'D') : '', // 主纱支/密度
            fabricWeight: params.row.fabricWeight ? params.row.fabricWeight + 'g/m²' : '', // 克重
            dyePrintType: params.row.dyePrintType && params.row.dyePrintType.name ? params.row.dyePrintType.name : '', // 染整类型
            materialQuality: params.row.materialQuality && params.row.materialQuality.name ? params.row.materialQuality.name : '', // 原料品质
            bdSpecialTechName: params.row.bdSpecialTechName && params.row.bdSpecialTechName.length ? params.row.bdSpecialTechName.join(' / ') : '', // 特殊功能
            handle: params.row.handle && params.row.handle.name ? params.row.handle.name : '', // 手感
            hairiness: params.row.hairiness && params.row.hairiness.name ? params.row.hairiness.name : '', // 毛羽
            beltloop: params.row.beltloop && params.row.beltloop.name ? params.row.beltloop.name : '', // 毛圈
            isCatchHair: params.row ? params.row.isCatchHair === 2 ? '轻抓毛' : params.row.isCatchHair === 3 ? '重抓毛' : '无抓毛' : '', // 是否抓毛
            isSuede: params.row ? params.row.isSuede === 1 ? '是' : params.row.isSuede === 0 ? '否' : '' : '', // 是否磨毛
            isBrushed: params.row ? params.row.isBrushed === 1 ? '是' : params.row.isBrushed === 0 ? '否' : '' : '', // 是否刷毛
            isPolarFleece: params.row ? params.row.isPolarFleece === 1 ? '是' : params.row.isPolarFleece === 0 ? '否' : '' : '', // 是否摇粒
            updator: params.row.updator ? params.row.updator.name ? params.row.updator.name + '/' + params.row.updator.realName : params.row.updator.realName : params.row.creator ? params.row.creator.name ? params.row.creator.name + '/' + params.row.creator.realName : params.row.creator.realName : '', // 更新人
            operatedTime: this.$filters.parseTime(params.row.operatedTime, '{y}-{m}-{d} {h}:{i}'), // 更新时间
            dataSource: params.row.dataSource === 1 ? '产品目录库' : (params.row.dataSource === 2 ? '样板开发' : params.row.dataSource === 3 ? '客户订单' : params.row.dataSource === 4 ? '采购订单' : params.row.dataSource === 5 ? '工艺总结' : ''), // 数据来源
            sourceOrder: params.row.sourceOrder } // 来源单号
          this.$set(this.popOptions, 'content', content)
          this.$set(this.popOptions, 'formDatas', objs)
          this.$set(this.popOptions, 'okHidden', true)
          // this.$set(this.popOptions, 'cancelHidden', true)
          this.PopDialogHandle()
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['catalog:Api:Spu:ProductSpu:destroy'],
        isShow: true,
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteData(params.row)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: dataList
    }
    return {
      columns,
      searchData,
      pagination,
      dataList,
      popOperates,
      popOptions,
      content,
      dataSource: [],
      formOtions: {
        inline: true,
        layout: true,
        size: 'small'
      },
      formDatas: {
        specialTech: []
      },
      searchFormDatas: {},
      exportLoadingFlag: false,
      isFirstEnter: false // 定义变量来判断是否第一次进入，默认false
    }
  },
  created() {
    this.getList()
    this.isFirstEnter = true
  },
  activated() {
    // console.log('来了-spuList', this.isFirstEnter)
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.getList()
  },
  deactivated() {
    // console.log('离开-spuList')
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle() {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    // 获取列表
    async getList(data = {}) {
      const res = await pageList({
        ...this.searchFormDatas,
        ...data
      })
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        page: res.data.page,
        pageSize: res.data.pageSize
      }
    },
    /**
     * @description 设置搜索范围输入框
     */
    setSearchData() {
      // this.$set(this.searchData[0]["componentsOptions"], "reset", true);
      this.searchData.forEach((ele) => {
        if (ele.componentsOptions && ele.componentsOptions.reset === false) {
          ele.componentsOptions.reset = true
        }
      })
    },
    /**
     * @description 进入添加spu页面
     */
    addSpu() {
      this.$router.push({ name: 'SpuManagementCreate' })
    },
    /**
     * @description 进入批量导入页面
     */
    importOrder() {
      this.$router.push({ name: 'SpuManagementImport' })
    },
    /**
     * @description 批量导出
     */
    exportList: debounce(
      function() {
        this.exportLoadingFlag = true
        spuExport({ ...this.searchFormDatas })
          .then((res) => {
            // console.log(res, 'res')
            location.href = res.data.url
            // return
            // const url = window.location.href.substring(4, 5)
            // if (url === 's') {
            //   location.href = 'https://' + res.data.url
            // } else {
            //   location.href = 'http://' + res.data.url
            // }
            // const a = document.getElementById('downloadId')
            // const a_href = document.createAttribute('href')
            // a_href.nodeValue = res.data.url
            // a.setAttributeNode(a_href)
            // const e = document.createEvent('MouseEvents')
            // e.initEvent('click', true, true)
            // a.dispatchEvent(e)
            // this.fetchLog(
            //   this.getLogMessages('EXPORT', `${configData.productRequestPrefix}/api/spu/export`),
            //   { ...this.searchFormDatas },
            //   JSON.stringify({
            //     beforeText: `在'产品目录库-SPU管理-SPU列表'批量导出成功`,
            //     beforeCode: { ...this.searchFormDatas }
            //   })
            // )
            this.exportLoadingFlag = false
          })
          .catch(() => {
            this.exportLoadingFlag = false
          })
      },
      300,
      true
    ),
    /**
     * @description 删除数据
     */
    async deleteData(row) {
      await spuDestory({ id: row.id })
      this.fetchLog(
        this.getLogMessages('DEL', `${configData.productRequestPrefix}/api/spu/destroy`),
        { id: row.id, code: row.code },
        JSON.stringify({
          beforeText: `在'产品目录库-SPU管理-SPU列表'删除一条记录`,
          beforeCode: { id: row.id, code: row.code }
        })
      )
      await this.getList({
        ...this.searchFormDatas,
        pageSize: this.pagination.pageSize,
        page: this.pagination.page
      })
    },

    /**
     * @description 请求下拉数据
     * @param (String) typeName:搜索字段名
     * @param (Number) index:搜索字段在searchData中的位置
     * @param (Boolean) init:是否是关闭下拉状态
     */
    async setSelectData(typeName, index, init = false) {
      if (init) {
        this.$set(this.searchData[index], 'dataSource', [])
        this.$set(this.searchData[index], 'loading', true)
      } else {
        let res = null
        switch (typeName) {
          case '面料大类':
            res = await clothMaterialList()
            break
          case '布种大类':
            res = await clothCategoryList()
            break
          case '主成分':
            res = await zhuIngredientsList()
            break
          case '次成分':
            res = await ciIngredientsList()
            break
          case '染整类型':
            res = await dyePrintTypeList()
            break
          case '特殊功能':
            res = await specialTecHList({ 'isSpecial': 'Y', 'level': 1 })
            break
          case '毛羽':
            res = await finishedFabric({ 'typical': 'MY' })
            break
          case '毛圈':
            res = await finishedFabric({ 'typical': 'MQ' })
            break
          case '原料品质':
            res = await publicSelectList({ 'categoryId': 3 })
            break
        }
        let data = []
        console.log(res, 'spu列表')
        if (res.data && res.data.list) {
          data = res.data.list.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        } else {
          data = res.data.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        }
        this.$set(this.searchData[index], 'dataSource', data)
        this.$set(this.searchData[index], 'loading', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.spu-list {
  .search /deep/ .custom-form .el-form--inline {
    & > :nth-child(10) {
      .el-form-item__label-wrap {
        margin-left: 3px !important;
      }
    }
  }
}
/deep/.pop .el-input__inner {
  border: 0;
}
/deep/.el-input--mini .el-input__inner {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-pagination .el-select .el-input {
    width: 100px;
    margin: 0 5px;
}
/deep/.el-input--mini .el-input__inner {
  width: 100px;
}
/deep/.pop .el-input--mini .el-input__inner {
  width:100%;
}
/deep/.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
/deep/.pop .el-form-item__label-wrap .el-form-item__label {
  color: #888E9E;
}
/deep/.pop .el-input {
  color: #474747;
  font-size: 14px;
}
</style>
