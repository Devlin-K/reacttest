import React from 'react';
import {Col,Row} from 'antd';
import Profile from './profile';
import { connect } from 'react-redux';
import axios from 'axios';
import Message from '../message/message';
import {getdetailcomments} from '../store/action';

const getarticldetaileurl='/api/getarticledetail';


class Articledetail extends React.Component{
    constructor(props){
        super(props);
        let id =props.match.params.id;
        let searchobj={'dateid':id};
        console.log(props);
        axios({
            url:getarticldetaileurl,
            method:'post',
            data:{"123123":"12312"}
        }).then((res)=>{
            let data=res.data;
            console.log(data[0])
            data[0].comment.reverse();
            this.props.getdetailcomments(data[0]);
            this.setState({detaildata:data[0]});
        })
    }
    state={
        detaildata:''
    }
    render(){
        const {path}=this.props.match;
        return(
            <div>
            <Row >
            <Col xs={{span:0}} xl={{span:6}} style={{height:'100px'}}></Col>
            <Col xs={{span:24}} xl={{span:10}}>
                <h1>{this.props.detailcomments.title}</h1>   
                <p> 作者：{this.props.detailcomments.author}</p>
                <hr></hr>
                <div dangerouslySetInnerHTML={{ __html: this.props.detailcomments.content }}  />
            </Col>
            <Col xs={{span:0}} xl={{span:4}}>
                <Profile></Profile>
            </Col>
            <Col xs={{span:0}} xl={{span:6}}></Col>
            </Row>
            <div style={{marginTop:50 ,height:20}}></div>
            <Message   path={path} parentflush={this.setState.bind(this)}></Message>
            </div>
        )
    }
}
export default connect((props,state)=>(Object.assign({},props,state)),{getdetailcomments})(Articledetail)