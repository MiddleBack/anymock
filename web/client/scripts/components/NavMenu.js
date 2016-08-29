/**
 * Created by tanxiangyuan on 16/8/29.
 */
'use strict';
import React from 'react';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';

export default class NavMenu extends React.Component {
    constructor(props) {
        super(props);
        this.menuSelected = this._menuSelected.bind(this);
    }

    _menuSelected({item, key, selectedKeys}) {
        this.context.router.push(item.props.path);
    }

    findMenuKeys() {
        let selectedKeys = [];
        let openKeys = [];
        let isActive = this.context.router.isActive;
        this.props.data && this.props.data.forEach((group) => {
            this.props.openAll && openKeys.push(group.key);
            group.children && group.children.forEach((item) => {
                item.path && isActive(item.path) && (selectedKeys.push(item.key));
            });
        });
        return {selectedKeys,openKeys};
    }

    buildItem(item) {
        return (<Menu.Item key={item.key} path={item.path}>{item.name}</Menu.Item>)
    }

    render() {
        let menuKeys = this.findMenuKeys();

        return <Menu mode="inline" defaultOpenKeys={menuKeys.openKeys}
                     defaultSelectedKeys={menuKeys.selectedKeys}
                     onSelect={this.menuSelected}
                     style={{lineHeight: '64px'}}>
            {
                this.props.data && this.props.data.map((group)=> {
                    return (
                        <Menu.SubMenu key={group.key} title={<span><Icon type={group.ico}/>{group.name}</span>}>
                            {group.children.map(this.buildItem)}
                        </Menu.SubMenu>)
                })
            }
        </Menu>
    }
}
NavMenu.propTypes = {
    data: React.PropTypes.array.isRequired,
    openAll: React.PropTypes.bool.isRequired
};
NavMenu.contextTypes = {
    router: React.PropTypes.object.isRequired
};