<template>
  <div
    class="number-info-main"
    @mouseenter="showInfoTable"
    @mouseleave="hideInfoTable"
  >
    <span> {{ entity.materiel }}</span>
   <div class="info-table-wrap" :style="infoTabStyle">
      <table class="info-table">
          <tr>
            <td colspan="2">S080CVCFC0002</td>
          </tr>
          <tr>
            <td>纱线类型：棉</td>
            <td>纱织：80</td>
          </tr>
          <tr>
            <td>成份/组合成份：棉/涤纶</td>
            <td>股数：单纱</td>
          </tr>
          <tr>
            <td>梳棉方法：精梳</td>
            <td>捻向：反捻</td>
          </tr>
          <tr>
            <td>纺纱方法：环锭纱</td>
            <td>纱类：AB</td>
          </tr>
          <tr>
            <td>染色适应性：坯漂白</td>
            <td>纱线等级：A</td>
          </tr>
          <tr>
            <td>比例：棉(20%)涤纶(80%)</td>
            <td>染纱颜色：蓝色</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    form: {
      type: Object
    },
    formDatas: {
      type: Object
    }
  },
  data () {
    return {
      entity: {},
      infoTabStyle: {}
    }
  },
  methods: {
    showInfoTable (el) {
      console.log(el)
      this.infoTabStyle = {
        display: 'block'
      }
    },
    hideInfoTable () {
      /*   setTimeout(() => {
          this.infoTabStyle = {
            display: 'none'
          }
          console.log("hideInfoTable", this.infoTabStyle)
        }, 1000) */
    }
  },
  mounted () {
    this.entity = this.scope.row
    // console.log(this.entity)
  }
}
</script>
<style lang="scss" scoped>
.number-info-main {
  position: static;
  .info-table-wrap {
    width: 500px;
    border: solid 1px #ddd;
    display: block;
    overflow: visible !important;
    position: absolute;

    left: 0;
    top: 50px;
    z-index: 100;
    background: #ffffff;
  }
  .info-table {
    padding: 5px;
    width: 100%;
    tr {
      width: 100%;
      td,
      th {
        padding: 5px;
      }
    }
  }
  span.number {
    color: blue;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
