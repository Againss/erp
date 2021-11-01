<template>
  <el-form
    ref="ruleForm"
    :model="form"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="分数">
      <el-input v-model="form.score" disabled="disabled" />
    </el-form-item>
    <el-form-item label="级别">
      <el-input v-model="form.rank" disabled="disabled" />
    </el-form-item>
    <el-form-item label="结果">
      <el-input v-model="form.result" disabled="disabled" />
    </el-form-item>
    <el-form-item label="考核表上传">
      <div class="assess-box">
        <p v-for="(item, index) in urlList" :key="index">
          <a :href="item">
            {{ item }}
            <!--  <img
              :src="item"
              alt=""
              style="max-height: 100px; max-width: 100px"
            /> -->
          </a>
        </p>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
// import * as api from '../api/index'
export default {
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        id: '',
        supplierId: '',
        score: '',
        rank: '',
        result: '',
        attachmentUrl: ''
      },
      urlList: []
    }
  },
  watch: {
    options: {
      handler(val) {
        this.pageLoad(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.pageLoad(this.options.formDatas)
  },
  methods: {
    pageLoad(data) {
      data.formDatas && (this.form = data.formDatas)
      if (this.form.attachmentUrl) {
        this.urlList = this.form.attachmentUrl.split(',')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/* .label {
  color: #000;
  font-weight: 500;
} */
.assess-box {
  max-width: 100%;
  text-align: left;
  overflow: hidden;
  p {
    line-height: 20px;
    margin: 5px 0;
    a {
      border: solid 1px #fff;
      display: inline-block;
    }
    a:link {
      color: blue;
    }
    a:hover {
      cursor: pointer;
      color: red;
      text-decoration: underline;
    }
  }
}
</style>
