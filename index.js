var App = require('./src/app.js');

App.listen(App.get('port'), function() {
  console.log('Node app is running on port', App.get('port'));
});
