<template>
  <div class="inventoryStatistics srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="button clearfix">
      <!-- v-permission="['srm:supplier:export']" -->
      <el-button
        size="small"
        class="fr"
        type="primary"
        @click="exportSupplier"
      >导出</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <!-- v-permission="['srm:supplier:list']" -->
      <div class="page-table">
        <cs-custom-table
          :show-overflow-tooltip="true"
          tooltip-effect="dark"
          :autoresize="false"
          :columns="columns"
          :data-source="list"
          :pagination="pagination"
          :operates="popOperates"
          highlight-current-indexrow
        />
      </div>
    </div>
    <CsCustomPop ref="detail" :options="popOptions" />
  </div>
</template>

<script>
export default {
  name: 'InventoryStatistics',
  data() {
    const itemStyle = { width: '33%' }
    const searchData = [
      {
        prop: 'supplierType',
        itemStyle,
        itemType: 'select',
        label: '仓库',
        dataSource: []
      },
      {
        prop: 'supplierType1',
        itemStyle,
        itemType: 'select',
        label: '查询方式',
        dataSource: []
      },
      {
        prop: 'supplierType2',
        itemStyle,
        itemType: 'select',
        label: '货物类型',
        dataSource: []
      },
      {
        prop: 'supplierType3',
        itemStyle,
        itemType: 'input',
        label: '产品编码',
        placeholder: '请输入产品编码'
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          console.log('查询', params)
        },
        submitText: '查询',
        resetHandle: () => {
          console.log('重置')
        }
      }
    ]
    const columns = [
      {
        prop: 'mbe1',
        label: '产品编码'
      },
      {
        prop: 'mbe2',
        label: '产品属性'
      },
      {
        prop: 'mbe3',
        label: '库存总数'
      },
      {
        prop: 'mbe4',
        label: '可用库存数'
      },
      {
        prop: 'mbe5',
        label: '锁定库存数'
      },
      {
        prop: 'mbe6',
        label: '暂存库存数'
      },
      {
        prop: 'mbe7',
        label: '库存总重量(KG)'
      },
      {
        prop: 'mbe8',
        label: '纱牌纱批'
      },
      {
        prop: 'mbe9',
        label: '缸号'
      },
      {
        prop: 'mbe10',
        label: '染纱颜色'
      }
    ]
    const pagination = {
      currentChange: (val) => {},
      sizeChange: (val) => {}
    }
    const popOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: '80',
      dataSource: [
        {
          label: '详情',
          isShow: true,
          handle: params => {
            this.popOptions.visible = true
          }
        }
      ]
    }
    return {
      searchData,
      popOperates,
      columns,
      pagination,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      list: [
        { mbe1: '123' }
      ],
      popOptions: {
        itemType: 'dialog',
        visible: false,
        title: '库存明细',
        width: '1300px',
        ok: params => { this.popOptions.visible = false },
        cancel: () => { this.popOptions.visible = false },
        content: [
          {
            itemType: 'table',
            columns: []
          }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    exportSupplier() {}
  }
}
</script>

<style lang="scss" scoped>
.inventoryStatistics {
}
</style>
