<template>
  <div v-highlight class="employeeDepartment">
    <el-tooltip :key="scope.row.logId" placement="right" effect="light">
      <div slot="content" class="departmentTooltip customScrollbar">
        <div v-if="isObject" v-highlight>
          <pre v-if="!(beforeCode && afterCode)"><div v-if="beforeText" class="lineHeight">{{ beforeText }}</div><code v-if="beforeCode" class="javascript LineBreak">{{ beforeCode }}</code><div v-if="afterText" class="lineHeight">{{ afterText }}</div><code v-if="afterCode" class="javascript LineBreak">{{ afterCode }}</code></pre>
          <div v-else style="display: flex;justify-content: space-between;">
            <div style="width: 49%;">
              <div style="margin-bottom:5px;color: #46a6ff;">{{ scope.row.opratorType === 'UPDATE' ? '修改前' : '设置前' }}</div>
              <pre><code class="javascript LineBreak">{{ beforeCode }}</code></pre>
            </div>
            <div style="width: 49%;">
              <div style="margin-bottom:5px;color: #46a6ff;">{{ scope.row.opratorType === 'UPDATE' ? '修改后' : '设置后' }}</div>
              <pre><code v-if="afterCode" class="javascript LineBreak">{{ afterCode }}</code></pre>
            </div>
          </div>
        </div>
        <div v-else>{{ scope.row.description }}</div>
      </div>
      <div v-if="isObject" class="oneRow"><span>{{ beforeText || '' }} {{ beforeCode || '' }} {{ afterText || '' }} {{ afterCode || '' }}</span></div>
      <div v-else class="oneRow">
        <span>{{ scope.row.description }}</span>
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
    isObject() {
      let flag = true
      try {
        if (typeof JSON.parse(this.scope.row.description) === 'object') {
          flag = true
        } else {
          flag = false
        }
      } catch (error) {
        flag = false
      }
      return flag
    },
    beforeText() {
      return JSON.parse(this.scope.row.description).beforeText ? JSON.parse(this.scope.row.description).beforeText : false
    },
    beforeCode() {
      // console.log(JSON.parse(this.scope.row.description))
      return JSON.parse(this.scope.row.description).beforeCode ? JSON.stringify(JSON.parse(this.scope.row.description).beforeCode).replace(/[{]/g, '{\n').replace(/[}]/g, '\n}').replace(/,\"/g, ',\n\"').replace(/"(.*?)":/g, '$1:') : false
    },
    afterText() {
      return JSON.parse(this.scope.row.description).afterText ? JSON.parse(this.scope.row.description).afterText : false
    },
    afterCode() {
      return JSON.parse(this.scope.row.description).afterCode ? JSON.stringify(JSON.parse(this.scope.row.description).afterCode).replace(/[{]/g, '{\n').replace(/[}]/g, '\n}').replace(/,\"/g, ',\n\"').replace(/"(.*?)":/g, '$1:') : false
    }
  },
  watch: {},
  mounted() {
    console.log('scope', this.scope)
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
    position: relative;
    max-width: 200px;
    .backgroundcolor {
        background-color: #f4f4f5;
        border: 1px solid #e9e9eb;
        // color: #909399;
        padding: 1px;
        border-radius: 4px;
        // margin-bottom: 7px;
        // display: inline-block;
    }
    .oneRow {
        vertical-align: middle;
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.departmentTooltip {
    max-height: 400px;
    overflow-y: auto;
    min-width: 400px;
    width: 500px;
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
    .lineHeight {
      color: #46a6ff;
      line-height: 30px;
    }
    pre {
      margin: 0;
    }
    .LineBreak {
      white-space: break-spaces;
    }
  }
</style>
<style lang="scss">

</style>
