Feature: Function prop examples
# These examples show how to test function props (i.e. callbacks). There are two
# types of tests related to functions:

# 1) Functions called from the component's render (e.g. prettify)
# ---------------------------------------------------------------
# Assume:
#   class PrettyLabel extends React.Component {
#     render() {
#       const { text, prettify } = this.props;
#       return <label className="pretty">
#         {prettify(text)}
#       </label>;
#     }
#   };
Scenario: Test functions called from render()
  Given a function $someFn that returns "Homer"
  When rendering <PrettyLabel text="HoMeR" prettify={$someFn} />
  Then the label has text equal to "Homer"
  And the function $someFn was called once
  And the call to $someFn had arguments ["HoMeR"]

# 2) Functions called from an event handler (e.g. onChange)
# ---------------------------------------------------------
# Assume:
#   const UpperCaseInput = React.createClass({
#     render() {
#       return <input {...this.props} onChange={e => this.props.onChange({
#         target: {
#           value: e.target.value.toUpperCase()
#         }
#       })} />;
#     }
#   });
Scenario: Test functions called from an event handler
  Given a function $someFn
  And a rendered <UpperCaseInput value="empty" onChange={$someFn} />
  When the input calls props.onChange with
  """
  {
    "target": { "value": "homer" }
  }
  """
  Then the function $someFn was called once
  And the call to $someFn had arguments
  """
  [{
    "target": { "value": "HOMER" }
  }]
  """
  # Note: for most steps, the last argument can be moved to the next line, as
  # is the case for the When and the last Then above.

# 2-bis) onChange functions that receive { target: { value: <value> } }
# ---------------------------------------------------------------------
# Assume the same as 2 above
Scenario: Test onChange handlers using shorthand steps
  # Note that $onChange is always defined
  Given a rendered <UpperCaseInput value="empty" onChange={$onChange} />
  When the input changes to "homer"
  Then the component changed to "HOMER"

# 2-bis-bis) onChange checkbox
# ----------------------------
# Assume:
#   class ConsistentCheckbox extends React.Component<PropTypes, {}> {
#     constructor(props:PropTypes, ctx:any) {
#       super(props, ctx);
#       this.onChange = this.onChange.bind(this);
#     }
#     onChange(e:React.ChangeEvent<HTMLInputElement>) {
#       const { onChange } = this.props;
#       onChange({ target: { value: e.target.checked } });
#     }
#     render() {
#       return <input type="checkbox"
#         {...this.props}
#         value=""
#         onChange={this.onChange}
#       />;
#     }
#   };
Scenario: Test onChange handlers for checkboxes
  Given a rendered <ConsistentCheckbox value={false} onChange={$onChange} />
  When the input calls props.onChange with { "target": { "checked": true } }
  Then the component changed to true

# 2-events) stopPropagation and preventDefault
# --------------------------------------------
# Assume:
#   export class Clicky extends React.Component {
#     constructor(props, ctx) {
#       super(props, ctx);
#       this.onClick = this.onClick.bind(this);
#     }
#     onClick(e) {
#       const { text, onClick } = this.props;
#       e.stopPropagation();
#       e.preventDefault();
#       onClick(text);
#     }
#     render() {
#       const { text } = this.props;
#       return <div className="clicky" onChange={this.onClick}>
#         {text}
#       </div>;
#     }
#   };
Scenario: Test event handlers that call stopPropagation and/or preventDefault
  Given a function $onClick
  And a rendered <Clicky text="hi!" onClick={$onClick} />
  When the div.clicky calls props.onClick with event {}
  Then the function $onClick was called once
  And the call to $onClick had arguments [ "hi!" ]
