<!--
 * @Date: 2020-10-14 16:03:44
 * @Author: Againss
 * @LastEditTime: 2021-08-06 17:28:40
 * @LastEditors: zhengjin
 * @Descripttion: 纱长设置
-->
<template>
  <el-drawer
    v-if="visiblesync"
    class="drawer-item"
    title="设置纱长"
    size="25%"
    :visible.sync="visiblesync"
    :modal="true"
    :wrapper-closable="false"
    @close="popOptions.cancel()"
  >
    <div class="yarn-cont">
      <div class="content-item">
        <span class="label product-is-request">比例(%)</span>
        <el-input
          :class="{ 'ratio-input': ratio_num }"
          :value="dataList.ratio"
          @input="ratioInput"
        />
      </div>
      <div class="content-item">
        <span class="label product-is-request">数量</span>
        <el-input
          :class="{ 'num-input': num }"
          :value="dataList.holeNumber"
          @input="handleInput"
        />-
        <el-select v-model.trim="dataList.holeType" placeholder="请选择">
          <el-option value="G" label="G">G</el-option>
          <el-option value="R" label="R">R</el-option>
        </el-select>
      </div>
      <div class="yarn-btn">
        <el-button
          type="primary"
          size="mini"
          @click="addHandler"
        >增加</el-button>
      </div>
      <cs-custom-form
        ref="dataTable"
        class="product-style-table"
        size="mini"
        :reset-errors="isErroes"
        :data-source="dataSource"
        :options="formOptions"
      />
    </div>
    <div class="demo-drawer__footer">
      <el-button @click="popOptions.cancel()">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { yarnLengthDescList, getYarnLengthValue } from '../api'
export default {
  props: {
    popOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    order: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: [{
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysPermit:modify'],
        isShow: true,
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.dataSource[0].dataSource.splice(params.$index, 1)
            this.isErroes = false
          }).catch(() => {})
        }
      }]
    }
    // 获取纱长描述
    const inputItem = {
      itemType: 'input',
      labelWidth: '0',
      rules: [
        { required: true, message: '描述不能为空', trigger: ['change'] }
      ],
      change: (value, v1, v2, v3, scope) => {
        this.$set(this.dataSource[0].dataSource[scope.$index], 'desc', value)
        this.$refs.dataTable.setDynamicValidateFormRuleForm({ tableForm: this.dataSource[0].dataSource })
      }
    }
    const selectItem = {
      itemType: 'select',
      labelWidth: '0',
      rules: [
        { required: true, message: '描述不能为空', trigger: ['change'] }
      ],
      dataSource: [],
      visibleChange: (flag) => {
        if (flag) {
          this.setYarnDesc()
        }
      },
      change: (value, v1, v2, v3, scope) => {
        this.$set(this.dataSource[0].dataSource[scope.$index], 'descUuid', value)
        this.$refs.dataTable.setDynamicValidateFormRuleForm({ tableForm: this.dataSource[0].dataSource })
        this.dataSource[0].dataSource[scope.$index].descObj = this.descList.find(item => {
          return item.uuid === value
        })
      }
    }
    var validatePass = (rule, value, callback) => {
      const res = /^(([1-9][0-9]{0,3})(\.\d)?|0\.[1-9]|10000|10000.0)$/g
      if (!res.test(value)) {
        callback(new Error('请输入至多一位小数的数字！'))
      } else {
        callback()
      }
    }
    // 纱线组合数据
    const columns = [
      {
        prop: 'desc',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '描述',
        editOptions: inputItem
      },
      {
        prop: 'length',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '纱长/cm',
        minWidth: '80',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          rules: [
            { required: true, message: '请输入在纱长区间的纱长值', trigger: ['change'] },
            { validator: validatePass, trigger: 'change' }
          ],
          blur: async(e, v1, v2, v3, scope) => {
            let value = e.target.value
            if (value !== '') {
              // 输入后获取纱长区间的归类赋值
              value = await this.getYarnLength(value)
            }
            this.$set(this.dataSource[0].dataSource[scope.$index], 'length', value || '')
            this.$refs.dataTable.setDynamicValidateFormRuleForm({ tableForm: this.dataSource[0].dataSource })
          }
        }
      }
    ]
    // 纱线组合
    const dataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: columns,
        size: 'mini',
        className: 'OptionTableForm',
        maxHeight: '600',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        operates: popOperates
      }
    ]
    return {
      ratio_num: false,
      num: false,
      inputItem,
      selectItem,
      dialogVisible: false,
      dataList: {
        ratio: '',
        holeNumber: '100',
        holeType: 'G',
        length: []
      },
      descList: [],
      dataSource,
      visiblesync: false,
      formOptions: {
        popError: true
      },
      isErroes: true
    }
  },
  watch: {
    visible(val) {
      this.visiblesync = val
      if (val) {
        this.dataList.ratio = this.popOptions.data && this.popOptions.data.ratio
        this.dataList.holeType = this.popOptions.data && this.popOptions.data.holeType
        this.dataList.holeNumber = (this.popOptions.data && this.popOptions.data.holeNumber) || 100
        this.dataSource[0].dataSource = this.popOptions.data && this.popOptions.data.length ? [...this.popOptions.data.length] : []
        this.dataSource[0].columns[0].editOptions = this.order.isComputerJacquard === 1 ? this.inputItem : this.selectItem
        this.dataSource[0].columns[0].prop = this.order.isComputerJacquard === 1 ? 'desc' : 'descUuid'
        if (this.order.isComputerJacquard !== 1) {
          this.setYarnDesc()
        }
      }
      this.tebHeight()
    }
  },
  methods: {
    // 获取纱长进行替换
    async  getYarnLength(val) {
      const data = await getYarnLengthValue({
        search_value: val
      })
      return data.data.midVal
    },
    // input输入验证
    ratioInput(value) {
      if (!value || isNaN(value) || String(value).includes('.')) {
        this.ratio_num = true
      } else {
        this.ratio_num = false
      }
      this.dataList.ratio = value - 0 ? value : ''
    },
    handleInput(value) {
      if (!value || isNaN(value) || String(value).includes('.')) {
        this.num = true
      } else {
        this.num = false
      }
      this.dataList.holeNumber = value - 0 ? value : ''
    },
    // 添加纱长
    addHandler() {
      this.dataSource[0].dataSource.push({
        descUuid: '', // 描述id
        desc: '',
        edit: true,
        descObj: null,
        length: '' // 长度
      })
      this.isErroes = true
      this.scollBody()
    },
    // 纱长描述
    async setYarnDesc() {
      const res = await yarnLengthDescList()
      res.data.forEach(item => {
        item.label = item.name
        item.value = item.uuid
      })
      this.descList = res.data
      this.$set(this.dataSource[0].columns[0].editOptions, 'dataSource', res.data)
    },
    // 提交数据
    ok() {
      this.dataList.length = this.dataSource[0].dataSource
      if (this.dataList.ratio === '') {
        this.ratio_num = true
        return
      }
      const res = /^[1-9]\d*$/
      if (!res.test(this.dataList.ratio)) {
        // this.$message.error('比例为正整数且不能为空')
        return
      }
      if (!this.dataList.holeNumber) {
        this.num = true
        return
      }
      if (!this.dataList.length.length) {
        this.$message({
          type: 'warning',
          message: '请添加纱长描述'
        })
        return
      }
      this.$nextTick(() => {
        this.$refs.dataTable.form.validate(async(valid) => {
          if (valid && !this.num) {
            const fl = this.dataSource[0].dataSource.find(item => {
              return !item.length
            })
            if (fl) {
              return
            }
            this.$confirm(' 请确认添加该数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.popOptions.ok(this.dataList)
            }).catch(() => {})
          } else {
            console.log('error')
          }
        })
      })
    },
    // 设置tabel高度
    tebHeight() {
      this.$set(this.dataSource[0], 'maxHeight', document.documentElement.clientHeight - 323)
    },
    // 滚动条置底
    scollBody() {
      const container = this.$el.querySelector('.OptionTableForm').childNodes[2]
      this.$nextTick(() => {
        container.scrollTop = container.scrollHeight
      })
    }
    // del(index) {
    //   this.dataList.length.splice(index, 1)
    // }
  }
}
</script>

