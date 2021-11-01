<!--
 * @Description: 规则设置
 * @Autor: zhengjin
 * @Date: 2021-07-27 14:23:26
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-04 14:21:22
-->

<template>
  <div class="ruleString">
    <div class="mail-item-content">
      <div class="mail-content-title">制板规则设置</div>
      <div class="mail-content-info">
        <cs-custom-form
          class="ruleString-table"
          :form-datas="param"
          :data-source="ruleString"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ruleInfo, ruleAdd, ruleUpdate } from '../../api/index'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    cancel: {
      type: Function
    }
  },
  data() {
    const dataList = [
      {
        label: '头缸',
        value: '1'
      },
      {
        label: '缸差',
        value: '2'
      }
    ]
    const ruleString = {
      _internalTestId: {
        prop: 'internalTestId',
        label: '内测物测:',
        itemType: this.radioTypeChange,
        change: (value) => {
          this.$set(this.param, 'internalTestId', value)
          this.$set(
            this.param,
            'internalTestName',
            this.fitterItem(this.dataList, value).label
          )
        },
        renderContent: (value) => {
          return !value
            ? '-'
            : this.fitterItem(this.dataList, value).label
        },
        dataSource: dataList
      },
      _internalTestBatchnoId: {
        prop: 'internalTestBatchnoId',
        label: '内测批色:',
        itemType: this.radioTypeChange,
        change: (value) => {
          this.$set(this.param, 'internalTestBatchnoId', value)
          this.$set(
            this.param,
            'internalTestBatchnoName',
            this.fitterItem(this.dataList, value).label
          )
        },
        renderContent: (value) => {
          return !value
            ? '-'
            : this.fitterItem(this.dataList, value).label
        },
        dataSource: dataList
      }
    }
    return {
      ruleString,
      dataList,
      isDetail: false,
      param: {}
    }
  },
  watch: {
    isEdit(val) {
      // 编辑的时候给赋个默认值，默认都选中头缸
      if (val) {
        this.$set(this.param, 'internalTestBatchnoId', this.param.internalTestBatchnoId ? this.param.internalTestBatchnoId : '1')
        this.$set(this.param, 'internalTestBatchnoName', this.param.internalTestBatchnoName ? this.param.internalTestBatchnoName : '头缸')
        this.$set(this.param, 'internalTestId', this.param.internalTestId ? this.param.internalTestId : '1')
        this.$set(this.param, 'internalTestName', this.param.internalTestName ? this.param.internalTestName : '头缸')
      }
    }
  },
  created() {
    this.getRuleString()
  },
  methods: {
    async getRuleString() {
      const res = await ruleInfo({
        'customerId': this.$route['params'].id
      })
      if (res.code !== 200) return
      if (!res.data) {
        this.isDetail = false
      } else {
        this.isDetail = true
      }
      this.param = {
        ...res.data
      }
    },
    // 提交
    submint() {
      let res = null
      this.$confirm(' 你确认要提交该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (this.isDetail) {
          res = await ruleUpdate(this.param)
        } else {
          res = await ruleAdd({
            'customerId': this.$route['params'].id,
            ...this.param
          })
        }
        if (res.code !== 200) return
        this.$message.success('保存成功')
        this.getRuleString()
        this.cancel()
      }).catch(() => {})
    },
    radioTypeChange() {
      if (this.isEdit && this.type === '4') {
        return 'radio-group'
      }
      return 'itemview'
    },
    fitterItem(arr, value) {
      return arr.find((item) => item.value === value)
    }
  }
}
</script>

<style lang="scss" scoped>
.ruleString {
  padding: 0 20px;
  .mail-item-content {
    color: #151222;
    .mail-content-title {
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      line-height: 22px;
      padding: 20px 0;
      border-bottom: 1px solid #efefef;
      font-size: 16px;
    }
    .mail-content-info {
      font-size: 14px;
      padding: 20px 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: wrap;
      flex-flow: wrap;
      ::v-deep
      .custom-form {
        font-size: 14px;
        color: #474747;
        .el-form-item {
          margin-bottom: 10px !important;
          display: flex;
        }
        .el-form-item__label-wrap {
          width: 120px;
          text-align: right;
          margin: 0 !important;
          .el-form-item__label {
            color: #474747;
            line-height: 32px;
          }
        }
        .el-form-item__content {
          margin: 0 !important;
          line-height: 32px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
  }
}
</style>
