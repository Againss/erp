<!--
 * @Date: 2020-12-10 11:46:30
 * @Author: Againss
 * @LastEditTime: 2021-06-23 15:59:15
 * @LastEditors: zhengjin
 * @Descripttion: 花号管理新增
-->
<template>
  <div class="product-detail-content">
    <div class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">
          智布花号：{{ order.flowerCode }}
          <span
            v-show="!order.flowerCode"
            class="code-der"
          >保存后自动生成</span>
        </div>
      </div>
      <div v-if="$route.params.id" class="description">
        <span>
          <span v-if="order.status === 3">
            审核人：{{
              order.updator
                ? `${order.updator.name}/${order.updator.realName}`
                : ""
            }}
            &nbsp; 审核时间：{{
              order.updatedTime &&
                $filters.parseTime(order.updatedTime, "{y}-{m}-{d} {h}:{i}")
            }}</span>
          <span v-else>
            操作人：{{
              order.updator
                ? `${order.updator.name}/${order.updator.realName}`
                : ""
            }}
            &nbsp; 操作时间：{{
              order.updatedTime &&
                $filters.parseTime(order.updatedTime, "{y}-{m}-{d} {h}:{i}")
            }}</span>
          &nbsp; 状态：<span
            :class="{
              Audited: order.status === 3,
              refuse: order.status === 4,
              Pending: order.status === 2 || order.status === 1,
            }"
          >{{ getStatus }}</span>
        </span>
        <el-select
          size="mini"
          class="version"
          :disabled="isEdit"
          :value="order.versionValue"
          placeholder="版本"
          @change="versionChange"
        >
          <el-option
            v-for="item in order.versionOptions"
            :key="item.version"
            :label="item.version"
            :value="item.version"
          />
        </el-select>
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formTwoPart"
          :is-edit="false"
          :form-data="formDataTwoPart"
          :order="order"
        />
        <div class="img-box">
          <div class="title">印花图案：</div>
          <div>
            <el-image
              style="width: 200px; height: 200px"
              :src="order.printPic"
              :preview-src-list="[order.printPic]"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">实际工艺</div>
      <div class="product-content-info">
        <item
          ref="formDataThreePart"
          :is-edit="isEdit"
          :rules="rulesTwoPart"
          :form-data="formDataThreePart"
          :order="order"
        />
      </div>
    </div>
    <div
      v-if="
        (order.flowerVersions[0] &&
          '版本：' + order.flowerVersions[0].version) === order.versionValue
      "
      class="product-btn-group"
    >
      <div class="btn-groups">
        <el-button v-if="isEdit" @click="cancel">取消</el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="submitForm('save')"
        >保存</el-button>
        <el-button
          v-show="
            !isEdit &&
              (!order.status || order.status === 1 || order.status === 4)
          "
          v-permission="['color:Api:FlowerManage:FlowerMain:update']"
          type="primary"
          @click="isEdit = true"
        >编辑</el-button>
        <el-button
          v-show="
            order.status === 1 ||
              ((order.status === 0 || order.status === 4) && isEdit)
          "
          v-permission="['color:Api:FlowerManage:FlowerMain:submit']"
          type="primary"
          @click="submitForm('submit')"
        >提交</el-button>
        <el-button
          v-show="!isEdit && order.status === 2"
          v-permission="['color:Api:FlowerManage:FlowerMain:disapprove']"
          @click="disapprove"
        >驳回</el-button>
        <el-button
          v-show="!isEdit && order.status === 2"
          v-permission="['color:Api:FlowerManage:FlowerMain:approve']"
          type="primary"
          @click="approve"
        >审核</el-button>
        <el-button
          v-show="!isEdit && order.status === 3"
          v-permission="['color:Api:FlowerManage:FlowerMain:change']"
          @click="change"
        >变更</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import item from '@/views/product-center/components/detaiItem'
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
import { approve, show, update, actualTechnology, submit, change, disapprove } from './api'
export default {
  components: { item },
  mixins: [logMethods],
  data() {
    // 验证字段
    const validatePass = (rule, value, callback) => {
      if (!this.order.actualTechnology.length || this.order.actualTechnology.length > 2) {
        callback(new Error('必选且至多两个工艺'))
      } else {
        callback()
      }
    }
    const rulesTwoPart = {
      actualTechnology: [
        { message: '请选择印花工艺', required: true, trigger: ['change'] },
        { validator: validatePass, trigger: 'change' }
      ]
    }
    const formDataTwoPart = [
      {
        name: 'soOrderCode',
        type: 'input',
        label: 'SO单号'
      },
      {
        name: 'flowerColor',
        type: 'input',
        label: '花色'
      },
      {
        name: 'so',
        showValue: 'soValue',
        type: 'input',
        label: 'SO小样'
      },
      {
        name: 'ingredient',
        type: 'input',
        label: '成份'
      },
      {
        name: 'printTechnologyNames',
        type: 'input',
        label: '印花工艺'
      },
      {
        name: 'printOverdye',
        type: 'input',
        label: '印花套色'
      }
    ]
    const formDataThreePart = [
      {
        name: 'actualTechnology',
        showValue: 'actualTechnologyNames',
        type: 'select',
        label: '印花工艺',
        placeholder: '请选择印花工艺',
        multiple: true,
        valueKey: 'uuid',
        options: [],
        changeHandler: (e) => {
          if (e.length > 2) {
            this.$message({
              type: 'warning',
              message: '至多选择两个工艺'
            })
            this.order.actualTechnology = e.slice(0, 2)
            this.$refs['formTwoPart'].resetData({
              actualTechnology: this.order.actualTechnology
            })
            return
          }
          this.order.actualTechnology = e
          this.order.actualTechnologyNames = e.map((item) => {
            return item.name
          }).join(',')
          this.$refs['formTwoPart'].resetData({
            actualTechnology: this.order.actualTechnology
          })
        }
      },
      {
        name: 'actualPrintValue',
        type: 'select-search',
        label: '印花方式',
        placeholder: '请选择印花方式',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'name',
        requestParam: { 'classificationName': '印花方式' },
        apiUrl: `basis/api/requirementsPrinting/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.actualPrintValue = e.data ? e.data.name : ''
          this.order.actualPrintUuid = e.data ? e.data.uuid : ''
          this.$refs['formTwoPart'].resetData({
            actualPrintValue: e.data ? e.data.name : ''
          })
        }
      }
    ]

    return {
      order: {},
      isEdit: true,
      rulesTwoPart,
      formDataTwoPart,
      formDataThreePart,
      beforeCode: {}
    }
  },
  computed: {
    getStatus() {
      // if (this.order.enabled === 'N') {
      //   return '已禁用'
      // }
      let str = ''
      switch (this.order.status) {
        case 0:
          str = '-'
          break
        case 1:
          str = '草稿'
          break
        case 4:
          str = '已驳回'
          break
        case 2:
          str = '待审核'
          break
        case 3:
          str = '已审核'
          break
        default:
          break
      }
      return str
    }
  },
  async created() {
    this.initOrder()
    // 请求顺序影响显示
    Promise.all([actualTechnology({ classificationName: '印花工艺' }), show({ id: this.$route.params.id })]).then((ress) => {
      this.getActualTechnology(ress[0])
      this.order = Object.assign(this.order, ress[1].data)
      this.beforeCode = {
        id: this.order.id,
        code: this.order.flowerCode
      }
      this.setOrder(this.order)
    })
    // await this.getActualTechnology()
    // await this.getOrder(this.$route.params.id)
    if (this.$route.path.includes('show')) {
      this.isEdit = false
    }
  },
  methods: {
    // 初始化
    initOrder() {
      this.order = {
        flowerCode: '',
        actualTechnologyUuids: [], // 实际工艺-印花工艺
        actualTechnology: [],
        actualTechnologyNames: '', // 实际工艺-印花工艺name(逗号分隔)
        actualPrintUuid: '', // 印花方式id
        actualPrint: {}, // 印花方式,
        actualPrintnValue: '', // 印花方式,
        versionValue: '',
        printPic: '', // 印花图案
        status: '',
        // enabled: '',
        updator: null,
        flowerVersions: []
      }
    },
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign(this.order, res.data)
      this.beforeCode = {
        id: this.order.id,
        code: this.order.flowerCode
      }
      this.setOrder(this.order)
    },
    getActualTechnology(res) {
      this.formDataThreePart[0].options = res.data.map(item => {
        item.disabled = item.enabled !== 'Y'
        return item
      })
    },
    // 审核
    approve() {
      this.comMethod('审核', () => {
        return approve({ id: this.order.id })
      }, 'approve')
    },
    // 变更
    change() {
      this.comMethod('变更', () => {
        return change({
          id: this.order.id, actualTechnologyUuids: this.order.actualTechnology.length && this.order.actualTechnology.map(item => {
            return item.uuid
          }) || [],
          actualPrintModeUuid: this.order.actualPrintUuid || ''
        })
      }, 'change')
    },
    // 驳回
    disapprove() {
      this.comMethod('驳回', () => {
        return disapprove({ id: this.order.id })
      }, 'disapprove')
    },
    // 统一方法
    comMethod(des, call, type) {
      this.$confirm(`你确认要${des}该数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await call()
          if (res.code === 200) {
            this.getOrder(this.order.id)
            if (type === 'change') {
              this.isEdit = true
            }
            this.$message({
              message: `${des}成功`,
              type: 'success'
            })
            this.fetchLog(
              this.getLogMessages('UPDATE', `${configData.colorRequestPrefix}/api/flower/flowerManage/${type}`, 'color'),
              { code: this.order.flowerCode },
              JSON.stringify({
                beforeText: `在'色号花号库-花号管理'${des}一条记录 编码:${this.order.flowerCode}`
              })
            )
          } else {
            this.$message({
              message: `${des}失败`,
              type: 'error'
            })
          }
        })
    },
    // 取消
    cancel() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.$router.push(`/color-library/flower-management/list`)
        })
    },

    setOrder(order) {
      this.order.actualTechnology = []
      this.order.soValue = order.isSo === 1 ? '是' : '否'
      this.order.actualPrintValue = order.flowerVersions ? order.flowerVersions[0].actualPrint && order.flowerVersions[0].actualPrint.name : ''
      this.order.actualPrintUuid = order.flowerVersions ? order.flowerVersions[0].actualPrint && order.flowerVersions[0].actualPrint.uuid : ''
      const Ids = order.flowerVersions[0].actualTechnologyUuids && order.flowerVersions[0].actualTechnologyUuids.split(',')
      const Names = order.flowerVersions[0].actualTechnologyNames && order.flowerVersions[0].actualTechnologyNames.split(',')
      const pNames = order.printTechnologyNames.split(',')
      if (!order.flowerVersions[0].actualTechnologyUuids && order.flowerVersions[0].status === 0) {
        if (pNames.length <= 2) {
          order.printTechnologyUuids && order.printTechnologyUuids.split(',').forEach((item, index) => {
            const flag = this.formDataThreePart[0].options.find(itemA => {
              return itemA.uuid === item
            })
            flag && this.order.actualTechnology.push({ uuid: item, name: pNames[index] })
          })
          this.order.actualTechnologyNames = order.printTechnologyNames
        }
      } else {
        Ids && Ids.forEach((item, index) => {
          const flag = this.formDataThreePart[0].options.find(itemA => {
            return itemA.uuid === item
          })
          flag && this.order.actualTechnology.push({ uuid: item, name: Names[index] })
        })
        this.order.actualTechnologyNames = order.flowerVersions[0].actualTechnologyNames
      }
      this.order.status = order.flowerVersions && order.flowerVersions[0].status
      // this.order.enabled = order.flowerVersions && order.flowerVersions[0].enabled
      this.order.updator = order.flowerVersions && order.flowerVersions[0].updator
      this.order.updatedTime = order.flowerVersions && order.flowerVersions[0].updatedTime
      this.order.createdTime = order.flowerVersions && order.flowerVersions[0].createdTime
      this.order.flowerCode = order.flowerVersions && order.flowerVersions[0].flowerCode
      this.order.versionValue = order.flowerVersions ? ('版本：' + order.flowerVersions[0].version) : '版本：V1'
      this.order.versionOptions = order.flowerVersions.map((item, index) => {
        return {
          version: item.version
        }
      })
    },
    // 版本设置信息
    versionChange(index) {
      const val = this.order.flowerVersions.length - index.substring(1)
      this.order.versionValue = '版本：' + index
      this.order.actualPrintValue = this.order.flowerVersions[val].actualPrint && this.order.flowerVersions[val].actualPrint.name || ''
      this.order.actualPrintUuid = this.order.flowerVersions[val].actualPrint && this.order.flowerVersions[val].actualPrint.uuid || ''
      this.order.actualTechnologyNames = this.order.flowerVersions ? this.order.flowerVersions[val].actualTechnologyNames : ''
      this.order.actualTechnologyUuids = this.order.flowerVersions ? this.order.flowerVersions[val].actualTechnologyUuids : ''
      this.order.status = this.order.flowerVersions && this.order.flowerVersions[val].status
      // this.order.enabled = this.order.flowerVersions && this.order.flowerVersions[val].enabled
      this.order.updator = this.order.flowerVersions && this.order.flowerVersions[val].updator
      this.order.updatedTime = this.order.flowerVersions && this.order.flowerVersions[val].updatedTime
      this.order.flowerCode = this.order.flowerVersions && this.order.flowerVersions[val].flowerCode
      this.order.createdTime = this.order.flowerVersions && this.order.flowerVersions[val].createdTime
    },
    // 提交
    submitForm(type) {
      // console.log(this.order, 'form数据')
      if (type === 'submit') {
        if (!this.isEdit && !this.order.actualTechnology.length) {
          this.$message({
            type: 'warning',
            message: '请选择印花工艺！'
          })
          return
        }
        this.$refs.formDataThreePart.$refs.form.validate(async(valid) => {
          if (valid) {
            // 编辑
            this.$confirm(' 请确认提交该数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(async() => {
              const res = await submit({
                id: this.order.id,
                actualTechnologyUuids: this.order.actualTechnology.length && this.order.actualTechnology.map(item => {
                  return item.uuid
                }) || [],
                actualPrintModeUuid: this.order.actualPrintUuid || ''
              })
              if (res.code !== 200) {
                return
              }
              this.isEdit = false
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              const { beforeCode, afterCode } = this.compareData(
                this.beforeCode,
                {
                  id: this.order.id,
                  code: res.data.code
                },
                'id'
              )
              this.fetchLog(
                this.getLogMessages(
                  'UPDATE',
                  `${configData.colorRequestPrefix}/api/flower/flowerManage/submit`, 'color'
                ),
                afterCode,
                JSON.stringify({
                  beforeText: `在'色号花号库-花号管理'提交一条记录 编码:${res.data.code}`,
                  afterText: '修改为',
                  ...{ beforeCode, afterCode }
                })
              )
              this.$nextTick(function() {
                if (this.$route.path.includes('show')) {
                  this.getOrder(this.order.id)
                } else {
                  this.$store.dispatch('tagsView/delView', this.$route)
                  this.$router.push(`/color-library/flower-management/flower-code/${this.order.id}/show`)
                }
              })
            })
            return
          } else {
            console.log('error submit!!')
            return false
          }
        })
        return
      }
      // 保存
      this.$confirm(' 请确认保存该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async() => {
        const obj = {
          id: this.order.id,
          actualTechnologyUuids: this.order.actualTechnology.length && this.order.actualTechnology.map(item => {
            return item.uuid
          }) || [],
          actualPrintModeUuid: this.order.actualPrintUuid || ''
        }
        const res = await update(obj)
        if (res.code !== 200) {
          return
        }
        this.isEdit = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        const { beforeCode, afterCode } = this.compareData(
          this.beforeCode,
          {
            id: this.order.id,
            code: res.data.code
          },
          'id'
        )
        this.fetchLog(
          this.getLogMessages(
            'UPDATE',
            `${configData.colorRequestPrefix}/api/flower/flowerManage/update`, 'color'
          ),
          afterCode,
          JSON.stringify({
            beforeText: `在'色号花号库-花号管理'保存一条记录 编码:${res.data.code}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        this.$nextTick(function() {
          this.$refs.formDataThreePart.$refs.form.clearValidate()
          if (this.$route.path.includes('show')) {
            this.getOrder(this.order.id)
          } else {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push(`/color-library/flower-management/flower-code/${this.order.id}/show`)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tableitem {
  width: 100%;
  .title {
    // width: 130px;
    // text-align: right;
    font-size: 16px;
    color: #151222;
    padding-right: 12px;
    line-height: 52px;
  }
  .table {
    flex: 1;
    /deep/.el-form-item__content {
      margin-bottom: 20px;
    }
  }
}
.content-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  .label {
    width: 130px;
    padding-right: 12px;
    text-align: right;
    box-sizing: border-box;
  }
  .el-input {
    width: 170px;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    color: #777474;
  }
}
.pointer {
  height: 32px;
  cursor: pointer;
  margin-left: 5px;
}
/deep/.el-form-item {
  margin-bottom: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #777474;
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
.version {
  width: 100px;
  margin-left: 10px;
}
.img-box {
  display: flex;
  margin-top: 11px;
  .title {
    width: 135px;
    font-weight: 400;
    font-size: 14px;
    text-align: right;
    padding-right: 12px;
    box-sizing: border-box;
    color: #888e9e;
  }
}
.product-btn-group {
  z-index: 999;
}
</style>