<style lang="scss" scoped>
.yarn-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.yarn-cont {
  padding: 0 20px;
  height: calc(100% - 94px);
  overflow: hidden;
  // overflow-y: auto;
  /deep/ .el-table--mini {
    font-size: 14px;
  }
  .content-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #606266;
    margin-bottom: 16px;
    .label {
      padding-right: 12px;
      text-align: right;
      box-sizing: border-box;
      width: 100px;
    }
    .el-input {
      width: 170px;
    }
    .el-select {
      width: 150px;
    }
  }
}
.num-input {
  position: relative;
}
.num-input::after {
  content: "数量为正整数不能为空";
  color: #ff4949;
  position: absolute;
  font-size: 12px;
  line-height: 1;
  bottom: -20px;
  left: 0;
  width: 120px;
  height: 18px;
}
.ratio-input {
  position: relative;
}
.ratio-input::after {
  content: "比例为正整数不能为空";
  color: #ff4949;
  position: absolute;
  font-size: 12px;
  line-height: 1;
  bottom: -20px;
  left: 0;
  width: 120px;
  height: 18px;
}
.product-style-table {
  // /deep/.el-table__header{
  //   .gutter {
  //     background-color: rgb(245, 247, 250) !important;
  //   }
  // }
  /deep/.el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    background-color: #ebeef5;
  }
  /deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 3px;
    height: 100px;
    background-color: #ccc;
  }
  /deep/.el-table__body-wrapper::-webkit-scrollbar-track {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 1);
  }
}
.drawer-item /deep/ .el-drawer__body {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.demo-drawer__footer {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  margin-top: 10px;
  border-top: 1px solid #e9eff2;
  z-index: 1000;
  background-color: #fff;
}
</style>
