import React from 'react';
import {Comment,List,Form,Button,Input,Col,Row,message} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {getmessagelist,getdetailcomments} from '../store/action';
import axios from 'axios';

const achieveurl='api/getmessage';
const messageurl='api/addmessage';
const delmessageurl='api/delmessage';

const TextArea = Input.TextArea;
const CommentList = ({ comments,user,self,path,articleid }) => (
  <List
    pagination={{
    pageSize: 5,
    }}
    dataSource={comments}
    header={`${comments.length}条留言`}
    itemLayout="horizontal"
    renderItem={(item)=>(
      <List.Item actions={[
        <a href='/' onClick={e=>{
          e.preventDefault()
          if(path!=='/articledetail/:id'){
            let sendobj={'datetime':item.constructdate};
            let index;
            for(let i =0;i<comments.length;i++){
              if(comments[i]['datetime']===item.constructdate){
                index=i;
              }
            }
            axios({
              url:delmessageurl,
              method:'post',
              data:sendobj
            }).then((res)=>{
              let data=res.data;
              if(data==='success'){
                message.success("删除成功");
                comments.splice(index,1);            
                self();
              }else{
                message.error("删除失败");
              }
            })
          }
          else{
            let sendobj={'datetime':item.constructdate,'dateid':articleid};
            let index;
            console.log(comments,'09090')
            for(let i =0;i<comments.length;i++){
              if(comments[i]['constructdate']===item.constructdate){
                index=i;
              }
            }  
            axios({
              url:delmessageurl,
              method:'post',
              data:sendobj
            }).then((res)=>{
              let data=res.data;
              if(data==='success'){
                message.success("删除成功");
                comments.splice(index,1);            
                self();
              }else{
                message.error("删除失败");
              }
            })
          }
        }}>{(item.user===user)?'删除':''}</a>]} 
      >  
      <Comment content={<p>{item.content}</p>} avatar={item.headurl} author={item.nickname} datetime={item.constructdate}/></List.Item> 
    )}
  />
);
const Editor = ({onChange,onSubmit,submitting,value})=>(
<div>
  <Form.Item>
    <TextArea rows={4} onChange={onChange} value={value} />
  </Form.Item>
  <Form.Item>
    <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        添加留言
    </Button>
  </Form.Item>
</div>
);
const  Nocomment=()=>(
  <p className="nocomment">No More Messages...</p>
)
const Commentstate=()=>(
<p style={{textAlign:'center',fontSize:'18px',marginTop:'50px'}}>You Can Leave Message After Login In.</p>
)

class Message extends React.Component{
    constructor(props){
      super(props);
      console.log(props);
      if(props.path==="/articledetail/:id"){
        console.log('xxx');
 
      }else{
        if(props.messagelist.length===0){
          console.log('yy')
          axios({
            url:achieveurl,
            method:'post',
            data:{}
          }).then((res)=>{
            let data=res.data.reverse();
            props.getmessagelist(data);
            this.setState({value:''});
          },(err)=>{console.log(err)})
        }
      }
    }  
    state={
      submitting: false,
      value: '',
      comments:[]
    }
    handleSubmit = () => {
      if (!this.state.value) {
        return;
      }
      this.setState({
        submitting: true,
      });
      setTimeout(() => {
        let nickname=this.props.nickname;
        let user=this.props.user;
        let headurl=this.props.headurl;
        let comment=this.state.value;
        let ti = moment().format("YYYY-MM-DD hh:mm:ss.SSS");
        let id;
        if(this.props.detailcomments){
          id = this.props.detailcomments.dateid;
        }else{
          id = '';
        }
        let sendobj={'nickname':nickname,'user':user,'headurl':headurl,'content':comment,'datetime':ti,'id':id}
        axios({
          url:messageurl,
          method:'post',
          data:sendobj
        }).then((res)=>{
          let data=res.data;
          if(data==='success'&&this.props.path!=="/articledetail/:id"){
            this.props.getmessagelist(
              [
                {
                  user:this.props.user,
                  nickname:this.props.nickname,
                  headurl: this.props.headurl,
                  content: <p>{this.state.value}</p>,
                  constructdate: ti,
                },
                ...this.props.messagelist,
              ]
            )
            this.setState({
              submitting: false,
              value: '',
            }); 
            message.success('发送成功');
          }
          if(data==='success'&&this.props.path==="/articledetail/:id"){
            let changeobj=this.props.detailcomments;
            changeobj.comment.unshift({
              user:this.props.user,
              nickname:this.props.nickname,
              headurl: this.props.headurl,
              content: <p>{this.state.value}</p>,
              constructdate: ti,
            })
            this.props.getdetailcomments(changeobj);
            this.setState({
              submitting: false,
              value: '',
            }); 
            message.success('发送成功');
          }
          if(data==='fail'){
            message.error('发送失败');
          }
        })
      }, 1000);
    };
    handleChange = e => {
      this.setState({
        value: e.target.value,
      });
    };
    setstate=()=>{
      this.setState({
        value:''
      })
    }
    render(){
        const { submitting, value } = this.state;
        const {islogin} =this.props;
        let comments=[];
        if(this.props.path==="/articledetail/:id"&&this.props.detailcomments){
          if(this.props.detailcomments.comment){
            comments=this.props.detailcomments.comment;
          }
        }else{
          if(this.props.messagelist){
            comments=this.props.messagelist;
          }
        }
        return(
            <Row>
                <Col xs={{span:0}} xl={{span:4}} style={{height:'100px'}}></Col>
                <Col xs={{span:24}} xl={{span:16}}>
                {comments.length > 0 && <CommentList comments={comments} user={this.props.user} 
                self={this.setstate.bind(this)} path={this.props.path} articleid={this.props.detailcomments.dateid} />}
                {comments.length === 0 && <Nocomment></Nocomment> }
                {islogin === false && <Commentstate></Commentstate> }
                {islogin ===true &&
                    <Comment
                      avatar={this.props.headurl}
                      content={
                        <Editor
                          onChange={this.handleChange}
                          onSubmit={this.handleSubmit}
                          submitting={submitting}
                          value={value}
                        />
                      }
                    />
                }
                </Col>
                <Col xs={{span:0}} xl={{span:4}}></Col>
            </Row>
        )
    }
}
export default connect((state,props)=>(Object.assign({},props,state)),{getmessagelist,getdetailcomments} )(Message)
