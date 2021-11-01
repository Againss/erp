<template>
  <div class="cont">
    <div class="srm-main">
      <el-tabs
        v-model="activeName"
        style="position: relative"
        :before-leave="beforeLeave"
      >
        <!-- 基本资料 -->
        <el-tab-pane class="tab-panel" name="baseinfo">
          <span slot="label" class="label">基本资料</span>
          <base-info
            ref="baseinfo"
            :info="details.supplierInfo"
            :set-data="setData"
          />
        </el-tab-pane>
        <!-- 开户信息 -->
        <el-tab-pane class="tab-panel" name="openinfo">
          <span slot="label" class="label">开户信息</span>
          <open-info
            v-if="activeName === 'openinfo'"
            ref="openinfo"
            :info="details.supplierExtra"
            :set-data="setData"
          />
        </el-tab-pane>
        <!-- 产品信息 -->
        <el-tab-pane class="tab-panel" name="productinfo">
          <span slot="label" class="label">产品信息</span>
          <product-info
            v-if="activeName === 'productinfo'"
            ref="productinfo"
            :info="details.supplierProduct"
            :set-data="setData"
          />
        </el-tab-pane>
        <!--  设备信息-->
        <el-tab-pane class="tab-panel" name="settinginfo">
          <span slot="label" class="label">设备信息</span>
          <setting-info
            v-show="activeName === 'settinginfo'"
            ref="settinginfo"
            :info="details.equipment"
            :set-data="settingTabsChange"
          />
        </el-tab-pane>
        <!--证件信息-->
        <el-tab-pane class="tab-panel" name="cardinfo">
          <span slot="label" class="label">证件信息</span>
          <card-info
            v-if="activeName === 'cardinfo'"
            ref="cardinfo"
            :info="details.supplierDocument"
            :set-data="setData"
          />
        </el-tab-pane>
        <!--往来记录-->
        <el-tab-pane class="tab-panel" name="correspondence">
          <span slot="label" class="label">往来记录</span>
          <correspondence
            v-if="activeName === 'correspondence'"
            ref="correspondence"
          />
        </el-tab-pane>
        <!--账号管理-->
        <el-tab-pane class="tab-panel" name="account">
          <span slot="label" class="label">账号管理</span>
          <account-manage
            v-if="activeName === 'account'"
            ref="account"
          />
        </el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button
          v-if="showBtn.imp"
          class="import-btn"
          size="small"
          @click.stop="btnClick('imp')"
        >导入</el-button>
        <!-- <el-button
          v-if="showBtn.exp"
          size="small"
          @click.stop="btnClick('exp')"
        >导出</el-button> -->
        <el-button
          v-if="showBtn.add"
          type="primary"
          size="small"
          @click.stop="btnClick"
        >新增</el-button>
      </div>
    </div>
    <bottomBar :config="btns" />
    <approve
      v-if="approveConfig.visible"
      :config="approveConfig"
      @close="approveConfig.visible = false"
    />
    <div class="importPop">
      <cs-custom-pop :options="importPopRes" />
    </div>
  </div>
</template>

