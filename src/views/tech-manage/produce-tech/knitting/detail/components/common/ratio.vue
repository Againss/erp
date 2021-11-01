/**
 * @Description:自定义状态单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div class="ratio-box">
    <template v-if="cflength && cflength > 1">
      <el-row v-if="scope.row.edit">
        <el-col v-for="(item, i) in cflength" :key="i" :span="24/cflength">
          <el-form-item
            :rules="rules"
            :prop="prop('a' + (i + 1))"
          >
            <el-input
              class="inputs"
              :value="value['a' + (i + 1)]"
              @input="inputChange('a' + (i + 1), $event)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col v-for="(item, i) in cflength" :key="i" class="vals" :span="24/cflength">
          {{ value['a' + (i + 1)] }}
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <div class="success">
        <span>{{ scope.row.edit ? 100 : value['a1'] }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TableFormCustom',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    editType: {
      type: String
    },
    itemType: {
      type: [String, Object]
    },
    itemProp: {
      type: String
    },
    itemProps: {
      type: Object
    },
    column: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: null
    }
  },
  data() {
    return {}
  },
  computed: {
    editabled() {
      return this.scope.row.edit && this.editType === 'inline'
    },
    rules() {
      return this.column && this.column.rules || undefined
    },
    cflength() {
      const ele = this.formDatas.tableForm[this.scope.$index]
      return ele['element'] && ele['element'].isZh || 0
    }
  },
  created() {
    // console.log('ratio', this.scope)
  },
  updated() {
    // console.log(this.formDatas)
  },
  methods: {
    prop(key) {
      return [this.itemProp] + '.' + [this.scope.$index] + '.' + [this.scope.column.property] + '.' + key
    },
    inputChange(key, $event) {
      // console.log(this.value, $event, this.formDatas, this.itemProp)
      if ($event && (!/^\d+\.?\d{0,2}$/.test($event) || $event > 99.99)) {
        this.$message({
          message: '请输入小于99.99且最多两位小数的数值',
          type: 'error'
        })
        return
      }
      let values = {}
      values = JSON.parse(JSON.stringify(this.formDatas[this.itemProp]))
      values[this.scope.$index][this.scope.column.property][key] = $event
      this.setFormDatas({ [this.itemProp]: values })
    }
  }
}
</script>

<style lang="scss">

.success {
  color: #888;
  font-size: 14px;
  /*   padding-top: 7px; */
  max-width: 60px;
  overflow: hidden;
}
.danger {
  border: 1px solid #ff0000;
  padding: 2px 5px;
  color: #ff0000;
  border-radius: 5px;
}
</style>
