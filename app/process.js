/*
console.log("in process")

var stripe = require("stripe")(
  "sk_test_umUDW3JIKTrVbl2y0S6d7TbJ"
);

// if (req.method === 'POST') {
// 	var body = '';
// 	req.on('data', function(chunk) {
//   		body += chunk;
// 	});

// 	req.on('end', function() {
//   		var data = qs.parse(body);
// 		// now you can access `data.email` and `data.password`
// 		res.writeHead(200);
// 		res.end(JSON.stringify(data));
// 		console.log(data);
// 	});
// } else {
// 	res.writeHead(404);
// 	res.end();
// }

var charge = stripe.charges.create({
  amount: 420,
  currency: "usd",
  source: token, // obtained with Stripe.js
  description: "Charge for test@example.com"
}, {
  idempotency_key: "7OHRW8a7p6655P93"
}, function(err, charge) {
  // asynchronously called
});
*/
/*
var express = require('express');
var app = express();
app.post('/charge', function(req, res) {
console.log(req);
    var stripeToken = req.body.id;

    var charge = stripe.charges.create({
        amount: 10000, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        description: "email@email.com"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            console.log(JSON.stringify(err, null, 2));
        }
        res.send("completed payment!");
    });
});
*/