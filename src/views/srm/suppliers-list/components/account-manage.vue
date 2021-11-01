<template>
  <div class="table-details detail">
    <cs-custom-table
      :columns="columns"
      :data-source="dataSource"
      :operates="operates"
    />
    <div class="pop-box">
      <cs-custom-pop ref="accountPop" :options="accountPop" />
    </div>
  </div>
</template>

<script>
import * as api from '../api/index.js'
import SwitchStatus from '../../public/components/switch-status'
export default {
  name: 'AccountManage',
  data() {
    const telPhoneBlurReg = this.$getRules({
      type: 'phone', trigger: ['blur']
    })
    const emailBlurReg = this.$getRules({
      type: 'email', trigger: ['blur']
    })
    const nameReg = this.$getRules({
      type: 'department',
      pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]+$/,
      message: '只能输入数字字母或汉字',
      trigger: ['blur']
    })
    const columns = {
      _code: {
        prop: 'code',
        label: '序号',
        showOverflowTooltip: true,
        formater: scope => scope.$index + 1
      },
      _realName: {
        prop: 'realName',
        label: '账号'
      },
      _mobile: {
        prop: 'mobile',
        label: '手机号'
      },
      _email: {
        prop: 'email',
        label: '邮箱'
      },
      _isEnabled: {
        prop: 'isEnabled',
        label: '状态',
        components: {
          SwitchStatus
        },
        componentsOptions: {
          formatter: scope => String(scope.row.isEnabled),
          changeHandel: async params => {
            const isEnabled = params.row.isEnabled ? '禁用' : '启用'
            await api.accountDisable({ id: params.row.id, isEnabled: params.row.isEnabled ? 0 : 1 })
            this.$message.success(isEnabled + '成功')
            this.getData()
            const description = {
              beforeText: `在'供应商采购-供应商列表'${isEnabled}了一个账号`,
              beforeCode: {
                id: params.row.id,
                isEnabled: params.row.isEnabled
              }
            }
            const opratorType = `UPDATE`
            this.$store.dispatch('app/fetchParamsLog', {
              params: params.row,
              opratorType,
              api: `/srm/user/updateUserState`,
              description,
              appId: 'srm'
            })
          },
          permission: 'srm:basicData:rankAssess:enable'
        }
      }
    }
    const accountPop = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      width: '600px',
      okText: '确定',
      ok: data => {
        const parmas = { ...data }
        if (!(parmas.mobile || parmas.email)) {
          this.$message.error('手机号或邮箱至少输入一个')
          return
        }
        Object.keys(parmas).forEach(e => {
          if (parmas[e] === '') {
            parmas[e] = null
          }
        })
        this.saveData({ ...parmas })
      },
      cancel: (params) => {
        this.$set(this.accountPop, 'visible', false)
      },
      formDatas: {},
      options: {
        getForm: val => {
          this.formDev = val.$parent
        }
      },
      content: {
        _realName: {
          prop: 'realName',
          itemType: 'input',
          label: '用户名',
          maxlength: 20,
          rules: [{ required: true, message: '请输入用户名' }, nameReg]
        },
        _mobile: {
          prop: 'mobile',
          itemType: 'input',
          label: '手机号',
          rules: [{ ...telPhoneBlurReg }]
        },
        _email: {
          prop: 'email',
          label: '邮箱',
          itemType: 'input',
          rules: [{ ...emailBlurReg }]
        }
      }
    }
    const operates = {
      label: '操作',
      align: 'center',
      dataSource: [
        {
          label: '重置密码',
          isShow: scope => this.type !== 'detail',
          handle: async params => {
            await api.accountReset(params.row.id)
            this.$message.success('密码重置成功')
            const description = {
              beforeText: `在'供应商采购-供应商列表'重置了一个账号密码`,
              beforeCode: { id: params.row.id }
            }
            const opratorType = `UPDATE`
            this.$store.dispatch('app/fetchParamsLog', {
              params: params.row,
              opratorType,
              api: `/srm/user/resetPassword`,
              description,
              appId: 'srm'
            })
          }
        }
      ]
    }
    return {
      columns,
      operates,
      dataSource: [],
      accountPop
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getData()
    }
  },
  methods: {
    async getData() {
      const res = await api.accountPage(this.$route.query.id)
      this.dataSource = res.data || []
    },
    bindAdd(row, index) {
      if (index !== undefined) {
        this.accountPop.formDatas = { ...row, typeIndex: index }
      } else {
        this.accountPop.formDatas = { typeIndex: undefined }
      }
      this.$nextTick(() => {
        this.formDev && this.formDev.form.clearValidate()
      })
      this.accountPop.title = index !== undefined ? '修改' : '新增'
      this.accountPop.visible = true
    },
    async saveData(rows) {
      await api.addUser({
        ...rows,
        supplierId: this.$route.query.id,
        supplierName: '123'
      })
      this.$message.success('保存成功')
      this.getData()
      this.accountPop.visible = false
      const description = {
        beforeText: `在'供应商采购-供应商列表-账号管理'新增了一条数据`,
        beforeCode: rows
      }
      const opratorType = `INSERT`
      this.$store.dispatch('app/fetchParamsLog', {
        params: rows,
        opratorType,
        api: `/srm/user/supplierUser/add`,
        description,
        appId: 'srm'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-details {
    padding: 0 20px 20px;
  }
</style>
