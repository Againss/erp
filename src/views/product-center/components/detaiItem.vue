<!--
 * @Date: 2020-09-28 11:00:58
 * @Author: Againss
 * @LastEditTime: 2021-07-19 19:41:04
 * @LastEditors: zhengjin
 * @Descripttion:
-->
<template>
  <div class="form">
    <el-form
      ref="form"
      :class="{ 'is-edit': isEdit }"
      class="el-form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        v-for="(item, index) in formData"
        :key="index"
        :style="item.style"
        :prop="item.leftPart ? item.leftPart.name : item.name"
        :label="item.label + (!isEdit || item.notEdit ? '：' : '')"
      >
        <!-- <el-input
          v-if="!isEdit || item.notEdit"
          disabled
          :value="getShowValue(item)"
          :title="getShowValue(item)"
        /> -->
        <div v-if="!isEdit || item.notEdit">
          <div v-if="item.showComponent">
            <component
              :is="component"
              v-for="(component, key) in item.showComponent"
              :key="key + index"
              :data="order"
              :value="form[item.name]"
              :options="item"
            />
          </div>
          <span
            v-else
            class="text-ell"
            :style="item.showStyle"
            :title="item.isJac ? getShowValue(item) + '-' + order.jacquardNonColorName : getShowValue(item)"
            @click="item.showclick ? item.showclick() : Handler(3)"
          >{{ item.isJac ? (getShowValue(item) + '-' + order.jacquardNonColorName) : (getShowValue(item) || "-" ) }}
          </span>
        </div>
        <template v-else-if="item.components && Object.keys(item.components).length">
          <component
            :is="component"
            v-for="(component, key) in item.components"
            :key="key + index"
            :is-edit="isEdit"
            :components-options="item.componentsOptions"
            :value="form[item.name]"
            :options="item"
          />
        </template>
        <div v-else>
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            :ref="item.name"
            v-model.trim="form[item.name]"
            :title="form[item.name]"
            :maxlength="item.maxlength"
            :disabled="item.disabled"
            :type="item.inputType ? item.inputType : 'text'"
            :placeholder="item.placeholder"
            @input="item.changeHandler ? item.changeHandler($event) : Handler(0)"
            @blur="item.blurHandler ? item.blurHandler($event) : Handler(0)"
          />
          <!-- 分页搜索下拉 -->
          <div
            v-if="item.type === 'select-search'"
            :id="item.name"
            style="width: 170px"
          >
            <select-search
              :select-ele="item.name"
              :name="item.name"
              :search-value="item.searchValue ? item.searchValue : 'name'"
              :api-url="item.apiUrl"
              :multiple="item.multiple ? item.multiple : false"
              :value-key="item.valueKey ? item.valueKey : 'name'"
              :options-label="item.optionsLabel"
              :options-value="item.optionsValue"
              :options-key="item.optionsKey"
              :request-param="item.requestParam"
              :select-value="form[item.name]"
              :request-format="item.requestFormat"
              :request-mode="item.requestMode"
              :placeholder="item.placeholder"
              :filterable="item.filterable"
              :disabled="item.disabled"
              :clearable="item.clearable"
              :popper-append-to-body="item.popperAppendToBody"
              :popper-class="item.popperClass"
              :is-slot="item.isSlot"
              @changeSelectVal="item.changeSelectVal ? item.changeSelectVal($event) : changeSelectVal($event)"
              @visibleChange="item.visibleChange ? item.visibleChange($event) : visibleChange($event)"
            />
          </div>
          <!-- 分页搜索下拉 -->
          <!-- 普通下拉 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.name]"
            :value-key="item.valueKey ? item.valueKey : 'name'"
            :multiple="item.multiple ? item.multiple : false"
            :disabled="item.disabled"
            :class="[{ disabled: item.disabled }]"
            filterable
            :placeholder="item.placeholder"
            @focus="item.focusHandler ? item.focusHandler($event) : Handler(1)"
            @change="item.changeHandler ? item.changeHandler($event) : Handler(2)"
          >
            <el-option
              v-for="el in item.options"
              :key="item.optionsKey ? el[item.optionsKey] : el.id"
              :disabled="item.disabled ? el[item.disabled] : false"
              :label="item.optionsLabel ? el[item.optionsLabel] : el.name"
              :value="item.optionsValue ? el[item.optionsValue] : el"
            />
          </el-select>
          <!-- 普通下拉 -->
          <!-- 左右结构 目前只有一种 之后有其他再优化 -->
          <div v-if="item.type === 'mutInput'" class="mutInput">
            <!-- 左边是输入框 -->
            <el-input
              v-if="item.leftPart.type === 'input'"
              v-model.trim="form[item.leftPart.name]"
              class="left"
              :type="item.leftPart.inputType ? item.leftPart.inputType : 'text'"
              :placeholder="item.leftPart.placeholder"
              @blur="
                item.leftPart.blurHandler
                  ? item.leftPart.blurHandler($event)
                  : Handler(3)
              "
              @focus="
                item.leftPart.focusHandler
                  ? item.leftPart.focusHandler($event)
                  : Handler(1)
              "
              @input="
                item.leftPart.changeHandler
                  ? item.leftPart.changeHandler($event)
                  : Handler(2)
              "
            >
              <!-- 右边是固定字体 -->
              <template
                v-if="item.rightPart.isText"
                slot="append"
                class="right"
                :style="item.rightPart.style || ''"
                @click.stop="
                  item.rightPart.changeHandler && item.rightPart.changeHandler()
                "
              >{{ item.rightPart.value }}</template>
              <!-- 右边是普通下拉 -->
              <el-select
                v-if="item.rightPart.type === 'select'"
                slot="append"
                v-model="form[item.rightPart.name]"
                class="right"
                filterable
                placeholder="请选择"
                @focus="
                  item.rightPart.focusHandler
                    ? item.rightPart.focusHandler($event)
                    : Handler(1)
                "
                @change="
                  item.rightPart.changeHandler
                    ? item.rightPart.changeHandler($event)
                    : Handler(2)
                "
                @visible-change="
                  item.rightPart.visibleChange
                    ? item.rightPart.visibleChange($event)
                    : ''
                "
              >
                <el-option
                  v-for="el in item.rightPart.options"
                  :key="
                    item.rightPart.optionsKey
                      ? el[item.rightPart.optionsKey]
                      : el.id
                  "
                  :label="
                    item.rightPart.optionsLabel
                      ? el[item.rightPart.optionsLabel]
                      : el.name
                  "
                  :value="
                    item.rightPart.optionsValue
                      ? el[item.rightPart.optionsValue]
                      : el
                  "
                />
              </el-select>
            </el-input>
          </div>
          <!-- 左右结构 -->
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import selectSearch from '@/views/product-center/components/select'
export default {
  components: { selectSearch },
  props: {
    // 必填校验
    rules: {
      type: Object
    },
    // 字段信息
    formData: {
      type: Array
    },
    // 数据信息
    order: {
      type: Object
    },
    // 是否是编辑状态
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {}
    }
  },
  watch: {
    order: {
      handler(newVal) {
        const obj = {}
        // 初始化表单
        for (const val of this.formData) {
          if (val.leftPart) {
            // 左右结构情况
            obj[val.leftPart.name] = (newVal[val.leftPart.name]
              ? newVal[val.leftPart.name]
              : this.form[val.name]) || ''
            if (val.rightPart && !val.rightPart.isText) {
              obj[val.rightPart.name] = (newVal[val.rightPart.name]
                ? newVal[val.rightPart.name]
                : this.form[val.name]) || ''
            }
          } else {
            obj[val.name] =
              newVal[val.name] || newVal[val.name] === 0
                ? newVal[val.name]
                : this.form[val.name]
          }
        }
        this.form = obj
      },
      deep: true
    }
  },
  created() {
    const obj = {}
    // 初始化表单
    for (const val of this.formData) {
      if (val.leftPart) {
        // 左右结构情况
        obj[val.leftPart.name] = this.order[val.leftPart.name]
          ? this.order[val.leftPart.name]
          : ''
        if (val.rightPart && !val.rightPart.isText) {
          obj[val.rightPart.name] = this.order[val.rightPart.name]
            ? this.order[val.rightPart.name]
            : ''
        }
      } else {
        obj[val.name] =
          this.order[val.name] || this.order[val.name] === 0
            ? this.order[val.name]
            : ''
      }
    }
    this.form = obj
  },
  methods: {
    // 非编辑状态显示
    getShowValue(item) {
      if (item.showValue) {
        const arr = item.showValue.split('.')
        if (arr.length > 1) {
          let result = JSON.parse(JSON.stringify(this.order))
          for (const ite of arr) {
            if (result[ite]) {
              result = result[ite]
            } else {
              result = ''
              break
            }
          }
          return result
        }
      }
      return this.order[item.showValue ? item.showValue : item.name]
    },
    changeSelectVal(data) {
      this.form[data.name] = data.data
    },
    visibleChange(e) {
      // console.log(e)
    },
    Handler(t) {
      // console.log("ppp", t);
    },
    // 重置from数据
    resetData(params) {
      this.form = { ...this.form, ...params }
    }
  }
}
</script>

