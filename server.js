var Recurly = require('node-recurly');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request')
// We'll use uuids to generate account_code values
var uuid = require('node-uuid');

var http = require('http');
// var https = require('https');
var port = process.env.PORT || 1338;
var path = require('path');

var app = express();

//app.use(bodyParser());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// var urlencode = require('urlencode');
var json = require('json-middleware');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();

app.use(express.static('app'));

//app.use('/api/subscriptions/new', multipartMiddleware);

http.createServer(app).listen(port), function(req, res) {
  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  // res.end('Hello Mommas\n');
};

// Instantiate a configured recurly client
var recurly = new Recurly({
  SUBDOMAIN: 'purebox-2',
  API_KEY: '5c1f6c37157b4e7ea3cf87f1e9c1a23c',
  ENVIRONMENT: 'sandbox',
  DEBUG: false
});

app.get('/', function(req, res) {

  // var options = {
  //   root: __dirname + '/public/',
  //   dotfiles: 'deny',
  //   headers: {
  //       'x-timestamp': Date.now(),
  //       'x-sent': true
  //   }
  // };

  var fileName = req.params.name;
  res.sendFile(path.join(__dirname + '/app/index.html'));

});

/*
//Update Billing info
app.post('/api/billing/update', function (req, res) {

  recurly.billingInfo.update({

    account: {
      account_code: req.body['email'],
      address1: req.body['address1'],
      address2: req.body['address2'],
      city: req.body['city'],                  
      state: req.body['state'],
      postal_code: req.body['postal_code'],
      phone: req.body['phone']          
    }
  }, function (err, response) {
    if (err) {
      console.log(err.data);
    }

    //Otherwise redirect to a confirmation page.  Send back JSON to redirect on front end.
    //res.redirect does not work because of path
    res.send({'success': 'success'});
    
  });
  //console.log(JSON.stringify(req.body));
})
*/


//POST request
request({
    url: 'https://app.eztexting.com/contacts?format=json',
    method: 'POST',
    json: {
        User: '100pure',
        Password: '100Pure226!',
        PhoneNumber: '2134398809'
    }
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
}

//Get account info
app.get('/api/accounts/get', function (req, res) {

  recurly.billingInfo.get(req.query.email, 
    function (err, response) {
        if (err) {
          console.log(err.data.error.description._);
          return;
        }

        if(response) {
          res.send(response);
        }  
    }
  ); 
})

//Get subscription info
app.get('/api/listByAccount/get', function (req, res){
  recurly.subscriptions.listByAccount(req.query.email,  
    function (err, response) {
      if (err) {
        console.log(err.data.error.description._);
        return;
      }

      if(response){
        res.send(response);

      }  
    }
  );
})


/*
Recurly API v2 returns results as XML. Your requests should always include the header requesting the results as XML:

Accept: application/xml
CONTENT-TYPE HEADER
When sending data to Recurly in a POST or PUT request, your request must specify the content type of your request:

Content-Type: application/xml; charset=utf-8
*/


//Update subscription
app.put('/api/subscriptions/update', function (req, res) {


  req.header('Accept', 'application/xml');
  req.header('Content-Type', 'application/xml; charset=utf-8');

  //console.log(req.body['uuid'])
  //console.log(req.accepts('text/html'));  
  console.log(req.headers);
  console.log(req.body['uuid']);

  recurly.subscriptions.update(req.body['uuid'],{
          timeframe: 'now',
          plan_code: '3',
          quantity: 1,
          unit_amount_in_cents: 666,
          net_terms: 15
        },function (err, response) {

            if (err) {
              console.log("*** Error: Update subscription ***")
              console.log(err);
            }else{

              //Send back JSON to redirect on front end     
              res.set('Content-Type', 'application/json;charset=UTF-8');
              //res.setHeader('Content-Type', 'application/json');
              res.send(response);

            }
    
  });
  //console.log(JSON.stringify(req.body));
})


// // PUT route to handle an account update form
// app.put('/api/accounts/:account_code', function (req, res) {
//   recurly.accounts.update(req.params.account_code, {
//     billing_info: {
//       token_id: req.body['recurly-token']
//     }
//   }, redirect);
// });


//Create new subscription
app.post('/api/subscriptions/new', function (req, res) {

  console.log(req.body['token_id'])

  recurly.subscriptions.create({
    plan_code: req.body['plan_code'],
    currency: 'USD',
    account: {
      address: {
        address1: req.body['address1'],
        address2: req.body['address2'],
        city: req.body['city'],
        state: req.body['state'],
        zip: req.body['postal_code']
      },  
      account_code: req.body['email'],
      email: req.body['email'],
      billing_info: {
        token_id: req.body['token_id']
      }
    }
  }, function (err, response) {
    if (err) {
      res.send(err.data.errors.error._);
    }

    if(response) {
      console.log(response)
      res.send(response.responseText);
    }

  });
})


//Create a new account
app.post('/api/account/new', function (req, res) {

  recurly.accounts.create({
    account_code: req.body['account_code'],
    address: {
      address1: req.body['shippingInfo'].address1,
      address2: req.body['shippingInfo'].address2,
      city: req.body['shippingInfo'].city,
      state: req.body['shippingInfo'].state,
      zip: req.body['shippingInfo'].zip,
      phone: req.body['shippingInfo'].phone      
    }
  }, function (err, response) {
    if (err) {
      console.log("*** New account error ***");
      console.log(err.data.errors.error);
    }

    if(response) {
      //Otherwise redirect to a confirmation page.  Send back JSON to redirect on front end.
      //res.redirect does not work because of path
      res.send({'success': 'success'});
    }
    
  });

})

// A set of utility functions for redirecting and parsing API errors
function redirect (err, response) {
  if (err) return res.redirect(parseErrors(err.data));
  res.redirect('SUCCESS_URL');
}

function parseErrors (data) {

  return data.errors
    ? data.errors.error.map(parseValidationErrors).join(', ')
    : [data.error.symbol, data.error.description].join(': ');

}

function parseValidationErrors (e) {
  return [e.$.field, e._].join(' ');
}







