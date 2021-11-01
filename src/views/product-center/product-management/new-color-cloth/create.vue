<!--
 * @Author: Sanmao
 * @Date: 2020-09-30 10:00:40
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-26 11:39:42
 * @Descripttion: 色布详情
-->
<template>
  <div class="product-detail-content">
    <div v-show="$route.params.id" class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">色布编码：{{ order.code }}</div>
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
        <!-- 染整工艺组合 -->
        <div class="tableitem">
          <div class="titleitem">
            <item
              ref="formclothMainPart"
              :is-edit="!$route.params.id"
              :rules="rulesclothMainPart"
              :form-data="formDataclothMainTechPart"
              :order="order"
              class="main-tech"
            />
            <!-- <span
              style="width: 10px; height: 36px; background: #fff; z-index: 9"
            />
            <div>
              <el-button
                v-if="!$route.params.id"
                size="small"
                style="margin-top: 2px"
                @click="dialogHandler"
              >设置</el-button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div v-if="order.productStyle && order.productStyle.length" class="product-item-content">
      <div class="product-content-title">风格整理</div>
      <div class="product-content-info">
        <cs-custom-form
          ref="productStyle"
          :reset-errors="styleErroes"
          :options="styleOptions"
          :data-source="styleDataSource"
          class="product-style-table"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">手感整理</div>
      <div class="product-content-info">
        <item
          v-if="!$route.params.id"
          ref="formTwoPart"
          :is-edit="isEdit"
          :rules="rulesTwoPart"
          :form-data="formDataTwoPart"
          :order="order"
        />
        <cs-custom-form
          ref="productFeel"
          :reset-errors="feelErroes"
          :options="feelOptions"
          :data-source="handDataSource"
          class="product-style-table"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">功能整理</div>
      <div class="product-content-info">
        <item
          v-if="!$route.params.id"
          ref="formThreePart"
          :is-edit="isEdit"
          :rules="rulesThreePart"
          :form-data="formDataThreePart"
          :order="order"
        />
        <cs-custom-form
          ref="productFunction"
          :reset-errors="isErroes"
          :options="formOptions"
          :data-source="functionDataSource"
          class="product-style-table"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">印花染色</div>
      <div class="product-content-info">
        <item
          ref="formfourPart"
          :is-edit="isEdit"
          :form-data="formDatafourPart"
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
        <!-- :rules="rulesFivePart" -->
        <div v-if="formDatasixPart.length" class="tableitem">
          <div class="titleitem border-sty">
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
          <div class="titleitem border-sty">
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
                  <span v-if="item.mainPic" style="color: #1890ff">产品主图</span>
                  <span
                    v-if="!item.mainPic"
                    style="color: #1890ff"
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
              v-show="$route.query.isEdit ? true
                : order.picText.data.length || order.picText.dataEn.length"
              class="title title-h"
            >
              <div>图文详情{{ isChinese ? "" : "(英)" }}</div>
              <el-switch
                v-if="$route.query.isEdit ? true
                  : order.picText.data.length || order.picText.dataEn.length"
                v-model="isChinese"
                style="display: block; margin-top: 10px"
                active-color="#0986FF"
                inactive-color="#D0D8E0"
                active-text="中文"
                inactive-text="英文"
              />
            </div>
            <div
              v-show="hasEdit || order.picText.data.length || order.picText.dataEn.length"
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
                  <!-- <el-upload
                    :accept="accept"
                    :action="`${$store.state.app.baseURL}${configData.productRequestPrefix}/api/cloth/productFabric/uploadPicText`"
                    :multiple="true"
                    :headers="headers"
                    list-type="picture-card"
                    :show-file-list="false"
                    :on-success="handleSuccessDetail"
                    :before-upload="handleBeforeUpload1"
                  >
                    <div>
                      <el-button
                        size="small"
                        type="primary"
                      >添加图片</el-button>
                    </div>
                  </el-upload> -->
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
    <!-- <dialogs :options="dialogOptions" :form-otions="formOtions" /> -->
    <!-- <uploadSlot v-if="false" /> -->
  </div>
</template>
<script>
import uploadItem from '@/components/cs-custom-form/upload-item'
import item from '@/views/product-center/components/detaiItem'
// import dialogs from '@/views/product-center/components/dialog'
// import Tinymce from '@/views/product-center/components/tinymce'
import uploadSlot from './components/upload-slot'
import uploadText from './components/upload-text'
import Sortable from 'sortablejs'
import logMethods from '@/views/product-center/mixin/log-methods'
// import { getColor } from '@/views/product-center/yarn-management/natural-fiber/api'
import colorShow from '@/views/product-center/product-management/grey-cloth/components/colorShow'

