import { createStore, applyMiddleware, compose } from 'redux';  // Import Redux functions to create store and apply middleware
import createSagaMiddleware from 'redux-saga';  // Import redux-saga middleware for handling side effects
import thunkMiddleware from 'redux-thunk';  // Import redux-thunk middleware for handling asynchronous actions

import rootReducer from './reducers';  // Import the root reducer that combines all reducers
import rootSaga from './sagas';  // Import the root saga which combines all sagas

// Create the saga middleware to run side effects
const sagaMiddleware = createSagaMiddleware();

// Set up Redux DevTools extension if available, otherwise fall back to basic compose
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the Redux store, apply middleware for saga and thunk, and enable Redux DevTools if available
const store = createStore(
  rootReducer,  // Root reducer that combines all reducers
  composeEnhancers(applyMiddleware(sagaMiddleware, thunkMiddleware))  // Apply saga and thunk middlewares
);

// Run the root saga using the saga middleware
sagaMiddleware.run(rootSaga);

export default store;  // Export the configured store as the default export
