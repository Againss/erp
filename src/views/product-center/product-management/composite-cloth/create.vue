<!--
 * @Author: anthony
 * @Date: 2020-09-30 10:00:40
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-26 13:40:18
 * @Descripttion: 复合布详情
-->

<template>
  <div class="product-detail-content">
    <div v-if="!isAdd" class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">复合布编码：{{ order.code }}</div>
      </div>
      <div class="description">
        操作人：{{
          (order.updator && order.updator.realName) ||
            (order.creator && order.creator.realName)
        }}
        操作时间：{{
          $filters.parseTime(order.updatedTime || 0, "{y}-{m}-{d} {h}:{i}")
        }}
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">复合信息</div>
      <div class="product-content-info">
        <!-- 布组合 -->
        <div class="tableitem">
          <div class="titleitem" style="justify-content: space-between">
            <div class="title">布组合</div>
            <div v-if="isAdd && handTableFormDataSource.length < 2">
              <el-button
                size="mini"
                type="primary"
                @click="dialogHandler"
              >添加色/花布</el-button>
            </div>
          </div>
          <cs-custom-table
            v-if="!isAdd"
            ref="handTable"
            size="mini"
            :header-cell-style="{
              background: '#F5F7FA!important',
            }"
            class="clothItemAdd-table"
            :columns="handClothItem"
            :data-source="order.productFabric"
          />
          <cs-custom-table
            v-if="isAdd"
            ref="handTable"
            size="mini"
            :header-cell-style="{
              background: '#F5F7FA!important',
            }"
            :columns="handClothItem"
            :data-source="handTableFormDataSource"
            :operates="popOperates"
          />
        </div>
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">附加信息</div>
      <div class="product-content-info">
        <item
          v-if="!isAdd"
          ref="formfivePart"
          :is-edit="hasEdit"
          :form-data="formDatafivePart"
          :order="order"
        />
        <item
          v-if="isAdd"
          ref="formThreePart"
          :is-edit="true"
          :form-data="formDataThreePart"
          :order="order"
        />
        <div v-if="!isAdd" class="tableitem">
          <div class="titleitem">
            <div class="title">手感</div>
          </div>
          <item
            v-if="!isAdd"
            ref="formTwoPart"
            :is-edit="hasEdit"
            :form-data="formDatasixPart"
            :order="order"
          />
        </div>

        <div v-if="!isAdd" class="tableitem">
          <div class="titleitem">
            <div class="title">毛效</div>
          </div>
          <item
            v-if="!isAdd"
            ref="formfourPart"
            :is-edit="hasEdit"
            :form-data="formDatasevenPart"
            :order="order"
          />
        </div>
      </div>
    </div>
    <div v-if="!isAdd" class="product-item-content">
      <div class="product-content-title">图片信息</div>
      <div class="product-content-info">
        <!-- 3D编码 -->
        <div class="product-item-code">
          <item
            ref="formEightPart"
            :is-edit="hasEdit"
            :form-data="formDataEightPart"
            :order="order"
          />
          <el-link
            v-show="order.lingDiCode && $route.params.id"
            v-loading="yinruFlag"
            class="yinru"
            @click="previewCode"
          >预览</el-link>
        </div>
        <!-- 产品主图 -->
        <div class="tableitem">
          <div class="titleitem">
            <div
              v-if="$route.query.isEdit ? true : order.pictures.length"
              class="title title-h"
            >
              产品主图
            </div>
            <div class="image-list">
              <div
                v-for="(item, index) in order.pictures"
                :key="index"
                class="image-item"
              >
                <el-image
                  class="product-image"
                  :src="item.showUrl"
                  :preview-src-list="picturesList"
                  lazy
                />
                <div v-show="$route.query.isEdit" class="handel-img">
                  <span v-if="item.mainPic" style="color: red">产品主图</span>
                  <span
                    v-if="!item.mainPic"
                    @click="setMainImg(index)"
                  >设为主图</span>
                  <span v-if="index !== 0" @click="delImg(index)">删除</span>
                </div>
              </div>
              <cs-custom-form
                v-if="order.pictures.length < 5 && hasEdit"
                ref="uplodForm"
                :data-source="uploadImgData"
              />
            </div>
          </div>
        </div>
        <!-- 图文详情： -->
        <div class="tableitem" style="margin-top:24px;">
          <div class="titleitem">
            <div
              v-if="$route.query.isEdit ? true : order.picText.data.data || order.picText.dataEn.data"
              class="title title-h"
            >
              <div>图文详情{{ isChinese ? "" : "(英)" }}</div>
              <el-switch
                v-if="$route.query.isEdit ? true : order.picText.data.data || order.picText.dataEn.data"
                v-model="isChinese"
                style="display: block; align-self: center;"
                active-color="#0986FF"
                inactive-color="#D0D8E0"
                active-text="中文"
                inactive-text="英文"
              />
            </div>
            <div v-show="isChinese && hasEdit" class="tinymce-box">
              <tinymce
                v-if="hasEdit"
                v-model="order.picText.data.data"
                :height="400"
                :api-url="`${configData.productRequestPrefix}/api/cloth/productFabric/uploadPicText`"
              />
            </div>
            <div v-show="!isChinese && hasEdit" class="tinymce-box">
              <tinymce
                v-if="hasEdit"
                v-model="order.picText.dataEn.data"
                :height="400"
                :api-url="`${configData.productRequestPrefix}/api/cloth/productFabric/uploadPicText`"
              />
            </div>
            <!-- 编辑状态 -->

            <!-- 查看状态 -->
            <div
              v-if="
                !hasEdit &&
                  (order.picText.data.data || order.picText.dataEn.data)
              "
              class="editor-content"
              v-html="
                isChinese ? order.picText.data.data : order.picText.dataEn.data
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasEdit || isAdd" class="product-btn-group">
      <div class="btn-groups">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <dialogs :options="dialogOptions" :form-otions="formOtions" />
    <uploadSlot v-if="false" />
  </div>