import {
  pageMainTechList,
  piShaCode,
  mainTechTypeList,
  requirementList,
  processFlowList,
  secondTechList,
  chemicalFiberShow,
  chemicalFiberStore,
  chemicalFiberUpdate,
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
    item
    // dialogs
    // uploadSlot
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
    const dialogOptions = {
      visible: false,
      title: '设置主工艺要求',
      okText: '提交',
      cancelText: '取消',
      closed: (params) => {
        this.dialogHandle(params)
      }, // 关闭选择
      ok: (params) => {
        if (!params) {
          this.$message.error('请选择数据！')
          return false
        }
        this.dialogHandle(false)
        this.setMainTectSplit(params)
      }, // 确定选择
      maxHeight: '370',
      searchFormDatas: {}, // 搜索默认参数
      searchData: [
        {
          prop: 'techUuid',
          itemType: 'select',
          label: '工艺要求',
          itemStyle: { width: '33.33%' },
          placeholder: '请选择工艺要求',
          loading: true,
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('工艺要求', 0, 'one', false)
            } else {
              this.setSelectData('工艺要求', 0, 'one', true)
            }
          },
          multiple: true,
          filterable: true,
          dataSource: []
        },
        {
          prop: 'processFlow',
          itemType: 'select',
          label: '工序流程',
          itemStyle: { width: '33.33%' },
          placeholder: '请选择工序流程',
          loading: true,
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('工序流程', 1, 'one', false)
            } else {
              this.setSelectData('工序流程', 1, 'one', true)
            }
          },
          multiple: true,
          dataSource: []
        },
        {
          prop: 'code',
          itemType: 'input',
          label: '主工艺编码',
          itemStyle: { width: '33.33%' },
          placeholder: '请输入主工艺编码'
        },
        {
          prop: 'type',
          itemType: 'select',
          itemStyle: { width: '33.33%' },
          label: '分类',
          placeholder: '请选择分类',
          loading: true,
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('分类', 3, 'one', false)
            } else {
              this.setSelectData('分类', 3, 'one', true)
            }
          },
          dataSource: []
        },
        {
          itemType: 'operate',
          submitHandle: (params) => {
            this.dialogOptions.searchFormDatas = params
            this.getList(params)
          },
          submitText: '查询',
          resetHandle: () => {
            console.log('重置')
            this.dialogOptions.searchFormDatas = {}
          }
        }
      ], // 搜索字段
      dataSource: [], // table数据
      columns: [
        {
          prop: 'techCode',
          label: '主工艺编号',
          minWidth: '120',
          fixed: true,
          showOverflowTooltip: true
        },
        {
          prop: 'techNames',
          label: '工艺内容',
          minWidth: '100',
          showOverflowTooltip: true
        },
        {
          prop: 'techTypeName',
          label: '分类',
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
        return callback(new Error('请输入成品克重区间值'))
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
      // if (!/^[1-9][0-9]*0$/.test(value)) {
      //   callback(new Error('请输入10的倍数'))
      // } else {
      //   if (value > 10000) {
      //     callback(new Error('请输入小于10000并且是10的倍数的正整数'))
      //   } else {
      //     callback()
      //   }
      // }
      // }, 300);
    }

    const rulesOnePart = {
      embryoCode: [
        { message: '请输入坯布编码', required: true, trigger: 'blur' }
      ],
      fabricWidth: [{ validator: menfu, required: true, trigger: 'blur' }],
      fabricWeight: [{ validator: kezhong, trigger: 'blur', required: true }],
      // fabricWidthTypeName: [
      //   { message: '请选择幅宽类型', required: true, trigger: 'change' }
      // ],
      DyePrintTypeName: [
        { message: '请选择染整类型', required: true, trigger: 'change' }
      ],
      softMethodName: [
        { message: '请选择制软要求', required: true, trigger: 'change' }
      ]
      // bdDyeProcessGroupValue: [
      //   { message: '请选择染整工艺组合', required: true, trigger: 'change' }
      // ]
    }
    // 编辑时显示数据
    // const formDataInfoPart = [
    //   {
    //     name: 'code',
    //     type: 'input',
    //     label: '色/花布编码'
    //   },
    //   {
    //     name: 'updatore',
    //     type: 'input',
    //     label: '更新人'
    //   },
    //   {
    //     name: 'operatedTime',
    //     type: 'input',
    //     label: '更新时间'
    //   }
    // ]
    // const formDataclothMainTechPart = [
    //   {
    //     name: 'bdMainTechnologyValue',
    //     showValue: 'clothMainTech.techNames',
    //     type: 'input',
    //     label: '主工艺要求',
    //     disabled: true
    //   }
    // ]
    const formDataclothMainTechPart = [
      {
        name: 'bdDyeProcessGroupValue',
        type: 'select-search',
        label: '染整工艺组合',
        placeholder: '请选择染整工艺组合',
        searchValue: 'name', // 搜索比如name='智布'
        popperAppendToBody: true, // 修改options插入位置
        popperClass: 'craft-search', // 自定义类名
        valueKey: 'uuid',
        apiUrl: `basis/api/requirementsCombination/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          // console.log(data, 'dadada')
          this.order.bdDyeProcessGroupValue = data.data.name
          this.order.bdDyeProcessGroupUuid = data.data.uuid
          this.$refs['formOnePart'].resetData({
            bdDyeProcessGroupValue: data.data.name
          })
          this.setMainTectSplit(data.data)
        },
        visibleChange: (e) => {
          if (e) {
            this.styleErroes = true
          }
        }
      }
    ]
    const rulesclothMainPart = {
      bdDyeProcessGroupValue: [
        { message: '请选择染整工艺组合', required: true, trigger: 'change' }
      ]
    }
    // 手感整理数据
    const rulesTwoPart = {
      feelArr: [
        { message: '请选择一级手感整理', required: true, trigger: 'change' }
      ]
    }
    // 手感整理数据
    const formDataTwoPart = [
      {
        name: 'feelArr',
        type: 'select-search',
        label: '一级手感整理',
        placeholder: '请选择一级手感整理',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        multiple: true,
        requestParam: { sortClassify: 4, level: 1 },
        apiUrl: `basis/api/requirementsDye/option`,
        optionsLabel: 'name',
        optionsValue: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (data) => {
          // dynamicValidateFormRuleForm
          this.$refs['formTwoPart'].resetData({ feelArr: data.data })
          this.order.feelArr = data.data
          this.setFellAndFunction('productFeel', data.multipleData)
        }
      }
    ]
    // 功能整理数据
    const rulesThreePart = {
      functionlArr: [
        { message: '请选择一级功能整理', required: true, trigger: 'change' }
      ]
    }
    // 功能整理数据
    const formDataThreePart = [
      {
        name: 'functionlArr',
        type: 'select-search',
        label: '一级功能整理',
        placeholder: '请选择一级功能整理',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        multiple: true,
        requestParam: { sortClassify: 2, level: 1 },
        apiUrl: `basis/api/requirementsDye/option`,
        optionsLabel: 'name',
        optionsValue: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (data) => {
          this.$refs['formThreePart'].resetData({ functionlArr: data.data })
          this.order.functionlArr = data.data
          this.setFellAndFunction('productFunction', data.multipleData)
        }
      }
    ]
    const formDataOnePart = [
      {
        name: 'embryoCode',
        type: 'input',
        label: '坯布编码',
        placeholder: '请输入坯布编码',
        blurHandler: (e) => {
          // console.log(e.target.value, "坯纱编码失去焦点");
          this.testPiCode(e.target.value)
          this.order.embryoCode = e.target.value
        }
      },
      {
        type: 'mutInput',
        label: '色布幅宽',
        showValue: 'fabricWidth',
        leftPart: {
          name: 'fabricWidth',
          type: 'input',
          placeholder: '请输入色布幅宽',
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
      // {
      //   name: 'fabricWidthTypeName',
      //   type: 'select-search',
      //   label: '幅宽类型',
      //   placeholder: '请选择幅宽类型',
      //   searchValue: 'name', // 搜索比如name='智布'
      //   valueKey: 'uuid',
      //   apiUrl: `basis/api/fabricWidthType/option`,
      //   optionsLabel: 'name',
      //   optionsValue: 'uuid',
      //   requestFormat: 'list',
      //   requestMode: 'post',
      //   filterable: false, // 不需要搜索
      //   changeSelectVal: (data) => {
      //     this.order.fabricWidthTypeName = data.data.name
      //     this.order.bdFabricWidthTypeUuid = data.data.uuid
      //     this.$refs['formOnePart'].resetData({
      //       fabricWidthTypeName: data.data.name
      //     })
      //   }
      // },
      {
        type: 'mutInput',
        label: '色布克重',
        showValue: 'fabricWeight',
        leftPart: {
          name: 'fabricWeight',
          type: 'input',
          placeholder: '请输入色布克重',
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
      },
      {
        name: 'DyePrintTypeName',
        type: 'select-search',
        label: '染整类型',
        placeholder: '请选择染整类型',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/printingDyeingType/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.DyePrintTypeName = data.data.name
          this.order.bdDyePrintTypeUuid = data.data.uuid
          this.$refs['formOnePart'].resetData({
            DyePrintTypeName: data.data.name
          })
        }
      },
      {
        name: 'dyeElementName',
        showValue: 'dyeElementArrName',
        type: 'select-search',
        label: '染色成分',
        placeholder: '请选择染色成分',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        multiple: true,
        apiUrl: `basis/api/dyeIngredient/option`,
        optionsLabel: 'name',
        optionsValue: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          // 多选需要让后端给两个字段，一个放name 一个放id
          this.$refs['formOnePart'].resetData({ dyeElementName: data.data })
          this.order.dyeElementUuids = []
          this.order.dyeElementName = data.data
          data.multipleData.forEach((ele) => {
            this.order.dyeElementUuids.push(ele.uuid)
          })
        }
      },
      {
        name: 'softMethodName',
        type: 'select-search',
        label: '制软要求',
        placeholder: '请选择制软要求',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/softMethod/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.softMethodName = data.data.name
          this.order.bdSoftMethodUuid = data.data.uuid
          this.$refs['formOnePart'].resetData({
            softMethod: data.data.name
          })
        }
      }
    ]
    // 风格table数据
    const styleColumns = [
      {
        prop: 'name',
        label: '一级风格',
        formater: (scope) => {
          return scope.row.styleParentTech && scope.row.styleParentTech.name
        }
      },
      {
        prop: 'styleChildTechName',
        className: 'product-no-request',
        labelClassName: 'is-request',
        label: '二级风格',
        itemType: 'table-form',
        editOptions: {
          itemType: 'select',
          rules: [
            { required: true, message: '二级风格不能为空', trigger: ['change'] }
          ],
          visibleChange: (flag, scoped) => {
            if (flag) {
              this.setSelectData('二级风格', 1, 'styleDataSource', false, scoped.$index)
            } else {
              this.setSelectData('二级风格', 1, 'styleDataSource', true)
            }
          },
          change: (value, v1, v2, v3, scope) => {
            // console.log('data', value)
            this.$set(
              this.order.productStyle[scope.$index],
              'childClassUuid',
              value
            )
            this.setTableData(
              'productStyle',
              'styleChildTechName',
              scope.$index,
              value
            )
          },
          filterable: true,
          clearable: true,
          loading: true,
          dataSource: []
        }
      }
    ]
    // 风格整理数据
    const styleDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: styleColumns,
        size: 'mini',
        headerCellStyle: {
          background: '#F5F7FA!important'
        }
      }
    ]
    // 手感整理数据
    const handColumns = [
      {
        prop: 'name',
        label: '一级手感',
        formater: (scope) => {
          return scope.row.feelParentTech && scope.row.feelParentTech.name
        }
      },
      {
        prop: 'feelChildTechName',
        className: 'product-no-request',
        labelClassName: 'is-request',
        label: '二级手感',
        itemType: 'table-form',
        editOptions: {
          itemType: 'select',
          rules: [
            { required: true, message: '二级手感不能为空', trigger: ['change'] }
          ],
          loading: true,
          clearable: true,
          visibleChange: (flag, scoped) => {
            if (flag) {
              this.setSelectData('二级手感', 1, 'handDataSource', false, scoped.$index)
            } else {
              this.setSelectData('二级手感', 1, 'handDataSource', true)
            }
          },
          change: (value, v1, v2, v3, scope) => {
            console.log(scope, 'data', value)
            this.$set(this.order.productFeel[scope.$index],
              'childClassUuid',
              value
            )
            this.setTableData(
              'productFeel',
              'feelChildTechName',
              scope.$index,
              value
            )
          },
          filterable: true,
          dataSource: []
        }
      }
    ]
    // 手感整理数据
    const handDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: handColumns,
        size: 'mini',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        operates: {
          label: '操作',
          width: '60',
          dataSource: [
            {
              label: '删除',
              isShow: true,
              style: { 'color': '#FE4949' },
              handle: (params) => {
                this.$confirm(' 你确认要删除该数据吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.delTableColumn('productFeel', params.$index, 'N')
                }).catch(() => {})
              }
            }
          ]
        }
      }
    ]
    // 功能整理数据
    const functionColumns = [
      {
        prop: 'name',
        label: '一级功能整理',
        formater: (scope) => {
          return (
            scope.row.functionParentTech && scope.row.functionParentTech.name
          )
        }
      },
      {
        prop: 'functionChildTechName',
        className: 'product-no-request',
        labelClassName: 'is-request',
        label: '二级功能整理',
        itemType: 'table-form',
        editOptions: {
          itemType: 'select',
          rules: [
            {
              required: true,
              message: '二级功能整理不能为空',
              trigger: ['change']
            }
          ],
          visibleChange: (flag, scoped) => {
            if (flag) {
              this.setSelectData(
                '二级功能整理',
                1,
                'functionDataSource',
                false,
                scoped.$index
              )
            } else {
              this.setSelectData('二级功能整理', 1, 'functionDataSource', true)
            }
          },
          change: (value, v1, v2, v3, scope) => {
            this.$set(
              this.order.productFunction[scope.$index],
              'childClassUuid',
              value
            )
            this.setTableData(
              'productFunction',
              'functionChildTechName',
              scope.$index,
              value
            )
          },
          filterable: true,
          loading: true,
          clearable: true,
          dataSource: []
        }
      }
    ]

    // 功能整理数据
    const functionDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: functionColumns,
        size: 'mini',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        operates: {
          label: '操作',
          width: '60',
          dataSource: [
            {
              label: '删除',
              isShow: true,
              style: { 'color': '#FE4949' },
              handle: (params) => {
                this.$confirm(' 你确认要删除该数据吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.delTableColumn('productFunction', params.$index, 'N')
                }).catch(() => { })
              }
            }
          ]
        }
      }
    ]
    // 印花染色
    const formDatafourPart = [
      {
        name: 'colorProductColorName',
        type: 'select-search',
        label: '成品色号',
        placeholder: '请选择成品色号',
        searchValue: 'code', // 搜索比如name='智布'
        valueKey: 'uuid',
        showComponent: {
          colorShow
        },
        apiUrl: `color/api/color/droplist`,
        requestParam: { type: 2 },
        optionsLabel: 'code',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        disabled: false,
        // filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.colorProductColorName = data && data.data ? data.data.code : ''
          // this.order.productColor = data.data;
          this.order.colorProductColorUuid = data && data.data ? data.data.uuid : ''
          this.$refs['formfourPart'].resetData({
            colorProductColorName: data && data.data ? data.data.code : ''
          })
        }
      }
      // {
      //   name: 'colorProductFlowerName',
      //   type: 'select-search',
      //   label: '花号',
      //   placeholder: '请选择花号',
      //   searchValue: 'flowerCode', // 搜索比如name='智布'
      //   valueKey: 'uuid',
      //   apiUrl: `color/api/flower/droplist`,
      //   optionsLabel: 'flowerCode',
      //   optionsValue: 'uuid',
      //   requestFormat: 'list',
      //   requestMode: 'post',
      //   clearable: true,
      //   // filterable: false, // 不需要搜索
      //   changeSelectVal: (data) => {
      //     this.order.colorProductFlowerName = data && data.data ? data.data.flowerCode : ''
      //     this.order.colorProductFlowerUuid = data && data.data ? data.data.uuid : 0
      //     // this.order.productFlower = data.data;
      //     this.$refs['formfourPart'].resetData({
      //       colorProductFlowerName: data && data.data ? data.data.flowerCode : ''
      //     })
      //   }
      // }
    ]
    // 附加信息
    const formDatafivePart = [
      {
        name: 'clothName',
        type: 'select-search',
        label: '布类',
        placeholder: '请选择布类',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `basis/api/cloths/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        disabled: true,
        filterable: false, // 不需要搜索
        changeSelectVal: (data) => {
          this.order.clothName = data.data.name
          this.order.bdClothUuid = data.data.uuid
          this.$refs['formfivePart'].resetData({
            clothName: data.data.name
          })
        }
      },
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
        name: 'dyeTechName',
        type: 'select-search',
        label: '染整工艺编码',
        placeholder: '请选择染整工艺编码',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'uuid',
        apiUrl: `${configData.productRequestPrefix}/api/tech/dyeTech/all`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        // filterable: false, // 不需要搜索
        clearable: true,
        changeSelectVal: (data) => {
          this.order.dyeTechName = data && data.data ? data.data.name : ''
          this.order.techDyeTechUuid = data && data.data ? data.data.uuid : ''
          // this.order.dyeTech = data.data;
          this.$refs['formfivePart'].resetData({
            dyeTechName: data && data.data ? data.data.name : ''
          })
        }
      }
      // {
      //   name: 'techPrintTechName',
      //   type: 'select-search',
      //   label: '印花工艺编码',
      //   placeholder: '请选择印花工艺编码',
      //   searchValue: 'name', // 搜索比如name='智布'
      //   valueKey: 'uuid',
      //   apiUrl: `${configData.productRequestPrefix}/api/tech/printTech/all`,
      //   optionsLabel: 'name',
      //   optionsValue: 'uuid',
      //   requestFormat: 'list',
      //   requestMode: 'post',
      //   // filterable: false, // 不需要搜索
      //   clearable: true,
      //   changeSelectVal: (data) => {
      //     this.order.techPrintTechName = data && data.data ? data.data.name : ''
      //     this.order.techPrintTechUuid = data && data.data ? data.data.uuid : 0
      //     // this.order.printTech = data.data;
      //     this.$refs['formfivePart'].resetData({
      //       techPrintTechName: data && data.data ? data.data.name : ''
      //     })
      //   }
      // }
    ]
    // const rulesFivePart = {
    //   clothName: [
    //     { message: '请选择布类', required: true, trigger: 'change' }
    //   ]
    // }
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
        style: { 'margin': 0 },
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
        action: `${configData.productRequestPrefix}/api/cloth/productFabric/upload`,
        accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
        showFileList: false,
        timeout: 30000
      }
    ]
    const uploadOptions = {
      accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
      action: `${configData.productRequestPrefix}/api/cloth/productFabric/uploadPicText`,
      multiple: true,
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
      uploadChange: () => { }
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
      formDataclothMainTechPart,
      rulesclothMainPart,
      // formDataInfoPart,
      rulesOnePart,
      formDataOnePart,
      styleDataSource,
      rulesTwoPart,
      formDataTwoPart,
      handDataSource,
      rulesThreePart,
      formDataThreePart,
      functionDataSource,
      formDatafourPart, // 印花染色
      formDatafivePart, // 附加信息
      formDatasixPart: [], // 手感
      formDatasevenPart: [], // 毛效
      formDataEightPart, // 图片详情3D编码
      uploadImgData,
      dialogOptions,
      styleData: [], // 二级风格数据
      handelData: [], // 二级手感数据
      functionData: [], // 二级功能整理数据
      formOtions: {
        inline: true
      },
      handleFunction: {
        handDataSource: [],
        functionDataSource: []
      },
      yinruFlag: false,
      configData,
      textIndex: -1,
      detailBtnFlag: false,
      uploadOptions,
      deDataType: 'data',
      styleErroes: true,
      styleOptions: {
        popError: true
      },
      feelErroes: true,
      feelOptions: {
        popError: true
      },
      isErroes: true,
      formOptions: {
        popError: true
      }
      // rulesFivePart
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
          name: 'saleModels',
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
            this.order.saleModels = data
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
        this.$set(this.formDatafivePart[0], 'disabled', true)
        // 编辑
        this.hasEdit = true
      } else {
        this.$set(this.formDatafivePart[0], 'disabled', false)
      }
    }
  },
  mounted() {
    // 初始化拖拽
    this.initSortable()
  },
  destroyed() {
    clearTimeout(this.timer)
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
        code: '', // 色/花布编码
        embryoCode: '', // 坯布编码
        embryoUuid: 0, // 坯布id
        fabricWidth: '', // 幅宽
        bdFabricWidthTypeUuid: '', // 幅宽类型id
        // fabricWidthTypeName: '', // 幅宽类型
        fabricWeight: '', // 成品克重
        // bdMainTechnologyUuid: '', // 主工艺id
        // clothMainTech: null, // 主工艺
        bdDyeProcessGroupUuid: '', // 染整工艺组合id
        bdDyeProcessGroupValue: null, // 染整工艺组合
        DyePrintTypeName: '', // 印染类型
        bdDyePrintTypeUuid: 0, // 印染类型id
        softMethodName: '', // 制软要求
        bdSoftMethodUuid: 0, // 制软要求id
        dyeElementUuids: [], // 染色成分id
        dyeElementName: [], // 染色成分(编辑使用)
        dyeElementArrName: '', // 染色成分(显示使用)
        skuStatus: 1, // 状态 默认1正式；2临时
        skuStatusName: '正式', // 状态查看时的值
        sourceOrderTypeName: '-', // 来源订单类型 查看时的值
        colorProductColorUuid: '', // 成品色号
        colorProductColorName: '', // 成品色号
        colorProductFlowerUuid: 0, // 花号id
        colorProductFlowerName: '', // 花号
        clothName: '', // 布类
        bdClothUuid: 0, // 布类id
        spuUuid: '', // spuid
        spuCode: '', // spu编码
        techDyeTechUuid: '', // 染整工艺id
        dyeTechName: '', // 染整工艺
        techPrintTechUuid: '', // 印花工艺id
        techPrintTechName: '', // 印花工艺
        productFunction: [], // 功能整理
        productFeel: [], // 手感整理
        productStyle: [], // 风格整理
        feelArr: [], // 一级手感 (后端不需要此值)
        functionlArr: [], // 功能整理 (后端不需要此值)
        productSource: 1, // 产品来源
        productSourceName: '自有', // 产品来源
        saleModels: [], // 销售类型
        salesModelName: '', // 销售类型(显示使用)
        bdSopUuid: 0, // 吸水id
        sopName: '', // 吸水
        bdElasticUuid: 0, // 弹性id
        elasticName: '', // 弹性
        bdHardnessUuid: 0, // 软硬度id
        hardnessName: '', // 软硬度
        bdSmoothnessUuid: 0, // 光滑度id
        smoothnessName: '', // 光滑度
        bdGlutinousUuid: 0, // 糯感id
        glutinousName: '', // 糯感
        bdSuedeUuid: 0, // 面磨id
        suedeName: '', // 面磨bdPolarFleeceId
        bdPolarFleeceUuid: 0, // 底摇粒id
        polarFleeceName: '', // 底摇粒
        bdCatchHairUuid: 0, // 底抓毛id
        catchHairName: '', // 底抓毛
        bdBrushedUuid: 0, // 面刷毛id
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
      const res = await chemicalFiberShow({ id })
      this.order = Object.assign(this.order, res.data)
      this.setOrder(this.order)
    },
    /**
     * @description 设置order
     */
    setOrder(order) {
      if (order.id) {
        this.order.creatorRealName = order.creator && (order.creator.name + '/' + order.creator.realName) || ''
        this.order.skuStatusName = order.skuStatus === 1 ? '正式' : '临时'
        this.order.updatedTime = order.updatedTime
          ? this.$filters.parseTime(order.updatedTime, '{y}-{m}-{d} {h}:{i}')
          : ''
        this.order.createdTime = this.$filters.parseTime(
          order.createdTime || 0,
          '{y}-{m}-{d} {h}:{i}'
        )
        this.order.dataFromValue = this.getDataFrom(order.dataSource)
        if (!this.order.dyeProcessGroup) {
          this.order.dyeProcessGroup = {
            name: '',
            uuid: 0
          }
        }

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

        // this.order.clothMainTech.techNames = order.clothMainTech
        //   ? order.clothMainTech.techCode + '-' + order.clothMainTech.techNames
        //   : '' // 主工艺要求
        // this.order.bdMainTechnologyValue = this.order.clothMainTech.techNames
        this.order.bdDyeProcessGroupValue = this.order.dyeProcessGroup.name // 染整工艺组合

        this.order.fabricWidth = order.fabricWidth && order.fabricWidth + 'cm' // 幅宽
        this.order.fabricWeight =
          order.fabricWeight && order.fabricWeight + 'g/m²' // 克重
        // this.order.fabricWidthTypeName = order.fabricWidthType && order.fabricWidthType.name ? order.fabricWidthType.name : '' // 幅宽类型
        this.order.dyeElementArrName =
          order.dyeElementName && order.dyeElementName.length
            ? order.dyeElementName.join(',')
            : ''
        this.order.DyePrintTypeName =
          order.dyePrintType && order.dyePrintType.name
            ? order.dyePrintType.name
            : ''
        this.order.softMethodName =
          order.softMethod && order.softMethod.name
            ? order.softMethod.name
            : ''
        order.productStyle.forEach((item) => {
          item.styleChildTechName = item.styleChildTech
            ? item.styleChildTech.name
            : ''
        })
        order.productFeel.forEach((item) => {
          item.feelChildTechName = item.feelChildTech
            ? item.feelChildTech.name
            : ''
        })
        order.productFunction.forEach((item) => {
          item.functionChildTechName = item.functionChildTech
            ? item.functionChildTech.name
            : ''
        })
        this.functionDataSource[0].dataSource = order.productFunction || []
        this.functionDataSource[0].operates = null
        this.handDataSource[0].dataSource = order.productFeel || []
        this.handDataSource[0].operates = null
        this.styleDataSource[0].dataSource = order.productStyle || []
        this.order.feelArr = [] // 一级手感 (后端不需要此值)
        this.order.functionlArr = [] // 功能整理 (后端不需要此值)
        // this.order.productSource = order.productSource || "";
        // this.order.productSourceName = order.productSource === 1 ? "自有" : "外购"; // 产品来源
        this.order.productSourceName = '自有' // 产品来源
        const salesModeArr = []
        if (order.saleModels && order.saleModels.length) {
          order.saleModels.forEach((item) => {
            if (item.saleModel === 1) {
              salesModeArr.push('订单')
            } else if (item.saleModel === 2) {
              salesModeArr.push('现货')
            }
          })
        }
        this.order.clothName = order.cloth ? order.cloth.name : ''// 布类
        this.order.salesModelName = salesModeArr.length
          ? salesModeArr.join('、')
          : ''
        this.order.saleModels = order.saleModels.map(item => item.saleModel)
        this.order.dyeTechName = order.dyeTech ? order.dyeTech.name : '' // 染整工艺
        this.order.techPrintTechName = order.printTech
          ? order.printTech.name
          : '' // 印花工艺
        this.order.colorProductColorName = order.productColor
          ? (order.productColor.name + (order.colorName ? '-' + order.colorName : ''))
          : (order.colorName ? order.colorName : '') // 成品色号;与颜色拼接
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
          saleModels: order.saleModels,
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
        // this.order.updatorRealName = this.order.updator
        //   ? this.order.updator.name
        //     ? this.order.updator.name + '/' + this.order.updator.realName
        //     : this.order.updator.realName
        //   : this.order.creator
        //     ? this.order.creator.name
        //       ? this.order.creator.name + '/' + this.order.creator.realName
        //       : this.order.creator.realName
        //     : '' // 更新人处理
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
    // 获取列表
    async getList(data = {}) {
      const res = await pageMainTechList({
        ...this.dialogOptions.searchFormDatas,
        ...data
      })
      const userList = res.data.list || []
      this.$set(this.dialogOptions, 'dataSource', userList)
      this.$set(this.dialogOptions, 'pagination', {
        ...this.dialogOptions.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        page: res.data.page,
        pageSize: res.data.pageSize
      })
    },
    /**
     * @description 验证坯纱编码
     */
    async testPiCode(code) {
      if (code) {
        await piShaCode({ code }).then(res => {
          if (res.code === 200) {
            this.order.embryoUuid = res.data.uuid
            // 成品色号
            if (res.data && res.data.spacing && res.data.spacing.length) {
              this.$set(this.formDatafourPart[0], 'disabled', true)
            } else {
              this.$set(this.formDatafourPart[0], 'disabled', false)
            }
            // 布类
            if (res.data && res.data.cloth) {
              this.order.clothName = res.data['cloth'].name
              this.order.bdClothUuid = res.data['cloth'].uuid
            }
          }
        }).catch(() => {
          this.order.embryoUuid = 0
          this.$set(this.formDatafourPart[0], 'disabled', false)
          this.order.clothName = ''
          this.order.bdClothUuid = ''
        })
      }
    },
    /**
     * @description 主工艺要求设置弹窗显示隐藏
     */
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
    },
    /**
     * @description 主工艺要求设置
     */
    dialogHandler() {
      this.getList()
      this.$set(this.dialogOptions, 'visible', true)
    },
    /**
     * @description 处理风格整理
     */
    async setMainTectSplit(data) {
      if (data && data.details.length) {
        const resData = []
        data.details.forEach(item => {
          if (item.dye && item.dye.sortClassify === 3) {
            resData.push({ parentClassUuid: item.dye.uuid, childClassUuid: 0, styleParentTech: { name: item.dye.name }, styleChildTechName: '', edit: true })
          }
        })
        this.order.productStyle = resData
        this.styleDataSource[0].dataSource = resData
        this.styleErroes = false
        this.timer = setTimeout(() => {
          console.log(this.$refs.productStyle)
          if (!this.order.productStyle.length) {
            return
          }
          this.$refs.productStyle.form.clearValidate()
        }, 0)
      }
    },
    /**
     * @description 处理手感和功能整理
     */
    setFellAndFunction(typeName, data) {
      let dataType = ''
      let erroes = ''
      switch (typeName) {
        case 'productFeel':
          // 手感整理
          dataType = 'handDataSource'
          erroes = 'feelErroes'
          break
        case 'productFunction':
          // 功能整理
          dataType = 'functionDataSource'
          erroes = 'isErroes'
          break
      }
      if (!data.length) {
        console.log('一级数据为空', erroes, typeName)
        this[erroes] = false
        this.$refs[typeName].form.resetFields()
        this.order[typeName] = []
      }
      const resData = data.map((item) => {
        item.parentClassUuid = item.uuid // 一级id
        item.childClassUuid = 0 // 二级id
        if (typeName === 'productFeel') {
          item.feelParentTech = {
            name: item.name
          } // 一级
          item.feelChildTechName = '' // 二级
        } else {
          item.functionParentTech = {
            name: item.name
          } // 一级
          item.functionChildTechName = '' // 二级
        }
        item.edit = true
        return item
      })
      console.log(resData, this.handleFunction[dataType], '-------1111--------')
      console.log(resData, this.order[typeName], '-------2222--------')
      // 添加新的数据
      if (
        resData.length &&
        this.handleFunction[dataType].length <= resData.length
      ) {
        let addObj = null
        for (let i = 0, len = resData.length; i < len; i++) {
          if (
            this.handleFunction[dataType].find((ele) => {
              return resData[i].uuid === ele
            })
          ) {
            continue
          } else {
            addObj = JSON.parse(JSON.stringify(resData[i]))
          }
        }
        addObj && this.order[typeName].push(addObj)
        addObj && this[dataType][0].dataSource.push(addObj)
        console.log('添加', erroes)
        this[erroes] = true
        // this.feelErroes = true
        // this.isErroes = true
      } else if (
        this.handleFunction[dataType].length > resData.length &&
        resData.length
      ) {
        console.log('delete', resData, this[dataType][0].dataSource)
        const except = function(a, b, k) {
          return [...a, ...b].filter(i => ![a, b].every(t => (k ? t.map(i => i[k]).includes(i[k]) : t.includes(i))))
        }
        const list = except(resData, this[dataType][0].dataSource, 'id')
        console.log(list[0].id, '差集')
        const index = this[dataType][0].dataSource.findIndex((val) => {
          return val.id === list[0].id
        })
        console.log(index, '差集元素index')
        this.delTableColumn(typeName, index, 'Y')
        // 删除数据
        // let delObj = null
        // for (
        //   let i = 0, len = this.handleFunction[dataType].length;
        //   i < len;
        //   i++
        // ) {
        //   if (
        //     resData.find((ele) => {
        //       return this.handleFunction[dataType][i] === ele.uuid
        //     })
        //   ) {
        //     continue
        //   } else {
        //     delObj = this.handleFunction[dataType][i]
        //   }
        // }

        // const delIndex = this.order[typeName].findIndex((item) => {
        //   return item.uuid === delObj
        // })
        // this.order[typeName].splice(delIndex, 1)
        // this[dataType][0].dataSource.splice(delIndex, 1)
        // this.handleFunction[dataType].splice(delIndex, 1)
      } else {
        console.log('1231331312312', erroes)
        this[erroes] = false
        this.order[typeName] = JSON.parse(JSON.stringify(resData))
        this.$set(
          this[dataType][0],
          'dataSource',
          JSON.parse(JSON.stringify(resData))
        )
      }
      if (this.order[typeName].length) {
        this.handleFunction[dataType] = []
        this.order[typeName].forEach((item) => {
          this.handleFunction[dataType].push(item.uuid)
        })
        // this.handleFunction[dataType] = [...new Set(this.handleFunction[dataType])]
        console.log('1')
        this.handleFunction[dataType] = Array.from(new Set(this.handleFunction[dataType]))
        console.log('2', this.handleFunction[dataType])
      } else {
        this.handleFunction[dataType] = []
      }
    },
    /**
     * @description 设置二级tabel数据
     */
    setTableData(typeName, type, index, id) {
      console.log(typeName, type, index, id, '--------------2list')
      let dataType = ''
      let tableType = ''
      switch (typeName) {
        case 'productStyle':
          dataType = 'styleData'
          break
        case 'productFeel':
          dataType = 'handelData'
          tableType = 'handDataSource'
          break
        case 'productFunction':
          dataType = 'functionData'
          tableType = 'functionDataSource'
          break
      }
      if (id) {
        const source = this[dataType].find((item) => {
          return item.uuid === id
        })
        tableType &&
          this.$set(this[tableType][0].dataSource[index], type, (source.name))
        this.order[typeName][index][type] = source.name
      } else {
        this.$set(this[tableType][0].dataSource[index], type, '')
        this.order[typeName][index][type] = ''
      }
    },
    /**
     * @description 删除二级table数据
     */
    delTableColumn(typeName, index, type) {
      console.log(typeName, index)
      let dataType
      let idType
      let Erroes
      // let idType = ''
      switch (typeName) {
        case 'productFeel':
          dataType = 'feelArr'
          idType = 'handDataSource'
          Erroes = 'feelErroes'
          break
        case 'productFunction':
          dataType = 'functionlArr'
          idType = 'functionDataSource'
          Erroes = 'isErroes'
          break
      }
      this.order[typeName].splice(index, 1)
      type === 'Y' || this.order[dataType].splice(index, 1)
      this[idType][0].dataSource.splice(index, 1)
      this.handleFunction[idType].splice(index, 1)
      if (!this.order[dataType].length) {
        this[Erroes] = false
      }
    },
    /**
     * @description 设置拉下数据
     */
    async setSelectData(typeName, index, level, init = false, columnIndex = 0) {
      let dataType = ''
      if (level === 'one') {
        dataType = this.dialogOptions.searchData[index]
      } else {
        dataType = this[level][0].columns[index].editOptions
      }
      if (init) {
        this.$set(dataType, 'dataSource', [])
        this.$set(dataType, 'loading', true)
      } else {
        let res = null
        console.log(typeName, 'typeName')
        switch (typeName) {
          case '工艺要求':
            res = await requirementList()
            break
          case '工序流程':
            res = await processFlowList()
            break
          case '分类':
            res = await mainTechTypeList()
            break
          case '二级功能整理':
            res = await secondTechList({
              parentUuid: this.order.productFunction[columnIndex].parentClassUuid,
              level: 2
            })
            // 当无下拉数据时，显示“无”
            this.functionData = res.data && res.data.length ? res.data : [{ name: '无', label: '无', uuid: 'wu', id: 'wu', value: 'wu' }]
            break
          case '二级风格':
            res = await secondTechList({
              parentUuid: this.order.productStyle[columnIndex].parentClassUuid,
              level: 2
            })
            // 当无下拉数据时，显示“无”
            this.styleData = res.data && res.data.length ? res.data : [{ name: '无', label: '无', uuid: 'wu', id: 'wu', value: 'wu' }]
            break
          case '二级手感':
            res = await secondTechList({
              parentUuid: this.order.productFeel[columnIndex].parentClassUuid,
              level: 2
            })
            // 当无下拉数据时，显示“无”
            this.handelData = res.data && res.data.length ? res.data : [{ name: '无', label: '无', uuid: 'wu', id: 'wu', value: 'wu' }]
            break
        }
        let data = []
        if (res.data && res.data.length) {
          data = res.data.map((item) => {
            item.label = item.name
            typeName === '工艺要求'
              ? (item.value = item.typeId)
              : (typeName === '分类' ? (item.value = item.id) : (item.value = item.uuid))
            return item
          })
        }
        // 当二级风格、二级功能整理、二级手感无下拉数据时，显示“无”
        if (!data.length && (typeName === '二级风格' || typeName === '二级功能整理' || typeName === '二级手感')) {
          data = [{ name: '无', label: '无', uuid: 'wu', id: 'wu', value: 'wu' }]
        }
        this.$set(dataType, 'dataSource', data)
        this.$set(dataType, 'loading', false)
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
      }).then(() => {
        this.order.pictures.splice(index, 1)
        this.imgFn()
      }).catch(() => {
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
      let canSubmit = false
      // 新增时验证
      if (!this.order.id) {
        const refArrOne = [
          'formOnePart',
          'formclothMainPart',
          'formTwoPart',
          'formThreePart'
        ]
        for (let j = 0; j < refArrOne.length; j++) {
          this.$refs[refArrOne[j]].$refs.form.validate((valid) => {
            if (valid) {
              canSubmit = true
            } else {
              canSubmit = false
            }
          })
          if (!canSubmit) {
            break
          }
        }
        if (!canSubmit) {
          return false
        }
        // 检验table数据
        let refArrTwo = []
        if (this.order.productStyle && this.order.productStyle.length) {
          refArrTwo = ['productStyle', 'productFeel', 'productFunction']
        } else {
          refArrTwo = ['productFeel', 'productFunction']
        }

        for (let i = 0; i < refArrTwo.length; i++) {
          if (!this.order[refArrTwo[i]].length) {
            canSubmit = false
          } else {
            this.$refs[refArrTwo[i]].form.validate((valid) => {})
            canSubmit = this.order[refArrTwo[i]].every((item) => {
              return item.childClassUuid
            })
          }
          if (!canSubmit) {
            break
          }
        }
      } else {
        canSubmit = true
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
            // res = await chemicalFiberUpdate({ ...this.order })
            res = await chemicalFiberUpdate({
              code: this.order.code, // 色/花布编码
              embryoCode: this.order.embryoCode, // 坯布编码
              embryoUuid: this.order.embryoUuid, // 坯布id
              fabricWidth: this.order.fabricWidth, // 幅宽
              bdFabricWidthTypeUuid: this.order.bdFabricWidthTypeUuid, // 幅宽类型id
              // fabricWidthTypeName: this.order.fabricWidthTypeName, // 幅宽类型
              fabricWeight: this.order.fabricWeight, // 成品克重
              // bdMainTechnologyUuid: this.order.bdMainTechnologyUuid, // 主工艺id
              // clothMainTech: this.order.clothMainTech, // 主工艺
              bdDyeProcessGroupUuid: this.order.bdDyeProcessGroupUuid, // 染整工艺组合id
              bdDyeProcessGroupValue: this.order.bdDyeProcessGroupValue, // 染整工艺组合
              DyePrintTypeName: this.order.DyePrintTypeName, // 印染类型
              bdDyePrintTypeUuid: this.order.bdDyePrintTypeUuid, // 印染类型id
              softMethodName: this.order.softMethodName, // 制软要求
              bdSoftMethodUuid: this.order.bdSoftMethodUuid, // 制软要求id
              dyeElementUuids: this.order.dyeElementUuids, // 染色成分id
              dyeElementName: this.order.dyeElementName, // 染色成分(编辑使用)
              dyeElementArrName: this.order.dyeElementArrName, // 染色成分(显示使用)
              skuStatus: this.order.skuStatus, // 状态 默认1正式；2临时
              skuStatusName: this.order.skuStatusName, // 状态查看时的值
              colorProductColorUuid: this.order.colorProductColorUuid, // 成品色号
              colorProductColorName: this.order.colorProductColorName, // 成品色号
              colorProductFlowerUuid: this.order.colorProductFlowerUuid, // 花号id
              colorProductFlowerName: this.order.colorProductFlowerName, // 花号
              clothName: this.order.clothName, // 布类
              bdClothUuid: this.order.bdClothUuid, // 布类id
              spuUuid: this.order.spuUuid, // spuid
              spuCode: this.order.spuCode, // spu编码
              techDyeTechUuid: this.order.techDyeTechUuid, // 染整工艺id
              dyeTechName: this.order.dyeTechName, // 染整工艺
              techPrintTechUuid: this.order.techPrintTechUuid, // 印花工艺id
              techPrintTechName: this.order.techPrintTechName, // 印花工艺
              productFunction: this.order.productFunction, // 功能整理
              productFeel: this.order.productFeel, // 手感整理
              productStyle: this.order.productStyle, // 风格整理
              feelArr: this.order.feelArr, // 一级手感 (后端不需要此值)
              functionlArr: this.order.functionlArr, // 功能整理 (后端不需要此值)
              productSource: this.order.productSource, // 产品来源
              productSourceName: this.order.productSourceName, // 产品来源
              saleModels: this.order.saleModels, // 销售类型
              salesModelName: this.order.salesModelName, // 销售类型(显示使用)
              additional: {
                bdSopUuid: this.order.bdSopUuid, // 吸水id
                sopName: this.order.sopName, // 吸水
                bdElasticUuid: this.order.bdElasticUuid, // 弹性id
                elasticName: this.order.elasticName, // 弹性
                bdHardnessUuid: this.order.bdHardnessUuid, // 软硬度id
                hardnessName: this.order.hardnessName, // 软硬度
                bdSmoothnessUuid: this.order.bdSmoothnessUuid, // 光滑度id
                smoothnessName: this.order.smoothnessName, // 光滑度
                bdGlutinousUuid: this.order.bdGlutinousUuid, // 糯感id
                glutinousName: this.order.glutinousName, // 糯感
                bdSuedeUuid: this.order.bdSuedeUuid, // 面磨id
                suedeName: this.order.suedeName, // 面磨bdPolarFleeceId
                bdPolarFleeceUuid: this.order.bdPolarFleeceUuid, // 底摇粒id
                polarFleeceName: this.order.polarFleeceName, // 底摇粒
                bdCatchHairUuid: this.order.bdCatchHairUuid, // 底抓毛id
                catchHairName: this.order.catchHairName, // 底抓毛
                bdBrushedUuid: this.order.bdBrushedUuid, // 面刷毛id
                brushedName: this.order.brushedName // 面刷毛
              },
              pictures: this.order.pictures, // 图片
              picText: this.order.picText, // 图文详情
              lingDiCode: this.order.lingDiCode // 3D编码
            })
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
                saleModels: this.order.saleModels,
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
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(
              this.getLogMessages(
                'UPDATE',
                `${configData.productRequestPrefix}/api/cloth/productFabric/update`
              ),
              afterCode,
              JSON.stringify({
                beforeText: `在'产品目录库-产品管理-色布'将色布编码:${this.order.code}`,
                afterText: '修改为',
                ...{ beforeCode, afterCode }
              })
            )
          } else {
            // 新增
            const copyOrder = JSON.parse(JSON.stringify(this.order))
            const arr = ['productStyle', 'productFeel', 'productFunction']
            for (let i = 0; i < arr.length; i++) {
              if (copyOrder[arr[i]]) {
                copyOrder[arr[i]].forEach(item => {
                  item.childClassUuid = item.childClassUuid === 'wu' ? '' : item.childClassUuid
                })
              } else {
                continue
              }
            }
            res = await chemicalFiberStore({ ...this.order, ...copyOrder })
            // 日志功能
            this.fetchLog(
              this.getLogMessages(
                'INSERT',
                `${configData.productRequestPrefix}/api/cloth/productFabric/store`
              ),
              this.order,
              JSON.stringify({
                beforeText: `在'产品目录库-产品管理-色布'新增一条记录`,
                beforeCode: this.order
              })
            )
          }
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.$router.push({ name: 'ColourClothList' })
          }
        }).catch(() => {
          console.log('已取消提交')
        })
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
<style lang="scss" scoped>
.product-item-content {
  .product-style-table {
    /deep/.el-table--mini {
        font-size: 14px;
        tbody tr {
          height: 50px;
      }
    }
  }
}
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
}
.product-style-table {
  width: 100%;
}
.m-b-0 {
  margin-bottom: 0;
}

.chemicalfibercreate-top {
  /deep/.el-form .el-form-item {
    margin-bottom: 0;
    .el-form-item__label {
      color: #606266;
    }
  }
  /deep/.form {
    width: auto;
  }
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
  /deep/.upload-demo {
    margin: 0;
  }
}
</style>
<style lang="scss">
body{
  .craft-search{
    max-width: 400px;
  }
  .is-request::before {
    content: "*";
    width: 4px;
    color: red;
  }
}
</style>
