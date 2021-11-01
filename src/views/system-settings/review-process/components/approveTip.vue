<template>
  <div id="ApproveTip">
    <!-- 模拟数据对接 -->
    <!-- 为发起人 -->
    <div v-for="(item, index0) in result" :key="index0" style="padding-top:15px">
      <template v-for="(tip, index) in item">
        <div
          v-if="tip.type === 1"
          :key="index"
          class="box"
          :style="{ 'padding-bottom': '30px' }"
        >
          <div class="box-left"><img src="@/assets/404_images/404.png"></div>
          <div class="box-right">
            <div class="fir">
              <div class="person-status">发起人：{{ tip.auditName }}</div>
              <div class="detail-time fr">{{ tip.mbeTime }}</div>
            </div>
          </div>
        </div>
        <!-- 审核及抄送 -->
        <div v-else :key="index" class="box">
          <div
            class="box-left"
            :style="{ visibility: index === 0 ? 'show' : 'hidden' }"
          >
            <img src="@/assets/404_images/404.png">
          </div>
          <div class="box-right">
            <div v-if="index===0" class="fir">
              <div class="person-status">{{ tip.mbeStatus }}</div>
              <!-- 1通过 2不通过 3驳回 -->
              <!-- 发起人无状态 -->
              <div v-if="tip.result === 1" class="status">(通过)</div>
              <div v-else-if="tip.result === 2" class="status">(不通过)</div>
              <div v-else-if="tip.result === 3" class="status">(驳回)</div>
              <div class="tag">
                {{ tip.oper === 1 ? "或签" : tip.oper === 0 ? "会签" : "" }}
              </div>
            </div>
            <div class="sec">
              <div class="logo"><img src="@/assets/404_images/404.png"></div>
              <div class="content">
                <div class="content-detail">
                  <div class="detail-name">{{ tip.auditName }}</div>
                  <div class="detail-tip" />
                  <div class="detail-time">
                    <!-- 抄送，同意等状态 -->
                    <div class="detail-status">{{ tip.mbeStatus }}</div>
                    <!-- 2021-03-10 12:20:20 -->
                    {{ tip.mbeTime }}
                  </div>
                </div>
                <div class="content-remark">{{ tip.remark }}</div>
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
  data() {
    return {
      result: [],
      // list: [],
      list: [
        {
          type: 1,
          auditName: 'mbe',
          mbeStatus: '审批人',
          result: 1,
          oper: 1,
          mbeTime: Date.parse(new Date()) + 86400,
          remark: 'lala'
        },
        {
          type: 2,
          auditName: 'mbe',
          mbeStatus: '审批人',
          result: 1,
          oper: 1,
          mbeTime: Date.parse(new Date()) + 86400 * 2,
          remark: 'lala1'
        },
        {
          type: 2,
          auditName: 'mbe',
          mbeStatus: '审批人',
          result: 1,
          oper: 1,
          mbeTime: Date.parse(new Date()) + 86400 * 3,
          remark: 'lala2'
        },
        {
          type: 3,
          auditName: 'mbe',
          mbeStatus: '抄送人',
          result: 1,
          oper: 1,
          mbeTime: Date.parse(new Date()) + 86400 * 4,
          remark: 'lala3'
        },
        {
          type: 2,
          auditName: 'mbe',
          mbeStatus: '审批人',
          result: 1,
          oper: 1,
          mbeTime: Date.parse(new Date()) + 86400 * 5,
          remark: 'lala4'
        },
        {
          type: 2,
          auditName: 'mbe',
          mbeStatus: '审批人',
          result: 1,
          oper: 1,
          mbeTime: Date.parse(new Date()) + 86400 * 6,
          remark: 'lala5'
        }
      ]
    }
  },
  created() {
    this.handle()
  },
  methods: {
    handle() {
      this.list.sort((a, b) => {
        return a['mbeTime'] > b['mbeTime'] ? 1 : -1
      })
      var result = []
      for (var j = 0; j < this.list.length; j++) {
        const el = this.list[j]
        const len = result.length
        if (len && result[len - 1][0] && result[len - 1][0].type) {
          el.type === result[len - 1][0].type
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
  .box {
    * {
      display: inline-block;
    }
    display: flex;
    margin-left: 9px;
    border-left: 1px solid #f0f0f0;
    // padding-bottom: 15px;
    .box-left {
      margin-left: -11px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    .box-right {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-left: 24px;
      .fir {
        font-size: 14px;
        padding-bottom: 20px;
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
          margin-left: 20px;
          color: #0986ff;
          border: 1px solid #0986ff;
          border-radius: 11.25px;
          font-size: 12px;
          padding: 3px 5px;
        }
      }
      .sec {
        font-size: 14px;
        display: flex;
        // border: 1px solid red;
        padding-bottom: 15px;
        // justify-content: space-between;
        .logo {
          img {
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
            .detail-name {
              color: #777777;
            }
            .detail-tip {
              width: 60%;
              height: 1px;
              border: 1px dashed #bbc2d0;
              line-height: 16px;
              margin-top: 8px;
            }
            .detail-time {
              color: #777777;
              .detail-status {
                color: #00bcc5;
                margin-right: 24px;
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
