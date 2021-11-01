<template>
  <div id="SetCondition">
    <div class="check-box">
      <el-select
        ref="check-select"
        v-model="checkResult"
        popper-class="check-select"
        multiple
        placeholder="请选择"
        @change="change"
        @visible-change="visibleChange"
      >
        <el-option
          v-for="(item, index) in checkOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <template>
            <span style="float: left">{{ item.label }}</span>
            <div
              v-if="index === checkOptions.length - 1"
              class="bottom-btn-wrap"
              @click.stop="
                () => {
                  return;
                }
              "
            >
              <div v-if="index === checkOptions.length - 1" class="bottom-btn">
                <el-button
                  @click.stop="
                    sub = true;
                    close();
                  "
                >确定</el-button>
                <el-button
                  @click.stop="
                    sub = false;
                    close();
                  "
                >取消</el-button>
              </div>
            </div>
          </template>
        </el-option>
      </el-select>
    </div>
    <el-form ref="ruleForm" :model="form" label-width="100px">
      <el-form-item
        v-for="(tip, index) in list"
        :key="index"
        :label="tip.param_1 | filterTest"
        :prop="'tip_' + index"
        class="list"
        :rules="[
          {
            required: true,
            trigger: 'change',
            validator: validateItem,
          },
        ]"
      >
        <el-select
          v-model="tip.condition_1"
          placeholder="请选择"
          class="chose-condition"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="tip.value" placeholder="请输入内容" />
        <el-button class="del" @click="del(tip, index)">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '@/views/system-settings/review-process/api/index.js'
export default {
  name: 'SetCondition',
  filters: {
    filterTest(val) {
      if (val) {
        const el = JSON.parse(val)
        return el.label
      }
    }
  },
  data() {
    var validateItem = (rule, value, callback) => {
      this.list.forEach((el) => {
        if (!el.param_1 || !el.condition_1 || !el.value) {
          callback(new Error('请补充全条件内容'))
        }
      })
      callback()
    }
    return {
      rules: {},
      list: [
        // {
        //   param: 1,
        //   testSelect: undefined,
        //   input: undefined
        // }
      ],
      options: [
        { label: '>', value: '{"label": ">", "value": 1 }' },
        { label: '>=', value: '{"label": ">=", "value": 2 }' },
        { label: '=', value: '{"label": "=", "value": 3 }' },
        { label: '<', value: '{"label": "<", "value": 4 }' },
        {
          label: '<=',
          value: '{"label": "<=", "value": 5 }'
        },
        {
          label: '><',
          value: '{"label": "><", "value": 6 }'
        }
      ],
      checkOptions: [],
      checkResult: [],
      validateItem,
      sub: false
    }
  },
  computed: {
    form() {
      return { list: this.list }
    }
  },
  created() {
    const formDatas = this.$attrs.options.formDatas.data
    this.list = formDatas.conditionList || []
    this.$attrs.options.componentsOptions.get(this.list)
    this.reset()
  },
  methods: {
    renderOptions() {
      return 124
    },
    del(obj, i) {
      this.list.splice(i, 1)
      this.checkResult.splice(i, 1)
    },
    change(val) {},
    async reset() {
      const res = await api.getParams()
      var data = []
      var arr1 = []
      if (res.code === 200) {
        data =
          res.data && res.data.list && res.data.list.length
            ? res.data.list
            : []
        data.length &&
          data.forEach((el) => {
            arr1.push({
              label: el.name,
              value: JSON.stringify({
                value: el.param,
                label: el.name
              })
            })
          })
      } else {
        data = []
      }
      arr1.length ? arr1.push({}) : ''
      this.checkOptions = arr1
      var arr = []
      this.list.length &&
        this.list.forEach((n) => {
          arr.push(n.param_1)
        })
      this.checkResult = arr
    },
    close() {
      this.$refs['check-select'].visible = false
    },
    submit() {
      var arr = []
      this.checkResult.length &&
        this.checkResult.forEach((n, index) => {
          if (n) {
            const i =
              this.list.length &&
              this.list.findIndex((el, index) => {
                return el.param_1 === n
              })
            if (i === -1 || !this.list.length) {
              arr.push({ param_1: n })
            } else {
              arr.push(this.list[i])
            }
          }
        })
      this.list = []
      this.list = arr
      this.$attrs.options.componentsOptions.get(this.list)
    },
    visibleChange(visible) {
      // select组件重新组装 监控触发其他处下拉隐藏
      // 提交时sub 为true 未点击时false
      if (visible) {
        this.sub = false
      } else {
        this.sub ? this.submit() : this.reset()
      }
    }
  }
}
</script>
<style lang="scss" >
#SetCondition {
  .check-box .el-select.el-select--medium {
    width: 100%;
    .el-input__inner {
      width: 100%;
    }
  }
  .el-input .el-input__inner {
    width: 200px;
  }
  .chose-condition.el-select .el-input__inner {
    width: 135px;
  }
  .el-form-item__content {
    display: flex;
  }
}
.check-select {
  .el-select-dropdown__wrap.el-scrollbar__wrap {
    .el-scrollbar__view.el-select-dropdown__list {
      :last-child.el-select-dropdown__item {
        // border: 1px solid blue;
        min-height: 70px;
        border-top: 1px solid #eeefef;
      }
      :last-child.el-select-dropdown__item:hover {
        background: #fff;
      }
    }
    .bottom-btn-wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .bottom-btn {
      position: absolute;
      bottom: 0;
      right: 50%;
      top: 50%;
      margin-right: -70px;
      margin-top: -17px;
    }
  }
}
</style>

<style lang="scss" scoped>
#SetCondition {
  .list {
    margin-top: 28px;
    // display: flex;
    margin-left: 10px;
    margin-right: 10px;
    .chose-condition {
      margin: 0 10px;
    }
    .param {
      color: #151222;
      font-size: 14px;
      line-height: 36px;
    }
    .del {
      margin-left: 20px;
    }
  }
}
</style>

