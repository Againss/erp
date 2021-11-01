<template>
  <div id="ApproveTip">
    <!-- 模拟数据对接 -->
    <!-- 为发起人 -->
    <div v-for="(item, index0) in result" :key="index0" class="boxWrap">
      <template v-for="(tip, index) in item">
        <div
          v-if="tip.nodeType === 1"
          :key="index"
          class="box"
          :style="{ 'padding-bottom': '30px' }"
        >
          <div class="box-left">
            <img src="../../../assets/images/systemSettings/systemSettings-root.png" class="svg">
            <!-- <svg-icon icon-class="systemSettings-root" class-name="svg" /> -->
          </div>
          <div class="box-right">
            <div class="fir">
              <div class="person-status">{{ tip.nodeName }}：{{ tip.auditName }}</div>
              <div class="detail-time fr">
                {{ tip.createdTime && $filters.parseTime(tip.createdTime) }}
              </div>
            </div>
          </div>
        </div>
        <!-- 审核及抄送 -->
        <div v-else :key="index" class="box">
          <div
            class="box-left"
            :style="{ visibility: index === 0 ? 'show' : 'hidden' }"
          >
            <img v-if="tip.nodeType === 2" src="../../../assets/images/systemSettings/systemSettings-approver.png" class="svg">
            <img v-else-if="tip.nodeType === 4" src="../../../assets/images/systemSettings/systemSettings-recipient.png" class="svg">
            <!-- <svg-icon
              class-name="svg"
              :icon-class="
                tip.nodeType === 2
                  ? 'systemSettings-approver'
                  : tip.nodeType === 4
                    ? 'systemSettings-recipient'
                    : ''
              "
            /> -->
          </div>
          <div class="box-right">
            <div v-if="index === 0" class="fir">
              <!-- <div v-if="tip.nodeType === 2" class="person-status">审批人</div>
              <div v-else-if="tip.nodeType === 4" class="person-status">抄送人</div> -->
              <div class="person-status">{{ tip.nodeType === 4 ? '抄送人' : tip.nodeName }}</div>
              <div class="person-status" style="color: #777">{{ item | filterStatus }}</div>
              <!-- 1通过 2不通过 3驳回 -->
              <!-- 发起人无状态 -->
              <div v-if="tip.oper===1" class="tag">或签</div>
              <div v-else-if="tip.oper===0" class="tag">会签</div>
            </div>
            <div class="sec">
              <div class="content">
                <div class="content-detail">
                  <div class="detail-avatar">
                    <img v-if="tip.userAvatar" :src="tip.userAvatar" class="img-avatar">
                    <div class="detail-name">{{ tip.auditName }}</div>
                  </div>
                  <div v-if="tip.result || tip.createdTime" class="detail-tip" />
                  <div class="detail-time">
                    <!-- 抄送，同意等状态 -->
                    <template v-if="tip.nodeType === 2">
                      <div v-if="tip.result === 1" class="detail-status">
                        通过
                      </div>
                      <div
                        v-else-if="tip.result === 2"
                        class="detail-status refuse"
                      >
                        驳回
                      </div>
                      <div
                        v-else-if="tip.result === 3"
                        class="detail-status refuse"
                      >
                        回退
                      </div>
                    </template>
                    <template v-if="tip.nodeType === 4 && tip.createdTime">
                      <div class="detail-status">
                        已抄送
                      </div>
                    </template>
                    {{ tip.createdTime && $filters.parseTime(tip.createdTime) }}
                  </div>
                </div>
                <div v-if="tip.remark" class="content-remark">
                  {{ tip.remark }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ApproveTip',
  filters: {
    filterStatus(val) {
      var tip = ''
      if (val && val.length) {
        if (val[0].nodeType === 4) {
          // 抄送状态
          tip = val[0].result ? '（已抄送）' : ''
          return tip
        } else if (val[0].nodeType === 2) {
          // 审批人
          for (var j = 0; j < val.length; j++) {
            if (val[j].result && val[j].result !== 1) {
              tip = '（不通过）'
              break
            } else if (val[j].result && val[j].result === 1) {
              tip = '（通过）'
              break
            }
          }
        }
      }
      return tip
    }
  },
  props: {
    formDatas: {
      type: Object
    }
  },
  data() {
    return {
      result: []
    }
  },
  watch: {
    formDatas: {
      handler(val) {
        this.handle(val['_approve'])
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handle(value) {
      const val = this.$utils.deepClone(value)
      // 后端排序，前端不排序
      // val.length &&
      //   val.sort((a, b) => {
      //     return a['createdTime'] - b['createdTime']
      //   })
      var result = []
      for (var j = 0; j < val.length; j++) {
        const el = val[j]
        const len = result.length
        if (len && result[len - 1][0] && result[len - 1][0].nodeId) {
          el.nodeId === result[len - 1][0].nodeId && el.nodeType === result[len - 1][0].nodeType
            ? result[len - 1].push(el)
            : result.push([el])
        } else {
          result.push([el])
        }
      }
      this.result = result
      console.log(this.result, 'result')
    }
  }
}
</script>

<style lang="scss" scoped>
#ApproveTip {
  .boxWrap {
    border-left: 1px solid #f0f0f0;
    padding-bottom: 15px;
    margin: 0 20px;
    &:last-child {
      border-left: none;
    }
  }
  .box {
    * {
      display: inline-block;
    }
    display: flex;
    margin-left: 9px;
    .box-left {
      margin-left: -24px;
      .svg {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-top: -5px;
      }
    }
    .box-right {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-left: 24px;
      .fir {
        font-size: 14px;
        padding-bottom: 16px;
        .detail-time {
          color: #777777;
        }
        .person-status {
          color: #151222;
        }
        .status {
          margin-left: 10px;
          color: #666666;
        }
        .tag {
          margin-left: 8px;
          color: #0986ff;
          border: 1px solid #0986ff;
          border-radius: 11.25px;
          font-size: 12px;
          padding: 3px 8px;
          line-height: 14px;
        }
      }
      .sec {
        font-size: 14px;
        display: flex;
        padding-bottom: 15px;
        .logo {
          .svg {
            width: 18px;
            height: 18px;
            border-radius: 2px;
          }
        }
        .content {
          display: flex;
          flex-direction: column;
          //   border: 1px solid blue;
          width: 100%;
          margin-left: 10px;
          // flex-wrap:wrap;
          .content-detail {
            display: flex;
            justify-content: space-between;
            position: relative;
            .detail-avatar {
              background: #fff;
              z-index: 2;
              display: flex;
              align-items: center;
              .img-avatar {
                width: 18px;
                height: 18px;
                margin-right: 10px;
                border-radius: 2px;
              }
              .detail-name {
                color: #777777;
                background: #fff;
                // padding-right: 20px;
                z-index: 2;
              }
            }
            .detail-tip {
              z-index: 1;
              position: absolute;
              left: 0;
              right: 0;
              display: inline-block;
              height: 1px;
              border: 1px dashed #e1e3e6;
              line-height: 16px;
              margin-top: 8px;
            }
            .detail-time {
              background: #fff;
              padding-left: 20px;
              z-index: 2;
              color: #777777;
              .detail-status {
                color: #00bcc5;
                margin-right: 24px;
                width: 44px;
              }
              .refuse {
                color: #ff4444;
              }
            }
          }
          .content-remark {
            margin-top: 16px;
            padding: 5px 10px;
            color: #888e9e;
            background-color: #edf0f5;
          }
        }
      }
    }
  }
}
</style>
