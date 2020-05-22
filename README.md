# Muezzin 👳🏻‍♂️

> The final, opinionated, solution to REST API calls based on `redux-saga`

## Installation

To install, add `muezzin` npm package and make sure you have it's peer dependencies:

`yarn add muezzin redux-saga react react-redux`

## Getting started 🚀

### HOR

First, we need to setup a HOR (High-Order-Reducer) that will wrap your existing one.

#### A) Simplest store setup

So, for example, should you have the simplest Redux store possible:

```typescript
const store = createStore(yourAppReducer);
```

would now become

```typescript
import { withAPI } from "muezzin";

const store = createStore(withAPI(yourAppReducer));
```

#### B) Setup with `combineReducers`

```typescript
const yourAppReducer = combineReducers({
  sliceA: reducerA,
  sliceB: reducerB
});

const store = createStore(yourAppReducer);
```

would now become

```typescript
import { apiReducer, withAPI } from "muezzin";

const yourAppReducer = combineReducers({
  api: apiReducer,
  sliceA: reducerA,
  sliceB: reducerB
});

const store = createStore(withAPI(yourAppReducer));
```
