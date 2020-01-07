import React from 'react'
import {Form,Input,Button,Icon,message} from 'antd';
import {connect} from 'react-redux';
import {getlogin,getlogout,getuser} from '../store/action'
import axios from 'axios'

const valiurl='/api/validateuser';
const registurl='/api/doregist';

class Register extends React.Component{
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {   
          let sendobj={'username':values.email,'password':values.password,'nickname':values.nickname};
          axios({
            url:registurl,
            method:'post',
            data:sendobj
          }).then((res)=>{  
            let data=res.data;    
            if(data==='success'){
              message.success("注册成功!");
              setTimeout(()=>{this.props.history.push('/login/accountlogin')},1000);
            }
            if(data==='failed'){
              message.error("注册失败!");
            }
            if(data==='userduplicate'){
              message.error("已存在用户名!");
            }
          })       
        }
      });
    };
    handleConfirmBlur=(e)=>{
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstPassword = (rule,value,callback)=>{
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('两次密码输入不一致');
      }else{
        callback();
      }
    };
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };
    validfunc=(rule,value,callback)=>{   
      const sendobj={username:value};
      axios({
        url:valiurl,
        method:'post',
        data:sendobj
      }).then((res)=>{
        let data=res.data;
        if(data==='duplicate'){
          callback("此用户名已注册")
        }else{
          callback()
        }
      })
    } 
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form  onSubmit={this.handleSubmit}>
          <Form.Item >
            {getFieldDecorator('email', {
              validateTrigger:'onBlur',
              rules: [
                {
                  type: 'email',
                  message: '请输入邮箱格式',
                },
                {
                  required: true,
                  message: '请输入邮箱',
                },
                {
                  validator:this.validfunc
                },
              ],
            })(<Input  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入邮箱"/>)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请输入昵称' },{max:20,message:"最多20字符"},{min:1,message:"最少1字符"}],
            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入昵称" />,)}
          </Form.Item>
          <Form.Item >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入密码" />)}
          </Form.Item>
          <Form.Item >
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} prefix={<Icon type="lock" style={{color:'rgba(0,0,0,.25)'}} />} placeholder="请确认密码" />)}
          </Form.Item>         
          <Form.Item >
            <Button type="primary" htmlType="submit" style={{width:'100%'}}>
              注册
            </Button>
          </Form.Item>
        </Form>
      );
    }
}
    
const RegisterForm = Form.create({ name: 'register' })(Register);

export default connect((state,props)=>(Object.assign({},props,state)),{getlogin,getlogout,getuser} )(RegisterForm)