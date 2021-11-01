<!--
 * @Date: 2020-11-04 10:09:09
 * @Author: Againss
 * @LastEditTime: 2021-06-24 09:54:27
 * @LastEditors: zhengjin
 * @Descripttion: 染色信息部分
-->
<template>
  <el-form
    ref="form"
    class="el-form"
    :model="form"
    :class="{ 'is-edit': isEdit }"
  >
    <el-form-item
      prop="bdDyeTypeUuid"
      :label="'染色类型' + ((isEdit && dataSource === 2) || !isEdit ? '：' : '')"
      :rules="hasRule ? null : [$getRules({ trigger: ['change'] })]"
    >
      <span
        v-if="(isEdit && dataSource === 2) || !isEdit"
        class="text-ell"
        :title="getDey"
      >{{ getDey || "-" }}
      </span>
      <el-select
        v-else
        v-model="form.bdDyeTypeUuid"
        class="select"
        filterable
        placeholder="请选择"
        @change="chengeHandler"
      >
        <el-option
          v-for="item in options"
          :key="item.uuid"
          :label="item.name"
          :value="item.uuid"
        />
      </el-select>
    </el-form-item>
    <div class="list">
      <div
        v-for="(item, index) in form.list"
        :key="
          index + '-' + form.bdDyeTypeUuid + order.colorPlateTypeValue
        "
        class="item-li"
      >
        <el-form-item
          :label="'染料类型' + (!isEdit ? '：' : '')"
          :rules="hasRule ? null : rules"
          :prop="`list.${index}.dyestuffAssistTypeUuid`"
        >
          <div :id="'dyestuffAssistType' + index" style="width: 170px">
            <span
              v-if="!isEdit"
              class="text-ell"
              :title="item.dyestuffAssistType && item.dyestuffAssistType.name"
            >{{
              (item.dyestuffAssistType && item.dyestuffAssistType.name) || "-"
            }}
            </span>
            <select-search
              v-else
              :select-ele="'dyestuffAssistType' + index"
              :name="index + '.dyestuffAssistType'"
              search-value="name"
              api-url="color/api/colorBd/dyestuffAssistType/all"
              :multiple="false"
              options-label="name"
              options-value="uuid"
              options-key="uuid"
              request-format="list"
              request-mode="post"
              :select-value="item.dyestuffAssistType.name"
              placeholder="请选择染料类型"
              @changeSelectVal="changeSelectVal($event)"
            />
          </div>
        </el-form-item>
        <el-form-item
          :label="'色系' + (!isEdit ? '：' : '')"
          :rules="hasRule ? null : [$getRules({ trigger: ['change'] })]"
          :prop="`list.${index}.colorSystemUuid`"
        >
          <div :id="'colorSystem' + index" style="width: 170px">
            <span
              v-if="!isEdit"
              class="text-ell"
              :title="item.colorSystem.name"
            >{{ item.colorSystem.name || "-" }}
            </span>
            <select-search
              v-else
              :select-ele="'colorSystem' + index"
              :name="index + '.colorSystem'"
              search-value="name"
              api-url="color/api/colorBd/colorSystem/all"
              options-label="name"
              options-value="uuid"
              options-key="uuid"
              request-format="list"
              request-mode="post"
              :select-value="item.colorSystem.name"
              placeholder="请选择色系"
              @changeSelectVal="changeSelectVal($event)"
            />
          </div>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import selectSearch from '@/views/product-center/components/select'