<script>
import * as api from './api/index'
import BaseInfo from './components/base-info'
import OpenInfo from './components/open-info'
import ProductInfo from './components/product-info'
import SettingInfo from './components/setting-info'
import CardInfo from './components/card-info'
import Correspondence from './components/correspondence'
import AccountManage from './components/account-manage'
import bottomBar from '@/components/button-bar/index.vue'
import approve from '@/components/approve/index.vue'
// import downloadTemplate from './components/common/download.vue'
import importPop from './components/common/import-pop'
// import uploadSlotTrigger from './components/common/upload-slot-trigger.vue'
export default {
  name: 'SuppliersDetail',
  components: {
    BaseInfo,
    OpenInfo,
    ProductInfo,
    SettingInfo,
    CardInfo,
    Correspondence,
    AccountManage,
    bottomBar,
    approve
  },
  data() {
    const approveConfig = {
      visible: false,
      pass: () => {
        this.appInfo(1)
      },
      back: () => {
        this.appInfo(0)
      }
    }
    const btns = {
      _aduit: {
        type: 'primary',
        text: '审核',
        submit: () => {
          this.approveConfig.visible = true
        },
        isShow: () => this.type === 'detail' && this.details.supplierInfo && this.details.supplierInfo.status === 1 && this.$permission(['srm:supplier:audit'])
      },
      _recall: {
        type: '',
        text: '撤回',
        submit: () => {
          this.$confirm('是否确认撤回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'OrderDetail'
          }).then(() => {
            this.revokeHandle()
          })
        },
        isShow: () => this.type === 'detail' && this.details.supplierInfo && this.details.supplierInfo.status === 1
      },
      _submit: {
        type: 'primary',
        text: '提交',
        submit: () => {
          this.save(1)
        },
        isShow: () => {
          const arr = [
            this.type === 'edit',
            this.activeName !== 'correspondence',
            this.activeName !== 'account'
          ]
          return arr.every(e => e)
        }
      },
      _save: {
        type: 'primary',
        text: '保存',
        submit: () => {
          this.save(0)
        },
        isShow: () => {
          const arr = [
            this.type !== 'detail',
            this.activeName !== 'correspondence',
            this.activeName !== 'account',
            this.details.supplierInfo && this.details.supplierInfo.status === 0
          ]
          return arr.every(e => e)
        }
      },
      _update: {
        type: '',
        text: '编辑',
        submit: () => {
          this.onload('edit')
        },
        isShow: () => {
          return [
            this.type === 'detail',
            this.details.supplierInfo && this.details.supplierInfo.status !== 1,
            this.$permission(['srm:supplier:modify'])
          ].every(e => e)
        }
      },
      _back: {
        type: '',
        text: '返回',
        submit: () => {
          this.$router.push({ path: '/srm/suppliers-list' })
        },
        isShow: () => this.type === 'detail'
      },
      _cancel: {
        type: '',
        text: '取消',
        submit: () => {
          if (this.id) {
            this.onload('detail')
          } else {
            this.$router.go(-1)
          }
        },
        isShow: () => this.type !== 'detail'
      }
    }
    const importPopRes = {
      itemType: 'dialog',
      visible: false,
      title: '导入信息',
      cancelHidden: true,
      okHidden: true,
      width: '730px',
      height: '261px',
      formDatas: {},
      content: [
        {
          components: { importPop },
          componentsOptions: {
            action: `/srm/supplierDeviceInfo/supplierMerge/import`,
            downApi: 'srm/supplierDeviceInfo/supplierMerge/excel/template/download',
            showFileList: false,
            accept: '.xlsx,.xls,XLSX,.XLS',
            data: {
              raw: true,
              serviceProviderId: this.$route.query.id || ''
            },
            timeout: 30000,
            onSuccess: (res, file) => {
              if (res.data.code === 200) {
                this.$message.success('导入成功')
              } else {
                this.$message.error(res.data.message || '')
              }
              if (this.activeName === 'settinginfo') {
                this.$refs['settinginfo'].getList()
              } else {
                const id = res.data.data && res.data.data.supplierId
                if (id) {
                  this.$router.push({
                    path: '/srm/suppliers-list/detail',
                    query: { id }
                  })
                }
              }
            },
            onError: (res, file) => {
              console.log(res, '错误上传')
            },
            onProgress: () => {}
          }
        }
      ]
    }
    return {
      id: '',
      activeName: 'baseinfo',
      details: {},
      detailsCopy: {},
      btns,
      approveConfig,
      importPopRes
    }
  },
  computed: {
    type() {
      return this.$route.params.type
    },
    showBtn() {
      const bool = this.type !== 'detail' && this.$route.query.id
      if (this.activeName === 'settinginfo') {
        if (!this.details.equipment || !this.details.equipment.length) {
          return { add: false, imp: false, exp: false }
        }
      }
      const add = [
        bool,
        this.activeName !== 'baseinfo'
      ].every(e => e)
      const imp = [
        ['baseinfo', 'openinfo', 'productinfo'].includes(this.activeName) && this.type === 'insert',
        this.activeName === 'settinginfo' && this.details.equipment && ['supplierKnit', 'ranzheng', 'supplierPrinting'].includes(this.$refs['settinginfo'].ableTabs)
      ].some(e => e)
      const exp = [
        bool,
        this.activeName === 'settinginfo'
      ].every(e => e)
      return { add, imp, exp }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getInfo(this.id)
    } else {
      this.initData()
    }
  },
  methods: {
    beforeLeave(active, old) {
      return new Promise((resolve, reject) => {
        if (old === 'baseinfo') {
          const info = this.$refs.baseinfo.$refs.baseinfo.dynamicValidateFormRuleForm
          const res = JSON.stringify(info) === JSON.stringify(this.detailsCopy.supplierInfo)
          if (!res) {
            this.$confirm('是否保存基本资料当前修改？', {
              type: 'warning'
            }).then(async() => {
              await this.save(info.status === 0 ? 0 : 1)
              resolve()
            }).catch(() => {
              resolve()
              this.details = { ...this.detailsCopy }
              this.$refs.baseinfo.setDataSource(this.details.supplierInfo)
            })
          } else {
            resolve()
          }
        } else {
          resolve()
        }
        if (active === 'settinginfo') {
          this.details.equipment = this.getSettingType()
          this.$refs['settinginfo'].ableTabs = this.details.equipment && this.details.equipment[0] || ''
          this.importPopRes.content[0].componentsOptions.action = 'srm/supplierDeviceInfo/knitting/import'
          this.importPopRes.content[0].componentsOptions.downApi = 'srm/supplierDeviceInfo/knitting/excel/template/download'
          this.$refs['settinginfo'].getList()
          // 获取设备类型、设备名称
          this.$refs['settinginfo'].getSelectName()
        } else {
          this.importPopRes.content[0].componentsOptions.action = 'srm/supplierDeviceInfo/supplierMerge/import'
          this.importPopRes.content[0].componentsOptions.downApi = 'srm/supplierDeviceInfo/supplierMerge/excel/template/download'
        }
      })
    },
    // 数据融合
    setData(key, val) {
      this.details[key] = val
    },
    async getInfo(id) {
      const res = await api.getSupplierInfoByIdData(id)
      const obj = res.data && { ...res.data } || {}
      this.initData(obj)
    },
    async save(type) {
      this.details.supplierInfo = this.$refs.baseinfo.$refs.baseinfo.dynamicValidateFormRuleForm
      let data = null
      let apistr = ''
      const typeStr = type ? '提交' : '保存'
      if (this.activeName === 'baseinfo') {
        let isOk = true
        // 根据状态校验数据 草稿不校验
        if (type) {
          this.$refs.baseinfo.$refs.baseinfo.form.validate(valid => {
            isOk = valid
          })
        }
        if (!isOk) return
        data = { supplierInfo: this.details.supplierInfo, type }
        apistr = '/supplier/addSupplierInfo'
        await api.suppliersInfoSubmit(apistr, data)
        this.$message.success('基本资料' + typeStr + '成功')
      } else if (this.activeName === 'openinfo') {
        data = {
          supplierInfo: { id: this.id },
          supplierExtra: this.details.supplierExtra,
          type
        }
        apistr = '/supplier/addSupplierExtra'
        await api.suppliersInfoSubmit(apistr, data)
        this.$message.success('开户信息' + typeStr + '成功')
      } else if (this.activeName === 'productinfo') {
        data = {
          supplierInfo: { id: this.id },
          supplierProduct: this.details.supplierProduct,
          type
        }
        apistr = '/supplier/addSupplierProduct'
        await api.suppliersInfoSubmit(apistr, data)
        this.$message.success('产品信息' + typeStr + '成功')
      } else if (this.activeName === 'cardinfo') {
        data = {
          supplierInfo: { id: this.id, status: this.details.supplierInfo.status },
          supplierDocument: this.details.supplierDocument,
          type
        }
        apistr = '/supplier/addSupplierDocument'
        await api.suppliersInfoSubmit(apistr, data)
        this.$message.success('证件信息' + typeStr + '成功')
      } else if (this.activeName === 'settinginfo') {
        // data = {
        //   supplierInfo: {
        //     id: this.id,
        //     status: this.details.supplierInfo.status,
        //     supplierCategory: this.details.supplierInfo.supplierCategory,
        //     supplierTypeIdList: this.details.supplierInfo.supplierTypeIdList
        //   },
        //   equipment: this.details.equipment,
        //   type
        // }
        // apistr = '/supplier/addequipment'
        // await api.suppliersInfoSubmit(apistr, data)
        this.$message.success('设备信息' + typeStr + '成功')
        return
      }
      const str = type ? '提交' : this.type === 'insert' ? '新增' : '修改'
      const description = {
        beforeText: `在'供应商采购-供应商列表'${str}了一条数据`,
        beforeCode: data
      }
      const opratorType = this.type === 'insert' ? 'INSERT' : `UPDATE`
      this.$store.dispatch('app/fetchParamsLog', {
        params: data,
        opratorType,
        api: 'srm/' + apistr,
        description,
        appId: 'srm'
      })
      if (this.type === 'insert') {
        this.$router.push({ path: '/srm/suppliers-list' })
      } else {
        if (this.activeName === 'baseinfo' && type && this.details.supplierInfo.status === 0) {
          this.onload('detail')
        } else {
          this.getInfo(this.id)
        }
      }
    },
    settingTabsChange(val) {
      const arr = {
        supplierKnit: [
          'srm/supplierDeviceInfo/knitting/import',
          'srm/supplierDeviceInfo/knitting/excel/template/download'
        ],
        ranzheng: [
          'srm/supplierDeviceInfo/dyeingAndFinishingPlant/import',
          'srm/supplierDeviceInfo/dyeingAndFinishingPlant/excel/template/download'
        ],
        supplierPrinting: [
          'srm/supplierDeviceInfo/printing/import',
          'srm/supplierDeviceInfo/printing/excel/template/download'
        ]
      }
      if (this.details.equipment && ['supplierKnit', 'ranzheng', 'supplierPrinting'].includes(val)) {
        this.importPopRes.content[0].componentsOptions.action = arr[val][0]
        this.importPopRes.content[0].componentsOptions.downApi = arr[val][1]
      }
    },
    btnClick(type) {
      if (type === 'exp') {
        this.$refs[this.activeName].bindExport()
      } else if (type === 'imp') {
        this.importPopRes.visible = true
      } else {
        this.$refs[this.activeName].bindAdd()
      }
    },
    onload(type) {
      this.$router.push({
        path: '/srm/suppliers-list/' + (type || this.type),
        query: { id: this.id }
      })
    },
    initData(obj) {
      if (this.type === 'insert') {
        this.details = {
          supplierInfo: {
            status: 0,
            registeredCapitalUnit: 0
          },
          supplierExtra: {
            contact: [],
            address: [],
            bank: []
          },
          supplierProduct: {
            productMain: [],
            productNew: []
          },
          supplierDocument: []
        }
      } else {
        // 证件信息数据处理
        if (obj.supplierDocument && Array.isArray(obj.supplierDocument)) {
          const arr = obj.supplierDocument.map(e => {
            if (typeof e.attachmentUrl === 'string') {
              const newArr = e.attachmentUrl.split(',').reduce((w, s, i) => {
                const nameArr = e.attachmentName.split(',')
                const url = s && s.includes('aliyuncs.com') ? s : 'https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/' + s
                w.push({ name: nameArr[i], url })
                return w
              }, [])
              return {
                ...e,
                attachmentUrlCopy: newArr,
                mainDevice: [e.startDate, e.endDate]
              }
            }
          })
          obj.supplierDocument = arr
        }
        // 审批流程Id
        this.approveConfig.procInstId = obj.supplierInfo.approvalProcessKey
        this.approveConfig.workflowId = obj.supplierInfo.supplierNo
        this.details = { ...obj }
        this.details.equipment = this.getSettingType()
        this.$nextTick(() => {
          this.$refs.baseinfo && this.$refs.baseinfo.$refs.baseinfo.form.clearValidate()
        })
      }
      this.detailsCopy = { ...this.details }
    },
    appInfo(val) {
      const str = val ? '通过' : '驳回'
      this.$store.dispatch('app/fetchParamsLog', {
        params: {
          supplierNo: this.details.supplierInfo.supplierNo
        },
        opratorType: 'EXAMINE',
        api: '/sysSettings/workflow/workflowTask',
        description: {
          beforeText: '在供应商列表审核' + str + '了一条数据',
          beforeCode: {
            supplierNo: this.details.supplierInfo.supplierNo
          }
        },
        appId: 'srm'
      })
      this.getInfo(this.id)
      if (this.activeName === 'settinginfo') {
        this.activeName = 'baseinfo'
      }
    },
    async revokeHandle() {
      await api.revoke(this.details.supplierInfo.supplierNo)
      this.$store.dispatch('app/fetchParamsLog', {
        params: { supplierNo: this.details.supplierInfo.supplierNo },
        opratorType: 'EXAMINE',
        api: 'srm/supplier/revoke/',
        description: {
          beforeText: '在供应商列表撤回了一条供应商' + this.details.supplierInfo.supplierNo,
          beforeCode: { supplierNo: this.details.supplierInfo.supplierNo }
        },
        appId: 'srm'
      })
      this.getInfo(this.id)
    },
    // 设备信息获取供应商类型
    getSettingType() {
      // undefined类型没值 0该类没有设备 1采购-纱供应商 2针织 3染整 4印花 5染纱
      const data = this.details.supplierInfo
      if (!data.supplierTypeIdList) {
        return undefined
      }
      const ids = data.supplierTypeIdList || []
      const bool = data.supplierCategory === 1
      const value = {
        supplierDeviceInfos: !bool && ids.includes(1),
        supplierKnit: bool && ids.includes(10003),
        supplierDevice: bool && ids.includes(10002),
        ranzheng: bool && ids.includes(10001),
        supplierPrinting: bool && ids.includes(10004),
        supplierOther: bool && (ids.includes(10001) || ids.includes(10004))
      }
      return Object.keys(value).filter(e => value[e])
    }
  }
}
</script>

