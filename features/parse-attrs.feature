Feature: Parse attributes

Scenario: Parse no attributes
  When parsing the attributes
  Then the parsed value has 0 attributes

Scenario: Parse empty string attribute
  When parsing the attributes empty=""
  Then the parsed value has 1 attribute
  And the 1st attribute is empty=""

Scenario: Parse simple string attribute
  When parsing the attributes key="simple"
  Then the parsed value has 1 attribute
  And the 1st attribute is key="simple"

Scenario: Parse escaped string attribute
  When parsing the attributes key="Homer \"J\" Simpson"
  Then the parsed value has 1 attribute
  And the 1st attribute is key="Homer \"J\" Simpson"

Scenario: Parse name-only attribute
  When parsing the attributes disabled
  Then the parsed value has 1 attribute
  And the 1st attribute is disabled=null

Scenario: Parse multiple attributes
  When parsing the attributes first="Homer" middle="Jay" last="Simpson"
  Then the parsed value has 3 attributes
  And the 1st attribute is first="Homer"
  And the 2nd attribute is middle="Jay"
  And the 3rd attribute is last="Simpson"

Scenario: Parse block attribute
  When parsing the attributes config={{ name: 'Homer' }}
  Then the parsed value has 1 attribute
  And the 1st attribute is config="{ name: 'Homer' }"
