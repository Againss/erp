<!--
 * @Date: 2020-11-04 16:11:42
 * @Author: Againss
 * @LastEditTime: 2021-04-22 17:47:10
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <div>
    <div v-if="componentsOptions.isSelect" class="input-div">
      <div v-if="scope.row.edit">
        <div class="input-edit">
          <el-input
            size="medium"
            :value="scope.row.quantity || ''"
            placeholder="请输入内容"
            @input="handleInput($event, 'quantity')"
          />
          <el-select size="medium" class="select-l" :value="scope.row.unit" placeholder="请选择" @change="changeValue">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div
          v-show="showNum"
          class="tip"
        >
          <span>用量必填,最多只能输入四位小数</span>
        </div>
        <div
          v-show="scope.row.quantity&&scope.row.unit===''"
          class="tip"
        >
          <span>单位必选</span>
        </div>
      </div>
      <div v-else class="input-edit">
        {{ scope.row.quantity }}{{ scope.row.unit }}
      </div>
    </div>
    <div v-else class="input-div">
      <div v-show="scope.row.edit">
        <div class="input-edit input-groud">
          <el-input
            size="medium"
            class="w-40"
            :value="scope.row.liquorRatioLower || ''"
            oninput="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            placeholder="浴比"
            @input="handleInput($event, 'liquorRatioLower')"
          /> <span class="span-sty">:</span>
          <el-input
            size="medium"
            class="mr-30"
            :value="scope.row.liquorRatioUpper || ''"
            oninput="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            placeholder="浴比"
            @input="handleInput($event, 'liquorRatioUpper')"
          />
        </div>
        <div
          class="tip"
        >
          <span v-show="(scope.row.liquorRatioLower && !scope.row.liquorRatioUpper ) || (!scope.row.liquorRatioLower && scope.row.liquorRatioUpper)">浴比不能只填写一个值</span>
        </div>
      </div>
      <div v-show="!scope.row.edit" class="input-edit">
        <div v-show="scope.row.liquorRatioLower">
          {{ scope.row.liquorRatioLower }}:{{ scope.row.liquorRatioUpper }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    },
    scope: {
      type: Object
    }
  },
  data() {
    return {
      options: [{
        value: '%',
        label: '%'
      }, {
        value: 'g',
        label: 'g'
      }, {
        value: 'g/l',
        label: 'g/l'
      }],
      itemObj: {
        quantity: '',
        unit: ''
      },
      InputItem: {
        liquorRatioLower: '',
        liquorRatioUpper: ''
      },
      option: {
        type: 'fiexd',
        handleInput: (e) => {
          // this.itemObj.quantity = e
          this.componentsOptions.Handler(e, this.scope, 'quantity')
        }
      }
    }
  },
  computed: {
    showNum() {
      if (!this.scope.row.quantity || isNaN(this.scope.row.quantity) || this.scope.row.quantity - 0 <= 0 || this.scope.row.quantity && (String(this.scope.row.quantity).split('.').length > 2 || String(this.scope.row.quantity).split('.').length === 2 && (String(this.scope.row.quantity).split('.')[1].length > 4 || String(this.scope.row.quantity).split('.')[1].length === 0))) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    changeValue(e) {
      console.log(e, 'e----')
      // this.itemObj[item] = e
      this.componentsOptions.Handler(e, this.scope, 'unit')
    },
    handleInput(e, item) {
      console.log(e, 'e--------')
      // this.InputItem[item] = e
      this.componentsOptions.Handler(e, this.scope, item)
    }

  }
}
</script>

<style lang="scss" scoped>
.mr-30 {
  margin-right: 30%;
}
.el-input {
  width: 50%;
}
.input-div {
  display: flex;
  // flex-direction: row;
}
.input-groud {
  // margin-bottom: 20px;
}
.input-edit {
  display: flex;
}
.span-sty {
  margin: 0 15px;
}
.tip {
  font-size: 12px;
  color: red;
  height: 20px;
}
/deep/ .el-input__inner {
  height: 36px;
}
.select-l {
  margin-left: 10px;
  margin-right: 20%;
}
</style>
