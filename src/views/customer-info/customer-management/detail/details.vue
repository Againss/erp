<!--
 * @Description: 客户信息详情
 * @Autor: zhengjin
 * @Date: 2021-07-26 17:37:12
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-09 10:01:57
-->

<template>
  <div class="customerInfo">
    <el-tabs v-model="activeName" class="puactive_class" @tab-click="handleClick">
      <el-tab-pane v-for="(val,key) in lsit" :key="key" :name="val.value">
        <span slot="label" :tabindex="val.value" class="labelIndex">{{ `${val.label}` }}</span>
      </el-tab-pane>
    </el-tabs>
    <component
      :is="getComponent"
      :ref="getComponent"
      :is-edit="isEdit"
      :type="activeName"
      :cancel="close"
    />
    <div
      :key="activeName"
      v-permission="power"
      class="btn-groups"
      :class="{'btn-groups--expanded': !sideBarExpanded}"
    >
      <div class="btn">
        <el-button v-if="!isEdit" type="primary" @click="Edit">编辑</el-button>
        <el-button v-if="isEdit && activeName !== '2'" type="primary" @click="submitForm">保存</el-button>
        <el-button v-if="isEdit" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import enterpriseInfo from './enterprise/index.vue'
import receiptItem from './receipt/index.vue'
import ruleStringItem from './rule-string/index.vue'
import PlateMaking from './plate-making/index'

export default {
  // name: 'CustomerDetails',
  components: {
    enterpriseInfo,
    receiptItem,
    ruleStringItem,
    PlateMaking
  },
  data() {
    const lsit = [
      {
        label: '企业信息',
        value: '1'
      },
      {
        label: '收件地址',
        value: '2'
      },
      {
        label: '制板要求',
        value: '3'
      },
      {
        label: '规则设置',
        value: '4'
      }
    ]
    return {
      isEdit: false,
      lsit,
      activeName: '1'
    }
  },
  computed: {
    sideBarExpanded() {
      return this.$store.state.app.sidebar.opened
    },
    getComponent() {
      const type = this.activeName
      let itemType = ''
      switch (type) {
        case '1':
          itemType = enterpriseInfo
          break
        case '2':
          itemType = receiptItem
          break
        case '3':
          itemType = PlateMaking // 制版要求
          break
        case '4':
          itemType = ruleStringItem
          break
        default:
          console.log('99999999999')
      }
      return itemType
    },
    power() {
      let list = []
      switch (this.activeName) {
        case '1':
          list = [
            'customer:detail:add'
          ]
          break
        case '2':
          list = [
            'customer:address:list',
            'customer:address:add'
          ]
          break
        case '3':
          list = [
            'customer:template:manager:save'
          ]
          break
        case '4':
          list = [
            'customer:rule:setting:list',
            'customer:rule:setting:add'
          ]
          break
        default:
          break
      }
      return list
    }
  },
  created() {
    this.customerId = this.$route.params.id
  },
  methods: {
    handleClick(e) {
      console.log(e.name, 'tabs')
      this.activeName = e.name
      this.$set(this, 'isEdit', false)
    },
    Edit() {
      this.$set(this, 'isEdit', true)
    },
    async cancel() {
      this.$set(this, 'isEdit', false)
      switch (this.activeName) {
        case '1':
          await this.$refs[this.getComponent].getEnterprise()
          break
        case '3':
          break
        case '4':
          await this.$refs[this.getComponent].getRuleString()
          break
        default:
          break
      }
    },
    async submitForm() {
      console.log('提交', this.$refs[this.getComponent])
      switch (this.activeName) {
        case '1':
          await this.$refs[this.getComponent].submint()
          break
        case '3':
          break
        case '4':
          await this.$refs[this.getComponent].submint()
          break
        default:
          break
      }
    },
    close() {
      this.$set(this, 'isEdit', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.customerInfo{
  position: relative;
  background-color: #fff;
  margin: 20px 20px 70px 20px;
  ::v-deep
  .el-tabs__header {
    margin: 0;
    .el-tabs__nav-wrap {
      padding: 0 20px 0 0;
      .el-tabs__item {
        height: 62px;
        line-height: 62px;
        font-size: 14px;
        padding: 0;
        // color: #44494C;
        .labelIndex {
          outline: none;
          padding: 0 20px;
        }
      }
    }
    ::after {
      height: 1px;
    }
  }
  .btn-groups {
    bottom: 0;
    right: 0;
    z-index: 200; /* 改动时注意，制版要求单独维护了一个操作按钮栏btn-group覆盖这里，z-index层级要低于它 */
    padding: 10px;
    width: calc(100% - 210px);
    background: #fff;
    border-top: 1px solid #ecf0f3;
    position: fixed;
    transition: width 0.28s;

    .btn {
      display: inline-block;
      position: relative;
      left: 48%;
      transform: translateX(-50%);
    }

    &--expanded {
      width: calc(100% - 54px);
    }
  }
}
// .active {
//   margin-bottom: 70px;
// }
</style>
