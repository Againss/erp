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

export default {
  name: 'BatchToTemplate',

  mixins: [PublicCustomer],

  data() {
    return {
      tableDataSource: [],
      columns: {
        _sourceVal: {
          prop: 'sourceVal',
          label: '批次',
          showOverflowTooltip: true
        },
        _templateType: {
          prop: 'targetList',
          label: '制板类型',
          showOverflowTooltip: true,
          formater: scope => {
            return scope.row.targetList.map(item => item.label || '').join(', ')
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
            permitTag: ['sysSettings:template:parameter:batchAdd'],
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
        title: '新增批次可选板型',
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
            label: '批次要求:',
            valueType: 'object',
            valueKey: 'value',
            dataSource: [],
            clearable: true,
            rules: [{ required: true, message: '批次要求不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                this.getOptionConfig({ fieldName: '批次要求' })
                  .then(res => {
                    this.popOptions.content._source.dataSource = this.dataFilter(res)
                  })
              }
            },
            renderContent: commonItemViewRender()
          },
          _targetList: {
            prop: 'targetList',
            itemType: 'select',
            itemStyle,
            label: '制板类型:',
            valueType: 'object',
            valueKey: 'value',
            multiple: true,
            dataSource: [],
            clearable: true,
            rules: [{ required: true, message: '制板类型不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                this.getOptionConfig({ fieldName: '制板类型' })
                  .then(res => {
                    this.popOptions.content._targetList.dataSource = res
                  })
              }
            }
          }
        }
      },
      popForm: null
    }
  },

  watch: {
    popEdit(val) {
      this.popOptions.title = val ? '编辑批次可选板型' : '新增批次可选板型'
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
        settingType: SETTING_TYPE.BATCH_TO_TEMPLATE
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
      return row
    },

    reverseData(newRow) {
      newRow.settingType = newRow.settingType || SETTING_TYPE.BATCH_TO_TEMPLATE
      newRow.sourceKey = newRow.source.value
      newRow.sourceVal = newRow.source.label
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
