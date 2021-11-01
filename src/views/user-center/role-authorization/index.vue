<template>
  <div class="roleAuthorization">
    <div class="roleHeader">
      <span class="roleText"><span>{{ appSystemName + ':' }}</span></span>
      <span class="roleText nameText"><span>{{ roleName }}</span></span>
      <div class="authorize-button">
        <el-button v-permission="['userCenter:sysRole:permit:modify']" size="small" type="primary" @click="saveRoleAuthorization">保存</el-button>
        <el-button size="small" @click="$router.back()">返回</el-button>
      </div>
    </div>
    <!-- tab切换 -->
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="功能授权" name="1" />
      <!-- <el-tab-pane label="字段加密" name="2" /> -->
    </el-tabs>
    <!-- 授权表单显示树形结构 -->
    <div v-show="activeName==='1'" class="search" style="padding-top: 5px;">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 加密表单显示树形结构 -->
    <div v-show="activeName==='2'" class="search">
      <cs-custom-form ref="searchForm" :data-source="authorizationSearchData" :options="authorizationFormOtions" :form-datas="authorizationFormDatas" />
    </div>
  </div>
</template>

<script>
import { rolePermitList, rolePermitModify } from './api/index.js'
import { sysPermitList } from '../menu-management/api/index.js'
import { roleInfo } from '../role-management/api/index.js'
import { sysDataMaskingRuleList } from '../business-field-encryption-settings/api/index.js'
export default {
  data() {
    // 授权多选框点击按钮事件
    const authorizationChange = (value, form, formDatas, setFormDatas) => {
      // console.log('authorization', value)
      this.saveAuthorizationList = value
    }
    const encryptionRulesChange = value => {
      // console.log(value)
      this.encryptionRulesList = value
    }
    // 授权表单 只有树 不带查询/重置按钮内容
    const searchData = [
      {
        prop: 'role',
        itemType: 'tree',
        label: '',
        labelWidth: '0',
        change: authorizationChange,
        popoverOptions: {
          width: '800',
          title: '选择角色'
        },
        treeOptions: {
          nodeKey: 'permitId',
          // defaultExpandAll: false,
          // defaultExpandedKeys: [9999],
          props: {
            label: 'name',
            children: 'child'
          },
          showCheckbox: true,
          isPopTree: false,
          treeSelectTitle: '',
          span: [24, 0],
          checkNeedChild: true,
          // treeSelectedTitle: '已选择',
          selectedHidden: true,
          data: []
        },
        placeholder: '请选择部门'
      }
    ]
    // 表单 只有树 不带查询/重置按钮内容
    const authorizationSearchData = [
      {
        prop: 'role',
        itemType: 'tree',
        label: '',
        labelWidth: '0',
        // width: '200px',
        change: encryptionRulesChange,
        popoverOptions: {
          // width: '800',
          title: '选择角色'
        },
        treeOptions: {
          nodeKey: 'ruleId',
          props: {
            label: 'ruleName',
            children: 'child'
          },
          showCheckbox: true,
          isPopTree: false,
          treeSelectTitle: '请选择',
          span: [24, 0],
          // treeSelectedTitle: '已选择',
          selectedHidden: true,
          data: [
            // {
            //   permitId: '-1',
            //   ruleName: '选择字段加密规则',
            //   hiddenCheckBox: true,
            //   child: []
            // }
          ]
        },
        placeholder: '请选择部门'
      }
    ]
    return {
      searchData,
      authorizationSearchData,
      formOtions: {
        // inline: true
      },
      authorizationFormOtions: {},
      formDatas: {},
      authorizationFormDatas: {},
      appSystemName: '',
      roleName: '',
      // appSystemId: null,
      roleId: null,
      authorizationList: [],
      saveAuthorizationList: [],
      encryptionRulesList: [],
      activeName: '1',
      allPermissionsList: {},
      allRuleList: {},
      rowInfoMessages: {}
    }
  },
  created() {
    this.getRoleId()
  },
  methods: {
    // 保存按钮事件
    saveRoleAuthorization() {
      // console.log(this.$refs.searchForm.dynamicValidateFormRuleForm)
      // const permitIds = this.$refs.searchForm.dynamicValidateFormRuleForm.role
      const addPermitIds = this.saveAuthorizationList.filter(item => !this.authorizationList.includes(item))
      const deletePermitIds = this.authorizationList.filter(item => !this.saveAuthorizationList.includes(item))
      this.editRolePermissions({ ruleIds: this.encryptionRulesList, addPermitIds, deletePermitIds })
    },
    // 修改角色拥有权限
    async editRolePermissions(data = {}) {
      const res = await rolePermitModify({ roleId: this.roleId, ...data })
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, { ...data, roleId: this.roleId }, 'roleId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      // this.fetchLog(this.logModifyMessages, data, JSON.stringify({ beforeText: `在'角色授权'将${JSON.stringify({ 'roleId': this.roleId })}`, afterText: '修改为', beforeCode: this.rowInfoMessages, afterCode: { permitIds: this.saveAuthorizationList, ruleIds: data.ruleIds }}))
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysRole/permit/modify'), data, JSON.stringify({ beforeText: `在'用户中心-角色管理-角色授权'将${JSON.stringify({ roleId: this.roleId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.$message.success('保存成功')
      this.$router.back()
    },
    // 获取所有权限
    async getAllPermissions(data = {}) {
      // console.log(this.appSystemId)
      // 3. 根据id获取信息里面的 appSystemId
      const res = await sysPermitList({ appSystemId: data })
      // const res = await sysPermitList(data)
      console.log('所有权限', res)
      const dataList = res.data.list || []
      this.allPermissionsList = dataList
      // console.log('111', this.recursionPermissions(dataList))
      if (dataList[0].name.indexOf('大布行') > -1) {
        this.$set(this.searchData[0].treeOptions, 'defaultExpandedKeys', [dataList[0].permitId])
        this.$set(this.searchData[0].treeOptions, 'defaultExpandAll', false)
      } else {
        this.$set(this.searchData[0].treeOptions, 'defaultExpandAll', true)
      }
      this.$set(this.searchData[0].treeOptions, 'data', this.recursionPermissions(dataList))
      // this.getRoleId()
    },
    // 获取路由id
    getRoleId() {
      const roleId = this.$route.params.id
      // console.log('roleId', roleId)
      this.roleId = roleId
      this.getRoleInfo(roleId)
      // this.getRolePermissions(roleId)
    },
    // 根据用户id获取角色详情
    async getRoleInfo(roleId) {
      const res = await roleInfo({ roleId })
      // console.log('角色详情', res)
      const dataList = res.data || []
      // this.appSystemId = dataList.appSystemId
      this.appSystemName = dataList.appSystemName
      this.roleName = dataList.name
      // await this.getAllPermissions(dataList.appSystemId)
      const appSystemIds = []
      appSystemIds[0] = dataList.appSystemId
      // await this.getAllRuleList(appSystemIds)
      const roleIds = []
      roleIds[0] = this.roleId
      Promise.all([this.getAllPermissions(dataList.appSystemId), this.getAllRuleList(appSystemIds)]).then((res) => {
        // console.log('all', res)
        // 4. 数据回显
        this.getRolePermissions(roleIds)
      })
    },
    // 查询角色拥有权限
    async getRolePermissions(roleIds) {
      const res = await rolePermitList({ roleIds })
      console.log('权限回显数据', res)
      this.rowInfoMessages = res.data
      const permitDataList = res.data.permitIds || []
      const ruleDataList = res.data.ruleIds || []
      this.authorizationList = permitDataList
      this.saveAuthorizationList = permitDataList
      console.log(ruleDataList)
      this.encryptionRulesList = ruleDataList
      this.$set(this.formDatas, 'role', permitDataList)
      this.$set(this.authorizationFormDatas, 'role', ruleDataList)
    },
    // 给按钮类型添加 isLayout: true
    recursionPermissions(array) {
      function recursion(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].type === 'B') {
            array[i].isLayout = true
          }
          if (array[i].child) {
            recursion(array[i].child)
          }
        }
        return array
      }
      return recursion(array)
    },
    // tab切换点击事件
    handleClick(tab, event) {
      // console.log(tab, event)
      // console.log(this.activeName)
    },
    // 获取该系统下的加密规则
    async getAllRuleList(data = {}) {
      const res = await sysDataMaskingRuleList({ appSystemIds: data })
      console.log('加密规则', res)

      const dataList = res.data.list || []

      this.allRuleList = dataList.filter(v => v.status === 1)
      // console.log('111', this.recursionPermissions(dataList))
      // this.$set(this.authorizationSearchData[0].treeOptions.data[0], 'child', dataList)
      this.$set(this.authorizationSearchData[0].treeOptions, 'data', dataList.length !== 0 ? [{ permitId: '-1', ruleName: '选择字段加密规则', hiddenCheckBox: true, child: [...this.allRuleList] }] : [])
      // this.getRoleId()
      // const roleIds = []
      // roleIds[0] = this.roleId
      // 4. 数据回显
      // this.getRuleList(roleIds)
    },
    // 传日志信息到卡夫卡
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 日志描述新老数据比对
    compareData(oldData, newData, id) {
      const comparedKeys = Object.keys(newData).filter(item => {
        if (Array.isArray(newData[item])) {
          return JSON.stringify(oldData[item] || []) !== JSON.stringify(newData[item])
        } else {
          return oldData[item] !== newData[item]
        }
      })
      const oldObj = {}
      const newObj = {}
      comparedKeys.forEach(item => {
        oldObj[item] = oldData[item]
        newObj[item] = newData[item]
      })
      // console.log(oldObj, newObj, newData, newData[id])
      // this.idMapping(oldObj, 'permitIds', this.allPermissionsList, 'permitId')
      // this.idMapping(oldObj, 'ruleIds', this.allRuleList, 'ruleId', 'ruleName')
      // this.idMapping(newObj, 'permitIds', this.allPermissionsList, 'permitId')
      // this.idMapping(newObj, 'ruleIds', this.allRuleList, 'ruleId', 'ruleName')
      return {
        beforeCode: { ...oldObj, [id]: newData[id] },
        afterCode: { ...newObj, [id]: newData[id] }
      }
    },
    // 递归查找数据
    recursionFatherOrSon(array, id, key = 'id', name = 'name') {
      const newArray = []
      // const keyId = key || 'id'
      // const keyName = name || 'name'
      // console.log('array', array, id)
      function recursion(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i][key] === id) {
            newArray.push(array[i][name])
            return newArray
          }
          if (array[i].child && array[i].child.length) {
            newArray.push(array[i][name])
            const res = recursion(array[i].child)
            if (res) {
              return res
            } else {
              newArray.splice(newArray.indexOf(array[i][name]), 1)
            }
          }
        }
        return false
      }
      return recursion(array)
    },
    // 结果需要带上父级显示
    idMapping(object, key, allData, id = 'id', name = 'name') {
      // const keyId = id || 'id'
      // const keyName = name || 'name'
      object[key] && (object[key] = object[key].map(item => this.recursionFatherOrSon(allData, item, id, name).join('-')))
    },
    // 获取需要传过去的日志信息
    getLogMessages(opratorType, api) {
      const { userInfo, topic } = this.$store.state.user
      const baseURL = this.$store.state.app.baseURL
      const logcommonMessages = {
        type: 'OP',
        appId: 'userCenter',
        handleResult: 'SUCCESS',
        userId: userInfo.userId,
        realName: userInfo.realName,
        userName: userInfo.name,
        topic: topic,
        description: '',
        createTime: new Date().getTime()
      }
      return {
        ...logcommonMessages,
        opratorType: opratorType,
        api: baseURL + api
      }
    }
  }
}
</script>

