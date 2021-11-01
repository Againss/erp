<!--
 * @Date: 2021-02-22 10:39:24
 * @Author: Againss
 * @LastEditTime: 2021-02-22 18:59:50
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <el-popover
    v-model="visible"
    placement="top"
    width="200"
    trigger="click"
    @show="showclick"
  >
    <div :style="colorstyle">
      {{ tip }}
    </div>
    <span slot="reference" class="link">
      {{ value }}
    </span>
  </el-popover>
</template>

<script>
// import { getColor } from '@/views/product-center/yarn-management/natural-fiber/api'
export default {
  props: {
    value: {
      type: String
    },
    scope: {
      type: Object
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      colorstyle: {
        width: '96%',
        height: '100px',
        textAlign: 'center',
        lineHeight: '100px'
      },
      visible: false,
      tip: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(this.data, this.scope)
      }
    }
  },
  methods: {
    showclick() {
      console.log(this.data, this.scope)
      // const res = await getColor({ code: this.value })
      if (this.data && this.data.dataColor || this.scope && this.scope.row.dataColor) {
        this.colorstyle = {
          width: '96%',
          height: '150px',
          background: `rgb(${this.data && this.data.dataColor.sr || this.scope.row.dataColor.sr},${this.data && this.data.dataColor.sg || this.scope.row.dataColor.sg},${this.data && this.data.dataColor.sb || this.scope.row.dataColor.sb})`,
          display: 'block'
        }
      } else {
        this.tip = '无颜色信息'
      }
    }

  }

}
</script>

<style lang="scss" scoped>
.link {
  color: #1890ff !important;
  cursor: pointer;
}
/deep/.el-popover {
  padding-left: 12px !important;
}
</style>
