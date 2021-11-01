<template>
  <div class="srm-main" style="padding-bottom: 20px">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div v-if="supplierAnalyse" class="supplier-analyse">
      <cs-charts ref="supplierAnalyseCanvans" :option="supplierAnalyse" />
    </div>
    <div v-if="kindsSupplierAnalyse" class="kinds-supplier-analyse">
      <cs-charts
        ref="kindsSupplierAnalyseCanvans"
        :option="kindsSupplierAnalyse"
      />
    </div>
  </div>
</template>
<script>
import { PublicSrm } from '@/views/srm/public/index'
import { PerformanceAnalysis } from './components/index'
export default {
  name: 'Index',
  mixins: [PerformanceAnalysis, PublicSrm],
  data() {
    /* 时间选择 */
    /*  const pickerOptions = {
       disabledDate(time) {
         return time.getTime() > Date.now()
       } */
    /* ,
    shortcuts: [{
      text: '今天',
      onClick (picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick (picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick (picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    } ]
  }*/
    /* 搜索条件 */
    const searchData = [
      {
        prop: 'supplierCategory',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '供应商类别',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '服务',
            value: 1
          },
          {
            label: '采购',
            value: 0
          }
        ],
        change: (value, form, formDatsas, setFormDatas) => {
          this.getSupplierTypeList({ supplierCategory: value }).then((data) => {
            const supplierTypeList = this.converSupplierTypeList(data)
            if (supplierTypeList && supplierTypeList.length > 0) {
              setFormDatas({ supplierType: '' })
              this.$set(this.searchData[1], 'dataSource', [{ label: '', value: '' }].concat(supplierTypeList))
            }
          })
        }
      },
      {
        prop: 'supplierType',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '供应商类型',
        dataSource: []
      },
      {
        prop: 'assessmentPeriodType',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '考核周期',
        dataSource: [],
        change: async(value, form, formDatsas, setFormDatas) => {
          setFormDatas({ performanceNo: '' })
          if (this.period2noList.length > 0) {
            this.$set(this.searchData[3], 'dataSource', this.period2noList.find(it => (it.value === value))['data'])
          }
        }
      },
      {
        itemType: 'select',
        itemStyle: { width: '25%' },
        prop: 'performanceNo',
        label: '考核期数',
        placeholder: '请选择',
        dataSource: []
      },
      /*   {
          prop: 'name',
          labelWidth: '100px',
          style: { width: '185px' },
          itemType: 'input',
          label: '考核结果'
        }, */
      {
        prop: 'provinceCode',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所在省',
        dataSource: [],
        change: this.provinceChangeTwo
      },
      {
        prop: 'cityCode',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所在市',
        dataSource: [],
        change: this.cityChangeTwo
      },
      {
        prop: 'areaCode',
        itemStyle: { width: '25%' },
        itemType: 'select',
        label: '所在区',
        dataSource: []
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          // console.log(params)
          this.getSupplierAnalyseRankType(params)
          this.getSupplierPerformanceRank(params)
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    return {
      searchFormDatas: { name: '' },
      searchData,
      formOtions: {
        inline: true,
        layout: true,
        size: 'small'
      },
      supplierAnalyse: {},
      kindsSupplierAnalyse: {},
      supplierTypeList: [],
      period2noList: []
    }
  },
  created() {
    this.getAreaSearch({// 获取省市区列表
      params: {},
      provinceCode: '',
      cityCode: '',
      textsize: '供应商绩效分析'
    })
  }

}
</script>
<style lang="scss" scoped>
.supplier-analyse,
.kinds-supplier-analyse {
  background-color: #ffffff;
  height: 520px;
  width: 100%;
  margin-top: 15px;
}
.supplier-analyse {
  padding: 20px 0;
}
.kinds-supplier-analyse {
  padding: 20px 0 20px 0;
}
</style>
