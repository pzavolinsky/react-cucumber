Feature: Parse strings

Scenario: Parse a simple string
  When parsing the string "hello, world"
  Then the parsed value is 'hello, world' and the rest is ''

Scenario: Parse a simple string with rest
  When parsing the string "hello, world" then some
  Then the parsed value is 'hello, world' and the rest is ' then some'

Scenario: Parse a escaped string
  When parsing the string "hello, \"world\""
  Then the parsed value is 'hello, \"world\"' and the rest is ''

Scenario: Parse a escaped string with rest
  When parsing the string "hello, \"world\"" then some
  Then the parsed value is 'hello, \"world\"' and the rest is ' then some'

# Edges

Scenario: Parse an incomplete string
  When parsing the string "hello, infinity
  Then the parsing fails
