const { register } = require('../../dist/index');
const { Person, Persons } = require('../../dist/examples/person');
const { PrettyLabel } = require('../../dist/examples/pretty-label');
const { UpperCaseInput } = require('../../dist/examples/upper-case-input');
const { ConsistentCheckbox } =
  require('../../dist/examples/consistent-checkbox');

register([
  Person,
  { type: Persons, name: 'Persons' },
  PrettyLabel,
  UpperCaseInput,
  ConsistentCheckbox
]);
