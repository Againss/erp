<template>
  <div class="srm-main">
    <div class="srm-form">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="supplier-analyse">
      <cs-charts :option="supplierAnalyse" />
    </div>
    <div class="kinds-supplier-analyse">
      <!--  <cs-charts :option="kindsSupplierAnalyse" /> -->
    </div>
  </div>
</template>
<script>
import { PerformanceAnalysis } from './components/index'
export default {
  name: 'Index',
  mixins: [PerformanceAnalysis],
  data() {
    /* 供应商分析 */
    const supplierAnalyse = {
      title: {
        text: '供应商绩效分析',
        show: true,
        left: '36%'
      },
      tooltip: {
        axisPointer: {
          axis: 'auto',
          type: 'cross',
          label: {
            show: true
          }
        }
      },
      grid: {
        left: 50,
        right: 50,
        top: 60,
        bottom: 50
      },
      legend: {
        data: ['等级占比'],
        selectedMode: false,
        bottom: '0',
        textStyle: {
          color: '#333'
        },
        x: '42%'
      },
      xAxis: {
        data: ['A', 'B', 'C', 'D', 'E', 'F'],
        type: 'category',
        axisPointer: {
          show: true
        }
      },
      yAxis: [{
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value} %'
        },
        show: true
      }],
      series: [{
        name: '等级占比',
        barWidth: 35,
        type: 'bar',
        itemStyle: {
          color: ''
        },
        label: {
          show: true,
          position: ['10', '-15'],
          color: '#484848',
          fontSize: 12
        },
        data: [5, 20, 36, 10, 10, 20]
      }]
    }

    /* 各类供应商绩效分析 */
    const kindsSupplierAnalyse = {
      title: {
        text: '各类供应商绩效分析',
        show: true,
        left: '36%'
      },
      tooltip: {
        axisPointer: {
          axis: 'auto',
          type: 'cross',
          label: {
            show: true
          }
        }
      },
      grid: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
      },
      legend: {
        data: ['A', 'B', 'C', 'D'],
        bottom: '0',
        icon: 'roundRect',
        textStyle: {
          color: '#333'
        },
        x: '36%'
      },
      xAxis: {
        data: ['纱供应商', '成品供应商', '染料供应商', '织加供应商', '染加供应商', '印加供应商'],
        type: 'category',
        axisPointer: {
          show: true
        }
      },
      yAxis: [{
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value} %'
        },
        show: true
      }],
      series: [
        {
          name: 'A',
          type: 'bar',
          itemStyle: {
            color: ''
          },
          data: [39, 19, '', '', 55, 45]
        },
        {
          name: 'B',
          type: 'bar',
          itemStyle: {
            color: ''
          },
          data: [80, 12, 85, 36, 12, 20]
        },
        {
          name: 'C',
          type: 'bar',
          itemStyle: {
            color: ''
          },
          data: [30, 99, 52, 63, 55, 85]
        },
        {
          name: 'D',
          itemStyle: {
            color: ''
          },
          type: 'bar',
          data: [8, 60, '', 52, 12, 55]
        }]
    }

    /* 时间选择 */
    const pickerOptions = {
      disabledDate(time) {
        return time.getTime() > Date.now()
      }
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
      } ]*/
    }
    /* 搜索条件 */
    const searchData = [
      {
        prop: 'state1',
        labelWidth: '100px',
        style: { width: '185px' },
        itemType: 'select',
        label: '供应商类别',
        dataSource: [
          {
            value: '1',
            label: '纱供应商'
          },
          {
            value: '2',
            label: '成品供应商'
          },
          {
            value: '3',
            label: '织加工厂'
          },
          {
            value: '4',
            label: '染加工厂'
          }
        ]
      },
      {
        prop: 'state2',
        labelWidth: '100px',
        style: { width: '185px' },
        itemType: 'select',
        label: '供应商类型',
        dataSource: [
          {
            value: '1',
            label: '纱供应商'
          },
          {
            value: '2',
            label: '成品供应商'
          },
          {
            value: '3',
            label: '织加工厂'
          },
          {
            value: '4',
            label: '染加工厂'
          }
        ]
      },
      {
        prop: 'state3',
        labelWidth: '100px',
        style: { width: '185px' },
        itemType: 'select',
        label: '考核周期',
        dataSource: [
          {
            value: '1',
            label: '月'
          },
          {
            value: '2',
            label: '季'
          },
          {
            value: '3',
            label: '半年'
          },
          {
            value: '4',
            label: '年'
          }
        ]
      },
      {
        itemType: 'date',
        editable: false,
        labelWidth: '100px',
        style: { width: '185px' },
        prop: 'date',
        label: '考核时间',
        placeholder: '请选择',
        type: 'date',
        pickerOptions: pickerOptions,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd'
      },
      {
        prop: 'name',
        labelWidth: '100px',
        style: { width: '185px' },
        itemType: 'input',
        label: '考核结果'
      },
      {
        prop: 'state4',
        labelWidth: '100px',
        style: { width: '185px' },
        itemType: 'select',
        label: '所在市',
        dataSource: [
          {
            value: '1',
            label: '月'
          },
          {
            value: '2',
            label: '季'
          },
          {
            value: '3',
            label: '半年'
          },
          {
            value: '4',
            label: '年'
          }
        ]
      },
      {
        prop: 'state5',
        labelWidth: '100px',
        style: { width: '185px' },
        itemType: 'select',
        label: '所在市',
        dataSource: [
          {
            value: '1',
            label: '月'
          },
          {
            value: '2',
            label: '季'
          },
          {
            value: '3',
            label: '半年'
          },
          {
            value: '4',
            label: '年'
          }
        ]
      },
      {
        prop: 'state6',
        labelWidth: '100px',
        style: { width: '185px' },
        itemType: 'select',
        label: '所在区',
        dataSource: [
          {
            value: '1',
            label: '月'
          },
          {
            value: '2',
            label: '季'
          },
          {
            value: '3',
            label: '半年'
          },
          {
            value: '4',
            label: '年'
          }
        ]
      },
      {
        style: { width: '68px' },
        itemType: 'operate',
        submitHandle: params => {
          //  console.log(params)
        },
        submitText: '查询',
        resetHandle: () => {
          console.log('重置')
        }
      }
    ]
    return {
      searchFormDatas: { name: '' },
      searchData,
      formOtions: {
        inline: true
      },
      supplierAnalyse,
      kindsSupplierAnalyse
    }
  }
}
</script>
<style lang="scss" scoped>
.supplier-analyse {
  padding: 20px;
  height: 666px;
  width: 1000px;
}
.kinds-supplier-analyse {
  padding: 20px 20px 40px;
  height: 666px;
  width: 1000px;
}
</style>
