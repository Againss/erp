<!--
 * @Description: 收件地址列表
 * @Autor: zhengjin
 * @Date: 2021-07-27 14:40:04
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-09 14:58:34
-->

<template>
  <div class="receipt">
    <div class="mail-item-content">
      <div class="mail-content-title">
        收件地址信息
        <div v-if="isEdit" class="header-botton">
          <el-button
            type="primary"
            size="small"
            @click="Add"
          >新增</el-button>
        </div>
      </div>
      <div class="mail-content-info">
        <cs-custom-table
          ref="receiptTable"
          tooltip-effect="dark"
          :header-cell-style="{
            background: '#F5F7FA!important',
          }"
          table-scrollx
          :columns="columns"
          :data-source="dataSource"
          :operates="popOperates"
          :pagination="pagination"
        />
      </div>
    </div>
    <div class="pop">
      <cs-custom-pop ref="receiptForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  receiptList,
  receiptAdd,
  receiptShow,
  receiptUpdate,
  receiptDelete
} from '../../api/index'
import { numberBlurReg, phoneBlurReg } from '@/views/customer-info/customer-management/common'

export default {
  components: {},
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
    const columns = [
      {
        prop: 'recipient',
        label: '收件人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'mobile',
        label: '收件人电话',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'receiveCompany',
        label: '收件人公司',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'address',
        label: '地址',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedBy',
        label: '更新人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      }
    ]
    const dataList = [
      {
        label: '编辑',
        // permitTag: ['customer:address:modify'],
        isShow: true,
        handle: async(params) => {
          console.log(params.row, '编辑')
          this.$set(this.popOptions, 'title', '编辑收件地址')
          this.$set(this.popOptions, 'saveAndadd', null)
          const res = await this.receiptShow(params.row.id)
          console.log(res)
          if (res.code !== 200) return
          this.$set(this.popOptions, 'formDatas', res.data)
          this.popStatus(true)
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        // permitTag: ['customer:address:delete'],
        isShow: true,
        handle: (params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const res = await this.deleteReceipt(params.row.id)
            console.log(res)
            if (res.code !== 200) return
            this.$message.success('删除成功')
            this.getReceipt()
          }).catch(() => {})
        }
      }
    ]
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      isShow: this.isEdit,
      dataSource: dataList
    }
    const pagination = {
      currentChange: val => {
        this.page = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.list()
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.page = { pageNum: 1, pageSize: val }
        this.list()
      }
    }
    // 弹窗
    const content = [
      {
        prop: 'receiveCompany',
        itemType: 'input',
        label: '收件公司',
        rules: [
          { required: true, message: '收件公司不能为空', trigger: ['blur'] },
          { min: 1, max: 20, message: '收件公司不能超过20个字符', trigger: 'blur' }
        ]
      },
      {
        prop: 'recipient',
        itemType: 'input',
        label: '收件人',
        rules: [
          { required: true, message: '收件人不能为空', trigger: ['blur'] },
          { min: 1, max: 10, message: '收件人不能超过 10个字符', trigger: 'blur' }
        ]
      },
      {
        prop: 'mobile',
        itemType: 'input',
        label: '电话',
        maxlength: 11,
        rules: [
          { required: true, message: '电话不能为空', trigger: ['blur'] },
          { validator: numberBlurReg, trigger: 'blur' },
          { validator: phoneBlurReg, trigger: 'blur' }
        ]
      },
      {
        prop: 'address',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        label: '收件地址',
        maxlength: 50,
        // showWordLimit: true,
        // rows: 2,
        rules: [
          { required: true, message: '收件地址不能为空', trigger: ['blur'] }
        ],
        trim: (value) => {
          return value
        }
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 50,
        showWordLimit: true,
        rows: 3,
        trim: (value) => {
          return value
        }
      }
    ]
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增收件地址',
      saveAndaddText: '继续添加',
      ok: (params) => {
        console.log(params)
        const data = this.$utils.deepClone(params)
        const title = this.popOptions['title']
        if (title === '新增收件地址') {
          this.submitAdd(data)
        } else {
          this.editReceipt(data)
        }
        // this.$confirm(' 你确认要提交该数据吗？', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   if (title === '新增收件地址') {
        //     res = this.submitAdd(data)
        //   } else {
        //     res = this.editReceipt(data)
        //   }
        //   res.then((data) => {
        //     console.log(data)
        //     if (data.code !== 200) return
        //     this.$message.success('保存成功')
        //     this.popStatus(false)
        //     this.getReceipt()
        //   }).cancel(() => {})
        // }).catch(() => {})
      },
      cancel: (params) => {
        console.log(params, this)
        this.popStatus(false)
      },
      formDatas: {}, // pop数据来源
      content: content
    }
    return {
      popOptions,
      columns,
      popOperates,
      pagination,
      page: {
        pageNum: 1,
        pageSize: 20
      },
      dataSource: []
    }
  },
  watch: {
    isEdit(val) {
      console.log(val, '是否可编辑')
      this.$set(this.popOperates, 'isShow', val)
    }
  },
  async created() {
    this.customerId	 = this.$route.params.id
    await this.getReceipt()
  },
  methods: {
    async getReceipt() {
      console.log(this.$route, '-------------------', this.pagination)
      const res = await receiptList({
        'customerId': this.customerId,
        ...this.page
      })
      console.log('收件地址', res)
      if (res.code === 200) {
        this.dataSource = res.data.list
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
      }
    },
    // 新增
    Add() {
      console.log('新增', this)
      this.popStatus(true)
      this.$set(this.popOptions, 'saveAndadd', this.saveAndadd)
    },
    // 弹窗show
    popStatus(flag) {
      if (!flag) {
        this.$set(this.popOptions, 'title', '新增收件地址')
        this.$set(this.popOptions, 'formDatas', {})
      }
      this.$set(this.popOptions, 'visible', flag)
    },
    // 提交
    async submitAdd(params) {
      const res = await receiptAdd({
        'customerId': this.customerId,
        ...params
      })
      console.log(res)
      if (res.code !== 200) return
      this.$message.success('保存成功')
      this.popStatus(false)
      this.getReceipt()
    },
    // 详情
    async receiptShow(id) {
      const res = await receiptShow({
        'id': id
      })
      return res
    },
    // 编辑
    async editReceipt(params) {
      const { id, recipient, receiveCompany, mobile, address, remark } = params
      console.log(id, recipient, receiveCompany, mobile, address, remark)
      const res = await receiptUpdate({
        'id': id,
        'recipient': recipient,
        'receiveCompany': receiveCompany,
        'mobile': mobile,
        'address': address,
        'remark': remark
      })
      console.log(res)
      if (res.code !== 200) return
      this.$message.success('保存成功')
      this.popStatus(false)
      this.getReceipt()
    },
    // 删除
    async deleteReceipt(id) {
      const res = await receiptDelete({
        'id': id
      })
      return res
    },
    // 提交继续添加
    saveAndadd(params) {
      console.log('keep', params, this.$refs['receiptForm'].$refs['popComponents'].form)
      const form = this.$refs['receiptForm'].$refs['popComponents'].form
      form.validate(async(valid) => {
        if (valid) {
          console.log(valid)
          const res = await receiptAdd({
            'customerId': this.customerId,
            ...params
          })
          console.log(res)
          if (res.code !== 200) return
          this.$message.success('保存成功')
          this.$set(this.popOptions, 'formDatas', {})
          this.getReceipt()
          // this.$confirm(' 你确认要提交该数据吗？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(async() => {
          //   const res = await this.submitAdd(params)
          //   if (res.code !== 200) return
          //   this.$message.success('保存成功')
          //   this.getReceipt()
          //   this.$set(this.popOptions, 'formDatas', {})
          // }).catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.receipt {
  padding: 0 20px;
  .mail-item-content {
    color: #151222;
    .mail-content-title {
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      line-height: 32px;
      padding: 15px 0;
      // border-bottom: 1px solid #efefef;
      font-size: 16px;
    }
    .mail-content-info {
      font-size: 14px;
      padding: 0 0 20px 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: wrap;
      flex-flow: wrap;
      ::v-deep
      .table {
        width: 100%;
        .el-table::before {
          height: 0 !important;
        }
        .el-table--medium {
          tr {
            background-color: #fff !important;
          }
          td {
            padding: 13px 0 !important;
          }
        }
      }
      ::v-deep
      .el-table__fixed-right::before {
        height: 0 !important;
      }
    }
  }
  .pop {
    ::v-deep
    .el-form-item {
      .el-input__count {
        bottom: 0;
        height: 30px;
        background-color: transparent;
      }
    }
    .dialog-footer {
      .btn {
        min-width: 70px;
      }
    }
  }
}
</style>
