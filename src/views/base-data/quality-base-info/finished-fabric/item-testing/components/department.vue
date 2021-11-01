<template>
  <div class="employeeDepartment">

    <el-tooltip class="item" effect="dark" :content="content" placement="top-start">
      <div>
        <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ name }}</div>
        <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ nameEn }}</div>
      </div>
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
    name() {
      return this.scope.row.name || ''
    },
    nameEn() {
      return this.scope.row.nameEn || ''
    },
    content() {
      return '中文名：' + (this.scope.row.name || '') + '英文名：' + (this.scope.row.nameEn || '')
    }
  },
  watch: {},
  mounted() {
    // console.log('scope', this.scope)
    // console.log('componentsOptions', this.componentsOptions)
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
        background-color: #f4f4f5;
        border: 1px solid #e9e9eb;
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
    min-width: 60px;
    max-width: 150px;
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
