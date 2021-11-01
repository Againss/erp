<template>
  <div class="nav-sys">
    <el-popover
      popper-class="pop-nav-sys"
      placement="bottom"
      width="642"
      trigger="click"
    >
      <div class="wrap-nav-sys">
        <!-- PC端循环显示 -->
        <div class="title">WEB端系统</div>
        <el-row class="pc-main">
          <el-col
            v-for="(item, index) in systemList"
            :key="index"
            :span="8"
          >
            <template v-if="item.uri">
              <a
                v-if="authLists.includes(item.appSysId)"
                class="box bg-white"
                :href="item.uri"
                target="_blank"
              >
                <img
                  v-if="iconList[item.enName]"
                  :src="iconList[item.enName]"
                  class="icon-label"
                >
                <div class="content">
                  <p class="name">
                    {{ item.appSysName }}
                  </p>
                  <p class="link">
                    点击进入系统<img
                      src="@/assets/images/enter.png"
                      class="enter-btn"
                    >
                  </p>
                </div>
              </a>
              <a
                v-if="!authLists.includes(item.appSysId)"
                class="box bg-gray"
              >
                <img
                  v-if="iconList[item.enName]"
                  :src="iconList[item.enName]"
                  class="icon-label"
                >
                <div class="content">
                  <p
                    class="name"
                    style="color: #888e9e"
                  >
                    {{ item.appSysName }}
                  </p>
                  <p
                    class="link"
                    style="color: #888e9e"
                  >
                    您还没有此系统的权限,请联系管理员。
                  </p>
                </div>
              </a>
            </template>
          </el-col>
        </el-row>
        <!-- 小程序循环显示 -->
        <div
          class="title"
        >小程序</div>
        <el-row class="wx-main">
          <el-col
            v-for="(item, index) in systemListweChat"
            :key="index"
            :span="8"
          >
            <template v-if="item.weChatUri">
              <div class="box-card">
                <div class="qrcode">
                  <img
                    :src="item.weChatUri"
                    class="icon-label"
                  >
                  <!-- <cs-qrcode :options="getOption(item)" /> -->
                  <!-- <div v-else style="width: 196px; height: 196px; background-color: #ccc;" /> -->
                </div>
                <div class="name">
                  <p>{{ item.appSysName }}</p>
                  <p class="des">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </template>
          </el-col>
        </el-row>
      </div>
      <el-button
        slot="reference"
        type="text"
      ><i class="el-icon-sort" style="transform: rotate(90deg); margin-right: 5px;" />系统导航</el-button>
    </el-popover>
  </div>
</template>

<script>
import { sysAppSystemList, sysAppSystemAppSystemIdList } from '@/views/user-center/micro-services/api/index.js'

export default {
  name: 'NavSys',
  components: {},
  data() {
    return {
      systemList: [],
      systemListweChat: [],
      authLists: [],
      iconList: { // 系统图标
        crm: require('@/assets/images/systems/icon_crm.png'),
        mall: require('@/assets/images/systems/icon_mall.png'),
        tech: require('@/assets/images/systems/icon_tech.png'),
        sfabric: require('@/assets/images/systems/icon_sfabric.png'),
        userCenter: require('@/assets/images/systems/icon_userCenter.png')
      }
    }
  },
  computed: {
    branch() {
      return this.$utils.getEnvInfo().branch
    }
  },
  mounted() {
    this.getSystemList()
    this.getPermitIdList()
  },
  methods: {
    // 获取所有应用系统列表
    async getSystemList(data = {}) {
      const res = await sysAppSystemList(data)
      this.systemListweChat = [...res.data.list]
      // console.log('应用系统列表', res)
      const dataList = res.data.list || []
      // 判断进入crm系统，导航删除crm入口
      dataList.forEach((val, index) => {
        if (/crm/.test(this.branch) && val.appSysId === 9) {
          dataList.splice(index, 1)
        }
      })
      // 判断进入erp系统，导航删除erp入口
      dataList.forEach((val, index) => {
        if (/erp/.test(this.branch) && val.appSysId === 1) {
          dataList.splice(index, 1)
        }
      })
      this.systemList = dataList
      console.log(dataList)
    },
    async getPermitIdList(data = {}) {
      const res = await sysAppSystemAppSystemIdList(data)
      const dataList = res.data || []
      this.authLists = dataList
      console.log(dataList)
    },
    getOption(item) {
      return {
        width: 130,
        height: 130,
        value: item.weChatUri
      }
    }
  }
}
</script>

<style lang="scss">
    .nav-sys {
        display: inline-block;
        vertical-align: text-bottom;
        padding-right: 10px;
    }
    .pop-nav-sys {
        padding: 0;
        max-width: 100vw;
        .title {
            height: 65px;
            line-height: 65px;
            padding: 0 40px;
            font-size: 18px;
            color: #000000;
            border-bottom: 1px solid #e9eff2;
        }
        .pc-main,
        .wx-main {
            width: 100%;
            .box-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 20px 0 30px 0;
                .name {
                    font-size: 14px;
                    color: #151226;
                    margin-top: 20px;
                }
                p {
                    letter-spacing: 1px;
                    margin: 0;
                    &.des {
                        margin-top: 5px;
                        font-size: 12px;
                        color: #888e9e;
                    }
                }
                .qrcode {
                    width: 130px;
                    height: 130px;
                    img {
                        width: 130px;
                        height: 130px;
                    }
                }
            }
        }
        .pc-main {
            padding: 0 35px;
            padding-top: 12px;
            .bg-white {
                background-color: #fff;
            }
            .bg-gray {
                background-color: #fff;
                cursor: default;
            }
            .box {
                display: flex;
                // align-items: center;
                height: 65px;
                margin-top: 14px;
                .icon-label {
                    width: 50px;
                    height: 50px;
                    margin-right: 5px;
                }
                .content {
                    display: flex;
                    flex-direction: column;
                    padding-right: 20px;
                    padding-top: 4px;
                }
                .name,
                .link {
                    margin: 0;
                }
                .name {
                    font-size: 16px;
                    color: #151222;
                    margin-bottom: 5px;
                }
                .link {
                    /*  display: table-cell; */
                    width: 100%;
                    font-size: 12px;
                    color: #888e9e;
                    .enter-btn {
                        max-width: 26px;
                        max-height: 26px;
                        vertical-align: middle;
                        padding-left: 9px;
                        display: none;
                    }
                }
            }
        }
    }
</style>
