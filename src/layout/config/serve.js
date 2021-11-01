let config = [
  { label: '灰度环境', value: '69' },
  { label: '开发稳定环境', value: '67' }
]
if (process.env.VUE_APP_ENV === 'sit') {
  config = [
    { label: '灰度环境', value: '70' },
    { label: '开发稳定环境', value: '68' }
  ]
}
export default config

