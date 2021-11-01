/**
 * @Description: nginx-kafka日志打印配置信息
 * @author Amos
 * @date 2020/9/14
*/
<template>
  <div style="padding: 20px">
    <div style="background: #fff;padding: 10px">
      <div class="table">
        <div class="custom-demo-title">nginx-kafka:</div>
        <cs-custom-table
          :columns="columnsInfos"
          :data-source="nginxKafkaConfig"
        />
      </div>
      <div class="table">
        <div class="custom-demo-title">nginx-kafka description:</div>
        <cs-custom-table
          :columns="columnsInfos"
          :data-source="nginxKafkaDescriptionConfig"
        />
      </div>
      <div class="table">
        <div class="custom-demo-title">nginx-kafka opratorType:</div>
        <cs-custom-table
          :columns="columnsInfos"
          :data-source="nginxKafkaOpratorTypeConfig"
        />
      </div>
      <!-- <div>此方法有疑问请钉钉咨询:Roman</div> -->    </div>  </div>
</template>

<script>
import columnsInfos from './config/columns'

import nginxKafkaConfig from './config/nginx-kafka-config'
import nginxKafkaDescriptionConfig from './config/nginx-kafka-description-config'
import nginxKafkaOpratorTypeConfig from './config/nginx-kafka-opratorType-config'
export default {
  components: {},
  data() {
    return {
      msg: 'table',
      columnsInfos,

      nginxKafkaConfig,
      nginxKafkaDescriptionConfig,
      nginxKafkaOpratorTypeConfig
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
