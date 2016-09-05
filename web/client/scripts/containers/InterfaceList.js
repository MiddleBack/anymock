/**
 * Created by tanxiangyuan on 16/9/1.
 */
"use strict";
import React from 'react';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Message from 'antd/lib/message';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Radio from 'antd/lib/radio';
import Select from 'antd/lib/select';
import Fetch from '../utils/fetch';
import CloneDeep from 'lodash/cloneDeep';
import './less/IntrefaceList.less';

import {INTERFACE_DEAL_TYPE} from '../../../../models/Constants';

let buildDataStore = (interfaces)=> {
    let projects = {};
    interfaces.forEach((_interface)=> {
        //从接口定义中以项目ID维度筛选项目
        projects[_interface.prjId] = _interface.prjName;
        //计算接口数据处理类型 优先级为:rewriteURL?rewriteData?version
        _interface.dealType = _interface.rewriteURL && _interface.rewriteURL.active ? INTERFACE_DEAL_TYPE.DEAL_TYPE_URL
            : _interface.rewriteData && _interface.rewriteData.active ? INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE
            : INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION;
        //当处理类型为version时,设置当前默认版本
        if(_interface.dealType === INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION){
            Object.keys(_interface.versions).forEach((version)=>{
                _interface.versions[version].active && (_interface.currentVersion=version);
            });
        }
        //id --> key
        _interface.key = _interface.id;

        //清理源数据
        Object.keys(_interface.versions).forEach((version)=>{
            delete  _interface.versions[version].active;
        });

        delete _interface.id;
        _interface.rewriteURL && delete _interface.rewriteURL.active;
        _interface.rewriteData && delete _interface.rewriteData.active;

    });

    return {
        projects: Object.keys(projects).map((prjId)=> {
            return {
                id: prjId,
                name: projects[prjId]
            }
        }),
        interfaces
    };
};
let buildVersionInfo = (record)=>{
    let versions = record.versions && Object.keys(record.versions);
    let currentVersion = record.currentVersion || (versions.length > 0 && versions[0]);
    return {
        versions,
        currentVersion
    }
};
let dealRowForApply = (row)=>{
    let newRow = CloneDeep(row);
    if(newRow.dealType === INTERFACE_DEAL_TYPE.DEAL_TYPE_URL){
        newRow.rewriteURL.active = true;
    }else if(newRow.dealType === INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE){
        newRow.rewriteData.active = true;
    }else{
        let {currentVersion} = buildVersionInfo(newRow);
        Object.keys(newRow.versions).forEach((versionCode)=>{
            newRow.versions[versionCode].active = versionCode === currentVersion;
        })
    }
    newRow.id = newRow.key;

    delete newRow.key;
    delete newRow.currentVersion;
    delete newRow.dealType;

    return newRow;
};

