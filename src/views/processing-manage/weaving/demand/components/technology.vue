<template>
  <div id="technology" class="pd-technology">
    <cs-custom-form
      ref="formSearch"
      :data-source="dataSource"
      :options="options"
      :form-datas="formDatas"
    />
    <div class="pin-number">
      <div class="pin-title">
        <div class="pin-info">
          <span><i>*</i>排针图</span>
          <span>（代表符号：0 1 2 3 4 ）</span>
        </div>
        <div class="pin-table">
          <div class="pinTable-header">
            <ul>
              <li />
              <li v-for="(headerItem, index) in pinTableList" :key="index">
                {{ index + 1 }}
              </li>
            </ul>
          </div>
          <div class="pinTable-body">
            <ul v-for="(item, firstIndex) in stitchMap" :key="firstIndex">
              <li v-for="(items, secondIndex) in item" :key="secondIndex">
                <span v-if="secondIndex === 0">{{ items }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="pin-number">
      <div class="pin-title">
        <div class="pin-info">
          <span><i>*</i>排三角图</span>
          <span>（代表符号：1=[—]、2=[∩]、3=[∪]、4=[∧]、5=[∨]）</span>
        </div>
        <div class="triangle-table">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr v-if="triangleTableList && triangleTableList.length">
                <th />
                <th
                  v-for="(items, index) in triangleTableList"
                  :key="index"
                  class="tableHead"
                >
                  <span>{{ index + 1 }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="triangleMap.plateTop">
                <td :rowspan="triangleMap.plateTop.length || 0">上盘</td>
                <td
                  v-for="(item, index) in triangleMap.plateTop[0]"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </td>
              </tr>
              <tr v-if="triangleMap.plateTop && triangleMap.plateTop[1]">
                <td
                  v-for="(item, index) in triangleMap.plateTop[1]"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </td>
              </tr>
              <tr v-if="triangleMap.plateBottom">
                <td :rowspan="triangleMap.plateBottom.length || 0">下盘</td>
                <td
                  v-for="(item, index) in triangleMap.plateBottom[0]"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </td>
              </tr>
              <tr v-if="triangleMap.plateBottom && triangleMap.plateBottom[1]">
                <td
                  v-for="(item, index) in triangleMap.plateBottom[1]"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </td>
              </tr>
              <tr v-if="triangleMap.plateBottom && triangleMap.plateBottom[2]">
                <td
                  v-for="(item, index) in triangleMap.plateBottom[2]"
                  :key="index"
                >
                  <span>{{ item }}</span>
                </td>
              </tr>
              <tr>
                <template
                  v-if="triangleMap.plateBottom && triangleMap.plateBottom[3]"
                >
                  <td
                    v-for="(item, index) in triangleMap.plateBottom[3]"
                    :key="index"
                  >
                    <span>{{ item }}</span>
                  </td>
                </template>
              </tr>
              <tr>
                <td>排纱</td>
                <template v-if="triangleMap.yarnRow && triangleMap.yarnRow[0]">
                  <td
                    v-for="(item, index) in triangleMap.yarnRow[0]"
                    :key="index"
                  >
                    <span class="word-break">{{ item }}</span>
                  </td>
                </template>
              </tr>
              <tr>
                <td>循环次数</td>
                <template
                  v-if="
                    triangleMap.cyclesDetails && triangleMap.cyclesDetails[0]
                  "
                >
                  <template
                    v-for="(item, index) in triangleMap.cyclesDetails[0]"
                  >
                    <td
                      v-if="tdShow(index)"
                      :key="index"
                      :colspan="getColspan(index)"
                    >
                      <span>{{ item.value }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as apiPub from '@/views/processing-manage/public/api/index.js'
import { isArray } from '@/utils/validate'
export default {
  data() {
    const itemStyle = {
      width: '20%'
    }
    const dataSource = {
      _custom: {
        prop: 'custom',
        itemType: 'itemview',
        label: '纱长',
        itemStyle
      },
      _stitchType: {
        prop: 'stitchType',
        itemType: 'itemview',
        label: '类型',
        itemStyle
      },
      _stitchNum: {
        prop: 'stitchNum',
        itemType: 'itemview',
        label: '针寸数',
        itemStyle
      },
      _totalStitchNum: {
        prop: 'totalStitchNum',
        itemType: 'itemview',
        label: '总针数',
        itemStyle
      }
    }
    return {
      dataSource,
      options: {
        inline: true,
        className: 'msg-content'
      },
      formDatas: {},
      pinTableList: {},
      triangleMap: {},
      triangleTableList: [],
      allSelectCyclesIndex: [],
      stitchMap: []
    }
  },
  computed: {
    tdShow() {
      return function(index) {
        if (this.allSelectCyclesIndex.includes(index)) {
          return false
        } else {
          return true
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    getColspan(index) {
      if (
        this.triangleMap.cyclesDetails &&
        this.triangleMap.cyclesDetails.length
      ) {
        if (this.triangleMap.cyclesDetails[index]) {
          const colSpanNum =
            this.triangleMap.cyclesDetails[index].s1 -
            this.triangleMap.cyclesDetails[index].s0 +
            1
          return colSpanNum
        }
      }
    },
    async init() {
      const res = await apiPub.techController({
        techDetailId: this.$attrs.options.componentsOptions.id
      })
      if (res.code === 200) {
        // 排针
        this.formDatas = {
          stitchNum: res.data.stitchNum,
          stitchType: res.data.stitchType,
          totalStitchNum: res.data.totalStitchNum,
          // yarnLength: res.data.yarnLength
          custom: res.data.yarnLength + '  ' + res.data.yarnLengthUnit
        }

        var stitchMap = JSON.parse(res.data.stitchMap) || []
        const pinTopList = new Array(30).fill('')
        const pinBottomList = new Array(30).fill('')
        if (isArray(stitchMap) && stitchMap.length) {
          stitchMap[0].unshift('上针')
          stitchMap[1].unshift('下针')
        } else {
          stitchMap = [
            ['上针', ...pinTopList],
            ['下针', ...pinBottomList]
          ]
        }
        this.stitchMap = stitchMap
        if (stitchMap && stitchMap[0] && stitchMap[0].length) {
          this.pinTableList = new Array(stitchMap[0].length - 1).fill('')
        }
        // 排三角
        // const processFlow = JSON.parse(res.data.processFlow)
        var triangleMap = JSON.parse(res.data.triangleMap)
        // triangleMap.plateTop = triangleMap.plateTop || []
        // triangleMap.plateBottom = triangleMap.plateBottom || []
        this.triangleMap = this.dataHandle(triangleMap)
        this.triangleTableList = new Array(
          this.triangleMap.plateTop[0].length
        ).fill('')
      } else {
        this.$message({
          message: '工艺获取失败',
          type: 'error'
        })
      }
    },
    dataHandle(val) {
      if (val.cyclesDetails && val.cyclesDetails.length) {
        this.allSelectCyclesIndex = this.allSelectCyclesIndexHandle(val)
      } else {
        const len = val.cycles[0].length
        val.cyclesDetails = new Array(1).fill(new Array(len).fill(''))
      }
      return val
    },
    allSelectCyclesIndexHandle(val) {
      var arr = []
      val.cyclesDetails &&
        val.cyclesDetails.length &&
        val.cyclesDetails.forEach((n, index) => {
          if (n) {
            for (var i = n.s0; i < n.s1; i++) {
              arr.push(i)
            }
          }
        })
      return Array.from(new Set(arr))
    }
  }
}
</script>
<style  lang="scss">
.pd-technology {
  padding-left: 40px;
  .msg-content {
    border-bottom: 1px solid #e9eff2;
    .el-form-item__label {
      font-size: 14px;
      color: #888e9e;
    }
    .el-form-item__content {
      font-size: 14px;
      color: #151222;
    }
  }
}
</style>
<style scoped lang="scss">
.pd-technology {
  .pin-number {
    .pin-title {
      margin-top: 20px;
      margin-bottom: 15px;
      .pin-info {
        display: inline-block;
        span {
          font-size: 16px;
          color: #151222;
          i {
            color: red;
          }
        }
      }
    }
    .triangle-table {
      overflow-x: auto;
      margin: 14px 0 10px;
      table {
        font-size: 14px;
        text-align: center;
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        .tableHead {
          cursor: pointer;
        }
        tr {
          th,
          td {
            border-left: 1px solid #dfe6ec;
            border-top: 1px solid #dfe6ec;
            min-width: 36px;
            width: 36px;
            height: 30px;
            background: #ffffff;
            span {
              color: #000000;
            }
          }
          th:first-child {
            min-width: 80px;
          }
        }
      }
    }
    .pin-table {
      margin: 14px 0 10px;
      overflow-x: auto;
      .pinTable-header {
        ul {
          display: flex;
          border-left: 1px solid #dfe6ec;
          flex-direction: row;
          padding: 0;
          margin: 0;
          li {
            min-width: 36px;
            width: 36px;
            display: flex;
            font-size: 14px;
            font-weight: 600;
            height: 30px;
            line-height: 30px;
            list-style: none;
            justify-content: center;
            border-top: 1px solid #dfe6ec;
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
            background: #ffffff;
          }
          li:first-child {
            min-width: 80px;
          }
        }
      }
      .pinTable-body {
        ul {
          display: flex;
          border-left: 1px solid #dfe6ec;
          flex-direction: row;
          padding: 0;
          margin: 0;
          li {
            min-width: 36px;
            width: 36px;
            display: flex;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            list-style: none;
            justify-content: center;
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
            background: #ffffff;
            input {
              width: 30px;
              width: 100%;
              height: 100%;
              text-align: center;
              border: 0;
              color: rgba(95, 97, 101, 1);
              background: transparent;
            }
          }
          li:first-child {
            min-width: 80px;
          }
        }
      }
    }
  }
}
</style>
