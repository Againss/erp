<template>
  <div class="a-info-wrap">
    <div class="a-info-box">
      <el-input v-model="orderNo" style="width: 40%;" maxlength="20" placeholder="请输入订单号" />
      <div class="box-lab">匹配维度</div>
      <el-select v-model="checkedCities" multiple placeholder="请选择" style="width: 100%;position: relative;" @remove-tag="deleteTag">
        <div class="checked-all">
          <el-checkbox v-model="checkAll" class="check-text" @change="checkedClick">全选</el-checkbox>
          <span class="reset" @click="resetSelect">重置</span>
        </div>
        <!-- 占位符 -->
        <div style="height: 40px;" />
        <el-option v-for="(item, index) in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
          <el-checkbox
            v-model="item.checked"
            class="amy-checkbox"
            :disabled="index === 0 || index === 1 ? true : false"
            style="display: block;"
            @change="checkedSelect($event, index, item.value)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-option>
      </el-select>
    </div>
    <el-button type="primary" style="margin-left: 20px;" size="medium" @click="searchClick">搜索</el-button>
  </div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      orderNo: '',
      options: [
        {
          value: 'matchCloth',
          label: '布类',
          checked: true,
          disabled: true
        },
        {
          value: 'matchYarnFineness',
          label: '纱支/细度',
          disabled: true,
          checked: true
        },
        {
          value: 'matchElementRatio',
          label: '成份',
          disabled: true
        },
        {
          value: 'matchSuggestWidth',
          label: '布封',
          disabled: true
        },
        {
          value: 'matchSuggestWeight',
          label: '克重',
          checked: false,
          disabled: true
        },
        {
          value: 'matchCustomerColor',
          label: '颜色',
          checked: false,
          disabled: true
        },
        {
          value: 'matchColorLevel',
          label: '色级',
          checked: false,
          disabled: true
        }
      ],
      checkedCities: ['matchCloth', 'matchYarnFineness'],
      checkAll: false,
      orderType: '', // 订单类型：B-大货，S-样板，R-备坯，C-补布
      techDetailId: '', // 针织工艺分录id
      count: {}
    }
  },

  methods: {

    checkedClick() {
      const array = this.checkedCities
      this.options.forEach(v => {
        // 判断没在则添加
        if (array.indexOf(v.value) === -1) {
          array.push(v.value)
        }
        v.checked = this.checkAll
      })
      if (!this.checkAll) {
        // 默认前两项不可更改
        this.options[0].checked = true
        this.options[1].checked = true
        this.checkedCities = ['matchCloth', 'matchYarnFineness']
      }
    },
    // 单选
    checkedSelect(e, index, id) {
      if (e) {
        this.checkedCities.push(this.options[index].value)
      } else {
        const index1 = this.checkedCities.indexOf(id)
        if (index1 > -1) {
          this.checkedCities.splice(index1, 1)
        }
      }
      // 判断是否勾全选

      if (this.checkedCities.length === this.options.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
      this.searchClick()
    },
    // 重置
    resetSelect() {
      this.checkedCities = []
      this.checkAll = false
      this.options.forEach(v => {
        v.checked = false
      })
      // 默认前两项不可更改
      this.options[0].checked = true
      this.options[1].checked = true
      this.checkedCities = ['matchCloth', 'matchYarnFineness']
    },
    // 点击单个清除关联选中
    deleteTag(e) {
      if (e === 'matchCloth' || e === 'matchYarnFineness') {
        this.checkedCities = ['matchCloth', 'matchYarnFineness']
        return false
      }
      const index1 = this.checkedCities.indexOf(e)
      if (index1 > -1) {
        this.checkedCities.splice(index1, 1)
      }
      this.options.forEach(v => {
        // 判断没在则添加
        if (v.value === e) {
          v.checked = false
        }
      })
      if (this.checkedCities.length === this.options.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
    },
    // 搜索表格
    searchClick() {
      // console.log(this.input, this.checkedCities)
      this.componentsOptions.searchClick({ checkedCities: this.checkedCities, orderNo: this.orderNo })
    }

  }
}
</script>

<style lang="scss" scoped>
.a-info-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}
.a-info-box {
  flex: 1;
  align-items: center;
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  .box-lab {
    width: 120px;
    position: relative;
    color: #666666;
    &::after {
      content: '';
      position: absolute;
      top: 0px;
      left: -14px;
      width: 1px;
      height: 15px;
      background-color: #d0d8e0;
    }
  }
  .el-input__inner {
    border: none !important;
  }
}
.checked-all {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666666;
  padding: 0 20px;
  height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeff0;
  padding-left: 10px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  background-color: #ffffff;
  .check-text {
    margin-left: 10px;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
  }
  .reset {
    margin-left: auto;
    color: #0986ff;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>
<style lang="scss">
.a-info-wrap {
  .el-input__inner {
    border: none !important;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
    content: ' ';
    display: none;
    font-size: 0 !important;
  }
}
.a-info-wrap /deep/ .el-select-dropdown__wrap {
  min-height: 320px;
}
.a-info-wrap /deep/ .el-select-dropdown__item:hover {
  background-color: #ffffff;
}
.amy-checkbox /deep/ .is-disabled .el-checkbox__inner {
  background-color: #1890ff !important;
  border-color: #1890ff !important;
}
.amy-checkbox.is-disabled /deep/ .el-checkbox__label {
  color: #1890ff !important;
}

.amy-checkbox /deep/ .el-checkbox__inner::after {
  border-color: #ffffff !important;
}
</style>
