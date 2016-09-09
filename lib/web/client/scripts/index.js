/**
 * Created by tanxiangyuan on 16/8/23.
 */
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _Main = require('./containers/Main');

var _Main2 = _interopRequireDefault(_Main);

var _ProxySetting = require('./containers/ProxySetting');

var _ProxySetting2 = _interopRequireDefault(_ProxySetting);

var _ProxyStart = require('./containers/ProxyStart');

var _ProxyStart2 = _interopRequireDefault(_ProxyStart);

var _ProjectList = require('./containers/ProjectList');

var _ProjectList2 = _interopRequireDefault(_ProjectList);

var _InterfaceList = require('./containers/InterfaceList');

var _InterfaceList2 = _interopRequireDefault(_InterfaceList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


// import rootReducer from './reducers';
var browserHistory = (0, _reactRouter.useRouterHistory)(_createBrowserHistory2.default)({
    basename: '/'
});

// const store = configureStore();
// const history = syncHistoryWithStore(browserHistory, store);

(0, _reactDom.render)(_react2.default.createElement(
    _reactRouter.Router,
    { history: browserHistory },
    _react2.default.createElement(
        _reactRouter.Route,
        { path: '/', component: _Main2.default },
        _react2.default.createElement(_reactRouter.IndexRedirect, { to: 'proxy/setting' }),
        _react2.default.createElement(_reactRouter.Route, { name: 'proxySetting', path: 'proxy/setting', component: _ProxySetting2.default }),
        _react2.default.createElement(_reactRouter.Route, { name: 'proxyStart', path: 'proxy/start', component: _ProxyStart2.default }),
        _react2.default.createElement(_reactRouter.Route, { name: 'projectList', path: 'project/list', component: _ProjectList2.default }),
        _react2.default.createElement(_reactRouter.Route, { name: 'interfaceList', path: 'interface/list', component: _InterfaceList2.default })
    )
), document.getElementById('root'));