<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb" :css="loadingAnimation">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ getTitle(item)|| item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ getTitle(item)|| item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import getTitle from '@/utils/get-page-title'
export default {
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    loadingAnimation() {
      return this.$store.getters.loadingAnimation
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getTitle,
    getBreadcrumb() {
      // only show routes with meta.title
      const getMatched = this.$route.meta.matchedOrigin ? this.$route.meta.matchedOrigin : this.$route.matched
      const matched = getMatched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        // matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)//注释Dashboard首页
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }

  // 顶部轮播图路径颜色修改
  .el-breadcrumb__inner.is-link, .el-breadcrumb__inner a {
    color: #97a8be;
  }
  .el-breadcrumb__inner .no-redirect {
    color: #303133;
  }
}
</style>
