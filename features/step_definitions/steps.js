'use strict';

const defineSupportCode = require('cucumber').defineSupportCode;
const equal = require('assert').equal;
const { isOk, parseString, parseBlock, parseAttrs } =
  require('../../dist/parser');

defineSupportCode(({ Given, When, Then }) => {
  let res = undefined;
  When(/^parsing the string (.)(.*)$/, (d, s) => { res = parseString(d, s); });
  When(/^parsing the block \{(.*)$/, s => { res = parseBlock(s); });
  When(/^parsing the attributes ?(.*)$/, (s) => { res = parseAttrs(s); });

  Then(/^the parsing fails$/, () => equal(isOk(res), false));
  Then(/^the parsed value is ['"](.*)['"] and the rest is ['"](.*)['"]$/,
    (value, rest) => {
      equal(res.value, value);
      equal(res.rest, rest);
    }
  );
  Then(/^the parsed value has (\d+) attributes?$/,
    count => equal(res.value.length, count)
  );
  Then(/^the (\d+).. attribute is (\w+)=(?:['"](.*)['"]|(null))$/,
    (index, name, value, n) => {
      const attr = res.value[parseInt(index) - 1];
      equal(attr.name, name);
      equal(attr.value, n === 'null' ? null : value);
    }
  );
});
