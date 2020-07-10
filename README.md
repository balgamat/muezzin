# Muezzin 👳🏻‍♂️

> The final, opinionated, solution to REST API calls based on `redux-saga`

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)  
[![npm version](https://badge.fury.io/js/muezzin.svg)](https://badge.fury.io/js/muezzin)

## 💿 Installation

To install, add `muezzin` npm package and make sure you have it's peer dependencies:

`yarn add muezzin redux-saga react react-redux`

## 🚀 Quickstart

Setup your store like this:

```typescript
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { watchAPI, withAPI } from 'muezzin';

...

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  withAPI(<YOUR_APP_REDUCER>),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(function*() {
  yield all([watchAPI()]);
});
```

Then proceed to **Requests** to learn how to write your first request!

## 🏃‍♂️ Getting started

### 1. HOR

First, we need to setup a HOR (High-Order-Reducer) that will wrap your existing one.

#### A) Simplest store setup

So, for example, should you have the simplest Redux store possible:

```typescript
const store = createStore(<YOUR_APP_REDUCER>);
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

### 2. Attaching the `watchAPI` saga

Given your store setup is somehow matching the ex. 1B, when you apply saga middleware and start a saga that will watch for
API calls, your store setup will look like as follows:

```typescript
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { watchAPI, withAPI } from 'muezzin';

...

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  withAPI(yourAppReducer),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(function*() {
  yield all([watchAPI()]);
});
```

And that's it! Now you only have to write your requests!

## Requests

The simplest request possible would look like following:

```typescript
import { api } from "muezzin";

api({
  name: "getProfile", // A friendly name your request will be identified by
  url: `https://yourawesomeproject.com/api/me`
});
```

This creates an action that you can dispatch (e.g. by clicking a button). The action then gets processed by the `watchAPI`
saga we have configured earlier and a GET request is sent to the specified address. You can then monitor the status of
the request by its name and wait for it or check for an error, if that happens. (More on that later)

### Request examples

Although the request above would definitely work, it's not of much use, mainly because we don't do anything with data
returned (provided there are some). Let's update the example before so it can stand the test of the real-world:

```typescript
import { api, CallBehavior } from "muezzin";
import { call } from "redux-saga/effects";

export const getProfile = () =>
  api({
    behavior: CallBehavior.TakeLatest,
    name: "getProfile",
    url: `https://yourawesomeproject.com/api/me`,
    reducer: (response, state) => ({ ...state, profile: data }),
    errorActions: (error, state) => [
      call([SentryService, "setUserContext"], {
        email: "failed to fetch"
      })
    ],
    postActions: (response, state) => [
      call([SentryService, " setUserContext"], data)
    ]
  });
```

Here, the data received is saved to the state under the key `profile`. If everything goes well, we can also define some
actions or functions that will run after success (you can chain requests this way) - in this example we set user context for
the Sentry. In the same manner, you can define actions and/or functions that should run in the case of error. Heck,
you can even define actions and functions to be dispatched/executed before the request is sent!

Now let's get serious and look at a really complex request:

```typescript
import { api, CallBehavior, addDefaultHeaderKey } from 'muezzin';
import { call, put } from 'redux-saga/effects';

export interface Credentials {
  username: string;
  password: string;
}

export const login = (params: Credentials) =>
  api({
    behavior: CallBehavior.TakeLatest,
    name: "auth/login",
    url: `https://yourawesomeproject.com/api/login`,
    params: state => {
      method: "POST",
      body: JSON.stringify({ ...state.oauthConfig, ...params })
    },
    preActions: state => [put(someImportantActionToBeDispatchedBeforehand())],
    errorActions: error => {
      const errorActions = [];
      error === 'WRONG_PASS' && errorActions.push(put(actionThatShowsError("Wrong password")));
      return errorActions￿;
    },
    postActions: data => [
      call(addDefaultHeaderKey, "Authorization", `Bearer ${data.access_token}`),
      call([SentryService, " setUserContext"], data)
    ]
  });
```

#### 🧩 Request Parameters

I guess it's high time I explained everything you can and cannot do with it, eh? So, here goes:

| **Key**         | **Description**                                                                                                                                                                                                                                                               | **Type**                                                                                       | **Defaults to**                              | **Example**                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| `behavior?`     | Can cancel previous/following requests if a multitude of them would be running. E.g. TakeLatest would only keep the latest requests and cancel previous ones, that are out there. This is useful when you e.g. refresh your filtering as you want only the most current data. | _CallBehavior_                                                                                 | `CallBehavior.TakeEvery`                     | `CallBehavior.TakeLatest`                                  |
| `errorActions?` | Actions or functions to dispatch/execute on error.                                                                                                                                                                                                                            | _(error: any, state: any) => Array<PutEffect OR CallEffect>)_ _Array<PutEffect OR CallEffect>_ |                                              | `e => [call(console.log, e)]`                              |
| `errorReducer?` | How state should be altered on error.                                                                                                                                                                                                                                         | _(error: any, state: T) => T_                                                                  |                                              | `(e, state) => {...state, error:e }`                       |
| `name`          | A friendly identifier for the request.                                                                                                                                                                                                                                        | _string_                                                                                       |                                              | `auth/login`                                               |
| `params?`       | Request params. _See [Axios](https://github.com/axios/axios)_                                                                                                                                                                         | _AxiosRequestConfig_                                                                                  | `{ headers: defaultHeaders, method: 'GET' }` | `{ method: 'POST', body: JSON.stringify({data: 'DATA'}) }` |
| `postActions?`  | Actions or functions to dispatch/execute on success.                                                                                                                                                                                                                          | _(data: any, state: any) => Array<PutEffect OR CallEffect>)_ _Array<PutEffect OR CallEffect>_  |                                              | `data => [call(console.log, data)]`                        |
| `preActions?`   | Actions or functions to dispatch/execute before the request is sent.                                                                                                                                                                                                          | _(data: any, state: any) => Array<PutEffect OR CallEffect>)_ _Array<PutEffect OR CallEffect>_  |                                              | `state => [put(actionCreator(state)]`                      |
| `reducer?`      | How state should be altered on success.                                                                                                                                                                                                                                       | _(result: any, state: T) => T_                                                                 |                                              | `(data, state) => {...state, user: data }`                 |
| `url`           | Request URL                                                                                                                                                                                                                                                                   | _string_                                                                                       |                                              | `https://backend.net/api/me`                               |

## 💈 Loading

Remember the 'friendly name' you had to assign to each of your requests? Now's the time we'll see it in actions. Turns
out, there was a lot happening behind the scenes:

1. When you dispatch the `api` action, it fires a `loadingStart` action and this causes the `apiReducer` to add a key
   with the name of your request to the `loading` state.

2. When the request ends, regardless of whether it succeeded or not, `loadingEnd` is fired and state updates again.

3. When an error occurs, it is stored in a list of errors that happened on this particular request. The errors then keep
   piling up there until you are ready to deal with them and after that, you clear them. (more in the next chapter)

You don't have to know all this, however. Muezzin has some tools ready to assist you with your components rightaway:

### `isLoading`

Whenever you need to wait for something, show a loading indicator or just know if something is happening, you can use
`isLoading` selector. Just enter the names of all the requests that you want to wait for and it returns true or false.

Let's say we have requests called `profile`, `rankings` and `scores`. All of these get loaded on our homepage and we don't want to display it before all of these are resolved:

```typescript
import { isLoading } from "muezzin";
import { useSelector } from "react-redux";

const Homepage = () => {
  useSelector(isLoading("profile", "rankings", "score")) ? (
    "Loading..."
  ) : (
    <Content />
  );
};
```

### `withLoading`

Actually, the case displayed in the example above is so common, that there's an HOC to make things around loading
even easier. You enter a `spinner`, requests to wait for, and with this, you wrap a component of your choice. Then,
whenever some of those requests you've specified is loading, your `spinner` gets displayed instead!

And because the HOC is curried, it's all even more convenient!

```typescript
import { withLoading } from "muezzin/react";

const Spinner = () => <h1>'Loading...'</h1>

// Taking advantage of currying
const withSpinner = withLoading(<Spinner/>);
const LoadableProfile = withSpinner('profile')(Profile);
const LoadableScore = withSpinner('scores')(Scores);

// Of course, you can do this rightaway
const Dashboard = withLoading(<Spinner/>)("profile", "rankings", "score")(Content);

...

return <Dashboard someProp={1} /> // Spinner gets displayed if something is pending...
```

## 💔 Errors
When an error occurs, it is stored in a list of errors that happened on this particular request. The errors then keep piling up there until you are ready to deal with them and after that, you clear them.

### `getErrors`

In a similar manner, you can get errors for your endpoints. These get returned as an object, that contains list of errors under the keys of requests' names. (e.g. `{ profile: ['Could not fetch profile'], score: ['Invalid request']}` )

```typescript
import { getErrors } from "muezzin";
import { useSelector } from "react-redux";

const Homepage = () => {
  const errors = useSelector(getErrors("profile", "rankings", "score"));

  if (errors.profile.length) {
    return `Error(s) loading profile: ${errors.profile}`;
  }
  if (errors.rankings.length) {
    return `Error(s) loading profile: ${errors.rankings}`;
  }
  if (errors.score.length) {
    return `Error(s) loading score: ${errors.score}`;
  }
  return <Content />;
};
```

### `clearErrors`

Once you deal with an error, you should clear it. This is done by dispatching a clearError action:

```typescript
import { clearErrors, ClearErrorBehavior } from "muezzin";
...

<Button
  onClick={() => dispatch(clearErrors({atOrigin: 'profile', behavior: ClearErrorBehavior.ClearFirst }))}
/>
```

Depending on how thorough you want to be, you can either clean all errors everywhere:

```typescript
clearErrors();
```

clear all errors for some request

```typescript
clearErrors({ atOrigin: "profile" });
```

or clear them one by one as you go, either in the LIFO or FIFO manner, depending on the behavior parameter set:

```typescript
clearErrors({ atOrigin: "profile", behavior: ClearErrorBehavior.ClearFirst }); // FIFO
```

for FIFO error handling or

```typescript
clearErrors({ atOrigin: "profile", behavior: ClearErrorBehavior.ClearLast }); // LIFO
```

to clear the last error first. There's also `ClearErrorBehavior.ClearAll` for completeness, but this behavior is default so you don't have to set it explicitly.

### Default error interceptors
If you have some sort of error handling in place already, you might find _default error interceptors_ useful. It might come handy also in cases where you need to revoke or renew token once your backend has
returned an error that it expired. These interceptors are ran on each error, so it might be a good idea to put a condition in place, that will select just the cases where you need them.

Similar to `errorActions`, as described above in the table, you have `setDefaultErrorInterceptors` (and `getDefaultErrorInterceptors` respectively) that add these to all `api()` actions' `errorActions` as if you had defined them on each call separately.

```typescript
import { setDefaultErrorInterceptors } from "muezzin";
import {call, put } from "@redux-saga/core/effects";

const myErrorHandler = function* (error: any, state: any) {
  if (error === 'TOKEN_REVOKED' && state.loggedIn) {
    put(renewToken()); // Dispatches an action that will try to get a new token
  }
}

setDefaultErrorInterceptors((error, state) => [call(myErrorHandler, error, state)]);
```

## 🚌 Batches

Sometimes, it's necessary to synchronize multiple API calls. You can do this either by chaining the requests in `postActions` or, more elegantly, employing the power of `batchCall`. Batch call takes a list of your `api` actions
and an `onFinished` parameter, that specifies what to do next.

```typescript
import { batchCall } from "muezzin";
import { put } from 'redux-saga/effects';

const getBFFs = batchCall({
    requests: [getProfile('sascha'), getProfile('nadia'), getProfile('karen')],
    onFinished: state => [put(displayBFFsmodal())]
})

...

dispatch(getBFFs());
...
```

Once all of the actions from `requests` array are finished, the batch saga dispatches all of the actions and calls all of the functions in onFinished. Performing a batch is also marked in Redux by `batchStarted` and `batchFinished` actions being dispatched at the start or at the end of the batch respectively.

## 👤 Headers

You can either set headers for each one and every request or you can set a set of default ones that will be added to every request without you setting them explicitly. For this you can use
these utility functions:

#### `setDefaultHeaders`

This sets all default headers at once. If there were some default headers set before, this overwrites them.

```typescript
import { setDefaultHeaders } from "muezzin";

setDefaultHeaders({
  "Content-Type": "application/json",
  Accept: "*"
});
```

#### `addDefaultHeaderKey`

Adds a new key-value pair to the `defaultHeaders` object. This might be useful e.g. for Auth:

```typescript
import { addDefaultHeaderKey } from "muezzin";

addDefaultHeaderKey("Authorization", `Bearer ${token}`);
```

#### `clearDefaultHeaderKey`

Removes a key-value pair from the `defaultHeaders` object. This might be useful e.g. after logout:

```typescript
import { clearDefaultHeaderKey } from "muezzin";

clearDefaultHeaderKey("Authorization");
```

#### `getDefaultHeaders`
Returns the current state of the `defaultHeaders` object.

**NOTE: If you set your own headers in the `api()` action creator, these are used instead of
the `defaultHeaders`. If you want to include these, add them using `getDefaultHeaders()`**

## Axios

The underlying package to make the calls is `axios`. You can get access to the `axios` object through the `setupAxios` function and then set up additional parameters like base URL, default headers, interceptors, etc.

```typescript
import { setupAxios } from "muezzin";

setupAxios(axios => {
  axios.defaults.baseURL = 'https://api.example.com';
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
})
```

## Typescript

If you are using Typescript, you should also augment the provided `AppState` interface with the type of your respective state.
Let's say your state contains two keys: `items` of type `string[]` and `users` of type `object[]`, then to have your `api()` function parameters correctly typed, you place this code somewhere high enough (e.g. where you configure your store):

```typescript
declare module 'muezzin' {
  interface AppState {
    a: string;
    b: number;
  }
}
```