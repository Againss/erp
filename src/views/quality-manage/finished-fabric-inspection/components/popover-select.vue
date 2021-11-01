<!--
 * @name: 选择提示弹框组件
 * @description: 选择提示弹框组件
 * @author: panmr
 * @time: 2021-06-22 16:51:57
-->
<template>
  <div>
    <span>{{ scope.row.opearationUserName }}</span>
    <el-popover v-if="scope.row.status === 0" v-model="popover" width="450" placement="top" trigger="click" @show="show">
      <div class="popper-class">
        <label>处理人:</label>
        <el-select v-model="batchColorUserObj" placeholder="输入文字模糊查询" filterable @visible-change="visibleChange">
          <el-option v-for="(item, index) in dataSource" :key="index" :value-key="item.value" :label="item.label" :value="item" />
        </el-select>
        <el-button v-loading="loading" type="primary" size="mini" style="margin-left: 10px" :title="batchColorUserObj.value ? '确认' : '请先选择处理人'" :disabled="!batchColorUserObj.value" @click="submit">确认</el-button>
        <el-button size="mini" @click="popover = false">取消</el-button>
      </div>
      <el-button v-if="isShow" slot="reference" style="float: right;border: 1px solid #0986FF;" type="primary" class="assign-button" plain size="mini">指派</el-button>
    </el-popover>
  </div>
</template>

<script>
import { qaFinishBatchColorAssign, outworkerList } from '../api/index'
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
      dataSource: []
    }
  },
  computed: {
    isShow() {
      return this.$permission(['qa:qaFinishFabricInspectionTask:assign'])
    }
  },
  mounted() {
  },
  methods: {
    show() {
      this.batchColorUserObj = {}
    },
    async visibleChange(flag) {
      if (flag) {
        const { code = 0, data = [] } = await outworkerList({ taskType: '2', enabled: 'Y', isSmsEnabled: 1 })
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
      const { code = 0 } = await qaFinishBatchColorAssign({ userId: this.batchColorUserObj.value, userName: this.batchColorUserObj.label, id: this.scope.row.id })
      if (code === 200) {
        this.popover = false
        this.$message({ message: '指派成功', type: 'success' })
        this.componentsOptions.callback()
        this.fetchLog(
          this.getLogMessages('UPDATE', '/qa/qaFinishFabricInspectionTask/assign', 'qa'),
          { id: this.scope.row.id },
          JSON.stringify({
            beforeText: `在"质量管理-成品检测-成品验布"指派成功一条记录`,
            beforeCode: { id: this.scope.row.id }
          }))
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
