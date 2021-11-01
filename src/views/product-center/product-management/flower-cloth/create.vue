<!--
 * @Date: 2021-04-26 15:53:26
 * @Author: Againss
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-27 11:25:46
 * @Descripttion:花布详情
-->
<template>
  <div class="product-detail-content">
    <div v-show="$route.params.id" class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">花布编码：{{ order.code }}</div>
      </div>
    </div>
    <div v-show="$route.params.id" class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formPart"
          :is-edit="false"
          :form-data="formDataPart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">主要参数</div>
      <div class="product-content-info">
        <item
          ref="formOnePart"
          :is-edit="isEdit"
          :rules="rulesOnePart"
          :form-data="formDataOnePart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">印花染色</div>
      <div class="product-content-info">
        <item
          ref="formfourPart"
          :is-edit="isEdit"
          :form-data="formDataFourPart"
          :rules="rulesFourPart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">附加信息</div>
      <div class="product-content-info">
        <item
          ref="formfivePart"
          :is-edit="hasEdit"
          :form-data="formDatafivePart"
          :order="order"
        />
        <div v-if="formDatasixPart.length" class="tableitem">
          <div class="titleitem">
            <div class="title">手感</div>
          </div>
          <item
            ref="formsixPart"
            :is-edit="hasEdit"
            :form-data="formDatasixPart"
            :order="order"
          />
        </div>

        <div v-if="formDatasevenPart.length" class="tableitem">
          <div class="titleitem">
            <div class="title">毛效</div>
          </div>
          <item
            ref="formsevenPart"
            :is-edit="hasEdit"
            :form-data="formDatasevenPart"
            :order="order"
          />
        </div>
      </div>
    </div>
    <div v-if="$route.params.id" class="product-item-content">
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
                :class="!$route.query.isEdit ? 'imgage-b-0' : 'image-item'"
              >
                <el-image
                  class="product-image"
                  :src="item.showUrl"
                  :preview-src-list="picturesList"
                  lazy
                />
                <div v-show="$route.query.isEdit" class="handel-img">
                  <span v-if="item.mainPic" style="color: #1890FF">产品主图</span>
                  <span
                    v-if="!item.mainPic"
                    style="color: #1890FF"
                    @click="setMainImg(index)"
                  >设为主图</span>
                  <span @click="delImg(index)">删除</span>
                </div>
              </div>
              <cs-custom-form
                v-if="order.pictures.length < 5 && $route.query.isEdit"
                ref="uplodForm"
                :data-source="uploadImgData"
              />
            </div>
          </div>
        </div>
        <!-- 图文详情： -->
        <div class="tableitem" style="margin-top: 24px">
          <div class="titleitem">
            <div
              v-show="$route.query.isEdit ? true : (order.picText.data.length || order.picText.dataEn.length)"
              class="title title-h"
            >
              <div>图文详情{{ isChinese ? "" : "(英)" }}</div>
              <el-switch
                v-if="$route.query.isEdit ? true : (order.picText.data.length || order.picText.dataEn.length)"
                v-model="isChinese"
                style="display: block; margin-top: 10px"
                active-color="#0986FF"
                inactive-color="#D0D8E0"
                active-text="中文"
                inactive-text="英文"
              />
            </div>
            <div
              v-show="hasEdit || order.picText.data.length ||
                order.picText.dataEn.length"
              class="tinymce-box"
            >
              <div class="detail pr">
                <div
                  id="parentNode"
                  class="ct-detail"
                  @mouseenter="detailBtnFlag = true"
                  @mouseleave="detailBtnFlag = false"
                >
                  <div
                    v-for="(item, index) in order.picText[deDataType]"
                    :id="item.index"
                    :key="index"
                    class="pic"
                    :class="{ isactive: textIndex == index }"
                    @click="getText(index)"
                  >
                    <img v-if="item.type == 'pic'" :src="item.showUrl" alt>
                    <el-input
                      v-else
                      :ref="'input' + index"
                      v-model="item.data"
                      :readonly="!hasEdit"
                      type="textarea"
                      resize="none"
                      :autosize="true"
                    />
                  </div>
                </div>
                <div v-show="hasEdit" class="detail-btn">
                  <el-button size="small" type="primary" @click="addText">添加文本</el-button>
                  <uploadItem :options="uploadOptions" />
                </div>
                <div
                  v-show="detailBtnFlag && hasEdit"
                  class="detail-float-btn"
                  @mouseenter="detailBtnFlag = true"
                  @mouseleave="detailBtnFlag = false"
                >
                  <div class="group-btn">
                    <el-button size="small" @click="upText('up')">上移</el-button>
                    <el-button size="small" @click="upText('down')">下移</el-button>
                    <el-button size="small" @click="upText('top')">置顶</el-button>
                    <el-button size="small" @click="upText('bottom')">末尾</el-button>
                    <el-button size="small" @click="upText('del')">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!$route.params.id || $route.query.isEdit"
      class="product-btn-group"
    >
      <div class="btn-groups">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <uploadSlot v-if="false" />
  </div>
