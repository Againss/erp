<template>
  <div>
    <div v-permission="['sysSettings:template:parameter:batchAdd']" class="template-params-header">
      <el-button size="mini" type="primary" @click="onAddClick">
        <span style="font-size: 14px;">添加</span>
      </el-button>
    </div>

    <cs-custom-table
      class="template-params-table"
      table-scrollx
      tooltip-effect="dark"
      :columns="columns"
      :data-source="tableDataSource"
      :operates="operates"
    />

    <!-- 新增、编辑弹窗 -->
    <cs-custom-pop ref="pop" :options="popOptions" />
  </div>
</template>

<script>

import { PublicCustomer } from '@/views/system-settings/public'
import { commonItemViewRender, SETTING_TYPE, updateSelectDataSource } from '../common'
import { getSettings, saveSettings } from '../api'

const itemStyle = { width: '100%' }
const TEST_TYPE = {
  obj: '1', // 物测合格
  color: '2' // 批色合格
}
const TEST_LABEL_MAP = {
  [TEST_TYPE.obj]: '物测合格',
  [TEST_TYPE.color]: '批色合格'
}

export default {
  name: 'TemplateToTest',

  mixins: [PublicCustomer],

  data() {
    return {
      tableDataSource: [],
      columns: {
        _sourceVal: {
          prop: 'sourceVal',
          label: '板型',
          showOverflowTooltip: true
        },
        _templateType: {
          prop: 'targetList',
          label: '测试标准',
          showOverflowTooltip: true,
          formater: scope => {
            return scope.row.targetList.map(item => TEST_LABEL_MAP[item.label] || '').join('、')
          }
        }
      },
      operates: {
        label: '操作',
        width: '200',
        dataSource: [
          {
            label: '编辑',
            isShow: true,
            handle: scope => {
              this.popEdit = true
              this.popOptions.formDatas = this.processData(scope.row)
              updateSelectDataSource(this.popOptions.content, this.popOptions.formDatas, true)
              this.setPopVisible(true)
            }
          }
        ]
      },

      popEdit: false, // 是否为表格编辑操作
      popOptions: {
        itemType: 'drawer',
        size: '480px',
        title: '新增板型-合格标准',
        visible: false,
        okText: '保存',
        saveAndaddText: '继续添加',
        ok: params => {
          this.handleSave(params).then(() => {
            this.$message.success(this.popEdit ? '编辑成功' : '添加成功')
          })
        },
        saveAndadd: this.handleSaveAndAdd,
        beforeClose: () => {
          this.setPopVisible()
        },
        cancel: () => {
          this.setPopVisible()
        },
        formDatas: {},
        formOptions: {
          size: 'small',
          labelWidth: '100px',
          inline: true,
          getForm: (form) => {
            this.popForm = form
          }
        },
        content: {
          _source: {
            prop: 'source',
            itemType: this.selectTypeChange,
            itemStyle,
            label: '制板类型:',
            valueType: 'object',
            valueKey: 'value',
            dataSource: [],
            clearable: true,
            rules: [{ required: true, message: '制板类型不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                this.getOptionConfig({ fieldName: '制板类型' })
                  .then(res => {
                    this.popOptions.content._source.dataSource = this.dataFilter(res)
                  })
              }
            },
            renderContent: commonItemViewRender()
          },
          _formattedTargetList: {
            prop: 'formattedTargetList',
            itemType: 'checkbox-group',
            itemStyle,
            label: '测试要求:',
            dataSource: [
              { value: TEST_TYPE.obj, label: TEST_LABEL_MAP[TEST_TYPE.obj] },
              { value: TEST_TYPE.color, label: TEST_LABEL_MAP[TEST_TYPE.color] }
            ],
            rules: [{ required: true, message: '测试要求不能为空', trigger: 'change' }]
          }
        }
      },
      popForm: null
    }
  },

  watch: {
    popEdit(val) {
      this.popOptions.title = val ? '编辑板型-合格标准' : '新增板型-合格标准'
      this.popOptions.saveAndadd = val ? null : this.handleSaveAndAdd
    }
  },

  created() {
    this.getData()
  },

  methods: {
    selectTypeChange() {
      return this.popEdit ? 'itemview' : 'select'
    },

    getData() {
      getSettings({
        settingType: SETTING_TYPE.TEMPLATE_TO_TEST
      }).then(res => {
        this.tableDataSource = res.data || []
      })
    },

    dataFilter(data) {
      return data.filter(item => !this.tableDataSource.some(existItem => existItem.sourceKey === item.value))
    },

    // 转化为表单可编辑的数据
    processData(row) {
      row.source = {
        label: row.sourceVal,
        value: row.sourceKey
      }
      row.formattedTargetList = row.targetList.map(item => item.value)
      return row
    },

    reverseData(newRow) {
      newRow.settingType = newRow.settingType || SETTING_TYPE.TEMPLATE_TO_TEST
      newRow.sourceKey = newRow.source.value
      newRow.sourceVal = newRow.source.label
      newRow.targetList = newRow.formattedTargetList.map(item => ({ label: item, value: item }))
      delete newRow.source
      delete newRow.formattedTargetList
      return newRow
    },

    onAddClick() {
      this.popEdit = false
      this.setPopVisible(true)
    },

    handleSave(newRow) {
      return saveSettings(this.reverseData(newRow)).then(res => {
        this.getData()
        this.popOptions.formDatas = {}
        this.setPopVisible()
      })
    },

    handleSaveAndAdd(newRow) {
      return this.popForm.validate(async valid => {
        if (valid) {
          saveSettings(this.reverseData(newRow)).then(res => {
            this.getData()
            this.$message.success('添加成功')
            this.popOptions.formDatas = {}
            this.$nextTick(() => {
              this.popForm.clearValidate()
            })
          })
        }
      })
    },

    setPopVisible(visible = false) {
      this.popOptions.visible = visible
      if (!visible) {
        this.popOptions.formDatas = {}
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
