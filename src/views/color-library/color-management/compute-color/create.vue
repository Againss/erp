<!--
 * @Author: Sanmao
 * @Date: 2020-11-03 16:44:06
 * @LastEditors: Againss
 * @LastEditTime: 2021-04-23 10:49:12
 * @Descripttion: 色号管理-电脑对色
-->
<template>
  <div class="product-list-content product-detail-content compute-color">
    <header>
      <span class="order-code">智布色号：{{ order.code || "" }}</span>
      <span v-if="!isEdit" class="order-info">
        操作人：{{ order.updator && order.updator.name }} &nbsp;操作时间：{{
          $filters.parseTime(order.operatedTime || 0, "{y}-{m}-{d} {h}:{i}")
        }}&nbsp; 状态：<span
          :class="{
            Audited: order.status === 4,
            Pending: order.status !== 4,
            disabled: order.enabled === 'N',
          }"
        >{{ getStatus() }}</span>
      </span>
    </header>
    <section class="product-item-content" style="margin: 16px 0">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formfirstPart"
          :is-edit="false"
          :form-data="formDatafirstPart"
          :order="order"
        />
      </div>
    </section>
    <section class="computercolor-wrap m-b-62">
      <div class="wrap-header">
        <span>电脑对色</span>
        <el-button
          v-show="isEdit"
          v-permission="['color:Api:ColorManage:Datacolor:refresh']"
          type="primary"
          size="small"
          @click="dialogHandler"
        >刷新</el-button>
      </div>
      <cs-custom-form
        ref="computerColor"
        class="p-10"
        :data-source="computerColorDataSource"
      />
      <div class="wrap-header">
        <span>电脑读数</span>
      </div>
      <cs-custom-form
        ref="computerNumber"
        class="p-10"
        :data-source="computerNumberDataSource"
      />
    </section>
    <footer class="page-footer">
      <el-button
        v-show="!isEdit && $route.query.status === '2'"
        v-permission="['color:Api:ColorManage:Datacolor:update']"
        type="primary"
        @click="editOrder"
      >编辑</el-button>
      <el-button
        v-if="isEdit"
        type="primary"
        @click="saveOrder"
      >提交</el-button>

      <el-button
        v-show="
          !isEdit &&
            order.enabled !== 'N' &&
            ($route.query.status === '4' || $route.query.status === '3')
        "
        v-permission="['color:Api:ColorManage:ColorManage:copy']"
        type="primary"
        @click="copyOrder"
      >复制</el-button>
      <el-button v-if="isEdit" @click="cancel">取消</el-button>
    </footer>
    <dialogs ref="compoterColor" :options="dialogOptions" />
  </div>
