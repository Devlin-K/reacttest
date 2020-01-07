import React from'react';
import {Form,Icon,Input,Button,Checkbox,message} from 'antd';
import {connect} from 'react-redux';
import {getlogin,getuser} from '../store/action'
import axios from 'axios';

const dburllogin="/api/dologin";

class Loginpage extends React.Component{
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values)=>{
        if (!err) {
          axios({
            url:dburllogin,
              method:'post',          
              data:values
          }).then((res)=>{
            let data=res.data;
            if(data==='success'){
              sessionStorage.setItem('user',values.username)
              this.props.getuser(values.username);
              this.props.getlogin();
              message.success('Successful Login In!');
            }else{
              message.error('Error Password,Please Check Again!')
            }
          })
        }
      });
    };
    forgetpassword=(e)=>{
      e.preventDefault();
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  {
                    type: 'email',
                    message: 'Please Check ',
                  },
                  {
                    required: true,
                    message: '请输入邮箱',
                  },
                ],
              })(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入邮箱"/>)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />)}
            </Form.Item>
            <Form.Item>
              <div>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox>记住我</Checkbox>)}
                <a className="login-form-forgot" href="/" onClick={this.forgetpassword}>
                  忘记密码
                </a>
              </div>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        );
    }
}
const Loginpages = Form.create()(Loginpage);
 
export default connect((state,props)=>(Object.assign({},props,state)),{getlogin,getuser} )(Loginpages)