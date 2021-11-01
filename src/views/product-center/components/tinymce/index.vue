<!--
 * @Author: Sanmao
 * @Date: 2020-09-27 10:52:34
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-02-03 15:47:26
 * @Descripttion: 富文本组件
-->
<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div
      class="editor-custom-btn-container"
      :style="{
        left: wid + 'px',
      }"
    >
      <editorImage :api-url="apiUrl" @successCBK="imageSuccess" />
    </div>
  </div>
</template>

<script>
/**
 * tinymce文档地址： http://tinymce.ax-z.cn/plugins/pagebreak.php
 */
import editorImage from './components/EditorImage'
import load from './dynamicLoadScript'
const tinymceCDN =
  'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
const plugins = [
  'image advlist autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr  imagetools insertdatetime  lists  nonbreaking noneditable  paste preview print save searchreplace spellchecker tabfocus  textcolor textpattern visualblocks visualchars wordcount link'
]
// fontselect image
const toolbar = [
  'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample',
  'hr bullist numlist link charmap insertdatetime emoticons forecolor backcolor fullscreen fontsizeselect preview'
]

export default {
  name: 'TinymceComponent',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        return (
          'productCenter-' +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + '')
        )
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: '100%'
    },
    // 数据请求地址
    apiUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      wid: 0
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || '')
        )
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    /**
     * @description 设置是否编辑
     */
    isRead(type = 'design') {
      // design:编辑；readonly：只读
      window.tinymce.editors[`${this.tinymceId}`].setMode(type)
    },
    /**
     * @description 加载编辑器
     */
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    /**
     * @description 初始化编辑器
     */
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: 'zh_CN',
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: true, // 开关图片、表格、媒体对象在编辑区内的调整大小工具。拖拽工具可调整对象大小
        toolbar: toolbar, // 工具栏
        menubar: false, // 菜单栏
        plugins: plugins,
        end_container_on_empty_block: true, // enter键 分块
        powerpaste_word_import: 'clean', // 是否保留word粘贴样式
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        statusbar: true, // 状态栏指的是编辑器最底下、左侧显示dom信息、右侧显示Tiny版权链接和调整大小的那一条。默认是显示的，设为false可将其隐藏。
        paste_data_images: true, // 粘贴data格式的图像
        placeholder: '在这里输入文字',
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px', // 字体大小
        // font_formats:"微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif", // 字体
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
        // 自定义上传
        // images_upload_handler: function (blobInfo, succFun, failFun) {
        //   var xhr, formData;
        //   var file = blobInfo.blob(); //转化为易于理解的file对象
        //   xhr = new XMLHttpRequest();
        //   xhr.withCredentials = false;
        //   xhr.open("POST", "/demo/upimg.php");

        //   xhr.setRequestHeader(
        //     "Authorization",
        //     "cc56fac3311878fc402edf5c21e3d407"
        //   );
        //   xhr.onload = function () {
        //     var json;
        //     if (xhr.status != 200) {
        //       failFun("HTTP Error: " + xhr.status);
        //       return;
        //     }
        //     json = JSON.parse(xhr.responseText);
        //     if (!json || typeof json.location != "string") {
        //       failFun("Invalid JSON: " + xhr.responseText);
        //       return;
        //     }
        //     succFun(json.location);
        //   };
        //   formData = new FormData();
        //   formData.append("file", file, file.name); //此处与源文档不一样
        //   console.log(file, "file");
        //   // xhr.send(formData);
        // },
      })
      setTimeout(() => {
        this.wid = document
          .getElementsByClassName('mce-btn-group')[1]
          .getBoundingClientRect().width
      }, 1000)
    },
    /**
     * @description 销毁编辑器
     */
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    /**
     * @description 设置编辑器内容
     */
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    /**
     * @description 获取编辑器内容
     */
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    /**
     * @description 图片上传
     */
    imageSuccess(arr) {
      arr.forEach((v) =>
        window.tinymce
          .get(this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v}" width="300">`)
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;

}
.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  // left: 525px;
  top: 34px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
</style>
