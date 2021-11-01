/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
/* eslint-disable*/
const code = `
<template>
  <div v-if="editabled">
    <el-form-item :rules="rules" :prop="prop">
      <el-select :value="value" placeholder="请选择" @change="selectChange">
        <el-option
          v-for="item in column.editOptions.dataSource"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </div>
  <div v-else>
    <span v-if="scope.row[scope.column.property]==='2'" class="success">成功</span>
    <span v-else class="danger">失败</span>
  </div>
</template>
`
export default code
