<template>
  <div class="userManagement">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- 添加员工按钮 -->
    <div class="button">
      <el-button type="primary">添加员工</el-button>
    </div>
    <!-- 分割线 -->
    <div class="line" />
    <!-- 表格 -->
    <div class="table">
      <cs-custom-table
        :columns="columns"
        :selection="selection"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
    <!-- 定位的关闭按钮 -->
    <div class="close">
      <i class="el-icon-close" @click="closeUserManagement" />
    </div>
  </div>
</template>

<script>
import stateColumn from './state-column'
export default {
  props: {
    flag: {
      type: Boolean
    }
  },
  data() {
    const searchData = [
      {
        prop: 'deparment',
        itemType: 'input',
        label: '员工姓名:',
        placeholder: '请输入员工姓名'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log(params)
        },
        resetHandle: () => {
          console.log('重置')
        }
      }
    ]
    const columns = [
      {
        prop: 'id',
        label: '序号',
        align: 'center',
        sortable: true
        // width: "100"
      },
      {
        prop: 'name',
        label: '姓名',
        // width: "200",
        // sortable: true,
        align: 'center'
      },
      {
        prop: 'loginName',
        label: '登录名',
        // width: "200",
        align: 'center',
        handle: scope => {
          // this.$router.push("/");
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'department',
        label: '所在部门',
        // width: "200",
        align: 'center'
      },
      {
        prop: 'state',
        label: '状态',
        align: 'center',
        // width: '160',
        // editOptions: {
        //   itemType: 'select',
        //   rules: [{ required: true, message: '请选择状态', trigger: ['change'] }],
        //   dataSource: [{
        //     value: '2',
        //     label: '成功'
        //   }, {
        //     value: '1',
        //     label: '失败'
        //   }]
        // },
        components: {
          stateColumn
        },
        componentsOptions: {
          handle: () => {
            console.log()
          }
        }
      }
    ]
    const dataSource = [
      {
        id: 1,
        name: '王小虎1',
        loginName: 'zhangsan',
        department: 'IT部',
        state: '2'
      },
      {
        id: 2,
        name: '王小虎2',
        loginName: 'zhangsan',
        department: 'IT部',
        state: '2'
      },
      {
        id: 3,
        name: '王小虎3',
        loginName: 'zhangsan',
        department: '财务部',
        state: '1'
      }
    ]
    const popOperates = {
      label: '操作',
      width: '50',
      dataSource: [
        {
          label: '移除',
          isShow: true,
          handle: params => {
            console.log(params)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        }
      ]
      // components: { operatesColumn }
    }
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    const pagination = {
      currentPage: 1,
      pageSize: 15,
      dataTotal: dataSource.length,
      // layout: 'prev, pager, next, jumper, total',
      currentChange: val => {
        this.currentChange(val)
      }
    }
    return {
      formOtions: {
        inline: true
      },
      searchData,
      columns,
      dataSource,
      pagination,
      selection,
      popOperates
    }
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 修改按钮
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 关闭用户管理
    closeUserManagement() {
      this.$emit('closeUser', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.userManagement {
  padding: 20px;
  position: relative;

  .button {
    margin-top: 76px;
    margin-bottom: 10px;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: #ccc;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 10px;

    i {
      font-size: 30px;
      font-weight: 700;
      cursor: pointer;
    }
  }
}
</style>
