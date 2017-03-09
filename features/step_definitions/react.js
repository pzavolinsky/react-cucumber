const { register } = require('../../dist/index');
const { Person, Persons } = require('../../dist/examples/person');
const { PrettyLabel } = require('../../dist/examples/pretty-label');
const { UpperCaseInput } = require('../../dist/examples/upper-case-input');
const { ConsistentCheckbox } =
  require('../../dist/examples/consistent-checkbox');
const { Clicky } = require('../../dist/examples/clicky');

register([
  Person,
  PrettyLabel,
  UpperCaseInput,
  ConsistentCheckbox,
  Clicky,
  // Note: if your component does not have a displayName you can still test it
  // by specifying a `name` here:
  { type: Persons, name: 'Persons' }
]);
