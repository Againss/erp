<template>
  <div class="computer-technology">
    <!-- 上机工艺详情 -->
    <div :class="isEdit === 'detail' ? 'technology-box' : 'edit-box'">
      <cs-custom-form
        ref="computerTechnologyForm"
        :data-source="infoDataSource"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <div class="pin-number">
      <div class="pin-title">
        <div class="pin-info">
          <span><i>*</i>排针图</span>
          <span>（代表符号：0 1 2 3 4 ）</span>
        </div>
        <div v-if="isEdit === 'edit'" class="clounm">
          <el-input
            ref="columnInput"
            v-model="order.column"
            oninput="value=value.replace(/[^\-?\d.]/g,'')"
            type="text"
            @blur="columnBlur"
          />列
        </div>
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
              <span v-if="isEdit === 'detail' || secondIndex === 0">{{
                items
              }}</span>
              <input
                v-else
                :key="secondIndex"
                class="pin"
                :value="items"
                type="text"
                @focus="focusInput($event, firstIndex, secondIndex)"
                @input="handleInput($event, firstIndex, secondIndex)"
                @keyup="handleKeyup($event, firstIndex, secondIndex)"
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="pin-number">
      <div class="pin-title">
        <div class="pin-info">
          <span><i>*</i>排三角图</span>
          <span>（代表符号：1=[—]、2=[∩]、3=[∪]、4=[∧]、5=[∨]）</span>
        </div>
        <div v-if="isEdit === 'edit'" class="clounm">
          <el-input
            ref="triangleInput"
            v-model="order.triangleColumn"
            oninput="value=value.replace(/[^\-?\d.]/g,'')"
            type="text"
            @blur="triangleBlur"
          />列
          <el-input
            v-model="order.cyclesNum"
            oninput="value=value.replace(/[^\-?\d.]/g,'')"
            type="text"
            :disabled="cyclesDisabled"
            @input="cyclesInput"
            @blur="cyclesBlur"
          />循环次数
          <el-button
            type="primary"
            size="mini"
            round
            @click="clearCycles"
          >清除循环</el-button>
        </div>
        <div v-if="isEdit === 'edit'" class="buttons">
          <el-button
            size="mini"
            round
            @click="handleCopy"
          >复制</el-button>
          <el-button
            size="mini"
            round
            @click="handlePaste"
          >粘贴</el-button>
        </div>
      </div>
      <div class="triangle-table">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th />
              <th
                v-for="(items, index) in triangleTableList"
                :key="index"
                class="tableHead"
                @click="selectColumn(index)"
              >
                <span>{{ index + 1 }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :rowspan="triangleMap.plateTop.length">上盘</td>
              <td v-for="(item, index) in triangleMap.plateTop[0]" :key="index">
                <span v-if="isEdit === 'detail'">{{ item }}</span>
                <input
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  :value="item"
                  :class="{
                    'select-copy-before': selectCopyBefore(0, index),
                    'select-copy-after': selectCopyAfter(0, index),
                  }"
                  type="text"
                  @input="triangleInput($event, 0, index)"
                  @focus="focusInput($event)"
                  @keyup="triangleKeyup($event, 0, index)"
                >
              </td>
            </tr>
            <tr>
              <td v-for="(item, index) in triangleMap.plateTop[1]" :key="index">
                <span v-if="isEdit === 'detail'">{{ item }}</span>
                <input
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  :value="item"
                  :class="{
                    'select-copy-before': selectCopyBefore(1, index),
                    'select-copy-after': selectCopyAfter(1, index),
                  }"
                  type="text"
                  @input="triangleInput($event, 1, index)"
                  @focus="focusInput($event)"
                  @keyup="triangleKeyup($event, 1, index)"
                >
              </td>
            </tr>
            <tr>
              <td :rowspan="triangleMap.plateBottom.length">下盘</td>
              <td
                v-for="(item, index) in triangleMap.plateBottom[0]"
                :key="index"
              >
                <span v-if="isEdit === 'detail'">{{ item }}</span>
                <input
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  :value="item"
                  :class="{
                    'select-copy-before': selectCopyBefore(2, index),
                    'select-copy-after': selectCopyAfter(2, index),
                  }"
                  type="text"
                  @input="triangleInput($event, 2, index)"
                  @focus="focusInput($event)"
                  @keyup="triangleKeyup($event, 2, index)"
                >
              </td>
            </tr>
            <tr>
              <td
                v-for="(item, index) in triangleMap.plateBottom[1]"
                :key="index"
              >
                <span v-if="isEdit === 'detail'">{{ item }}</span>
                <input
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  :value="item"
                  :class="{
                    'select-copy-before': selectCopyBefore(3, index),
                    'select-copy-after': selectCopyAfter(3, index),
                  }"
                  type="text"
                  @input="triangleInput($event, 3, index)"
                  @focus="focusInput($event)"
                  @keyup="triangleKeyup($event, 3, index)"
                >
              </td>
            </tr>
            <tr>
              <td
                v-for="(item, index) in triangleMap.plateBottom[2]"
                :key="index"
              >
                <span v-if="isEdit === 'detail'">{{ item }}</span>
                <input
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  :value="item"
                  :class="{
                    'select-copy-before': selectCopyBefore(4, index),
                    'select-copy-after': selectCopyAfter(4, index),
                  }"
                  type="text"
                  @input="triangleInput($event, 4, index)"
                  @focus="focusInput($event)"
                  @keyup="triangleKeyup($event, 4, index)"
                >
              </td>
            </tr>
            <tr>
              <td
                v-for="(item, index) in triangleMap.plateBottom[3]"
                :key="index"
              >
                <span v-if="isEdit === 'detail'">{{ item }}</span>
                <input
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  :value="item"
                  :class="{
                    'select-copy-before': selectCopyBefore(5, index),
                    'select-copy-after': selectCopyAfter(5, index),
                  }"
                  type="text"
                  @input="triangleInput($event, 5, index)"
                  @focus="focusInput($event)"
                  @keyup="triangleKeyup($event, 5, index)"
                >
              </td>
            </tr>
            <tr>
              <td>排纱</td>
              <td v-for="(item, index) in triangleMap.yarnRow[0]" :key="index">
                <span v-if="isEdit === 'detail'" class="word-break">{{ item }}</span>
                <!-- <input
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  maxlength="10"
                  :value="item"
                  type="text"
                  @input="triangleInput($event, 6, index)"
                  @focus="focusInput($event)"
                  @keyup="triangleKeyup($event, 6, index)"
                > -->
                <textarea
                  v-else
                  :key="index"
                  ref="triangle"
                  class="triangle"
                  maxlength="10"
                  :value="item"
                  :class="{
                    'select-copy-before': selectCopyBefore(6, index),
                    'select-copy-after': selectCopyAfter(6, index),
                  }"
                  @blur="yarnRowBlur($event, index)"
                  @keyup="triangleKeyup($event, 6, index)"
                />
              </td>
            </tr>
            <tr>
              <td>循环次数</td>
              <template v-for="(item, index) in triangleMap.cyclesDetails[0]">
                <td
                  v-if="tdShow(index)"
                  :key="index"
                  :colspan="getColspan(index)"
                >
                  <!-- <span v-if="isEdit === 'detail'">{{ item.value }}</span> -->
                  <span v-if="isEdit === 'detail'">{{ item.value }}</span>
                  <input
                    v-else
                    :key="index"
                    ref="triangle"
                    class="triangle triangleCycles"
                    :value="item.value"
                    :class="{
                      'select-colspan-before': selectCyclesBefore(index),
                    }"
                    readonly
                    type="text"
                    @input="cyclesInput($event, 7, index)"
                    @focus="focusInput($event)"
                    @keyup="triangleKeyup($event, 7, index)"
                    @click="selectCycles(index)"
                  >
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: String
    }
  },
  data() {
    const checkNum = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (this.isEdit === 'edit') {
        if (!value) {
          return callback(new Error('必填项不能为空'))
        } else if (value === 0 || !reg.test(value)) {
          return callback(new Error('请填写正整数'))
        } else if (value > 99) {
          return callback(new Error('最大值99'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          return callback(new Error('必填项不能为空'))
        } else if (parseFloat(value) === 0 || !reg.test(parseFloat(value))) {
          return callback(new Error('请填写正整数'))
        } else if (parseFloat(value) > 99) {
          return callback(new Error('最大值99'))
        } else {
          callback()
        }
      }
    }
    const checkTotal = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (this.isEdit === 'eidt') {
        if (!value) {
          return callback(new Error('必填项不能为空'))
        } else if (value === 0 || !reg.test(value)) {
          return callback(new Error('请填写正整数'))
        } else if (value > 9999) {
          return callback(new Error('最大值9999'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          return callback(new Error('必填项不能为空'))
        } else if (parseFloat(value) === 0 || !reg.test(parseFloat(value))) {
          return callback(new Error('请填写正整数'))
        } else if (parseFloat(value) > 9999) {
          return callback(new Error('最大值9999'))
        } else {
          callback()
        }
      }
    }
    // const checkPi = (rule, value, callback) => {
    //   const reg = /^[1-9]\d*$/
    //   if (this.isEdit === 'edit') {
    //     if (!value) {
    //       return callback(new Error('必填项不能为空'))
    //     } else if (value === 0 || !reg.test(value)) {
    //       return callback(new Error('请填写正整数'))
    //     } else if (value > 999) {
    //       return callback(new Error('最大值999'))
    //     } else {
    //       callback()
    //     }
    //   } else {
    //     if (!value) {
    //       return callback(new Error('必填项不能为空'))
    //     } else if (parseFloat(value) === 0 || !reg.test(parseFloat(value))) {
    //       return callback(new Error('请填写正整数'))
    //     } else if (parseFloat(value) > 999) {
    //       return callback(new Error('最大值999'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{0,1})?$/, message: '请输入最大3位整数或保留1位小数', trigger: ['blur'] })
    // 公用组件样式
    const style = {
      'width': '100%',
      'fontSize': '16px',
      'fontWeight': '600',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'margin-bottom': '20px',
      'padding': '20px 0 15px'
    }
    const infoDataSource = [
      {
        itemType: 'view',
        text: '上机工艺',
        style
      },
      {
        prop: 'stitchNum',
        itemType: 'input',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: '0', cursor: 'pointer' },
        style: { width: '50%' },
        label: '针数:',
        disabled: true,
        rules: [{ required: true, validator: checkNum, trigger: 'blur' }],
        readonly: true,
        dataSource: []
      },
      {
        prop: 'inch',
        itemType: 'input',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: '0', cursor: 'pointer' },
        style: { width: '50%' },
        label: '寸数:',
        disabled: true,
        rules: [{ required: true, validator: checkNum, trigger: 'blur' }],
        readonly: true,
        dataSource: []
      },
      {
        prop: 'totalStitchNum',
        itemType: 'input',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: '0', cursor: 'pointer' },
        style: { width: '50%' },
        label: '总针数:',
        disabled: true,
        rules: [{ required: true, validator: checkTotal, trigger: 'blur' }],
        readonly: true,
        dataSource: []
      },
      {
        prop: 'cpi',
        itemType: 'input',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: '0', cursor: 'pointer' },
        style: { width: '50%' },
        label: 'CPI:',
        disabled: true,
        rules: [max999Reg],
        readonly: true,
        dataSource: []
      },
      {
        prop: 'wpi',
        itemType: 'input',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: '0', cursor: 'pointer' },
        style: { width: '50%' },
        label: 'WPI:',
        disabled: true,
        rules: [max999Reg],
        readonly: true,
        dataSource: []
      }
    ]
    return {
      formOtions: {
        inline: true
      },
      infoDataSource,
      formDatas: {},
      startColspanIndex: null,
      order: {
        column: null,
        triangleColumn: null,
        cyclesNum: null
      },
      startPaste: -1,
      copyBefore: true,
      selectIndexSource: [],
      selectCyclesIndex: [],
      selectData: [],
      stitchMap: [],
      // triangleMap: [],
      // pinTableList: [],
      // triangleTableList: [],
      // pinTopList: [],
      // pinBottomList: [],
      triangleMap: {
        plateTop: new Array(2).fill(new Array(30).fill('')),
        plateBottom: new Array(4).fill(new Array(30).fill('')),
        yarnRow: new Array(1).fill(new Array(30).fill('')),
        cycles: new Array(1).fill(new Array(30).fill('')),
        cyclesDetails: new Array(1).fill(new Array(30).fill(''))
      },
      pinTableList: new Array(30).fill(''),
      triangleTableList: new Array(30).fill(''),
      pinTopList: new Array(30).fill(''),
      pinBottomList: new Array(30).fill(''),
      allSelectCyclesIndex: []
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
    },
    flag() {
      return this.formDatas.flag
    },
    cyclesDetails() {
      return this.triangleMap.cyclesDetails[0]
    },
    cyclesDisabled() {
      var tip = true
      if (this.selectCyclesIndex.length === 1) {
        return false
      } else if (this.selectCyclesIndex.length > 1) {
        /* eslint-disable */
        let arr = []
        for (var i = 0; i < this.selectCyclesIndex.length; i++) {
          let index = this.cyclesDetails.findIndex(j=>{return j.s1===this.selectCyclesIndex[i]})
          if(index!==-1){
            for(var k =this.cyclesDetails[index].s0;k<=this.cyclesDetails[index].s1;k++ ){
              arr.push(k)
            }
          }else{
            arr.push(this.selectCyclesIndex[i])
          }
        }
        /* eslint-disable */
        arr.sort((a, b) => { return a - b })
        for (var i = 0; i < arr.length; i++) {
          if(i > 0 && arr[i] !== arr[i - 1] + 1) {
            tip = true
            break
          } else { tip = false }
        }
      }
      return tip
    }
  },
  watch: {
    isEdit(n, o) {
      if (n === 'edit') {
        this.initData(1)
      } else {
        this.initData()
      }
    },
    flag() {
      if (this.$route.query.status === '1') {
        this.initData(1)
      } else {
        this.initData()
      }
    },
    triangleMap: {
      deep: true,
      handler(val) {
        if (val.cyclesDetails && val.cyclesDetails.length) {
          this.allSelectCyclesIndex = this.allSelectCyclesIndexHandle()
        } else {
          const len = val.cycles[0].length
          val.cyclesDetails = new Array(1).fill(new Array(len).fill(''))
        }
      }
    }
  },
  created() {
    // this.pinTopList.unshift('上针')
    // this.pinBottomList.unshift('下针')
    // this.stitchMap.push(this.pinTopList, this.pinBottomList)
  },
  methods: {
    initData(val) {
      if (val === 1) {
        this.infoDataSource.forEach((e) => {
          e.readonly = false
          e.disabled = false
        })
      } else {
        this.infoDataSource.forEach((e) => {
          e.readonly = true
          e.disabled = true
        })
      }
    },
    focusInput(e) {
      e.target.select()
    },
    yarnRowBlur(e, tIndex) {
      const newData = JSON.parse(JSON.stringify(this.triangleMap.yarnRow))
      newData[0][tIndex] = e.target.value
      this.$set(this.triangleMap, 'yarnRow', newData)
      // this.$set(this.triangleMap.yarnRow[0], tIndex, e.target.value)
    },
    cyclesInput(e, index, tIndex) {
      const newData = JSON.parse(JSON.stringify(this.triangleMap.cycles))
      newData[0][tIndex] = e.target.value
      this.$set(this.triangleMap, 'cycles', newData)
      // this.$set(this.triangleMap.cycles[0], tIndex, e.target.value)
      // this.$set(this.triangleMap.cyclesDetails[0], tIndex, { key: tIndex, value: e.target.value, s0: tIndex, s1: tIndex })
    },
    // 排三角输入替换值 index 第几行数据, tIndex 第几列数据
    triangleInput(e, index, tIndex) {
      const value = e.target.value
      let newValue = ''
      const nextInput =
        index * this.triangleMap.plateTop[0].length + tIndex + 1
      switch (value) {
        case '1':
          newValue = '—'
          break
        case '2': {
          newValue = '∩'
          break
        }
        case '3': {
          newValue = '∪'
          break
        }
        case '4': {
          newValue = '∧'
          break
        }
        case '5': {
          newValue = '∨'
          break
        }
        default:
          newValue = ''
          break
      }
      if (index === 0 || index === 1) {
        const newData = JSON.parse(JSON.stringify(this.triangleMap.plateTop))
        newData[index][tIndex] = newValue
        this.$set(this.triangleMap, 'plateTop', newData)
        document.querySelectorAll('.triangle')[nextInput].focus()
      } else if (index === 2 || index === 3 || index === 4 || index === 5) {
        const newData = JSON.parse(
          JSON.stringify(this.triangleMap.plateBottom)
        )
        newData[index - 2][tIndex] = newValue
        this.$set(this.triangleMap, 'plateBottom', newData)
        document.querySelectorAll('.triangle')[nextInput].focus()
      } else if (index === 6) {
        // this.$set(this.triangleMap.yarnRow[0], tIndex, e.target.value)
      } else if (index === 7) {
        // this.$set(this.triangleMap.cycles[0], tIndex, { key: tIndex, value: e.target.value })
        // this.$set(this.triangleMap.cycles[0], tIndex, e.target.value)
        // this.$set(this.triangleMap.cyclesDetails[0], tIndex, { key: tIndex, value: e.target.value, s0: tIndex, s1: tIndex })
      }
      document.querySelectorAll('.triangle')[nextInput - 1].value = newValue
      if (nextInput > document.querySelectorAll('.triangle').length - 1) {
        return
      }
    },
    // 排三角上下左右切换输入 index 第几行 tIndex 第几列
    triangleKeyup(e, index, tIndex) {
      let nextInput = 0
      let isThrough = false
      switch (e.keyCode) {
        // 左上右下
        case 37:
          if (tIndex === 0 && index !== 0) {
            // 第一列并且排除第一个
            index--
            tIndex = this.triangleMap.plateTop[0].length - 1
          } else if (tIndex !== 0) {
            // 排除了第一列
            tIndex--
          } else {
            return
          }
          isThrough = true
          break
        case 38:
          if (index !== 0) {
            // 排除第一行
            tIndex = tIndex - this.triangleMap.plateTop[0].length
          } else {
            return
          }
          isThrough = true
          break
        case 39:
          if (
            tIndex === this.triangleMap.plateTop[0].length - 1 &&
            index !== 7
          ) {
            // 最后一列并且排除最后一个
            index++
            tIndex = 1
          } else if (tIndex !== this.triangleMap.plateTop[0].length - 1) {
            // 排除最后一列
            tIndex++
          } else {
            return
          }
          isThrough = true
          break
        case 40:
          if (index !== 7) {
            // 排除最后一行
            tIndex = parseInt(tIndex) + this.triangleMap.plateTop[0].length
          } else {
            return
          }
          isThrough = true
          break
        default:
      }
      if (isThrough) {
        nextInput = index * this.triangleMap.plateTop[0].length + tIndex
        document.querySelectorAll('.triangle')[nextInput].focus()
      }
    },
    // 排针图输入替换值
    handleInput(e, index, tIndex) {
      const value = e.target.value
      let newValue = ''
      const nextInput = index * (this.stitchMap[0].length - 1) + tIndex
      switch (value) {
        case '0':
          newValue = '0'
          break
        case '1': {
          newValue = '1'
          break
        }
        case '2': {
          newValue = '2'
          break
        }
        case '3': {
          newValue = '3'
          break
        }
        case '4': {
          newValue = '4'
          break
        }
        default:
          newValue = ''
          break
      }
      this.$set(this.stitchMap[index], tIndex, newValue)
      document.querySelectorAll('.pin')[nextInput - 1].value = newValue
      if (nextInput > document.querySelectorAll('.pin').length - 1) {
        return
      }
      document.querySelectorAll('.pin')[nextInput].focus()
    },
    // 排针图上下左右切换输入 index 第几行 tIndex 第几列
    handleKeyup(e, index, tIndex) {
      let nextInput = 0
      let isThrough = false
      switch (e.keyCode) {
        // 左上右下
        case 37:
          if (tIndex === 1 && index !== 0) {
            // 第一列并且排除第一个
            index--
            tIndex = this.stitchMap[0].length - 1
          } else if (tIndex !== 1) {
            // 排除了第一列
            tIndex--
          } else {
            return
          }
          isThrough = true
          break
        case 38:
          if (index !== 0) {
            // 排除第一行
            tIndex = parseInt(tIndex - this.stitchMap[0].length) + 1
          } else {
            return
          }
          isThrough = true
          break
        case 39:
          if (tIndex === this.stitchMap[0].length - 1 && index !== 1) {
            // 最后一列并且排除最后一个
            index++
            tIndex = 1
          } else if (tIndex !== this.stitchMap[0].length - 1) {
            // 排除最后一列
            tIndex++
          } else {
            return
          }
          isThrough = true
          break
        case 40:
          if (index !== 1) {
            // 排除最后一行
            tIndex = parseInt(tIndex) + this.stitchMap[0].length - 1
          } else {
            return
          }
          isThrough = true
          break
        default:
      }
      if (isThrough) {
        nextInput = index * (this.stitchMap[0].length - 1) + tIndex
        document.querySelectorAll('.pin')[nextInput - 1].focus()
      }
    },
    // 排针图输入数字增加列
    columnBlur(e) {
      if (!e.target.value) {
        return
      }
      if (e.target.value && (e.target.value > 100 || e.target.value < 30)) {
        this.order.column = null
        const columnInputEl = this.$refs.columnInput
        columnInputEl.focus()
        return
      }
      if (e.target.value >= this.pinTableList.length) {
        this.pinTableList = this.pinTableList.concat(
          new Array(e.target.value - this.pinTableList.length).fill('')
        )
        this.stitchMap[0] = this.stitchMap[0].concat(
          new Array(e.target.value - this.stitchMap[0].length + 1).fill('')
        )
        this.stitchMap[1] = this.stitchMap[1].concat(
          new Array(e.target.value - this.stitchMap[1].length + 1).fill('')
        )
      } else {
        this.pinTableList.splice(
          e.target.value,
          this.pinTableList.length - e.target.value
        )
        this.stitchMap[0].splice(
          parseInt(e.target.value) + 1,
          this.stitchMap[0].length - e.target.value - 1
        )
        this.stitchMap[1].splice(
          parseInt(e.target.value) + 1,
          this.stitchMap[1].length - e.target.value + 1
        )
      }
    },
    // 排三角图输入数字增加列
    triangleBlur(e) {
      if (!e.target.value) {
        return
      }
      if (e.target.value && (e.target.value > 100 || e.target.value < 30)) {
        this.order.triangleColumn = null
        const triangleInputEl = this.$refs.triangleInput
        triangleInputEl.focus()
        return
      }
      if (e.target.value > this.triangleTableList.length) {
        this.triangleTableList = this.triangleTableList.concat(
          new Array(e.target.value - this.triangleTableList.length).fill('')
        )
        this.triangleMap.plateTop[0] = this.triangleMap.plateTop[0].concat(
          new Array(e.target.value - this.triangleMap.plateTop[0].length).fill(
            ''
          )
        )
        this.triangleMap.plateTop[1] = this.triangleMap.plateTop[1].concat(
          new Array(e.target.value - this.triangleMap.plateTop[1].length).fill(
            ''
          )
        )
        this.triangleMap.plateBottom[0] = this.triangleMap.plateBottom[0].concat(
          new Array(
            e.target.value - this.triangleMap.plateBottom[0].length
          ).fill('')
        )
        this.triangleMap.plateBottom[1] = this.triangleMap.plateBottom[1].concat(
          new Array(
            e.target.value - this.triangleMap.plateBottom[1].length
          ).fill('')
        )
        this.triangleMap.plateBottom[2] = this.triangleMap.plateBottom[2].concat(
          new Array(
            e.target.value - this.triangleMap.plateBottom[2].length
          ).fill('')
        )
        this.triangleMap.plateBottom[3] = this.triangleMap.plateBottom[3].concat(
          new Array(
            e.target.value - this.triangleMap.plateBottom[3].length
          ).fill('')
        )
        this.triangleMap.yarnRow[0] = this.triangleMap.yarnRow[0].concat(
          new Array(e.target.value - this.triangleMap.yarnRow[0].length).fill(
            ''
          )
        )
        this.triangleMap.cycles[0] = this.triangleMap.cycles[0].concat(
          new Array(e.target.value - this.triangleMap.cycles[0].length).fill('')
        )
        this.triangleMap.cyclesDetails[0] = this.triangleMap.cyclesDetails[0].concat(
          new Array(e.target.value - this.triangleMap.cyclesDetails[0].length).fill({})
        )
      } else {
        this.triangleTableList.splice(
          e.target.value,
          this.triangleTableList.length - e.target.value
        )
        this.triangleMap.plateTop[0].splice(
          e.target.value,
          this.triangleMap.plateTop[0].length - e.target.value
        )
        this.triangleMap.plateTop[1].splice(
          e.target.value,
          this.triangleMap.plateTop[1].length - e.target.value
        )
        this.triangleMap.plateBottom[0].splice(
          e.target.value,
          this.triangleMap.plateBottom[0].length - e.target.value
        )
        this.triangleMap.plateBottom[1].splice(
          e.target.value,
          this.triangleMap.plateBottom[1].length - e.target.value
        )
        this.triangleMap.plateBottom[2].splice(
          e.target.value,
          this.triangleMap.plateBottom[2].length - e.target.value
        )
        this.triangleMap.plateBottom[3].splice(
          e.target.value,
          this.triangleMap.plateBottom[3].length - e.target.value
        )
        this.triangleMap.yarnRow[0].splice(
          e.target.value,
          this.triangleMap.yarnRow[0].length - e.target.value
        )
        this.triangleMap.cycles[0].splice(
          e.target.value,
          this.triangleMap.cycles[0].length - e.target.value
        )
        this.triangleMap.cyclesDetails[0].splice(
          e.target.value,
          this.triangleMap.cyclesDetails[0].length - e.target.value
        )
      }
    },
    // 点击表头选择连续列
    selectColumn(index) {
      if (this.isEdit !== 'edit') {
        return
      }
      const currentIndex = index + 1
      if (!this.copyBefore) {
        this.startPaste = currentIndex
        return
      }
      // 重复点击取消
      const indexOf = this.selectIndexSource.indexOf(currentIndex)
      if (indexOf !== -1) {
        this.selectIndexSource.splice(indexOf)
        return
      }
      this.selectIndexSource.sort((a, b) => {
        return a - b
      })
      if (
        this.selectIndexSource.length &&
        (this.selectIndexSource[this.selectIndexSource.length - 1] + 1 ===
          currentIndex ||
          this.selectIndexSource[0] - 1 === currentIndex)
      ) {
        this.selectIndexSource.push(currentIndex)
        return
      } else if (!this.selectIndexSource.length) {
        this.selectIndexSource.push(currentIndex)
        return
      }
      this.$message.warning('请选择连续的列！')
    },
    // 循环点击
    selectCycles(index) {
      if (this.isEdit !== 'edit') {
        return
      }
      // 重复点击取消
      const indexOf = this.selectCyclesIndex.indexOf(index)
      if (indexOf !== -1) {
        this.selectCyclesIndex.splice(indexOf)
        return
      }
      this.selectCyclesIndex.sort((a, b) => {
        return a - b
      })
      if (!this.selectCyclesIndex.length) {
        this.selectCyclesIndex.push(index)
        return
        // } else if (this.selectCyclesIndex.length && ((this.selectCyclesIndex[this.selectCyclesIndex.length - 1] + 1) === index) || (this.selectCyclesIndex[0] - 1) === index) {
      } else if (
        this.selectCyclesIndex.length &&
        this.selectCyclesIndex[this.selectCyclesIndex.length - 1] !== index
      ) {
        this.selectCyclesIndex.push(index)
        return
      } else {
        this.$message.warning('请选择连续的列！')
      }
    },
    // 选择表头复制前
    selectCopyBefore(index, tIndex) {
      const length = this.triangleTableList.length
      const currentIndex = index * length + parseInt(tIndex) + 1
      const remainder = currentIndex % length || length
      if (this.selectIndexSource.includes(remainder)) {
        return true
      }
      return false
    },
    selectCyclesBefore(index) {
      if (this.selectCyclesIndex.includes(index)) {
        return true
      }
      return false
    },
    // 选择表头复制后
    selectCopyAfter(index, tIndex) {
      const length = this.triangleTableList.length
      const currentIndex = index * length + tIndex + 1
      const remainder = currentIndex % length || length
      if (this.startPaste === remainder && !this.copyBefore) {
        return true
      }
      return false
    },
    // 复制
    handleCopy() {
      if (!this.selectIndexSource.length) {
        this.$message.warning('请先选择要复制的列！')
        return
      }
      this.selectIndexSource.sort((a, b) => {
        return a - b
      })
      this.selectData = []
      this.copyBefore = false
      this.selectIndexSource.map((sIndex) => {
        const selectIndex = sIndex - 1
        const tempArr = []
        new Array(7).fill('').map((item, index) => {
          tempArr.push({
            index: selectIndex,
            value: document.querySelectorAll('.triangle')[
              this.triangleTableList.length * index + selectIndex
            ].value
          })
        })
        this.selectData.push(tempArr)
      })
    },
    // 粘贴
    handlePaste() {
      if (this.startPaste === -1) {
        return
      }
      // const pasteStartIndex = this.startPaste - this.selectIndexSource[0] // 粘贴开始的列下标
      const pasteStartIndex = this.startPaste - 1 // 粘贴开始的列下标
      this.selectData.forEach((selectData, selectIndex) => {
        selectData.forEach((item, index) => {
          this.triangleMap.plateTop.forEach((items, indexs) => {
            // this.$set(this.triangleMap.plateTop[indexs], (parseInt(pasteStartIndex) + parseInt(selectIndex)), item.value)
            this.$set(
              this.triangleMap.plateTop[0],
              parseInt(pasteStartIndex) + parseInt(selectIndex),
              selectData[0].value
            )
            this.$set(
              this.triangleMap.plateTop[1],
              parseInt(pasteStartIndex) + parseInt(selectIndex),
              selectData[1].value
            )
          })
          this.triangleMap.plateBottom.forEach((items, indexs) => {
            // this.$set(this.triangleMap.plateBottom[indexs], (parseInt(pasteStartIndex) + parseInt(selectIndex)), selectData[index].value)
            this.$set(
              this.triangleMap.plateBottom[0],
              parseInt(pasteStartIndex) + parseInt(selectIndex),
              selectData[2].value
            )
            this.$set(
              this.triangleMap.plateBottom[1],
              parseInt(pasteStartIndex) + parseInt(selectIndex),
              selectData[3].value
            )
            this.$set(
              this.triangleMap.plateBottom[2],
              parseInt(pasteStartIndex) + parseInt(selectIndex),
              selectData[4].value
            )
            this.$set(
              this.triangleMap.plateBottom[3],
              parseInt(pasteStartIndex) + parseInt(selectIndex),
              selectData[5].value
            )
            this.$set(
              this.triangleMap.yarnRow[0],
              parseInt(pasteStartIndex) + parseInt(selectIndex),
              selectData[6].value
            )
          })
        })
      })
      this.selectIndexSource = []
      this.startPaste = -1
      this.copyBefore = true
    },
    getColspan(index) {
      if (this.cyclesDetails[index]) {
        const colSpanNum =
          this.cyclesDetails[index].s1 -
          this.cyclesDetails[index].s0 +
          1
        return colSpanNum
      }
    },
    cyclesInput(e){
      var patt = /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/
        if (!patt.test(e)) {
          if(e<1){
            this.order.cyclesNum =1
            return
          }else if(e>999){
            this.order.cyclesNum =999
            return
          }
            this.order.cyclesNum =null
            return
        }
    },
    cyclesBlur(e) {
      if (!this.selectCyclesIndex.length) {
        this.$message.warning('请先选择循环次数的列！')
        return
      }
      this.order.cyclesNum = e.target.value
      this.selectCyclesIndex.sort(function(a, b) {
        return a - b
      })
      this.startColspanIndex = this.selectCyclesIndex[0]
      var s0 = this.selectCyclesIndex[0]
      var s1 = this.selectCyclesIndex[this.selectCyclesIndex.length - 1]
      for (var i = s0; i <= s1; i++) {
        this.$set(this.triangleMap.cycles[0], i, e.target.value)
        this.$set(this.cyclesDetails, i, { key: s0, value: e.target.value, s0: s0, s1: s1 })
      }
      const index = this.cyclesDetails.findIndex((el) => {
        if (el !== undefined) {
          return el.s1 === s0
        }
      })
      if (index !== -1) {
        for (var j = this.cyclesDetails[index].s0; j <= s1; j++) {
          if (this.cyclesDetails[j]) {
            this.$set(this.cyclesDetails, j, { key: this.cyclesDetails[index].s0, value: e.target.value, s0: this.cyclesDetails[index].s0, s1: s1 })
          }
        }
      }
      this.allSelectCyclesIndex = this.allSelectCyclesIndexHandle()
      this.selectCyclesIndex = []
      this.order.cyclesNum = null
    },
    clearCycles() {
      if (!this.selectCyclesIndex.length) {
        this.$message.warning('请先选择需要清除的循环！')
        return
      }
      this.selectCyclesIndex.sort(function(a, b) {
        return a - b
      })
      this.selectCyclesIndex.forEach(el => {
        this.cyclesDetails.forEach((j, index) => {
          if (j.s1 === el) {
            this.$set(this.triangleMap.cycles[0], index, '')
            this.$set(this.cyclesDetails, index, '')
          }
        })
      })
      this.allSelectCyclesIndex = this.allSelectCyclesIndexHandle()
      this.selectCyclesIndex = []
    },
    allSelectCyclesIndexHandle() {
      var arr = []
      this.cyclesDetails.forEach((n, index) => {
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

<style lang="scss">
.computer-technology {
  background: #ffffff;
  padding: 0 20px;
  margin: 0 20px;
  .el-form-item__label-wrap {
    margin-left: 0px!important;
  }
  .technology-box .el-form-item__content > .el-input [readonly="readonly"] {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #ffffff;
  }
  .edit-box .el-input__inner {
    max-width: 200px;
  }
  .pin-number {
    margin-top: 10px;
    margin-left: 20px;
    .pin-title {
      margin-top: 20px;
      margin-bottom: 15px;
      .pin-info {
        display: inline-block;
        span {
          font-size: 14px;
          color: #606266;
          i {
            color: red;
          }
        }
      }
      .clounm {
        display: inline-block;
        .el-input {
          width: 80px;
          display: inline-block;
          margin: 0 10px;
        }
        .el-button {
          margin-left: 10px;
        }
      }
      .buttons {
        margin-left: 60px;
        display: inline-block;
        button {
          border-color: #1890FF;
          color: #1890FF;
        }
      }
    }
    .triangle-table {
      overflow-x: auto;
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
            // line-height: 40px;
            background: #ffffff;
            span {
              color: #000000;
            }
            .word-break {
              word-break: break-word;
              line-height: 1.5;
            }
            input {
              width: 36px;
              width: 100%;
              height: 100%;
              text-align: center;
              border: 0;
              color: rgba(95, 97, 101, 1);
              background: transparent;
            }
            textarea {
              width: 36px;
              min-width: 36px;
              height: 60px;
              outline: none;
              border: none;
              resize: none;
              overflow-y: hidden;
            }
          }
          th:first-child {
            min-width: 80px;
          }
        }
      }
    }
    .pin-table {
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
            // flex: 1;
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
            // flex: 1;
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
  .uploadfile .el-upload-dragger {
    width: 100%;
    height: 120px;
  }
  .uploadfile .el-icon-upload {
    font-size: 36px;
    margin: 10px 0 0 0;
  }
  .uploadfile .el-upload {
    width: 100% !important;
  }
  .el-textarea textarea {
    height: 100px;
  }
  .select-copy-before {
    background: green !important;
  }
  .select-copy-after {
    background: red !important;
  }
  .select-colspan-before {
    background: gray !important;
  }
  .triangleCycles {
    cursor: pointer;
  }
}
</style>
