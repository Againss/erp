<script>
import getTitle from '@/utils/get-page-title'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  render(h, context) {
    const { icon, title, item } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      const myTitle = getTitle(item) || title
      vnodes.push(<span slot='title'>{(myTitle)}</span>)
    }
    return vnodes
  }
}
</script>
