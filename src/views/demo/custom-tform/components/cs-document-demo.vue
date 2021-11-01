/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-table:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomTableConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-table columns:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomTableColumnsConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-form:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomFormConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-form data-source:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomFormDataSourceConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-form data-source treeOptions:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomFormDataSourceTreeOptionsConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-form data-source treeOptions data:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomFormDataSourceTreeOptionsDataConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-form data-source tableOptions:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomFormDataSourceTableOptionsConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-form data-source content:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomFormDataSourceContentConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-pop:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomPopConfig"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-pop options:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csCustomPopOptionsConfig"
      />
    </div>
    <!-- 打印配制信息 -->
    <div class="table">
      <div class="custom-demo-title">cs-print:</div>
      <cs-custom-table
        :columns="columnsInfos"
        :data-source="csPrintConfig"
      />
    </div>
  </div>
</template>

<script>
import columnsInfos from '../config/columns'

import csCustomTableConfig from '../config/cs-custom-table-config'
import csCustomTableColumnsConfig from '../config/cs-custom-table-columns-config'
import csCustomFormConfig from '../config/cs-custom-form-config'
import csCustomFormDataSourceConfig from '../config/cs-custom-form-dataSource-config'
import csCustomFormDataSourceTreeOptionsConfig from '../config/cs-custom-form-dataSource-treeOptions-config'
import csCustomFormDataSourceTreeOptionsDataConfig from '../config/cs-custom-form-dataSource-treeOptions-data-config'
import csCustomFormDataSourceTableOptionsConfig from '../config/cs-custom-form-dataSource-tableOptions-config'
import csCustomFormDataSourceContentConfig from '../config/cs-custom-form-dataSource-content-config'
import csCustomPopConfig from '../config/cs-custom-pop-config'
import csCustomPopOptionsConfig from '../config/cs-custom-pop-options-config'
import csPrintConfig from '../config/cs-print-config'
export default {
  components: {},
  data() {
    return {
      columnsInfos,
      csCustomTableConfig,
      csCustomTableColumnsConfig,
      csCustomFormConfig,
      csCustomFormDataSourceConfig,
      csCustomFormDataSourceTreeOptionsConfig,
      csCustomFormDataSourceTreeOptionsDataConfig,
      csCustomFormDataSourceTableOptionsConfig,
      csCustomFormDataSourceContentConfig,
      csCustomPopConfig,
      csCustomPopOptionsConfig,
      csPrintConfig
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px;}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
