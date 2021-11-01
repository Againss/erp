/**
* @Description: 公共打印组件
* @author Roman
* @date 2020/9/15
*/
<template>
  <div style="position: relative">
    <div ref="header">
      <slot name="header" />
    </div>
    <div ref="content">
      <slot />
    </div>
    <div ref="footer">
      <slot name="footer" />
    </div>
    <cs-custom-pop :options="defaultPopOptions" />
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import domtoimage from 'domtoimage'
import { jsPDF } from 'jspdf'
import viewPdf from './components/view-pdf'
import CsCustomPop from '../cs-custom-pop/pop'
export default {
  name: 'CsPrint',
  components: {
    CsCustomPop
  },
  inheritAttrs: false,
  props: {
    popOptions: {
      type: Object,
      default: () => ({})
    },
    print: {
      type: Boolean,
      default: false,
      required: true
    },
    imgEngine: {
      type: String,
      default: 'domtoimage'
    },
    format: {
      type: [Array, String]
      /*
      'a0': [2383.94, 3370.39],
      'a1': [1683.78, 2383.94],
      'a2': [1190.55, 1683.78],
      'a3': [841.89, 1190.55],
      'a4': [595.28, 841.89],
      'a5': [419.53, 595.28],
      'a6': [297.64, 419.53],
      'a7': [209.76, 297.64],
      'a8': [147.40, 209.76],
      'a9': [104.88, 147.40],
      'a10': [73.70, 104.88],
      'b0': [2834.65, 4008.19],
      'b1': [2004.09, 2834.65],
      'b2': [1417.32, 2004.09],
      'b3': [1000.63, 1417.32],
      'b4': [708.66, 1000.63],
      'b5': [498.90, 708.66],
      'b6': [354.33, 498.90],
      'b7': [249.45, 354.33],
      'b8': [175.75, 249.45],
      'b9': [124.72, 175.75],
      'b10': [87.87, 124.72],
      'c0': [2599.37, 3676.54],
      'c1': [1836.85, 2599.37],
      'c2': [1298.27, 1836.85],
      'c3': [918.43, 1298.27],
      'c4': [649.13, 918.43],
      'c5': [459.21, 649.13],
      'c6': [323.15, 459.21],
      'c7': [229.61, 323.15],
      'c8': [161.57, 229.61],
      'c9': [113.39, 161.57],
      'c10': [79.37, 113.39],
      'dl': [311.81, 623.62],
      'letter': [612, 792],
      'government-letter': [576, 756],
      'legal': [612, 1008],
      'junior-legal': [576, 360],
      'ledger': [1224, 792],
      'tabloid': [792, 1224],
      'credit-card': [153, 243]
      或者自定义数据[100,100]
      */
    },
    orientation: {
      type: String,
      default: 'p'// l or p
    },
    pageNum: {
      type: Boolean,
      default: true// l or p
    },
    unit: {
      type: String,
      default: 'in' // pt mm cm in px pc em ex
    },
    interval: {
      type: Number,
      default: 500 // pt mm cm in px pc em ex
    },
    scale: {
      type: Number,
      default: 2
    },
    printType: {
      type: String,
      default: 'image' // html image
    }
  },
  data() {
    const defaultPopOptions = {
      itemType: 'dialog',
      visible: false,
      modal: false,
      lockScroll: false,
      title: '提示',
      showClose: false,
      width: '400px',
      // okHidden: true,
      okText: '打印',
      cancelText: '取消',
      // cancelHidden: true,
      ok: params => {
        const url = this.pdf.output('bloburi')
        const nw = window.open(url)
        nw.onload = function() {
          nw.print()
        }
        this.pdf = null
        this.$set(this.defaultPopOptions, 'visible', false)
        this.ok && this.ok(url)
      },
      cancel: params => {
        this.pdf = null
        this.$set(this.defaultPopOptions, 'visible', false)
        this.cancel && this.cancel()
      },
      content: [
        {
          components: {
            viewPdf
          },
          componentsOptions: {
            src: '',
            text: '文件已生成，是否打印？'
          }
        }
      ]
    }
    return {
      isPrint: false,
      src: '',
      defaultPopOptions,
      header: null,
      footer: null,
      headerUrl: null,
      footerUrl: null,
      formatOptions: {
        'a0': [2383.94, 3370.39],
        'a1': [1683.78, 2383.94],
        'a2': [1190.55, 1683.78],
        'a3': [841.89, 1190.55],
        'a4': [595.28, 841.89],
        'a5': [419.53, 595.28],
        'a6': [297.64, 419.53],
        'a7': [209.76, 297.64],
        'a8': [147.40, 209.76],
        'a9': [104.88, 147.40],
        'a10': [73.70, 104.88],
        'b0': [2834.65, 4008.19],
        'b1': [2004.09, 2834.65],
        'b2': [1417.32, 2004.09],
        'b3': [1000.63, 1417.32],
        'b4': [708.66, 1000.63],
        'b5': [498.90, 708.66],
        'b6': [354.33, 498.90],
        'b7': [249.45, 354.33],
        'b8': [175.75, 249.45],
        'b9': [124.72, 175.75],
        'b10': [87.87, 124.72],
        'c0': [2599.37, 3676.54],
        'c1': [1836.85, 2599.37],
        'c2': [1298.27, 1836.85],
        'c3': [918.43, 1298.27],
        'c4': [649.13, 918.43],
        'c5': [459.21, 649.13],
        'c6': [323.15, 459.21],
        'c7': [229.61, 323.15],
        'c8': [161.57, 229.61],
        'c9': [113.39, 161.57],
        'c10': [79.37, 113.39],
        'dl': [311.81, 623.62],
        'letter': [612, 792],
        'government-letter': [576, 756],
        'legal': [612, 1008],
        'junior-legal': [576, 360],
        'ledger': [1224, 792],
        'tabloid': [792, 1224],
        'credit-card': [153, 243]
      }
    }
  },

  computed: {
  },
  watch: {
    popOptions: {
      handler(val, oldVal) {
        if (val) {
          const newVal = { ...val }
          if (newVal.ok) {
            this.ok = newVal.ok
            delete newVal.ok
          }
          if (newVal.cancel) {
            this.cancel = newVal.cancel
            delete newVal.cancel
          }
          this.defaultPopOptions = { ...this.defaultPopOptions, ...newVal }
        }
      },
      deep: true,
      immediate: true
    },
    print: {
      handler(newData, oldData) {
        this.isPrint = newData
      }
    },
    isPrint: {
      handler(newData, oldData) {
        if (newData) {
          const iframe = document.getElementById('print')
          this.pdf = null
          iframe && iframe.parentNode.removeChild(iframe)
          this.openFullScreen()
          this.$nextTick(() => {
            this.isPrint = false
            window.pageYoffset = 0
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
            // window.scrollTo(0, 0)
            setTimeout(() => {
              this.printDemo()
            }, 200)
          })
        }
      }
    }
  },
  beforeDestroy() {
    const iframe = document.getElementById('print')
    this.pdf = null
    iframe && iframe.parentNode.removeChild(iframe)
  },
  mounted() {
  },
  methods: {
    async printDemo() {
      const parentW = this.$refs.content.parentNode.offsetWidth
      const header = this.$refs.header.cloneNode(true)
      const footer = this.$refs.footer.cloneNode(true)
      const children = this.$refs.content.childNodes
      document.body.appendChild(header)
      document.body.appendChild(footer)
      if (header.offsetHeight) {
        this.header = await this.getCanvas(header, parentW)
        this.headerUrl = this.header.toDataURL('image/png', 1.0)
      }
      if (footer.offsetHeight) {
        this.footer = await this.getCanvas(footer, parentW)
        this.footerUrl = this.footer.toDataURL('image/png', 1.0)
      }
      document.body.removeChild(header)
      document.body.removeChild(footer)
      const pList = []
      children.forEach(el => {
        if (el.nodeName !== '#text') {
          if (this.printType !== 'html') {
            pList.push(this.toCanvas(el))
          } else {
            pList.push(el)
          }
        }
      })
      const len = pList.length
      if (this.printType !== 'html') {
        Promise.all(pList).then(res => {
          res.forEach(({ canvas, copyDom }, index) => {
            this.toPdf({ canvas, copyDom }, index, len)
          })
        })
      } else {
        pList.forEach((v, index) => {
          this.toPdf({ canvas: v, copyDom: v }, index, len)
        })
      }
    },
    async toCanvas(el) {
      const copyDom = el.cloneNode(true)
      copyDom.style.setProperty('zIndex', '-1')
      document.body.appendChild(copyDom)
      const width = copyDom.clientWidth
      const height = copyDom.clientHeight
      if (this.imgEngine === 'domtoimage') {
        return new Promise(async(resolve, reject) => {
          domtoimage.toPng(copyDom, { height: copyDom.clientHeight, width: copyDom.clientWidth, bgcolor: '#ffffff' }).then(url => {
            const canvas = {
              width,
              height,
              toDataURL: () => {
                return url
              }
            }
            // console.log(url)
            resolve({ canvas, copyDom })
          }).catch(function(error) {
            console.error(error)
          })
        })
      } else {
        return new Promise(async(resolve, reject) => {
          const scale = this.imgEngine === 'domtoimage' ? 1 : this.scale
          html2canvas(copyDom, {
            // backgroundColor: 'transparent',
            scale,
            allowTaint: true,
            width: copyDom.clientWidth,
            height: copyDom.clientHeight,
            logging: false,
            scrollY: 0,
            scrollX: 0,
            useCORS: true
          }).then(canvas => {
            resolve({ canvas, copyDom })
          })
        })
      }
    },
    toPdf({ canvas, copyDom }, i, len) {
      // console.log(canvas, copyDom, i, len)
      const scale = this.imgEngine === 'domtoimage' ? 1 : this.scale
      let canWidth = canvas.width / scale
      let canHeight = canvas.height / scale
      if (this.printType === 'html') {
        canWidth = copyDom.offsetWidth / scale
        canHeight = canvas.offsetHeight / scale
      }
      const arrDPI = this.js_getDPI()
      let dpiX = 96
      let dpiY = 96
      if (arrDPI.length > 0) {
        dpiX = arrDPI[0]
        dpiY = arrDPI[1]
      }
      // console.log(canWidth, dpiX, canHeight, dpiY)
      const W = canWidth / dpiX
      const H = canHeight / dpiY
      if (!this.pdf) {
        this.pdf = new jsPDF(this.orientation, this.unit, this.format||[W,H])// eslint-disable-line
        // this.pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen')
      }

      let pageHeight = 0
      let pageWidth = 0
      const headerHeight = this.header ? this.header.height / scale : 0
      const footerHeight = this.footer ? this.footer.height / scale : 0
      let position = headerHeight
      let format = this.format
      if (format) {
        if (Object.prototype.toString.call(this.format) === '[object String]') {
          format = this.formatOptions[this.format]
        }
        pageHeight = format[1] / 72 * dpiY
        pageWidth = format[0] / 72 * dpiX
        if (this.orientation === 'l') {
          pageHeight = format[0] / 72 * dpiY
          pageWidth = format[1] / 72 * dpiX
        }
      }
      let addData = ''
      if (this.printType !== 'html') {
        addData = canvas.toDataURL('image/png', 1.0)
      } else {
        addData = copyDom
      }
      // console.log(canHeight, pageHeight)
      if (!pageHeight) {
        if (this.printType === 'html') {
          // this.pdf.html(addData) // 插件有BUG 待升级支持后再进行测试 ，暂对html支持很差
        } else {
          this.pdf.addImage(addData, 'png', 0, 0, W, H)
        }
      } else {
        let num = 1
        while (canHeight > 0) {
          this.pdf.addImage(addData, 'png', 0, position / dpiY, W, H)
          this.header && this.pdf.addImage(this.headerUrl, 'png', 0, 0, this.header.width / scale / dpiX, this.header.height / scale / dpiY)
          this.footer && this.pdf.addImage(this.footerUrl, 'png', 0, (pageHeight - this.footer.height / scale) / dpiX, this.footer.width / scale / dpiX, this.footer.height / scale / dpiY)
          this.pdf.setFontSize(12 * 0.75)
          this.pageNum && this.pdf.text(`page ${num}`, (pageWidth - 70) / dpiX, (pageHeight - 15) / dpiY)
          canHeight -= pageHeight
          position = position - pageHeight + headerHeight + footerHeight
          if (canHeight > 0) {
            num++
            this.pdf.addPage()
          }
        }
      }
      if (i !== len - 1) {
        this.pdf.addPage()
      } else {
        this.$emit('update:print', false)
        const src = this.pdf.output('bloburi')
        // this.$set(this.defaultPopOptions.content[0].componentsOptions, 'src', src)
        // this.$set(this.defaultPopOptions, 'visible', true)
        this.src = src
        this.creatIframe(src)
        // window.open(this.pdf.output('bloburi'))
        // pdf.save('content.pdf')
      }
      document.body.removeChild(copyDom)
    },
    async getCanvas(el, w) {
      const scale = this.imgEngine === 'domtoimage' ? 1 : this.scale
      const width = w
      const height = el.clientHeight
      if (this.imgEngine === 'domtoimage') {
        const url = await domtoimage.toPng(el, { height: el.clientHeight, width: w, bgcolor: '#ffffff' })
        const canvas = {
          width,
          height,
          toDataURL: () => {
            return url
          }
        }
        return canvas
      } else {
        const canvas = await html2canvas(el, {
          // backgroundColor: 'transparent',
          scale,
          allowTaint: true,
          width: w,
          height: el.clientHeight,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          useCORS: true
        })
        // console.log(canvas)
        return canvas
      }
    },
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '打印资源准备中···',
        fullscreen: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    creatIframe(src) {
      const iframe = document.createElement('IFRAME')
      iframe.src = src
      iframe.id = 'print'
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
      document.body.appendChild(iframe)
      iframe.contentWindow.focus()
      iframe.onload = () => {
        this.loading.close()
        iframe.contentWindow.print()
      }
    },
    js_getDPI() {
      const arrDPI = []
      if (window.screen.deviceXDPI !== undefined) {
        arrDPI[0] = window.screen.deviceXDPI
        arrDPI[1] = window.screen.deviceYDPI
      } else {
        const tmpNode = document.createElement('DIV')
        tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
        document.body.appendChild(tmpNode)
        arrDPI[0] = parseInt(tmpNode.offsetWidth)
        arrDPI[1] = parseInt(tmpNode.offsetHeight)
        tmpNode.parentNode.removeChild(tmpNode)
      }
      return arrDPI
    },
    imageBase64ToBlob(urlData, type = 'image/png') {
      try {
        const arr = urlData.split(',')
        const mime = arr[0].match(/:(.*?);/)[1] || type
        const bytes = window.atob(arr[1])
        const ab = new ArrayBuffer(bytes.length)
        const ia = new Uint8Array(ab)

        for (let i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i)
        }

        return new Blob([ab], {
          type: mime
        })
      } catch (e) {
        const ab = new ArrayBuffer(0)
        return new Blob([ab], {
          type: type
        })
      }
    },
    blobToUrl(blob_data) {
      return URL.createObjectURL(blob_data)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
