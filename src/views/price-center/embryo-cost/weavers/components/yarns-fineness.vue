<template>
  <div>
    <el-form-item
      v-for="(ele, index) in formDatas.yarnsBranch"
      :key="ele.key"
      :label="'纱支' + (index + 1)"
      prop="yarnsBranch"
      class="yarns-fineness"
    >
      <el-select
        v-model="ele.dyedYarn"
        filterable
        placeholder="请选择纱支"
        @change="change"
      >
        <el-option
          v-for="(item, i) in slist"
          :key="i.value"
          :label="item.label"
          :value="item"
          :disabled="item.disabled"
        />
      </el-select>
      <el-button
        v-if="index === 0"
        icon="el-icon-circle-plus-outline"
        @click.prevent="add('yarnsBranch')"
      />
      <el-button
        v-else
        icon="el-icon-remove-outline"
        @click.prevent="remove(index, 'yarnsBranch')"
      />
    </el-form-item>
    <el-form-item
      v-for="(ele, index) in formDatas.fineness"
      :key="ele.key"
      :label="'细度' + (index + 1)"
      prop="fineness"
      class="yarns-fineness"
    >
      <el-select
        v-model="ele.dyedYarn"
        filterable
        placeholder="请选择细度"
        @change="change"
      >
        <el-option
          v-for="(item, i) in xlist"
          :key="i.value"
          :label="item.label"
          :value="item"
          :disabled="item.disabled"
        />
      </el-select>
      <el-button
        v-if="index === 0"
        icon="el-icon-circle-plus-outline"
        @click.prevent="add('fineness')"
      />
      <el-button
        v-else
        icon="el-icon-remove-outline"
        @click.prevent="remove(index, 'fineness')"
      />
    </el-form-item>
  </div>
</template>
<script>
import { getSelectData } from '@/views/price-center/common/basisApi'
export default {
  name: 'YarnsFineness',
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      slist: [],
      xlist: []
    }
  },
  watch: {
    'formDatas.type'(n) {
      if (n === 'edit') {
        // 点击编辑判断 已有值是否被禁用， 禁用了就push一条禁用数据
        // 纱支
        const sid = this.formDatas.yarnsBranch.filter(e => e.dyedYarn).map(e => e.dyedYarn)
        sid.forEach(ele => {
          const ishas = this.slist.find(e => e.value === ele.value)
          if (!ishas) {
            this.slist.push({ ...ele, label: ele.label + '(禁用)', disabled: true })
          }
        })
        // 细度
        const xid = this.formDatas.fineness.filter(e => e.dyedYarn).map(e => e.dyedYarn)
        xid.forEach(ele => {
          const ishas = this.xlist.find(e => e.value === ele.value)
          if (!ishas) {
            this.xlist.push({ ...ele, label: ele.label + '(禁用)', disabled: true })
          }
        })
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    add(name) {
      const value = [...this.formDatas[name]]
      if (value.length > 9) {
        this.$message.error('最多只能添加10个')
        return
      }
      value.push({ dyedYarn: '' })
      this.setFormDatas({ [name]: value })
    },
    remove(i, name) {
      const value = [...this.formDatas[name]]
      if (value[i].dyedYarn.value) {
        this.$confirm('确认删除当前数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          value.splice(i, 1)
        })
      } else {
        value.splice(i, 1)
      }
      this.setFormDatas({ [name]: value })
    },
    async getList() {
      this.slist = await getSelectData({ categoryId: 9 }, { id: '', data: [], type: 'add' })
      this.xlist = await getSelectData({ categoryId: 12 }, { id: '', data: [], type: 'add' })
    },
    change(e) {
      console.log(this.formDatas, e, '23++')
      this.componentsOptions.setDatas(this.formDatas)
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .yarns-fineness {
    .el-form-item__content {
      display: flex;
    }
    .el-select--medium {
      width: -webkit-fill-available;
    }
  }
</style>
