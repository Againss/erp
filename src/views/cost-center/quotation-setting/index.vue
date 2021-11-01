<!--
 * @Descripttion: 报价设置
 * @Author: admin
 * @Date: 2021-07-08 14:57:39
 * @LastEditors: admin
 * @LastEditTime: 2021-07-22 13:54:14
-->
<template>
  <div class="quotation-setting list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative;margin-top:56px">
      <div class="button spe">
        <el-button
          v-permission="['costCenter:offer:batchSet']"
          size="small"
          type="primary"
          @click="submit"
        >批量设置</el-button>
      </div>
      <div>
        <!-- 列表 -->
        <div class="page-table">
          <cs-custom-table
            :key="activeName"
            :columns="columns"
            :table-scrollx="true"
            :data-source="dataSource"
            :pagination="pagination"
            :operates="popOperates"
            @selection-change="selectionResult"
          />
        </div>
      </div>
    </div>
    <!-- 设置弹框 -->
    <div class="pop-set">
      <cs-custom-pop :options="setPopBox" />
    </div>
  </div>
</template>

<script>
import * as api from './api/index'

export default {
  name: 'QuotationSetting',
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const itemStyle = { width: '33%' }
    const searchData = {
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '供应商名称',
        placeholder: '请输入供应商名称',
        clearable: true,
        itemStyle
      },

      _supplierTypeId: {
        prop: 'supplierTypeId',
        itemType: 'select',
        label: '供应商类型',
        clearable: true,
        itemStyle,
        dataSource: [
          {
            value: '10001',
            label: '染整厂'
          },
          {
            value: '10004',
            label: '印花厂'
          }
        ]
      },
      _offerType: {
        prop: 'offerType',
        itemType: 'select',
        label: '报价类型',
        clearable: true,
        itemStyle,
        dataSource: [
          {
            value: 1,
            label: '先确价再加工'
          },
          {
            value: 2,
            label: '边确价边加工'
          }
        ]
      },
      _setStatus: {
        prop: 'setStatus',
        itemType: 'select',
        label: '状态',
        clearable: true,
        itemStyle,
        dataSource: [
          {
            value: 0,
            label: '未设置'
          },
          {
            value: 1,
            label: '已设置'
          }
        ]
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.searchParams = {
            ...params
          }
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.init()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const searchFormDatas = {}
    const columns = {
      _selection: {
        prop: 'ids',
        type: 'selection',
        fixed: 'left',
        width: '35',
        selectable: (scope) => {
          // console.log(scope)
          // 拿待下单第一次选中的数据比对，同一供应商并且是已报价
          // return scope.status !== 2 && scope.status !== 3
          return true
        }
      },
      _index: {
        label: '序号',
        prop: 'index',
        minWidth: '50',
        formater: (scope) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        }
      },
      _supplierName: {
        prop: 'supplierName',
        label: '供应商名称',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _supplierAbbreviation: {
        prop: 'supplierAbbreviation',
        label: '供应商简称',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _supplierType: {
        prop: 'supplierType',
        label: '供应商类型',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _offerType: {
        prop: 'offerType',
        label: '报价类型',
        minWidth: '120',
        formater: (scope) => {
          if (scope.row.setStatus === 1) {
            return scope.row.offerType === 1 ? '先确价再加工' : scope.row.offerType === 2 ? '边确价边加工' : ''
          } else {
            return ''
          }
        }
      },
      _setStatus: {
        prop: 'setStatus',
        label: '状态',
        minWidth: '120',
        formater: (scope) => {
          // return this.getStatus(scope.row)
          return scope.row.setStatus === 0
            ? '<span style="color:#FF9214">未设置</span>'
            : '<span style="color:#00BCC5">已设置</span>'
        }

      }
    }
    const setPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '设置报价',
      okText: '保存',
      ok: params => {
        if (this.chooseResult.length !== 0) {
          const ids = []
          this.chooseResult && this.chooseResult.forEach((item) => {
            ids.push(item.id)
          })
          params.ids = ids
          this.editGroup(params)
        } else {
          // console.log(params)
          params.id = this.supplierId
          this.editOne(params)
        }
      },
      cancel: params => {
        this.$set(this.setPopBox.formDatas, 'offerType', null)
        this.$set(this.setPopBox, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: {
        _offerType: {
          prop: 'offerType',
          itemType: 'select',
          label: '报价类型',
          rules: commonBlurReg,
          dataSource: [
            {
              value: 1,
              label: '先确价再加工'
            },
            {
              value: 2,
              label: '边确价边加工'
            }
          ]
        }
      }
    }
    const popOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: 190,
      dataSource: [
        {
          label: '设置',
          permitTag: ['costCenter:offer:set'],
          isShow(scope) {
            return true
          // if (scope.row.status === 0) {
          //   return true
          // }
          // return false
          },
          handle: (scope) => {
            this.supplierId = scope.row.id || null
            this.$set(this.setPopBox.formDatas, 'offerType', scope.row.offerType)
            this.$set(this.setPopBox, 'visible', true)
          }
        }
      ]
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.init()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.init()
      }
    }
    return {
      searchParams: {},
      activeName: '1',
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas,
      dataSource: [],
      columns,
      pagination,
      popOperates,
      setPopBox,
      chooseResult: [],
      supplierId: null
    }
  },
  created() {
    this.init()
  },
  // activated() {
  //   this.init()
  // },
  methods: {

    selectionResult(result) {
      console.log(result, 'result')
      this.chooseResult = []
      this.chooseResult = result
    },

    submit() {
      // console.log('批量设置')
      if (!this.chooseResult.length) {
        this.$message({
          type: 'info',
          message: '请先选择供应商'
        })
        return
      }
      this.$set(this.setPopBox, 'visible', true)
    },

    // 获取列表操作
    async init() {
      const res = await api.list(this.searchParams, {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1
      })
      if (res.code === 200) {
        const listData = res.data.list || []
        this.dataSource = listData
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    // 批量设置保存
    async editGroup(data = {}) {
      const res = await api.batchSet(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.setPopBox, 'visible', false)
      this.$message.success('设置成功')
      this.init({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    },

    // 单个设置保存
    async editOne(data = {}) {
      const res = await api.set(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.setPopBox, 'visible', false)
      this.$message.success('设置成功')
      this.init({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/base.scss";
.quotation-setting {
  .el-tabs__nav-wrap {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-table-column--selection .cell {
  padding-left: 20px;
}
.quotation-setting {
  .button.spe {
    position: absolute;
    // right: 20px;
    top: -44px;
    z-index: 3;
  }
}
</style>

