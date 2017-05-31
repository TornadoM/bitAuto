var http = require('http');
var https = require('https');
var crypto = require('crypto');
var querystring = require("querystring");
var _ = require('underscore');



/*
https.get('https://www.bitstamp.net/api/v2/order_book/btceur/', function(res){
	var size = 0;
	var chunks = [];

	res.on('data', function(chunk){
		size += chunk.length;
		chunks.push(chunk);

	})
	res.on('end', function(){
		var data = Buffer.concat(chunks, size);
		console.log(data.toString())

	});
}).on('error', function(e){

	console.log('Got error: ' + e.message);
})
*/
var nonce = '' + new Date().getTime();
var key = '7SpjaGY1qg90szIgUF7TC09yfek7rrzo';
var id = '031601';
var message = nonce + id + key;
var secret = '4DRwsmPB7cueLYWHBHR0pAZQePnKPJQe'

var signer = crypto.createHmac('sha256', new Buffer(secret, 'utf8'));
var signature = signer.update(message).digest('hex').toUpperCase();

//var data = querystring.stringify(args);

var postData = querystring.stringify({
  'key' : key,
  'signature': signature,
  'nonce': nonce
});
console.log(postData)
//console.log(args)


var options = {
  	hostname: 'www.bitstamp.net',
  	path: '/api/v2/balance/btceur/',
	method: 'POST',
	headers: {
	  	'User-Agent': 'Bitstamp Javascript API client',
      	'Content-Type': 'application/x-www-form-urlencoded',
    	'Content-Length': postData.length
	},

};

var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var buffer = '';
    res.on('data', function(data) {
      buffer += data;
    });
    res.on('end', function() {
    	var target = "btc_available"
    	var reg = eval("/\""+target+"\": "+"\"[0-9]+([.]{1}[0-9]+){0,1}\"/gi")
    	var num_reg = /[0-9]+([.]{1}[0-9]+){0,1}/g

    	var value = parseFloat(buffer.match(reg).toString().match(num_reg))
    	console.log(reg)
    	console.log(value)
    	console.log(buffer);
      console.log(typeof JSON.parse(buffer))

    });
});

req.on('error', function(err) {
    console.log(err);
});

// write data to request body
req.write(postData);
req.end();





