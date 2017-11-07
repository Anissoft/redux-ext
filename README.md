# Redux-ext

This simple package allow you to use Redux store all across the webextension. 

## How to use
### In background.js:

```javascript
import {compose, applyMiddleware, createStore} from 'redux';
import {MainStore} from 'redux-ext';
import {reducers} from './reducers.js';
import {defaultState} from './defaultState.js';
 
let _store = createStore(reducers,
        defaultState, 
        compose(applyMiddleware(/*%ALL YOUR MIDDLEWARE%*/))),
    store = new MainStore(_store, 'myname');
 
store.dispatch(/*...*/);
```
### In content or popup:

```javascript
import {ProxyStore} from 'redux-ext';
 
let store = new ProxyStore('myname');
 
store.ready().then(() => {
    /*your code*/
});
```
