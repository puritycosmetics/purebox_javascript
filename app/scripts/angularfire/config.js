angular.module('firebase.config', [])
  .constant('FBURL', 'https://purebox-production.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','facebook','google','twitter'])

  .constant('loginRedirectPath', '/login');
