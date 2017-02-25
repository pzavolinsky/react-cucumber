Feature: Example

Scenario: Assert attributes
  When rendering <FancyInput value="test" />
  Then the input has props.value equal to "test"
  And props.className equal to "fancy"

Scenario: Assert text
  When rendering <FancyLabel value="me" />
  Then the label has text equal to "label for me"
  And props.className equal to "fancy"

Scenario: Dump rendered component (useful for debugging!)
  When rendering <FancyInput value="test" />
  Then dump the rendered component

Scenario: Call function
  Given a function $someFn
  And a rendered <ChangingInput value="test" onChange={$someFn} />
  When the input calls props.onChange
  Then the function $someFn was called once
  And the call to $someFn had arguments ["changed!"]

Scenario: Test events
  Given a function $someFn
  And a rendered <UppercaseInput value="test" onChange={$someFn} />
  When the input calls props.onChange with {"target":{"value":"hi!"}}
  Then the function $someFn was called once
  And the call to $someFn had arguments [{"target":{"value":"HI!"}}]

Scenario: Test change event using change helper
  Given a rendered <UppercaseInput value="test" onChange={$onChange} />
  When the input changes to "hi!"
  Then the component changed to "HI!"
