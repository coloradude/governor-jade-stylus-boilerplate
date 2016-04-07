var m = require('mithril')
var debounce = require('lodash.debounce')

var checkIcon = require('../svg/check.svg')
var xIcon = require('../svg/x.svg')

var staging = 'https://sam-server-staging.herokuapp.com'
var local = 'http://localhost:3000'

var signUpContainer = document.getElementById('sign-up-container')

var SubscribeForm = {}

SubscribeForm.Model = {
  apiURL: m.prop(local),
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
      url: SubscribeForm.Model.apiURL() + '/api/v1/users/available-username/' + encodeURIComponent(username)
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
  this.check = m.prop('hidden')
  this.x = m.prop('hidden')
  this.slideOver = m.prop()

  this.email = m.prop()
  this.username = m.prop()
  this.usernameTaken = m.prop()
  this.isValidUsername = function(username){
    return /^([0-9a-z\_]){3,24}$/gi.test(username)
  }
  this.emailError = m.prop()

  return this
}

SubscribeForm.view = function(ctrl){
  return [
    m('.background-slider.absolute', {class: ctrl.slideOver()}),
    m('.sign-up-wrapper',
      m('.frame-1.relative', {class: ctrl.frame1.classList()},
        m('.email-error.red', ctrl.emailError()),
        m('input.early-access-input', {
          placeholder: 'Enter your email for early access',
          oninput: m.withAttr('value', ctrl.email)
        }),
        m('.white-line'),
        m('button.early-access-submit', {
          onclick: function(){
            SubscribeForm.Model.email(ctrl.email())
            SubscribeForm.API.createUser()
              .then(function(res){
                ctrl.slideOver('second-slide')
                SubscribeForm.Model.user_id(res._id)
                ctrl.frame1.classList('fade-out')
                ctrl.frame2.classList('fade-in')
            }).catch(function(res){
              ctrl.emailError(res.err)
            })
          }
        }, 'Make A Difference')
      ),
      m('.frame-2', {class: ctrl.frame2.classList()},
        m('span.username-instructions', 'Select a username for your SAM profile'),
        m('.relative.username-wrapper',
          m('span.at', {class: ctrl.at()} ,'@'),
          m('input.early-access-input', {
            placeholder: 'Enter a desired username',
            oninput: function(){
              ctrl.username(this.value)
              if (ctrl.username().length > 0 && ctrl.isValidUsername(ctrl.username())){
                SubscribeForm.API.checkUsername(this.value)
                  .then(function(res){
                    if (res.length === 0){
                      ctrl.x('hidden')
                      ctrl.check('')
                      ctrl.usernameTaken(false)
                    } else {
                      ctrl.check('hidden')
                      ctrl.x('visible')
                      ctrl.usernameTaken(true)
                    }
                  }).catch(function(res){
                    ctrl.usernameTaken(true)
                  })
              } else if (ctrl.username().length > 2 && !ctrl.isValidUsername(ctrl.username())){
                ctrl.x('')
                ctrl.check('hidden')
              } else {
                ctrl.x('hidden')
                ctrl.check('hidden')
              }
            }
          }),
          m('.check-icon', {class: ctrl.check()}, m.trust(checkIcon)),
          m('.x-icon', {class: ctrl.x()}, m.trust(xIcon))
        ),
        m('.white-line'),
        m('button.early-access-submit', {
          onclick: function(){
            if (ctrl.isValidUsername(ctrl.username()) && !ctrl.usernameTaken()){
              SubscribeForm.API.reserveUsername(ctrl.username())
                .then(function(){
                  ctrl.slideOver('third-slide')
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
        m('img.thanks-for-registering', {src: '/dist/assets/img/thanks-for-registering.png'}),
        m('span.thanks', 'Thanks ',
          m('span.teal', '@' + ctrl.username())
        ,' your profile has been reserved :)')
      )
    )
  ]
}

m.mount(signUpContainer, SubscribeForm)