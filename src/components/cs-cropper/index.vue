/**
 * @Description: 公共图片裁剪
 * @author Roman
 * @date 2021-08-04 15:42:54
 * @edit 2021-08-04 15:42:54
 ***
    img	裁剪图片的地址	空	url 地址 || base64 || blob
    outputSize	裁剪生成图片的质量	1	0.1 - 1
    outputType	裁剪生成图片的格式	jpg (jpg 需要传入jpeg)	jpeg || png || webp
    info	裁剪框的大小信息	true	true || false
    canScale	图片是否允许滚轮缩放	true	true || false
    autoCrop	是否默认生成截图框	false	true || false
    autoCropWidth	默认生成截图框宽度	容器的80%	0~max
    autoCropHeight	默认生成截图框高度	容器的80%	0~max
    fixed	是否开启截图框宽高固定比例	true	true | false
    fixedNumber	截图框的宽高比例	[1, 1]	[宽度, 高度]
    full	是否输出原图比例的截图	false	true | false
    fixedBox	固定截图框大小 不允许改变	false	true | false
    canMove	上传图片是否可以移动	true	true | false
    canMoveBox	截图框能否拖动	true	true | false
    original	上传图片按照原始比例渲染	false	true | false
    centerBox	截图框是否被限制在图片里面	false	true | false
    high	是否按照设备的dpr 输出等比例图片	true	true | false
    infoTrue	true 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
    maxImgSize	限制图片最大宽度和高度	2000	0-max
    enlarge	图片根据截图框输出比例倍数	1	0-max(建议不要太大不然会卡死的呢)
    mode	图片默认渲染方式	contain	contain , cover, 100px, 100% auto
***
*/
<template>
  <div>
    <div style="height: 300px;width: 640px" :style="option.style">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :output-size="option.size"
        :output-type="option.outputType"
        :info="true"
        :full="option.full"
        :can-move="option.canMove"
        :can-move-box="option.canMoveBox"
        :fixed-box="option.fixedBox"
        :original="option.original"
        :auto-crop="option.autoCrop"
        :auto-crop-width="option.autoCropWidth"
        :auto-crop-height="option.autoCropHeight"
        :center-box="option.centerBox"
        :high="option.high"
        :info-true="option.infoTrue"
        :max-img-size="option.maxImgSize"
        :enlarge="option.enlarge"
        :mode="option.mode"
        :limit-min-size="option.limitMinSize"
        @realTime="realTime"
        @imgLoad="imgLoad"
        @cropMoving="cropMoving"
      />
    </div>
    <div class="cropper-footer">
      <el-button @click="refreshCrop">刷新</el-button>
      <el-button @click="changeScale(1)">+</el-button>
      <el-button @click="changeScale(-1)">-</el-button>
      <el-button @click="rotateLeft">左转</el-button>
      <el-button @click="rotateRight">右转</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CsCropper',
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      option: {
        img: '',
        size: 1,
        full: false,
        outputType: 'png',
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 150,
        centerBox: false,
        high: false,
        cropData: {},
        enlarge: 1,
        mode: 'contain',
        maxImgSize: 3000,
        limitMinSize: [100, 120]
      }
    }
  },

  computed: {
  },
  watch: {
    options: {
      handler(newData, oldData) {
        if (newData) {
          this.option = { ...this.option, ...newData.cropperOptions }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.options.cropperOptions.getCropFile && this.options.cropperOptions.getCropFile(this.getCropFile)
  },
  methods: {
    getCropFile() {
      return new Promise((resolve, reject) => {
        this.$refs.cropper.getCropBlob((blob) => {
          blob.uid = this.$utils.createUniqueString()
          const name = this.options.cropperOptions.raw.name
          blob.name = name
          const file = {
            status: 'ready',
            name,
            size: blob.size,
            percentage: 0,
            uid: blob.uid,
            raw: blob,
            url: window.URL.createObjectURL(blob)
          }
          resolve(file)
        })
      })
    },
    refreshCrop() {
      this.$refs.cropper.refresh()
    },
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    realTime(data) {
      var previews = data
      var h = 0.5
      var w = 0.2

      this.previewStyle1 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: h
      }

      this.previewStyle2 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: w
      }

      this.previewStyle3 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: (100 / previews.w)
      }

      this.previewStyle4 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: (100 / previews.h)
      }

      this.previews = data
    },
    imgLoad(msg) {
      console.log(msg)
    },
    cropMoving(data) {
      this.option.cropData = data
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper-footer{margin-top: 10px; text-align: center}
</style>
