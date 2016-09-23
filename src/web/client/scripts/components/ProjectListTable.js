/**
 * Created by tanxiangyuan on 16/8/31.
 */
import React from 'react';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Message from 'antd/lib/message';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Switch from 'antd/lib/switch';
import Select from 'antd/lib/select';
import Popconfirm from 'antd/lib/popconfirm';
import QueueAnim from 'rc-queue-anim';

class ProjectListTable extends React.Component {
    constructor(props) {
        super(props);
    }

    editRow(text, record, index) {
        if (checkState()) {
            isEdit = true;
            this.props.onEdit(index);
            if (record.defURL) {
                let preFixIndex = record.defURL.indexOf('://') + 3;
                record.defURL_preFix = record.defURL.substring(0, preFixIndex);
                record.defURL_subFix = record.defURL.substring(preFixIndex);
            }
            this.props.form.setFieldsValue(record);
        }
    }

    cancelRow(text, record, index) {
        this.props.onCancel({index, isCreate, cb: resetState});
    }

    saveRow(text, record, index) {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log(errors);
                return;
            }
            values.defURL = values.defURL_preFix + values.defURL_subFix;
            delete values.defURL_subFix;

            delete values.defURL_preFix;
            this.props.onSave({index, record: values, cb: resetState});

        });

    }

    delRow(text, record, index) {
        if (checkState()) {
            this.props.onRemove(index);
        }
    }

    componentWillMount() {
        // console.log('componentWillMount!');
    }

    componentDidMount() {
        // console.log('componentDidMount!');
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log('componentWillUpdate!');
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('componentDidUpdate!');
    }

    componentWillUnMounting() {
        // console.log('componentWillUnMounting!');
    }

    render() {
        const {getFieldProps} = this.props.form;
        const TABLE_COLUMNS = [{
            title: '项目名称',
            dataIndex: 'prjName',
            key: 'prjName',
            sorter: true,
            width: '20%',
            render: (text, record, index)=> {
                return record.edit ?
                    (<Form.Item>
                        <Input defaultValue={record.prjName}
                               key={'e_prjName_' + record.prjId}
                               {...getFieldProps('prjName', {
                                   rules: [{
                                       required: true,
                                       message: '项目名称必须填写'
                                   }]
                               })}/>
                    </Form.Item>)
                    : <span>{String(text)}</span>
            }
        }, {
            title: '项目接口远程路径',
            dataIndex: 'defURL',
            key: 'defURL',
            width: '30%',
            render: (text, record, index)=> {
                return record.edit ?
                    (<Form.Item>
                        <Input defaultValue={record.defURL}
                               key={'e_defURL_' + record.prjId}
                               style={{minWidth: 200}}
                               addonBefore={
                                   <Select defaultValue="http://"
                                           key={'e_defURL_preFix_'+record.prjId}
                                           style={{width: 80}}
                                           {...getFieldProps('defURL_preFix', {initialValue: 'http://'})}>
                                       <Select.Option value="http://">http://</Select.Option>
                                       <Select.Option value="https://">https://</Select.Option>
                                   </Select>}
                               {...getFieldProps('defURL_subFix', {
                                   rules: [{
                                       required: true,
                                       message: '项目远程路径必须填写'
                                   }]
                               })}/>
                    </Form.Item>)
                    : <span>{text || ''}</span>
            }
        }, {
            title: '项目根路径',
            dataIndex: 'prjPath',
            key: 'prjPath',
            width: '20%',
            render: (text, record, index)=> {
                return record.edit ?
                    (<Form.Item>
                        <Input defaultValue={record.prjPath || ''}
                               key={'e_path_' + record.prjId}
                               {...getFieldProps('prjPath')}/>
                    </Form.Item>)
                    : <span>{text || ''}</span>
            }
        }, {
            title: '已激活',
            dataIndex: 'active',
            key: 'active',
            sorter: true,
            width: '10%',
            render: (text, record, index)=> {
                return record.edit ?
                    (<Form.Item>
                        <Switch
                            defaultChecked={record.active}
                            key={'e_switch_' + record.prjId}
                            {...getFieldProps('active', {valuePropName: 'checked'})}/>
                    </Form.Item>)
                    : (<Switch defaultChecked={record.active}
                               key={'switch_' + record.prjId}
                               onChange={()=>!isCreate && this.props.onToggleProjectActive && this.props.onToggleProjectActive(text, record, index)}/>)
            }
        }, {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width: '20%',
            render: (text, record, index)=> {
                return record.edit ?
                    (<div>
                        <Button type="primary" icon="check" size="small" onClick={(e)=> {
                            this.saveRow(text, record, index)
                        }}>保存</Button>&nbsp;&nbsp;
                        <Button type="default" icon="cross" size="small" onClick={(e)=> {
                            this.cancelRow(text, record, index)
                        }}>取消</Button>
                    </div>)
                    :
                    (<div>
                        <Button type="primary" icon="edit" size="small" onClick={(e)=> {
                            this.editRow(text, record, index)
                        }}>修改</Button>&nbsp;&nbsp;
                        <Popconfirm title={<div>确定要删除这个项目吗？<br/>删除后对应的接口也会一同移除。</div>}
                                    onConfirm={(e)=> this.delRow(text, record, index)}>
                            <Button type="default" icon="delete" size="small">删除</Button>
                        </Popconfirm>
                    </div>)

            }
        }];

        return <Form inline>
            <QueueAnim component={Table}
                       leaveReverse={true}
                       type={['right', 'left']}
                       dataSource={this.props.dataSource}
                       columns={TABLE_COLUMNS}
                       loading={this.props.loading}
                       pagination={false}/>
        </Form>;
    }
}

ProjectListTable.propTypes = {
    dataSource: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
    onToggleProjectActive: React.PropTypes.func
};
ProjectListTable = Form.create()(ProjectListTable);

let isEdit = false,
    isCreate = false;

function checkState() {
    if (isEdit || isCreate) {
        Message.error('table中有正在编辑的行,请先保存或取消当前编辑行');
        return false;
    }
    return true;
}
function resetState() {
    isCreate = isEdit = false;
}
ProjectListTable.prototype.addRow = function (cb) {
    if (checkState()) {
        isCreate = true;
        cb();
    }
};

export default ProjectListTable;