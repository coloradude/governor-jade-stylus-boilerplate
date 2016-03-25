const m = require('mithril')
const debounce = require('lodash.debounce')

var SubscribeForm = {}

SubscribeForm.Model = {
  apiURL: m.prop('http://localhost:3000'),
  email: m.prop(),
  user_id: m.prop()
}

SubscribeForm.API = {

  createUser : function(){
    return m.request({
      method : 'POST', 
      url : SubscribeForm.Model.apiURL() + '/api/v1/users', 
      data: { email: SubscribeForm.Model.email() }
    })
  },

  checkUsername : function(username){
    return m.request({
      method: 'GET',
      url: SubscribeForm.Model.apiURL() + '/api/v1/users/available/' + username
    })
  },

  reserveUsername: function(username){
    return m.request({
      method: 'PUT', 
      url: SubscribeForm.Model.apiURL() + '/api/v1/users/' + SubscribeForm.Model.user_id(),
      data: { username: username}} )
    .then(SubscribeForm.Model.profile)
  },

  vote: function(){
    return m.request({
      method: 'POST',
      url: SubscribeForm.Model.apiURL() + '/api/v1/campaigns/' + SubscribeForm.Model.campaign + '/vote',
      data: {
        voter: SubscribeForm.Model.profile()._id,
        campaign: SubscribeForm.Model.campaign()
      }
    })
  }

}

SubscribeForm.controller = function(){

  this.frame1 = {}
  this.frame2 = {}
  this.frame3 = {}

  this.frame1.classList = m.prop('')
  this.frame2.classList = m.prop('hidden')
  this.frame3.classList = m.prop('hidden')
  this.at = m.prop()
  this.check = m.prop('actually-invisible')
  this.x = m.prop('actually-invisible')

  this.email = m.prop()
  this.username = m.prop()
  this.validUsername = m.prop()

  return this
}

SubscribeForm.view = function(ctrl){
  return m('.sign-up-wrapper',
    m('.frame-1', {class: ctrl.frame1.classList()},
      m('input.early-access-input', {
        placeholder: 'Enter your email for early access',
        oninput: m.withAttr('value', ctrl.email)
      }),
      m('.grey-line'),
      m('button.early-access-submit', {
        onclick: function(){
          SubscribeForm.Model.email(ctrl.email())
          SubscribeForm.API.createUser()
            .then(function(res){
              SubscribeForm.Model.user_id(res._id)
              ctrl.frame1.classList('fade-out')
              ctrl.frame2.classList('fade-in')
          }).catch(function(res){
            console.log(res.err)
          })
        }
      }, 'Make A Difference')
    ),
    m('.frame-2', {class: ctrl.frame2.classList()},
      m('span.username-instructions', 'Select a username for your SAM profile'),
      m('.relative',
        m('span.at', {class: ctrl.at()} ,'@'),
        m('input.early-access-input', {
          placeholder: 'Enter a desired username',
          oninput: function(){
            ctrl.username(this.value)
            if (this.value.length > 0){
              SubscribeForm.API.checkUsername(this.value)
                .then(function(res){
                  console.log(res)
                  if (res.length === 0){
                    ctrl.at('teal')
                    ctrl.x('hidden actually-visible')
                    ctrl.check('visible actually-visible')
                    ctrl.validUsername(true)
                  } else {
                    ctrl.at('pink')
                    ctrl.check('hidden actually-visible')
                    ctrl.x('visible actually-visible')
                    ctrl.validUsername(false)
                  }
                }).catch(function(res){
                  console.log(res.err)
                  ctrl.validUsername(false)
                })
            }
          }
        }),
        m('img.check', {src: '../../../assets/img/check.svg', class: ctrl.check()})//,
        // m('img', {src: '../img/error.svg', class: ctrl.x})
      ),
      m('.grey-line'),
      m('button.early-access-submit', {
        onclick: function(){
          if (ctrl.validUsername()){
            console.log(ctrl.username())
            SubscribeForm.API.reserveUsername(ctrl.username())
              .then(function(){
                ctrl.frame2.classList('fade-out')
                ctrl.frame3.classList('fade-in')
              }).catch(function(err){
                console.log(err)
              })
          }
        }
      }, 'Reserve A Username')
    ),
    m('.frame-3', {class: ctrl.frame3.classList()},
      m('img.thanks-for-registering', {src: '../../../assets/img/thanks-for-registering.png'}),
      m('span.thanks', 'Thanks ',
        m('span.teal', '@' + ctrl.username())
      ,' your profile has been reserved :)')
    )
  )
}

m.mount(document.getElementById('sign-up-form'), SubscribeForm)