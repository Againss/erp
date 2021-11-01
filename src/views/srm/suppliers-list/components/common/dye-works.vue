<!-- 染纱厂 -->
<template>
  <div>
    <div class="t-tab-container tab-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in Object.keys(dataConfig)"
          :key="i"
          :label="dataConfig[item].name"
          :name="item"
        >
          <div class="table-details detail">
            <cs-custom-table
              ref="searchForm"
              :key="activeName"
              :columns="dataConfig[item].columns"
              tooltip-effect="dark"
              :autoresize="false"
              :data-source="info[dataConfig[item].dataSource]"
              :operates="popOperates"
              edit-type="pop"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import * as api from '../../api/index'
export default {
  name: 'DyeWorks',
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
    var validateNum = (rule, value, callback) => {
      const reg = /^[1-9]\d{0,3}?$/
      if ((value && !reg.test(value)) || (!value)) {
        callback(new Error('请输入1-9999的正整数'))
      }
      callback()
    }
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const yeaReg = this.$getRules({
      type: 'number',
      pattern: /^\d{4}$/,
      message: '请输入4位数字，如：2010',
      trigger: ['blur']
    })
    const numberRegMax = this.$getRules({
      type: 'number',
      pattern: /(^(([1-9]\d{0,7})(\.[1-9])?)$|(^0\.[1-9])$)/,
      message: '请输入8位整数，或最多可保留1位小数',
      trigger: ['blur']
    })
    // const numberRegMax20 = this.$getRules({
    //   type: 'number',
    //   pattern: /(^(([1-9]\d{0,17})(\.[1-9])?)$|(^0\.[1-9])$)/,
    //   message: '请输入17数字，最多可保留1位小数',
    //   trigger: ['blur']
    // })
    const content1 = [
      {
        prop: 'departmentId',
        itemType: 'input',
        label: '设备ID',
        maxlength: '50',
        disabled: true,
        placeholder: '保存自动生成'
      },
      {
        prop: 'deviceNumber',
        itemType: 'input',
        label: '机号',
        maxlength: '20',
        rules: commonBlurReg
      },
      {
        prop: 'equipmentName',
        itemType: 'input',
        label: '设备名称',
        maxlength: '50',
        placeholder: '输入设设备名称',
        rules: commonBlurReg
      },
      {
        prop: 'brand',
        itemType: 'select',
        valueType: 'object',
        label: '品牌',
        rules: commonBlurReg,
        dataSource: []
      },
      {
        prop: 'num',
        itemType: 'input',
        label: '数量',
        rules: [{ required: true, trigger: 'blur', validator: validateNum }]
      },
      {
        prop: 'model',
        itemType: 'input',
        label: '型号',
        maxlength: '50'
      },
      {
        prop: 'yearsProduction',
        itemType: 'input',
        label: '出厂年限',
        maxlength: '4',
        rules: [yeaReg]
      }
    ]
    const content2 = [
      {
        prop: 'speed',
        itemType: 'input',
        label: '车速（m/min)',
        maxlength: 10,
        rules: numberRegMax
      },
      {
        prop: 'controlPc',
        itemType: 'input',
        label: '控制电脑品牌',
        maxlength: 50
      },
      {
        prop: 'monthOutput',
        itemType: 'input',
        label: '月产能（吨）',
        maxlength: 10,
        rules: [numberRegMax]
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注:',
        rows: 3,
        maxlength: 50,
        placeholder: '请输入备注'
      }
    ]
    const columns1 = [
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: scope => scope.$index + 1
      },
      {
        prop: 'deviceNumber',
        label: '机号',
        align: 'center',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'equipmentName',
        label: '设备名称',
        align: 'center',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'brand',
        label: '品牌',
        align: 'center',
        minWidth: '105',
        showOverflowTooltip: true,
        formater: scope => scope.row.brand ? scope.row.brand.label : ''
      },
      {
        prop: 'num',
        label: '数量',
        align: 'center',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'model',
        label: '型号',
        align: 'center',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'yearsProduction',
        label: '出厂年限',
        align: 'center',
        minWidth: '105',
        showOverflowTooltip: true
      }
    ]
    const columns2 = [
      {
        prop: 'speed',
        label: '车速（m/min)',
        align: 'center',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'monthOutput',
        label: '月产能（吨）',
        align: 'center',
        minWidth: '105',
        showOverflowTooltip: true
      },
      {
        prop: 'controlPc',
        label: '控制电脑品牌',
        align: 'center',
        minWidth: '130',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '更新时间',
        align: 'center',
        minWidth: '160',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        align: 'center',
        minWidth: '130',
        showOverflowTooltip: true
      }
    ]
    const dataConfig = {
      r: {
        name: '染色',
        dataSource: 'supplierDyeingDyeing',
        content: [
          ...content1,
          {
            prop: 'type',
            itemType: 'select',
            label: '染类型',
            clearable: true,
            rules: commonBlurReg,
            dataSource: [
              { label: '气流', value: 1 },
              { label: '溢流', value: 2 },
              { label: '气液', value: 3 },
              { label: '其他', value: 4 }
            ]
          },
          {
            prop: 'diameter',
            itemType: 'input',
            label: '直径（mm)',
            maxlength: '10',
            rules: numberRegMax
          },
          {
            prop: 'tubeNumber',
            itemType: 'input',
            label: '管数',
            maxlength: '10',
            rules: numberRegMax
          },
          {
            prop: 'liquorRatio',
            itemType: 'input',
            label: '浴比',
            maxlength: '20'
          },
          ...content2
        ],
        columns: [
          ...columns1,
          {
            prop: 'type',
            label: '染类型',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true,
            formater: scope => {
              const type = {
                '1': '气流',
                '2': '溢流',
                '3': '气液',
                '4': '其他'
              }
              return type[scope.row.type] || '木有'
            }
          },
          {
            prop: 'diameter',
            label: '直径（mm)',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'tubeNumber',
            label: '管数',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'liquorRatio',
            label: '浴比',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          ...columns2
        ]
      },
      z: {
        name: '抓毛',
        dataSource: 'supplierDyeingBallwool',
        content: [
          ...content1,
          {
            prop: 'rollerNumber',
            itemType: 'input',
            maxlength: '10',
            label: '辊数',
            rules: numberRegMax
          },
          {
            prop: 'needleType',
            itemType: 'input',
            maxlength: '50',
            label: '针型号'
          },
          {
            prop: 'density',
            itemType: 'input',
            maxlength: '10',
            label: '密值',
            rules: numberRegMax
          },
          ...content2
        ],
        columns: [
          ...columns1,
          {
            prop: 'rollerNumber',
            label: '辊数',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'needleType',
            label: '针型号',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'density',
            label: '密值',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          ...columns2
        ]
      },
      s: {
        name: '刷毛',
        dataSource: 'supplierDyeingBrushing',
        content: [
          ...content1,
          {
            prop: 'type',
            itemType: 'select',
            label: '类型',
            clearable: true,
            rules: commonBlurReg,
            dataSource: [
              { label: '碳素', value: 1 },
              { label: '陶瓷', value: 2 }
            ]
          },
          {
            prop: 'rollerNumber',
            itemType: 'input',
            maxlength: '10',
            label: '辊数',
            rules: numberRegMax
          },
          {
            prop: 'frontRollerDiameter',
            itemType: 'input',
            maxlength: '10',
            label: '前辊直径（mm)',
            rules: numberRegMax
          },
          {
            prop: 'backRollerDiameter',
            itemType: 'input',
            maxlength: '10',
            label: '后辊直径（mm)',
            rules: numberRegMax
          },
          ...content2
        ],
        columns: [
          ...columns1,
          {
            prop: 'type',
            label: '类型',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true,
            formater: scope => scope.row.type === 1 ? '碳素' : '陶瓷'
          },
          {
            prop: 'rollerNumber',
            label: '辊数',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'frontRollerDiameter',
            label: '前辊直径（mm)',
            align: 'center',
            minWidth: '125',
            showOverflowTooltip: true
          },
          {
            prop: 'backRollerDiameter',
            label: '后辊直径（mm)',
            align: 'center',
            minWidth: '125',
            showOverflowTooltip: true
          },
          ...columns2
        ]
      },
      m: {
        name: '磨毛',
        dataSource: 'supplierDyeingSanding',
        content: [
          ...content1,
          {
            prop: 'rollerNumber',
            itemType: 'input',
            maxlength: '10',
            label: '辊数',
            rules: numberRegMax
          },
          {
            prop: 'grindingRollerNumber',
            itemType: 'input',
            maxlength: '10',
            label: '磨辊气缸数',
            rules: numberRegMax
          },
          {
            prop: 'grindingRollerDiameter',
            itemType: 'input',
            maxlength: '10',
            label: '磨辊直径（mm)',
            rules: numberRegMax
          },
          {
            prop: 'maxThickSandpaper',
            itemType: 'input',
            maxlength: '20',
            label: '最粗砂纸（目）'
          },
          {
            prop: 'minThinSandpaper',
            itemType: 'input',
            maxlength: '20',
            label: '最细砂纸（目）'
          },
          ...content2
        ],
        columns: [
          ...columns1,
          {
            prop: 'rollerNumber',
            label: '辊数',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'grindingRollerNumber',
            label: '磨辊气缸数',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'grindingRollerDiameter',
            label: '磨辊直径（mm)',
            align: 'center',
            minWidth: '125',
            showOverflowTooltip: true
          },
          {
            prop: 'maxThickSandpaper',
            label: '最粗砂纸（目）',
            align: 'center',
            minWidth: '125',
            showOverflowTooltip: true
          },
          {
            prop: 'minThinSandpaper',
            label: '最细砂纸（目）',
            align: 'center',
            minWidth: '125',
            showOverflowTooltip: true
          },
          ...columns2
        ]
      },
      j: {
        name: '剪毛',
        dataSource: 'supplierDyeingShearing',
        content: [
          ...content1,
          {
            prop: 'knifeNumber',
            itemType: 'input',
            maxlength: '10',
            label: '刀片数',
            rules: numberRegMax
          },
          {
            prop: 'roundKnifeDiameter',
            itemType: 'input',
            maxlength: '10',
            label: '圆刀直径（mm)',
            rules: numberRegMax
          },
          {
            prop: 'drawoffRollerDiameter',
            itemType: 'input',
            maxlength: '10',
            label: '牵引辊直径（mm)',
            rules: numberRegMax
          },
          ...content2
        ],
        columns: [
          ...columns1,
          {
            prop: 'knifeNumber',
            label: '刀片数',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'roundKnifeDiameter',
            label: '圆刀直径（mm)',
            align: 'center',
            minWidth: '125',
            showOverflowTooltip: true
          },
          {
            prop: 'drawoffRollerDiameter',
            label: '牵引辊直径(mm)',
            align: 'center',
            minWidth: '125',
            showOverflowTooltip: true
          },
          ...columns2
        ]
      },
      x: {
        name: '吸毛',
        dataSource: 'supplierDyeingWoolsuction',
        content: [
          ...content1,
          ...content2
        ],
        columns: [
          ...columns1,
          ...columns2
        ]
      },
      sm: {
        name: '烧毛',
        dataSource: 'supplierDyeingSingeing',
        content: [
          ...content1,
          {
            prop: 'temperature',
            itemType: 'input',
            maxlength: '10',
            label: '温度',
            rules: numberRegMax
          },
          {
            prop: 'nozzlesNumber',
            itemType: 'input',
            maxlength: '10',
            label: '火嘴数量',
            rules: numberRegMax

          },
          ...content2
        ],
        columns: [
          ...columns1,
          {
            prop: 'temperature',
            label: '温度',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'temperature',
            label: '火嘴数量',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          ...columns2
        ]
      },
      d: {
        name: '定型',
        dataSource: 'supplierDyeingSetting',
        content: [
          ...content1,
          {
            prop: 'sprayNumber',
            itemType: 'input',
            maxlength: '10',
            label: '喷硅油机',
            rules: numberRegMax
          },
          {
            prop: 'hasAutomaticDensitometer',
            itemType: 'select',
            label: '自动密度仪',
            dataSource: [
              { value: 0, label: '无' },
              { value: 1, label: '有' }
            ]
          },
          {
            prop: 'dryingOvenNumber',
            itemType: 'input',
            maxlength: '10',
            label: '烘箱数量',
            rules: numberRegMax
          },
          {
            prop: 'hasSpray',
            itemType: 'select',
            label: '喷雾',
            dataSource: [
              { value: 0, label: '无' },
              { value: 1, label: '有' }
            ]
          },
          ...content2
        ],
        columns: [
          ...columns1,
          {
            prop: 'sprayNumber',
            label: '喷硅油机',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'hasAutomaticDensitometer',
            label: '自动密度仪',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true,
            formater: scope => scope.row.hasAutomaticDensitometer === 1 ? '有' : '无'

          },
          {
            prop: 'dryingOvenNumber',
            label: '烘箱数量',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true
          },
          {
            prop: 'hasSpray',
            label: '喷雾',
            align: 'center',
            minWidth: '105',
            showOverflowTooltip: true,
            formater: scope => scope.row.hasSpray === 1 ? '有' : '无'
          },
          ...columns2
        ]
      },
      y: {
        name: '预缩',
        dataSource: 'supplierDyeingPreshrinking',
        content: [
          ...content1,
          ...content2
        ],
        columns: [
          ...columns1,
          ...columns2
        ]
      }
    }
    const popOperates = {
      label: '操作',
      align: 'center',
      width: '160px',
      fixed: 'right',
      dataSource: [
        {
          label: '复制',
          isShow: scope => this.$parent.type !== 'detail',
          handle: params => {
            this.type = 'copy'
            this.$set(this.popOptions, 'title', '添加')
            this.clickIndex = params.$index
            this.$set(this.popOptions, 'formDatas', { ...params.row, id: null })
            this.$set(this.popOptions, 'visible', true)
          }
        },
        {
          label: '删除',
          isShow: scope => this.$parent.type !== 'detail',
          style: { 'color': '#FE4949' },
          handle: params => {
            this.$confirm('确认删除当前数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'customClass'
            }).then(async() => {
              const type = { r: 1, z: 2, s: 3, m: 4, j: 5, x: 6, sm: 7, d: 8, y: 9 }
              const data = {
                supplierId: this.$route.query.id,
                id: [...this.info[this.dataConfig[this.activeName].dataSource]][params.$index].id,
                type: type[this.activeName]
              }
              await api.suppliersSetting('/supplierDeviceInfo/dyeingEquipment/delete', data)
              this.$message.success('删除成功')
              this.setData()
              this.$store.dispatch('app/fetchParamsLog', {
                params: data,
                opratorType: 'DEL',
                api: 'srm/supplierDeviceInfo/dyeingEquipment/delete',
                description: {
                  beforeText: '在供应商列表-设备信息-染纱设备删除了一条数据',
                  beforeCode: data
                },
                appId: 'srm'
              })
            })
          }
        },
        {
          label: '修改',
          isShow: scope => this.$parent.type !== 'detail',
          handle: params => {
            this.type = 'edit'
            this.$set(this.popOptions, 'title', '修改')
            this.clickIndex = params.$index
            this.$set(this.popOptions, 'visible', true)
            // params.row.brand.value = String(params.row.brand.value)
            this.$set(this.popOptions, 'formDatas', { ...params.row })
          }
        }
      ]
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '添加',
      okText: '确定',
      ok: params => {
        this.save(params)
      },
      cancel: params => {
        this.$set(this.popOptions, 'visible', false)
      },
      content: [],
      formDatas: {}
    }
    return {
      activeName: 'r',
      popOptions,
      columns: [],
      dataSource: [],
      popOperates,
      dataConfig,
      dataAll: {},
      clickIndex: -1,
      tabIndex: 0
    }
  },
  mounted() {
    this.setDataFn('r')
    this.setPinPai()
  },
  methods: {
    async setPinPai() {
      const resPin = await api.getPinPai({ equipmentType: '1' })
      Object.values(this.dataConfig).forEach(e => {
        const item = e.content.find(ele => ele.label === '品牌' && ele.itemType === 'select')
        if (item) {
          item.dataSource = resPin
        }
      })
    },
    todo(type) {
      if (type === 'add') {
        this.add()
      } else if (type === 'exp') {
        this.bindImport()
      }
    },
    // 点击tab切换标签
    handleClick(v) {
      this.tabIndex = v.index
      this.setDataFn(v.name)
    },
    setDataFn(val) {
      this.$set(this.popOptions, 'content', this.dataConfig[val].content)
      this.$set(this, 'columns', this.dataConfig[val].columns)
    },
    // 导出
    async bindImport(params = {}) {
      const type = {
        r: 'supplierDyeingDyeing',
        z: 'supplierDyeingBallwool',
        s: 'supplierDyeingBrushing',
        m: 'supplierDyeingSanding',
        j: 'supplierDyeingShearing',
        x: 'supplierDyeingWoolsuction',
        sm: 'supplierDyeingSingeing',
        d: 'supplierDyeingSetting',
        y: 'supplierDyeingPreshrinking'

      }
      const data = {
        supplierId: this.$route.query.id
      }
      const res = await api.exportDyeing(data, type[this.activeName])
      this.$utils.downloadStream(res)
    },
    // 添加
    add() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.$set(this.popOptions, 'title', '添加')
    },
    // 保存
    async save(data) {
      let datas = {}
      if (this.type === 'add' || this.type === 'copy') {
        datas = {
          str: '新增',
          type: 'INSERT',
          api: '/supplierDeviceInfo/dyeingEquipment/save',
          data: { [this.dataConfig[this.activeName].dataSource]: {
            supplierId: this.$route.query.id,
            ...data
          }}
        }
      } else {
        datas = {
          str: '编辑',
          type: 'UPDATE',
          api: '/supplierDeviceInfo/dyeingEquipment/modify',
          data: { [this.dataConfig[this.activeName].dataSource]: {
            supplierId: this.$route.query.id,
            ...data
          }}
        }
      }
      await api.suppliersSetting(datas.api, datas.data)
      this.$message.success('保存成功')
      this.setData()
      this.$store.dispatch('app/fetchParamsLog', {
        params: datas.data,
        opratorType: datas.type,
        api: 'srm' + datas.api,
        description: {
          beforeText: '在供应商列表-设备信息-染纱设备' + datas.str + '了一条数据',
          beforeCode: datas.data
        },
        appId: 'srm'
      })
      this.$set(this.popOptions, 'visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .button {
    margin-top: 10px;
    text-align: end;
  }
  .tab-wrap {
    position: relative;
    /deep/.el-tabs__nav-wrap {
      padding-left: 20px;
      background: #fff;
      &::after {
        height: 1px;
      }
    }
    // /deep/ .el-tabs__header {
    //   margin-bottom: 1px;
    // }
    /deep/ .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
  }
</style>
