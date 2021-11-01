import Mock from 'mockjs'
function getUserListData() {
  return Mock.mock({
    'list|30': [{
      // id: '@increment',
      realName: '@cname',
      name: '@cname',
      mobile: '138' + Mock.mock(/\d{8}/),
      email: '@email',
      'orgs|1-5': [{ // 随机生成5到10个数组元素
        'orgId|+1': 1,
        'name|+1': ['技术部', '销售部', '客服部', '生产部', '大卖部'], // 属性值自动加 1，初始值为1
        parentId: '@integer(1, 100)'
      }],
      'userId|+1': 1,
      'status|1': [1, 2],
      'jobNum|+1': 1,
      timestamp: +Mock.Random.date('T')
    }]

  })
}

export default [
  {
    url: '/mock/userCenter/user/list',
    type: 'post',
    response: config => {
      const { id } = config.query
      console.log(id)
      return {
        code: 200,
        message: '成功',
        data: getUserListData()
      }
    }
  },
  {
    url: '/mock/userCenter/user/role/list',
    type: 'post',
    response: config => {
      const { id } = config.query
      console.log(id)
      return {
        code: 200,
        message: '成功',
        data: {
          userIds: Mock.mock('@range(3,10)')
        }
      }
    }
  }
]
