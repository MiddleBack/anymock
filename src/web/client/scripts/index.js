/**
 * Created by tanxiangyuan on 16/8/23.
 */
'use strict';
import React from 'react';
import {render} from 'react-dom';
import {useRouterHistory, Router, Route, IndexRedirect,Link} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

// import rootReducer from './reducers';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import Main from './containers/Main';
import ProxySetting from './containers/ProxySetting';
import ProxyStart from './containers/ProxyStart';
import ProjectList from './containers/ProjectList';
import InterfaceList from './containers/InterfaceList';



// function configureStore(initialState) {
//     const store = createStore(
//         rootReducer,
//         initialState,
//         applyMiddleware(thunk, createLogger())
//     );
//
//     if (module.hot) {
//         // Enable Webpack hot module replacement for reducers
//         module.hot.accept('./reducers', () => {
//             /*eslint-disable global-require*/
//             const nextRootReducer = require('./reducers').default;
//             store.replaceReducer(nextRootReducer);
//         });
//     }
//
//     return store;
// }


const browserHistory = useRouterHistory(createBrowserHistory)({
    basename: '/'
});


// const store = configureStore();
// const history = syncHistoryWithStore(browserHistory, store);

render(<Router history={browserHistory}>
        <Route path='/' component={Main}>
            <IndexRedirect to='proxy/setting'/>
            <Route name="proxySetting" path='proxy/setting' component={ProxySetting}/>
            <Route name="proxyStart" path='proxy/start' component={ProxyStart}/>
            <Route name="projectList" path='project/list' component={ProjectList}/>
            <Route name="interfaceList" path='interface/list' component={InterfaceList}/>
        </Route>
    </Router>,
    document.getElementById('root'));

