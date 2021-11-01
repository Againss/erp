<script>
export default {
  created() {
    const code = this.$utils.getQueryObject().code
    const baseURL = process.env.VUE_APP_ENV === 'mock' ? `` : process.env.VUE_APP_SSODOMAIN
    const config = {
      url: `${baseURL}/oauth/token`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${process.env.VUE_APP_AUTHORIZATION}`
      },
      data: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.VUE_APP_USERCENTER_REDIRECT_URI
      },
      transformRequest: [(data, headers) => {
        return this.$utils.param(data)
      }]
    }
    this.$request(config).then(res => {
      this.$store.dispatch('user/login', { access_token: res.access_token, res })
        .then(() => {
          // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          this.$router.replace({ path: '/' })
        })
        .catch(() => {
        })
    }).catch(e => {
      debugger
      this.$store.dispatch('user/reAuth')
    })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
