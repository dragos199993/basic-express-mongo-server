import postsReducer from './reducers/posts';
import profilesReducer from './reducers/profiles';

import thunk  from 'redux-thunk';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

const rootStore = combineReducers({
    postsReducer,
    profilesReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootStore, composeEnhancers(applyMiddleware(thunk)))

export default store;