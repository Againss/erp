/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <!-- 打印源码隐藏与显示 -->
  <div v-highlight>
    <!--    <pre><code>{{ val }}</code></pre>-->
    <div v-if="showCode" class="codeBtn" @click="showCode=!showCode">{{ showCode?'隐藏源码':'查看源码' }}</div>

    <div v-if="showCode">
      <pre>
        <code class="htmlbars">{{ csCustomFormHtmlCode }}</code>
        <code class="javascript">{{ csCustomFormJavascriptCode }}</code>

        <div>'./components/area-tel':</div>
        <code class="htmlbars">{{ csCustomFormAreaTelHtmlCode }}</code>
        <code class="javascript">{{ csCustomFormAreaTelJavascriptCode }}</code>
        <code class="scss">{{ csCustomFormAreaTelScssCode }}</code>

        <div>'./components/state-column':</div>
        <code class="htmlbars">{{ csCustomFormStateHtmlCode }}</code>
        <code class="javascript">{{ csCustomFormStateJavascriptCode }}</code>
        <code class="scss">{{ csCustomFormStateScssCode }}</code>

        <div>'./components/popover-column':</div>
        <code class="htmlbars">{{ csCustomFormPopoverHtmlCode }}</code>
        <code class="javascript">{{ csCustomFormPopoverJavascriptCode }}</code>

    </pre>
    </div>

    <div class="codeBtn" @click="showCode=!showCode">{{ showCode?'隐藏源码':'查看源码' }}</div>
  </div>
</template>

<script>
import csCustomFormJavascriptCode from '../config/cs-custom-form-javascript-code'
import csCustomFormHtmlCode from '../config/cs-custom-form-html-code'

import csCustomFormAreaTelHtmlCode from '../config/cs-custom-form-area-tel-html-code'
import csCustomFormAreaTelJavascriptCode from '../config/cs-custom-form-area-tel-javascript-code'
import csCustomFormAreaTelScssCode from '../config/cs-custom-form-area-tel-scss-code'

import csCustomFormStateHtmlCode from '../config/cs-custom-form-state-html-code'
import csCustomFormStateJavascriptCode from '../config/cs-custom-form-state-javascript-code'
import csCustomFormStateScssCode from '../config/cs-custom-form-state-scss-code'

import csCustomFormPopoverHtmlCode from '../config/cs-custom-form-popover-html-code'
import csCustomFormPopoverJavascriptCode from '../config/cs-custom-form-popover-javascript-code'

import csPrintHtmlCode from '../config/cs-print-html-code'
// import csPrintJavascriptCode from '../config/cs-custom-form-popover-javascript-code'

export default {
  components: {},
  data() {
    return {
      showCode: false,
      csCustomFormJavascriptCode,
      csCustomFormHtmlCode,
      csCustomFormAreaTelHtmlCode,
      csCustomFormAreaTelJavascriptCode,
      csCustomFormAreaTelScssCode,
      csCustomFormStateHtmlCode,
      csCustomFormStateJavascriptCode,
      csCustomFormStateScssCode,
      csCustomFormPopoverHtmlCode,
      csCustomFormPopoverJavascriptCode,
      csPrintHtmlCode
    }
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
    .codeBtn{background: #F5F7FA; text-align: center; line-height: 35px;border-radius: 2px;cursor: pointer }
    .hljs{background: #F5F7FA;}
</style>
