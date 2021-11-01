
export const brandStandardsAdd = {
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 添加弹框
    const popOptionsAdd = {
      itemType: 'dialog',
      visible: false,
      title: '新增项目',
      customClass: 'popOptionsClass',
      ok: params => {
        let tamp = false
        // const tabData = this.$refs.branPop.$refs.popComponents.form.model.qaFinishedFabricPhysicalBrandStandardItemsList
        const tabData = this.$utils.deepClone(this.$refs.branPop.$refs.popComponents.form.model.qaFinishedFabricPhysicalBrandStandardItemsList || {})

        // 组装一级二级项目数据
        const datas = []
        for (let i = 0; i < params.secondItem.length; i++) {
          const item = params.secondItem[i]
          datas.push({
            firstOrders: params.firstItem.orders,
            firstItemsName: params.firstItem.name,
            firstItemsId: params.firstItem.id,
            secondardItemsName: item.name,
            testItemsId: item.id,
            secondardOrders: item.orders,
            claim: item.claim || '',
            remarks: item.remarks || '',
            edit: true
          })
        }
        // 表格已选过，不可重复
        for (let i = 0; i < datas.length; i++) {
          const item = datas[i]
          for (let k = 0; k < tabData.length; k++) {
            const ki = tabData[k]
            if (item.firstItemsId === ki.firstItemsId && item.testItemsId === ki.testItemsId) {
              tamp = true
            }
          }
        }
        if (tamp) {
          return this.$message.error('不能重复添加一级或二级项目')
        }
        const dataList = [
          ...datas
        ]
        // 排序 1、根据一级项目顺序从小到大，在这个基础上进行二级项目顺序从小到大排序；
        // 2、顺序的值在当前功能页签【检测项目】，每个一二级对应一个顺序
        // const tabData = this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList.dataSource
        const Ndata = dataList
        // 排序一级项目
        const result = [...tabData, ...Ndata]
        result.sort(this.sortFn)
        this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList.dataSource = result
        this.popOptionsAdd.visible = false
        this.$message.success('新增成功')
      },
      okText: '保存',
      cancel: params => {
        this.popOptionsAdd.visible = false
      },
      formDatas: {},
      formOptions: {
        inline: true,
        labelWidth: '90px',
        size: 'small',
        popError: true,
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        }
      },
      content: {
        _firstItem: {
          prop: 'firstItem',
          itemType: 'select',
          valueType: 'object',
          filterable: true,
          label: '一级项目',
          itemStyle: { width: '100%' },
          rules: [commonChangeReg],
          dataSource: [],
          change: (value, form, formDatas, setFormDatas, scope) => {
            console.log(value)
            setFormDatas({ secondItem: '' })
            form.clearValidate()
            this.physicalTestItemsLsit({ parentId: value.id }, 1)
          }
        },
        _secondItem: {
          prop: 'secondItem',
          itemType: 'select',
          valueType: 'object',
          // collapseTags: true,
          className: 'secondItemTag',
          multiple: true,
          clearable: true,
          filterable: true,
          label: '二级项目',
          itemStyle: { width: '100%' },
          dataSource: []
        }

      }
    }
    return {
      commonChangeReg,
      popOptionsAdd
    }
  }
}
