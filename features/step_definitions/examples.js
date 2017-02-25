const { register } = require('../../dist/index');
const { Person, Persons } = require('../../dist/examples/person');
const { PrettyLabel } = require('../../dist/examples/pretty-label');
const { UpperCaseInput } = require('../../dist/examples/upper-case-input');
const { ConsistentCheckbox } =
  require('../../dist/examples/consistent-checkbox');

const { ChangingInput, FancyInput, FancyLabel, UppercaseInput }
  = require('../../dist/examples/example');

register([
  { type: FancyInput, name: 'FancyInput' },
  ChangingInput,
  FancyLabel,
  UppercaseInput,
  Person,
  Persons,
  PrettyLabel,
  UpperCaseInput,
  ConsistentCheckbox
]);
