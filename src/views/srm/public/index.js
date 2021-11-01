
import * as api from './api/index'
export const PublicSrm = PublicSrm || {
    methods: {
        /* 获取供应商类型列表 */
        async getSupplierTypeList ({ supplierCategory, status }) {
            let supplierTypeList = []
            const res = await api.getSupplierTypeListData({
                'supplierCategory': supplierCategory,
                'status': status
            })
            if (this.$pub.responseValidate(res)) {
                const list = res.data.list
                if (list && list.length > 0) {
                    supplierTypeList = list
                }
            }
            return supplierTypeList
        },
        converSupplierTypeList (data) {
            if (data && data.length > 0) {
                return data.map((item) => ({ ...item, value: item.id.toString(), label: item.typeName }))
            }
        },
        /* 根据供应商类型查询供应商信息 */
        async getSupplierNameList (state) {
            let supplierNameList = []
            const res = await api.getSupplierNameListData({
                'supplierType': state
            })
            if (this.$pub.responseValidate(res)) {
                const data = res.data
                if (data && data.length > 0) {
                    data.forEach(item => (supplierNameList.push({
                        ...item,
                        value: item.id, label: item.supplierName
                    })))
                }
            }
            return supplierNameList
        },
        converSupplierType (data) {
            if (data && data.length > 0) {
                return data.map(item => ({ ...item, value: item.id.toString(), label: item.typeName }))
            }
        },
        /* 选择评估部门 */
        async getSysOrgList (params = {}) {
            const res = await api.getSysOrgListData(params)
            if (this.$pub.responseValidate(res)) {
                const list = res.data.list || []
                this.sysOrgList = list
            }
        },
        // 判断当前值部门还在不在， 不在就清空重新选
        setFormDatasSysOrg(arr, callback) {
            let list = JSON.parse(JSON.stringify(arr))
            //  递归方法， 用选择的id获取id所在的对象
            const fn = (arr, id) => {
                const v = arr.find(e => e.orgId === id)
                if (v) return v
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].child && arr[i].child.length) {
                        const res = fn(arr[i].child, id)
                        if (res) return res
                    }
                }
                return false
            }
            if (Array.isArray(list)) {
                list.forEach(ele => {
                    const obj = fn(this.sysOrgList, ele.departmentId)
                    if (!obj) {
                        ele.departmentId = ''
                    }
                })
            } else {
                const obj = fn(this.sysOrgList, list)
                list = obj ? list : ''
            }
            callback(list)
        },
        /* 选择用户列表 */
        async getSysUserList (params = {}) {
            let userList = [];
            const res = await api.getSysUserListData(params)
            if (this.$pub.responseValidate(res)) {
                const list = res.data.list || []
                this.sysUserList = list
                userList = list
            }
            return userList;
        },
        /* 付款方式列表 */
        async payWaySource (params = {}) {
            const res = await api.getPaymentData(params)
            let payWayList = []
            if (this.$pub.responseValidate(res)) {
                const list = res.data.list
                if (list && list.length > 0) {
                    this.payWayList = list
                    payWayList = list
                } else {
                    this.payWayList = []
                    payWayList = []
                }
            }
            return payWayList;
        },
        /* 获取等级下拉列表 */
        async getDropDownRankAssess (params = {}) {
            const res = await api.getDropDownRankAssessData(params)
            if (this.$pub.responseValidate(res)) {
                const list = res.data.list
                if (list && list.length > 0) {
                    return list.map(item => ({ value: item.id, label: item.rank }))
                }
            }
        },
        /* 获取考核周期和考核期数 */
        async getSupplierPerformancePeriod2no (params = {}) {
            const res = await api.getSupplierPerformancePeriod2noData(params)
            if (this.$pub.responseValidate(res)) {
                this.period2noList = await this.getPerformancePeriod2no(res.data)
                if (this.period2noList && this.period2noList.length > 0) {
                    this.$set(this.searchData[params.index], 'dataSource', this.period2noList)
                }
            }
        },
        getPerformancePeriod2no (data) {
            const newArr = []
            if (data && data.length > 0) {
                data.forEach(item => {
                    if (item.data && item.data.length > 0) {
                        const child = item.data.map(item => ({ value: item, label: item }))
                        newArr.push({ data: child, value: item.type, label: item.type })
                    }
                })
            }
            return newArr
        },
        /* 操作栏权限过滤 */
        limitsFilter ({ status, limitArr }) {
            return limitArr.some(value => (value === status))
        },
        getPageIndex ({ index = 0, pageSize = 20, currentPage = 1 }) {
            return index + (currentPage - 1) * pageSize + 1
        },
        /* 考核周期列表 */
        async getPublicCycleList (params = {}) {
            let cycleList = []
            const res = await api.getPublicCycleData(params)
            if (this.$pub.responseValidate(res)) {
                const list = res.data.list
                if (list && list.length > 0) {
                    list.forEach(item => cycleList.push(item))
                } else {
                    cycleList = []
                }
            }
            return cycleList
        },
        setTabStyles (data) {
            if (data.length < 20) {
                return { padding: "0 10px 0" }
            }
        },
        /* 获取用户详情 */
        async getSysUserInfo (params = {}) {
            let userInfo = {}
            const res = await api.getSysUserInfoData(params)
            if (this.$pub.responseValidate(res)) {
                res.data && (userInfo = res.data)
                /*  if (orgsList.length > 0) {
                        for (let i = 0; i < orgsList.length; i++) {
                         const item = orgsList[i]
                         newArr.push({
                             value: item.orgId.toString(),
                             label: item.name
                         })
                     }
                 } */
            }
            return userInfo
        },
        /* 获取省市区列表 
          params 传递给给后台的id
          provinceCode:市
          cityCode:区
          textsize：对应模块名称
        */
        async getAreaSearch (params) {
            const res = await api.openapiAreaSearch(params.params)
            this.areaList = res.data
            let sm = res.data.filter(item => item.parentId === 0).map(item => {
                return { label: item.name, value: item.id }
            })
            if (params.textsize == "供应商列表") {
                this.searchData && this.$set(this.searchData[5], 'dataSource', sm)
            } else if (params.textsize == "供应商绩效考核") {
                this.searchData && this.$set(this.searchData[8], 'dataSource', sm)
            } else if (params.textsize == "供应商绩效分析") {
                this.searchData && this.$set(this.searchData[4], 'dataSource', sm)
            }
            this.provinceCodeArray = sm //省
            if (params.provinceCode) {  //市
                this.cityCodeArray =
                    this.areaList.filter(item => item.parentId == params.provinceCode).map(item => {
                        return { label: item.name, value: item.id }
                    })
            }
            if (params.cityCode) { //区
                this.areaCodeArray =
                    this.areaList.filter(item => item.parentId == params.cityCode).map(item => {
                        return { label: item.name, value: item.id }
                    })
            }
        },
        // 省change事件 供应商绩效考核
        provinceChange (value, form, formDatas, setFormDatas) {
            setFormDatas && setFormDatas({ cityCode: '' })
            setFormDatas && setFormDatas({ areaCode: '' })
            if (value) {
                this.$set(this.searchData[9], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
                    return { label: item.name, value: item.id }
                }))
            }
        },
        // 市change事件 供应商绩效考核
        cityChange (value, form, formDatas, setFormDatas) {
            setFormDatas && setFormDatas({ areaCode: '' })
            if (value) {
                this.$set(this.searchData[10], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
                    return { label: item.name, value: item.id }
                }))
            }
        },
        // 省change事件 供应商列表
        provinceChangeOne (value, form, formDatas, setFormDatas) {
            setFormDatas && setFormDatas({ cityCode: '' })
            setFormDatas && setFormDatas({ areaCode: '' })
            if (value) {
                this.$set(this.searchData[6], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
                    return { label: item.name, value: item.id }
                }))
            }
        },
        // 市change事件 供应商列表
        cityChangeOne (value, form, formDatas, setFormDatas) {
            setFormDatas && setFormDatas({ areaCode: '' })
            if (value) {
                this.$set(this.searchData[7], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
                    return { label: item.name, value: item.id }
                }))
            }
        },
        // 省change事件 供应商绩效分析
        provinceChangeTwo (value, form, formDatas, setFormDatas) {
            setFormDatas && setFormDatas({ cityCode: '' })
            setFormDatas && setFormDatas({ areaCode: '' })
            if (value) {
                this.$set(this.searchData[5], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
                    return { label: item.name, value: item.id }
                }))
            }
        },
        // 市change事件 供应商绩效分析
        cityChangeTwo (value, form, formDatas, setFormDatas) {
            setFormDatas && setFormDatas({ areaCode: '' })
            if (value) {
                this.$set(this.searchData[6], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
                    return { label: item.name, value: item.id }
                }))
            }
        },
        //列表拼接后台给的省市区
        JoiningProvincesAndCities (data) {
            let province = "";
            let cityList = "";
            let areaList = "";
            if (this.areaList.length) {
                province = data.province ? this.areaList.filter(item => item.id == data.province)[0] ? this.areaList.filter(item => item.id == data.province)[0].name : "" : ''
                cityList = data.cityList ? this.areaList.filter(item => item.id == data.cityList)[0] ? this.areaList.filter(item => item.id == data.cityList)[0].name : "" : ''
                areaList = data.areaList ? this.areaList.filter(item => item.id == data.areaList)[0] ? this.areaList.filter(item => item.id == data.areaList)[0].name : "" : ''
                return province + cityList + areaList
            }
        }
    },
    computed: {
        getSupplierType () {
            if (this.supplierTypeList && this.supplierTypeList.length > 0) {
                return this.supplierTypeList.map(item => ({ ...item, value: item.id.toString(), label: item.typeName }))
            }
        },
        getSupplierName () {
            const newArr = []
            if (this.supplierNameList && this.supplierNameList.length > 0) {
                this.supplierNameList.forEach(item => (newArr.push({ ...item, value: item.id, label: item.supplierName })))
            }
            return newArr
        },
        /*  付款方式*/
        getPayWayList () {
            if (this.payWayList && this.payWayList.length > 0) {
                return this.payWayList.map(item => ({ ...item, value: item.id, label: item.payWay, disabled: !item.status }))
            }
        }
    }
}
