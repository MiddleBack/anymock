/**
 * Created by tanxiangyuan on 16/8/23.
 */
import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import NavMenu from '../components/NavMenu';

import 'antd/dist/antd.css';
import './less/main.less';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="page">
                <div className="head">
                    <h1>welcome to anymock!</h1>
                </div>
                <Row className="body">
                    <Col className="layout-nav" span={4}><NavMenu data={menuData} openAll={true}></NavMenu></Col>
                    <Col className="layout-content" span={20}>{this.props.children}</Col>
                </Row>
                <div className="foot">
                    <p>技术支持：<a href="mailto:tanxiangyuan@jd.com">tanxiangyuan@jd.com</a></p>
                    <p>从这里开始：<a href="https://github.com/MiddleBack/anymock" target="_blank">https://github.com/MiddleBack/anymock</a></p>
                </div>
            </div>
        );
    }
}

const menuData = [{
    key: 'sub1',
    name: '代理设置',
    ico: 'setting',
    children: [
        {
            key: 'm1',
            path: '/proxy/setting',
            name: '设置代理服务器'
        }, {
            key: 'm2',
            path: '/proxy/start',
            name: '启动代理'
        }
    ]
}, {
    key: 'sub2',
    name: '项目管理',
    ico: 'appstore-o',
    children: [
        {
            key: 'm3',
            path: '/project/list',
            name: '项目列表'
        }, {
            key: 'm4',
            path: '/interface/list',
            name: '接口列表'
        }
    ]
}];


Main.contextTypes = {
    //此处必须,要是不写,this.context.push为undefined
    router: React.PropTypes.object.isRequired
};