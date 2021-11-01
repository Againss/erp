// const BASEURL = `https://dev-sso.szhibu.com`
const BASEURL = `https://${window.location.host}`
// console.log(window.location.host, BASEURL)
// 全量
const loginAndPassword = $('.loginAndPassword')
const CompleteInformation = $('.CompleteInformation')
const login_page = $('.login_page')
const find_password_page = $('.find_password_page')
const enter_new_password = $('.enter_new_password')
const login_success = $('.login_success')
const username = $('#username')
const password = $('#password')
const loginMessage = $('#loginMessage')
const passwordMessage = $('#passwordMessage')
const login = $('#login')
const email = $('#email')
const code = $('#code')
const getCode = $('#getCode')
const emailMessage = $('#emailMessage')
const codeMessage = $('#codeMessage')
const firstStep = $('#firstStep')
const newPassword = $('#newPassword')
const newPasswordMessage = $('#newPasswordMessage')
const confirmNewPassword = $('#confirmNewPassword')
const confirmPasswordMessage = $('#confirmPasswordMessage')
const secondStep = $('#secondStep')
const loginSuccess = $('#loginSuccess')
const forgetPassword = $('#forgetPassword')
const backLogin = $('#backLogin')
const body = $('body')
const supply = $('#supply')
const resetPassword = $('.resetPassword')
const countryCode = $('#countryCode')
const getPhoneCode = $('#getPhoneCode')
const modalPhoneMessage = $('#modalPhoneMessage')
const modalPhone = $('#modalPhone')
const modalPhoneCode = $('#modalPhoneCode')
const modalPhoneCodeMessage = $('#modalPhoneCodeMessage')
const phoneDetermine = $('#phoneDetermine')
const getEmailCode = $('#getEmailCode')
const modalEmail = $('#modalEmail')
const modalEmailMessage = $('#modalEmailMessage')
const modalEmailCode = $('#modalEmailCode')
const modalEmailCodeMessage = $('#modalEmailCodeMessage')
const emailDetermine = $('#emailDetermine')
const topTipMessage = $('.topTipMessage')
const completionPhone = $('#completionPhone')
const completionEmail = $('#completionEmail')
const alert = $('#alert')
const alertMessage = $('#alertMessage')
const chineseOrEnglish = $('[name="optionsRadios"]')
const userId = $('#userId')
const realname = $('#realname')
const userName = $('#userName')
const english = $('#english')
const chinese = $('#chinese')
let type = 1
const forgetTimer = null
let forgetFlag = true
const phoneTimer = null
let phoneFlag = true
const emailTimer = null
let emailFlag = true
let language = 'zh'

const logcommonMessages = {
  type: 'OP',
  appId: 'userCenter',
  handleResult: 'SUCCESS',
  topic: 'usercenter-redo-receive-6p3r',
  createdTime: new Date().getTime()
}
const forgetPasswordMessages = {
  ...logcommonMessages,
  userId: '',
  realName: '',
  userName: '',
  opratorType: 'UPDATE',
  api: '/sysUser/password/find/newPassword'
}
const completeMobileMessages = {
  ...logcommonMessages,
  userId: userId.text(),
  realName: realname.text(),
  userName: userName.text(),
  opratorType: 'UPDATE',
  api: '/sysUser/mobile/modify'
}
const completeEmailMessages = {
  ...logcommonMessages,
  userId: userId.text(),
  realName: realname.text(),
  userName: userName.text(),
  opratorType: 'UPDATE',
  api: '/sysUser/email/modify'
}
const languageDom = $('.chinese-text')
const optionsRadios = $('#optionsRadios')
languageDom.on('click', function() {
  languageDom.removeClass('active')
  $(this).addClass('active')
  getLangType()
})

function getLangType() {
  const dataLang = $('[data-lang]')
  const value = $('.active').attr('data-type')
  optionsRadios.val(value);
  [].forEach.call(dataLang, function(item) {
    // console.log(item.getAttribute('data-lang'))
    const attribute = item.getAttribute('data-lang')
    if (value === 'chinese') {
      language = 'zh'
      if (item.tagName === 'INPUT') {
        item.setAttribute('placeholder', lang.default.zh.login[attribute])
      } else {
        $(`[data-lang=${attribute}]`).text(lang.default.zh.login[attribute])
      }
    } else if (value === 'english') {
      language = 'en'
      if (item.tagName === 'INPUT') {
        item.setAttribute('placeholder', lang.default.en.login[attribute])
      } else {
        $(`[data-lang=${attribute}]`).text(lang.default.en.login[attribute])
      }
    }
  })
}

