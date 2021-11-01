<!--
 * @Author: Sanmao
 * @Date: 2020-12-11 17:48:45
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-01-28 10:05:35
 * @Descripttion: 花号工艺打印页面
-->
<template>
  <div>
    <cs-print
      :print.sync="barPrint"
      :orientation="'p'"
      :interval="200"
      :format="'a4'"
      class="print-box"
    >
      <!-- 纵向打印：width:784px;orientation="p";横向打印：width:1100px; orientation="l"-->
      <div
        style="
          width:784px;
          height: 100%;
          padding: 10px;
          margin-top:10px;
          margin-left:10px;
          box-sizing: border-box;
          background: #fff;
        "
      >
        <header>
          <div class="logo">
            <img src="../../../assets/images/logo.png" alt="logo">
          </div>
          <div class="company-name">
            <h2>佛山市智布互联纺织有限公司</h2>
            <h2>Foshan Smart Fabric Textile Co., Ltd</h2>
          </div>
        </header>
        <section class="warp-center content-title border-b">智布花号工艺单</section>
        <section class="padding-10">基本信息</section>
        <section class="basic-info">
          <div style="display:flex;">
            <div class="grid-content p-t-0">
              <div class="grid-content-left">智布花号：</div>
              <div class="grid-content-right">{{ order.flowerCode || '' }}</div>
            </div>
            <div class="grid-content p-t-0">
              <div class="grid-content-left">
                <span class="letter-none">印花SO单号</span>：
              </div>
              <div class="grid-content-right">{{ order.printingSoCode || '' }}</div>
            </div>
            <div class="grid-content p-t-0">
              <div class="grid-content-left">
                <span style="letter-spacing: 18px">交期</span>：
              </div>
              <div class="grid-content-right">{{ order.deliveryDate || '' }}</div>
            </div>
          </div>
          <div style="display:flex;">
            <div class="grid-content">
              <div class="grid-content-left">
                <span style="letter-spacing: 4px">品牌商</span>：
              </div>
              <div class="grid-content-right">{{ order.brandOwner || '' }}</div>
            </div>
            <div class="grid-content">
              <div class="grid-content-left">
                <span style="letter-spacing: 10px">印花厂</span>：
              </div>
              <div class="grid-content-right">{{ order.printingFactory || '' }}</div>
            </div>
            <div class="grid-content">
              <div class="grid-content-left">
                <span class="letter-none">印花颜色名</span>：
              </div>
              <div class="grid-content-right">{{ order.printingColorName || '' }}</div>
            </div>
          </div>
          <div style="display:flex;">
            <div class="grid-content">
              <div class="grid-content-left">
                <span style="letter-spacing: 12px">布类</span>：
              </div>
              <div class="grid-content-right">{{ order.fabricCategory || '' }}</div>
            </div>

            <div class="grid-content">
              <div class="grid-content-left">
                <span style="letter-spacing: 21px">成份</span>：
              </div>
              <div class="grid-content-right">{{ order.fabricIngredient || '' }}</div>
            </div>

            <div class="grid-content">
              <div class="grid-content-left">
                <span style="letter-spacing: 3px">印花工艺</span>：
              </div>
              <div class="grid-content-right">{{ order.printingTech || '' }}</div>
            </div>
          </div>
          <div style="display:flex;">
            <div class="grid-content">
              <div class="grid-content-left">
                <span class="letter-none">印花方式</span>：
              </div>
              <div class="grid-content-right">{{ order.printingMethod || '' }}</div>
            </div>

            <div class="grid-content">
              <div class="grid-content-left">
                <span style="letter-spacing: 4.5px">印花套色</span>：
              </div>
              <div class="grid-content-right">{{ order.printingTopping || '' }}</div>
            </div>

            <div class="grid-content">
              <div class="grid-content-left">
                <span style="letter-spacing: 18px">克重</span>：
              </div>
              <div
                class="grid-content-right"
              >{{ order.fabricWeight ? order.fabricWeight+'g/m²' : '' }}</div>
            </div>
          </div>
        </section>
        <section class="border-b" />
        <div class="padding-10">工艺信息</div>
        <div class="basic-info tect-info">
          <div style="display:flex;">
            <div class="grid-content p-t-0">
              <div class="grid-content-left w-60" style="text-align: left">网板类型：</div>
              <div
                class="grid-content-right"
              >{{ order.screenType ? order.screenType===1 ? '平网' : '圆网' : '' }}</div>
            </div>

            <div class="grid-content p-t-0">
              <div class="grid-content-left w-60" style="text-align: left">
                <span class="letter-none">网目</span>：
              </div>
              <div class="grid-content-right">{{ order.printingMesh ? order.printingMesh.name:'' }}</div>
            </div>

            <div class="grid-content p-t-0">
              <div class="grid-content-left w-60" style="text-align: left">印花占比：</div>
              <div
                class="grid-content-right"
              >{{ order.printingProportion ? order.printingProportion+'%':'' }}</div>
            </div>
          </div>
          <div class="grid-content">
            <div class="grid-content-left w-60" style="text-align: left">工艺流程：</div>
            <div class="grid-content-right">{{ order.techProcess ? order.techProcess.name:'' }}</div>
          </div>
          <div class="grid-content">
            <div class="grid-content-left w-60" style="text-align: left">配方工艺：</div>
            <div class="grid-content-right tec-img">
              <img v-for="item in order.flowerFormulaTechPic" :key="item.id" :src="item.showUrl">
            </div>
          </div>
        </div>
        <section class="border-b" />
        <section>
          <el-row class="user-info">
            <el-col :span="10">
              <div class="grid-content">
                <div class="grid-content-left">
                  <span style="letter-spacing: 5px">制单</span>：
                </div>
                <div
                  class="grid-content-right user-name"
                >{{ order.submitter ? `${order.submitter.name}/${order.submitter.realName}`: "" }}</div>
              </div>
            </el-col>

            <el-col :span="10">
              <div class="grid-content">
                <div class="grid-content-left">
                  <span class="letter-none">审批人</span>：
                </div>
                <div
                  class="grid-content-right user-name"
                >{{ order.updator? `${order.updator.name}/${order.updator.realName}`: "" }}</div>
              </div>
            </el-col>
          </el-row>
        </section>
      </div>
    </cs-print>
    <footer>
      <el-button @click="barPrintHandle">打印</el-button>
      <el-button @click="closePrintpage">关闭</el-button>
    </footer>
  </div>