import { DyeList } from '../api'
export default {
  components: { selectSearch },
  props: {
    order: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    dataSource: {
      type: Number
    }
  },
  data() {
    // const options = [
    //   { id: 1, name: '单染' },
    //   { id: 2, name: '双染' },
    //   { id: 3, name: '三染' },
    //   { id: 4, name: '四染' }
    // ]
    const validatePass = (rule, value, callback) => {
      const flag = this.form.list.filter(item => {
        return item.dyestuffAssistTypeUuid === value
      })
      if (!value) {
        callback(new Error('此项不能为空'))
      } else if (flag && flag.length > 1) {
        callback(new Error('染料类型必须单一'))
      } else {
        callback()
      }
    }
    return {
      options: [],
      hasRule: false,
      form: {
        bdDyeTypeUuid: '',
        DyeNum: 0,
        list: []
      },
      rules: [
        { validator: validatePass, trigger: 'change' },
        { required: true, message: '请选择', trigger: ['change'] }

      ]
    }
  },
  computed: {
    getDey() {
      const re = this.options.find(item => {
        return item.uuid === this.order.bdDyeTypeUuid
      })
      return re && re.name || this.order.dyeType && this.order.dyeType.name || ''
    }
  },
  watch: {
    // 'order.colorManageDye': function (val) {
    //   this.form.bdDyeTypeUuid = this.order.bdDyeTypeUuid || ''
    //   this.form.list = this.order.colorManageDye.length && this.order.colorManageDye || this.order.bdDyeTypeUuid && Array(this.order.bdDyeTypeUuid).fill('n').map(item => { return { dyestuffAssistTypeUuid: '', dyestuffAssistType: {}, colorSystemUuid: '', colorSystem: {} } })
    // },
    // 'order.bdDyeTypeUuid': function (val) {
    //   if (!this.form.bdDyeTypeUuid && val) {
    //     this.form.bdDyeTypeUuid = val
    //     this.form.list = this.order.colorManageDye
    //   }
    // },
    order: {
      handler: function(nval, oval) {
        if (this.order.colorPlateTypeValue === '花灰纱') {
          this.$refs.form.clearValidate()
          this.hasRule = true
        } else {
          if (this.hasRule) {
            this.hasRule = false
          }
        }
      }, deep: true
    }
  },
  async created() {
    await this.getOptions()
    this.form.bdDyeTypeUuid = this.order.bdDyeTypeUuid || ''
    this.setDyeNum(this.order.bdDyeTypeUuid)
    this.form.list = this.order.colorManageDye.length && this.order.colorManageDye || this.form.DyeNum && Array(this.form.DyeNum).fill('n').map(item => { return { dyestuffAssistTypeUuid: '', dyestuffAssistType: {}, colorSystemUuid: '', colorSystem: {}} })
  },
  methods: {
    // 获取染色类型下拉数据
    async getOptions() {
      const res = await DyeList({ 'bdDyeTypeUuid': this.order.colorPlateTypeUuid })
      if (res.code === 200) {
        this.options = res.data
      }
    },
    getsingleDoubleDye(uuid) {
      const re = this.options.find(item => {
        return item.uuid === uuid
      })
      return re || ''
      // return re && re.value || ''
    },
    setDyeNum(uuid) {
      if (this.getsingleDoubleDye(uuid)) {
        const rs = this.getsingleDoubleDye(uuid)
        this.form.DyeNum = rs.singleDoubleDyeObj.value
        // switch (this.getsingleDoubleDye(uuid)) {
        //   case '单染':
        //     this.form.DyeNum = 1
        //     break; case '双染':
        //     this.form.DyeNum = 2
        //     break; case '三染':
        //     this.form.DyeNum = 3
        //     break; case '四染':
        //     this.form.DyeNum = 4
        //     break
        //   default: this.form.DyeNum = 0
        //     break
        // }
      } else {
        this.form.DyeNum = 0
      }
    },
    // 染色类型change
    chengeHandler(val) {
      this.setDyeNum(val)
      if (this.form.DyeNum) {
        this.form.list = Array(this.form.DyeNum).fill('n').map(item => { return { dyestuffAssistTypeUuid: '', dyestuffAssistType: {}, colorSystemUuid: '', colorSystem: {}} })
      } else {
        this.form.list = []
      }
      this.$refs.form.clearValidate()
      this.$emit('change', this.form)
    },
    changeSelectVal(data) {
      const arr = data.name.split('.')
      this.form.list[arr[0]][arr[1]] = data.data
      this.form.list[arr[0]][arr[1] + 'Uuid'] = data.data.uuid
      this.$emit('change', this.form)
      // console.log(this.form, '染色数据')
    }
  }

}
</script>

<style lang="scss" scoped>
.el-form {
  width: 100%;
  display: flex;
  flex-flow: wrap;
  flex-direction: column;
  /deep/.el-form-item {
    .el-form-item__label {
      width: 130px;
      font-weight: 400;
      font-size: 14px;
      line-height: 30px;
      color: #888e9e;
    }
    .el-form-item__content {
      width: 170px;
      line-height: 30px;
    }
    .el-form-item__label:before {
      content: "";
    }
    .select {
      width: 538px;
    }
    width: 300px;
    margin-bottom: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-input,
    .el-select,
    .el-input.is-disabled .el-input__inner {
      color: #777474;
    }
  }
  .list {
    margin-left: 0px;
  }
}
.is-edit {
  /deep/.el-form-item {
    margin-bottom: 24px;
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
  .list {
    margin-left: 70px;
  }
}
%ell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.text-ell {
  display: block;
  max-width: 170px;
  @extend %ell;
}
.disabled {
  /deep/.el-icon-arrow-up::before {
    content: "" !important;
  }
}
.item-li {
  display: flex;
}
</style>
