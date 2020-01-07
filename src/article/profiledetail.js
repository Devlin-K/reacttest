import {Upload,Icon,Col,Row,Modal,Menu,Form,Input,Button,message} from 'antd';
import React from 'react';
import {connect} from 'react-redux';
import {getnickname,getheadurl} from '../store/action'
import axios from 'axios';

const modifyurl='/api/updateuser';
const uploadurl='/api/photos/upload';

class ModifynickForm extends React.Component{
  Submitnick=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let sendobj={'nickname':values.nickname,'user':this.props.userinfo.user};
        axios({
          url:modifyurl,
          method:'post',
          data:sendobj
        }).then((res)=>{
          let data=res.data;
          if(data==='success'){
            message.success("操作成功");
            this.props.getnickname(values.nickname);
            this.setState({});
          }else{
            message.error("操作失败");
          }
        }).catch((e)=>{console.log(e)});
      }
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span:6 },
      wrapperCol: { span: 18 },
    };
    return(
      <Form onSubmit={this.Submitnick}  layout='horizontal'>
        <Form.Item label="修改昵称" {...formItemLayout}  >
          {getFieldDecorator('nickname', {
            rules: [
              {
                required: true,
                message: '请输入昵称',
              },
            ],
            initialValue:this.props.userinfo.nickname
          })(<Input />)}
        </Form.Item>
        <Form.Item >
        <Button type="primary" htmlType="submit" style={{float:'right'}}>
          修改
        </Button>
        </Form.Item>
      </Form>
    )
  }
}
const Modifynick=Form.create()(ModifynickForm)

class ModifypassForm extends React.Component{
  state = {
    confirmDirty: false,
  };
  compareToFirstPassword=(rule,value,callback) => {
    const form=this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  };
  validateToNextPassword=(rule,value,callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  handleConfirmBlur=(e)=>{
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  Submitpass=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if (!err) {
        let sendobj={'password':values.password,'user':this.props.userinfo.user};
        axios({
          url:modifyurl,
          method:'post',
          data:sendobj
        }).then((res)=>{
          let data=res.data;
          if(data==='success'){
            message.success("操作成功");
            this.props.form.setFieldsValue({'password':''});
            this.props.form.setFieldsValue({'confirm':''});
            this.setState({});
          }else{
            message.error("操作失败");
          }
        }).catch((e)=>{console.log(e)});
      }
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span:6 },
      wrapperCol: { span: 18 },
    };
    return(
      <Form onSubmit={this.Submitpass}  layout='horizontal'>
        <Form.Item  label='修改密码' {...formItemLayout}>
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
        })(<Input.Password placeholder="请输入密码" />)}
        </Form.Item>
        <Form.Item  label='确认密码' {...formItemLayout}>
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
        })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="请确认密码" />)}
        </Form.Item>        
        <Form.Item >
        <Button type="primary" htmlType="submit" style={{float:'right'}}>
          修改
        </Button>
        </Form.Item>
      </Form>
    )
  }
}
const Modifypass=Form.create()(ModifypassForm)

class Modifyhead extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          url:props.userinfo.headurl,
        }
      ]
    }
  }
  handleCancel=()=> this.setState({ previewVisible: false });
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  Submithead=(e)=>{
    if(this.state.fileList[0]){
      let headurl='/api/'+this.state.fileList[0].response.jpgurl;
      let sendobj={'headurl':headurl,'user':this.props.userinfo.user};
      axios({
        url:modifyurl,
        method:'post',
        data:sendobj
      }).then((res)=>{
        let data=res.data;
        if(data==='success'){
          this.props.getheadurl(headurl);
          message.success('更换成功');
          this.setState({});
        }else{
          message.error('更换失败');
        }
      }).catch((e)=>{console.log(e)});
    }
  }
  handleChange = ({ fileList }) => {console.log(fileList);this.setState({ fileList })};
  render(){
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return(
      <div className='uploaddiv'>
      <Upload
        action={uploadurl}
        listType="picture-card"
        fileList={fileList}
        onPreview={this.handlePreview}
        onChange={this.handleChange}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Button onClick={this.Submithead} style={{width:'104px'}}>确认修改</Button>
      </div>
    )
  }
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Profiledetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      current:'nickname'
    };
    if(props.islogin){
    }
    else{
      message.warn("请登录后使用");
      props.history.push('/article');
    }
  }
  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };
  render() {
   const userinfo={
     'nickname':this.props.nickname,
     'user':this.props.user,
     'headurl':this.props.headurl
    }
    return (
      <Row>
        <Col xs={{span:0}} xl={{span:4}} style={{height:100}}></Col>
        <Col xs={{span:4}} xl={{span:4}}>
          <Menu
            onClick={this.handleClick}
            style={{ width: 256 }}
            defaultSelectedKeys={['nickname']}
            mode="inline"
          >
            <Menu.Item key="nickname">
              <Icon type="user" />修改昵称
            </Menu.Item>
            <Menu.Item key="lock">
              <Icon type="lock" />修改密码
            </Menu.Item>
            <Menu.Item key="head">
              <Icon type="contacts" />修改头像
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={{span:20}} xl={{span:8}}>
          {this.state.current==='nickname'?
          <Modifynick userinfo={userinfo} getnickname={this.props.getnickname}/>:
          (this.state.current==='lock')?<Modifypass  userinfo={userinfo} />:
          <Modifyhead  userinfo={userinfo} getheadurl={this.props.getheadurl}/>}
        </Col>
        <Col xs={{span:0}} xl={{span:8}}></Col>
      </Row>
    );
  }
}
export default connect((props,state)=>(Object.assign({},props,state)),{getnickname,getheadurl})(Profiledetail) 




















// <Form onSubmit={this.handleSubmit} className="login-form">
// <Form.Item>
//   {getFieldDecorator('username', {
//     rules: [
//       {
//         type: 'email',
//         message: '请输入邮箱格式',
//       },
//       {
//         required: true,
//         message: '请输入邮箱',
//       },
//     ],
//   })(
//     <Input
//       prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
//       placeholder="请输入邮箱"
//     />,
//   )}
// </Form.Item>

// <Form.Item>
//   {getFieldDecorator('password', {
//     rules: [{ required: true, message: '请输入密码' }],
//   })(
//     <Input
//       prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
//       type="password"
//       placeholder="请输入密码"
//     />,
//   )}
// </Form.Item>
// <Form.Item>
// <div>
//   {getFieldDecorator('remember', {
//     valuePropName: 'checked',
//     initialValue: true,
//   })(<Checkbox>记住我</Checkbox>)}
//   <a className="login-form-forgot" href="#">
//     忘记密码
//   </a>
//   </div>
//   <Button type="primary" htmlType="submit" className="login-form-button">
//     登录
//   </Button>

// </Form.Item>






// <div className="clearfix">
//   <Upload
//     action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
//     listType="picture-card"
//     fileList={fileList}
//     onPreview={this.handlePreview}
//     onChange={this.handleChange}
//   >
//     {fileList.length >= 1 ? null : uploadButton}
//   </Upload>
//   <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
//   <img alt="example" style={{ width: '100%' }} src={previewImage} />
//   </Modal>
// </div>



// </Form>