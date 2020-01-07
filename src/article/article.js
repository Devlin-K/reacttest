import React from 'react';
import {List,Avatar,Icon,Col,Row,message} from 'antd';
import Profile from './profile';
import { connect } from 'react-redux';
import {getarticlelist,getarticlecollect} from '../store/action';
import axios from 'axios';

const delarticleurl='/api/delarticle';
const getarticleurl='/api/getarticle';
const updatearticlelike='/api/updatelike';
const updatearticlecollect='/api/updatecollect';

class Article extends React.Component{
    constructor(props){
        super(props);
        if(props.articlelist.length===0){
          axios({
            url:"",
            method:'post',
            data:{"123123":"12312"}
          }).then((res)=>{
            let data=res.data;
            /*
            data=data.reverse();*/
            this.props.getarticlelist("");
            this.setState({value:''});
          }).catch((e)=>{console.log(e)})
       }
    }
    collectfunc=(item,articlecollect)=>{
      if(!this.props.user){
        message.error("请登录后收藏")
        return
      }
      for(let i=0;i<articlecollect.length;i++){
        if(articlecollect[i]===item.dateid){
          articlecollect.splice(i,1);
          getarticlecollect(articlecollect);
          this.setState({});
          return
        }
      }  
      articlecollect.push(item.dateid);
      getarticlecollect(articlecollect);
      this.setState({});
    }
    likefunc=function (item,index){
      if(!this.props.user){
        message.error("请登录后点赞")
        return
      }
      for(let i=0;i<item.like.length;i++){
        if(item.like[i]===this.props.user){
          item.like.splice(i,1);
          this.setState({});
          return
        }
      }
      item.like.push(this.props.user);
      this.setState({});
    }
    commentfunc=()=>{
      console.log('commentfunc');
    }
    delfunc=(item,e)=>{
      e.preventDefault();
      let sendobj = {"dateid":item.dateid};
        axios({
            url:"",
            method:'post',
            data:{"123123":"12312"}
      }).then((res)=>{
        let data=res.data;
        if(data==='success'){
          message.success("删除成功");
          let index;
          for(let i=0;i<this.props.articlelist.length;i++){
            if(this.props.articlelist[i]['dateid']===item.dateid){
              index=i;
            }
          }
          let changelist =this.props.articlelist;
          changelist.splice(index,1);
          this.props.getarticlelist(changelist);
          this.setState({});
        }else{
          message.error("删除失败")
        }
      })
    }
    componentWillUnmount(){
      if(this.props.islogin){
      let sendobj={'articlelist':this.props.articlelist}
      axios({
          url:"",
          method:'post',
          data:{"123123":"12312"}
      }).then((res)=>{
        let data=res.data;
        if(data==='success'){
          console.log('update')
        }else(console.log(data))
      }).catch((err)=>{console.log(err)})
      let sendarticle={
        'articlecollect':this.props.articlecollect,
        'user':this.props.user
      }
      axios({
          url:"",
          method:'post',
          data:{"123123":"12312"}
      }).then((res)=>{
        let data=res.data;
        if(data==='success'){
          console.log('update');
        }else{
          console.log(data);
        }
      })
    }}
    render(){
        let articlecollect=this.props.articlecollect
        return(
            <Row >
            <Col xs={{span:0}} xl={{span:6}} style={{height:'100px'}}></Col>
            <Col xs={{span:24}} xl={{span:10}}>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 5,
              }}
              dataSource={this.props.articlelist}
              renderItem={(item,index) => (
                <List.Item
                    key={item.dateid}
                    actions={[
                      <span onClick={this.collectfunc.bind(this,item,articlecollect)} style={{color:articlecollect.includes(item.dateid)?'red':''}}>
                        <Icon type="star-o" style={{ marginRight: 8 }} />
                        收藏
                      </span>,
                      <span onClick={this.likefunc.bind(this,item,index)} style={{color:item.like.includes(this.props.user)?'red':''}} >
                        <Icon type="like-o" style={{ marginRight: 8 }} />
                        {item.like.length}
                      </span>,
                      <span onClick={this.commentfunc.bind(this)} >
                        <Icon type="message" style={{ marginRight: 8 }} />
                        {item.comment.length}
                      </span>,
                      <a onClick={this.delfunc.bind(this,item)} href='/'>{item.account===this.props.user?"删除":""}</a>
                    ]}
                >
                  <List.Item.Meta avatar={<Avatar src={item.headurl} size={50} />}
                    title={<a href={'/articledetail/'+item.dateid} className="apoint">{item.title}</a>}
                    description={item.author}
                    />
                </List.Item>
              )}
            />
            </Col>
              <Col xs={{span:0}} xl={{span:4}}>
               <Profile></Profile>
              </Col>
              <Col xs={{span:0}} xl={{span:6}}></Col>
              </Row>
        )     
    }
}
export default connect((props,state)=>(Object.assign({},props,state)),{getarticlelist})(Article)