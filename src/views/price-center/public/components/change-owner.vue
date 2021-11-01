<template>
  <div class="change-owner">
    <el-button type="primary" @click="changeOwner">更改所有人</el-button>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCrm } from '@/views/price-center/public/index'
// import { sysUserPage } from '../api/index.js'
export default {
  mixins: [PublicCrm],
  props: {
    visible: {
      type: Boolean
      // default: 'hi'
    },
    okClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 远程搜索
    const remoteSearch = value => {
      // debugger
      // console.log(value)
      if (value === '') {
        this.$set(this.OwnerPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData) {
          this.getData = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData({ realName: value, name: value }, 0)
      }
    }
    // pop弹出框配置信息
    const OwnerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: this.okClick,
      cancel: params => {
        // this.PopDialogHandle()
        this.$emit('visibleClick', false)
        // this.$set(this.OwnerPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'follower',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: remoteSearch,
          loading: false,
          rules: [commonBlurReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '用户',
          dataSource: [],
          placeholder: '查找用户'
        }
      ]
    }
    return {
      OwnerPopOptions
    }
  },
  watch: {
    visible: {
      handler(v) {
        console.log(v)
        this.$set(this.OwnerPopOptions, 'visible', v)
      }
    },
    deep: true,
    immediate: true
  },
  created() {
    // console.log('111', this.PrimaryKey)
  },
  methods: {
    // 打开弹出框
    changeOwner() {
      this.$emit('visibleClick', true)
      // console.log(this.OwnerPopOptions)
      // this.$set(this.OwnerPopOptions, 'visible', true)
    }
  }
}
</script>

<style lang='scss'>
.change-owner {
    margin: 0 10px;
}
</style>
