<template>
  <div class="details-main">
    <div class="srm-content">
      <!-- 列表 -->
      <div class="table-details detail">
        <cs-custom-table
          :columns="cardInfoColumns"
          :data-source="info"
          :operates="cardInfoPopOperates"
        />
      </div>
    </div>
    <div class="pop-box">
      <cs-custom-pop ref="cardInfoBox" :options="cardInfoPop" />
    </div>
  </div>
</template>

<script>
import { getCard } from '../api/index.js'
export default {
  name: 'CardInfo',
  props: {
    info: {
      type: Array,
      default: () => ([])
    },
    setData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    /* 通用验证*/
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    const cardInfoPop = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      width: '600px',
      okText: '确定',
      ok: parmas => {
        this.saveData({ ...parmas })
      },
      cancel: (params) => {
        this.$set(this.cardInfoPop, 'visible', false)
      },
      formDatas: {
        mainDevice: [],
        attachmentUrlCopy: []
      },
      content: {
        _documentName: {
          prop: 'documentName',
          itemType: 'select',
          valueType: 'object',
          label: '证件名称',
          rules: [{ ...commonBlurReg, message: '证件名称不能为空！' }],
          dataSource: []
        },
        _mainDevice: {
          prop: 'mainDevice',
          itemType: 'date',
          type: 'daterange',
          label: '有效日期',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          format: 'yyyy-MM-dd',
          rules: [{ required: true, message: '请选择日期' }],
          change: (val, form, formDatas) => {
            this.cardInfoPop.formDatas = formDatas
          }
        },
        _attachmentUrlCopy: {
          prop: 'attachmentUrlCopy',
          itemType: 'upload',
          drag: true,
          className: 'uploadfile',
          label: '上传证件:',
          action: '/srm/upload/type/1',
          limit: 9,
          rules: [{ required: true, message: '请上传证件' }],
          onSuccess: (response, file, fileList) => {
            const arr = [...fileList].map(e => ({
              name: e.name,
              url: e.url || (e.response && e.response.data && (e.response.data.includes('aliyuncs.com') ? e.response.data : 'https://sfabric-exhibition.oss-cn-shenzhen.aliyuncs.com/' + e.response.data) || '')
            }))
            this.cardInfoPop.formDatas.attachmentUrlCopy = arr
          },
          onError: (err, file, fileList) => {
            console.log(err, file, fileList, 'err, file, fileList上传失败')
            this.$message.error('上传失败')
          },
          onRemove: (file, fileList) => {
            this.cardInfoPop.formDatas.attachmentUrlCopy = fileList
          },
          onPreview: (file) => {
            console.log(file, '点击弹窗files')
          },
          beforeUpload: (file) => {
            return this.DocumentGudgment(file)
          },
          onExceed: (files) => {
            this.$message.error('上传文件个数不能超过9个!')
          },
          accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG'
        }
      }
    }
    /* 证件信息表头参数信息 */
    const cardInfoColumns = [
      {
        prop: 'documentName',
        label: '证件名称',
        minWidth: '105'
      },
      {
        prop: 'startDate',
        label: '开始日期',
        minWidth: '105'
      },
      {
        prop: 'endDate',
        label: '结束日期',
        minWidth: '105'
      },
      {
        prop: 'attachmentUrlCopy',
        label: '证件',
        minWidth: '200',
        className: 'table-item',
        formater: (scope) => {
          const attachmentUrlCopy = scope.row.attachmentUrlCopy
          let imgs = "<div style='margin:0 auto;display:flex;flex-direction: column;overflow:hidden;'>"
          if (attachmentUrlCopy && attachmentUrlCopy.length > 0) {
            for (let i = 0; i < attachmentUrlCopy.length; i++) {
              const item = attachmentUrlCopy[i]
              imgs +=
                ' <a target="_blank" style="color: #1890FF;" href=' + item.url +
                ' style="text-decoration: underline;color #1890ff;width: 98%;white-space: nowrap;display: inline-block;overflow: hidden;text-overflow: ellipsis;">' +
                (item.name || '附件' + (i + 1)) + '</a>'
            }
          }
          imgs += '</div>'
          return imgs
        }
      }
    ]
    /* 证件信息操作栏 */
    const cardInfoPopOperates = {
      label: '操作',
      width: '120',
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
            this.bindAdd({ ...params.row }, params.$index)
          }
        }
      ]
    }
    return {
      cardInfoPop,
      operateType: 'add',
      cardInfoColumns,
      cardInfoPopOperates
    }
  },
  computed: {
    type() {
      return this.$route.params.type
    }
  },
  methods: {
    async bindAdd(row, index) {
      if (!this.cardInfoPop.content['_documentName'].dataSource.length) {
        const res = await getCard()
        this.$set(this.cardInfoPop.content['_documentName'], 'dataSource', res)
      }
      if (index === undefined) {
        this.operateType = 'add'
        this.$set(this.cardInfoPop, 'formDatas', {
          mainDevice: [],
          attachmentUrlCopy: [],
          popIndex: undefined
        })
        this.$nextTick(() => {
          this.$refs.cardInfoBox.$refs.popComponents.$refs.customform.form.clearValidate()
        })
      } else {
        this.operateType = 'edit'
        const data = [...this.cardInfoPop.content['_documentName'].dataSource]
        if (!data.find((e) => e.label === row.documentName)) {
          data.push({
            value: row.documentName,
            label: row.documentName + '(已禁用)',
            disabled: true
          })
        }
        this.$set(this.cardInfoPop, 'formDatas', {
          ...row,
          documentName: {
            label: row.documentName,
            documentId: row.documentId,
            value: row.documentName
          },
          popIndex: index
        })
      }
      this.$set(this.cardInfoPop, 'title', index === undefined ? '新增' : '修改')
      this.$set(this.cardInfoPop, 'visible', true)
    },
    deleteData(index) {
      this.$confirm('确认删除当前数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'customClass'
      }).then(() => {
        const arr = this.info && this.info.length && [...this.info] || []
        arr.splice(index, 1)
        this.setData('supplierDocument', arr)
      })
    },
    saveData(rows) {
      const obj = {
        documentId: rows.documentName.documentId || undefined,
        documentName: rows.documentName.label || '',
        startDate: rows.mainDevice[0] || '',
        endDate: rows.mainDevice[1] || '',
        attachmentUrl: rows.attachmentUrlCopy.map(e => e.url).join(','),
        attachmentName: rows.attachmentUrlCopy.map(e => e.name).join(','),
        supplierId: this.$route.query.id
      }
      const arr = this.info && this.info.length && [...this.info] || []
      if (rows.popIndex === undefined) {
        arr.push({ ...rows, ...obj })
      } else {
        arr[rows.popIndex] = { ...rows, ...obj }
      }
      this.$set(this.cardInfoPop, 'visible', false)
      this.setData('supplierDocument', arr)
    },
    // 判断文件上传格式
    DocumentGudgment(file) {
      const flieText = file.name.length <= 50
      let isLt1M = false
      let isXls = false
      const accept = '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.pdf,.PDF'
      if (flieText) {
        const fileName = file.name.split('.')
        const fileType = fileName[fileName.length - 1]
        const regexp = new RegExp(fileType)
        isXls = regexp.test(accept)
        isLt1M = file.size / 1024 / 1024 <= 10
      }
      if (!flieText) {
        this.$message.error('上传文件名不能超过50个字符')
      } else if (!isXls) {
        this.$message.error('上传文件只能是 JPG/JPEG/PNG/BMP/PDF格式!')
      } else if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isXls && isLt1M && flieText
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-upload-list__item-actions,
.el-icon-close-tip {
  display: block !important;
}
/deep/.el-upload-list__item {
  transition: none !important;
  margin: 0 10px 10px 0 !important;
}
/deep/ .el-upload-dragger {
  width: auto;
  height: auto;
  border: 0;
  border-radius: 0;
  text-align: center;
  cursor: pointer;
  position: relative;
}
.srm-btns {
  text-align: right;
  padding-top: 0 !important;
  padding-bottom: 15px;
  border-bottom: solid 1px #e9eff2;
}
</style>
