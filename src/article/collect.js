import React from 'react';
import {List,Avatar,Icon,Col,Row,message} from 'antd';
import Profile from './profile';
import { connect } from 'react-redux';
import {getarticlelist,getarticlecollect,getcollectlist} from '../store/action';
import axios from 'axios';

const updatearticlelike='/api/updatelike';
const updatearticlecollect='/api/updatecollect';
const collectlisturl='/api/getcollectarticle';

class Collect extends React.Component{
    constructor(props){
      super(props);
      let islogin=props.islogin;
      if(!islogin){
          message.warn("请登录后使用");
          this.props.history.push('/article');
      }
      let sendobj ={'articlecollect':props.articlecollect}
      if(props.articlecollect.length>0){
        axios({
          url:collectlisturl,
          method:'post',
          data:sendobj
        }).then((res)=>{
          let data=res.data;
          data=data.reverse();
          this.props.getcollectlist(data);
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
    commentfunc=()=>{
      console.log('commentfunc');
    }
    componentWillUnmount(){
      if(this.props.islogin){
        let sendobj={'articlelist':this.props.collectlist};
        axios({
          url:updatearticlelike,
          method:'post',
          data:sendobj
        }).then((res)=>{
          let data=res.data;
            if(data==='success'){
              console.log('update');
            }else(console.log(data))
        }).catch((err)=>{console.log(err)});
        let sendarticle={
          'articlecollect':this.props.articlecollect,
          'user':this.props.user
        }
        axios({
          url:updatearticlecollect,
          method:'post',
          data:sendarticle
        }).then((res)=>{
          let data=res.data;
          if(data==='success'){
            console.log('update');
          }else{
            console.log(data);
          }
        })
      }
    }
    render(){
      let articlecollect=this.props.articlecollect;
      return(
          <Row >
            <Col xs={{span:0}} xl={{span:6}} style={{height:'100px'}}></Col>
            <Col xs={{span:24}} xl={{span:10}}>
            <List
              itemLayout="vertical"
              size="large"
              header={`${this.props.collectlist.length}条收藏`}
              pagination={{
                pageSize: 5,
              }}
              dataSource={this.props.collectlist}  
              renderItem={(item,index) => (
                <List.Item
                    key={item.dateid}
                    actions={[
                      <span onClick={this.collectfunc.bind(this,item,articlecollect)} style={{color:articlecollect.includes(item.dateid)?'red':''}}>
                        <Icon type="star-o" style={{ marginRight: 8 }} />
                        收藏
                      </span>,
                      <span onClick={this.commentfunc.bind(this)} >
                        <Icon type="message" style={{ marginRight: 8 }} />
                        {item.comment.length}
                      </span>,
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
export default connect((props,state)=>(Object.assign({},props,state)),{getarticlelist,getcollectlist,getarticlecollect})(Collect)