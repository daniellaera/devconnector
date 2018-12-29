import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import reducers from './reducers';

const initialState = {};

const middleware = [thunk];

/* const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
); */

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;
}

const store = () => {
  return createStore(
    rootReducer,
    applyMiddleware(thunk)
    // composeEnhancers(applyMiddleware(thunk))
  );
};

export default store;