<style lang="scss" scoped>
.importPop {
  /deep/ .el-dialog__body {
    padding: 30px 40px 30px 50px;
  }
}
  .btns {
    position: absolute;
    top: 14px;
    right: 20px;
    .import-btn {
      color: #1890ff;
      border-color: #1890ff;
    }
  }
  .cont {
    /deep/ .ButtonBar .button-group {
      z-index: 1000;
    }
  }
  .srm-main {
    margin-bottom: 78px;
    background: #fff;
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__nav-wrap {
      padding: 0 20px;
      margin: 0;
    }
  }
  /deep/ .el-tabs__item {
    height: 62px;
    line-height: 62px;
  }
  /deep/ .table-details thead tr th {
    background:#f5f7fa;
  }
  .el-tabs__item {
    text-align: center;
  }
  .panel-table {
    padding-top: 5px;
  }
  .panel-btns {
    text-align: right;
    padding-bottom: 15px;
    border-bottom: solid 1px #e9eff2;
  }
  .details-main {
    padding: 0 20px 20px;
    /deep/ .el-tabs__nav-wrap {
      padding: 0;
    }
    /deep/ .el-tabs__item {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      color: #151222;
      font-weight: 500;
      font-size: 14px;
    }
    /deep/ .is-active {
      color: #0986ff;
    }
  }
</style>
