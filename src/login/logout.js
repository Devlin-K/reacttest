import React from 'react';
import {connect} from 'react-redux';
import{Button,message}from 'antd';
import {getlogout,getuser}from'../store/action';

class Logoutpage extends React.Component{
    logoutfunc=()=>{
        sessionStorage.removeItem('user');
        this.props.getlogout();
        this.props.getuser("");
        message.success('注销成功')
        this.props.history.go();    
    }
    render(){
        return(
            <div style={{textAlign:'center'}}>
            <p>您已经登录，是否注销？</p>
            <p>
            <Button onClick={this.logoutfunc} type='primary'>注销</Button></p>
            </div>
        )
    }
}
export default connect((state,props)=>(Object.assign({},props,state)),{getlogout,getuser})(Logoutpage)