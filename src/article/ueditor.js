import React from 'react';
import {connect} from 'react-redux';
import {getarticlelist} from '../store/action';
import {message,Col,Row,Form,Input,Button} from 'antd';
import ReactDOM from 'react-dom';
import E from 'wangeditor';
import moment from 'moment';
import axios from 'axios';

const uploadurl='api/photos/upload';
const aticleurl='api/addarticle';

class Uedit extends React.Component{
  constructor(props){
    super(props);
    let islogin=props.islogin;
    if(!islogin){
      message.warn("请登录后使用");
      this.props.history.push('/article');
    }
    this.state = {
      editorHtml: '',
      editorText: '',
    }
	}
  componentDidMount(){
    const editor = new E(ReactDOM.findDOMNode(this._div))
    this.editor = editor;
    editor.customConfig.zIndex = 100
    // editor.customConfig.uploadImgServer = utils.url + '/fileclient-management/api/uploadpic'
    // 限制一次最多上传 1 张图片
    editor.customConfig.uploadImgMaxLength = 1
    editor.customConfig.onchange = (html) => {
      this.setState({
        editorHtml: html,
        editorText: editor.txt.text()
      })
      this.props.form.setFieldsValue({
        'detail': html
      });
    }
    editor.customConfig.customUploadImg=function(files, insert){
      if (files[0]) {
        const formData = new window.FormData()
        formData.append('file', files[0], 'cover.jpg')
        axios( {
          url:uploadurl,
          method: 'POST',
          data: formData
        }).then((data) => {   
          let res=data.data;      
          if (res) {
            console.log(res.jpgurl);
            insert('api/'+res.jpgurl);
          }
        })
      }else {
        message.info('请选择上传的图片')
      }
    }
    editor.customConfig.menus=[
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      // 'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      // 'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.customConfig.lang={
      '设置标题': 'Title',
      '字号': 'Size',
      '文字颜色': 'Color',
      '设置列表': 'List',
      '有序列表': '',
      '无序列表': '',
      '对齐方式': 'Align',
      '靠左': '',
      '居中': '',
      '靠右': '',
      '正文': 'p',
      '链接文字': 'link text',
      '链接': 'link',
      '上传图片': 'Upload',
      '网络图片': 'Web',
      '图片link': 'image url',
      '插入视频': 'Video',
      '格式如': 'format',
      '上传': 'Upload',
      '创建': 'init'
    }
    editor.create()
  } 
  handleSubmit=e=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if (!err) {console.log(values);
        let sendobj={
            "title":values.title,"author":this.props.nickname,"headurl":this.props.headurl,"account":this.props.user,
            "content":values.detail,"like":[],"comment":[],'constructdate':moment().format('YYYY-MM-DD hh:mm:ss.SSS'),
            'dateid':Date.now().toString()
        }
        axios({
          url:aticleurl,
            method:'post',
            data:sendobj
        }).then((data)=>{
          let res=data.data;
          if(res==='success'){
            message.success("发表文章成功!");
            this.props.getarticlelist([
              sendobj,...this.props.articlelist
            ]);
            this.props.history.push('/article');
          }else{
            message.error("发表失败！");
          }
        })    
      }
    })
  }
  validateEditorFrom=(rule,value,callback)=>{
    if(this.state.editorText.trim()===''){
        callback('内容不能为空');
      }
      callback();
    }
	render(){
    const { getFieldDecorator } = this.props.form;
		return (
      <Row>
        <Col xs={{span:0}} xl={{span:4}} style={{height:100}}></Col>
        <Col xs={{span:24}} xl={{span:16}}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请输入标题',
                },
              ],
            })(<Input placeholder="请输入标题"/>)}
          </Form.Item>
          <Form.Item>
          {getFieldDecorator('detail', {
              rules: [
                {validator: this.validateEditorFrom}
              ], initialValue: ''
            })(<div ref={(ref) => this._div = ref}></div>)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
          提交
          </Button>
        </Form>
        </Col>
        <Col xs={{span:0}} xl={{span:4}}></Col>
      </Row>
    )
  }
}
const  Ueditor= Form.create()(Uedit);
export default connect((props,state)=>(Object.assign({},props,state)),{getarticlelist})(Ueditor)