// 定义可选邮箱
let availableMailbox = null
getMailBoxManagerAllList()
// chineseOrEnglish.trigger('change')
getLangType()
// 点击登录事件
login.on('click', function(e) {
  e.preventDefault()
  checkUsername()
  checkPassword(password, passwordMessage)
  if (loginMessage.html() === '' && passwordMessage.html() === '') {
    login_page.submit()
    // login.submit()
  }
})
// 用户输入框 blur事件
username.on('blur', function() {
  checkUsername()
})
// 密码输入框 blur事件
password.on('blur', function() {
  checkPassword(password, passwordMessage)
})
// email input框 blur事件
email.on('blur', function() {
  checkEmail()
})
// 修改手机 input框 blur事件
modalPhone.on('blur', function() {
  checkPhone()
})
// 修改邮箱 input框 blur事件
modalEmail.on('blur', function() {
  checkEmail2()
})
// 验证码框 blur事件
code.on('blur', function() {
  checkCode(code, codeMessage)
})
// 手机验证码框 blur事件
modalPhoneCode.on('blur', function() {
  const codeValue = countryCode.val()
  // console.log(codeValue)
  if (codeValue === '86') {
    checkCode(modalPhoneCode, modalPhoneCodeMessage)
  } else {
    modalPhoneCodeMessage.html('')
  }
})
// 邮箱验证码框 blur事件
modalEmailCode.on('blur', function() {
  const codeValue = countryCode.val()
  if (codeValue === '86') {
    checkCode(modalEmailCode, modalEmailCodeMessage)
  } else {
    modalEmailCodeMessage.html('')
  }
})
// 忘记密码获取验证码点击事件
getCode.on('click', function(e) {
  // e.preventDefault()
  checkEmail()
  // console.log(emailMessage.html())
  if (emailMessage.html() === '') {
    if (forgetFlag) {
      forgetFlag = false
      $.ajax({
        url: /(fabriciechina\.com|sfabric\.com)$/.test(email.val()) ? `${BASEURL}/sysUser/password/find/sendEmail` : `${BASEURL}/sysUser/password/find/sendSMS`,
        type: 'post',
        dataType: 'json',
        data: /(fabriciechina\.com|sfabric\.com)$/.test(email.val()) ? JSON.stringify({ email: email.val() }) : JSON.stringify({ areaCode: '86', mobile: /^\+86.*/.test(email.val()) ? email.val().split('-')[1] : email.val() }),
        success: function(backData) {
          console.log('backData', backData)
          forgetFlag = true
          if (backData.code === 200) {
            resetCode(forgetTimer, getCode)
            getCode.attr('disabled', true)
          } else {
            emailMessage.html(backData.message)
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          forgetFlag = true
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader('content-type', 'application/json')
        }
      })
    }
  } else {
    email.focus()
  }
})
// 手机号获取验证码点击事件
getPhoneCode.on('click', function(e) {
  checkPhone()
  // console.log(emailMessage.html())
  if (modalPhoneMessage.html() === '') {
    if (phoneFlag) {
      phoneFlag = false
      axios({
        method: 'post',
        url: `${BASEURL}/sysUser/mobile/modify/sendSMS`,
        data: JSON.stringify({ areaCode: countryCode.val(), mobile: modalPhone.val() }),
        headers: {
          'content-type': 'application/json'
        }
      }).then(function(backData) {
        // console.log('backData', backData)
        phoneFlag = true
        if (backData.data.code === 200) {
          resetCode(phoneTimer, getPhoneCode)
          getPhoneCode.attr('disabled', true)
        } else {
          modalPhoneMessage.html(backData.data.message)
        }
      }).catch(function(error) {
        // console.log('e ', error)
        phoneFlag = true
      })
    }
  } else {
    modalPhone.focus()
  }
})
// 邮箱获取验证码点击事件
getEmailCode.on('click', function(e) {
  checkEmail2()
  // console.log(emailMessage.html())
  if (modalEmailMessage.html() === '') {
    if (emailFlag) {
      emailFlag = false
      axios({
        method: 'post',
        url: `${BASEURL}/sysUser/email/modify/sendEmail`,
        data: JSON.stringify({ email: modalEmail.val() }),
        headers: {
          'content-type': 'application/json'
        }
      }).then(function(backData) {
        // console.log('backData', backData)
        emailFlag = true
        if (backData.data.code === 200) {
          resetCode(emailTimer, getEmailCode)
          getEmailCode.attr('disabled', true)
        } else {
          modalEmailMessage.html(backData.data.message)
        }
      }).catch(function(error) {
        // resetCode(emailTimer, getEmailCode)
        // console.log('e ', error)
        emailFlag = true
      })
    }
  } else {
    modalEmail.focus()
  }
})
// 忘记密码下一步点击事件
firstStep.on('click', function() {
  checkEmail()
  checkCode(code, codeMessage)
  if (emailMessage.html() === '' && codeMessage.html() === '') {
    $.ajax({
      url: `${BASEURL}/sysUser/password/find/verifyIdentify`,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({ email: email.val(), identify: code.val() }),
      success: function(backData) {
        // console.log('backData', backData)
        if (backData.code === 200) {
          login_page.hide()
          find_password_page.hide()
          enter_new_password.show()
          login_success.hide()
        } else {
          codeMessage.html(backData.message)
        }
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('content-type', 'application/json')
      }
    })
  }
})
// 修改手机弹出框确定事件
phoneDetermine.on('click', function() {
  checkPhone()
  // ejectMessage('danger', '修改失败', 3000)
  // $('#phoneModal').modal('hide')
  if (countryCode.val() === '86') {
    checkCode(modalPhoneCode, modalPhoneCodeMessage)
  } else {
    modalPhoneCodeMessage.html()
  }
  // $('.alert').removeClass('fade')
  // $('.alert').addClass('show')
  if (modalPhoneMessage.html() === '' && modalPhoneCodeMessage.html() === '') {
    axios({
      method: 'post',
      url: `${BASEURL}/sysUser/mobile/modify`,
      data: JSON.stringify({ areaCode: countryCode.val(), mobile: modalPhone.val(), identify: modalPhoneCode.val() }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(function(backData) {
      // console.log('backData', backData)
      if (backData.data.code === 200) {
        fetchLog(completeMobileMessages, { areaCode: countryCode.val(), mobile: modalPhone.val(), identify: modalPhoneCode.val() }, JSON.stringify({ 'beforeText': `补全手机号信息成功`, 'beforeCode': { areaCode: countryCode.val(), mobile: modalPhone.val(), identify: modalPhoneCode.val() }}))
        completionPhone.html(modalPhone.val())
        $('#phoneModal').modal('hide')
        ejectMessage('success', '修改成功', 3000)
        // topTipMessage.fadeIn()
        // setTimeout(() => {
        //   topTipMessage.fadeOut()
        // }, 3000)
      } else {
        // codeMessage.html(backData.data.message)
        ejectMessage('danger', backData.data.message, 3000)
      }
    }).catch(function(error) {
      // console.log('e ', error)
      ejectMessage('danger', '服务器错误', 3000)
    })
  }
})
// 修改邮箱弹出框确定事件
emailDetermine.on('click', function() {
  checkEmail2()
  // ejectMessage('danger', '111', 3000)
  // $('#emailModal').modal('hide')
  // console.log(userId.text())
  checkCode(modalEmailCode, modalEmailCodeMessage)
  if (modalEmailMessage.html() === '' && modalEmailCodeMessage.html() === '') {
    axios({
      method: 'post',
      url: `${BASEURL}/sysUser/email/modify`,
      data: JSON.stringify({ email: modalEmail.val(), identify: modalEmailCode.val() }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(function(backData) {
      // console.log('backData', backData)
      // fetchLog(completeEmailMessages, { email: modalEmail.val(), identify: modalEmailCode.val() }, JSON.stringify({ 'beforeText': `补全邮箱信息成功`, 'beforeCode': { email: modalEmail.val(), identify: modalEmailCode.val() }}))
      if (backData.data.code === 200) {
        fetchLog(completeEmailMessages, { email: modalEmail.val(), identify: modalEmailCode.val() }, JSON.stringify({ 'beforeText': `补全邮箱信息成功`, 'beforeCode': { email: modalEmail.val(), identify: modalEmailCode.val() }}))
        completionEmail.html(modalEmail.val())
        $('#emailModal').modal('hide')
        ejectMessage('success', '修改成功', 3000)
        // topTipMessage.fadeIn()
        // setTimeout(() => {
        //   topTipMessage.fadeOut()
        // }, 3000)
      } else {
        // codeMessage.html(backData.data.message)
        ejectMessage('danger', backData.data.message, 3000)
      }
    }).catch(function(error) {
      // console.log('e ', error)
      ejectMessage('danger', '服务器错误', 3000)
    })
  }
})
// 新的密码 blur事件
newPassword.on('blur', function() {
  checkPassword(newPassword, newPasswordMessage)
})
// 确认密码
confirmNewPassword.on('blur', confirmNewPasswordFunction)
// 确认密码函数
function confirmNewPasswordFunction() {
  if (confirmNewPassword.val() === '') {
    // confirmPasswordMessage.html('确认密码不能为空')
    confirmPasswordMessage.html(`<span data-lang="confirmNewPasswordEmptyTip">${lang.default[language].login.confirmNewPasswordEmptyTip}</span>`)
  } else if (confirmNewPassword.val() !== newPassword.val()) {
    // confirmPasswordMessage.html('两次输入密码不一致')
    confirmPasswordMessage.html(`<span data-lang="confirmNewPasswordNoAtypismTip">${lang.default[language].login.confirmNewPasswordNoAtypismTip}</span>`)
  } else {
    confirmPasswordMessage.html('')
  }
}
// 确认密码 下一步点击事件
secondStep.on('click', function() {
  checkPassword(newPassword, newPasswordMessage)
  confirmNewPasswordFunction()
  if (confirmPasswordMessage.html() === '' && newPasswordMessage.html() === '') {
    $.ajax({
      url: `${BASEURL}/sysUser/password/find/newPassword`,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({ email: email.val(), identify: code.val(), newPassword: newPassword.val() }),
      success: function(backData) {
        // console.log('backData', backData)
        if (backData.code === 200) {
          // fetchLog(forgetPasswordMessages, { identify: code.val(), newPassword: newPassword.val() }, JSON.stringify({ 'beforeText': `找回密码成功`, 'beforeCode': { identify: code.val(), newPassword: newPassword.val() }}))
          fetchLog({ ...forgetPasswordMessages, userId: backData.data.userId, realName: backData.data.realName, userName: backData.data.name }, { email: email.val(), identify: code.val(), newPassword: newPassword.val() }, JSON.stringify({ 'beforeText': `找回密码成功${JSON.stringify({ userName: backData.data.name })}` }))
          login_page.hide()
          find_password_page.hide()
          enter_new_password.hide()
          login_success.show()
        } else {
          confirmPasswordMessage.html(backData.message)
        }
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('content-type', 'application/json')
      }
    })
  }
})
// 知道密码去登录事件
loginSuccess.on('click', function() {
  type = 1
  changeBackGround()
  login_page.show()
  find_password_page.hide()
  enter_new_password.hide()
  login_success.hide()
})
// 忘记密码点击事件
forgetPassword.on('click', function() {
  type = 2
  changeBackGround()
  login_page.hide()
  find_password_page.show()
  enter_new_password.hide()
  login_success.hide()
})
// 返回登录
backLogin.on('click', function() {
  type = 1
  changeBackGround()
  login_page.show()
  find_password_page.hide()
  enter_new_password.hide()
  login_success.hide()
})
// 下次再说点击事件
// 去补充点击事件
supply.on('click', function() {
  body.addClass('edit')
  resetPassword.html('补充信息')
  loginAndPassword.hide()
  CompleteInformation.show()
})
// 国家码切换事件
countryCode.on('change', function() {
  // console.log(countryCode.val())
  const codeValue = countryCode.val()
  if (codeValue === '86') {
    getPhoneCode.removeAttr('disabled')
  } else {
    getPhoneCode.attr('disabled', true)
  }
})
// 账号校验
function checkUsername() {
  // 用户名，只能输入6-20个字母、数字
  const userPattern = /^(\w){1,20}$/
  // 邮箱校验
  // const emailPattern = /(fabriciechina\.com|sfabric\.com)$/
  // 手机号校验
  const telephonePattern = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/
  if (username.val() === '') {
    // loginMessage.html('用户名不能为空')
    loginMessage.html(`<span data-lang="loginNameEmptyTip">${lang.default[language].login.loginNameEmptyTip}</span>`)
  } else if (userPattern.test(username.val()) || availableMailbox.test(username.val()) || telephonePattern.test(username.val())) {
    loginMessage.html('')
  } else {
    // loginMessage.html('请输入正确的公司邮箱/手机号或用户名')
    loginMessage.html(`<span data-lang="loginNameErrorTip">${lang.default[language].login.loginNameErrorTip}</span>`)
  }
}
// 密码校验
function checkPassword(password, passwordMessage) {
  // 密码，只能输入6-20个字母、数字
  const pattern = /^[a-zA-Z0-9]{6,50}$/
  if (password.val() === '') {
    // passwordMessage.html('密码不能为空')
    passwordMessage.html(`<span data-lang="passwordEmptyTip">${lang.default[language].login.passwordEmptyTip}</span>`)
  } else if (pattern.test(password.val())) {
    passwordMessage.html('')
  } else {
    // passwordMessage.html('请输入输入6-20个字母、数字')
    passwordMessage.html(`<span data-lang="passwordErrorTip">${lang.default[language].login.passwordErrorTip}</span>`)
  }
}
// 邮箱或手机正则校验
function checkEmail() {
  const userValue = email.val()
  // const emailPattern = /(fabriciechina\.com|sfabric\.com)$/
  const phonePattern = /^1[3-578]\d{9}$/ // /^\+86-1\d{10}$/
  if (userValue === '') {
    // emailMessage.html('此项不能为空')
    emailMessage.html(`<span data-lang="UserEmptyTip">${lang.default[language].login.UserEmptyTip}</span>`)
  } else if (userValue.length > 50) {
    // emailMessage.html('最大长度50个字')
    emailMessage.html(`<span data-lang="UserLengthTip">${lang.default[language].login.UserLengthTip}</span>`)
  } else if (availableMailbox.test(userValue)) {
    emailMessage.html('')
  } else if (/^\+.*/.test(userValue)) { // 判断开头是否存在+号(是否包含国家码)
    if (userValue.includes('-')) { // 判断是否包含 '-'
      if (/^\+86\-.*/.test(userValue)) { // 判断 +86 格式正确
        if (phonePattern.test(userValue.split('-')[1])) {
          emailMessage.html('')
        } else {
          // emailMessage.html('手机号格式不正确')
          emailMessage.html(`<span data-lang="UserMobileErrorTip">${lang.default[language].login.UserMobileErrorTip}</span>`)
        }
      } else {
        // emailMessage.html('暂不支持海外手机重置密码,请输入邮箱后进行重置密码')
        emailMessage.html(`<span data-lang="UserMobileNoSupportTip">${lang.default[language].login.UserMobileNoSupportTip}</span>`)
      }
    } else {
      // emailMessage.html('手机号格式不正确')
      emailMessage.html(`<span data-lang="UserMobileErrorTip">${lang.default[language].login.UserMobileErrorTip}</span>`)
    }
  } else if (phonePattern.test(userValue)) {
    emailMessage.html('')
  } else {
    // emailMessage.html('请输入正确的公司邮箱或手机号')
    emailMessage.html(`<span data-lang="UserErrorTip">${lang.default[language].login.UserErrorTip}</span>`)
  }
}
// 验证码正则校验
function checkCode(code, message) {
  if (code.val() === '') {
    // message.html('验证码不能为空')
    message.html(`<span data-lang="codeEmptyTip">${lang.default[language].login.codeEmptyTip}</span>`)
  } else if (code.val().length === 6) {
    message.html('')
  } else {
    // message.html('验证码格式不正确')
    message.html(`<span data-lang="codeErrorTip">${lang.default[language].login.codeErrorTip}</span>`)
  }
}
// 带国家码手机号验证
function checkPhone() {
  const codeValue = countryCode.val()
  // console.log('codeValue', codeValue)
  if (codeValue === '86') {
    if (modalPhone.val() === '') {
      modalPhoneMessage.html('手机号不能为空')
    } else if (/^1[3-578]\d{9}$/.test(modalPhone.val())) {
      modalPhoneMessage.html('')
    } else {
      modalPhoneMessage.html('手机号格式不正确')
    }
  } else {
    if (modalPhone.val() === '') {
      modalPhoneMessage.html('手机号不能为空')
    } else if (!/^[0-9]*$/.test(modalPhone.val())) {
      modalPhoneMessage.html('请输入数字')
    } else {
      modalPhoneMessage.html('')
    }
  }
}
// 验证邮箱/单独指邮箱
function checkEmail2() {
  if (modalEmail.val() === '') {
    modalEmailMessage.html('邮箱不能为空')
    // } else if (/(fabriciechina\.com|sfabric\.com)$/.test(modalEmail.val())) {
  } else if (availableMailbox.test(modalEmail.val())) {
    modalEmailMessage.html('')
  } else {
    modalEmailMessage.html('请填写正确的公司可用邮箱')
  }
}
// 倒计时
function resetCode(timer, code) {
  let second = 120
  // let code = $("#code")
  // code.html(`重新获取(${second})`)
  code.html(`<span data-lang="recaptureCode">${lang.default[language].login.recaptureCode}(${second})</span>`)
  code.removeClass('btn-primary')
  code.addClass('btn-gray')
  if (!timer) {
    timer = setInterval(() => {
      second -= 1
      if (second > 0) {
        // code.html(`重新获取(${second})`)
        code.html(`<span data-lang="recaptureCode">${lang.default[language].login.recaptureCode}(${second})</span>`)
        // code.disabled = true
      } else {
        clearInterval(timer)
        timer = null
        // code.html(`获取验证码`)
        code.html(`<span data-lang="getCode">${lang.default[language].login.getCode}</span>`)
        code.removeClass('btn-gray')
        code.addClass('btn-primary')
        code.removeAttr('disabled')
      }
    }, 1000)
  }
}
// 点击忘记密码等切换的页面
function changeBackGround() {
  // console.log('type', type)
  if (type === 1) {
    // smart_fabric.hide()
    // logo.show()
    body.removeClass('edit')
  } else {
    body.addClass('edit')
    // smart_fabric.show()
    // body.css('background', '#ccc')
    // logo.hide()
  }
}

changeBackGround()
// 上部中间的弹出信息
function ejectMessage(type, message, time) {
  if (type === 'success') {
    alert.removeClass('alert-danger')
    alert.addClass(`alert-${type}`)
    alertMessage.html(message)
  } else if (type === 'danger') {
    alert.removeClass('alert-success')
    alert.addClass(`alert-${type}`)
    alertMessage.html(message)
  }
  topTipMessage.fadeIn()
  setTimeout(() => {
    topTipMessage.fadeOut()
  }, time)
}

// 登录页面非登录成功其他接口的日志信息
function fetchLog(message, data, description) {
  $.ajax({
    url: `${BASEURL}/ngx-kafka`,
    type: 'post',
    dataType: 'json',
    data: JSON.stringify({ ...message, params: data, description }),
    success: function(backData) {
      // console.log('backData', backData)
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader('content-type', 'application/json')
    }
  })
}

// 登录页面邮箱接口
function getMailBoxManagerAllList() {
  $.ajax({
    url: `${BASEURL}/mailBoxManager/allList`,
    // url: `https://dev-sso.szhibu.com/mailBoxManager/allList`,
    type: 'post',
    dataType: 'json',
    // headers: {
    //   spathv: 'userCenter'
    // },
    // data: JSON.stringify({ ...message, params: data, description }),
    success: function(backData) {
      // console.log('backData', backData)
      const dataList = backData.data || []
      const emailName = dataList.map(item => item.mailBoxSuffix).join('|')
      availableMailbox = new RegExp('(' + emailName + ')$')
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader('content-type', 'application/json')
    }
  })
}

// console.log(availableMailbox)
