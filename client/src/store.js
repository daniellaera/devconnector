import { createStore, applyMiddleware, compose } from 'redux';
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

const whichCompose = () => {
  if (window.navigator.userAgent.includes("Chrome")) {
    compose(
      applyMiddleware(...middleware),
      // Implements the Chrome redux tools extension
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  } else {
    compose(applyMiddleware(...middleware));
  }
};

const store = createStore(rootReducer, {}, whichCompose());

export default store;