<style lang="scss" scoped>
%ell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.form {
  /deep/ .el-input-group__append, .el-input-group__prepend {
      background: #fff;
      padding: 0 12px;
  }
  width: 100%;
  .el-form {
    width: 100%;
    display: flex;
    flex-flow: wrap;
    /deep/.el-form-item {
      .el-form-item__label {
        width: 130px;
        font-weight: 400;
        font-size: 14px;
        line-height: 30px;
        color: #888e9e;
      }
      .el-form-item__content {
        // width: 170px;
        flex: 1;
        line-height: 30px;
      }
      .el-form-item__label:before {
        content: "";
      }
      color: #474747;
      width: 300px;
      padding-left: 10px;
      margin-bottom: 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-input,
      .radio,
      .el-select,
      .el-textarea {
        width: 170px;
      }
      .right {
        .el-input {
          width: 70px !important;
        }
        text-align: center;
        width: 70px !important;
      }
      .el-input.is-disabled .el-input__inner {
        color: #777474;
      }
    }
  }
  /deep/.el-select__tags-text {
    float: left;
    max-width: 98px;
    @extend %ell;
  }
  .is-edit {
    /deep/.el-form-item {
      margin-bottom: 18px;
      .el-form-item__content,
      .el-form-item__label {
        line-height: 36px;
      }
    }
    /deep/.is-required.el-form-item {
      .el-form-item__label:before {
        content: "*";
      }
    }
  }
}
.text-ell {
  display: block;
  max-width: 160px;
  @extend %ell;
}
.disabled {
  /deep/.el-icon-arrow-up::before {
    content: "" !important;
  }
}
</style>
