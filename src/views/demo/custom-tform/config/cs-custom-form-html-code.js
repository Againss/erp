/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
/* eslint-disable*/
const code = `
<template>
  <div style="padding: 20px">
    <div class="search">
      <div class="custom-demo-title">cs-custom-form demo:</div>
      <cs-custom-form ref="searchForm" :form-datas="searchFormDatas" :data-source="searchData" :options="formOtions" />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-table inline模式demo:</div>
      <cs-custom-table
        ref="inlineTable"
        :columns="columns"
        :selection="selection"
        :data-source="dataSource"
        :operates="inlineOperates"
        :pagination="pagination"
        :span-method="spanMethod"
        border
        :form-datas="formDatas"
        edit-type="inline"
        @selection-change="selectionChange"
      />
    </div>
    <div class="table">
      <div class="custom-demo-title">cs-custom-table pop模式demo:</div>
      <cs-custom-table
        :columns="columns"
        :selection="selection"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        @selection-change="selectionChange"
      />
    </div>
    <div class="pop">
      <cs-custom-pop ref="pop" :options="popOptions" />
    </div>
  </div>
</template>
`
export default code
