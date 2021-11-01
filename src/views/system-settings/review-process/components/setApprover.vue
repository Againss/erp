<template>
  <div id="SetApprover">
    <div class="sub-title">
      {{ type === "2" ? "设置审批人" : "设置抄送人" }}
    </div>
    <div class="select-person">
      <el-form v-if="type === '2'" ref="nameForm" :model="nameForm" :rules="rules" label-width="100px">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="nameForm.name" maxlength="12" @change="reception('title', nameForm.name)" />
        </el-form-item>
      </el-form>
      <div class="main">
        <el-button class="select-person-btn" @click="showUserPop">选择成员</el-button><span class="main-tip">（最多选择5人）</span>
      </div>
      <div class="tags">
        <template>
          <el-button
            v-for="(item, index) in userList"
            :key="index"
          ><span>{{ item.realName }}</span><i
            class="el-icon-close"
            @click="del(item, index)"
          /></el-button>
        </template>
      </div>
    </div>
    <template v-if="type === '2' && userList.length > 1">
      <div class="sub-title">多人审批时的审批方式</div>
      <div class="select-way column">
        <el-radio-group v-model="opera" @change="reception('opera', opera)">
          <el-radio :label="0">会签（必须所有审批人审批通过）</el-radio>
          <el-radio :label="1">或签（一名审批人员同意或者拒绝即可）</el-radio>
        </el-radio-group>
      </div>
    </template>
    <template v-if="type === '2'">
      <div class="sub-title" style="margin-top: 20px;">审批通过是否通知发起人</div>
      <div class="select-way column">
        <el-radio-group v-model="notifyApplyUser" :disabled="msgNotifyType!==2" @change="reception('notifyApplyUser', notifyApplyUser)">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
    </template>
    <!-- 添加成员 -->
    <cs-custom-pop ref="add" :options="popOptions" />
  </div>
</template>

