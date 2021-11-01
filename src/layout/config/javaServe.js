let config = [
  { label: '色号花号库开发灰度', value: 'dev1' },
  { label: '外勤指令开发灰度', value: 'dev2' },
  { label: '外勤指令PUNK灰度', value: 'dev3' },
  { label: '开发稳定服务', value: '' }
]
if (process.env.VUE_APP_ENV === 'sit') {
  config = [
    { label: '色号花号库开发灰度', value: 'dev1' },
    { label: '外勤指令开发灰度', value: 'dev2' },
    { label: '外勤指令PUNK灰度', value: 'dev3' },
    { label: '测试稳定服务', value: '' }
  ]
}
export default config

