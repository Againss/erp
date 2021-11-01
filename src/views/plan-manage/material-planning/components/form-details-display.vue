<template>
  <div class="form-details-display">
    <template v-if="dataSource.length">
      <div v-for="(item, index) in dataSource" :key="index" class="form-details-display-item">
        <div class="headerList" :class="item.expandFlag ? 'expand' : 'notExpand'">
          <el-checkbox v-if="checkShow" v-model="item.checked" class="checkbox" />
          <i v-else class="el-icon-document checkbox" />
          <div class="headerList-content">
            <div v-for="(headerItem, headerIndex) in headerList" :key="headerIndex" class="headerList-content-item">
              <label class="label" style="font-weight: inherit">{{ headerItem.label }}</label>
              <span class="headerList-content-item-text" :title="headerItem.formater ? headerItem.formater(item) : item[headerItem.prop]">{{ headerItem.formater ? headerItem.formater(item) : item[headerItem.prop] }}</span>
            </div>
          </div>
          <div class="more" @click="moreClick(item)">更多 <i class="el-icon-arrow-up more-icon" :class="item.expandFlag ? 'is-reverse' : ''" /></div>
          <el-button v-if="rightButtonShow && $permission(['aps-center:materielPlan:confirm'])" class="right-button" submit type="primary" plain size="small" @click="option.rightButtonClick(item, index)">{{ rightButtonText }}</el-button>
        </div>
        <div class="contentList">
          <cs-custom-form ref="searchForm" :data-source="[{...customFormData[0], spanMethod: ({ row, column, rowIndex, columnIndex }) => {return spanMethod({ row, column, rowIndex, columnIndex }, item.datas || [])}, dataSource: item.datas || []}]" :options="formOtions" />
        </div>
      <!-- <div class="contentList">
        <div class="contentList-head">
          <div v-for="(contentItem, contentIndex) in contentHead" :key="contentIndex" class="contentList-head-item">{{ contentItem.label }}</div>
        </div>
        <div class="contentList-data">
          <div v-for="(dataItem, dataIndex) in item.dataSource" :key="dataIndex" class="contentList-data-row">
            <template v-for="(headItem, headIndex) in contentHead">
              <div v-if="!headItem.customInput" :key="headIndex" class="contentList-data-row-item">{{ headItem.formater ? headItem.formater(dataItem, dataIndex) : dataItem[headItem.prop] }}</div>
              <div v-else :key="headIndex" class="contentList-data-row-item">
                <el-input v-model="dataItem[headItem.prop]" size="mini" placeholder="请输入">
                  <span slot="suffix" class="inputEndKG">KG</span>
                </el-input>
              </div>
            </template>
          </div>
        </div>
      </div> -->
      </div>
    </template>
    <div v-else class="empty">暂无数据</div>
    <!-- 分页效果 -->
    <cs-custom-pagination v-if="getCurrentPagination" :options="getCurrentPagination" />
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object
    }
  },
  data() {
    return {
      formOtions: { popError: true }
      // checked: false
    }
  },
  computed: {
    headerList() {
      return Object.values(this.option.headerList)
    },
    checkShow() {
      return this.option.checkShow
    },
    rightButtonShow() {
      return this.option.rightButtonShow
    },
    rightButtonText() {
      return this.option.rightButtonText
    },
    contentHead() {
      return Object.values(this.option.contentHead)
    },
    customFormData() {
      return Object.values(this.option.customFormData)
    },
    dataSource() {
      return this.option.dataSource || []
    },
    getCurrentPagination() {
      return this.option.pagination
    }
  },
  created() {
    console.log(this)
  },
  methods: {
    moreClick(item) {
      // console.log(expandFlag)
      item.expandFlag = !item.expandFlag
    },

    // 单元格合并
    spanMethod({ row, column, rowIndex, columnIndex }, data) {
      // console.log({ row, column, rowIndex, columnIndex }, data)
      const mergingRows = this.dataPretreatment(data)
      if (columnIndex >= 0 && columnIndex < 1) {
        const _row = mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        // console.log({ _row, _col })
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },

    // 处理表格的合并的数据，找到要合并的数组
    dataPretreatment(data) {
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      const mergingRows = []
      let mergingPos = 0
      for (let i = 0; i < data.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          mergingRows.push(1)
          mergingPos = 0
        } else {
          if (data[i].process === data[i - 1].process) {
            mergingRows[mergingPos] += 1
            mergingRows.push(0)
          } else {
            mergingRows.push(1)
            mergingPos = i
          }
        }
      }
      // console.log(mergingRows)
      return mergingRows
    }
  }
}
</script>

