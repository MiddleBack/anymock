/**
 * Created by tanxiangyuan on 16/9/1.
 */
import React from 'react';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Message from 'antd/lib/message';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Radio from 'antd/lib/radio';
import Select from 'antd/lib/select';

import './less/IntrefaceList.less';

export default class InterfaceList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            interfaces: [{
                key: '12',
                prjName: '旺财H5',
                interfacePath: '/wc/productList',
                interfaceDesc: '获取产品列表',
                versions: {
                    "1.0": {
                        inputs: 'xxxx',
                        outputs: 'yyyyy',
                        desc: '我是第一个版本我是第一个版本我是第一个版本我是第一个版本我是第一个版本我是第一个版本我是第一个版本'
                    }
                },
                dealType: DEAL_TYPE_URL,
                currentVersion: '1.0',
                rewriteURL: {
                    url: 'http://jd.com'
                },
                rewriteData: {
                    data: '{"a":1}'
                }
            }]
        }
    }
    componentDidMount(){

    }
    /**
     * 应用接口设置
     * @param index
     */
    applySetting(rowIndex) {
        console.log(this);
    }

    dealTypeChanged(value, rowIndex, record) {
        let source = this.refs.interfaceTable.props.dataSource;
        source[rowIndex].dealType = value;
        this.state.interfaces = source;
        this.setState(this.state);
    }

    versionChanged(value, rowIndex) {

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
            dataIndex: 'interfaceDesc',
            key: 'interfaceDesc',
            width: '15%',
            render: (text, record, index)=> {
                return <span>{String(text)}</span>
            }
        }, {
            title: '处理方式',
            key: 'c0',
            width: '15%',
            render: (text, record, index)=> {
                let versions = record.versions && Object.keys(record.versions);
                let currentVersion = record.currentVersion || (versions.length > 0 && versions[0]);
                return (
                    <Radio.Group onChange={(e)=> this.dealTypeChanged(e.target.value, index,record)}
                                 value={record.dealType}>
                        {
                            versions.length > 0 && (
                                <Radio className="radio-style" value={DEAL_TYPE_VERSION}>服务端版本&nbsp;
                                    <Select defaultValue={currentVersion}
                                            onChange={(e)=>this.versionChanged(e.target.value, index)}
                                            disabled={record.dealType != DEAL_TYPE_VERSION}>
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

                        <Radio className="radio-style" value={DEAL_TYPE_URL}>rewriteURL</Radio>
                        <Radio className="radio-style" value={DEAL_TYPE_DATE}>rewriteData</Radio>
                    </Radio.Group>
                )
            }
        }, {
            title: '处理详情',
            key: 'c1',
            width: '30%',
            render: (text, record, index)=> {
                switch (record.dealType) {
                    case DEAL_TYPE_VERSION :
                        let _version = record.versions[record.currentVersion];
                        return (
                            <div>
                                输入参数规则:
                                <Input type="textarea"
                                       rows={4}
                                       className="input"
                                       onChange={(e)=>record.versions[record.currentVersion].inputs = e.target.value}
                                       defaultValue={_version.inputs}/>
                                输出参数规则:
                                <Input type="textarea"
                                       rows={4}
                                       className="input"
                                       onChange={(e)=>record.versions[record.currentVersion].outputs = e.target.value}
                                       defaultValue={_version.outputs}/>
                            </div>
                        );
                    case DEAL_TYPE_URL :
                        return (
                            <div>
                                转发地址:
                                <Input className="input"
                                       onChange={(e)=>record.rewriteURL.url = e.target.value}
                                       defaultValue={record.rewriteURL.url}/>
                            </div>
                        );
                    case DEAL_TYPE_DATE :
                        return (
                            <div>
                                响应数据:
                                <Input type="textarea"
                                       rows={4}
                                       onChange={(e)=>record.rewriteURL.data = e.target.value}
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
                return <Button type="primary" icon="check" size="small" onClick={(e)=> {
                    this.applySetting(index)
                }}>应用</Button>
            }
        }];

        return <div>
            <div className="table-toolbar">
                <label>项目: </label>
                <Select defaultValue="" ref="projectSelect">
                    <Select.Option value="">全部</Select.Option>
                </Select>
            </div>

            <Table columns={TABLE_COLUMNS}
                   ref="interfaceTable"
                   dataSource={this.state.interfaces}
                   pagination={false}
                   className="interface-table-row"/>

        </div>;
    }

}

const DEAL_TYPE_VERSION = 0;
const DEAL_TYPE_URL = 1;
const DEAL_TYPE_DATE = 2;
