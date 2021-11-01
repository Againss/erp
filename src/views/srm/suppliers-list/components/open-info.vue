<template>
  <div class="details-main">
    <el-tabs v-model="activeName">
      <!-- 联系人 -->
      <el-tab-pane name="contact">
        <span slot="label" class="label">联系人</span>
        <!-- 列表 -->
        <div class="table-details detail">
          <cs-custom-table
            :key="activeName"
            :columns="linkManColumns"
            :data-source="info.contact"
            :operates="linkManPopOperates"
          />
        </div>
      </el-tab-pane>
      <!-- 地址 -->
      <el-tab-pane name="address">
        <span slot="label" class="label">地址</span>
        <div class="panel-content">
          <!-- 列表 -->
          <div class="table-details detail">
            <cs-custom-table
              :key="activeName"
              :columns="addressColumns"
              :data-source="info.address"
              :operates="addressPopOperates"
            />
          </div>
        </div>
      </el-tab-pane>
      <!-- 开户行信息 -->
      <el-tab-pane name="bank">
        <span slot="label" class="label">开户行信息</span>
        <div class="panel-content">
          <!-- 列表 -->
          <div class="table-details detail">
            <cs-custom-table
              :key="activeName"
              :columns="openBankColumns"
              :data-source="info.bank"
              :operates="openBankPopOperates"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 联系人弹框 -->
    <div class="open-info-pop">
      <cs-custom-pop :options="linkManPopBox" />
    </div>
    <!-- 地址弹框 -->
    <div class="open-info-pop">
      <cs-custom-pop :options="addressPopBox" />
    </div>
    <!-- 开户行弹框 -->
    <div class="open-info-pop">
      <cs-custom-pop :options="openBankPopBox" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OpenInfo',
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    setData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    /* 通用验证 */
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    /* 电话号码验证 */
    const telPhoneBlurReg = this.$getRules({ type: 'telephone', trigger: ['blur'] })
    const emailBlurReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    /* 银行卡 */
    // const bankBlurReg = this.$getRules({ type: 'bankCard', trigger: ['blur'] })
    /* 联系人添加弹框 */
    const linkManPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      okText: '确定',
      ok: (params) => {
        this.saveData({ ...params }, 'linkManPopBox')
      },
      cancel: params => {
        this.$set(this.linkManPopBox, 'visible', false)
      },
      content: [
        {
          prop: 'name',
          labelWidth: '100px',
          itemType: 'input',
          label: '姓名:',
          maxlength: '50',
          rules: [{ ...commonBlurReg, message: '姓名不能为空！' }],
          placeholder: '请输入姓名',
          change: (value) => {
            this.linkName = value
          }
        },
        {
          prop: 'phone',
          labelWidth: '100px',
          itemType: 'input',
          maxlength: '20',
          label: '联系电话:',
          rules: [
            { ...commonBlurReg, message: '联系电话不能为空！' },
            { ...telPhoneBlurReg }
          ],
          placeholder: '请输入联系电话'
        },
        {
          prop: 'email',
          labelWidth: '100px',
          itemType: 'input',
          label: '邮箱:',
          rules: [
            { ...commonBlurReg, message: '邮箱不能为空！' },
            { ...emailBlurReg }
          ],
          placeholder: '请输入邮箱'
        },
        {
          prop: 'post',
          labelWidth: '100px',
          itemType: 'select',
          label: '职位:',
          maxlength: '50',
          rules: [{ ...commonBlurReg, message: '职位不能为空！' }],
          dataSource: [
            { label: '总经理/董事长', value: '总经理/董事长' },
            { label: '厂长', value: '厂长' },
            { label: '业务经理', value: '业务经理' },
            { label: '跟单', value: '跟单' }
          ]
        },
        {
          prop: 'isDefault',
          labelWidth: '100px',
          itemType: 'switch',
          activeValue: 1,
          inactiveValue: 0,
          label: '是否默认:'
        }
      ]
    }
    /* 联系人表头参数信息 */
    const linkManColumns = [
      {
        prop: 'post',
        label: '职位',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'name',
        label: '姓名',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'phone',
        label: '联系电话',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'email',
        label: '邮箱',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'isDefault',
        label: '是否选为默认',
        minWidth: '200',
        formater: (scope) => {
          return scope.row[scope.column.property] === 1
            ? '是' : '否'
        }
      }
    ]
    /* 联系人操作栏 */
    const linkManPopOperates = {
      label: '操作',
      width: '260px',
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.deleteData(params.$index)
          }
        },
        {
          label: '修改',
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.addOrEdit({ ...params.row }, 'linkManPopBox', params.$index)
          }
        }
      ]
    }
    /* 地址添加弹框 */
    const addressPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      okText: '确定',
      ok: (params) => {
        this.saveData({ ...params }, 'addressPopBox')
      },
      cancel: params => {
        this.$set(this.addressPopBox, 'visible', false)
      },
      content: [
        {
          prop: 'address',
          labelWidth: '100px',
          itemType: 'input',
          label: '详细地址:',
          maxlength: '50',
          rules: [{ ...commonBlurReg, message: '详细地址不能为空！' }],
          placeholder: '请输入详细地址'
        },
        {
          prop: 'isDefault',
          labelWidth: '100px',
          itemType: 'switch',
          activeValue: 1,
          inactiveValue: 0,
          label: '是否默认:'
        }
      ]
    }
    /* 地址表头参数信息 */
    const addressColumns = [
      {
        prop: 'address',
        label: '详细地址',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'isDefault',
        label: '是否选为默认',
        minWidth: '200',
        formater: (scope) => {
          return scope.row[scope.column.property] === 1
            ? '是' : '否'
        }
      }
    ]
    /* 地址操作栏 */
    const addressPopOperates = {
      label: '操作',
      width: '260px',
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: scope => this.type !== 'detail',
          handle: params => {
            this.deleteData(params.$index)
          }
        },
        {
          label: '修改',
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.addOrEdit({ ...params.row }, 'addressPopBox', params.$index)
          }
        }
      ]
    }
    /* 开户行添加弹框 */
    const openBankPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      okText: '确定',
      ok: (params) => {
        this.saveData({ ...params }, 'openBankPopBox')
      },
      cancel: params => {
        this.$set(this.openBankPopBox, 'visible', false)
      },
      content: [
        {
          prop: 'bankName',
          labelWidth: '100px',
          itemType: 'input',
          label: ' 开户行:',
          rules: [
            { ...commonBlurReg, message: '开户行不能为空！' },
            { max: 50, message: '最大长度为50个字符！', trigger: ['blur'] }
          ],
          placeholder: '请输入开户行'
        },
        {
          prop: 'accountName',
          labelWidth: '100px',
          itemType: 'input',
          label: '账号名称:',
          maxlength: '50',
          rules: [{ ...commonBlurReg, message: '账号名称不能为空！' }],
          placeholder: '请输入账号名称'
        },
        {
          prop: 'account',
          labelWidth: '100px',
          itemType: 'input',
          label: '银行账号:',
          maxlength: '50',
          rules: [{ ...commonBlurReg, message: '银行账号不能为空！' }],
          placeholder: '请输入银行账号'
        },
        {
          prop: 'isDefault',
          labelWidth: '100px',
          itemType: 'switch',
          activeValue: 1,
          inactiveValue: 0,
          label: '是否默认:'
        }
      ]
    }
    /* 开户行表头参数信息 */
    const openBankColumns = [
      {
        prop: 'bankName',
        label: '开户行',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'accountName',
        label: '账号名称',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'account',
        label: '银行账号',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'isDefault',
        label: '是否选为默认',
        minWidth: '200',
        formater: scope => scope.row[scope.column.property] === 1 ? '是' : '否'
      }
    ]
    /* 开户行操作栏 */
    const openBankPopOperates = {
      label: '操作',
      width: '260px',
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FE4949' },
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.deleteData(params.$index)
          }
        },
        {
          label: '修改',
          isShow: scope => this.type !== 'detail',
          handle: (params) => {
            this.addOrEdit({ ...params.row }, 'openBankPopBox', params.$index)
          }
        }
      ]
    }
    return {
      activeName: 'contact',
      /* 联系人 */
      linkManPopBox,
      linkManColumns,
      linkManPopOperates,
      /* 地址 */
      addressPopBox,
      addressColumns,
      addressPopOperates,
      /* 开户行 */
      openBankPopBox,
      openBankColumns,
      openBankPopOperates
    }
  },
  computed: {
    type() {
      return this.$route.params.type
    }
  },
  methods: {
    bindAdd() {
      if (this.activeName === 'contact') {
        this.addOrEdit({
          isDefault: 0,
          name: '',
          phone: '',
          email: '',
          post: ''
        }, 'linkManPopBox')
      } else if (this.activeName === 'address') {
        this.addOrEdit({
          isDefault: 0,
          address: ''
        }, 'addressPopBox')
      } else {
        this.addOrEdit({
          bankName: '',
          accountName: '',
          account: '',
          isDefault: 0
        }, 'openBankPopBox')
      }
    },
    addOrEdit(data, item, index) {
      this.$set(this[item], 'formDatas', { ...data, popIndex: index })
      this.$set(this[item], 'title', index === undefined ? '新增' : '修改')
      this.$set(this[item], 'visible', true)
    },
    deleteData(index) {
      const arr = this.info[this.activeName] && [...this.info[this.activeName]] || []
      arr.splice(index, 1)
      this.setData('supplierExtra', { ...this.info, [this.activeName]: arr })
    },
    saveData(rows, item) {
      const arr = this.info[this.activeName] && [...this.info[this.activeName]] || []
      if (rows.popIndex === undefined) {
        arr.push({ ...rows, id: null })
      } else {
        arr[rows.popIndex] = rows
      }
      this.$set(this[item], 'visible', false)
      this.setData('supplierExtra', { ...this.info, [this.activeName]: arr })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
