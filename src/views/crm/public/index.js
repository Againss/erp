import { apiIdempotentCreateToken } from "@/views/user-center/department-management/api"

import * as api from './api/index'
import {customerPage} from '../customer/api/index'
import {businessOpportunityPage} from '../business-opportunity/api/index'
import {contactPersonPage} from '../contacts/api/index'
import {competitorPage} from '../competitor/api/index'
import {brandPage} from '../brand-business/api/index'
// import * as businessApi from '../business-opportunity/api/index'
export const PublicCrm = {
    methods: {
        // 修改弹出层的判断
      PopDialogHandle(popOptions, val) {
        this.$set(popOptions, 'visible', !popOptions.visible)
        if (val) {
          this.$set(popOptions, 'title', val)
        }
      },
      // 关闭弹出框
      closePopDialogHandle(popOptions) {
        this.$set(popOptions, 'visible', false)
      },
      // 修改按钮动态重置
      setFormDatas(popOptions, params) {
        // console.log(params)
        setTimeout(() => {
          this.$set(popOptions, 'formDatas', params)
        }, 0)
      },
      // 获取省市区列表
      async getAreaSearch(data = {}, popOptions, num) {
        const res = await api.openapiAreaSearch({...data})
        console.log('省市区列表', res)
        this.areaList = res.data
        popOptions && this.$set(popOptions.content[num], 'dataSource', res.data.filter(item => item.parentId === 0).map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      },
      
      // 省change事件
      provinceChange(value, form, formDatas, setFormDatas) {
        console.log(value)
        setFormDatas && setFormDatas({cityId: '' })
        setFormDatas && setFormDatas({areaId: '' })
        if(value) {
          // const provinceName = this.areaList.filter(item => item.id === value)[0].mergerName
          this.$set(this.popOptions.content[2], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
            return {
              label: item.name,
              value: item.id
            }
          }))
        }
      },

      // 市change事件
      cityChange (value, form, formDatas, setFormDatas) {
        console.log(value)
        // this.$set(this.popOptions.formDatas, 'areaId', null)
        setFormDatas && setFormDatas({areaId: '' })
        // if (value) {
        //   this.getAreaSearch({}, this.popOptions, 3, value)
        // }
        if(value) {
          this.$set(this.popOptions.content[3], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
            return {
              label: item.name,
              value: item.id
            }
          }))
        }
        
      },
      
      // 根据id查省市区详情
      getAreaSearchInfo(data = {}){
        return api.openapiAreaDetail(data)
      },

      // 输入一个数字, 每三位之间加一个逗号, 且保留两位小数
      numRecursion(num, newStr = '') {
        if(!/^[0-9]+.?[0-9]*$/.test(num)) {
            throw '请输入数字'
        }
        function zzz(num) {
            if(num / 1000 >= 1) {
                zzz(parseInt(num / 1000))
                let temp = (num % 1000 + '').padStart(3, '0')
                newStr = newStr + ',' + temp
            } else {
                newStr = num % 1000
            }
            return newStr
        }
        return zzz(parseInt(num)) + '.' + num.toFixed(2).split('.')[1]
      },
      
      // 子组件emit传给父组件的visible
      // visiblePopOption(data) {
      //   console.log(data)
      //   this.visible = data
      // },
      // 更改所有人点击事件
      changeOwnerClick() {
        this.PopDialogHandle(this.OwnerPopOptions, '更改所有人')
      },

      // 远程用户搜索(更改所有人)
      remoteUserSearch(value) {
        // debugger
        // console.log(value)
        if (value === '') {
          this.$set(this.OwnerPopOptions.content[0], 'dataSource', [])
        } else {
          if (!this.getData) {
            this.getData = this.$utils.debounce(this.remoteUserList, 300)
          }
          this.getData({ realName: value, name: value }, 0, this.OwnerPopOptions)
        }
      },

      // 查询用户名
      async remoteUserList(data= {}, num, popOptions) {
        // console.log('111')
        const res = await api.sysUserPage({ ...data, requireOrgFlag: 1 })
        console.log('用户名', res, res.data.list)
        let newArray = []
        if(res.data.list && res.data.list.length > 5) {
          newArray = res.data.list.slice(0,5)
        } else {
          newArray = res.data.list || []
        }
        newArray = newArray.map(item => {
          return {
            value: item.userId,
            label: item.realName + this.orgsLineDisplay(item.orgs)
          }
        })
        this.userList = res.data.list || []
        console.log('111', newArray)
        this.$set(popOptions.content[num], 'dataSource', newArray)
      },

      // 部门一行显示
      orgsLineDisplay(orgs) {
        return (orgs && orgs.length !== 0) ? '(' + orgs.map(item => item.name).join('、') + ')' : ''
      },

      // 查询客户
      async remoteCustomerPage(data= {}, num, popOptions) {
        // console.log('111')
        const res = await customerPage(data)
        // console.log('用户名', res, res.data.list)
        let newArray = []
        if(res.data.list && res.data.list.length > 5) {
          newArray = res.data.list.slice(0,5)
        } else {
          newArray = res.data.list || []
        }
        newArray = newArray.map(item => {
          return {
            value: item.customerId,
            label: item.name
          }
        })
        console.log('222', newArray)
        this.$set(popOptions.content[num], 'dataSource', newArray)
      },

      // 查询商机
      async remoteBusinessPage(data= {}, num, popOptions) {
        // console.log('111')
        const res = await businessOpportunityPage(data)
        // console.log('用户名', res, res.data.list)
        let newArray = []
        if(res.data.list && res.data.list.length > 5) {
          newArray = res.data.list.slice(0,5)
        } else {
          newArray = res.data.list || []
        }
        newArray = newArray.map(item => {
          return {
            value: item.id,
            label: item.name,
            customerName: item.customerName,
            customerId: item.customerId
          }
        })
        console.log('222', newArray)
        this.$set(popOptions.content[num], 'dataSource', newArray)
      },

      // 查询联系人
      async remoteContactsPage(data= {}, num, popOptions) {
        // console.log('111')
        const res = await contactPersonPage(data)
        // console.log('用户名', res, res.data.list)
        let newArray = []
        if(res.data.list && res.data.list.length > 5) {
          newArray = res.data.list.slice(0,5)
        } else {
          newArray = res.data.list || []
        }
        newArray = newArray.map(item => {
          return {
            value: item.contactPersonId,
            label: item.name + (item.customerName ? '(' + item.customerName + ')' : '')
          }
        })
        console.log('222', newArray)
        this.$set(popOptions.content[num], 'dataSource', newArray)
      },
      
      // 查询竞争对手
      async remoteCompetitorPage(data= {}, num, popOptions) {
        // console.log('111')
        const res = await competitorPage(data)
        // console.log('用户名', res, res.data.list)
        let newArray = []
        if(res.data.list && res.data.list.length > 5) {
          newArray = res.data.list.slice(0,5)
        } else {
          newArray = res.data.list || []
        }
        newArray = newArray.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
        console.log('222', newArray)
        this.$set(popOptions.content[num], 'dataSource', newArray)
      },

      // 查询品牌商
      async remoteBrandPage(data= {}, num, popOptions) {
        // console.log('111')
        const res = await brandPage(data)
        // console.log('用户名', res, res.data.list)
        let newArray = []
        if(res.data.list && res.data.list.length > 5) {
          newArray = res.data.list.slice(0,5)
        } else {
          newArray = res.data.list || []
        }
        newArray = newArray.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
        console.log('222', newArray)
        this.$set(popOptions.content[num], 'dataSource', newArray)
      },

      // 附件删除
      async deleteAttachment(data ={}) {
        const res = await api.attachmentDelete(data)
        if (res.code !== 200) {
          return false
        }
        this.$message.success('附件删除成功')
      }
    },
    computed: {}
}