<style lang='scss'>
.roleAuthorization {
    padding:20px;
    padding-bottom: 0;

    .roleHeader {
        height: 60px;
        background-color: #fff;
        // border-radius: 5px;
        border-bottom: 1px solid #EEEFF0;
        display: flex;
        align-items: center;
        // margin-bottom: 10px;
    }

    .roleText {
      font-size: 18px;
      margin-left: 20px;

      .fontWeight {
        font-weight: 700;
      }
    }

    .nameText {
        flex:1;
        margin-left: 5px;
    }

    .tabs {
      padding: 10px 20px 0;
      background-color: #fff;
      // .el-tabs__header {
      //   margin-bottom: 0;
      // }
      // .el-tabs__nav-wrap::after {
      //   height: 1px;
      //   background-color: #D0D6DA;
      // }
      // padding: 0 40px;
      .el-tabs__item {
        line-height: 20px;
        font-size: 14px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
    }

    .search {
      padding-bottom: 20px;
      .el-form-item {
        margin-right: 0;
      }
      .is-expanded>.el-tree-node__content {
        padding: 15px 0;
        // width: 100%;
        // border-bottom: 1px solid #EEEFF0;
      }
      .is-expanded>.el-tree-node__children {
        // border-bottom: 1px solid #EEEFF0;
      }
    }

    .authorize-button {
        margin-right: 10px;
    }

  .commonTabs {
    padding: 0 40px;
    .el-tabs__item {
      line-height: 20px;
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
</style>
