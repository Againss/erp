<!--
 * @Author: Sanmao
 * @Date: 2021-06-21 10:43:08
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-16 17:50:05
 * @Descripttion: 图片查看
-->
<template>
  <div class="upload-slot-trigger">
    <el-image
      v-if="jacquardPicUrl || false"
      lazy
      fit="contain"
      :class="componentsOptions.className || ''"
      :preview-src-list="[jacquardPicUrl || '']"
      :src="jacquardPicUrl || ''"
    />
    <!-- <div v-if="componentsOptions.canDel && jacquardPicUrl" class="del-img" @click="delImg">删除</div> -->
  </div>
</template>
<script>
export default {
  name: 'UploadImgSlot',
  props: {
    componentsOptions: {
      type: Object
    },
    scope: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  computed: {
    jacquardPicUrl: function() {
      const url = (this.scope && this.scope.row && this.scope.row.showUrl) || this.componentsOptions.imgUrl
      return url
    }
  },
  methods: {
    /**
     * @description: 删除图片
     * @param {*}
     * @return {*}
     */
    delImg() {
      this.$confirm('此操作删除此图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.componentsOptions.delImg && this.componentsOptions.delImg()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<!---
<style lang="scss" scoped>
.upload-slot-trigger {
  .del-img {
    background-color: #f9fafc;
    height: 32px;
    line-height: 32px;
    color: red;
    text-align: center;
    cursor: pointer;
  }
}
</style>
-->
