<template>
  <section v-watermark="{content: name}" class="app-main">
    <transition name="fade" mode="out-in" :css="loadingAnimation">
      <keep-alive :include="cachedViews" :max="max">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    max() {
      return this.$store.getters.cacheMax
    },
    name() {
      return this.$store.getters.realName
    },
    loadingAnimation() {
      return this.$store.getters.loadingAnimation
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      const { query } = this.$route
      if (query.timestamp) {
        return this.$route.fullPath
      }
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  /*min-height: calc(100vh - 50px);*/
    min-height: 100vh;
  width: 100%;
  position: relative;
    background: rgb(238,245,249);
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    /*min-height: calc(100vh - 84px);*/
      min-height: 100vh;
  }

  .fixed-header+.app-main {
    padding-top: 89px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
