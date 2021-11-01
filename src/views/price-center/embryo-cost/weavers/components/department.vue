<template>
  <div class="employeeDepartment">
    <div v-if="scope.row.wovenMiddleInfo&&scope.row.wovenMiddleInfo.length<=1" class="employeeDepartmentDiv">
      <span v-for="(item, index) in scope.row.wovenMiddleInfo" :key="index" style="margin-right:6px">{{ item.dyedYarnName }}</span>
    </div>
    <el-tooltip v-else placement="top" effect="light">
      <div slot="content" class="departmentTooltip customScrollbar">
        <div v-for="(item, index) in scope.row.wovenMiddleInfo" :key="index" class="tooltipItem">{{ item.dyedYarnName }}</div>
      </div>
      <span>
        <span class="backgroundcolor">{{ scope.row.wovenMiddleInfo&&scope.row.wovenMiddleInfo[0].dyedYarnName?scope.row.wovenMiddleInfo[0].dyedYarnName+'...':'' }}</span>
        <!-- <span class="backgroundcolor">{{ scope.row.wovenMiddleInfo[1].dyedYarnName }}</span> -->
        <!-- <span class="backgroundcolor">{{ `+${scope.row.wovenMiddleInfo.length-1}` }}</span> -->
      </span>
    </el-tooltip>

  </div>
</template>

<script>
export default {
  name: 'StateColumn',
  components: {

  },
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    // tooltipText() {
    //   // const scope = this.scope
    //   // const componentsOptions = this.componentsOptions
    //   // const key = componentsOptions.key
    //   // const name = componentsOptions.name
    //   // // const tooltipText = scope.row[key].length === 2 ? scope.row[key][0][name] + ' / ' + scope.row[key][1][name] : scope.row[key].length === 1 ? scope.row[key][0][name] : ''
    //   // return tooltipText
    // }
  },
  watch: {},
  mounted() {
    // console.log('scope', this.scope)
    // console.log('componentsOptions', this.scope.row.funTestMiddleInfo[0].testStandard)
  },
  methods: {
    handle() {
      // console.log(this.scope)
    }
  }
}
</script>

<style lang="scss" scoped>
.employeeDepartment {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;

    .employeeDepartmentDiv {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }

    .backgroundcolor {
        // background-color: #f4f4f5;
        // border: 1px solid #e9e9eb;
        // color: #909399;
        padding: 1px;
        border-radius: 4px;
        // margin-bottom: 7px;
        // display: inline-block;
    }
}
.departmentTooltip {
    max-height: 100px;
    overflow-y: auto;
    min-width: 100px;
    max-width: 300px;
    // padding-bottom: -20px;
    .tooltipItem {
      line-height: 22px;
        // float: left;
        // overflow: hidden;
        // background-color: #eee;
        // margin: 0 10px 10px 0;
        // padding: 5px;
        // border-radius: 10px;
    }
  }
</style>
<style lang="scss">
</style>
