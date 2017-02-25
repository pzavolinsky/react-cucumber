Feature: Parse blocks

Scenario: Parse an empty block
  When parsing the block {}
  Then the parsed value is '' and the rest is ''

Scenario: Parse an empty block with rest
  When parsing the block {} then some
  Then the parsed value is '' and the rest is ' then some'

Scenario: Parse a simple block
  When parsing the block {simple}
  Then the parsed value is 'simple' and the rest is ''

Scenario: Parse a block with embedded strings
  When parsing the block {"string"}
  Then the parsed value is '"string"' and the rest is ''

Scenario: Parse a block with embedded strings with curly brackets
  When parsing the block {"hey, :-{, this is just text"}
  Then the parsed value is '"hey, :-{, this is just text"' and the rest is ''

Scenario: Parse nested blocks
  When parsing the block {obj:{key:"value"}}
  Then the parsed value is 'obj:{key:"value"}' and the rest is ''

# Edges

Scenario: Parse an incomplete block
  When parsing the block {infinity
  Then the parsing fails

Scenario: Parse an incomplete nested block
  When parsing the block {infini{ty
  Then the parsing fails

Scenario: Parse an incomplete embedded string
  When parsing the block {"infinity
  Then the parsing fails
