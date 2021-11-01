<template>
  <div>
    <div class="finished-fabric-inspection-detail">
      <!--  状态栏  -->
      <status-bar ref="statusBar" :data="data" />
      <!--  基础信息  -->
      <base-info ref="baseInfo" :data="data" />
      <!--  验布信息  -->
      <inspection-fabric-info ref="inspectionFabricInfo" :data="data" />
      <!--  任务动态  -->
      <task-news ref="taskNews" :data="data" />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <div class="btn">
        <el-button v-if="data.status === 2 && $permission(['qa:qaFinishFabricInspectionTask:audit'])" type="primary" @click="showDialog">审核</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
    <!-- 审核弹框 -->
    <examine-dialog ref="examineDialog" :data="data" />
  </div>
</template>

<script>
import { qaFinishFabricInspectionTaskInfo } from './api/index'
import statusBar from './components/status-bar'
import baseInfo from './components/base-info'
import inspectionFabricInfo from './components/inspection-fabric-info'
import taskNews from './components/task-news'
import examineDialog from './components/examine-dialog'

export default {
  components: { statusBar, baseInfo, inspectionFabricInfo, taskNews, examineDialog },
  mixins: [],
  data() {
    return {
      data: {
        qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
        qaFinishFabricRecordList: [], // 验布信息list
        qaGreigeInspectionInfoResponse: {} // 加工基础信息
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      if (this.$route.params.id) {
        this.load(this.$route.params.id)
      }
    },
    // 加载数据
    async load(id = '') {
      const { code = 0, data = {}} = await qaFinishFabricInspectionTaskInfo({ id })
      if (code === 200) {
        this.$nextTick(() => {
          this.data = data
          this.$refs['statusBar'].init(data)
          this.$refs['baseInfo'].init(data)
          this.$refs['inspectionFabricInfo'].init(data)
          this.$refs['taskNews'].init(data)
        })
      }
    },
    // 显示审核弹框
    showDialog() {
      this.$nextTick(() => {
        this.$refs['examineDialog'].init()
      })
    },
    goBack() {
      this.$router.push(`/quality-manage/finished-product-testing/finished-fabric-inspection`)
    }
  }
}
</script>

<style lang='scss' scoped>
.finished-fabric-inspection-detail {
  padding: 20px;
  margin-bottom: 37px; // 37 = 57 - 20
}
.button-group {
  width: calc(100% - 210px);
  transition: width 0.28s;
  position: fixed;
  text-align: center;
  bottom: 0;
  padding: 10px;
  background: #ffffff;
  border-top: 1px solid #ecf0f3;
  z-index: 999;
  right: 0;
  .button {
    margin-right: 12px;
  }
}
.fixed-footer {
  width: calc(100% - 54px) !important;
}
</style>
