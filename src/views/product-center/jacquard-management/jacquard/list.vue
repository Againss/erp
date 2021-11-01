<!--
 * @Author: Sanmao
 * @Date: 2021-06-18 17:48:25
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-20 17:40:47
 * @Descripttion: 提花号列表
-->
<template>
  <div class="product-list-content jacquard-list">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="button">
      <el-button
        v-permission="['catalog:Api:jacquard:store']"
        type="primary"
        size="small"
        @click="addSpu"
      >新增</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        :class="{ 'list-end': !dataSource.length }"
        table-scrollx
      />
    </div>
    <!-- 新增pop弹出层 -->
    <cs-custom-pop :options="addPopOptions" />
    <uploadSlot v-if="false" />
  </div>
</template>

<script>
import configData from '@/views/product-center/configDock/index.js'
import { debounce } from '@/utils'
import { pageList, jacquardStore } from './api'
import uploadSlot from './components/upload-slot.vue'

export default {
  name: 'JacquardList',
  components: {
    uploadSlot
  },
  data() {
    // 表格表头配置信息
    const columns = [
      {
        prop: 'code',
        label: '提花号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      {
        prop: 'code',
        label: '花纹图片',
        minWidth: '140',
        components: { uploadSlot },
        componentsOptions: {
          // imgUrl: 'https://oss-exhibition.sfabric.com/product-catalog/product_fabric/images/202106/f337e019a073b1f8d4174560bc40fba0.jpg',
          canDel: false,
          className: 'columnsImg'
        },
        showOverflowTooltip: true
      },
      {
        prop: 'createdBy',
        label: '创建人',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.creator ? scope.row.creator.name ? scope.row.creator.name + '/' + scope.row.creator.realName : '' : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '140',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          const type = scope.row.dataSource
          let str = '产品目录库'
          switch (type) {
            case 1:
              str = '产品目录库'
              break
            case 2:
              str = '样板开发'
              break
            case 3:
              str = '客户订单'
              break
            case 4:
              str = '采购订单'
              break
            case 5:
              str = '工艺总结'
              break
            default:
              break
          }
          return str
        }
      },
      {
        prop: 'sourceOrder',
        label: '来源订单',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          const sourceOrderType = scope.row.sourceOrderType
          let sourceOrderTypeName = '-'
          switch ((sourceOrderType - 0)) {
            case 0:
              sourceOrderTypeName = '-'
              break
            case 1:
              sourceOrderTypeName = '大货订单'
              break
            case 2:
              sourceOrderTypeName = '样板订单'
              break
            case 3:
              sourceOrderTypeName = '备坯单'
              break
            case 4:
              sourceOrderTypeName = '备纱单'
              break
            case 5:
              sourceOrderTypeName = '采购单'
              break
            case 6:
              sourceOrderTypeName = '补布单'
              break
            default:
              sourceOrderTypeName = '-'
          }
          return sourceOrderTypeName
        }
      },
      {
        prop: 'sourceOrder',
        label: '来源单号',
        minWidth: '200',
        showOverflowTooltip: true
      }
    ]
    // 搜索
    const searchData = [
      {
        prop: 'code',
        label: '提花号:',
        placeholder: '请输入提花号',
        itemType: 'input'
      },
      {
        prop: 'sourceOrder',
        label: '来源单号:',
        placeholder: '请输入来源单号',
        itemType: 'input'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 10,
          page: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageSize: val, page: this.pagination.page || 1 })
      }
    }
    // 新增pop弹出框的配置信息
    const addPopOptions = {
      itemType: 'dialog',
      visible: false,
      top: '10vh',
      title: '新增提花号',
      width: '560px',
      drag: true,
      closeOnPressEscape: false,
      ok: params => {
        this.jacquardStoreFn()
      },
      cancel: params => {
        this.addPopDialogHandle()
      },
      close: () => {
        console.log('关闭')
      },
      content: [
        {
          itemType: 'view',
          text: '花纹图片：',
          className: 'add-img'
        },
        {
          prop: 'upload',
          itemType: 'upload',
          onSuccess: (res, file) => {
            const imgUrl = res.data.showUrl || ''
            this.imgUrl = imgUrl
            this.pictureUrl = res.data.pictureUrl || ''
            // this.$set(this.addPopOptions.content[1], 'disabled', true)
            this.$set(this.addPopOptions.content[this.addPopOptions.content.length - 1], 'fileList', [{ name: file.name, url: res.data.pictureUrl }])
            this.$set(this.addPopOptions.content[this.addPopOptions.content.length - 1].componentsOptions, 'imgUrl', imgUrl)
          },
          beforeUpload: (file) => {
            const fileType = file.type.split('/')[1]
            const regexp = new RegExp(fileType)
            const isImg = regexp.test(this.accept)

            if (!isImg || !file.type) {
              this.$message.error('请上传图片')
              return false
            }
          },
          onError: () => {
            this.pictureUrl = ''
            this.imgUrl = ''
          },
          onExceed: (file, fileList) => {
            if (fileList[0].status === 'success') {
              this.$message.error('只能上传一张花纹图片')
            }
          },
          onRemove: (file, fileList) => {
            if (file.status === 'success') {
              this.pictureUrl = ''
              this.imgUrl = ''
              this.$set(this.addPopOptions.content[this.addPopOptions.content.length - 1].componentsOptions, 'imgUrl', '')
            }
          },
          action: `${configData.productRequestPrefix}/api/jacquard/upload`,
          accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
          showFileList: true,
          limit: 1,
          timeout: 30000,
          style: 'position: absolute;top:-33px;left:76px;margin:0;',
          fileList: [],
          customText: '上传图片'
          // disabled: false
        },
        // 图片上传成功显示
        {
          components: { uploadSlot },
          componentsOptions: {
            imgUrl: '',
            canDel: false,
            className: 'popDelImg',
            delImg: () => {
              this.imgUrl = ''
              this.$set(this.addPopOptions.content[this.addPopOptions.content.length - 1].componentsOptions, 'imgUrl', '')
            }
          }
        }
      ]
    }
    return {
      columns,
      searchData,
      pagination,
      formOtions: {
        inline: true,
        // layout: true,
        size: 'small'
      },
      dataSource: [],
      addPopOptions,
      accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
      imgUrl: '', // 新增时，图片上传成功后的完整地址
      pictureUrl: '', // 新增时，图片上传成功后的地址
      isFirstEnter: false
    }
  },
  created() {
    this.getList()
    this.isFirstEnter = true
  },
  activated() {
    // console.log('来了-japList', this.isFirstEnter)
    if (this.isFirstEnter) {
      this.isFirstEnter = false // 恢复默认值
      return
    }
    this.getList()
  },
  deactivated() {
    // console.log('离开-japList')
  },
  methods: {
    // 获取列表
    async getList(data = {}) {
      const res = await pageList({
        ...this.searchFormDatas,
        ...data
      })
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        page: res.data.page,
        pageSize: res.data.pageSize
      }
    },
    /**
     * @description: 新增按钮
     * @param {*}
     * @return {*}
     */
    addSpu() {
      this.imgUrl = ''
      this.pictureUrl = ''
      this.$set(this.addPopOptions.content[this.addPopOptions.content.length - 1].componentsOptions, 'imgUrl', '')
      this.addPopDialogHandle()
    },
    // 修改弹出层的判断
    addPopDialogHandle(val) {
      this.$set(this.addPopOptions, 'visible', !this.addPopOptions.visible)
      if (val) {
        this.$set(this.addPopOptions, 'title', val)
      }
    },
    /**
     * @description: 新增保存
     * @param {*}
     * @return {*}
     */
    jacquardStoreFn: debounce(async function() {
      if (!this.pictureUrl) {
        this.$message.warning('请上传花纹图片')
        return
      }
      const res = await jacquardStore({ 'jacquardPicUrl': this.pictureUrl })
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.addPopDialogHandle()
        this.getList()
        // 操作日志
        const params = { 'jacquardPicUrl': this.pictureUrl }
        const description = {
          beforeText: `在'产品目录库-提花号列表'新增一条记录`,
          beforeCode: { 'jacquardPicUrl': this.pictureUrl }
        }
        const opratorType = 'INSERT'
        const api = `${configData.productRequestPrefix}/api/jacquard/store`
        this.$store.dispatch('app/fetchParamsLog', { params, opratorType, api, description, appId: 'catalog' })
      }
    }, 300, true)

  }
}

</script>
<style lang='scss' scoped>
.page-table /deep/ .upload-slot-trigger {
  height: 25px;
}
.page-table /deep/ .columnsImg {
  width: 25px;
  height: 25px;
}
.page-table /deep/ .popDelImg {
  width: 80%;
  height: 80%;
  margin-top: 30px;
}
// .page-table /deep/ .el-image-viewer__img {
//   width: 80%;
//   height: 80%;
// }
.jacquard-list /deep/ .add-img {
  display: inline-block;
  height: 30px;
  line-height: 30px;
}
.jacquard-list /deep/ .add-img::before {
  content: "*";
  color: red;
  margin-right: 2px;
}
.jacquard-list /deep/ .custom-form .el-form-item {
  margin-top: 0;
}
.jacquard-list /deep/ .custom-form .el-form-item {
  .el-upload-list__item:first-child {
    margin-top: 0;
  }
}
.jacquard-list /deep/ .custom-form .upload-slot-trigger {
  width: 430px;
  height: 250px;
  margin-left: 76px;
  margin-top: 30px;
  .popDelImg {
    width: 100%;
    height: 100%;
  }
}
.jacquard-list /deep/ .el-image-viewer__close {
  color: #fff;
}
</style>
