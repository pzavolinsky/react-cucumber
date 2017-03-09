Feature: Render examples
# These examples show how to test that, given a set of props, your components
# render the expected HTML markup. These tests assume that your components are
# stateless (but they can be either pure functions, classes, React.createClass,
# instances, etc.).

# Assume (acual Typescript definition in src/examples/person.tsx):
#   const Person = ({ first, middle, last }) =>
#     <div className="person">
#       <p className="title">{last.toUpperCase()}</p>
#       <p className="subtitle">{first} {middle}</p>
#     </div>;

Scenario: Assert attributes
  When rendering <Person first="Homer" middle="J" last="Simpson" />
  Then the div has props.className equal to "person"

Scenario: Use 1st, 2nd, etc to distinguish between multiple elements
  When rendering <Person first="Homer" middle="J" last="Simpson" />
  # Note that you can omit the "1st" to refer to the first element, as in:
  And the p has props.className equal to "title"
  # altough in this test makes more sense to be explicit:
  And the 1st p has props.className equal to "title"
  And the 2nd p has props.className equal to "subtitle"

Scenario: Assert text
  When rendering <Person first="Homer" middle="J" last="Simpson" />
  Then the 1st p has text equal to "SIMPSON"
  And the 2nd p has text equal to "Homer J"

Scenario: Use CSS selectors to find elements
  When rendering <Person first="Homer" middle="J" last="Simpson" />
  Then the p.title has text equal to "SIMPSON"
  And the .subtitle has text equal to "Homer J"

Scenario: Use shorthand to assert multiple things on the same element
  When rendering <Person first="Homer" middle="J" last="Simpson" />
  Then the 1st p has text equal to "SIMPSON"
  And props.className equal to "title"
  And the 2nd p has props.className equal to "subtitle"
  And text equal to "Homer J"

Scenario: Pass non-string properties (i.e. JSON)
  When rendering <Person first={"Homer"} middle={1} last="Simpson" />
  Then the p.subtitle has text equal to "Homer 1"

# Assume:
#   const PersonSummary = ({ first, middle, last }) =>
#     <li>{last}, {first} {middle}</li>;
#
#   const Persons = ({ persons }) =>
#     <ul>
#       {persons.map((p, i) => <PersonSummary key={i} {...p} />)}
#     </ul>;
Scenario: Complex JSON props, variables and multiple renders
  Given that $persons is
  """
  [ { "first": "Homer", "middle": "J", "last": "Simpson" }
  , { "first": "Marge", "middle": "" , "last": "Bouvier" }
  ]
  """
  When rendering <Persons persons={$persons} />
  Then the 1st li has text equal to "Simpson, Homer J"
  And the 2nd li has text equal to "Bouvier, Marge "


# Assume:
# class UpperCaseInput extends React.Component {
#   displayName = 'UpperCaseInput';
#   render() {
#     return <input {...this.props}
#       onChange={e => this.props.onChange({
#         target: {
#           value: e.target.value.toUpperCase()
#         }
#       })}
#       value={this.props.toUpperCase()}
#     />;
#   }
# }
Scenario: UpperCaseInput shows the value in UPPERCASE
  When rendering <UpperCaseInput value="Simpson" />
  Then the input has props.value equal to "SIMPSON"

Scenario: changes typed values to UPPERCASE
  Given a rendered <UpperCaseInput value="" onChange="$onChange" />
  When the input changes to "Simpson"
  Then the component changed to "SIMPSON"

Scenario: you can move the React component to the next line
  When rendering
  """
  <UpperCaseInput
    value="Simpson"
  />
  """
  Then the input has props.value equal to "SIMPSON"
