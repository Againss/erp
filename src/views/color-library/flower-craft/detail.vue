<!--
 * @Date: 2020-12-10 11:46:30
 * @Author: Againss
 * @LastEditTime: 2021-07-12 14:13:29
 * @LastEditors: zhengjin
 * @Descripttion: 花号工艺
-->
<template>
  <div class="product-detail-content">
    <div class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">
          智布花号：{{ order.flowerCode }}
          <!-- <span v-show="!order.code" class="code-der">保存后自动生成</span> -->
        </div>
      </div>
      <div v-if="$route.params.id" class="description">
        <span v-if="order.status === 2 || order.status === 3">
          提交人：{{
            order.submitter
              ? `${order.submitter.name}/${order.submitter.realName}`
              : ""
          }}
        </span>
        &nbsp;
        <span v-if="order.status === 2 || order.status === 3">
          提交时间：{{ order.submittedTime }}
        </span>
        &nbsp;
        <span v-if="order.status === 3">
          审核人：{{
            order.updator
              ? `${order.updator.name}/${order.updator.realName}`
              : ""
          }}
        </span>
        &nbsp;
        <span v-if="order.status === 3">
          审核时间：{{
            $filters.parseTime(order.updatedTime || 0, "{y}-{m}-{d} {h}:{i}")
          }}
        </span>
        <span
          v-if="
            order.status === 1 ||
              order.status === 0 ||
              order.status === '' ||
              order.status === 4
          "
        >
          操作人：{{
            order.updator
              ? `${order.updator.name}/${order.updator.realName}`
              : ""
          }} </span>&nbsp;
        <span
          v-if="
            order.status === 1 ||
              order.status === 0 ||
              order.status === '' ||
              order.status === 4
          "
        >
          操作时间：{{
            order.updatedTime
              ? $filters.parseTime(order.updatedTime, "{y}-{m}-{d} {h}:{i}")
              : ""
          }} </span>&nbsp; 状态：<span
          :class="{
            refuse: order.status === 4, //已驳回
            Audited: order.status === 3,
            Pending: order.status === 2 || order.status === 1
          }"
        >{{ getStatus() }}</span>
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title firstPart-div">基本信息</div>
      <div class="product-content-info firstPart">
        <item
          ref="formTwoPart"
          :is-edit="false"
          :form-data="formDataTwoPart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">工艺信息</div>
      <div class="product-content-info h-60">
        <item
          ref="formDataThreePart"
          :is-edit="isEdit"
          :rules="rulesTwoPart"
          :form-data="formDataThreePartData"
          :order="order"
        />
      </div>
      <div class="product-content-info FourPart h-60">
        <item
          ref="formDataFourPart"
          :is-edit="isEdit"
          :rules="rulesFourPart"
          :form-data="formDataFourPartData"
          :order="order"
        />
      </div>
      <div class="product-content-info" style="padding-top: 10px">
        <div class="craft"><span v-if="isEdit" class="red">*  </span>配方工艺</div>
        <div class="pic-list">
          <div class="list-img">
            <div v-for="(val, index) in imgArr" :key="index" class="img-div">
              <div class="img-show pic-show">
                <div class="pic-div">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="val.showUrl"
                    alt=""
                    @click="handlePictureCardPreview(val.showUrl)"
                  >
                  <span v-if="isEdit" class="delete-span">
                    <i class="el-icon-delete" @click="deleteImg(val.showUrl, index)" />
                  </span>
                </div>
              </div>
            </div>
            <div v-if="imgArr.length < 2 && isEdit" class="img-div">
              <div class="img-show">
                <div class="pic-div">
                  <cs-custom-form
                    ref="remarkOptionForm"
                    :data-source="remarkDataEdit"
                    :options="formOtions"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-if="!isEdit && imgShow" class="red mind-text">
            请上传配方工艺图片
          </div>
        </div>
      </div>
      <div class="product-content-info">
        <!-- <item
          ref="remarkDataShow"
          class="remark"
          :is-edit="isEdit"
          :form-data="remarkDataShow"
          :order="order"
        /> -->
        <div v-if="isEdit">
          <cs-custom-form
            ref="remarkDataShow"
            :data-source="remarkDataShow"
            :options="formOtions"
            :form-datas="formDatas"
          />
        </div>
        <div v-if="!isEdit" class="remark-div">
          <span class="remark-span">备注</span>
          <span class="remark-tetx"> {{ formDatas.remark }} </span>
        </div>
      </div>
    </div>
    <div class="product-btn-group">
      <div class="btn-groups">
        <el-button
          v-show="
            !isEdit &&
              (order.status === 1 ||
              order.status === 0 ||
              order.status === '' ||
              order.status === 4)
          "
          v-permission="['color:Api:FlowerManage:FlowerTechnology:update']"
          type="primary"
          @click="editBtn"
        >编辑</el-button>
        <el-button v-if="isEdit" @click="cancel">取消</el-button>
        <el-button
          v-show="
            order.status === 1 ||
              ((order.status === 0 ||
              order.status === 4 ||
              order.status === '') &&
              isEdit)
          "
          v-permission="['color:Api:FlowerManage:FlowerTechnology:submit']"
          type="primary"
          @click="submitForm(1)"
        >提交</el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="submitForm(2)"
        >保存</el-button>
        <el-button
          v-show="order.status === 2"
          v-permission="['color:Api:FlowerManage:FlowerTechnology:approve']"
          type="primary"
          @click="reviewBtn"
        >审核</el-button>
        <el-button
          v-show="order.status === 2"
          v-permission="['color:Api:FlowerManage:FlowerTechnology:disapprove']"
          type="primary"
          @click="rejectBtn"
        >驳回</el-button>
        <el-button
          v-show="order.status === 3"
          v-permission="['color:Api:FlowerManage:FlowerTechnology:change']"
          type="primary"
          @click="changeBtn"
        >变更</el-button>
        <el-button
          v-show="order.status === 3"
          v-permission="['color:Api:FlowerManage:FlowerTechnology:print']"
          type="primary"
          @click="printBtn"
        >打印预览</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import uploadSlotTrigger from './components/upload-slot-trigger'
