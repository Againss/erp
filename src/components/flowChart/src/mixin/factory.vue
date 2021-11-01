/**
 * @Description: 预留接口 主要用在添加新功能 应用场景 多流程
 * @author Roman
 * @date 2021-03-12 11:55:07
 * @edit 2021-03-12 11:55:07
*/
<script>
import { transToTreeDat } from '../utils'

export default {
  name: 'FlowFactoryMixin',
  props: {},
  watch: {},
  methods: {
    /**
     *  @param data  源数组一维数组
     *  @requires  tree 二维数组
     */
    transformTree(data) {
      return transToTreeDat(data)
    }
  }
}
</script>

<style>
.branch-wrap {
  display: inline-flex;
  width: 100%;
}
</style>