</template>
<script>
import { show } from './api'
export default {
  name: 'FlowerCodePrint',
  data() {
    return {
      barPrint: false,
      order: {}
    }
  },
  created() {
    this.getOrder(this.$route.params.id)
  },
  methods: {
    /**
     * @description 获取单据数据
     */
    async getOrder(id) {
      const res = await show({ id })
      if (res.data && res.data.status === 3) {
        this.order = res.data
      } else {
        this.$message({
          message: '单据未审核，不能打印',
          type: 'warning'
        })
      }
    },
    /**
     * @description 打印
     */
    barPrintHandle() {
      this.barPrint = true
    },
    /**
     * @description 关闭打印页面
     */
    closePrintpage() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.print-box {
  display: flex;
  justify-content: center;
}
header {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  // margin-top: 15px;
  .logo {
    position: absolute;
    left: 10%;
  }
  .company-name {
    display: flex;
    flex-direction: column;
    h2 {
      margin: 5px 0;
      font-size: 20px;
    }
    h2:first-child {
      text-align: center;
    }
  }
}
.content-title {
  padding: 8px 0;
  font-size: 16px;
  // color: #515151;
}
.border-b {
  border-bottom: 1px solid #3c3c3c;
}

.padding-10 {
  padding: 10px;
}
.warp-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.basic-info {
  margin-bottom: 10px;
  font-size: 12px;
}
.tect-info {
  padding: 0 10px 10px;
  margin-bottom: 0;
}
.grid-content {
  display: flex;
  flex: 1;
  padding-top: 10px;
  .grid-content-left {
    text-align: right;
    width: 80px;
    span {
      display: inline-block;
      // letter-spacing: 10px;
    }
    .letter-none {
      letter-spacing: inherit;
    }
  }
  // .w-60 {
  //   width: 64px;
  // }
  .grid-content-right {
    flex: 1;
    box-sizing: border-box;
  }
  .tec-img {
    display: flex;
    border: 1px solid #000;
    height: 300px;
    padding: 2px;
    img {
      width: 50%;
      box-sizing: border-box;
      display: block;
      height: 100%;
    }
    img:first-child {
      padding-right: 4px;
    }
  }
}
.p-t-0 {
  padding-top: 0;
}

.user-info {
  display: flex;
  justify-content: center;
}
.user-name {
  border-bottom: 1px solid #000;
}
footer {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}
</style>
