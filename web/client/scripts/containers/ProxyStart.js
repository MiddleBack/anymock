/**
 * Created by tanxiangyuan on 16/8/26.
 */
import React from 'react';
import Button from 'antd/lib/button';
import Message from 'antd/lib/message';
import fetch from '../utils/fetch';
import merge from 'lodash/merge';
import './less/ProxyStart.less';

const PROXY_SERVER_STATE = {
    STOPED: 0, STARTING: 1, RUNNING: 2, STOPPING: 3
};
const START_SERVER_URL = '/api/proxy/service?start';
const STOP_SERVER_URL = '/api/proxy/service?stop';

export default class ProxyStart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proxyServerState: PROXY_SERVER_STATE.STOPED,
            consoleUrl: ''
        };
        this.proxyButtonClickHandler = this._proxyButtonClickHandler.bind(this);
    }

    startServer() {
        this.setState(merge(this.state, {
            proxyServerState: PROXY_SERVER_STATE.STARTING
        }));


        fetch.post(START_SERVER_URL).then((reps)=> {
            this.setState(merge(this.state, {
                proxyServerState: PROXY_SERVER_STATE.RUNNING,
                consoleUrl : reps.json.data
            }));
        }).catch(e=> {
            Message.error(e.message);
            this.setState(merge(this.state, {
                proxyServerState: PROXY_SERVER_STATE.STOPED
            }));
        });
    }

    stopServer() {
        this.setState(merge(this.state, {
            proxyServerState: PROXY_SERVER_STATE.STOPPING
        }));

        fetch.post(STOP_SERVER_URL).then((json, response)=> {
            this.setState(merge(this.state, {
                proxyServerState: PROXY_SERVER_STATE.STOPED
            }));
        }).catch(e=> {
            Message.error(e.message);
            this.setState(merge(this.state, {
                proxyServerState: PROXY_SERVER_STATE.STOPED
            }));
        });
    }

    proxyButtonIco() {
        switch (this.state.proxyServerState) {
            case PROXY_SERVER_STATE.STOPED :
                return 'caret-circle-o-right';
            case PROXY_SERVER_STATE.RUNNING:
                return 'caret-circle-right';
            default:
                return 'loading';
        }
    }

    proxyButtonText() {
        switch (this.state.proxyServerState) {
            case PROXY_SERVER_STATE.STOPED :
                return '启动代理服务器';
            case PROXY_SERVER_STATE.RUNNING:
                return '关闭代理服务器';
            case PROXY_SERVER_STATE.STARTING:
                return '正在启动代理服务器';
            case PROXY_SERVER_STATE.STOPPING:
                return '正在关闭代理服务器';
            default:
                return '';
        }
    }

    _proxyButtonClickHandler(e) {
        if (this.state.proxyServerState === PROXY_SERVER_STATE.STOPED) {
            this.startServer(e);
        } else if (this.state.proxyServerState === PROXY_SERVER_STATE.RUNNING) {
            this.stopServer(e);
        } else {
            //正在执行中,不能进行操作
        }

    }

    buildMsg(){
        if(this.state.proxyServerState === PROXY_SERVER_STATE.RUNNING){
            return (<div className="console">
                <p>代理服务器正在运行...</p>
                控制台查看: <a href={this.state.consoleUrl} target="_blank">{this.state.consoleUrl}</a>
            </div>);
        }
    }

    render() {
        return (
            <div className="proxy-start">
                <Button className="proxy-start-btn"
                        type="primary"
                        size="small"
                        icon={this.proxyButtonIco()}
                        onClick={this.proxyButtonClickHandler}>{this.proxyButtonText()}</Button>
                {this.buildMsg()}
            </div>
        );
    }
}