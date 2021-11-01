/**
 * @Description: 消息提醒
 * @author Roman
 * @date 2020/8/21
*/
<script>
import Favico from 'favico.js'

export default {
  name: 'CsFavico',
  props: {
    number: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      favicon: null
    }
  },
  computed: {
  },
  watch: {
    number: {
      handler(val, oldVal) {
        this.favicon.badge(val)
      }
    }

  },
  mounted() {
    this.favicon = new Favico({
      animation: 'none',
      position: 'up'
    })
    this.favicon.badge(this.number)
  },
  render: function(h) {
    return h()
  }
}
</script>
