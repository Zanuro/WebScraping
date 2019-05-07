#!/usr/bin/env node
'use strict';

const cheerio = require('cheerio');
const request = require('request');

const rp = require('request-promise');

const search_term = process.argv[2];

var url = 'https://www.hiperdino.es/c9495/alimentacion/' + search_term + '.html';

var list = {}

const options = {
    uri: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

function get_data() {
  return rp(options)
        .then(($) => {

        var price = []
        var description = []

          $('.price__left').children('.price__text').each(function(i, elem) {
            price[i] = $(this).text().trim();
            //console.log(price[i]);
            //return price;
            
          });

          $('.product__description').children('.description__text').each(function(i, elem) {
            description[i] = $(this).text().trim();
            //return description;
            //console.log(description[i]);
          });

          return [price,description];
      })
      .catch((err) => {
        throw Error(`La url ${url} no existe`);
        return Error({error: 'There has been an error'});
        //return;
        //system.exit(1);

});
}

get_data().then(function(price){

  var prices = []
  var descriptions = []

  var products = []

  for(var x=0;x<price.length;x++){
  var filtered = price[x].filter(function (elem) {
    return elem != '';
  });
  if(x == 0)
    prices = filtered
  else
    descriptions = filtered
}

    //console.log(prices.length)
    //console.log(descriptions.length)
    //console.log(prices);
    //console.log(descriptions);

    if (prices.length == descriptions.length){
      for(var i=0;i<prices.length;i++){

        products.push(JSON.stringify({ "price": prices[i], "description": descriptions[i]}));
        console.log(JSON.stringify({ "price": prices[i], "description": descriptions[i]}));
      }
    }
    
    else {
      throw Error('El numero de precios no coincide con el numero de descripciones')
    }
    //console.log(products);
})

/*setTimeout(() => {
    console.log(price);
    console.log(description);
}, 10000);
*/

//module.exports = hiperdinoParser;

/*
module.exports = hiperdino-scraping => {


    request(url, function(err, resp, body){
        
        const list = {};
        const $ = cheerio.load(body);
        
        if(err) throw Error;

        else:

        lista.price = $('.price__text').toArray().map(x => $(x).text());

        lista.description = $('.product__description flex-item description__text').toArray().map(x => $(x).text());
    });


    

    return list;
};
*/
