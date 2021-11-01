<!--
 * @Date: 2020-09-27 09:45:52
 * @Author: Againss
 * @LastEditTime: 2020-10-16 10:18:54
 * @LastEditors: Sanmao
 * @Descripttion: 搜索组件
 * 使用方法与基础组件的cs-custom-form一样 (cs-custom-form)
 * <search ref="searchForm" :data-source="searchData" />
 * searchData = [ {
                prop: 'description',
                itemType: 'input',
                label: '日志内容:',
                placeholder: '请输入日志关键词'
            },{
                itemType: 'operate',
                submitText: '查询',
                submitHandle: params => {
                    console.log(params)
                    const appSystemIds = params.appSystemIds && params.appSystemIds.length === 0 ? null : params.appSystemIds
                    const startTime = params.dateRange && params.dateRange[0]
                    const endTime = params.dateRange && params.dateRange[1]
                    this.searchFormDatas = { ...params, appSystemIds, startTime, endTime }
                    this.getLogPage({ ...params, appSystemIds, startTime, endTime })
                },
                resetHandle: () => {
                    // console.log('重置')
                    this.searchFormDatas = {}
                }
            }]
-->
<template>
  <div class="search-content">
    <cs-custom-form
      ref="form"
      class="search-form"
      :data-source="dataSources"
      :options="options"
      :form-datas="formDatas"
    />
    <div class="operate-btn">
      <el-button
        v-if="!operate.submitHidden"
        type="primary"
        @click="submitForm"
      >{{ operate.submitText || "查询" }}</el-button>
      <el-button v-if="!operate.resetHidden" @click="resetForm">{{
        operate.resetText || "重置"
      }}</el-button>
      <el-button
        v-if="dataSource && dataSource.length - 1 > showLength"
        class="btn-extend"
        @click="extend"
      >{{ showText }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchComponent',
  props: {
    formDatas: {
      type: Object
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {
        return {
          inline: true
        }
      }
    },
    showLength: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      dataSources: [], // 展示的搜索条件
      operate: {}, // 右边操作按钮
      showText: '展开'
    }
  },
  mounted() {
    // 如果超过四个则默认显示三
    // console.log(this.dataSource)
    if (this.dataSource && this.dataSource.length - 1 > this.showLength) {
      this.dataSources = this.dataSource.slice(0, this.showLength)
      // 查询重置按钮
      this.operate = this.dataSource[this.dataSource.length - 1]
    } else {
      this.dataSources = this.dataSource.slice(0, this.dataSource.length - 1)
      this.operate = this.dataSource[this.dataSource.length - 1]
    }
  },
  methods: {
    // 展开收起
    extend() {
      if (this.showText === '收起') {
        this.dataSources = this.dataSource.slice(0, this.showLength)
        this.showText = '展开'
      } else {
        this.dataSources = this.dataSource.slice(0, this.dataSource.length - 1)
        this.showText = '收起'
      }
      this.$emit('extend')
    },
    // 查询按钮
    submitForm() {
      this.operate.submitHandle &&
        this.operate.submitHandle(
          this.$refs.form.$refs.dynamicValidateForm.model
        )
    },
    // 重置
    resetForm() {
      this.$refs.form.dynamicValidateFormRuleForm = {}
      this.$refs.form.setDynamicValidateFormRuleForm({})
      this.$refs.form.$refs.dynamicValidateForm.resetFields()
      this.operate.resetHandle && this.operate.resetHandle()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-content {
  display: flex;
  .search-form {
    max-width: 900px;
    /deep/.el-form {
      display: flex;
      .el-form-item {
        width: 280px;
        margin-bottom: 10px;
        margin-right: 0;
        padding-right: 10px;
        .el-form-item__label {
          // width: 90px !important;
          .el-form-item__conten {
            flex: 1;
          }
        }
      }
      .el-form-item:nth-child(3n + 1) {
        .el-form-item__label {
          text-align: left;
        }
      }
    }
  }
  .operate-btn {
    display: flex;
    line-height: 36px;
    height: 36px;
    el-button {
      margin-left: 10px;
    }
  }
}
</style>