</template>
<script>
import item from '@/views/product-center/components/detaiItem'
import Tinymce from '@/views/product-center/components/tinymce'
import { debounce } from '@/utils'
import dialogs from '@/views/product-center/components/dialog'
import { colourClothList, store, show, update, previewCode } from './api'
import uploadSlot from './components/upload-slot'
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
export default {
  name: 'ColourClothCreate',
  components: {
    item,
    Tinymce,
    dialogs,
    uploadSlot
  },
  mixins: [logMethods],
  data() {
    // 添加色/花布
    const dialogOptions = {
      // tableSelection: true, // 列表多选
      visible: false,
      title: '添加成品布',
      loading: true,
      okText: '确定',
      cancelText: '取消',
      maxHeight: '370',
      closed: (params) => {
        this.dialogHandle(params)
      }, // 关闭选择
      ok: (params) => {
        this.addclothCombination(params)
        this.dialogHandle(false)
      }, // 确定选择
      searchFormDatas: {}, // 搜索默认参数
      searchData: [
        {
          prop: 'code',
          itemType: 'input',
          label: '成品编码',
          itemStyle: { width: '50%' },
          placeholder: '请输入色/花布编码'
        },
        {
          itemType: 'operate',
          submitHandle: (params) => {
            this.getList(params)
            this.dialogOptions.searchFormDatas = params
          },
          submitText: '查询',
          resetHandle: () => {
            console.log('重置重置')
          }
        }
      ], // 搜索字段
      dataSource: [], // table数据
      columns: [
        {
          prop: 'code',
          label: '色/花布编码',
          minWidth: '200',
          fixed: true
        },
        {
          prop: 'productColor',
          label: '色号',
          minWidth: '140',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.productColor && scope.row.productColor.name
          }
        },
        {
          prop: 'productFlower',
          label: '花号',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.productFlower && scope.row.productFlower.name
          }
        },
        {
          prop: 'printTech',
          label: '印花工艺',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.printTech && scope.row.printTech.name
          }
        },
        {
          prop: 'fabricWidth',
          label: '门幅',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.fabricWidth ? scope.row.fabricWidth + 'cm' : ''
          }
        },
        {
          prop: 'fabricWeight',
          label: '克重',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row && scope.row.fabricWeight
              ? scope.row.fabricWeight + 'g/m²'
              : ''
          }
        },
        {
          prop: 'dyePrintType',
          label: '印染方式',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row && scope.row.dyePrintType
              ? scope.row.dyePrintType.name
              : ''
          }
        },
        {
          prop: 'dyeElement',
          label: '染色成分',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.dyeElementName && scope.row.dyeElementName.length
              ? scope.row.dyeElementName.join('/')
              : ''
          }
        },
        {
          prop: 'clothMainTech',
          label: '主工艺要求',
          minWidth: '200',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row && scope.row.clothMainTech
              ? scope.row.clothMainTech.techNames
              : ''
          }
        },
        {
          prop: 'productStyle',
          label: '风格整理',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            const productStyleName = []
            if (scope.row.productStyle && scope.row.productStyle.length) {
              scope.row.productStyle.forEach((item) => {
                productStyleName.push(
                  (item.styleParentTech
                    ? item.styleParentTech.name + '--'
                    : '') + (item.styleChildTech && item.styleChildTech.name)
                )
              })
            }
            return productStyleName.length ? productStyleName.join(' / ') : ''
          }
        },
        {
          prop: 'productFunction',
          label: '功能性整理',
          minWidth: '300',
          showOverflowTooltip: true,
          formater: (scope) => {
            const productStyleName = []
            if (scope.row.productFunction && scope.row.productFunction.length) {
              scope.row.productFunction.forEach((item) => {
                productStyleName.push(
                  (item.functionParentTech
                    ? item.functionParentTech.name + '--'
                    : '') +
                  (item.functionChildTech && item.functionChildTech.name)
                )
              })
            }
            return productStyleName.length ? productStyleName.join(' / ') : ''
          }
        },
        {
          prop: 'productFeel',
          label: '手感整理',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            const productStyleName = []
            if (scope.row.productFeel && scope.row.productFeel.length) {
              scope.row.productFeel.forEach((item) => {
                productStyleName.push(
                  (item.feelParentTech ? item.feelParentTech.name + '--' : '') +
                  (item.feelChildTech && item.feelChildTech.name)
                )
              })
            }
            return productStyleName.length ? productStyleName.join(' / ') : ''
          }
        },
        {
          prop: 'embryoCode',
          label: '坯布编码',
          minWidth: '120',
          showOverflowTooltip: true
        }
      ],
      pagination: {
        currentChange: (val) => {
          // 切换页数
          this.getList({
            pageSize: this.dialogOptions.pagination.pageSize || 10,
            page: val
          })
        },
        sizeChange: (val) => {
          // 切换条数
          this.getList({
            pageSize: val,
            page: this.dialogOptions.pagination.page || 1
          })
        }
      }
    }
    // 布组合
    const handClothItem = [
      // {
      //   prop: 'id',
      //   label: '序号',
      //   width: '99'
      // },
      {
        prop: 'code',
        label: '色/花布编码',
        maxWidth: '200'
      }
    ]
    // 表头操作栏里dataSource的配置信息
    const dataList = [
      {
        label: '删除',
        // permitTag: ['userCenter:sysPermit:modify'],
        isShow: true,
        style: { color: '#FF4444' },
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteData(params.row)
          }).catch(() => {})
        }
      }
    ]
    const popOperates = {
      label: '操作',
      width: '100',
      dataSource: dataList
    }
    // 印花染色
    const formDatacomposite = [
      {
        name: 'code',
        type: 'input',
        label: '复合布编码'
      },
      {
        name: 'updatedBy',
        type: 'input',
        label: '更新人'
      },
      {
        name: 'updatedTime',
        type: 'input',
        label: '更新时间'
      }
    ]
    // 附加信息新增
    const formDataThreePart = [
      {
        name: 'spuCode',
        type: 'select-search',
        label: 'SPU编码',
        searchValue: 'code',
        valueKey: 'code',
        notEdit: false,
        placeholder: '请选择SPU编码',
        apiUrl: `${configData.productRequestPrefix}/api/spu/all`,
        optionsLabel: 'code',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (e) => {
          this.$refs['formThreePart'].resetData({
            spuCode: e.data ? e.data.code : ''
          })
          this.order.spuCode = e.data ? e.data.code : ''
          this.order.spuUuid = e.data ? e.data.uuid : ''
        }
      },
      {
        name: 'compositeProcessId',
        type: 'select-search',
        label: '复合工艺编码',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择复合工艺编码',
        apiUrl: `${configData.productRequestPrefix}/api/tech/combineTech/all`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (e) => {
          this.$refs['formThreePart'].resetData({
            compositeProcessId: e.data ? e.data.name : ''
          })
          this.order.bdCombineTechUuid = e.data ? e.data.uuid : ''
          this.order.compositeProcessId = e.data ? e.data.name : ''
        }
      }
    ]
    // 附加信息编辑
    const formDatafivePart = [
      {
        name: 'spuCode',
        type: 'select-search',
        label: 'SPU编码',
        searchValue: 'code',
        valueKey: 'code',
        notEdit: false,
        placeholder: '请选择SPU编码',
        apiUrl: `${configData.productRequestPrefix}/api/spu/all`,
        optionsLabel: 'code',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            spuCode: e.data ? e.data.code : ''
          })
          this.order.spuCode = e.data ? e.data.code : ''
          this.order.spuUuid = e.data ? e.data.uuid : ''
        }
      },
      {
        name: 'compositeProcessId',
        type: 'select-search',
        label: '复合工艺编码',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择复合工艺编码',
        apiUrl: `${configData.productRequestPrefix}/api/tech/combineTech/all`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            compositeProcessId: e.data ? e.data.name : ''
          })
          this.order.bdCombineTechUuid = e.data ? e.data.uuid : ''
          this.order.compositeProcessId = e.data ? e.data.name : ''
        }
      },
      {
        name: 'productSource',
        type: 'select',
        label: '来源',
        showValue: 'productSourceValue',
        placeholder: '请选择来源',
        notEdit: false,
        options: [
          {
            id: 1,
            name: '自有'
          },
          {
            id: 2,
            name: '外购'
          }
        ],
        optionsValue: 'id',
        changeHandler: (data) => {
          this.order.productSource = data
        }
      },
      {
        name: 'salesModel',
        type: 'select',
        label: '销售模式',
        placeholder: '请选择销售模式',
        showValue: 'salesModelValue',
        multiple: true,
        notEdit: false,
        options: [
          {
            id: '1',
            name: '订单'
          },
          {
            id: '2',
            name: '现货'
          }
        ],
        optionsValue: 'id',
        changeHandler: (data) => {
          this.order.salesModel = data
        }
      },
      {
        name: 'bd_sop',
        type: 'select-search',
        label: '吸水',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择吸水',
        requestParam: { typical: 'XSX' },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_sop: e.data.name
          })
          this.order.bd_sop = e.data.name
          this.order.bdSopUuid = e.data.uuid
        }
      },
      {
        name: 'bd_elastic',
        type: 'select-search',
        label: '弹性',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择弹性',
        requestParam: { typical: 'TX' },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_elastic: e.data.name
          })
          this.order.bd_elastic = e.data.name
          this.order.bdElasticUuid = e.data.uuid
        }
      }
    ]
    // 图片详情3D编码
    const formDataEightPart = [
      {
        name: 'lingDiCode',
        type: 'input',
        label: '3D编码',
        placeholder: '请输入3D编码',
        blurHandler: (e) => {
          this.order.lingDiCode = e.target.value
        }
      }
    ]
    const uploadImgData = [
      {
        prop: 'upload',
        itemType: 'upload',
        onSuccess: (res, file) => {
          if (this.order.pictures.length >= 5) {
            this.$message.error('产品主图不能超过5张！')
            return false
          }
          const imagObj = {
            picUrl: res.data.pictureUrl,
            mainPic: 0,
            showUrl: res.data.showUrl
          }
          if (!this.order.pictures.length) {
            imagObj.mainPic = 1
          }
          this.picturesList.push(res.data.showUrl)
          this.order.pictures.push(imagObj)
        },
        beforeUpload: (file) => {
          if (this.order.pictures.length >= 5) {
            this.$message.error('产品主图不能超过5张！')
            return false
          }
          const fileType = file.type.split('/')[1]
          const regexp = new RegExp(fileType)
          const isImg = regexp.test(this.accept)
          const isLt5M = file.size / 1024 / 1024 < 5
          if (!isImg) {
            this.$message.error(
              '上传头像图片只能是 .jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.PNG,.BMP 格式!'
            )
          }
          if (!isLt5M) {
            this.$message.error('上传头像图片大小不能超过 5MB!')
          }
          return isImg && isLt5M
        },
        content: [
          {
            slot: 'trigger',
            component: uploadSlot
          }
        ],
        action: `${configData.productRequestPrefix}/api/cloth/combineFabric/upload`,
        accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
        showFileList: false,
        timeout: 30000
      }
    ]
    return {
      order: {},
      isEdit: true,
      hasEdit: true, // 是否是编辑状态,控制附加信息和图文信息内容是否可以编辑，true：可以编辑
      isAdd: true, // 新增
      handTableFormDataSource: [], // 添加布组合
      handClothItem,
      formDatafivePart, // 附加信息
      formDataThreePart, // 附加信息新增
      formDatacomposite, // 复合信息
      formDatasixPart: [], // 手感
      formDatasevenPart: [], // 毛效
      formDataEightPart, // 图片详情3D编码
      content: '', // 富文本
      dialogOptions,
      popOperates,
      dataList,
      uploadImgData,
      isChinese: true,
      accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
      picturesList: [], // 产品主图预览
      beforeCode: {},
      formOtions: { inline: true },
      yinruFlag: false,
      configData
    }
  },
  created() {
    this.initOrder()
    // 查看状态时全部都不能编辑，编辑状态时附加信息和图文信息可以编辑
    if (this.$route.params.id) {
      this.getOrder(this.$route.params.id)
      // 查看
      this.isEdit = false
      this.hasEdit = false
      this.isAdd = false
    } else {
      this.isAdd = true
    }
    if (this.$route.params.id && this.$route.query.isEdit) {
      // 编辑
      this.isEdit = false
      this.isAdd = false
      this.hasEdit = true
    }
    // if (this.$route.params.id) {
    // 手感
    this.formDatasixPart = [
      {
        name: 'bd_hardness',
        type: 'select-search',
        label: '软硬度',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择软硬度',
        requestParam: { typical: 'SG', 'parentName': '软硬度', 'level': 2 },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_hardness: e.data.name
          })
          this.order.bd_hardness = e.data.name
          this.order.bdHardnessUuid = e.data.uuid
        }
      },
      {
        name: 'bd_smoothness',
        type: 'select-search',
        label: '光滑度',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择光滑度',
        requestParam: { typical: 'SG', 'parentName': '光滑度', 'level': 2 },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_smoothness: e.data.name
          })
          this.order.bd_smoothness = e.data.name
          this.order.bdSmoothnessUuid = e.data.uuid
        }
      },
      {
        name: 'bd_glutinous',
        type: 'select-search',
        label: '糯感',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择糯感',
        requestParam: { typical: 'SG', 'parentName': '糯感', 'level': 2 },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_glutinous: e.data.name
          })
          this.order.bd_glutinous = e.data.name
          this.order.bdGlutinousUuid = e.data.uuid
        }
      }
    ]
    this.formDatasevenPart = [
      {
        name: 'bd_catch_hair',
        type: 'select-search',
        label: '底抓毛',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择底抓毛',
        requestParam: { typical: 'MX', 'parentName': '底抓毛', 'level': 2 },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_catch_hair: e.data.name
          })
          this.order.bd_catch_hair = e.data.name
          this.order.bdCatchHairUuid = e.data.uuid
        }
      },
      {
        name: 'bd_brushed',
        type: 'select-search',
        label: '面刷毛',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择面刷毛',
        requestParam: { typical: 'MX', 'parentName': '面刷毛', 'level': 2 },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_brushed: e.data.name
          })
          this.order.bd_brushed = e.data.name
          this.order.bdBrushedUuid = e.data.uuid
        }
      },
      {
        name: 'bd_bdSuedeId',
        type: 'select-search',
        label: '面磨毛',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择面磨毛',
        requestParam: { typical: 'MX', 'parentName': '面磨毛', 'level': 2 },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_bdSuedeId: e.data.name
          })
          this.order.bd_bdSuedeId = e.data.name
          this.order.bdSuedeUuid = e.data.uuid
        }
      },
      {
        name: 'bd_polarFleece',
        type: 'select-search',
        label: '底摇粒',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择底摇粒',
        requestParam: { typical: 'MX', 'parentName': '底摇粒', 'level': 2 },
        apiUrl: `basis/api/finishedFabric/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (e) => {
          this.$refs['formfivePart'].resetData({
            bd_polarFleece: e.data.name
          })
          this.order.bd_polarFleece = e.data.name
          this.order.bdPolarFleeceUuid = e.data.uuid
        }
      }
    ]
    // }
  },
  methods: {
    // 初始化
    initOrder() {
      this.order = {
        code: '',
        spuUuid: '', // SPU编码id
        spuCode: '', // SPU编码
        compositeProcessId: '', // 复合工艺编码
        bdCombineTechUuid: '', // 复合工艺编码
        productFabric: [], // 布组合
        bdSopUuid: '', // 吸水id
        bdElasticUuid: '', // 弹性id
        salesModel: [], // 销售模式：1订单 2现货
        productSource: '', // 来源: 1自有 2外购
        bdHardnessUuid: '', // 软硬度id
        bdSmoothnessUuid: '', // 光滑度id
        bdGlutinousUuid: '', // 糯感id
        bdSuedeUuid: '', // 磨毛id
        bdPolarFleeceUuid: '', // 摇粒id
        bdCatchHairUuid: '', // 抓毛量id
        bdBrushedUuid: '', // 刷毛量id
        id: '',
        pictures: [], // 图片数组
        picText: { data: { data: '' }, dataEn: { data: '' }}, // 图文详情
        lingDiCode: '' // 3d编码
      }
    },
    // 获取列表
    async getList(data = {}) {
      const res = await colourClothList({
        ...this.dialogOptions.searchFormDatas,
        ...data
      })
      if (res.code === 200) {
        this.$set(this.dialogOptions, 'loading', false)
      }
      const userList = res.data.list || []
      this.$set(this.dialogOptions, 'dataSource', userList)
      this.$set(this.dialogOptions, 'pagination', {
        ...this.dialogOptions.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      })
    },
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
    },
    dialogHandler() {
      this.getList()
      this.$set(this.dialogOptions, 'visible', true)
    },
    // 添加布组合
    addclothCombination(params) {
      // if (this.handTableFormDataSource.length) {
      //   // 添加第二条数据进行判断，重复的数据不添加
      //   this.handTableFormDataSource.forEach((item) => {
      //     if (item.id !== params.id) {
      //       const obj = {}
      //       if (params) {
      //         obj.code = params.code
      //         obj.id = params.id
      //         obj.bdFabricationsId = params.embryo.bdFabricationsId
      //       }
      //       this.handTableFormDataSource.push(obj)
      //     }
      //   })
      //   if (this.handTableFormDataSource.length === 2) {
      //     // 根据bdFabricationsId来决定显示顺序
      //     if (
      //       this.handTableFormDataSource[0].bdFabricationsId <
      //       this.handTableFormDataSource[1].bdFabricationsId
      //     ) {
      //       this.handTableFormDataSource.splice(
      //         0,
      //         1,
      //         ...this.handTableFormDataSource.splice(
      //           1,
      //           1,
      //           this.handTableFormDataSource[0]
      //         )
      //       )
      //     }
      //   }
      // } else
      //  {
      // 添加第一条数据
      const obj = {}
      if (!params) {
        this.$message({
          type: 'warning',
          message: '请选择数据'
        })
        return
      }
      obj.code = params.code
      obj.id = params.id
      obj.uuid = params.uuid
      obj.bdFabricationsId = params.embryo.bdFabricationsId
      this.handTableFormDataSource.push(obj)
      if (this.handTableFormDataSource.length === 2) {
        // 根据bdFabricationsId来决定显示顺序
        if (
          this.handTableFormDataSource[0].bdFabricationsId <
          this.handTableFormDataSource[1].bdFabricationsId
        ) {
          this.handTableFormDataSource.splice(
            0,
            1,
            ...this.handTableFormDataSource.splice(
              1,
              1,
              this.handTableFormDataSource[0]
            )
          )
        }
      }
      // }
      this.order.productFabric = this.handTableFormDataSource
    },
    // 删除布组合
    deleteData(row) {
      this.handTableFormDataSource.splice(
        this.handTableFormDataSource.findIndex((item) => item.id === row.id),
        1
      )
    },
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign(this.order, res.data)
      this.setOrder(this.order)
      // 克隆对象this.order
      // for (var i in this.order) {
      //   this.beforeCode111[i] = this.order[i]
      // }
    },
    setOrder(order) {
      this.order.productFabric = order.productFabric // 布组合
      this.order.spuCode = order.spuCode // spu编码
      this.order.compositeProcessId =
        order.bdCombineTech && order.bdCombineTech.name // 复合工艺编码
      this.order.pictures = order.pictures // 产品主图
      this.order.productSource =
        order.productSource === 0 ? '' : order.productSource
      this.order.productSourceValue =
        order.productSource === 1 ? '自有' : '外购' // 来源
      this.order.salesModel = order.salesModel // 销售模式
      this.order.salesModelValue =
        order.salesModel &&
        order.salesModel.reduce((res, item) => {
          if (item - 0 === 1) {
            res = res ? res + ',订单' : '订单'
          } else {
            res = res ? res + ',现货' : '现货'
          }
          return res
        }, '') // 销售模式
      this.order.bd_sop = order.sop && order.sop.name // 吸水
      this.order.bd_elastic = order.elastic && order.elastic.name // 弹性
      this.order.bd_hardness = order.hardness && order.hardness.name // 软硬度
      this.order.bd_smoothness = order.smoothness && order.smoothness.name // 光滑度
      this.order.bd_glutinous = order.glutinous && order.glutinous.name // 糯感
      this.order.bd_bdSuedeId = order.suede && order.suede.name // 磨毛
      this.order.bd_polarFleece = order.polarFleece && order.polarFleece.name // 摇粒
      this.order.bd_catch_hair = order.catchHair && order.catchHair.name // 抓毛量
      this.order.bd_brushed = order.brushed && order.brushed.name // 刷毛量
      this.order.pictures &&
          this.order.pictures.length &&
          this.order.pictures.forEach((item, index) => {
            this.picturesList.push(item.showUrl)
          })
      this.order.picText =
        order.picText && order.picText.data && order.picText.dataEn
          ? order.picText
          : { data: { data: '' }, dataEn: { data: '' }} // 图文详情
      this.beforeCode = {
        id: order.id,
        spuCode: this.order.spuCode,
        bd_sop: this.order.bd_sop, // 吸水
        bd_elastic: this.order.bd_elastic, // 弹性
        bd_hardness: this.order.bd_hardness, // 软硬度
        bd_smoothness: this.order.bd_smoothness, // 光滑度
        bd_glutinous: this.order.bd_glutinous, // 糯感
        bd_bdSuedeId: this.order.bd_bdSuedeId, // 磨毛
        bd_polarFleece: this.order.bd_polarFleece, // 摇粒
        bd_catch_hair: this.order.bd_catch_hair, // 抓毛量
        bd_brushed: this.order.bd_brushed, // 刷毛量
        pictures: JSON.parse(JSON.stringify(order.pictures)),
        picText: JSON.parse(JSON.stringify(order.picText)),
        lingDiCode: order.lingDiCode,
        productSource: this.order.productSource, // 来源
        salesModel: this.order.salesModel // 销售模式
      }
    },
    /**
     * @description 预览3D编码
     */
    previewCode: debounce(
      function() {
        this.yinruFlag = true
        previewCode({ code: this.order.lingDiCode })
          .then((res) => {
            if (res.code === 200) {
              this.yinruFlag = false
              window.open(res.data.iframeSrc, '_blank')
            }
          })
          .catch((e) => {
            this.yinruFlag = false
          })
      },
      300,
      true
    ),
    /**
     * @description 删除图片
     */
    delImg(index) {
      this.$confirm('请确认是否删除图片？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.order.pictures.splice(index, 1)
          this.picturesList = []
          this.order.pictures.forEach((item) => {
            this.picturesList.push(item.showUrl)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * @description 设置主图
     */
    setMainImg(index) {
      this.order.pictures.unshift(this.order.pictures.splice(index, 1)[0])
      this.picturesList = []
      this.order.pictures.forEach((item, index) => {
        if (index !== 0) {
          item.mainPic = 0
        } else {
          item.mainPic = 1
        }
        this.picturesList.push(item.showUrl)
      })
    },
    // 取消
    cancel() {
      this.$router.push({ name: 'CompositeClothList' })
    },
    // 提交
    submitForm() {
      if (this.isAdd) {
        if (this.order.productFabric.length !== 2) {
          this.$message({
            message: '请选择2条布组合数据进行提交',
            type: 'warning'
          })
          return
        }
        this.$confirm(' 你确认要提交该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 保存之后需重新请求接口数据
          const res = await store({
            productFabric: this.order.productFabric,
            spuUuid: this.order.spuUuid,
            spuCode: this.order.spuCode,
            bdCombineTechUuid: this.order.bdCombineTechUuid
          })
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.fetchLog(
              this.getLogMessages(
                'INSERT',
                `${configData.productRequestPrefix}/api/cloth/combineFabric/store`
              ),
              {
                productFabric: this.order.productFabric,
                spuUuid: this.order.spuUuid,
                spuCode: this.order.spuCode,
                bdCombineTechUuid: this.order.bdCombineTechUuid
              },
              JSON.stringify({
                beforeText: `在'产品目录库-产品管理-复合布'新增一条记录`,
                beforeCode: {
                  productFabric: this.order.productFabric,
                  spuUuid: this.order.spuUuid,
                  spuCode: this.order.spuCode,
                  bdCombineTechUuid: this.order.bdCombineTechUuid
                }
              })
            )
            this.$router.push({ name: 'CompositeClothList' })
          }
        }).catch(() => {
          console.log('已取消提交')
        })
      } else {
        // 编辑保存
        this.$confirm(' 你确认要提交该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 保存之后需重新请求接口数据
          if (this.order.productSource === '') {
            this.order.productSource = 0
          }
          const res = await update(this.order)
          const { beforeCode, afterCode } = this.compareData(
            this.beforeCode,
            {
              id: this.order.id,
              spuCode: this.order.spuCode,
              bd_sop: this.order.bd_sop, // 吸水
              bd_elastic: this.order.bd_elastic, // 弹性
              bd_hardness: this.order.bd_hardness, // 软硬度
              bd_smoothness: this.order.bd_smoothness, // 光滑度
              bd_glutinous: this.order.bd_glutinous, // 糯感
              bd_bdSuedeId: this.order.bd_bdSuedeId, // 磨毛
              bd_polarFleece: this.order.bd_polarFleece, // 摇粒
              bd_catch_hair: this.order.bd_catch_hair, // 抓毛量
              bd_brushed: this.order.bd_brushed, // 刷毛量
              pictures: this.order.pictures,
              picText: this.order.picText,
              lingDiCode: this.order.lingDiCode,
              productSource: this.order.productSource, // 来源
              salesModel: this.order.salesModel // 销售模式
            },
            'id'
          )
          const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
          if (res.code === 200) {
            flag &&
              this.fetchLog(
                this.getLogMessages(
                  'UPDATE',
                  `${configData.productRequestPrefix}/api/cloth/combineFabric/update`
                ),
                afterCode,
                JSON.stringify({
                  beforeText: `在'产品目录库-产品管理-复合布'将数据:${this.beforeCode}`,
                  afterText: '修改为',
                  ...{ beforeCode, afterCode }
                })
              )
            this.$router.push({ name: 'CompositeClothList' })
          }
        }).catch(() => {})
      }
    }
  }
}
</script>
<style>
.is-request::before {
  content: "*";
  width: 4px;
  color: red;
}
</style>
<style lang="scss" scoped>
.tableitem {
  width: 100%;
  .titleitem {
    display: flex;
    .title {
      font-size: 16px;
      color: #151222;
      padding-right: 12px;
      line-height: 52px;
    }
    .title-h {
      width: 130px;
      line-height: 36px;
      font-weight: 400;
      text-align: right;
      font-size: 14px;
      color: #888e9e;
    }
    .tinymce-box{
      max-width: 900px;
      flex: 1;
      min-width: 580px;
    }
    .image-list {
      align-self: flex-start;
      display: flex;
      align-items: center;
      & > div {
        margin-right: 8px;
      }
      .image-item {
        border: 1px solid #e4e4e4;
        &:hover {
          border-color: #c0c4cc;
        }
      }
      .imgage-b-0 {
        border: 0;
      }
      .product-image {
        width: 140px;
        height: 100px;
      }
      .handel-img {
        display: flex;
        justify-content: space-around;
        background-color: #f9fafc;
        line-height: 32px;
        span {
          color: #1abc9c;
          cursor: pointer;
        }
      }
      /deep/.el-form-item {
        margin-bottom: 0;
        .upload-demo {
          margin: 0;
        }
      }
      /deep/.el-image-viewer__close {
        color: #ffffff;
      }
    }
  }
  /deep/ thead {
    font-size: 14px;
  }
}
.margin-b-0 {
  margin-bottom: 0;
}
.editor-content {
  max-height: 600px;
  border: 1px solid #d0d8e0;
  box-sizing: border-box;
  overflow-x: auto;
  padding: 8px;
  max-width: 900px;
  flex: 1;
  min-width: 580px;
}

.clothItem-table {
  width: 302px;
}
.showTable {
  width: 202px;
}
.clothItemAdd-table {
  width: 302px;
}
.add-btn {
  margin-left: 95px;
}
.cloth-add {
  margin-top: 15px;
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
}
.product-detail-content .product-item-content .product-content-info {
  flex-direction: column;
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
</style>

