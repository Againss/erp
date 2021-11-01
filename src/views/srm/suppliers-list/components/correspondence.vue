<template>
  <div>
    <div v-if="!info.length" class="tishi">暂无数据</div>
    <div v-else class="box">
      <div v-for="(ele, i) in info" :key="i" class="m-b">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ ele.title }}</span>
            <el-button
              v-if="type !== 'detail'"
              style="float: right;"
              size="small"
              @click="bindAdd(ele, i)"
            >
              编辑
            </el-button>
          </div>
          <div class="text item">
            <div class="top">
              <div class="flex content">
                <div>
                  <span class="label">类型：</span>
                  <span>{{ ele.type | filterType }}</span>
                </div>
                <div>
                  <span class="label">日期：</span>
                  <span>
                    {{ ele.visitTime && $filters.parseTime(ele.visitTime, '{y}-{m}-{d}') || '' }}
                  </span>
                </div>
                <div class="flex">
                  <span class="label">参与人：</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="ele.participant"
                    placement="top-start"
                  >
                    <span class="wrap max nowrap">{{ ele.participant }}</span>
                  </el-tooltip>
                </div>
              </div>
              <div class="flex content">
                <div>
                  <span class="label">创建人：</span>
                  <span>{{ ele.creatorName }}</span>
                </div>
                <div style="margin-right: 0;">
                  <span class="label">创建时间：</span>
                  <span>
                    {{ ele.createdTime && $filters.parseTime(ele.createdTime, '{y}-{m}-{d} {h}:{i}') || '' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="content wrap flex">
              <span class="label nowrap" style="line-height:1.7;">内容：</span>
              <span
                class="wrap"
                :class="showIndex === i ? '' : 'nowrap'"
                style="line-height:1.7;"
              >
                {{ ele.content }}
              </span>
            </div>
            <div class="content">
              <span class="label">附件：</span>
              <span
                v-for="(item, ind) in ele.attachmentInfo"
                :key="ind"
                class="fils-name"
                @click="down(item)"
              >
                {{ item.name }}
              </span>
            </div>
            <div v-if="ele.content.length > 50" class="icon-show" @click="bindItem(i)">
              <span v-if="showIndex === i">
                收起<i class="el-icon-arrow-up" />
              </span>
              <span v-else>展开<i class="el-icon-arrow-down" /></span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="pop">
      <cs-custom-pop ref="formPop" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import * as api from '../api/index.js'
export default {
  name: 'Correspondence',
  filters: {
    filterType(val) {
      const arr = ['其他', '会议', '培训', '拜访', '交流']
      return arr[val] || ''
    }
  },
  data() {
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '保存',
      ok: params => {
        this.save({ serviceProviderId: this.$route.query.id, ...params })
      },
      cancel: params => {
        this.popOptions.visible = false
      },
      formDatas: {},
      content: [
        {
          prop: 'title',
          label: '主题',
          itemType: 'input',
          maxlength: '20',
          rules: [{ required: true, message: '请输入' }]
        },
        {
          prop: 'type',
          label: '类型',
          itemType: 'select',
          dataSource: [
            { label: '其他', value: 0 },
            { label: '会议', value: 1 },
            { label: '培训', value: 2 },
            { label: '拜访', value: 3 },
            { label: '交流', value: 4 }
          ],
          rules: [{ required: true, message: '请选择类型' }]
        },
        {
          prop: 'visitTime',
          label: '日期',
          format: 'yyyy-MM-dd',
          itemType: 'date',
          valueFormat: 'timestamp',
          pickerOptions: {
            disabledDate: time => time.getTime() > Date.now()
          },
          rules: [{ required: true, message: '请选择日期' }]
        },
        {
          prop: 'participant',
          itemType: 'input',
          label: '参与人',
          maxlength: '100',
          rules: [{ required: true, message: '请输入' }]
        },
        {
          prop: 'content',
          itemType: 'input',
          label: '内容',
          type: 'textarea',
          rows: 6,
          maxlength: 600,
          rules: [{ required: true, message: '请输入' }]
        },
        {
          prop: 'attachmentInfo',
          itemType: 'upload',
          drag: true,
          className: 'uploadfile',
          label: '附件:',
          action: '/common/file/upload',
          limit: 9,
          data: {
            bizType: 'RECORD'
          },
          onSuccess: (response, file, fileList) => {
            const arr = [...fileList].map(e => ({
              name: e.name,
              url: e.url || (e.response && e.response.data && e.response.data.id || '')
            }))
            this.popOptions.formDatas.attachmentInfo = arr
          },
          onError: (err, file, fileList) => {
            console.log(err, file, fileList, 'err, file, fileList上传失败')
            this.$message.error('上传失败')
          },
          onRemove: (file, fileList) => {
            // console.log(file, fileList, '删除后file, fileList')
            this.popOptions.formDatas.attachmentInfo = fileList
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
          accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX'
        }
      ]
    }
    return {
      info: [],
      showIndex: -1,
      popOptions
    }
  },
  computed: {
    type() {
      return this.$route.params.type
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getData()
    }
  },
  methods: {
    bindAdd(val, i) {
      if (val) {
        this.popOptions.formDatas = { ...val, typeIndex: i }
      } else {
        this.popOptions.formDatas = { attachmentInfo: [], typeIndex: undefined }
      }
      this.popOptions.title = val && '编辑' || '新增'
      this.popOptions.visible = true
      this.$nextTick(() => {
        this.$refs.formPop.$refs.popComponents.$refs.customform.form.clearValidate()
      })
    },
    async getData() {
      const res = await api.suppliersInfoSubmit('/supplier/supplierCommunicationRecord/list', {
        serviceProviderId: this.$route.query.id
      })
      this.info = res.data || []
    },
    async save(row) {
      const msg = row.typeIndex !== undefined ? '编辑' : '新增'
      let datas = {}
      if (row.typeIndex === undefined) {
        await api.comeAndGoAdd(row)
        datas = {
          params: row,
          description: {
            beforeText: `在'供应商采购-供应商列表'新增了一条往来记录`
          },
          opratorType: 'INSERT',
          'api': '/srm/supplier/supplierCommunicationRecord/add'
        }
      } else {
        await api.comeAndGoEdit(row)
        datas = {
          params: row,
          description: {
            beforeText: `在'供应商采购-供应商列表'编辑了一条往来记录`,
            beforeCode: this.info[row.typeIndex]
          },
          opratorType: 'UPDATE',
          'api': '/srm/supplier/supplierCommunicationRecord/modify'
        }
      }
      this.$message.success(msg + '成功')
      this.getData()
      this.$store.dispatch('app/fetchParamsLog', { ...datas, appId: 'srm' })
      this.popOptions.visible = false
    },
    bindItem(i) {
      this.showIndex = this.showIndex === i ? -1 : i
    },
    async down(item) {
      const res = await api.fileDownload('/common/file/download/' + item.url, {})
      this.$utils.downloadStream(res)
    },
    // 判断文件上传格式
    DocumentGudgment(file) {
      const flieText = file.name.length <= 50
      let isLt1M = false
      let isXls = false
      const accept = '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX'
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
        this.$message.error('上传文件只能是 JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD 格式!')
      } else if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isXls && isLt1M && flieText
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    background: #eef5f9;
    .box-card {
      button {
        background: #fff;
      }
    }
    /deep/ .el-card__header {
      padding: 9px 20px;
      .clearfix {
        line-height: 32px;
      }
    }
    /deep/ .el-card__body {
      padding: 20px 20px 0;
    }
  }
  .box-card .flex {
    display: flex;
  }
  .m-b {
    margin-bottom: 15px;
    /deep/ .el-card {
      border: 0;
    }
    /deep/ .is-always-shadow {
      box-shadow: none;
    }
  }
  .top {
    display: flex;
    justify-content: space-between;
  }
  .label {
    font-size: 14px;
    color: #888E9E;
  }
  .max {
    max-width: 300px;
  }
  .nowrap {
    white-space: nowrap;
  }
  .wrap {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fils-name {
    color: #0986FF;
    margin-right: 8px;
    cursor: pointer;
  }
  .content {
    font-size: 14px;
    color: #474747;
    margin-bottom: 20px;
    div {
      margin-right: 30px;
    }
    span {
      display: inline-block;
    }
  }
  .icon-show {
    text-align: center;
    font-size: 14px;
    color: #666666;
    margin-bottom: 20px;
    i {
      margin-left: 5px;
    }
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
  .tishi {
    text-align: center;
    color: #999;
    margin: 15px;
    font-size: 14px;
  }
</style>