export default class InterfaceList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            interfaces: []
        };
        this.selectPrjId = null;
        this.pageInfo = {
            selectPrjId : null,
            syncLoading : false,
            tableLoading : false
        }
    }

    componentDidMount() {
        Fetch.get('/api/project/interface/list').then((resp)=> {
            this.dataStore = buildDataStore(resp.json.data);
            this.setState(this.filterInterface());
        }).catch((err)=> {
            Message.error(err);
        });
    }

    filterInterface(prjId) {
        if (!prjId) {
            return this.dataStore;
        }
        var result = {
            projects: this.dataStore.projects,
            interfaces: []
        };
        this.dataStore.interfaces.forEach((_interface)=> {
            _interface.prjId === prjId && result.interfaces.push(_interface);
        });
        return result;
    }

    /**
     * 应用接口设置
     * @param rowIndex
     */
    applySetting(rowIndex) {
        this.pageInfo.tableLoading = true;
        this.setState(this.state);

        var postRow = this.state.interfaces[rowIndex];
        Fetch.post(`/api/project/${postRow.prjId}/interface`, {body: dealRowForApply(postRow)}).then((resp)=> {
            Message.success('接口设置应用成功,重启代理服务器可使用配置。');
            this.pageInfo.tableLoading = false;
            this.setState(this.state);
        }).catch((err)=> {
            Message.error(`接口设置应用失败!${err}`);
            this.pageInfo.tableLoading = false;
            this.setState(this.state);
        });
    }

    /**
     * 同步接口设置信息
     * @param rowIndex
     */
    sync() {
        this.pageInfo.tableLoading = this.pageInfo.syncLoading = true;
        this.setState(this.state);

        Fetch.post(`/api/project/${this.pageInfo.selectPrjId}/interface/remote`).then((resp)=>{
            this.pageInfo.tableLoading = this.pageInfo.syncLoading = false;
            this.dataStore = buildDataStore(resp.json.data);
            this.setState(this.filterInterface());
        }).catch((err)=>{
            Message.error(`同步接口设置信息失败!${err}`);
            this.pageInfo.tableLoading = this.pageInfo.syncLoading = false;
            this.setState(this.state);
        });
    }

    projectChanged(prjId) {
        this.pageInfo.selectPrjId = prjId;
        this.setState(this.filterInterface(prjId));
    }

    dealTypeChanged(value, rowIndex, record) {
        let source = this.refs.interfaceTable.props.dataSource;
        source[rowIndex].dealType = value;
        this.state.interfaces = source;
        this.setState(this.state);
    }

    versionChanged(value, rowIndex) {
        let source = this.refs.interfaceTable.props.dataSource;
        source[rowIndex].currentVersion = value;
        this.state.interfaces = source;
        this.setState(this.state);
    }

    render() {
        const TABLE_COLUMNS = [{
            title: '所属项目',
            dataIndex: 'prjName',
            key: 'prjName',
            sorter: true,
            width: '15%'
        }, {
            title: '接口路径',
            dataIndex: 'interfacePath',
            key: 'interfacePath',
            sorter: true,
            width: '15%'
        }, {
            title: '接口描述',
            dataIndex: 'desc',
            key: 'desc',
            width: '15%',
            render: (text, record, index)=> {
                return <span>{String(text)}</span>
            }
        }, {
            title: '处理方式',
            key: 'c0',
            width: '15%',
            render: (text, record, index)=> {
                let {versions,currentVersion} = buildVersionInfo(record);
                return (
                    <Radio.Group onChange={(e)=> this.dealTypeChanged(e.target.value, index, record)}
                                 value={record.dealType}>
                        {
                            versions.length > 0 && (
                                <Radio className="radio-style" value={INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION}>服务端版本&nbsp;
                                    <Select defaultValue={currentVersion}
                                            onChange={(value)=>this.versionChanged(value, index)}
                                            disabled={record.dealType != INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION}>
                                        {versions.map((option, index1)=><Select.Option
                                            key={'option_' + index + '_' + index1}
                                            value={option}>{option}</Select.Option>)}
                                    </Select>
                                    <div className="version-desc">
                                        <Icon type="question-circle-o"/>&nbsp;
                                        {record.versions[currentVersion].desc}
                                    </div>
                                </Radio>
                            )
                        }

                        <Radio className="radio-style" value={INTERFACE_DEAL_TYPE.DEAL_TYPE_URL}>rewriteURL</Radio>
                        <Radio className="radio-style" value={INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE}>rewriteData</Radio>
                    </Radio.Group>
                )
            }
        }, {
            title: '处理详情',
            key: 'c1',
            width: '30%',
            render: (text, record, index)=> {
                switch (record.dealType) {
                    case INTERFACE_DEAL_TYPE.DEAL_TYPE_VERSION :
                        let {versions,currentVersion} = buildVersionInfo(record);
                        let _version = record.versions[currentVersion];
                        return (
                            <div>
                                输入参数规则:
                                <Input type="textarea"
                                       key={'inputs_' + index + '_' + currentVersion}
                                       rows={4}
                                       className="input"
                                       onChange={(e)=>record.versions[currentVersion].inputs = e.target.value}
                                       defaultValue={_version.inputs}/>
                                输出参数规则:
                                <Input type="textarea"
                                       key={'outputs_' + index + '_' + currentVersion}
                                       rows={4}
                                       className="input"
                                       onChange={(e)=>record.versions[currentVersion].outputs = e.target.value}
                                       defaultValue={_version.outputs}/>
                            </div>
                        );
                    case INTERFACE_DEAL_TYPE.DEAL_TYPE_URL :
                        return (
                            <div>
                                转发地址:
                                <Input className="input"
                                       key={'rewriteURl_' + index}
                                       onChange={(e)=>record.rewriteURL.url = e.target.value}
                                       defaultValue={record.rewriteURL.url}/>
                            </div>
                        );
                    case INTERFACE_DEAL_TYPE.DEAL_TYPE_DATE :
                        return (
                            <div>
                                响应数据:
                                <Input type="textarea"
                                       key={'rewriteData_' + index}
                                       rows={4}
                                       onChange={(e)=>record.rewriteData.data = e.target.value}
                                       className="input"
                                       defaultValue={record.rewriteData.data}/>
                            </div>
                        );
                    default:
                        return null;
                }
            }
        }, {
            title: '操作',
            key: 'c2',
            width: '10%',
            render: (text, record, index)=> {
                return (
                    <div>
                        <Button type="primary"
                                icon="check"
                                size="small"
                                onClick={(e)=> this.applySetting(index)}>应用</Button>
                    </div>
                )
            }
        }];

        return <div>
            <div className="table-toolbar">
                <label>项目: </label>
                <Select defaultValue="" ref="projectSelect" style={{minWidth: 150}}
                        onChange={(val)=>this.projectChanged(val)}>
                    <Select.Option value="">全部</Select.Option>
                    {this.state.projects.map((p)=><Select.Option value={p.id}
                                                                 key={'opt_' + p.id}>{p.name}</Select.Option>)}
                </Select>
                {
                    !!this.pageInfo.selectPrjId && (<Button type="ghost"
                                                   icon={this.pageInfo.syncLoading?'loading':'cloud-download-o'}
                                                   onClick={(e)=> this.sync()}>{this.pageInfo.syncLoading?'正在同步':'从服务端同步当前项目的接口信息'}</Button>)
                }
            </div>

            <Table columns={TABLE_COLUMNS}
                   ref="interfaceTable"
                   loading={this.pageInfo.tableLoading}
                   dataSource={this.state.interfaces}
                   pagination={false}
                   className="interface-table-row"/>

        </div>;
    }

}