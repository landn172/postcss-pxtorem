'use strict';

var fs = require('fs');
var postcss = require('postcss');
var rpxtorem = require('..');
var css = fs.readFileSync('main.css', 'utf8');
var options = {
    replace: false,
    rootValue: 20
};
var processedCss = postcss(rpxtorem(options)).process(css).css;

fs.writeFile('main-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});
