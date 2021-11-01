<template>
  <div class="serve-change">
    <div v-if="isShow" class="font-serve">
      <span>前端服务：</span>
      <el-select
        v-model="fontServe"
        placeholder="请选择前端服务"
        @change="changeFrontServe"
      >
        <el-option
          v-for="item in serveConfiguration.frontServe"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="java-serve">
      <span>Java服务：</span>
      <el-select
        v-model="javaServe"
        placeholder="请选择Java服务"
        @change="changeJavaServe"
      >
        <el-option
          v-for="item in javaServiceConfig"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import serveConfiguration from '../config'
import {
  getToken,
  setCookie,
  setStorageToken,
  removeStorageToken,
  getStorageToken
} from '@/utils/auth'
export default {
  data() {
    return {
      env: ['staging', 'sit'],
      serveConfiguration,
      fontServe: '',
      javaServe: ''
    }
  },
  computed: {
    isShow() {
      return process.env.NODE_ENV !== 'development'
    },
    javaServiceConfig() {
      return this.$store.state.app.javaServiceConfig
    }
  },
  async created() {
    this.fontServe = getToken('s_id') || '66'
    this.javaServe = getStorageToken('serveChange') || ''
  },
  methods: {
    serveChange(value, type) {
      if (type === 'front') {
        setCookie('s_id', value, 7)
      } else {
        setStorageToken({ name: 'serveChange', value })
        removeStorageToken('userInfo')
        removeStorageToken('permitList')
        removeStorageToken('systemList')
        removeStorageToken('authLists')
      }
      location.href = '/'
    },
    /**
     * @description 前端选择服务
     */
    changeFrontServe(e) {
      this.serveChange(e, 'front')
    },
    /**
     * @description Java选择服务
     */
    changeJavaServe(e) {
      this.serveChange(e, 'java')
    }
  }
}
</script>

<style lang="scss" scoped>
.serve-change {
  display: flex;
  & > div {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }
  // .font-serve {
  // }
  .java-serve {
    margin-right: 0;
  }
}
</style>
