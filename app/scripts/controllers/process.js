var stripe = require("stripe")(
  "sk_test_umUDW3JIKTrVbl2y0S6d7TbJ"
);
console.log("Method: " + req.method)
if (req.method === 'POST') {
	var body = '';
	req.on('data', function(chunk) {
  		body += chunk;
	});

	req.on('end', function() {
  		var data = qs.parse(body);
		// now you can access `data.email` and `data.password`
		res.writeHead(200);
		res.end(JSON.stringify(data));
		console.log(data);
	});
} else {
	res.writeHead(404);
	res.end();
}

stripe.charges.create({
  amount: 420,
  currency: "usd",
  source: , // obtained with Stripe.js
  description: "Charge for test@example.com"
}, {
  idempotency_key: "7OHRW8a7p6655P93"
}, function(err, charge) {
  // asynchronously called
});