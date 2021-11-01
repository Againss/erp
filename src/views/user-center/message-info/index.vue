<template>
  <div class="messageInfo">
    <el-card class="box-card">
      <div slot="header" class="clearfix fontSize">
        <span class="messageType">消息类型：<span style="color: #999;">{{ messageInfo.messageType === 1 ? '系统消息' : '任务提醒' }}</span></span>
        <span type="text">创建时间：<span style="color: #999; margin-right: 5px;">{{ $filters.parseTime(messageInfo.createdTime + '', '{y}-{m}-{d} {h}:{i}') }}</span></span>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </div>
      <h3 class="notification">{{ systemDataSource[messageInfo.sourceClient] }}的系统通知</h3>
      <div class="text item">{{ messageInfo.content }}</div>
    </el-card>
  </div>
</template>

<script>
import { userInfo } from './api/index.js'
import systemDataSource from '../log-management/config/system-data-source.js'
export default {
  data() {
    return {
      messageInfo: {},
      systemDataSource
    }
  },
  computed: {
    userId() {
      // return this.$store.state.user.userInfo.userId
      return 'd4dcdad6d6784f768975941e598ea480'
    },
    unReadCount() {
      return this.$store.state.user.unreadCount
    },
    messageId() {
      return this.$route.query.id
    }
  },
  created() {
    // console.log(this.$route.query.id)
    this.getMessageInfo()
  },
  methods: {
    // 获取消息详情
    async getMessageInfo() {
      const res = await userInfo({ userId: this.userId, messageId: this.messageId })
      if (res.code !== 200) {
        return false
      }
      this.messageInfo = res.data
    }
  }
}
</script>

<style lang="scss">
.messageInfo {
    padding: 20px;
    .box-card {
        width: 100%;
    }
    .fontSize {
        font-size: 14px;
        display: flex;
        align-items: center;
        .messageType {
          flex: 1;
        }
    }
    .notification {
        margin-top: 0;
    }
    .text {
    //   font-size: 14px;
    text-indent: 2em;
      margin-bottom: 18px;
      line-height: 24px;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
}
</style>