</template>
<script>
import uploadItem from '@/components/cs-custom-form/upload-item'
import item from '@/views/product-center/components/detaiItem'
import uploadSlot from './components/upload-slot'
import uploadText from './components/upload-text'
import Sortable from 'sortablejs'
import logMethods from '@/views/product-center/mixin/log-methods'

import {
  colorCode,
  flowerFabricShow,
  flowerFabricStore,
  flowerFabricUpdate,
  previewCode,
  getFabricWeight,
  getFabricWidth
} from './api'
import configData from '@/views/product-center/configDock/index.js'
import { debounce } from '@/utils'
export default {
  name: 'ColourClothCreate',
  components: {
    uploadItem,
    item,
    uploadSlot
  },
  mixins: [logMethods],
  data() {
    // 字段信息 （根据页面结构需分段）
    const formDataPart = [
      {
        name: 'dataFromValue',
        notEdit: 'true',
        type: 'input',
        label: '数据来源'
      },
      {
        showValue: 'sourceOrderTypeName',
        notEdit: 'true',
        type: 'input',
        label: '来源订单类型'
      },
      {
        name: 'sourceOrder',
        notEdit: 'true',
        type: 'input',
        label: '来源单号'
      },
      {
        name: 'creatorRealName',
        notEdit: 'true',
        type: 'input',
        label: '创建人'
      },
      {
        name: 'createdTime',
        notEdit: 'true',
        type: 'input',
        label: '创建时间'
      },
      {
        name: 'updatorRealName',
        notEdit: 'true',
        type: 'input',
        label: '更新人'
      },
      {
        name: 'updatedTime',
        notEdit: 'true',
        type: 'input',
        label: '更新时间'
      },
      {
        name: 'skuStatus',
        showValue: 'skuStatusName',
        type: 'select',
        label: '状态',
        disabled: true,
        optionsValue: 'id',
        options: [{ id: 1, name: '正式' }, { id: 2, name: '临时' }]
      }
    ]
    const menfu = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入幅宽区间值'))
      }
      // setTimeout(() => {
      if (!/(^[1-9]\d*$)/.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        if (value > 10000) {
          callback(new Error('请输入小于10000正整数'))
        } else {
          callback()
        }
      }
      // }, 300);
    }

    const kezhong = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入花布克重区间值'))
      }
      // setTimeout(() => {
      if (!/(^[1-9]\d*$)/.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        if (value > 10000) {
          callback(new Error('请输入小于10000正整数'))
        } else {
          callback()
        }
      }
      // }, 300);
    }

    const rulesOnePart = {
      colorCode: [
        { message: '请输入色布编码', required: true, trigger: 'blur' }
      ],
      fabricWidth: [{ validator: menfu, required: true, trigger: 'change' }],
      fabricWeight: [{ validator: kezhong, trigger: 'change', required: true }]
    }
    const formDataOnePart = [
      {
        name: 'colorCode',
        type: 'input',
        label: '色布编码',
        placeholder: '请输入色布编码',
        blurHandler: (e) => {
          // console.log(e.target.value, "坯纱编码失去焦点");
          this.testPiCode(e.target.value)
          this.order.colorCode = e.target.value
        }
      },
      {
        type: 'mutInput',
        label: '花布幅宽',
        showValue: 'fabricWidth',
        leftPart: {
          name: 'fabricWidth',
          type: 'input',
          placeholder: '请输入花布幅宽',
          blurHandler: async(e) => {
            if (isNaN(e.target.value) || e.target.value === '') {
              this.order.fabricWidth = e.target.value
              this.$refs['formOnePart'].resetData({
                fabricWidth: e.target.value
              })
              return
            }
            const data = await getFabricWidth({
              search_value: e.target.value
            })
            this.order.fabricWidth = data.data.midVal || ''
            this.$refs['formOnePart'].resetData({
              fabricWidth: this.order.fabricWidth
            })
          }
        },
        rightPart: {
          isText: true,
          value: 'cm',
          style: 'text-align:left;padding-left:5px;'
        }
      },
      {
        type: 'mutInput',
        label: '花布克重',
        showValue: 'fabricWeight',
        leftPart: {
          name: 'fabricWeight',
          type: 'input',
          placeholder: '请输入克重',
          blurHandler: async(e) => {
            if (isNaN(e.target.value) || e.target.value === '') {
              this.order.fabricWeight = e.target.value
              this.$refs['formOnePart'].resetData({
                fabricWeight: e.target.value
              })
              return
            }
            // 获取花布克重进行替换
            const data = await getFabricWeight({
              search_value: e.target.value
            })
            this.order.fabricWeight = data.data.midVal || ''
            this.$refs['formOnePart'].resetData({
              fabricWeight: this.order.fabricWeight
            })
          }
        },
        rightPart: {
          isText: true,
          value: 'g/m²',
          style: 'text-align:left;padding-left:5px;'
        }
      }
    ]
    const rulesFourPart = {
      colorProductFlowerName: [{ message: '请选择花号', required: true, trigger: 'change' }]
    }
    // 印花染色
    const formDataFourPart = [
      {
        name: 'colorProductFlowerName',
        type: 'select-search',
        label: '花号',
        placeholder: '请选择花号',
        searchValue: 'flowerCode', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `color/api/flower/droplist`,
        optionsLabel: 'flowerCode',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        // filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.colorProductFlowerName = data && data.data ? data.data.flowerCode : ''
          this.order.colorProductFlowerUuid = data && data.data ? data.data.uuid : 0
          // this.order.productFlower = data.data;
          this.$refs['formfourPart'].resetData({
            colorProductFlowerName: data && data.data ? data.data.flowerCode : ''
          })
        }
      }
    ]
    // 附加信息
    const formDatafivePart = [
      {
        name: 'spuCode',
        type: 'select-search',
        label: 'SPU编码',
        placeholder: '请选择SPU编码',
        searchValue: 'code', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `${configData.productRequestPrefix}/api/spu/all`,
        optionsLabel: 'code',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        // filterable: false, // 不需要搜索
        clearable: true,
        changeSelectVal: (data) => {
          this.order.spuCode = data && data.data ? data.data.code : ''
          this.order.spuUuid = data && data.data ? data.data.uuid : ''
          this.$refs['formfivePart'].resetData({
            spuCode: data && data.data ? data.data.code : ''
          })
        }
      },
      {
        name: 'techPrintTechName',
        type: 'select-search',
        label: '印花工艺编码',
        placeholder: '请选择印花工艺编码',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `${configData.productRequestPrefix}/api/tech/printTech/all`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        // filterable: false, // 不需要搜索
        clearable: true,
        changeSelectVal: (data) => {
          this.order.techPrintTechName = data && data.data ? data.data.name : ''
          this.order.techPrintTechUuid = data && data.data ? data.data.uuid : ''
          // this.order.printTech = data.data;
          this.$refs['formfivePart'].resetData({
            techPrintTechName: data && data.data ? data.data.name : ''
          })
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
        blurHandler: async(e) => {
          this.order.lingDiCode = e.target.value
        }
      }
    ]
    const uploadImgData = [
      {
        prop: 'upload',
        itemType: 'upload',
        onSuccess: (res, file) => {
          // console.log(res, "res");
          // console.log(file, "file");
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
          if (!isImg || !file.type) {
            this.$message.error(
              '上传图片只能是 .gif,.jpg,.jpeg,.png,.bmp 格式!'
            )
            return false
          }
          if (!isLt5M) {
            this.$message.error('上传图片大小不能超过 5MB!')
            return false
          }
          // return isImg && isLt5M
        },
        content: [
          {
            slot: 'trigger',
            component: uploadSlot
          }
        ],
        action: `${configData.productRequestPrefix}/api/cloth/flowerFabric/upload`,
        accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
        showFileList: false,
        timeout: 30000
      }
    ]
    const uploadOptions = {
      accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
      action: `${configData.productRequestPrefix}/api/cloth/flowerFabric/uploadPicText`,
      multiple: true,
      className: 'uploadImg',
      content: [
        {
          slot: 'trigger',
          component: uploadText
        }
      ],
      listType: 'picture-card',
      showFileList: false,
      onSuccess: this.handleSuccessDetail,
      beforeUpload: this.handleBeforeUpload1,
      uploadChange: () => {}
    }
    return {
      formDataPart,
      isChinese: true,
      accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
      order: {},
      beforeCode: {}, // 日志数据
      picturesList: [], // 产品主图预览
      isEdit: true,
      hasEdit: true, // 是否是编辑状态,控制附加信息和图文信息内容是否可以编辑，true：可以编辑
      rulesOnePart,
      formDataOnePart,
      formDataFourPart, // 印花染色
      rulesFourPart,
      formDatafivePart, // 附加信息
      formDatasixPart: [], // 手感
      formDatasevenPart: [], // 毛效
      formDataEightPart, // 图片详情3D编码
      uploadImgData,
      formOtions: {
        inline: true
      },
      yinruFlag: false,
      configData,
      textIndex: -1,
      detailBtnFlag: false,
      uploadOptions,
      deDataType: 'data'
    }
  },
  watch: {
    isChinese: function(val) {
      this.deDataType = val ? 'data' : 'dataEn'
      this.textIndex = -1
    }
  },
  created() {
    this.initOrder()
    // 查看状态时全部都不能编辑，编辑状态时附加信息和图文信息可以编辑
    if (this.$route.params.id) {
      // 查看
      this.isEdit = false
      this.hasEdit = false
      this.formDatasixPart = [
        {
          name: 'hardnessName',
          type: 'select-search',
          label: '软硬度',
          placeholder: '请选择软硬度',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'SG', 'parentName': '软硬度', 'level': 2 },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          filterable: false,
          notEdit: false,
          changeSelectVal: (data) => {
            this.order.hardnessName = data.data.name
            this.order.bdHardnessUuid = data.data.uuid
            this.$refs['formsixPart'].resetData({
              hardnessName: data.data.name
            })
          }
        },
        {
          name: 'smoothnessName',
          type: 'select-search',
          label: '光滑度',
          placeholder: '请选择光滑度',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'SG', 'parentName': '光滑度', 'level': 2 },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          filterable: false,
          notEdit: false,
          changeSelectVal: (data) => {
            this.order.smoothnessName = data.data.name
            this.order.bdSmoothnessUuid = data.data.uuid
            this.$refs['formsixPart'].resetData({
              smoothnessName: data.data.name
            })
          }
        },
        {
          name: 'glutinousName',
          type: 'select-search',
          label: '糯感',
          placeholder: '请选择糯感',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'SG', 'parentName': '糯感', 'level': 2 },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          filterable: false,
          notEdit: false,
          changeSelectVal: (data) => {
            this.order.glutinousName = data.data.name
            this.order.bdGlutinousUuid = data.data.uuid
            this.$refs['formsixPart'].resetData({
              glutinousName: data.data.name
            })
          }
        }
      ]
      this.formDatasevenPart = [
        {
          name: 'catchHairName',
          type: 'select-search',
          label: '底抓毛',
          placeholder: '请选择底抓毛',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'MX', 'parentName': '底抓毛', 'level': 2 },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          filterable: false,
          notEdit: false,
          changeSelectVal: (data) => {
            this.order.catchHairName = data.data.name
            this.order.bdCatchHairUuid = data.data.uuid
            this.$refs['formsevenPart'].resetData({
              catchHairName: data.data.name
            })
          }
        },
        {
          name: 'brushedName',
          type: 'select-search',
          label: '面刷毛',
          placeholder: '请选择面刷毛',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'MX', 'parentName': '面刷毛', 'level': 2 },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          filterable: false,
          notEdit: false,
          changeSelectVal: (data) => {
            this.order.brushedName = data.data.name
            this.order.bdBrushedUuid = data.data.uuid
            this.$refs['formsevenPart'].resetData({
              brushedName: data.data.name
            })
          }
        },
        {
          name: 'suedeName',
          type: 'select-search',
          label: '面磨毛',
          placeholder: '请选择面磨毛',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'MX', 'parentName': '面磨毛', 'level': 2 },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          filterable: false,
          notEdit: false,
          changeSelectVal: (data) => {
            this.order.suedeName = data.data.name
            this.order.bdSuedeUuid = data.data.uuid
            this.$refs['formsevenPart'].resetData({
              suedeName: data.data.name
            })
          }
        },
        {
          name: 'polarFleeceName',
          type: 'select-search',
          label: '底摇粒',
          placeholder: '请选择底摇粒',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'MX', 'parentName': '底摇粒', 'level': 2 },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          notEdit: false,
          filterable: false,
          changeSelectVal: (data) => {
            this.order.polarFleeceName = data.data.name
            this.order.bdPolarFleeceUuid = data.data.uuid
            this.$refs['formsevenPart'].resetData({
              polarFleeceName: data.data.name
            })
          }
        }
      ]
      const params = [
        // {
        //   name: "productSource",
        //   type: "select",
        //   label: "成品来源",
        //   placeholder: "请选择来源",
        //   options: [
        //     { name: "自有", id: 1 },
        //     { name: "外购", id: 2 },
        //   ],
        //   optionsValue: "id",
        //   showValue: "productSourceName",
        //   disabled: true,
        //   changeHandler: (data) => {
        //     this.order.productSource = data;
        //   },
        // },
        {
          name: 'saleModel',
          showValue: 'salesModelName',
          type: 'select',
          multiple: true,
          label: '销售模式',
          placeholder: '请选择销售模式',
          options: [
            { name: '订单', id: 1 },
            { name: '现货', id: 2 }
          ],
          optionsValue: 'id',
          notEdit: !this.$route.query.isEdit,
          changeHandler: (data) => {
            this.order.saleModel = data
          }
        },
        {
          name: 'sopName',
          type: 'select-search',
          label: '吸水',
          placeholder: '请选择吸水',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'XSX' },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          notEdit: !this.$route.query.isEdit,
          filterable: false, // 不需要搜索
          changeSelectVal: (data) => {
            this.order.sopName = data.data.name
            this.order.bdSopUuid = data.data.uuid
            this.$refs['formfivePart'].resetData({
              sopName: data.data.name
            })
          }
        },
        {
          name: 'elasticName',
          type: 'select-search',
          label: '弹性',
          placeholder: '请选择弹性',
          searchValue: 'name', // 搜索比如name='智布'
          valueKey: 'uuid',
          requestParam: { typical: 'TX' },
          apiUrl: `basis/api/finishedFabric/option`,
          optionsLabel: 'name',
          optionsValue: 'uuid',
          requestFormat: 'list',
          requestMode: 'post',
          notEdit: !this.$route.query.isEdit,
          filterable: false, // 不需要搜索
          changeSelectVal: (data) => {
            this.order.elasticName = data.data.name
            this.order.bdElasticUuid = data.data.uuid
            this.$refs['formfivePart'].resetData({
              elasticName: data.data.name
            })
          }
        },
        {
          name: 'productSourceName',
          type: 'input',
          label: '成品来源',
          notEdit: 'true'
        }
      ]
      this.formDatafivePart = this.formDatafivePart.concat(params)
      this.getOrder(this.$route.params.id)
      if (this.$route.query.isEdit) {
        // 编辑
        this.hasEdit = true
      }
    }
  },
  mounted() {
    // 初始化拖拽
    this.initSortable()
  },
  methods: {
    initSortable() {
      if (this.hasEdit) {
        const _this = this
        // if (this.order.picText.data.length) {
        const $ul1 = document.querySelector('#parentNode')
        $ul1 && new Sortable($ul1, {
          animation: 150,
          scroll: $ul1,
          sort: true,
          scrollSensitivity: 200, // 滚动的灵敏度,其实是拖拽离滚动边界的距离触发事件的距离边界+-80px的地方触发拖拽滚动事件，
          ignore: 'a, img', // a 或者是img
          fallbackOnBody: false, // 是否把拖拽镜像节点ghostEl放到body上
          forceFallback: false,
          scrollSpeed: 10, // 滚动速度
          draggable: '.pic', // 允许拖拽的项目类名
          // 开始拖拽的时候
          onStart: (/** Event*/ evt) => {
            _this.detailBtnFlag = false
          },

          // 结束拖拽
          onEnd: (/** Event*/ evt) => {
            _this.detailBtnFlag = true
          },
          onUpdate: event => {
            // 修改items数据顺序
            const newIndex = event.newIndex
            const oldIndex = event.oldIndex
            const $li = $ul1.children[newIndex]
            const $oldLi = $ul1.children[oldIndex]
            // 先删除移动的节点
            $ul1.removeChild($li)
            // 再插入移动的节点到原有节点，还原了移动的操作
            if (newIndex > oldIndex) {
              $ul1.insertBefore($li, $oldLi)
            } else {
              $ul1.insertBefore($li, $oldLi.nextSibling)
            }
            // 更新items数组
            const item = _this.order.picText[this.deDataType].splice(
              oldIndex,
              1
            )
            _this.order.picText[this.deDataType].splice(
              newIndex,
              0,
              item[0]
            )
            _this.textIndex = newIndex
            console.log(_this.order.picText[this.deDataType])

            // 下一个tick就会走patch更新
          }
        })
      }
    },
    /**
     * @description 初始化
     */
    initOrder() {
      this.order = {
        code: '', // 花布编码
        colorCode: '', // 色布编码
        colorUuid: 0, // 坯布id
        fabricWidth: '', // 花布幅宽
        fabricWeight: '', // 花布克重
        bdMainTechnologyUuid: '', // 主工艺id
        clothMainTech: null, // 主工艺
        skuStatus: 1, // 状态 默认1正式；2临时
        skuStatusName: '正式', // 状态查看时的值-
        sourceOrderTypeName: '-', // 来源订单类型 查看时的值
        colorProductFlowerUuid: 0, // 花号id
        colorProductFlowerName: '', // 花号
        spuUuid: '', // spuid
        spuCode: '', // spu编码
        techPrintTechUuid: '', // 印花工艺id
        techPrintTechName: '', // 印花工艺
        productSource: 1, // 产品来源
        productSourceName: '自有', // 产品来源
        saleModel: [], // 销售类型
        salesModelName: '', // 销售类型(显示使用)
        bdSopUuid: '', // 吸水id
        sopName: '', // 吸水
        bdElasticUuid: '', // 弹性id
        elasticName: '', // 弹性
        bdHardnessUuid: '', // 软硬度id
        hardnessName: '', // 软硬度
        bdSmoothnessUuid: '', // 光滑度id
        smoothnessName: '', // 光滑度
        bdGlutinousUuid: '', // 糯感id
        glutinousName: '', // 糯感
        bdSuedeUuid: '', // 面磨id
        suedeName: '', // 面磨bdPolarFleeceId
        bdPolarFleeceUuid: '', // 底摇粒id
        polarFleeceName: '', // 底摇粒
        bdCatchHairUuid: '', // 底抓毛id
        catchHairName: '', // 底抓毛
        bdBrushedUuid: '', // 面刷毛id
        brushedName: '', // 面刷毛
        pictures: [], // 图片
        picText: { data: [], dataEn: [] }, // 图文详情
        lingDiCode: '' // 3D编码
      }
    },
    /**
     * @description 获取单据数据
     */
    async getOrder(id) {
      const res = await flowerFabricShow({ id })
      this.order = Object.assign(this.order, res.data)
      this.setOrder(this.order)
    },
    /**
     * @description 设置order
     */
    setOrder(orderdata) {
      if (orderdata.id) {
        const order = Object.assign({ id: orderdata.id }, orderdata, orderdata.additional)
        this.order.creatorRealName = order.creator && (order.creator.name + '/' + order.creator.realName) || ''
        this.order.skuStatusName = order.skuStatus === 1 ? '正式' : '临时'

        order.sourceOrderType = order.sourceOrderType || 0
        let sourceOrderTypeName = '-'
        switch ((order.sourceOrderType - 0)) {
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
        this.order.sourceOrderTypeName = sourceOrderTypeName // 来源订单类型
        this.order.updatedTime = order.updatedTime
          ? this.$filters.parseTime(order.updatedTime, '{y}-{m}-{d} {h}:{i}')
          : ''
        this.order.createdTime = this.$filters.parseTime(
          order.createdTime || 0,
          '{y}-{m}-{d} {h}:{i}'
        )
        this.order.dataFromValue = this.getDataFrom(order.dataSource)
        this.order.fabricWidth = order.fabricWidth && order.fabricWidth + 'cm' // 花布幅宽
        this.order.fabricWeight =
          order.fabricWeight && order.fabricWeight + 'g/m²' // 克重
        this.order.productSourceName = '自有' // 产品来源
        this.order.salesModelName = order.saleModels.reduce((str, item) => {
          return str ? (str + '、' + item.saleModelName) : item.saleModelName
        }, '')
        this.order.saleModel = order.saleModels.map(item => item.saleModel)
        this.order.techPrintTechName = order.printTech
          ? order.printTech.name
          : '' // 印花工艺
        this.order.colorProductFlowerName = order.productFlower
          ? order.productFlower.name
          : '' // 花号

        this.order.sopName = order.additional && order.additional.sop ? order.additional.sop.name : '' // 吸水
        this.order.bdSopUuid = order.additional && order.additional.bdSopUuid || '' // 吸水id
        this.order.elasticName = order.additional && order.additional.elastic ? order.additional.elastic.name : '' // 弹性
        this.order.bdElasticUuid = order.additional && order.additional.bdElasticUuid || '' // 弹性id
        this.order.hardnessName = order.additional && order.additional.hardness ? order.additional.hardness.name : '' // 软硬度
        this.order.bdHardnessUuid = order.additional && order.additional.bdHardnessUuid || '' // 软硬度id
        this.order.smoothnessName = order.additional && order.additional.smoothness
          ? order.additional.smoothness.name
          : '' // 光滑度
        this.order.bdSmoothnessUuid = order.additional && order.additional.bdSmoothnessUuid || '' // 光滑度id
        this.order.glutinousName = order.additional && order.additional.glutinous ? order.additional.glutinous.name : '' // 糯感
        this.order.bdGlutinousUuid = order.additional && order.additional.bdGlutinousUuid || '' // 糯感id
        this.order.suedeName = order.additional && order.additional.suede ? order.additional.suede.name : '' // 面磨毛
        this.order.bdSuedeUuid = order.additional && order.additional.bdSuedeUuid || '' // 面磨毛id
        this.order.polarFleeceName = order.additional && order.additional.polarFleece
          ? order.additional.polarFleece.name
          : '' // 底摇粒
        this.order.bdPolarFleeceUuid = order.additional && order.additional.bdPolarFleeceUuid || '' // 底摇粒id
        this.order.catchHairName = order.additional && order.additional.catchHair ? order.additional.catchHair.name : '' // 底抓毛
        this.order.bdCatchHairUuid = order.additional && order.additional.bdCatchHairUuid || '' // 底抓毛id
        this.order.brushedName = order.additional && order.additional.brushed ? order.additional.brushed.name : '' // 面刷毛
        this.order.bdBrushedUuid = order.additional && order.additional.bdBrushedUuid || '' // 面刷毛id

        // this.order.sopName = order.sop ? order.sop.name : '' // 吸水
        // this.order.elasticName = order.elastic ? order.elastic.name : '' // 弹性
        // this.order.hardnessName = order.hardness ? order.hardness.name : '' // 软硬度
        // this.order.smoothnessName = order.smoothness
        //   ? order.smoothness.name
        //   : '' // 光滑度
        // this.order.glutinousName = order.glutinous ? order.glutinous.name : '' // 糯感
        // this.order.suedeName = order.suede ? order.suede.name : '' // 面磨毛
        // this.order.polarFleeceName = order.polarFleece
        //   ? order.polarFleece.name
        //   : '' // 底摇粒
        // this.order.catchHairName = order.catchHair ? order.catchHair.name : '' // 底抓毛
        // this.order.brushedName = order.brushed ? order.brushed.name : '' // 面刷毛
        this.order.pictures &&
          this.order.pictures.length &&
          this.order.pictures.forEach((item, index) => {
            this.picturesList.push(item.showUrl)
          })
        this.order.picText = {
          data: order.picText && order.picText.data || [],
          dataEn: order.picText && order.picText.dataEn || []
        }
        // this.order.picText.data = order.picText && order.picText.data || []
        // this.order.picText.dataEn = order.picText && order.picText.dataEn || []// 图文详情
        this.beforeCode = {
          id: order.id,
          code: order.code,
          spuUuid: order.spuUuid,
          spuCode: order.spuCode,
          techDyeTechUuid: order.techDyeTechUuid,
          techPrintTechUuid: order.techPrintTechUuid,
          productSource: order.productSource,
          saleModel: order.saleModels,
          bdSopUuid: order.bdSopUuid,
          bdElasticUuid: order.bdElasticUuid,
          bdHardnessUuid: order.bdHardnessUuid,
          bdSmoothnessUuid: order.bdSmoothnessUuid,
          bdGlutinousUuid: order.bdGlutinousUuid,
          bdSuedeUuid: order.bdSuedeUuid,
          bdPolarFleeceUuid: order.bdPolarFleeceUuid,
          bdCatchHairUuid: order.bdCatchHairUuid,
          bdBrushedUuid: order.bdBrushedUuid,
          pictures: JSON.parse(JSON.stringify(order.pictures)),
          picText: JSON.parse(JSON.stringify(order.picText)),
          lingDiCode: order.lingDiCode
        }
        this.order.updatorRealName = this.order.updator
          ? this.order.updator.name
            ? this.order.updator.name + '/' + this.order.updator.realName
            : this.order.updator.realName : ''
        this.order.updatedTime = this.$filters.parseTime(
          order.updatedTime,
          '{y}-{m}-{d} {h}:{i}'
        )
      }
    },
    // 数据来源
    getDataFrom(dataFrom) {
      let str = '产品目录库'
      switch (dataFrom) {
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
    },
    /**
     * @description 验证坯纱编码
     */
    async testPiCode(code) {
      if (code) {
        const res = await colorCode({ code })
        if (res.code === 200) {
          this.order.colorUuid = res.data.uuid
        } else {
          this.order.colorUuid = 0
        }
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
          this.imgFn()
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
      this.imgFn()
    },
    /**
     * @description 图片公用方法
     */
    imgFn() {
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
      this.$router.go(-1)
    },
    // 提交
    submitForm() {
      let canSubmit = true
      // 新增时验证
      if (!this.order.id) {
        this.$refs.formOnePart.$refs.form.validate((valid) => {
          if (valid) {
            canSubmit = true
          } else {
            canSubmit = false
          }
        })
        canSubmit && this.$refs.formfourPart.$refs.form.validate((valid) => {
          if (valid) {
            canSubmit = true
          } else {
            canSubmit = false
          }
        })
      }
      if (canSubmit) {
        this.$confirm(' 你确认要提交该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 保存之后需重新请求接口数据
          let res = null
          if (this.order.id) {
            // 编辑
            console.log(this.order, 'this.order999')
            res = await flowerFabricUpdate({ ...this.order })
            // 日志功能
            const { beforeCode, afterCode } = this.compareData(
              this.beforeCode,
              {
                id: this.order.id,
                code: this.order.code,
                spuUuid: this.order.spuUuid,
                spuCode: this.order.spuCode,
                techDyeTechUuid: this.order.techDyeTechUuid,
                techPrintTechUuid: this.order.techPrintTechUuid,
                productSource: this.order.productSource,
                saleModel: this.order.saleModels,
                bdSopUuid: this.order.bdSopUuid,
                bdElasticUuid: this.order.bdElasticUuid,
                bdHardnessUuid: this.order.bdHardnessUuid,
                bdSmoothnessUuid: this.order.bdSmoothnessUuid,
                bdGlutinousUuid: this.order.bdGlutinousUuid,
                bdSuedeUuid: this.order.bdSuedeUuid,
                bdPolarFleeceUuid: this.order.bdPolarFleeceUuid,
                bdCatchHairUuid: this.order.bdCatchHairUuid,
                bdBrushedUuid: this.order.bdBrushedUuid,
                pictures: this.order.pictures,
                picText: this.order.picText,
                lingDiCode: this.order.lingDiCode
              },
              'id'
            )
            const flag =
              JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag &&
              this.fetchLog(
                this.getLogMessages(
                  'UPDATE',
                  `${configData.productRequestPrefix}/api/cloth/flowerFabric/update`
                ),
                afterCode,
                JSON.stringify({
                  beforeText: `在'产品目录库-产品管理-花布'将花布编码:${this.order.code}`,
                  afterText: '修改为',
                  ...{ beforeCode, afterCode }
                })
              )
          } else {
            // 新增
            res = await flowerFabricStore({ ...this.order })
            // 日志功能
            this.fetchLog(
              this.getLogMessages(
                'INSERT',
                `${configData.productRequestPrefix}/api/cloth/flowerFabric/store`
              ),
              this.order,
              JSON.stringify({
                beforeText: `在'产品目录库-产品管理-花布'新增一条记录`,
                beforeCode: this.order
              })
            )
          }
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.$router.push({ name: 'FlowerClothList' })
          }
        }).catch(() => {})
      }
    },
    addText() {
      if (this.order.picText[this.deDataType].length >= 20) {
        this.$message('图片和文字模块不能超过20个')
        return
      }
      this.order.picText[this.deDataType].push({
        type: 'text',
        data: '',
        index: this.order.picText[this.deDataType].length
      })
      this.$nextTick(() => {
        const id = 'input' + (this.order.picText[this.deDataType].length - 1)
        this.$refs[id][0].focus()
      })
    },
    // 成功图文详情
    handleSuccessDetail(response, file, fileList) {
      if (response.code === 200) {
        if (this.order.picText[this.deDataType].length >= 20) {
          this.$message('图片和文字模块不能超过20个')
          return
        }
        this.order.picText[this.deDataType].push({
          index: this.order.picText[this.deDataType].length,
          type: 'pic',
          data: response.data.pictureUrl,
          showUrl: response.data.showUrl
        })
      } else {
        // 超出最大限制不显示图片
        fileList.pop()
      }
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    handleBeforeUpload1(file) {
      const fileType = file.type.split('/')[1]
      const regexp = new RegExp(fileType)
      const isImg = regexp.test(this.accept)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isImg || !file.type) {
        this.$message.error(
          '上传图片只能是 .gif,.jpg,.jpeg,.png,.bmp 格式!'
        )
        return false
      }
      if (!isLt5M) {
        this.$message({
          message: '图片大小必须小于5mb',
          type: 'error'
        })
        return false
      }
      if (this.order.picText[this.deDataType].length >= 20) {
        this.$message('图片和文字模块不能超过20个')
        return false
      }
    },
    getText(index) {
      this.textIndex = index
    },
    // 上移// 下移
    // 置顶
    // 末尾
    // 删除
    upText(type) {
      if (this.textIndex === -1) {
        this.$message('请选择目标')
        return
      }
      if (type === 'up') {
        if (this.textIndex === 0) {
          this.$message('已经是顶部了')
          return
        } else {
          this.order.picText[this.deDataType][
            this.textIndex
          ] = this.order.picText[this.deDataType].splice(
            this.textIndex - 1,
            1,
            this.order.picText[this.deDataType][this.textIndex]
          )[0]
          this.textIndex--
        }
      }
      if (type === 'down') {
        if (
          this.textIndex ===
            this.order.picText[this.deDataType].length - 1
        ) {
          this.$message('已经是底部了')
          return
        } else {
          this.order.picText[this.deDataType][
            this.textIndex
          ] = this.order.picText[this.deDataType].splice(
            this.textIndex + 1,
            1,
            this.order.picText[this.deDataType][this.textIndex]
          )[0]
          this.textIndex++
        }
      }
      if (type === 'top') {
        this.order.picText[this.deDataType].unshift(
          this.order.picText[this.deDataType].splice(this.textIndex, 1)[0]
        )

        this.textIndex = 0
      }
      if (type === 'bottom') {
        this.order.picText[this.deDataType].push(
          this.order.picText[this.deDataType].splice(this.textIndex, 1)[0]
        )
        this.textIndex = this.order.picText[this.deDataType].length - 1
      }
      if (type === 'del') {
        this.order.picText[this.deDataType].splice(this.textIndex, 1)

        this.textIndex = -1
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
          color: #FE4949;
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
  ::v-deep
  .uploadImg {
    margin: 0 !important;
  }
}
.product-style-table {
  /deep/ .el-form .el-form-item {
    margin-bottom: 20px;
  }
}
.m-b-0 {
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
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
.detail {
  display: flex;
  .ct-detail {
    width: 500px;
    height: 400px;
    margin-right: 20px;
    padding: 30px 20px 0;
    border: 1px solid #dcdfe6;
    overflow-y: auto;
    .pic {
      background: #ecf5ff;
      border-bottom: 1px solid #dcdfe6;
    }
    .isactive {
      border: 1px solid #0884ef;
    }
    img {
      width: 100%;
      height: auto;
      text-align: center;
    }
    .el-textarea {
      margin: 0 0 5px;
    }
  }
  .detail-btn {
    .switch {
      margin-bottom: 20px;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .detail-float-btn {
    position: absolute;
    .group-btn {
      width: 500px;
      display: flex;
      justify-content: center;
    }
  }
  /deep/.el-upload--picture-card {
    line-height: 0px;
    width: 100%;
    margin-top: 20px;
    height: 0;
    border: 0;
  }
  /deep/.el-textarea__inner {
    border: 0;
    font: 400 13.3333px Arial;
    overflow-y: hidden;
    background-color: #ecf5ff;
  }
}
</style>

