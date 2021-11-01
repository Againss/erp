<template>
  <div class="btn">
    <!--
      待处理状态：0 显示【保存 提交 取消按钮】
      处理中状态：1 显示【编辑/提交】
      审核中状态：2 显示【审核】
      已处理状态：3 显示【无】
      -->
    <!--  待处理状态：0 显示【保存 提交 取消按钮】  -->
    <div>
      <el-button v-if="modify_isShow" type="primary" @click="doEdit">编辑</el-button>
      <el-button v-if="submit_isShow" :type="isEdit ? 'primary': ''" @click="doSubmit">提交</el-button>
      <el-button v-if="save_isShow" @click="doSave">保存</el-button>
      <el-button v-if="audit_isShow" type="primary" @click="doExamine">审核</el-button>
      <el-button v-if="isEdit" @click="doCancel">取消</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>

export default {
  components: { },
  props: {
    data: {
      type: Object,
      default: () => ({
        informations: []
      })
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userId: ''
    }
  },
  computed: {
    modify_isShow() { // 编辑
      return !this.isEdit && [0, 1].includes(this.data.status) && this.$permission(['qa:qaFinishBatchColor:modify']) && (this.userId === this.data.batchColorUserId)
    },
    submit_isShow() { // 提交
      return [0, 1].includes(this.data.status) && this.$permission(['qa:qaFinishBatchColor:exchange']) && (this.userId === this.data.batchColorUserId)
    },
    save_isShow() { // 保存
      return this.isEdit && [0, 1].includes(this.data.status) && (this.data.informations ? (this.data.informations.length ? this.data.informations[this.data.informations.length - 1].batchColorResult === 0 : false) : false) && this.$permission(['qa:qaFinishBatchColor:modify']) && (this.userId === this.data.batchColorUserId)
    },
    audit_isShow() { // 审核
      return [2].includes(this.data.status) && this.$permission(['qa:qaFinishBatchColor:review'])
    }
  },
  created() {
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    this.userId = userInfo.userId
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 编辑
    doEdit() {
      this.$emit('doEdit', !this.isEdit)
    },
    // 提交
    doSubmit() {
      this.$emit('doSubmit', !this.isEdit)
    },
    // 保存
    doSave() {
      this.$emit('doSave', !this.isEdit)
    },
    // 审核
    doExamine() {
      this.$emit('doExamine', !this.isEdit)
    },
    // 取消
    doCancel() {
      this.$emit('doCancel', !this.isEdit)
    }
  }
}
</script>

<style lang="scss" scoped>
.status-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 16px;
  .detail-code {
    font-size: 18px;
    color: #151222;
  }
  .copy-code {
    font-size: 12px;
    color: #777777;
  }
  .detail-info {
    font-size: 12px;
    color: #666666;
    span {
      margin-right: 10px;
    }
  }
}
</style>
