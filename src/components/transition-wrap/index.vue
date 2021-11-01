/**
 * @Description:
 * @author 郑君文 马贝儿
 * @date 2021-06-09
*
参数备注
width=>左边list宽度
height=> 内容区距离浏览器顶部高度
*/
<template>
  <div class="transition-wrap" :class="className" :style="divHeight()">
    <div class="main-wrap">
      <div class="content-wrap">
        <!-- 左边分录列表 -->
        <div
          class="left-cont"
          :class="isShow ? 'show' : ''"
          :style="{ width: isShow ? width : '100%' }"
        >
          <slot name="left" />
        </div>
        <!-- 右边详情 -->
        <div class="right-cont" :class="isShow ? 'show' : ''">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean
    },
    className: {
      type: String
    },
    height: {
      type: String,
      default: '280px'
    },
    width: {
      type: String,
      default: '288px'
    }
  },
  data() {
    return {}
  },
  methods: {
    divHeight() {
      return `min-height: calc((100vh - ${this.height}));`
    },
    // divRHeight() {
    //   return `height:100%`
    // },
    // divWidth() {
    //   if (this.isShow) {
    //     return `width: 100%`
    //   }
    //   return `width: 0;`
    // },
    rowclick() {
      this.$emit('isShow', !this.isShow)
    }
  }
}
</script>
<style lang="scss" scoped>
.transition-wrap {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  .content-wrap {
    display: flex;
    .left-cont {
      width: 100%;
      transition: all 0.3s;
    }
    .left-cont.show {
      transition: all 0.3s;
    }
    .right-cont {
      position: relative;
      width: 0;
      display: none;
      transition: all 0.3s;
      border-left: 1px solid #eeeff0;
    }
    .right-cont.show {
      width: 100%;
      display: inline-block;
      transition: all 0.3s;
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
<style lang="scss">
.transition-wrap {
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #f5f5f5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #c8c8c8;
    &:hover {
      background-color: #888;
    }
  }
}
</style>
