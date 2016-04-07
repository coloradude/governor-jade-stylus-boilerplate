var m = require('mithril')

var BeaconSwapper = {}

BeaconSwapper.API = {

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

BeaconSwapper.controller = function(){
  var that = this
  this.signupCount = m.prop()
  this.getSignupCount = function(){

  }
  return this
}

BeaconSwapper.view = function(ctrl, args){
  return [
    m('.causes-beacon',,

      m('.causes-slide-1',
        m('.causes-header-img-wrapper.relative',
          m('span.sign-up-count', 
            m('span.dude-icon', m.trust('')),
            m('span', ctrl.signupCount())
          ),
          m('img.causes-beacon-img', {src: args.slide1img}),

        ),
        m('.causes-content-area',
          m('.causes-copy',
            m('h2', args.title),
            m('span.featured-by-wrapper',
              m('span', m.trust('')),
              m('span', args.featuredBy + '. Powered By SAM.')
            ),
            m('p.causes-copy-main', args.copy)
          ),
          m('.causes-email-form.relative',
            m('.causes-email-error'),
            m('input.causes-email-input'),
            m('button.causes-email-btn')
          )
        )
      )
    )
  ]
}

var sampleData = {
  campaign_id: '',
  headerImg: 'https://www.dropbox.com/s/z44vkhz4cz2si46/Screenshot%202016-04-07%2009.41.30.png?dl=0',
  featuredBy: 'racingextinction',
  title: 'Speak Out For Elephants'
  copy: 'Finalize the Obama Administration\'s proposed rule to stop commercial ivory trade in the U.S. Sign the petition below and we\'ll deliver each signature to the Presidential Task Force on Wildlife Trafficking before they deliberate in july.'
  facebook: '',
  twitter: '',
  email: ''
}

m.mount(document.getElementById('causes-beacon-wrapper'), m.component(BeaconSwapper, sampleData))












