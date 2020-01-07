import React from 'react';
import Article from '../../article/article';
import Message from '../../message/message';
import Loginregistpage from '../../login/compound';
import Notfound from '../../404page/404page';
import{Link,Switch} from 'react-router-dom';
import Routercontrol from '../../routercontrol'
import {Menu,Icon,Row,Col,Drawer} from 'antd';
import Content from '../content/content';
import {connect} from 'react-redux';
import {getlogin,getuser,getnickname,getarticlecollect,getheadurl,getarticlelist,getmessagelist} from '../../store/action'
import Ueditor from '../../article/ueditor';
import Articledetail from '../../article/articledetail';
import Profiledetail from '../../article/profiledetail';
import Collect from '../../article/collect';
import axios from 'axios';

const checkloginurl="/api/checkuser";
const getarticleurl='/api/getarticle';
const achieveurl='api/getmessage';

class Headerpage extends React.Component{
    constructor(props){
      super(props);
      if(props.articlelist.length===0){
        axios({
          url:getarticleurl,
          method:'post',
          data:{}
        }).then((res)=>{
          let data=res.data;
          data=data.reverse()
          this.props.getarticlelist(data);
        },(err)=>(console.log(err)))
      } 
      if(props.path!=="/articledetail/:id"){
        if(props.messagelist.length===0){
          console.log(props);
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
    state = {
      current: 'mail',
      visible:false
    };
    handleClick=(e)=> {
      this.setState({
        current:e.key,
      });
    };
    showdrawer=()=>{
      this.setState({
        visible:true
      })
    }
    onClose=()=>{
      this.setState({
        visible: false,
      });
    };
    render(){
      if(sessionStorage.getItem('user')&&this.props.islogin===false){
        let sessionuser=sessionStorage.getItem('user');
        let sendobj={username:sessionuser};
        axios({
          url:checkloginurl,
          method:'post',
          data:sendobj
        }).then((data)=>{
          let res=data.data;
          this.props.getlogin();
          this.props.getuser(sessionuser);
          this.props.getnickname(res.nickname);
          this.props.getheadurl(res.headurl);
          this.props.getarticlecollect(res.articlecollect);
        })
      }
      return(
        <div >
          <Row gutter={8} type="flex" justify="center" align="middle" style={{height:'150px'}} >
          <Col xs={{span:0}} xl={{span:8}} >
            <Drawer   
              title="导 航 栏"
              placement='left'
              closable={true}
              onClose={this.onClose}
              visible={this.state.visible}
              mask={false}
            >
              <Link to='/'>
              <p className='pstyle' > <Icon type="home" style={{float:'left',marginTop:'5px',fontSize:'22px'}}/>主页</p>
              </Link>
              <Link to='/article'>
              <p  className='pstyle'><Icon type="book"  style={{float:'left',marginTop:'5px',fontSize:'22px'}}/>文章</p>
              </Link>
              <Link to='/message'>
              <p  className='pstyle'><Icon type="form"  style={{float:'left',marginTop:'5px',fontSize:'22px'}} />留言</p>
              </Link>
            </Drawer>
            <Icon type="unordered-list" style={{marginLeft:'20px',fontSize:'22px'}} onClick={this.showdrawer} />
          </Col>
          <Col xs={{span:22}} xl={{span:8}}  style={{textAlign:'center'}}>
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
              <Menu.Item key="home" style={{padding:'0 30px'}}>
                <Link to='/home'><Icon type="home" className='svg'/>Home</Link>
              </Menu.Item>
              <Menu.Item key="article" style={{padding:'0 30px'}}>
                <Link to='/article'><Icon type="book" className='svg'/>Article</Link>
              </Menu.Item>
              <Menu.Item key="message" style={{padding:'0 30px'}}>
                <Link to='/message'><Icon type="form" className='svg'/>Contact Me</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col xs={{span:2}} xl={{span:8}} style={{textAlign:'center'}} >
            <Link to='/login/accountlogin'>
            <Icon type="user" style={{float:'right',marginRight:'20px',fontSize:'22px'}} />
            </Link>
          </Col>
          </Row>
          <Switch>
            <Routercontrol 
              homename={Content} articlename={Article} messagename={Message} 
              loginname={Loginregistpage}  notfondname={Notfound} ueditorname={Ueditor}
              detailname={Articledetail} profiledetailname={Profiledetail} articlecollectname={Collect}
            >
            </Routercontrol>
          </Switch>
        </div>
      )
    }
}

export default connect((state,props)=>(Object.assign({},props,state)),{getarticlelist,getmessagelist,getlogin,getuser,getnickname,getarticlecollect,getheadurl})(Headerpage);