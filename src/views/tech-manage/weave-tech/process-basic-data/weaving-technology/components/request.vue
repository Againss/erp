<template>
  <div class="request">
    <div class="requestText">条纹间距要求: <span>黑色 3cm,深灰色 2cm，浅灰色 3cm，红色 3cm，橙色 3cm，绿色 3cm</span></div>
    <el-popover
      placement="right"
      width="680"
      trigger="click"
    >
      <el-row>
        <el-col :span="12" class="paddingRight">
          <div class="subTitle">条纹间距<span class="keyWords">要求</span></div>
          <div v-for="(item, index) in colorGroups" :key="index" class="colorItem" :style="{ 'background-color': item.color, height: item.height * 10 + 'px'}" />
        </el-col>
        <el-col :span="12" class="paddingLeft">
          <div class="subTitle">条纹间距<span class="keyWords">效果</span></div>
          <div v-for="(item, index) in colorGroups" :key="index" class="colorItem" :style="{ 'background-color': item.color, height: item.height * 10 + 'px'}" />
        </el-col>
      </el-row>
      <el-button slot="reference" size="small">点击效果预览</el-button>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'Request',
  components: {

  },
  props: {
    // scope: {
    //   type: Object
    // },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      colorGroups: [
        { color: '#448C97', height: '3' },
        { color: '#9BD9F6', height: '1' },
        { color: '#3C4EA5', height: '2' },
        { color: '#B72939', height: '4' },
        { color: '#FFEABE', height: '1' },
        { color: '#AF6A2E', height: '2' }
      ]
    }
  },
  computed: {
    intervalStripSum() {
      return this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.length : 0
    },
    height() {
      // console.log(this.formDatas.rawMaterialTable.map(item => item.appSysId4).reduce((total, item) => total + isNaN(item * 1) ? 0 : item * 1, 0))
      console.log(this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.map(item => item.appSysId4) : 0)
      return this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.map(item => item.appSysId4).reduce((total, item) => total + (isNaN(item * 1) ? 0 : item * 1), 0) : 0
    },
    modulus() {
      return this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.map(item => item.appSysId5).reduce((total, item) => total + (isNaN(item) ? 0 : item * 1), 0) : 0
    }
  },
  watch: {},
  mounted() {
    console.log(this.formDatas)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
    .request {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #474747;
        margin-bottom: 35px;

        .requestText {
            flex: 1;
        }
    }
    .paddingRight {
        padding-right: 15px;
        border-right: 1px solid rgba(187,194,208,0.30);
    }
    .paddingLeft {
        padding-left: 15px;
    }
    .subTitle {
        font-size: 12px;
        color: #474747;
        margin-bottom: 10px;

        .keyWords {
            color: #148cff;
        }

        .colorItem {
            width: 100%;
        }
    }
</style>
