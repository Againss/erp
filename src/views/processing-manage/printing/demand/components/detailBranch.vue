<template>
  <div id="DetailBranch">
    <cs-custom-form
      :data-source="detailData"
      :options="detailFormOptions"
      :form-datas="detailFormDatas"
    />
    <cs-custom-table
      :columns="columns"
      :data-source="dataSource"
    />
  </div>
</template>

<script>
export default {
  name: 'DetailBranch',
  data() {
    const detailStyle = {}
    const detailData = {
      _mbe1: {
        prop: 'mbe1',
        itemType: 'itemview',
        label: '产品编码:',
        itemStyle: detailStyle
      },
      _mbe2: {
        prop: 'mbe2',
        itemType: 'itemview',
        label: '布类:',
        itemStyle: detailStyle
      },
      _mbe3: {
        prop: 'mbe3',
        itemType: 'itemview',
        label: '成品规格:',
        itemStyle: detailStyle
      },
      _mbe4: {
        prop: 'mbe4',
        itemType: 'itemview',
        label: '计划交期:',
        itemStyle: detailStyle
      },
      _mbe5: {
        prop: 'mbe5',
        itemType: 'itemview',
        label: '织单交期:',
        itemStyle: detailStyle
      },
      _mbe6: {
        prop: 'mbe6',
        itemType: 'itemview',
        label: '坯布数量:',
        itemStyle: detailStyle
      },
      _mbe7: {
        prop: 'mbe7',
        itemType: 'itemview',
        label: '工艺:',
        itemStyle: detailStyle
      }
    }
    const columns = {
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _mbe0: {
        prop: 'mbe0',
        label: '色纱编码',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe1: {
        prop: 'mbe1',
        label: '纱名',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe2: {
        prop: 'mbe2',
        label: '纱属性',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe3: {
        prop: 'mbe3',
        label: '织颜色',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe4: {
        prop: 'mbe4',
        label: '工厂色号',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe5: {
        prop: 'mbe5',
        label: '颜色占比',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe6: {
        prop: 'mbe6',
        label: '织损',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe7: {
        prop: 'mbe7',
        label: '纱需求量(KG)',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _mbe8: {
        prop: 'mbe8',
        label: '计划到纱期',
        // minWidth: '150',
        showOverflowTooltip: true,
        handle: (scope) => {}
      }
    }
    return {
      dataSource: [],
      columns,
      detailData,
      detailFormOptions: {
        inline: true
      },
      detailFormDatas: {
        mbe1: 1
      }
    }
  }
}
</script>
<style scoped lang="scss">
#DetailBranch {
  flex:100%
}
</style>
