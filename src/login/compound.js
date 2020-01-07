import React from 'react';
import Loginpages from './login';
import Registerform from './regist';
import {Col,Row} from 'antd';
import {Route,Link} from 'react-router-dom';
import  Logoutpage from './logout';
import {connect} from 'react-redux';

 class Loginregistpage extends React.Component{
    render(){
        let {path}=this.props.match;
        let user=sessionStorage.getItem('user');
        return(
            <div>
                <Row  style={{textAlign:'center'}}>
                    <Col xs={{span:3}} xl={{span:8}} style={{height:'100px'}}></Col>
                    <Col xs={{span:8}} xl={{span:4}} style={{padding:'20px'}}>
                        <Link to={path+'accountlogin'}>
                            <p style={{fontSize:'20px',float:'right'}}>{user?<span>注销</span>:<span>登录</span>}</p>
                        </Link>
                    </Col>
                    <Col xs={{span:8}} xl={{span:4}} style={{padding:'20px'}}>
                        <Link to={path+'accountregist'}>
                            <p style={{fontSize:'20px' ,float:'left'}}>注册</p>
                        </Link>
                    </Col>   
                </Row>
                <Row className='row1'>
                    <Col xs={{span:2}} xl={{span:8}} className="col1"></Col>
                    <Col xs={{span:18}} xl={{span:8}} className='col2'>
                        <Route path={path + 'accountlogin'}      component={user?Logoutpage:Loginpages}/>
                        <Route path={path + 'accountregist'}     component={Registerform}/>
                    </Col >
                    <Col xs={{span:4}} xl={{span:8}}></Col>
                </Row>
            </div>
        )
    }
}
export default connect((state,props)=>(Object.assign({},props,state)),{})(Loginregistpage)