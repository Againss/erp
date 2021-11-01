<template>
  <div class="form-region-select">
    <div class="label">选择工厂</div>
    <div class="select-contanier">
      <div class="search-label">
        <cs-custom-form
          ref="searchForm"
          :data-source="searchData"
          :options="formOtions"
          :form-datas="componentsOptions.formDatas"
        />
      </div>
      <div class="factory-content">
        <div class="left">
          <ul>
            <li v-for="(item, index) in componentsOptions.factoryData" :key="index" :title="item.supplierName" @click.stop>
              <el-checkbox
                v-model="item.checked"
                @change="componentsOptions.selectFactory(item)"
              >{{ item.supplierName }}</el-checkbox>

            </li>
          </ul>
        </div>
        <div class="right">
          <div class="opration">
            <div class="selected">已选：</div>
            <!-- <div class="clear" @click="componentsOptions.clearAll">清空</div> -->
          </div>
          <ul class="selcted">
            <li v-for="(item, index) in componentsOptions.selectData" :key="index" :title="item.factoryName || item.supplierName">
              {{ item.factoryName || item.supplierName }}
              <i class="el-icon-close" @click.stop="componentsOptions.deleteS(index)" />
            </li>
          </ul>
          <!-- <div class="sum">
            共选择<span>{{ componentsOptions.selectData.length }}</span>家工厂
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CusRigionSelect',
  props: {

    componentsOptions: {
      type: Object
    }
  },

  data() {
    const searchData = [

      {
        prop: 'supplierName',
        itemType: 'input',
        label: '',
        maxLength: 12,
        placeholder: '请输入工厂名称',
        // filterable: true,
        dataSource: [],
        change: (value, form, formDatas) => {
          this.formDatas.supplierName = value
          this.search()
        },
        visibleChange: (value, val) => {
          if (value) {
            // this.search('select')
          }
        }
      }
    ]
    return {
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },
      // formDatas: {},
      factoryData: [],
      selectData: [],
      form: {},
      selectFac: [],
      province: [],
      city: []
    }
  },
  computed: {
    formDatas() {
      return this.componentsOptions.formDatas
    }
  },
  created() {
  },

  methods: {
    // 搜索工厂
    async search() {
      console.log(this.formDatas)
      this.componentsOptions.searchFac(this.formDatas)
    }

  }
}
</script>
<style lang="scss">
.form-region-select {
  .el-form {
    .el-form-item:nth-of-type(3) {
      // width: 160px;
      margin-right: 0;
      // input {
      //   width: 160px;
      // }
    }
    .el-form-item {
      // border-bottom: 1px solid #E9EFF2;
      flex: 1;
      margin-bottom: 0;
      .el-form-item__content {
        line-height: 32px;
        height: 32px;
        input {
          height: 32px;
          line-height: 32px;
          font-size: 12px;
        }
        .el-input__suffix {
          .el-select__caret {
            line-height: 32px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.form-region-select {
  .label {
    width: 100%;
    display: inline-block;
    // line-height: 36px;
    font-size: 14px;
    color: #606266;
    font-weight: 400;
    line-height: 50px;
    padding-top: 8.5px;
    border-top: 1px solid #e9eff2;
    &::before{
      content: '*';
      color: #ff4949;
      margin-right: 4px;
    }
  }
  .select-contanier {
    border: 1px solid #e9eff2;
    .search-label {
      padding: 15px 30px;
      border-bottom: 1px solid #e9eff2;
    }
    .factory-content {
      display: flex;
      flex: 1;

      .left {
        border-right: 1px solid #e9eff2;
      }
      ul {
        padding: 0;
        margin: 0;
        height: 400px;
        overflow: auto;

        li {
          list-style-type: none;
          line-height: 40px;
          text-align: left;
          font-size: 14px;
          padding: 0 15px;
          border-bottom: 1px solid #e9eff2;
          /deep/.el-checkbox__label {
            // overflow: hidden;
            width: 255px;
            // display: inline-flex;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }
        }
      }
      .left,
      .right {
        flex: 1;
        .opration {
          height: 38px;
          padding: 0 15px;
          div {
            font-size: 14px;
            color: #44494c;
            line-height: 20px;
            padding-top: 13.5px;
            padding-bottom: 15px;
          }
          .selected {
            float: left;
          }
          .clear {
            float: right;
            color: #0986ff;
            cursor: pointer;
          }
        }
        .selcted {
          width: 100%;
          padding: 0 15px;
          height: 320px;
          li {
            background: rgba(9, 134, 255, 0.1);
            border: 1px solid rgba(9, 134, 255, 0.18);
            border-radius: 4px;
            line-height: 34px;
            border-radius: 4px;
            margin-bottom: 10px;
            position: relative;
            color: #0986ff;

            width: 255px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .el-icon-close {
              position: absolute;
              cursor: pointer;
              right: 10px;
              top: 50%;
              height: 15px;
              width: 15px;
              margin-top: -8px;
              color: #0986ff;
            }
          }
        }
        .sum {
          line-height: 25px;
          padding-bottom: 15px;
          font-size: 14px;
          color: #666666;
          text-align: right;
          padding-right: 15px;
          span {
            font-size: 18px;
            color: #0986ff;
          }
        }
      }
    }
  }
}
</style>
