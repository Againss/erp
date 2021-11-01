<template>
  <div class="request">
    <div class="requestText">条纹间距要求: <span v-for="(item, index) in colorGroups" :key="index">{{ item.colorName + item.height + `${index === colorGroups.length - 1 ? 'cm。': 'cm，'}` }}</span></div>
    <el-popover
      placement="bottom-end"
      width="680"
      trigger="click"
    >
      <el-row>
        <el-col :span="12" class="paddingRight">
          <div class="subTitle">条纹间距<span class="keyWords">要求</span></div>
          <div style="height: 200px;">
            <div v-for="(item, index) in colorGroups" :key="index" style="display: flex;">
              <div v-if="item.height" style="width: 80px;">{{ item.colorName }}{{ item.height }}cm</div>
              <div class="colorItem" style="width: calc(100% - 50px);" :style="{ 'background-color': item.colorValue, height: ((item.height/item.total*200)) + 'px'}" />
            </div>
          </div>

        </el-col>
        <el-col :span="12" class="paddingLeft">
          <div class="subTitle">条纹间距<span class="keyWords">效果</span></div>
          <div style="height: 200px;">
            <div v-for="(item, index) in colorEffect" :key="index" style="display: flex;">
              <div v-if="item.height" style="width: 80px;">{{ item.colorName }}{{ item.height }}cm</div>
              <div class="colorItem" style="width: calc(100% - 50px);" :style="{ 'background-color': item.colorValue, height: ((item.height/item.total*200)) + 'px'}" />
            </div>
          </div>
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
      // colorGroups: [
      //   { colorName: '墨绿', colorValue: '#448C97', height: '3' },
      //   { colorName: '天蓝', colorValue: '#9BD9F6', height: '1' },
      //   { colorName: '深蓝', colorValue: '#3C4EA5', height: '2' },
      //   { colorName: '大红', colorValue: '#B72939', height: '4' },
      //   { colorName: '浅黄', colorValue: '#FFEABE', height: '1' },
      //   { colorName: '黄黄', colorValue: '#AF6A2E', height: '2' }
      // ]
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
    },
    colorGroups() {
      const total = this.componentsOptions.colorGroups.reduce((total, item) => total + item.height, 0)
      return this.componentsOptions.colorGroups.map(item => {
        item.total = total
        if (item.colorValue && item.colorValue.indexOf('rgb') === -1) {
          item.colorValue = `rgb(${item.colorValue})`
        }
        return item
      })
    },
    colorEffect() {
      const dataList = this.formDatas.intervalStripTable ? this.formDatas.intervalStripTable.map(item => {
        return {
          // colorName: item.color || '',
          colorValue: item.colorBlock || '',
          height: item.height ? item.height * 1 : 0
        }
      }) : []
      const total = dataList.reduce((total, item) => total + item.height, 0)

      return dataList.map(item => { item.total = total; return item })
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
        border-left: 1px solid rgba(187,194,208,0.30);
        margin-left: -1px;
    }
    .subTitle {
        font-size: 14px;
        color: #151222;
        margin-bottom: 10px;

        .keyWords {
            color: #148cff;
        }

        .colorItem {
            width: 100%;
        }
    }
</style>
