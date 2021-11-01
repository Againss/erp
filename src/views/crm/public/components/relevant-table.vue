<template>
  <div class="relevant-table">
    <div class="relevantHeader">
      <span class="relevantText">{{ relevantOptions.title }} {{ '( ' + relevantOptions.tip+ ' )' }}</span>
      <div class="details-button">
        <el-button v-if="!hiddenAddButton" size="mini" @click="relevantAdd">{{relevantOptions.relevantAddText}}</el-button>
        <!-- <el-button size="mini" @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- table表格 -->
    <div class="relevant-table-content">
      <cs-custom-table
        :cellStyle="isNotPointer"
        tooltip-effect="dark"
        :columns="columns"
        :row-style="{'background-color': '#fff'}"
        :header-cell-style="headerRowStyle"
        :data-source="twoDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <div v-if="dataSource.length > 2 && relevantOptions.isTwo" @click="relevantOptions.viewAll" class='viewAll'>查看全部</div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
      relevantOptions: {
      type: Object,
      default: () => {}
    }
  },
  data() {
      return {
        headerRowStyle: {
          'background-color': '#F5F7FA'
        }
      }
  },
  computed: {
      columns() {
        return this.relevantOptions.columns || []
      },
      twoDataSource () {
          if (this.relevantOptions.isTwo) {
            return this.dataSource.length > 2 ? this.dataSource.slice(0,2) : this.dataSource
          } else {
            return this.dataSource
          }
      },
      hiddenAddButton() {
        return this.relevantOptions.hiddenAddButton || false
      },
      dataSource() {
        return this.relevantOptions.dataSource || []
      },
      popOperates() {
        return this.relevantOptions.popOperates || null
      },
      pagination() {
        return this.relevantOptions.pagination || {}
      },
      popOptions() {
        return this.relevantOptions.popOptions || {}
      },
      isNotPointer() {
        return this.relevantOptions.isNotPointer || {}
      }
  },
  watch: {
      
  },
  methods: {
      relevantAdd() {
          this.relevantOptions.relevantAdd && this.relevantOptions.relevantAdd()
      }
  },
};
</script>

<style lang='scss' scoped>
.relevant-table {
    // padding:20px;
    padding-top: 20px;

    .relevantHeader {
        // height: 40px;
        // background-color: #eee;
        // border-radius: 5px;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }

    .relevantText {
      font-size: 16px;
      color: #3C4043;
      font-weight: 400;
      flex:1;
    }

    .details-button {
        display: flex;
    }

    .relevant-table-content {
      .table tr:nth-child(even) {
        background-color: #fff;
      }
      
    }

    .viewAll {
      width: 96px;
      cursor: pointer;
      height: 28px;
      font-size: 14px;
      line-height: 28px;
      border: 1px solid #E9EFF2;
      border-top: 0px;
      color: #888E9E;
      margin: 0 auto;
      // background-color: #eee;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      // border-radius: 5px;
      text-align: center;
    }
    .page-table {
      padding-bottom: 0;
    }
}
</style>
<style lang="scss">
.relevant-table {
  
}
.relevant-table-content {
  tbody .el-table__row td {
    border-bottom: 1px solid #EEEFF0;
  }
}

</style>