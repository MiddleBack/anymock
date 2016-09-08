/**
 * Created by tanxiangyuan on 16/8/29.
 */
"use strict";
import React from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import Col from 'antd/lib/col';
import Message from 'antd/lib/message';
import Fetch from '../../../commons/fetch';
import merge from 'lodash/merge';
import ProjectListTable from '../components/ProjectListTable';

import './less/ProjectList.less';

class ProjectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            table: {
                data: []
            }
        };
        this.tableLoadding = false;

        this.loadFromServer = this._loadFromServer.bind(this);
        this.toAddProject = this._toAddProject.bind(this);
        this.editTableRow = this._editTableRow.bind(this);
        this.saveTableRow = this._saveTableRow.bind(this);
        this.cancelTableRow = this._cancelTableRow.bind(this);
        this.removeTableRow = this._removeTableRow.bind(this);
        this.toggleProjectActiveState = this._toggleProjectActiveState.bind(this);
    }

    //============ life cycles start====================//
    componentWillMount() {
        console.log('componentWillMount!');
    }

    componentDidMount() {
        console.log('componentDidMount called.');
        this.tableLoadding = true;

        Fetch.get('/api/project/list').then((res)=> {
            this.tableLoadding = false;
            this.state.table.data = dealProjectsMap(res.json.data);
            this.setState(this.state);
        }).catch((err)=> {
            console.error(err);
            Message.error(err.message);
        });
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('componentWillUpdate!');
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate!');
    }

    componentWillUnMounting() {
        console.log('componentWillUnMounting!');
    }

    //============ life cycles end ====================//

    _loadFromServer(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log(errors);
                return;
            }
            const hide = Message.loading('正在执行中...', 0);

            //start to call api
            Fetch.post('/api/project/remote/list', {
                body: {
                    url: values.projectsUrl_prefix + values.projectsUrl
                }
            }).then((resp)=> {
                this.state.table.data = dealProjectsMap(resp.json.data);
                this.setState(this.state);
                hide();
            }).catch((err)=> {
                hide();
                console.error(err);
                Message.error(err.message);
            });
        });
    }

    _toAddProject() {
        this.refs.projectListTable.addRow(()=> {
            this.state.table.data.unshift({
                active: false,
                edit: true
            });
            this.setState(this.state);
        });

    }

    _editTableRow(index) {
        console.log('to edit row : ', index);
        this.state.table.data[index].edit = true;
        this.setState(this.state);
    }

    _saveTableRow({
        index, record, cb = ()=> {
    }
    }) {
        console.log('table form 收到表单值：', record);

        let data = merge(this.state.table.data[index], record);
        delete data.edit;
        Fetch.post('/api/project', {
            body: data
        }).then((resp)=> {
            this.state.table.data[index] = data;
            this.setState(this.state);
            cb();
        }).catch((err)=> {
            console.error(err);
            Message.error(err.message);
        });

    }

    _cancelTableRow({
        index, isCreate, cb = ()=> {
    }
    }) {
        if (isCreate) {
            this.state.table.data.splice(index, 1);
        } else {
            delete this.state.table.data[index].edit;
        }
        this.setState(this.state);
        cb();
    }

    _removeTableRow(index) {
        Fetch.del('/api/project/' + this.state.table.data[index].prjId).then((resp)=> {
            this.state.table.data.splice(index, 1);
            this.setState(this.state);
        }).catch((err)=> {
            console.error(err);
            Message.error(err.message);
        });

    }


    _toggleProjectActiveState(text, record, index) {
        record.active = !record.active;
        Fetch.post('/api/project', {
            body: {
                prjId: record.prjId,
                active: record.active
            }
        }).then((resp)=> {
            this.state.table.data[index] = record;
            this.setState(this.state);
        }).catch((err)=> {
            console.error(err);
            Message.error(err.message);
            this.setState(this.state);
        });
    }

    render() {
        const {getFieldProps} = this.props.form;
        const URL_SELECT_BEFORE = (
            <Select defaultValue="http://"
                    style={{width: 80}} {...getFieldProps('projectsUrl_prefix', {initialValue: 'http://'})}>
                <Select.Option value="http://">http://</Select.Option>
                <Select.Option value="https://">https://</Select.Option>
            </Select>
        );

        return (
            <div>
                <div className="table-toolbar">
                    <Form inline className="load-from-server" onSubmit={this.loadFromServer}>
                        <Form.Item className="form-item">
                            <Input.Group>
                                <Col span="14">
                                    <Form.Item hasFeedback={false}>
                                        <Input placeholder="项目管理平台地址"
                                               defaultValue="localhost:8011/data/projectList.json"
                                               style={{width: 200}}
                                               id="ipt_project_url"
                                               addonBefore={URL_SELECT_BEFORE}
                                               {...getFieldProps('projectsUrl', {
                                                   rules: [{
                                                       required: true,
                                                       message: '请填写项目管理平台项目列表地址'
                                                   }]
                                               })}/>
                                    </Form.Item>
                                </Col>
                                <Col span="9">
                                    <Form.Item>
                                        <Button type="ghost"
                                                htmlType="submit"
                                                size="default"
                                                icon="cloud-download-o">从服务器获取项目列表</Button>
                                    </Form.Item>
                                </Col>
                            </Input.Group>
                        </Form.Item>

                    </Form>
                    <Button type="primary"
                            icon="plus"
                            className="btn-add"
                            size="default"
                            onClick={this.toAddProject}>手动添加项目</Button>
                </div>
                <ProjectListTable dataSource={this.state.table.data}
                                  ref="projectListTable"
                                  loading={this.tableLoadding}
                                  onSave={this.saveTableRow}
                                  onCancel={this.cancelTableRow}
                                  onEdit={this.editTableRow}
                                  onRemove={this.removeTableRow}
                                  onToggleProjectActive={this.toggleProjectActiveState}/>
            </div>
        );


        //render
    }
}

function dealProjectsMap(map) {
    var result = [];
    if (map) {
        Object.keys(map).forEach((key)=> {
            map[key].prjId = key;
            result.push(map[key]);
        })
    }
    return result;
}

export default Form.create({
    onFieldsChange: function (props, fields) {
        console.log('onFieldsChange')
    },
    mapPropsToFields: function (props) {
        console.log('mapPropsToFields')
    }
})(ProjectList);