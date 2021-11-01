<!--
 * @Description: 头像裁剪
 * @Autor: zhengjin
 * @Date: 2021-08-03 10:38:16
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-09 16:21:21
-->

<template>
  <el-dialog
    ref="cuttingImg"
    :title="options.title"
    :visible.sync="options.show"
    :width="options.width || '400px'"
    :top="options.top || '100px'"
    :close-on-click-modal="false"
  >
    <div class="conten">
      <div v-if="!imgs" class="upload">
        <div class="upload-img">
          <cs-custom-form
            ref="avatarForm"
            class="personalData-form"
            :class="{ 'showImg': imgUrl}"
            :data-source="upload"
          />
        </div>
      </div>
      <div v-else class="cropper">
        <vue-cropper
          ref="cropper"
          :img="cutting.img"
          :output-size="cutting.size"
          :output-type="cutting.outputType"
          :info="true"
          :full="cutting.full"
          :high="cutting.high"
          :can-move="cutting.canMove"
          :can-move-box="cutting.canMoveBox"
          :original="cutting.original"
          :auto-crop="cutting.autoCrop"
          :center-box="cutting.centerBox"
          :auto-crop-width="cutting.autoCropWidth"
          :auto-crop-height="cutting.autoCropHeight"
          :fixed-box="cutting.fixedBox"
          @realTime="realTime"
          @imgLoad="imgLoad"
        />
      </div>
      <div class="img">
        <div v-if="imgs" class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px'}">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
        <el-image v-else fit="contain" :src="imgUrl" />
      </div>
    </div>
    <div class="scope-btn">
      <label class="btn" for="uploads">重新上传
        <input
          id="uploads"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          @change="uploadImg($event, 1)"
        >
      </label>
      <i class="icon el-icon-remove-outline" @click="changeScale(-1)" />
      <i class="icon el-icon-circle-plus-outline" @click="changeScale(1)" />
      <i class="icon el-icon-refresh-right" @click="rotateRight" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="submit('blob')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {
  },
  props: {
    options: {
      type: Object
    },
    upload: {
      type: Array
    },
    cutting: {
      type: Object
    },
    formData: {
      type: Object
    }
  },
  data() {
    return {
      previews: {},
      imgs: null,
      imgUrl: require('./enterpriseLogo.png')
    }
  },
  watch: {
    'cutting.img': function(val, oldval) {
      console.log(val, 'logo1', oldval)
      this.imgs = val
    },
    formData(val, oldVal) {
      // console.log(val, oldVal, '实时预览123')
      this.$nextTick(() => {
        this.previews = val
      })
    }
  },
  created() {
    this.previews = this.formData
  },
  methods: {
    submit(type) {
      // let param
      if (!this.imgs) {
        this.$message.error('请选择上传图片')
        return
      }
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          // param = window.URL.createObjectURL(data)
          this.options.ok(data)
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          console.log(data, 'base64')
        })
      }
    },
    cancel() {
      this.options.cancel()
    },
    changeScale(num) {
      if (!this.imgs) return
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateRight() {
      if (!this.imgs) return
      this.$refs.cropper.rotateRight()
    },
    realTime(data) {
      // console.log(data, '实时预览456')
      this.cutting.realTime && this.cutting.realTime(data)
    },
    imgLoad(msg) {
      console.log(msg)
    },
    uploadImg(e, num) {
      console.log('哈哈哈')
      this.cutting.uploadImg && this.cutting.uploadImg(e, num)
    }
  }
}
</script>

<style lang="scss" scoped>
.conten {
  display: flex;
  .upload, .img, .cropper {
    margin: 15px;
    overflow: hidden;
  }
  .upload,
  .cropper {
    width: 280px;
    height: 280px;
    border: 1px dashed #C5D6F6;
    border-radius: 8px;
    cursor: pointer;
    .upload-img {
      width: 100%;
      height: 100%;
      ::v-deep
      .custom-form,
      .custom-form,
      .custom-form {
        width: 100%;
        height: 100%;
        .el-form {
          width: 100%;
          height: 100%;
          .el-form-item {
            margin-bottom: 0;
            width: 100%;
            height: 100%;
            .el-form-item__content {
              width: 100%;
              height: 100%;
              .roleUpload,
              .el-upload {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
  .img {
    width: 102px;
    height: 102px;
    border-radius: 10px;
    .show-preview {
      width: 100% !important;
      height: 100% !important;
      border-radius: 10px;
      border: 1px solid #C5D6F6;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    ::v-deep
    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
}
.scope-btn {
  width: 280px;
  font-size: 18px;
  color: #979797;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  cursor: pointer;
  margin: 0 15px;
  .btn {
    width: 48px;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: #0986FF;
    text-align: left;
    flex: 1;
    position: relative;
    cursor: pointer;
    font-weight: 400;
    #uploads {
      position: absolute;
      left: 0;
      clip: rect(0 0 0 0);
    }
  }
  .icon {
    padding-left: 10px;
  }
}
</style>
