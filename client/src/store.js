import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

const initialState = {};

const middleware = [thunk];

const composeEnhancers = composeWithDevTools({})

const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

/* const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
); */

export default store;
