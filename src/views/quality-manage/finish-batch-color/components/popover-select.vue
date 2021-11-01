<!--
 * @name: 选择提示弹框组件
 * @description: 选择提示弹框组件
 * @author: panmr
 * @time: 2021-06-22 16:51:57
-->
<template>
  <div>
    <span>{{ scope.row.batchColorUser }}</span>
    <el-popover v-if="isShow" v-model="popover" width="450" placement="top" trigger="click" @show="show">
      <div class="popper-class">
        <label>处理人:</label>
        <el-select v-model="batchColorUserObj" placeholder="输入文字模糊查询" filterable @visible-change="visibleChange">
          <el-option v-for="(item, index) in dataSource" :key="index" :value-key="item.value" :label="item.label" :value="item" />
        </el-select>
        <el-button v-loading="loading" type="primary" size="mini" style="margin-left: 10px" :title="batchColorUserObj.value ? '确认' : '请先选择处理人'" :disabled="!batchColorUserObj.value" @click="submit">确认</el-button>
        <el-button size="mini" @click="popover = false">取消</el-button>
      </div>
      <el-button slot="reference" style="float: right;border: 1px solid #0986FF;" class="assign-button" type="primary" plain size="mini">指派</el-button>
    </el-popover>
  </div>
</template>

<script>
import { qaFinishBatchColorAssign, qaFinishBatchColorAssignNoAuth, outworkerList } from '../api/index'
import logMethods from '@/views/product-center/mixin/log-methods'

export default {
  name: 'PopoverSelect',
  components: {},
  mixins: [logMethods],
  props: {
    scope: {
      type: Object,
      default: () => ({})
    },
    componentsOptions: {
      type: Object,
      default: () => ({
        callback: () => {}
      })
    }
  },
  data() {
    return {
      popover: false,
      loading: false,
      batchColorUserObj: {}, // 批色员对象
      dataSource: [],
      userId: '',
      realName: ''
    }
  },
  computed: {
    isShow() {
      return [0].includes(this.scope.row.status) && (this.$permission(['qa:qaFinishBatchColor:assign']) || (this.userId === this.scope.row.batchColorUserId || this.realName === this.scope.row.batchColorUser))
    }
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    this.userId = userInfo.userId
    this.realName = userInfo.realName
  },
  methods: {
    showPopover() {
      this.$nextTick(() => {
        this.popover = true
      })
    },
    show() {
      this.batchColorUserObj = {}
    },
    async visibleChange(flag) {
      if (flag) {
        const { code = 0, data = [] } = await outworkerList({ taskType: '3', enabled: 'Y', isSmsEnabled: 1 })
        if (code === 200) {
          this.dataSource = data.map(n => ({ value: n.sysUserUuid, label: n.realName })) || []
        }
      }
    },
    // 确认
    async submit() {
      if (this.batchColorUserObj && !this.batchColorUserObj.value) {
        this.$message({ message: '请选择处理人', type: 'warning' })
        return
      }
      this.loading = true
      if (this.$permission(['qa:qaFinishBatchColor:assign'])) {
        const { code = 0 } = await qaFinishBatchColorAssign({ batchColorUserId: this.batchColorUserObj.value, batchColorUser: this.batchColorUserObj.label, id: this.scope.row.id })
        if (code === 200) {
          this.popover = false
          this.$message({ message: '指派成功', type: 'success' })
          this.componentsOptions.callback()
          this.fetchLog(
            this.getLogMessages('UPDATE', '/qa/qaFinishBatchColor/assign', 'qa'),
            { id: this.scope.row.id },
            JSON.stringify({
              beforeText: `在"质量管理-成品检测-成品批色"指派成功一条记录`,
              beforeCode: { id: this.scope.row.id }
            }))
        }
      } else {
        const { code = 0 } = await qaFinishBatchColorAssignNoAuth({ batchColorUserId: this.batchColorUserObj.value, batchColorUser: this.batchColorUserObj.label, id: this.scope.row.id })
        if (code === 200) {
          this.popover = false
          this.$message({ message: '指派成功', type: 'success' })
          this.componentsOptions.callback()
          this.fetchLog(
            this.getLogMessages('UPDATE', '/qa/qaFinishBatchColor/assign', 'qa'),
            { id: this.scope.row.id },
            JSON.stringify({
              beforeText: `在"质量管理-成品检测-成品批色"指派成功一条记录`,
              beforeCode: { id: this.scope.row.id }
            }))
        }
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.popper-class {
  text-align: center;
}
/deep/ .el-input__inner {
  width: 200px;
}
.el-button--primary.is-plain {
  background: #fff;
  color: #1890ff;
}
.assign-button:hover {
  background: #e0efff;
  color: #008eff;
}
</style>
