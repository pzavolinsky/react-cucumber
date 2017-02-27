react-cucumber
==============

`react-cucumber` is a collection of [cucumberjs](https://github.com/cucumber/cucumber-js) test steps that allow you to unit test your React components using cucumber (and gherkin syntax) with minimal code.

Example
-------

Say you have the following React component:

```tsx
const Person = ({ first, middle, last }) =>
  <div className="person">
    <p className="title">{last.toUpperCase()}</p>
    <p className="subtitle">{first} {middle}</p>
  </div>;
```

You can test that the last name is rendered in upper-case with the following:

```cucumber
Scenario: last name in upper-case
  When rendering <Person first="Homer" middle="J" last="Simpson" />
  Then the 1st p has text equal to "SIMPSON"
```

For more examples see [features/examples/render.feature](https://github.com/pzavolinsky/react-cucumber/blob/master/features/examples/render.feature).

Installation
------------

```
npm install --save-dev react-cucumber
```

and then, create `features/step_definitions/react.js` with the following code:
```js
const { register } = require('react-cucumber');
// require your components here, for example:
const { MyComponent } = require('../../dist/my-component');
// ...

register([
  MyComponent,
  // ... more components here
]);
```

Usage
-----

To write a test create a `.feature` file in the `features/` directory.The test must be written using [gherkin syntax](https://cucumber.io/docs/reference). Essentially that means something on the following lines:

```gherkin
Scenario: <test description>
  Given <precondition 1>
  And <precondition 2>
  ...
  When <action 1>
  And <action2>
  ...
  Then <assertion 1>
  And <assertion 2>
  ...
```

`react-cucumber` provides several `Given`, `When` and `Then` steps specialized for React unit-testing. The following sescion summarize these steps.

#### Rendering components

###### Given a rendered `<MyComponent prop1="val1" prop2={json2} props3={$func3} prop4={$var4} />`

###### When rendering `<MyComponent prop1="val1" prop2={json2} props3={$func3} prop4={$var4} />`

These steps render `MyComponent` passing the specified props. Note that the prop values can be strings, JSON objects, registred functions (see below) or registred variables (see below)

Note: when specifing JSON props, don't forget to quote the field names! (that is: do `{ "a": 1 }` instead of `{ a: 1 }`).

They are essentially equivalent. You should use the `When` step when testing your component's `render()` and the `Given` when testing your component's response to events.

###### Given that $var is `json`

Defines `$var` as a variable that can be passed to the rendering steps above.

#### Asserting props and text

###### Then the `selector` has text equal to `json`
###### Then the `1st` `selector` has text equal to `json`
###### Then the `selector` has `props.name` equal to `json`
###### Then the `1st` `selector` has `props.name` equal to `json`
###### Then `props.name` equal to `json`
###### Then text equal to `json`

#### Passing functions called from the render

###### Given a function `$func`

Defines `$func` as a function that can be passed to the rendering steps.

###### Given a function `$func` that returns `json`

Defines `$func` as a function that can be passed to rendering steps. Whenever called, `$func` will return specified JSON value.

#### Passing functions called from the event handlers

###### When the `selector` calls props.`name` with `json`
###### When the `selector` calls props.`name`
###### When the `1st` `selector` calls props.`name`
###### When the `1st` `selector` calls props.`name` with `json`

Finds the component identified by `selector` and then calls `props.name(json)`.

The `selector` is a CSS selector.

#### Asserting that functions were called with the right arguments

###### Then the function `$func` was called `once`
###### Then the function `$func` was called `2` times

###### Then the call to `$func` had arguments `[json]`
###### Then the `1st` call to `$func` had arguments `[json]`

#### Change event short-hand steps

###### When the `selector` changes to `json`
###### When the `1st` `selector` changes to `json`

###### Then the component changed to `json`

#### Troubleshooting

###### Then dump the rendered component
