/**
 * @Description: 配置项
 * @author Roman
 * @date 2020/7/3
 */
/* eslint-disable*/
const code = `
<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form-item :rules="[ruleRequire]" prop="areaNum" label="手机">
          <el-select :value="areaNumValue" @change="areaNumChange">
            <el-option v-for="item in dataSource" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <div class="solidStyle">-</div>
      </el-col>
      <el-col :span="11">
        <el-form-item :rules="[ruleRequire]" prop="tel" label="" label-width="0">
          <el-input :value="telValue" @input="telChange" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
`
export default code