<script>
import * as api from '../api/index.js'
export default {
  name: 'SetApprover',
  filters: {
    // filterName(val) {
    //   if (val) {
    //     return val
    //   }
    // }
  },
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择员工',
      width: '720px',
      okText: '保存',
      modalAppendToBody: false,
      modal: false,
      ok: params => {
        if (params.user.length > 5) {
          this.$message({
            message: '最多只能选择5个成员',
            type: 'warning'
          })
          return
        } else if (params.user.length === 0) {
          this.$message({
            message: '请选择成员',
            type: 'warning'
          })
          return
        }
        this.userList = params.user.map(item => {
          return {
            realName: item.realName || item.name,
            userId: item.userId,
            org: this.sortDepartment(item),
            userAvatar: item.avatar
          }
        })
        this.reception('person', this.userList)
        this.$set(this.popOptions.formDatas, 'user', this.userList)
        this.$set(this.popOptions, 'visible', false)
        // this.saveUser({ ruleId: this.ruleId, addUsers, deleteUsers })
      },
      cancel: params => {
        this.$set(this.popOptions.formDatas, 'user', [])
        this.$set(this.popOptions, 'visible', false)
        // this.userValue = ''
      },
      formDatas: {
        user: []
      },
      formOptions: {
        className: 'pop-table'
        // labelWidth: '0px'
      },
      content: [
        {
          prop: 'user',
          itemType: 'table-search',
          tooltipEffect: 'light',
          pagination: {
            // currentPage: 1,
            // pageSize: 20,
            // dataTotal: dataSource.length,
            layout: 'pager',
            currentChange: val => {
              this.getUserPage({ pageSize: 20, pageNum: val })
            },
            sizeChange: val => {
              // this.getUserPage({ pageNum: this.userPagination.pageNum || 1, pageSize: val })
            }
          },
          // label: '表格数据',
          // labelWidth: '0',
          tableOptions: {
            rowKey: 'userId',
            useDefaultOperate: true,
            headerCellStyle: { 'background-color': '#F5F7FA' },
            span: [14, 10],
            operates: {
              label: '选择'
            },
            selectedType: 'object',
            isPopTable: false,
            selectedTitle: '已选择',
            selectTitle: '全部员工',
            needSearch: true,
            tooltipEffect: 'light',
            props: { label: 'info' },
            dataSource: [],
            checkedTagsRenderContent: (item) => { return this.checkedTagsRenderContent(item) },
            columns: [
              {
                prop: 'realName',
                label: '姓名',
                width: '80px',
                showOverflowTooltip: true,
                formater: scope => {
                  // console.log('姓名', scope)
                  if (scope.row.isEnabled === 1) {
                    return scope.row[scope.column.property]
                  } else if (scope.row.isEnabled === 0) {
                    return `<span style="color: #FE4949">！</span>${scope.row[scope.column.property]}`
                  }
                }
              },
              {
                prop: 'orgs',
                label: '部门',
                showOverflowTooltip: true,
                formater: scope => {
                  const orgs = scope.row[scope.column.property]
                  return orgs && orgs.length !== 0 ? orgs.map(item => item.name).join(' / ') : ''
                }
              }
            ]
          },
          searchOptions: {
            inputChange: (value) => {
              this.userValue = value
              if (!this.getData) {
                this.getData = this.$utils.debounce(this.getUserPage, 300)
              }
              this.getData({ realName: value })
            },
            type: 'textarea'
          }
        }
      ]
    }
    return {
      opera: 0,
      popOptions,
      type: undefined,
      notifyApplyUser: -1,
      nameForm: {
        name: ''
      },
      userValue: '',
      userList: [], // 存放选中员工的信息
      rules: {
        name: [{
          trigger: 'blur',
          required: true,
          message: '请输入节点名称'
        }]
      }
    }
  },
  computed: {
    msgNotifyType() {
      return this.$attrs.options.msgNotifyType
    }
  },
  watch: {
    msgNotifyType: {
      handler(v) {
        if (this.$attrs.options.formDatas.data.notifyApplyUser || this.$attrs.options.formDatas.data.notifyApplyUser === 0) {
          this.notifyApplyUser = this.$attrs.options.formDatas.data.notifyApplyUser
        } else {
          this.notifyApplyUser = v === 0 ? 1 : 0
        }
        this.reception('notifyApplyUser', this.notifyApplyUser)
      },
      deep: true
    }
  },
  created() {
    this.reception = this.$attrs.options.componentsOptions.get
    const formDatas = this.$attrs.options.formDatas.data
    this.type = this.$attrs.options.formDatas.type
    this.nameForm.name = this.$attrs.options.formDatas.title
    const property = Object.keys(formDatas)
    this.userList = []
    if (property.length) {
      for (let i = 0; i < property.length; i++) {
        if (property[i] === 'opera') {
          this.opera =
            formDatas['opera'] || formDatas['opera'] === 0
              ? formDatas['opera']
              : undefined
        } else if (property[i] !== 'notifyApplyUser') { // 抄送人和审批人字段名不同
          formDatas[property[i]].forEach((el) => {
            this.userList.push(el)
          })
        }
      }
    }
    this.reception('opera', this.opera)
    this.reception('person', this.userList)
  },
  methods: {
    showUserPop() {
      this.getUserPage()
    },
    async getUserPage(data = {}) {
      const res = await api.userPageList({ ...data, requireOrgFlag: 1, requireDataGroupFlag: 1, realName: this.userValue || '' })
      if (res.code === 200) {
        var tempUserList = res.data.list || []
        // for (let i = 0; i < tempUserList.length; i++) {
        //   tempUserList[i].realName = tempUserList[i].realName || tempUserList[i].name
        // }
        this.$set(this.popOptions.content[0].tableOptions, 'dataSource', tempUserList)
        this.$set(this.popOptions.content[0], 'pagination', {
          ...this.popOptions.content[0].pagination,
          dataTotal: res.data.total || 0,
          // ...data,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        })
      }
      this.$set(this.popOptions.formDatas, 'user', this.userList)
      this.$set(this.popOptions, 'visible', true)
    },
    checkedTagsRenderContent(item) {
      return `<div class="custom-tree-node"><span class="spot" title="${this.sortDepartment(item)}">${item.realName || item.name} ${this.sortDepartment(item)}<span></div>`
    },
    del(item, index) {
      this.userList.splice(index, 1)
      if (this.userList.length <= 1) {
        this.reception('opera', undefined)
      }
    },
    // 部门一行显示 没有部门
    sortDepartment(data) {
      if (data.orgs && data.orgs.length !== 0) {
        return `（ ${data.orgs && data.orgs.map(item => item.name).join(' / ')} ）`
      } else if (data.orgList && data.orgList.length !== 0) {
        return `（ ${data.orgList && data.orgList.map(item => item.name).join(' / ')} ）`
      } else {
        return data.org || ''
      }
    }
  }
}
</script>

<style  lang="scss">
#SetApprover {
  .el-button,
  .el-button + .el-button {
    margin: 0;
    margin-right: 10px;
  }
  .el-tree {
    max-height: 500px;
    overflow-y: scroll;
    .el-tree-node {
      border-bottom: 1px solid #eeefef;
      line-height: 36px;
    }
    .el-tree-node__expand-icon.is-leaf {
      display: none;
    }
  }
  .el-input.el-input--small .el-input__inner {
    width: 80%;
    border-color: #0986ff;
  }
  .el-tree-node__content {
    line-height: 36px;
    height: 36px;
  }
  .tip {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style lang="scss" scoped>
#SetApprover {
  padding:0 20px;
  .sub-title {
    color: #151222;
    font-size: 16px;
    // font-weight: bold;
    border-bottom: 1px solid #e9eff2;
    padding: 5px 0 16px 0;
  }
  .select-way,
  .select-person {
    padding-top: 20px;
    .select-person-btn {
      color: #0986ff;
      border-color: #0986ff;
    }
     .select-person-btn.el-button{
       margin-bottom:2px
     }
  }
  .select-person {
    .main {
      // margin-bottom: 10px;
      .main-tip {
        font-size: 14px;
        color: #474747;
      }
    }
    .tags {
      margin-bottom: 20px;
      .el-button {
        margin-top: 10px;
        position: relative;
        height:28px;line-height:28px;
        padding-top:0;padding-bottom:0;
        span {
          display: inline-block;
          margin-right: 10px;
        }
        .el-icon-close {
          top:6px;
          right: 5px;
          position: absolute;
        }
      }
    }
  }
  .select-way {
    font-size: 14px;
    .el-radio {
      line-height: 14px;
      margin-bottom: 15px;
    }
    &.column .el-radio {
      display: block;
    }
  }
}
</style>
