import * as React from 'react';

export interface PersonType {
  first: string
  middle: string
  last: string
}

export const Person = ({ first, middle, last }:PersonType) =>
  <div className="person">
    <p className="title">{last.toUpperCase()}</p>
    <p className="subtitle">{first} {middle}</p>
  </div>;

// The following hack is required for Typescript (and high-order components),
// probably not required when using babel (since the JSX processor automatically
// adds the displayName).
//
// Note: there is an alternative registration format that does not require this
// hack, check features/step_definitions/examples.js for an example (using
// Persons below).
(Person as any).displayName = 'Person';

const PersonSummary = ({ first, middle, last }:PersonType) =>
  <li>{last}, {first} {middle}</li>;

export const Persons = ({ persons }:{ persons: PersonType[] }) =>
  <ul>
    {persons.map((p, i) => <PersonSummary key={i} {...p} />)}
  </ul>;
