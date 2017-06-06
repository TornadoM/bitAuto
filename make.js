var Bitstamp = require('./bitstampAccess.js');

var key = '7SpjaGY1qg90szIgUF7TC09yfek7rrzo';
var client_id = '031601';
var secret = '4DRwsmPB7cueLYWHBHR0pAZQePnKPJQe'

var publicBitstamp = new Bitstamp();
var privateBitstamp = new Bitstamp(key, secret, client_id);

var make = function(){

	var compare_prices=function(json){
		var high_buy = 0;
		var low_sell = 0;
		var val = 0;
		for(var i in json){
			var val = parseFloat(json[i].price);
			if(json[i].type === '0'){
				if(val>high_buy){
					high_buy = val;
				}
			}else{
				if(low_sell === 0){
					low_sell = val;
				}else{
					if(val<low_sell){
						low_sell = val;
					}
				}
			}
		}
		return [high_buy, low_sell];
	}

	var res_json = [];
	var counter = 5;
	var amount = 0.01;
	var callback = function(json){
		res_json = res_json.concat(json)
		if(counter === 0){
			var prices = compare_prices(res_json);
			var high_buy = prices[0];
			var low_sell = prices[1];
			privateBitstamp.buyMarket('btceur', amount, console.log);
			console.log(high_buy, low_sell);
		}
	}
	//make request every 5 mins
	var makeRequest = function(){
		publicBitstamp.transactions('btceur', {time: 'minute'}, callback);
		counter--;
		if(counter>0){
			setTimeout(makeRequest, 1000*60)
		}
	}
	makeRequest();

}

make();