<style lang="scss" scoped>
.form-details-display-item {
  padding-bottom: 1px;
  margin-bottom: 15px;
  margin-top: 1px;
  background-color: #fff;
  position: relative;

  .notExpand {
    height: 50px;
    transition: transform .3s;
    border-bottom: 1px solid #E9EFF2;
  }
  .expand {
    height: auto;
    box-shadow: 10px 12px 10px 0 rgba(161,177,192,0.20);

    .headerList-content {
      margin-bottom: -3px;
    }
  }
  .headerList {
    position: relative;
    background-color: #fff;
    display: flex;
    z-index: 1;
    padding: 9px 20px 9px 33px;

    .checkbox {
      // margin-right: 8px;
      margin-top: 8px;
      color:  #666976;
    }

    .headerList-content {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      margin-top: 9px;
      overflow: hidden;
      font-size: 14px;
      color: #151222;

      .headerList-content-item {
        width: 218px;
        display: flex;
        margin-bottom: 15px;
        margin-right: 20px;

        .label {
          display: inline-block;
          vertical-align: middle;
          font-weight: 400;
          margin-right: 10px;
          font-size: 14px;
          color: #888E9E;
          width: 60px;
          text-align: right;
        }

        .headerList-content-item-text {
          display: inline-block;
          vertical-align: middle;
          flex: 1;
          color: #474747;
          // width: 120px;
          overflow: hidden;/*超出部分隐藏*/
          white-space: nowrap;/*不换行*/
          text-overflow:ellipsis;/*超出部分文字以...显示*/
        }
      }
    }

    .more {
      margin-top: 9px;
      // margin-right: 20px;
      margin-left: -10px;
      font-size: 12px;
      color: #666666;
      cursor: pointer;

      .more-icon {
        margin-left: 5px;
        transform: rotate(180deg);
        transition: transform .3s;
      }

      .is-reverse {
        transform: rotate(0deg);
      }
    }

    .el-button--primary.is-plain {
      background-color: #fff;
      border: 1px solid #0986FF;
      border-radius: 4px;
      border-radius: 4px;
      height: 32px;
      color: #0986FF;
    }
  }

  .contentList {
    // padding-top: 35px;
    margin: auto 10px;

    .custom-form {
      margin-top: 0;
    }

    .contentList-head {
      margin-top: 28px;
      margin-bottom: 16px;
      display: flex;

      .contentList-head-item {
        font-size: 14px;
        color: #151226;
        font-weight: 700;
      }
    }

    .contentList-data {

      .contentList-data-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 14px;
        color: #474747;
      }

      .inputEndKG {
        font-size: 14px;
        color: #888E9E;
        margin-right: 10px;
        line-height: 28px;
      }
    }

    .contentList-head-item, .contentList-data-row-item {
      width: 300px;
    }
  }
}
.custom-form {
  margin-top: 8px;
  .el-form-item {
    margin-bottom: 0px;
  }
}

.el-pagination {
  background-color: #fff;
  padding: 10px;
  margin-top: 0;
}
</style>
<style lang="scss">
  .form-details-display {

    .right-button {
      margin-left: 20px;
    }
    .contentList {
      .el-input__inner{
        height: 24px;
        height: 24px;
      }
      .el-form>.el-form-item {
        margin-bottom: 12px;
      }
      .table {
        .el-table {
          &::before {
            height: 0px;
          }
        }
        th {
          border-bottom: 0px;
        }
        tr:hover>td {
            background-color: #fff;
          }
        .el-table__row {
          td {
            // &:hover {
            //   background-color: #fff;
            // }

            padding: 0px 0;
            // border-bottom: 0px;

            // &:not([rowspan='1']) {
            //   padding-top: 8px;
            //   vertical-align: baseline;
            // }
            .cell {
              // height: 50px;
              line-height: 50px;
            }
          }
        }

        // .el-form-item__content {
        //   line-height: 22px;
        // }
      }

      .el-form.el-form-item {
        margin-bottom: 10px;
      }
    }
    .empty {
      padding: 10px 0;
      text-align: center;
      background-color: #fff;
      color: #909399;
      font-size: 14px;
    }
  }
</style>
