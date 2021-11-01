<!--
 * @Author: zhushuiliang
 * @Description:
 * @Date: 2021-03-12 14:46:31
 * @LastEditors: zhushuiliang
 * @LastEditTime: 2021-03-31 11:18:20
-->
<template>
  <div class="edit-pop">
    <el-dialog
      :title="popOptions.title"
      :visible.sync="popOptions.visible"
      :width="'400px'"
      @close="handleClose"
    >
      <el-radio-group
        v-model="editData.groupId"
        class="pop-radio-group"
        @input="checkGroup"
      >
        <el-radio
          v-for="(item) in tempGroupList"
          :key="item.groupId"
          :label="item.groupId + ''"
          border
        >{{ item.groupName.replace(/ /g, '&nbsp;') }}</el-radio>
      </el-radio-group>
      <el-form
        ref="popForm"
        :model="formData"
        :rules="rules"
      >
        <el-form-item prop="groupName">
          <el-input
            v-show="popOptions.ifAdd"
            v-model="formData.groupName"
            placeholder="请输入分组名称"
            autofocus
            maxlength="20"
            class="pop-input"
          >
            <div slot="suffix">
              <el-button
                type="text"
                @click="addFn"
              >取消</el-button>
              <el-button
                type="text"
                class="pop-input-btn"
                @click="saveFn"
              >保存</el-button>
            </div>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="pop-btns">
        <el-button @click="addFn">新增分组</el-button>
        <div class="pop-btns-right">
          <el-button @click="cancelFn">取消</el-button>
          <el-button
            type="primary"
            @click="submitFn"
          >确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addGroup, getWorkflowGroup, moveGroup } from '../api/index'
import { fetchLog } from '@/views/system-settings/common/fetchLog'
export default {
  name: 'EditPop',
  mixins: [fetchLog],
  props: {
    editData: {
      type: Object,
      default: () => {
        return {
          groupId: ''
        }
      }
    },
    popOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    groupList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    const checkGroup = (rule, value, callback) => {
      for (let i = 0; i < this.tempGroupList.length; i++) {
        if (value === this.tempGroupList[i].groupName || value === '已停用') {
          return callback(new Error('分组名称重复'))
        }
      }
      callback()
    }
    return {
      tempGroupList: [],
      oldForm: {},
      ifChange: false, // 数据是否有更新
      formData: {
        groupName: ''
      },
      rules: {
        groupName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { validator: checkGroup, trigger: 'blur' },
          { max: 20, message: '分组名称不能超过20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    groupList: {
      handler(val) {
        this.tempGroupList = val
      }
    },
    editData: {
      handler(val) {
        if (!this.oldForm.hasOwnProperty('id')) {
          this.oldForm = { ...val }
        }
      }
    }
  },
  mounted() { },
  methods: {
    // 新增分组
    addFn() {
      this.type = 'add'
      this.$set(this.popOptions, 'ifAdd', !this.popOptions.ifAdd)
      if (this.popOptions.ifAdd) {
        return
      } else {
        this.$refs.popForm.resetFields()
      }
    },
    // 保存新增分组
    saveFn() {
      // this.editData.group 是新增的
      console.log(this.$refs.popForm)
      this.$refs.popForm.validate(async(valid) => {
        if (valid) {
          await addGroup({ groupName: this.formData.groupName })
          this.getGroupList()
          this.fetchLog(
            this.getLogMessages('INSERT', '/workflowGroup/add'),
            { groupName: this.formData.groupName },
            JSON.stringify({
              beforeText: `在'系统设置-审核流程-流程分组,新增一条记录`,
              beforeCode: { groupName: this.formData.groupName }
            })
          )
          // this.addGroup({ name: this.editData.name });
          // 新增分组成功后修改相应数据
          this.$set(this.popOptions, 'ifAdd', false)
          this.$set(this.formData, 'groupName', '')
          this.ifChange = true
        } else {
          return false
        }
      })
    },
    // 新增后获取列表
    async getGroupList() {
      const res = await getWorkflowGroup()
      this.tempGroupList = (res.data && res.data.list) || []
      this.tempGroupList.reverse()
    },
    // 确定移动分组 保存数据
    async submitFn() {
      const params = {
        workflowId: this.editData.workflowId,
        groupId: this.editData.groupId
      }
      const res = await moveGroup({
        ...params
      })
      this.ifChange = true
      const { beforeCode, afterCode } = this.compareData(
        this.oldForm,
        params,
        'workflowId'
      )
      const flag =
        JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag &&
        this.fetchLog(
          this.getLogMessages('UPDATE', '/workflow/moveGroup'),
          params,
          JSON.stringify({
            beforeText: `在'系统设置-审核流程-流程分组,将${JSON.stringify(
              { id: params.workflowId }
            )}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
      this.dataSource = (res.data && res.data.list) || []
      console.log(res)
      this.cancelFn()
    },
    // 隐藏
    cancelFn() {
      this.oldForm = {}
      if (this.ifChange) {
        this.$emit('updateList')
      }
      this.$set(this.popOptions, 'visible', false)
    },
    // 点击radio隐藏新增分组输入框
    checkGroup(val) {
      if (val && this.popOptions.ifAdd) {
        this.$set(this.popOptions, 'ifAdd', false)
        this.$refs.popForm.resetFields()
        // this.editData.group = val;
      }
    },
    handleClose() {
      this.$refs.popForm.resetFields()
    }
  }
}
</script>

<style lang="scss">
.edit-pop {
  .pop-radio-group {
    display: flex;
    flex-direction: column;
    .el-radio {
      margin: 0 !important;
      margin-bottom: 15px !important;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .pop-input {
    .pop-input-btn {
      padding-right: 5px;
      margin-left: 0px;
      &::before {
        content: "";
        height: 15px;
        width: 1px;
        display: inline-block;
        background: #ccc;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .el-input__inner {
      padding-right: 85px;
    }
  }

  .pop-btns {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    // .pop-btns-right {

    // }
  }
}
</style>
