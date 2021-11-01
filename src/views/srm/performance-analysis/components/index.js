import * as api from '../api/index'
export const PerformanceAnalysis = {
  created() {
    this.getSupplierPerformancePeriod2no({
      index: 2
    })
    /* 绩效考核分析-等级和供应商类型 */
    this.getSupplierAnalyseRankType()
    /* 绩效考核分析-等级 */
    this.getSupplierPerformanceRank()
  },
  methods: {
    async getSupplierAnalyseRankType(params = {}) {
      const res = await api.getSupplierAnalyseRankTypeData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        const seriesData = []
        // const xAxisLength = data.xAxisData.length
        // const clientWidth = this.$refs.kindsSupplierAnalyseCanvans.$el.clientWidth
        // const barWidth = defaultWidth / (xAxisLength * 2 / 4)
        // const dataZoom = []
        /* if (xAxisLength > 6) {
          dataZoom = [
            {
              type: 'slider',//图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100, //伸缩条结束位置（1-100），可以随时更改
              height: 20,
              handleSize: 20,
              bottom: 30,
              fillerColor: "#f5f5f5",
              backgroundColor: "#ddd"
            }
          ]
        } */
        if (data.seriesData && data.seriesData.length > 0) {
          data.seriesData.forEach((item, index) => {
            if (item) {
              seriesData.push({
                name: item.name,
                type: 'bar',
                barMaxWidth: '35px',
                barMinWidth: '4px',
                /*       barMinWidth: '5px',
                      barMaxWidth: '30px',
                      cursor: "pointer", */
                /*
                barCategoryGap: '0', */
                /* barWidth: '20%',
                 barMinWidth: '20%',
                 barMaxWidth: '30px',
                 */
                itemStyle: {
                  normal: {
                    opacity: 1,
                    color: () => {
                      const colorList = ['#0986FF', '#3A9EFF', '#6BB6FF', '#9DCFFF', '#CEE7FF', '#FFB7C7', '#FF8FA8', '#FF6587', '#FF3F69', '#FF1A4C', '#D7002F', '#A50024']
                      if (colorList[index]) {
                        return colorList[index]
                      }
                      return '#' + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
                    }
                  }
                },
                tooltip: {
                  formatter: (result) => {
                    return (`<div style='padding:0 6px;line-height:18px'>
                  <p>百分比：<span style='font-size:16px;'>${result.value}%</span></p>
                  <p>数量：${item.data[result.dataIndex]}</p >
                  <p>等级：${item.name}</p>
                  <p>类型：${result.name}</p>
                 </div>`)
                  }
                },
                label: {
                  show: false,
                  formatter: (result) => {
                    console.log('result', result)
                  },
                  position: ['0', '-15'],
                  color: '#484848',
                  fontSize: 12
                },
                data: item.percentData
              })
            }
          })
        }
        this.kindsSupplierAnalyse = {
          title: {
            text: '各类供应商绩效分析',
            show: true,
            /* textAlign: 'center', */
            left: '15px',
            textStyle: {
              show: true,
              color: '#151222',
              fontStyle: 'normal',
              fontWeight: '400'
            }
          },
          /*    dataZoom: dataZoom, */
          tooltip: {
            show: true,
            trigger: 'item',
            padding: 10,
            axisPointer: {
              axis: 'auto',
              type: 'cross',
              label: {
                show: true
              }
            }
          },
          grid: {
            top: '10%',
            left: '65px',
            right: '30px',
            height: 340,
            containLabel: false
          },
          legend: {
            padding: 10,
            itemGap: 10,
            itemWidth: 20,
            data: data.legendData,
            bottom: '0',
            icon: 'roundRect',
            textStyle: {
              color: '#333'
            },
            y: '92%',
            x: 'center'
          },
          axisLabel: {
            interval: 0
          },
          xAxis: {
            axisLabel: {
              margin: 20, // 距离
              interval: 0
              // rotate: 50,//倾斜度
            },
            show: true,
            name: '',
            data: data.xAxisData,
            type: 'category',
            axisPointer: {
              show: true
            }
          },
          yAxis: [{
            position: 'left',
            type: 'value',
            nameGap: 20,
            axisLabel: {
              show: true,
              interval: 'auto',
              /* formatter: (value) => {
                console.log("value", value);
              } */
              formatter: '{value}% '
            }
          }],
          series: seriesData
        }
        /*  this.kindsSupplierAnalyse = {
           title: {
             text: data.title || '',
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
             data: [...data.legendData],
             bottom: '0',
             icon: 'roundRect',
             textStyle: {
               color: '#333'
             },
             x: '36%'
           },
           xAxis: {
             data: [...data.xAxisData],
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
               formatter (result) {
                 console.log("yAxis result", result);
               }
             },
             show: true
           }],
           series: [...data.seriesData]
         } */
      }
    },
    async getSupplierPerformanceRank(params = {}) {
      const res = await api.getSupplierPerformanceRankData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        this.supplierAnalyse = {
          title: {
            text: data.title,
            left: '15px',
            textStyle: {
              show: true,
              color: '#151222',
              fontStyle: 'normal',
              fontWeight: '400'
            }
            /*             textAlign: 'center', */

          },
          tooltip: {
            show: true,
            trigger: 'item',
            padding: 10,
            axisPointer: {
              axis: 'auto',
              type: 'cross',
              label: {
                show: true
              }
            }
          },
          /*          dataZoom: [
                     {
                       type: 'slider',//图表下方的伸缩条
                       show: true, //是否显示
                       realtime: true, //拖动时，是否实时更新系列的视图
                       start: 5, //伸缩条开始位置（1-100），可以随时更改
                       end: 100, //伸缩条结束位置（1-100），可以随时更改
                       height: 20,
                       handleSize: 20,
                       bottom: 45,
                       fillerColor: "#ddd",
                       backgroundColor: "#f5f5f5"
                     }
                   ], */
          grid: {
            top: '10%',
            left: '65px',
            right: '30px',
            height: 350,
            containLabel: false
          },
          /*   legend: {
              data: data.legendData,
              selectedMode: false,
              bottom: '0',
              icon: 'roundRect',
              textStyle: {
                color: '#333'
              },
              x: '42%'
            }, */
          legend: {
            padding: 10,
            /* itemGap: 10,
              itemWidth: 20, */
            data: data.legendData,
            bottom: '10',
            icon: 'roundRect',
            textStyle: {
              color: '#333'
            },
            x: 'center',
            y: '94%'
          },
          xAxis: {
            axisLabel: {
              margin: 20,
              interval: 0
            },
            data: data.xAxisData,
            type: 'category',
            axisPointer: {
              show: true
            }
          },
          yAxis: [
            {
              position: 'left',
              type: 'value',
              /* data: [8, 5, 10, 3, 1, 1, 1, 1, 1, 13], */
              axisLabel: {
                show: true,
                interval: 'auto',
                /* formatter (value, index) {
                   console.log("value", value, "index", index)
                 } */
                formatter: '{value}% '
              },
              show: true
            }
          ],
          series: [{
            name: data.seriesName,
            barMaxWidth: '35px',
            barMinWidth: '4px',
            /*   barWidth: '30%', */
            /*

             barCategoryGap: '20px', */
            type: 'bar',
            itemStyle: {
              color: '#549FFF'
            },
            tooltip: {
              formatter: (result) => {
                return (`<div style='padding:0 5px;line-height:20px'>
                <p>数量：${data.seriesData[result.dataIndex]}</p>
                <p>百分比：${result.value}<span style='font-size:16px;'>%</span></p>
                <p>等级：${result.name}</p>
                </div>`)
              }
            },
            label: {
              show: true,
              formatter: (result) => {
                // console.log("value", value.dataIndex);
                return data.seriesData[result.dataIndex]
              },
              position: ['10', '-15'],
              color: '#484848',
              fontSize: 12
            },
            data: data.seriesPercentData
            /* data: [...data.seriesData] */
          }]
        } || {}
      }
    }
  }
}
