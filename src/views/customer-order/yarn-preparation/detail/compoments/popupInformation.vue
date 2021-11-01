<!--
 * @Author: xj
 * @Description: 列表字段点击弹窗
 * @Date: 2021-03-09 19:51:25
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-30 13:43:41
 * @FilePath: d:\erp\src\views\customer-order\yarn-preparation\detail\compoments\popupInformation.vue
-->
<template>
  <div class="come_up">
    <div class="come_san" />
    <div class="come_div">
      <div class="come_div_p">选择列表字段</div>
      <div class="come_some">
        <el-checkbox v-model="checkedUp" style="color: #151222;" :checked="checkedUp" @change="checkedUpClick">全选</el-checkbox>
      </div>
      <!-- list -->
      <div class="come_single customScrollbar">
        <div v-for="(item, index) in infoData.length" :key="index" class="come_single_yu">
          <div class="single_text">{{ textTop[index] }}</div>
          <div class="single_dv">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in infoData[index]" :key="city" :label="city">{{ city }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <!-- btn -->
      <div class="com_foot">
        <el-button class="btn" type="primary" @click="okHandle">确 定</el-button>
        <el-button class="btn" @click="cancelHandle">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    pupcolumns: { // 列表数据
      type: Object
    },
    pupoperates: { // 操作
      type: Object
    },
    generallist: {// 展示列表
      type: Array
    },
    generaltext: {// 展示列表文字
      type: Array
    }
  },
  data() {
    return {
      checkedUp: false, // 全选按钮
      textTop: ['基本信息', '订单信息', '人员和时间', '状态和操作'],
      infoData: [
        ['序号', '订单号', '需求来源', '需求单号', '客户', '销售团队'], // 基本信息
        ['数量/单位'], // 订单信息
        ['客服', '销售员', '创建时间', '取消时间', '完结时间'], // 人员和时间
        ['状态', '操作']// 状态和操作
      ],
      checkedCities: [], // 用户选择
      listArrays: [], // 列表数据
      operArrays: [], // 操作栏数据
      tempString: [] // 所有数据字符串
    }
  },
  computed: {},
  watch: {
    pupcolumns: {
      handler(val, oldVal) {
        for (var key in this.pupcolumns) {
          this.listArrays.push(this.pupcolumns[key].label)
        }
        this.personArray()
      },
      deep: true,
      immediate: true
    },
    pupoperates: {
      handler(val, oldVal) {
        if (val === null || !Object.keys(val).length) {
          this.operArrays = []
        } else {
          this.operArrays.push('操作')
        }
        this.personArray()
      },
      deep: true,
      immediate: true
    },
    checkedCities: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    generallist: {
      handler(val, oldVal) {
        if (val && val.length) { this.infoData = val }
      },
      deep: true,
      immediate: true
    },
    generaltext: {
      handler(val, oldVal) {
        if (val && val.length) { this.textTop = val }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 全选按钮
    checkedUpClick(checkedUp) {
      const that = this
      if (checkedUp) {
        that.checkedUp = true
        that.checkedCities = that.tempArrClick()
      } else {
        that.checkedUp = false
        that.checkedCities = []
      }
    },
    // 单选按钮
    handleCheckedCitiesChange(value) {
      this.tempArrClick()
      const checkedCount = value.length
      this.checkedUp = checkedCount === this.tempString.length
    },
    // 转化数组
    tempArrClick() {
      const sk = this.infoData.join(',').split(',')
      this.tempString = sk
      return sk
    },
    personArray() { // 数组合并
      if (!this.operArrays.length) {
        this.infoData[3] = ['状态']
      } else {
        if (!this.infoData[3].includes('操作')) {
          this.infoData[3] = ['状态', '操作']
        }
      }
      const sm = [...this.listArrays, ...this.operArrays]
      const tu = new Set(sm)
      this.checkedCities = Array.from(tu)
    },
    // 确定
    okHandle() {
      if (this.checkedCities.length) {
        const obj = { data: this.checkedCities, type: false }
        this.$emit('okHandleClick', obj)
      } else {
        this.getmessgae('请选择列表字段')
      }
    },
    cancelHandle() {
      const obj = { data: [], type: false }
      this.$emit('okHandleClick', obj)
    },
    // 弹窗提取
    getmessgae(me = '', types = 'error') {
      this.$message({ message: me, type: types })
    }

  }
}
</script>

<style lang="scss" scoped>
.come_up{
  width: 512px;
  // height: 589px;
  border: 1px solid  #E5E9ED;
  background:#fff;
  position: relative;
  text-align: left;
  .come_san{
    z-index: 1001;
    display: block;
    border-left: 1px solid #E5E9ED;
    border-top: 1px solid #E5E9ED;
    transform: rotate(47deg);
    width: 12px;
    height: 12px;
    position: absolute;
    right: 40px;
    top: -7px;
    background: #fff;
  }
  //大框框
  .come_div{
    .come_div_p{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #151222;
      width: 100%;
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
    }
    .come_some{
      padding: 0 20px;
      height: 35px;
      line-height: 35px;
      color: #151222;
      border-top:1px solid #E5E9ED;
      border-bottom:1px solid #E5E9ED;
    }
    //循环单选框
    .come_single{
        line-height: 30px;
        padding: 5px 20px;
        max-height: 350px;
        overflow: scroll;
        overflow-x: hidden;
      .come_single_yu{
        .single_text{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #151222;
          padding-bottom:5px;
        }
        .single_dv{
          line-height: 30px;
          /deep/.el-checkbox-group{
            .el-checkbox{
              width: 31%;
              margin-right: 10px;
            }
          }
        }
      }
    }
    // 页尾
    .com_foot{
      border-top:1px solid #E5E9ED;
      text-align: center;
      padding: 15px 0;
      line-height: normal;
      .btn{
        min-width: 90px
      }
    }
  }

}
</style>