</template>
<script>
import item from '@/views/product-center/components/detaiItem'
import dialogs from '@/views/product-center/components/dialog'
import expandColumns from './components/expand-columns.vue'
import { store, refreshList, show, update } from './api/index.js'
import configData from '@/views/product-center/configDock/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  name: 'ColorManagementComputerColor',
  components: {
    dialogs,
    item
  },
  mixins: [logMethods],
  data() {
    // 刷新弹窗数据
    const dialogOptions = {
      visible: false,
      width: '826px',
      title: '电脑对色结果',
      okText: '确定',
      cancelText: '取消',
      closed: (params) => {
        this.dialogHandle(params)
      }, // 关闭选择
      ok: (params) => {
        if (!params) {
          this.$message.error('请选择数据！')
          return false
        }
        this.setDatacolor(params)
        this.dialogHandle(false)
      },
      maxHeight: '500',
      border: false,
      rowKey: (row) => {
        return row && (row.id || '')
      },
      expandRowKeys: [],
      dataSource: [], // table数据
      columns: [
        {
          prop: '',
          type: 'expand',
          components: {
            expandColumns
          }
        },
        {
          prop: 'name',
          label: '比样名称',
          minWidth: '100',
          showOverflowTooltip: true
        },
        {
          prop: 'dl',
          label: 'DL*',
          minWidth: '80',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.dl + '' ? scope.row.dl : ''
          }
        },
        {
          prop: 'da',
          label: 'DA*',
          minWidth: '80',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.da + '' ? scope.row.da : ''
          }
        },
        {
          prop: 'db',
          label: 'DB*',
          minWidth: '80',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.db + '' ? scope.row.db : ''
          }
        },
        {
          prop: 'dc',
          label: 'DC*',
          minWidth: '80',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.dc + '' ? scope.row.dc : ''
          }
        },
        {
          prop: 'dh',
          label: 'DH*',
          minWidth: '80',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.dh + '' ? scope.row.dh : ''
          }
        },
        {
          prop: 'decmc',
          label: 'DEcmc*',
          minWidth: '80',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.decmc + '' ? scope.row.decmc : ''
          }
        },
        {
          prop: 'pfdecmc',
          label: 'P/F DEcmc',
          minWidth: '90',
          showOverflowTooltip: true
        }
      ]
    }
    // 电脑对色数据
    const computerColorColumns = [
      {
        prop: 'name',
        label: '比样名称',
        showOverflowTooltip: true
      },
      {
        prop: 'dl',
        label: 'DL*',
        formater: (scope) => {
          return scope.row.dl + '' ? scope.row.dl : ''
        }
      },
      {
        prop: 'da',
        label: 'Da*',
        formater: (scope) => {
          return scope.row.da + '' ? scope.row.da : ''
        }
      },
      {
        prop: 'db',
        label: 'Db*',
        formater: (scope) => {
          return scope.row.db + '' ? scope.row.db : ''
        }
      },
      {
        prop: 'dc',
        label: 'DC*',
        formater: (scope) => {
          return scope.row.dc + '' ? scope.row.dc : ''
        }
      },
      {
        prop: 'dh',
        label: 'DH*',
        formater: (scope) => {
          return scope.row.dh + '' ? scope.row.dh : ''
        }
      },
      {
        prop: 'decmc',
        label: 'DEcmc',
        formater: (scope) => {
          return scope.row.decmc + '' ? scope.row.decmc : ''
        }
      },
      {
        prop: 'pfdecmc',
        label: 'P/F DEcmc'
      }
    ]
    const computerColorDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: computerColorColumns,
        size: 'mini'
      }
    ]
    // 电脑读数数据
    const computerNumberColumns = [
      {
        prop: 'name',
        label: '比样名称'
      },
      {
        prop: 'sr',
        label: 'sR',
        formater: (scope) => {
          return scope.row.sr + '' ? scope.row.sr : ''
        }
      },
      {
        prop: 'sg',
        label: 'sG',
        formater: (scope) => {
          return scope.row.sg + '' ? scope.row.sg : ''
        }
      },
      {
        prop: 'sb',
        label: 'sB',
        formater: (scope) => {
          return scope.row.sb + '' ? scope.row.sb : ''
        }
      },
      {
        prop: 'l',
        label: 'L*',
        formater: (scope) => {
          return scope.row.l + '' ? scope.row.l : ''
        }
      },
      {
        prop: 'a',
        label: 'a*',
        formater: (scope) => {
          return scope.row.a + '' ? scope.row.a : ''
        }
      },
      {
        prop: 'b',
        label: 'b*',
        formater: (scope) => {
          return scope.row.b + '' ? scope.row.b : ''
        }
      },
      {
        prop: 'c',
        label: 'C*',
        formater: (scope) => {
          return scope.row.c + '' ? scope.row.c : ''
        }
      },
      {
        prop: 'h',
        label: 'H°',
        formater: (scope) => {
          return scope.row.h + '' ? scope.row.h : ''
        }
      }
    ]
    const computerNumberDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: computerNumberColumns,
        size: 'mini'
      }
    ]
    // 附加信息编辑
    const formDatafirstPart = [
      // {
      //   name: 'code',
      //   type: 'input',
      //   label: '智布色号：'
      // },
      {
        name: 'colorPlateOrderCode',
        type: 'input',
        label: '色板单号'
      },
      {
        name: 'customerColor',
        type: 'input',
        label: '客户颜色'
      },
      {
        name: 'clothValue',
        type: 'input',
        label: '布类'
      },
      {
        name: 'ingredientRatio',
        type: 'input',
        label: '成份比例'
      },
      {
        name: 'requirmentValue',
        type: 'input',
        label: '工艺要求'
      },
      {
        name: 'purposeValue',
        type: 'input',
        label: '用途'
      },
      {
        name: 'firstLightValue',
        type: 'input',
        label: '1st对色光源'
      },
      {
        name: 'secondLightValue',
        type: 'input',
        label: '2nd对色光源'
      },
      {
        name: 'thirdLightValue',
        type: 'input',
        label: '3rd对色光源'
      },
      {
        name: 'colorManageYarnValue',
        type: 'input',
        label: '纱信息'
      },
      {
        name: 'dyeTypeValue',
        type: 'input',
        label: '染色类型'
      }
    ]

    return {
      formDatafirstPart,
      isEdit: true,
      computerColorDataSource,
      computerNumberDataSource,
      dialogOptions,
      order: {}
    }
  },
  created() {
    this.initOrder()
    if (this.$route.params.id) {
      if (this.$route.path.includes('show')) {
        this.isEdit = false
      }

      this.getOrder(this.$route.params.id)
    }
  },
  methods: {
    getRowKeys(row) {
      return row.id
    },
    /**
     * @description 状态
     */
    getStatus() {
      if (this.order.enabled === 'N') {
        return '已禁用'
      }
      let str = ''
      switch (this.order.status) {
        case 1:
          str = '待对色'
          break
        case 2:
          str = '待录入配方'
          break
        case 3:
          str = '待审核'
          break
        case 4:
          str = '已审核'
          break
        default:
          str = ''
          break
      }
      return str
    },
    // 初始化
    initOrder() {
      this.order = {
        code: '',
        colorPlateTypeUuid: '', // 色板类型
        bdClothUuid: 0, // 布类
        clothValue: null, // 布类
        requirement: [], // 工艺要求
        requirmentValue: '',
        purpose: '', // 用途
        purposeValue: '', // 用途
        bdFirstLightUuid: '', // 1st对色光源
        firstLightValue: '', // 1st对色光源
        bdSecondLightUuid: '', // 2nd对色光源
        secondLightValue: '', // 2nd对色光源
        bdThirdLightUuid: '', // 3rd对色光源
        thirdLightValue: '', // 3rd对色光源
        ingredientRatio: '', // 成分比例
        dyeType: '', // 染色类型 1:单染 2:双染 3:三染 4:四染a
        dyeTypeValue: '', // 染色类型 1:单染 2:双染 3:三染 4:四染
        colorManageYarn: [], // 纱信息
        colorManageYarnValue: '',
        operatedTime: '',
        datacolor: { operator: null, operatorTime: null, data: [] },
        customerColor: '', // 客户颜色
        colorPlateOrderCode: ''// 色板单号
      }
    },
    /**
     * @description 获取详情数据
     */
    async getOrder(id) {
      if (!id) {
        return
      }
      const res = await show({ id })

      this.setOrder(res.data)
    },
    /**
     * @description 设置数据
     */
    setOrder(data) {
      // console.log(data, "data");
      let order = null
      // if (type === "edit") {
      //   this.order = Object.assign({}, data);
      //   order = JSON.parse(JSON.stringify(data));
      //   this.order.datacolor = { operator: null, operatorTime: null, data: [] };
      // } else {
      this.order = Object.assign({}, data.colorManage)
      order = JSON.parse(JSON.stringify(data.colorManage))
      this.order.datacolor = data.datacolor
      this.$set(
        this.computerNumberDataSource[0],
        'dataSource',
        data.datacolor.data
      )
      this.$set(
        this.computerColorDataSource[0],
        'dataSource',
        data.datacolor.data
      )
      // }
      this.order.purposeValue = order.purpose
        ? order.purpose === 1
          ? '衫身'
          : '下栏'
        : ''
      this.order.clothValue = (order.cloth && order.cloth.name) || ''
      const requirement = [...order.requirement.function, ...order.requirement.normal, ...order.requirement.print, ...order.requirement.styleFeel]
      this.order.requirmentValue = requirement.reduce((str, item) => {
        if (str) {
          // 普通已经拼好
          str += ',' + (item && (item.parent && item.type !== 1 ? (item.parent.name + '-' + item.name) : item.name))
        } else {
          str = (item && (item.parent && item.type !== 1 ? (item.parent.name + '-' + item.name) : item.name))
        }
        return str
      }, '') || ''
      // this.order.requirmentValue =
      //   (order.requirement &&
      //     order.requirement.data &&
      //     order.requirement.data.reduce((str, item) => {
      //       if (str) {
      //         str += ',' + (item && item.name)
      //       } else {
      //         str = item && item.name
      //       }
      //       return str
      //     }, '')) ||
      //   ''
      this.order.firstLightValue =
        (order.firstLight && order.firstLight.name) || ''
      this.order.secondLightValue =
        (order.secondLight && order.secondLight.name) || ''
      this.order.thirdLightValue =
        (order.thirdLight && order.thirdLight.name) || ''
      this.order.dyeTypeValue = this.order.dyeType && this.order.dyeType.name
      this.order.colorManageYarnValue = order.colorManageYarn.reduce(
        (str, cru) => {
          const ingredientVal =
            cru.yarnElement &&
            cru.yarnElement.reduce((s, c) => {
              const sv =
                ((c.ingredient && c.ingredient.name) || '') +
                c.ingredientRatio +
                '%'
              if (s) {
                s += '/' + sv
              } else {
                s = sv
              }
              return s
            }, '')
          const strv =
            ((cru.yarnType && cru.yarnType.name) || '') +
            ' ' +
            ((cru.element && cru.element.name) || '') +
            (cru.ingredientType === 1 ? ingredientVal : '100%')
          if (str) {
            str += '\n' + strv
          } else {
            str = strv
          }
          return str
        },
        ''
      )
    },
    /**
     * @description 电脑对色弹窗显示隐藏
     */
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
    },
    /**
     * @description 电脑对色
     */
    async dialogHandler() {
      this.$set(this.dialogOptions, 'visible', true)
      const res = await refreshList({ name: this.order.code })
      // console.log(res, "res");
      if (res.data && res.data.list.length) {
        const arrId = []
        res.data.list.forEach((item) => {
          arrId.push(item.id)
        })
        this.$set(this.dialogOptions, 'dataSource', res.data.list || [])
        this.$set(this.dialogOptions, 'expandRowKeys', arrId)
      }

      this.$set(this.dialogOptions, 'visible', true)
    },
    /**
     * @description 设置电脑对色
     */
    setDatacolor(data) {
      const refreshData = JSON.parse(JSON.stringify(data))
      delete refreshData.child
      delete refreshData.id
      this.$set(this.order.datacolor, 'data', [])
      this.order.datacolor.data.push(refreshData);
      [data].forEach((item) => {
        if (item.child && item.child.length) {
          item.child.forEach((ele) => {
            this.order.datacolor.data.push(ele)
          })
        }
      })
      this.$set(
        this.computerNumberDataSource[0],
        'dataSource',
        this.order.datacolor.data
      )
      this.$set(
        this.computerColorDataSource[0],
        'dataSource',
        this.order.datacolor.data
      )
    },
    /**
     * @description 编辑
     */
    editOrder() {
      this.isEdit = true
    },
    /**
     * @description 复制,进入色号复制页面
     */
    copyOrder() {
      this.$router.push(
        `/color-library/color-management/color-code/${this.order.id}/copy`
      )
    },
    /**
     * @description 保存
     */
    saveOrder() {
      if (
        this.order.datacolor &&
        this.order.datacolor.data &&
        this.order.datacolor.data.length
      ) {
        this.$confirm(' 你确认要提交该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            // 编辑
            if (
              this.$route.params.id &&
              (this.$route.path.includes('show') ||
                this.$route.path.includes('edit'))
            ) {
              const res = await update({
                colorId: this.order.id,
                datacolor: this.order.datacolor.data
              })
              // console.log(res, "编辑");
              if (res.code !== 200) {
                return
              }
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.isEdit = false
              this.$nextTick(function() {
                if (this.$route.params.edit === 'show') {
                  this.getOrder(this.order.id)
                } else {
                  this.$router.push(
                    `/color-library/color-management/computer-color/${this.order.id}/show?status=${this.order.status}`
                  )
                }
              })
              this.fetchLog(
                this.getLogMessages(
                  'UPDATE',
                  `${configData.colorRequestPrefix}/api/datacolor/update`,
                  'color'
                ),
                {
                  id: this.order.id,
                  code: this.order.code,
                  datacolor: this.order.datacolor
                },
                JSON.stringify({
                  beforeText: `在'色号花号库-电脑对色'编辑一条记录`,
                  beforeCode: {
                    id: this.order.id,
                    code: this.order.code,
                    datacolor: this.order.datacolor
                  }
                })
              )
            }
            // 新增
            if (this.$route.params.id && this.$route.path.includes('add')) {
              // console.log("新增");
              const res = await store({
                colorId: this.order.id,
                datacolor: this.order.datacolor.data
              })
              // console.log(res, "res");
              if (res.code !== 200) {
                return
              }
              this.fetchLog(
                this.getLogMessages(
                  'UPDATE',
                  `${configData.colorRequestPrefix}/api/datacolor/store`,
                  'color'
                ),
                {
                  id: this.order.id,
                  code: this.order.code,
                  datacolor: this.order.datacolor
                },
                JSON.stringify({
                  beforeText: `在'色号花号库-电脑对色'编辑一条记录`,
                  beforeCode: {
                    id: this.order.id,
                    code: this.order.code || '',
                    datacolor: this.order.datacolor
                  }
                })
              )
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.$router.push(
                `/color-library/color-management/computer-color/${this.order.id}/show`
              )
            }
          })
          .catch(() => {
            console.log('已取消提交')
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请完善电脑读数、电脑对色数据'
        })
      }
    },
    /**
     * @description 取消
     */
    cancel() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push('/color-library/color-management/list')
        })
        .catch(() => {
          console.log('取消')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.compute-color {
  padding: 16px 20px;
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
  /deep/ .custom-table {
    .el-table-column--selection .cell {
      padding: 0;
    }
    .el-table__expanded-cell {
      padding: 0;
    }
  }
  /deep/ .el-dialog__footer {
    border-top: 0;
  }
  /deep/ .el-table th {
    background: #f5f7fa;
  }
  /deep/.table tr:nth-child(even) {
    background-color: #ffffff;
  }
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .order-code {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #151222;
  }
  .order-info {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #777777;
    i {
      width: 77px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
      font-style: normal;
      background: #fdf6ed;
      border: 1px solid #ffe7c5;
      font-size: 12px;
      color: #e6a23d;
      border-radius: 4px;
    }
  }
}

// .computer-info {
//   border-bottom: 1px solid #eeeff0;
//   margin: 0 20px;
//   padding: 0;
//   background: #fff;
// }

.computercolor-wrap {
  background: #fff;
  padding: 20px 0;
  .wrap-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    padding-top: 0;
    span {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #3c4043;
    }
  }
}
.p-10 {
  padding: 0 10px;
}
.m-b-62 {
  margin-bottom: 62px;
}
footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 62px;
  line-height: 62px;
  transition: left 0.28s;
  // box-shadow: 4px 1px 8px rgb(111, 111, 111);
  border-top: 1px solid #ecf0f3;
  z-index: 1000;
  text-align: center;
  background: #fff;
  & > button {
    margin-right: 15px;
  }
}
.openSidebar {
  footer {
    left: 210px !important;
  }
}
.hideSidebar {
  footer {
    left: 54px;
  }
}
.mobile {
  footer {
    left: 0;
  }
}
</style>
