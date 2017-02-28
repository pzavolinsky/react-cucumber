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

Basic usage
-----------

To write a test create a `.feature` file in the `features/` directory. The test must be written using [gherkin syntax](https://cucumber.io/docs/reference). Essentially that means something on the following lines:

```gherkin
Feature: <what are you testing>

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

Let's start simple, say you have stateless React component. By stateless I mean *without state*, but not necessarily a function component, and just to make a point here, we'll use a *class*.

Say we have this `src/upper-case-input.js`:

```tsx
import * as React from 'react';

export class UpperCaseInput extends React.Component {
  render() {
    return <input {...this.props} value={this.props.toUpperCase()} />;
  }
}
```

A test for `UpperCaseInput` could check that any value given to it is displayed as *UPPERCASE*.

So let's create `features/upper-case-input.feature`:

```gherkin
Feature: UpperCaseInput

Scenario: shows the value in UPPERCASE
  When rendering <UpperCaseInput value="Simpson" />
  Then the input has props.value equal to "SIMPSON"
```

Let's go over the test step by step:
  * Given (preconditions): this test has none.

  * When (actions): we render `UpperCaseInput` with `Simpson`.

    The step we used here is:

    **When rendering `component`**

  * Then (assertions): we check that the `input` has a `value` prop with value `SIMPSON`.

    The step we used here is:

    **Then the `selector` has props.`name` equal to `value`**

For this example to be complete we need to create `features/step_definitions/react.js` with the following code:
```js
const { register } = require('react-cucumber');

// assuming your build process drops your complied JS into dist/
const { UpperCaseInput } = require('../../dist/upper-case-input');

register([
  UpperCaseInput
  // ... more components here
]);
```

That's it, you can run the test with: `./node_modules/.bin/cucumberjs`.

Okay, but that's only the render, how about testing the component's response to events?

Let's revisit the `UpperCaseInput` component:

```tsx
import * as React from 'react';

export class UpperCaseInput extends React.Component {
  render() {
    return <input {...this.props}
      value={this.props.toUpperCase()}
      onChange={e => this.props.onChange({
        target: {
          value: e.target.value.toUpperCase()
        }
      })}
    />;
  }
}
```

Now we added an event handler that will upper-case whatever you type into the input before calling `onChange`. To test this behavior we can add another `Scenario` to `features/upper-case-input.feature`:

```gherkin
Feature: UpperCaseInput

Scenario: shows the value in UPPERCASE
  When rendering <UpperCaseInput value="Simpson" />
  Then the input has props.value equal to "SIMPSON"

Scenario: changes typed values to UPPERCASE
  Given a rendered <UpperCaseInput value="" onChange={$onChange} />
  When the input changes to "Simpson"
  Then the component changed to "SIMPSON"
```

Here's the test breakdown:
  * Given (preconditions): we render `UpperCaseInput` with a mystical `$onChange` function as the `onChange` event handler (more on this later).

    The step we used here is:

    **Given a rendered `component`**

  * When (actions): we simulate `input` triggering an `onChange` event that looks like `{ target: { value: "Simpson" } }`.

    The step we used here is:

    **When the `selector` changes to `JSON value`**

  * Then (assertions): we check that the `UpperCaseInput` called it's `onChange` prop with something that looks like `{ target: { value: "SIMPSON" } }`.

    The step we used here is:

    **Then the component changed to `JSON value`**

One thing to note here is that both `input` and `UpperCaseInput` have somewhat similar *change* events, that is: `{ target: { value: "something" } }`.

The **When the `selector` changes to `JSON value`** step will only work for elements that have an `onChange` prop that takes an event in this format (e.g. `<input />`).

In the same spirit, **Then the component changed to `JSON value`** will only work if *your* component has an `onChange` prop that takes an event in this format (e.g. `<UpperCaseInput />`).

So what happens of our component has a different event handler callback, for example:

```tsx
import * as React from 'react';

export class UpperCaseInput2 extends React.Component {
  render() {
    return <input {...this.props}
      value={this.props.toUpperCase()}
      onChange={e => this.props.onText(e.target.value.toUpperCase())}
    />;
  }
}
```

Let's adapt the last test to `onText`:

```gherkin
Feature: UpperCaseInput2

Scenario: changes typed values to UPPERCASE
  Given a function $someFn
  And a rendered <UpperCaseInput2 value="" onText={$someFn} />
  When the input changes to "Simpson"
  Then the function $someFn was called once
  And the call to $someFn had arguments ["SIMPSON"]
```

This means:
  * Given (preconditions): we declare that `$someFn` is a *mocked* function that we will pass to our component. We also render `UpperCaseInput` passing `$someFn` function as the `onText` event handler.

    The steps we used here are:

    **Given a function `$funcName`**

    **Given a rendered `component`**

  * When (actions): same as before.

  * Then (assertions): we check that `$someFn` was called exactly once. We also check that the call to `$someFn` had the expected arguments.

    The steps we used here are:

    **Then the function `$someFn` was called once**

    **The call to `$someFn` had arguments `JSON array`**

Finally, what if the `input` used some other event format? In the next example we'll repeat the test above, but being explicit about the change in the `input`:

```gherkin
Feature: UpperCaseInput2

Scenario: changes typed values to UPPERCASE (explicit lyrics)
  Given a function $someFn
  And a rendered <UpperCaseInput2 value="" onText={$someFn} />
  When the input calls props.onChange with { "target": { "value": "Simpson" } }
  Then the function $someFn was called once
  And the call to $someFn had arguments ["SIMPSON"]
```

The only difference here is the explicit *When*. Note that we had to specify both the name of prop to call (i.e. `onChange`) and the event format. The step we used here is:

  **When the `selector` calls props.`name` with `JSON value`**

This concludes this crash course into `react-cucumber`. The steps we used here are only *some* of the steps available for you to use. The next section list every available step organized by category.


Step reference
--------------

#### Rendering components

###### Given a rendered `<MyComponent prop1="val1" prop2={json2} props3={$func3} prop4={$var4} />`

###### When rendering `<MyComponent prop1="val1" prop2={json2} props3={$func3} prop4={$var4} />`

These steps render `MyComponent` passing the specified props. Note that the prop values can be strings, JSON objects, registered functions (see below) or registered variables (see below)

Note: when specifying JSON props, don't forget to quote the field names! (that is: do `{ "a": 1 }` instead of `{ a: 1 }`).

The two steps above are essentially equivalent. You should use the `When` step when testing your component's `render()` and the `Given` when testing your component's response to events.

###### Given that $var is `json`

Defines `$var` as a variable that can be passed to the rendering steps above.

----

#### Asserting props and text

###### Then the `1st` `selector` has text equal to `json`
###### Then the `1st` `selector` has props.`name` equal to `json`
###### Then the `selector` has text equal to `json`
###### Then the `selector` has props.`name` equal to `json`
###### Then text equal to `json`
###### Then props.`name` equal to `json`

`1st` can actually be any ordinal of the form `numbers + two-letter suffix` (e.g. `2nd`, `3rd`, etc.). When `1st` is omitted, the first element that matches `selector` is assumed

`selector` is a CSS selector on the rendered pseudo-HTML. When both `selector` and `1st` are omitted, the element matched in the previous *Then* step is used (make sure that there *is* a la previously matched element).

`json` is any JSON value, in particular quoted strings, numbers, booleans, objects or arrays.

`name` is the name of any prop in matched element.

----

#### Passing functions called from the render

###### Given a function `$func`

Defines `$func` as a function that can be passed to the rendering steps.

###### Given a function `$func` that returns `json`

Defines `$func` as a function that can be passed to rendering steps. Whenever called, `$func` will (always) return the specified JSON value.

----

#### Passing functions called from the event handlers

###### When the `1st` `selector` calls props.`name` with `json`
###### When the `1st` `selector` calls props.`name`
###### When the `selector` calls props.`name` with `json`
###### When the `selector` calls props.`name`

Finds the component identified by `selector` and then calls `props.name(json)`.

`1st` can actually be any ordinal of the form `numbers + two-letter suffix` (e.g. `2nd`, `3rd`, etc.). When `1st` is omitted, the first element that matches `selector` is assumed.

`selector` is a CSS selector on the rendered pseudo-HTML.

`name` is the name of any prop in matched element that is a function.

`json` is any JSON value. If you want to pass multiple values use a JSON array. If you want to pass a single value that is a JSON array, pass instead an array with the value. For example to call `props.func([1,2,3])` pass `[[1,2,3]]`.

----

#### Asserting that functions were called with the right arguments

###### Then the function `$func` was called once
###### Then the function `$func` was called `2` times

Checks that `$func` was called the specified number of times.

`$func` must be a function defined with **Given a function `$func`** or the predefined `$onChange`.

Of course, `2` above can be any number.

###### Then the `1st` call to `$func` had arguments `[json]`
###### Then the call to `$func` had arguments `[json]`

Checks the that arguments passed to the specified `$func` call are the expected ones.

`1st` can actually be any ordinal of the form `numbers + two-letter suffix` (e.g. `2nd`, `3rd`, etc.). When `1st` is omitted, the first call to `$func` is assumed.

`[json]` is an array of JSON values (e.g. objects, string, numbers, etc.).

----

#### Change event short-hand steps

###### When the `1st` `selector` changes to `json`
###### When the `selector` changes to `json`

Equivalent to:

  **When the `1st` `selector` calls props.`$onChange` with `{ "target": { "value": <json> } }`**.

###### Then the component changed to `json`

Equivalent to:

  **Then the function `$onChange` was called once**.

  **And the call to `$onChange` had arguments `{ "target": { "value": <json> } }`**


#### Troubleshooting

###### Then dump the rendered component

Shows the pseudo-HTML rendered by either of the rendering steps.

----

More examples:
* [features/examples/render.feature](https://github.com/pzavolinsky/react-cucumber/blob/master/features/examples/render.feature)
* [features/examples/functions.feature](https://github.com/pzavolinsky/react-cucumber/blob/master/features/examples/functions.feature)
* [features/step_definitions/react.js](https://github.com/pzavolinsky/react-cucumber/blob/master/features/step_definitions/react.js)
