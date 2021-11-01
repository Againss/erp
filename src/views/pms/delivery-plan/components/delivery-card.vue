<template>
  <div class="DeliveryCardVue">
    <template v-for="(i, index) in custom">
      <div :key="index" class="box" @click="go(i.id)">
        {{ i.deliveryNumber }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DeliveryCardVue',
  props: {
    custom: {
      type: Array
    }
  },
  data() {
    return {}
  },
  methods: {
    go(id) {
      if (id) {
        this.$router.push({
          path: '/pms/delivery-note/detail/',
          query: { id: id, pageType: 'detail' }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.DeliveryCardVue {
  .box {
    cursor: pointer;
    color: #0986ff;
    line-height: 24px;
  }
}
</style>