import item from '@/views/product-center/components/detaiItem'
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
import { show, update, submit, review, reject, change } from './api'
export default {
  components: { item },
  mixins: [logMethods],
  data() {
    const temNum = (rule, value, callback) => {
      // 小于等于100且最多2位小数的正数
      // var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
      var reg = /^\d\.([1-9]{1,2}|[0-9][0-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/
      if (!reg.test(value) && value) {
        callback(new Error('请输入小于等于100且最多2位小数的正数'))
      } else {
        callback()
      }
    }
    const rulesTwoPart = {
      techYarnTechCode: [
        { message: '请选择网板类型', required: true, trigger: ['change'] }
      ],
      printingMesh: [
        { message: '请选择网目', required: true, trigger: 'change' }
      ],
      printingProportion: [
        { message: '请填写印花占比', required: true, trigger: 'blur' },
        { validator: temNum }
      ]
    }
    const rulesFourPart = {
      techProcess: [
        { message: '请选择工艺流程', required: true, trigger: ['change'] }
      ]
    }
    const remarkDataShow = [
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        // margin: 24px 20px 30px 90px;
        itemStyle: { 'width': '530px', 'margin': '24px 20px 30px 90px' },
        label: '备注',
        trim: (value) => {
          this.formDatas.remark = value
          return value
        },
        maxlength: 500
      }
    ]
    const formDataTwoPart = [
      // {
      //   name: 'flowerCode',
      //   showValue: 'flowerCode',
      //   type: 'input',
      //   label: '智布花号'
      // },
      {
        name: 'printingSoCode',
        showValue: 'printingSoCode',
        type: 'input',
        label: '印花SO单号'
      },
      {
        name: 'deliveryDate',
        showValue: 'deliveryDate',
        type: 'input',
        label: '交期'
      },
      {
        name: 'brandOwner',
        showValue: 'brandOwner',
        type: 'input',
        label: '品牌商'
      },
      {
        name: 'printingFactory',
        showValue: 'printingFactory',
        type: 'input',
        label: '印花厂'
      },
      {
        name: 'printingColorName',
        showValue: 'printingColorName',
        type: 'input',
        label: '印花颜色名'
      },
      {
        name: 'fabricCategory',
        showValue: 'fabricCategory',
        type: 'input',
        label: '布类'
      },
      {
        name: 'fabricIngredient',
        showValue: 'fabricIngredient',
        type: 'input',
        label: '成份'
      },
      {
        name: 'printingTech',
        showValue: 'printingTech',
        type: 'input',
        label: '印花工艺'
      },
      {
        name: 'printingMethod',
        showValue: 'printingMethod',
        type: 'input',
        label: '印花方式'
      },
      {
        name: 'printingTopping',
        showValue: 'printingTopping',
        type: 'input',
        label: '印花套色'
      },
      {
        name: 'fabricWeight',
        showValue: 'fabricWeight',
        type: 'input',
        label: '克重'
      }
    ]
    const formDataThreePartData = [
      {
        name: 'techYarnTechCode',
        type: 'select',
        label: '网板类型',
        placeholder: '请选择网板类型',
        notEdit: false,
        options: [
          {
            id: 1,
            name: '平网'
          },
          {
            id: 2,
            name: '圆网'
          }
        ],
        optionsValue: 'id',
        changeHandler: (data) => {
          console.log(data, 'daya55555')
          this.order.screenType = data
        }
      },
      {
        name: 'printingMesh',
        type: 'select-search',
        label: '网目',
        placeholder: '请选择网目',
        // searchValue: 'name', // 搜索比如name='智布'
        filterable: false, // 关闭搜索
        valueKey: 'name',
        requestParam: { type: 1 },
        apiUrl: `${configData.colorRequestPrefix}/api/flowerBd/techParam/all`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.printingMesh = e.data ? e.data.name : ''
          this.order.printingMeshUuid = e.data ? e.data.uuid : 0
          this.$refs['formTwoPart'].resetData({
            printingMesh: e.data ? e.data.name : ''
          })
        }
      },
      {
        name: 'printingProportion',
        showValue: 'printingProportionValue',
        type: 'input',
        label: '印花占比',
        placeholder: '请输入印花占比',
        rules: [
          {
            validator: temNum,
            trigger: ['blur']
          }
        ],
        blurHandler: (e) => {
          this.order.printingProportion = e.target.value
          this.order.printingProportionValue = e.target.value + '%'
        }
      }
    ]
    const formDataFourPartData = [
      {
        name: 'techProcess',
        type: 'select-search',
        label: '工艺流程',
        placeholder: '请选择工艺流程',
        // searchValue: 'name', // 搜索比如name='智布'
        filterable: false, // 关闭搜索
        valueKey: 'name',
        requestParam: { type: 2 },
        apiUrl: `${configData.colorRequestPrefix}/api/flowerBd/techParam/all`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.techProcess = e.data ? e.data.name : ''
          this.order.techProcessUuid = e.data ? e.data.uuid : 0
          this.$refs['formTwoPart'].resetData({
            techProcess: e.data ? e.data.name : ''
          })
        }
      }
    ]
    const remarkDataEdit = [
      {
        prop: 'attachment',
        itemType: 'upload',
        drag: true,
        itemStyle: { width: '48%' },
        className: 'uploadfile',
        label: '',
        accept: '',
        showFileList: false,
        action: `${configData.colorRequestPrefix}/api/flower/tech/upload`,
        onSuccess: (response, file, fileList) => {
          // if (response.code === 200) {
          //   this.uploadFlag = true
          // } else {
          //   this.uploadFlag = false
          // }
          const objs = {}
          objs.picUrl = file.response.data.pictureUrl
          objs.showUrl = file.response.data.showUrl
          this.imgArr = this.imgArr.concat(objs)
        },
        beforeUpload: (file) => {
          // this.uploadFlag = false
          const fileType = file.type.split('/')[1]
          const regexp = new RegExp(fileType)
          const isImg = regexp.test(this.accept)
          if (!isImg) {
            this.$message.error(
              '上传图片只能是 .jpg,.jpeg,.png,.bmp 格式!'
            )
            return false
          }
          if (file.size / 1024 / 1024 > 10) {
            this.$message.error('上传文件大小不超过10M!')
            return false
          }
          if (this.imgArr.length > 2) {
            this.$message.error('最多上传2张图片!')
            return false
          }
        },
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      }
    ]

    return {
      order: {},
      isEdit: true,
      isDetail: false,
      rulesTwoPart,
      rulesFourPart,
      formDataTwoPart,
      formDataThreePartData,
      formDataFourPartData,
      imgShow: false,
      // uploadFlag: true,
      accept: '.gif,.jpg,.jpeg,.png,.bmp',
      beforeCode: {},
      formOtions: {
        inline: true
      },
      formDatas: {
        remark: ''
      },
      remarkDataEdit,
      imgArr: [],
      pictruesArr: [],
      dialogVisible: false,
      dialogImageUrl: '',
      remarkDataShow
    }
  },
  async created() {
    this.initOrder()
    if (this.$route.params.id && this.$route.path.includes('show')) {
      this.isEdit = false
    }
    if (this.$route.params.id) {
      this.isDetail = true
      this.getOrder(this.$route.params.id)
    }
  },
  // watch: {
  //   isEdit: function(){
  //     console.log(this.isEdit, 'kkkkkkkkkk')
  //     if(!this.isEdit && this.order.printingProportion && !this.order.printingProportion.includes('%')) {
  //       this.order.printingProportion = this.order.printingProportion + '%'
  //     } else {
  //       this.order.printingProportion && this.order.printingProportion.slice(0,this.order.printingProportion.length-1)
  //     }
  //     console.log(this.order.printingProportion, 'this.order.printingProportion---')
  //   }
  // },
  methods: {
    // 初始化
    initOrder() {
      this.order = {
        code: '',
        colorYarnColorId: '', // 色号id
        colorYarnColorCode: '', // 色号编码
        techYarnTechId: '', // 工艺编码id
        techYarnTechCode: '', // 网板类型
        screenType: '', // 网板类型id
        printingMesh: '', // 网目
        printingMeshUuid: '', // 网目
        techProcess: '', // 工艺流程
        techProcessUuid: '', // 工艺流程
        formulaLinks: [],
        status: 0
      }
    },
    // 删除图片
    deleteImg(url, index) {
      this.$confirm('请确认是否删除图片？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.imgArr.splice(index, 1)
          // this.imgArr.splice(
          //   this.imgArr.findIndex((item) => item.showUrl === url),
          //   1
          // )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 预览图片
    handlePictureCardPreview(showUrl) {
      this.dialogImageUrl = showUrl
      this.dialogVisible = true
    },
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign(this.order, res.data)
      this.beforeCode = {
        id: this.order.id,
        code: this.order.code
      }
      this.setOrder(this.order)
    },
    // 编辑
    editBtn() {
      this.isEdit = true
      this.imgShow = false
      this.$refs.formDataThreePart.$refs.form.clearValidate()
      this.$refs.formDataFourPart.$refs.form.clearValidate()
    },
    // 取消
    cancel() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$router.push(`/color-library/flower-craft/list`)
      })
    },
    setOrder(order) {
      this.order.flowerCode = order.flowerCode || '' // 智布花号
      this.order.printingSoCode = order.printingSoCode || '' // 印花SO单号
      this.order.deliveryDate = order.deliveryDate || '' // 交期
      this.order.brandOwner = order.brandOwner || '' // 品牌商
      this.order.printingFactory = order.printingFactory || '' // 印花厂
      this.order.printingColorName = order.printingColorName || '' // 印花颜色名
      this.order.dyelotNo = order.dyelotNo || '' // 底布缸号
      this.order.fabricCategory = order.fabricCategory || '' // 布类
      this.order.fabricIngredient = order.fabricIngredient || '' // 成份
      this.order.printingTech = order.printingTech || '' // 印花工艺
      this.order.printingMethod = order.printingMethod || '' // 印花方式
      this.order.printingTopping = order.printingTopping || '' // 印花套色
      this.order.fabricWeight = order.fabricWeight + ' g/m²' || '' // 克重
      this.order.techYarnTechCode =
        order.screenType === 1
          ? '平网'
          : (order.screenType === 2 ? '圆网' : '') || '' // 网板类型
      this.order.screenType = order.screenType // 网板类型
      this.order.printingMesh =
        (order.printingMesh && order.printingMesh.name) || '' // 网目
      this.order.printingProportionValue = (order.printingProportion === '0.00' || order.printingProportion === '0.0' || order.printingProportion === '0') ? '' : order.printingProportion + '%' // 印花占比
      this.order.printingProportion = (order.printingProportion === '0.00' || order.printingProportion === '0.0' || order.printingProportion === '0') ? '' : order.printingProportion // 印花占比
      this.order.techProcess =
        (order.techProcess && order.techProcess.name) || '' // 工艺流程
      this.order.status = order.status || '' // 状态
      this.formDatas.remark = order.remark || ''
      if (order.flowerFormulaTechPic.length > 0) {
        this.imgArr = order.flowerFormulaTechPic
      }
    },
    getStatus() {
      let str = ''
      switch (this.order.status) {
        case 1:
          str = '草稿'
          break
        case 2:
          str = '待审核'
          break
        case 3:
          str = '已审核'
          break
        case 4:
          str = '已驳回'
          break
        default:
          break
      }
      return str
    },
    // 提交
    submitForm(type) {
      this.pictruesArr = []
      this.imgArr.forEach((val, index) => {
        this.pictruesArr.push({
          picUrl: val.picUrl,
          showUrl: val.showUrl
        })
      })
      if (type === 1) {
        // 提交
        if (this.imgArr.length < 1) {
          this.imgShow = true
        } else {
          this.imgShow = false
        }
        const commitArr = [
          'formDataThreePart', 'formDataFourPart'
        ]
        let passthree = false
        for (let j = 0; j < commitArr.length; j++) {
          this.$refs[commitArr[j]].$refs.form.validate((valid) => {
            if (valid) {
              passthree = true
            } else {
              passthree = false
            }
          })
          if (!passthree) {
            break
          }
        }

        if (!passthree) {
          return false
        }
        if (this.imgArr.length < 1) {
          this.$message({
            message: '请上传图片再提交!',
            type: 'error'
          })
          return
        }
        this.$confirm(' 你确认要提交该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(async() => {
            // 保存之后需重新请求接口数据
            const res = await submit({
              id: this.$route.params.id,
              screenType: this.order.screenType, // 网板类型
              printingMeshUuid: this.order.printingMeshUuid, // 网目
              printingProportion: this.order.printingProportion || 0, // 印花占比
              techProcessUuid: this.order.techProcessUuid, // 工艺流程
              formulaLinks: this.pictruesArr, // 配方工艺
              remark: this.formDatas.remark
            })
            if (res.code === 200) {
              if (this.$route.path.includes('show')) {
                this.isEdit = false
                this.getOrder(this.$route.params.id)
              } else {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push(
                  `/color-library/flower-craft/flower-code/${this.$route.params.id}/show`
                )
                this.isEdit = false
              }
              this.fetchLog(
                this.getLogMessages('UPDATE', `${configData.colorRequestPrefix}/api/flower/tech/submit`, 'color'),
                { code: this.order.flowerCode },
                JSON.stringify({
                  beforeText: `在'色号花号库-花号工艺'提交一条记录`,
                  beforeCode: { code: this.order.flowerCode }
                })
              )
            } else {
              this.$message({
                message: '提交失败!',
                type: 'error'
              })
            }
          })
          .catch(() => {
            console.log('已取消提交')
          })
      } else {
        // 编辑保存
        this.$confirm(' 你确认要保存该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async() => {
          // 保存之后需重新请求接口数据
          if (this.order.productSource === '') {
            this.order.productSource = 0
          }
          const res = await update({
            id: this.$route.params.id,
            screenType: this.order.screenType, // 网板类型
            printingMeshUuid: this.order.printingMeshUuid, // 网目
            printingProportion: this.order.printingProportion || 0, // 印花占比
            techProcessUuid: this.order.techProcessUuid, // 工艺流程
            formulaLinks: this.pictruesArr, // 配方工艺
            remark: this.formDatas.remark
          })
          if (res.code === 200) {
            if (this.$route.path.includes('show')) {
              this.isEdit = false
              this.getOrder(this.$route.params.id)
            } else {
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push(
                `/color-library/flower-craft/flower-code/${this.$route.params.id}/show`
              )
            }
            this.fetchLog(
              this.getLogMessages('UPDATE', `${configData.colorRequestPrefix}/api/flower/tech/update`, 'color'),
              { code: this.order.flowerCode },
              JSON.stringify({
                beforeText: `在'色号花号库-花号工艺'保存一条记录`,
                beforeCode: { code: this.order.flowerCode }
              })
            )
          } else {
            this.$message({
              message: '保存失败!',
              type: 'error'
            })
          }
        })
      }
    },
    // 统一方法
    comMethod(des, call, type) {
      this.$confirm(`你确认要${des}该数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await call()
          if (res.code === 200) {
            this.getOrder(this.order.id)
            if (type === 'change') {
              this.isEdit = true
            }
            this.$message({
              message: `${des}成功`,
              type: 'success'
            })
            this.fetchLog(
              this.getLogMessages('UPDATE', `${configData.colorRequestPrefix}/api/flower/flowerManage/${type}`, 'color'),
              { code: this.order.flowerCode },
              JSON.stringify({
                beforeText: `在'色号花号库-花号工艺'${des}一条记录`,
                beforeCode: { code: this.order.flowerCode }
              })
            )
          } else {
            this.$message({
              message: `${des}失败`,
              type: 'error'
            })
          }
        })
    },
    // 驳回
    rejectBtn() {
      this.comMethod('驳回', () => {
        return reject({ id: this.order.id })
      }, 'reject')
    },
    // 审核
    reviewBtn() {
      this.comMethod('审核', () => {
        return review({ id: this.order.id })
      }, 'review')
    },
    // 变更
    changeBtn() {
      this.comMethod('变更', () => {
        return change({ id: this.order.id })
      }, 'change')
    },
    // 打印
    printBtn() {
      this.$router.push(
        `/color-library/flower-craft/flower-code/print/${this.$route.params.id}`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.tableitem {
  width: 100%;
  .title {
    // width: 130px;
    // text-align: right;
    font-size: 16px;
    color: #151222;
    padding-right: 12px;
    line-height: 52px;
  }
  .table {
    flex: 1;
    /deep/.el-form-item__content {
      margin-bottom: 20px;
    }
  }
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
  .el-input {
    width: 170px;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    color: #777474;
  }
}
.pointer {
  height: 32px;
  cursor: pointer;
  margin-left: 5px;
}
/deep/.el-form-item {
  margin-bottom: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #777474;
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
/deep/.FourPart .form .el-form .el-form-item .el-input {
  width: 432px;
}
.craft {
  margin-right: 15px;
  color: #888e9e;
  width: 115px;
  text-align: right;
}
.pic-list {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.list-img {
  display: flex;
  flex: 1;
  max-width: 900px;
}
.img-div {
  margin-right: 26px;
  width: 50%;
  p {
    height: 30px;
    line-height: 30px;
    margin: 0;
    i {
      cursor: pointer;
    }
  }
  span {
    margin: 0 20px 0 0;
    color: #888e9e;
    font-size: 12px;
  }
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.img-show {
  width: 100%;
  height: 100%;
  // border: 1px solid #d0d8e0;
  border-radius: 5px;
  position: relative;
  max-width: 431px;
}
.pic-show {
  border: 1px solid #d0d8e0;
}
.pic-div {
  width: 100%;
  height: 450px;
}
.img-div .delete-span {
  position: absolute;
  top: 5px;
  right: 0px;
  display: inline-block;
  width: 25px;
  height: 25px;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  padding: 3px;
  margin-right: 10px;
  cursor: pointer;
  i {
    font-size: 20px;
  }
}
/deep/.el-dialog__headerbtn {
  top: 10px;
}
/deep/.el-upload-dragger {
  width: 431px;
  height: 450px;
}
.remark {
  margin-bottom: 30px;
}
/deep/.remark .el-form .el-form-item .el-input {
  width: 895px;
}
.remark-span {
  display: inline-block;
  margin: 0 10px 0 90px;
  color: #888e9e;
}
/deep/.el-form-item__label-wrap .el-form-item__label {
  color: #888e9e;
}
.product-detail-content .product-item-content {
  margin-left: 20px;
}
.product-detail-content .product-item-content .product-content-info {
  padding: 0;
}
.product-detail-content .product-item-content .product-content-title {
  margin-bottom: 20px;
}
.product-detail-content .product-item-content .firstPart-div {
  margin-bottom: 0;
}
.red {
  color: #ff4949;
}
.remark-tetx {
  display: inline-block;
  width: 700px;
  word-wrap:break-word;
  word-break:normal;
}
.remark-div {
  display: flex;
  margin: 24px 20px 30px 0;
}
.mind-text {
  color: #ff4949;
  margin-top: 20px;
  font-size: 12px;
}
.h-60 {
  height: 56px;
}
.product-detail-content .product-item-content .firstPart {
  padding: 12px 20px;
}
/deep/.custom-form .el-form.el-form--inline .el-form-item {
  width: 473px !important;
}
</style>
