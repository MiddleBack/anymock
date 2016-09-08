/**
 * Created by tanxiangyuan on 16/8/26.
 */
import React from 'react';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Switch from 'antd/lib/switch';
import InputNumber from 'antd/lib/input-number';
import Input from 'antd/lib/input';
import Message from 'antd/lib/message';
import fetch from '../../../commons/fetch';

class ProxySetting extends React.Component {
    constructor(props) {
        super(props);

        //处理事件处理函数的this指向问题
        this.handleSubmit = this._handleSubmit.bind(this);
    }

    /**
     * 表单提交处理
     * @param e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        //设置页面默认值
        fetch.post(API_GET_PROXY_DEF_URL,{
            body: this.props.form.getFieldsValue()
        }).then((resp)=> {
            Message.success('代理设置保存成功!重启代理服务器可以应用当前设置。');
        }).catch((err)=> {
            console.error(err);
            Message.error(err.message);
        });
    }

    componentDidMount() {
        //设置页面默认值
        fetch.get(API_GET_PROXY_DEF_URL).then((resp)=> {
            this.props.form.setFieldsValue(resp.json.data);
        }).catch((err)=> {
            console.error(err);
            Message.error(err.message);
        });
    }

    render() {
        const {getFieldProps} = this.props.form;
        return (
            <Form horizontal onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayout} label="启动系统级代理">
                    <Switch checkedChildren="Y"
                            unCheckedChildren="N" {...getFieldProps('globalProxy', {valuePropName: 'checked'})}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="拦截https请求">
                    <Switch checkedChildren="Y"
                            unCheckedChildren="N" {...getFieldProps('enableHttps', {valuePropName: 'checked'})}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="清除http缓存">
                    <Switch checkedChildren="Y"
                            unCheckedChildren="N" {...getFieldProps('clearCache', {valuePropName: 'checked'})}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="支持跨域">
                    <Switch checkedChildren="Y"
                            unCheckedChildren="N" {...getFieldProps('crossDomain', {valuePropName: 'checked'})}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="添加控制台">
                    <Switch checkedChildren="Y"
                            unCheckedChildren="N" {...getFieldProps('addConsole', {valuePropName: 'checked'})}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="追加自定义脚本">
                    <Input type="textarea" rows={4} {...getFieldProps('appendHtml')}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="http代理端口">
                    <InputNumber min={1000} {...getFieldProps('proxyPort')}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="http代理控制台端口">
                    <InputNumber min={1000} {...getFieldProps('proxyConsolePort')}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="http代理websocket端口">
                    <InputNumber min={1000} {...getFieldProps('proxySocketPort')}/>
                </Form.Item>
                <Form.Item wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
                    <Button type="primary" htmlType="submit" icon="save">保存设置</Button>
                </Form.Item>
            </Form>
        );
    }
}
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
};
const API_GET_PROXY_DEF_URL = '/api/proxy-def';

export default Form.create()(ProxySetting);