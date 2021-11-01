<!--
 * @Descripttion:
 * @Author: ll
 * @Date: 2020-01-13
 * @LastEditors: Againss
 * @LastEditTime: 2021-07-08 16:05:38
 * 点击智布色号的放大缩小功能 最大值3倍的放大和缩小
-->

<template>
  <div class="preview">
    <el-popover
      placement="top"
      width="100%"
      :key="scope.$index"
      trigger="click"
    >
      <el-row>
        <el-col>
          <div class="title">智布花号<el-button class="el-icon-zoom-in" size="mini" @click="bigClick" :disabled="ratio >= 3"></el-button><el-button class="el-icon-zoom-out" size="mini" @click="smallClick" :disabled="ratio <= 1"></el-button></div>
          <!-- <div class="color-item" v-for="(item, index) in stripeSpacing">
            <div class="color-bar" :key="index" :style="{ 'background-color': item.colorValue, height: item.height * ratio + 'cm'}" ></div>
            <div>{{ item.colorName + item.height + 'cm' }}</div>
          </div> -->
          <div class="pic-item">
            <img :style="{ height: 4 * ratio + 'cm', width: 4 * ratio + 'cm' }" :src="printColorUrl" alt="">
          </div>
          <div>{{ getFabricFlowerNo }}</div>
        </el-col>
      </el-row>
      <span class="colorName" slot="reference" size="small" @click="getFlowerNoUrlClick">{{ getFabricFlowerNo }}</span>
    </el-popover>
  </div>
</template>

<script>
import { queryFlowerNoPage } from '../api/index'
export default {
  name: 'PicPreview',
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      ratio: 1,
      printColorUrl: ''
    }
  },
  computed: {
    getFabricFlowerNo() {
      return this.scope.row && this.scope.row.flowerNo ? this.scope.row.flowerNo : ''
    }
  },
  methods: {
    getFlowerNoUrlClick() {
      this.ratio = 1
      if (this.scope.row.flowerNo) {
        this.getFlowerNoUrl({ fabricFlowerNo: this.scope.row.flowerNo})
      } else {
        this.printColorUrl = ''
      }
    },
    // 获取智布花号对应的图片url
    async getFlowerNoUrl(data = {}) {
      const res = await queryFlowerNoPage(data)
      if (this.$pub.responseValidate(res)) {
        const arr = res.data.list || []
        this.printColorUrl = arr.length && arr[0].printColorDesign ? arr[0].printColorDesign : ''
      }
    },
    bigClick() {
      if (this.ratio < 3) {
        this.ratio += 1
      }
    },
    smallClick() {
      if (this.ratio > 1) {
        this.ratio -= 1
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>
.preview {
  .colorName {
    color: rgb(24, 144, 255);
    cursor: pointer;
  }
}
.title {
  margin-bottom: 10px;
  .el-button {
    margin-left: 10px;
  }
}
.pic-item {
  display: flex;
}
</style>