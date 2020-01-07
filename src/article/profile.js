import React from 'react';
import {connect} from 'react-redux';
import {Card,Icon,Avatar} from 'antd';
import {Link} from 'react-router-dom'

class Profile extends React.Component{
    render(){
        const {Meta}=Card;
        let islogin=this.props.islogin;
        let username=this.props.user;
        let nickname=this.props.nickname;
        let headurl=this.props.headurl;
        const logmessege='您还没有登录哦';
        const extramessege="请登录后使用下列功能。";
        return(
            <Card
                style={{ width: 300, marginLeft:20 }}
                actions={[
                    <Link to='/articlecollect'><span><Icon type="container" />&nbsp;收藏文章</span></Link>, 
                    <Link to='/createueditor'><span><Icon type="edit" />&nbsp;发表文章</span></Link>, 
                    <Link to='/profiledetail'><span><Icon type="setting" />&nbsp;个人信息</span></Link>, 
                ]}
            >  
                <Meta
                    avatar={<Avatar size={64} src={headurl} />}
                    title={islogin?nickname:logmessege}
                    description={islogin?username:extramessege}
                />
            </Card>
        )
    }
}
export default connect((props,state)=>(Object.assign({},props,state)),{})(Profile)