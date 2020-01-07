import React from 'react';
import {Row,Col,BackTop} from 'antd';

const footerstr1='D.K Blog For Fun'
const footerstr2='WX:'


export default class Footerpage extends React.PureComponent{
    render(){
        return(
            <Row align={"middle"} justify={"center"} style={{height:'150px'}}>
                <Col lg={{span:8}} xs={{span:0}}></Col>
                <Col lg={{span:8}} xs={{span:24}} style={{textAlign:'center',height:'100px',}} > 
                    <div className="hr"></div>
                    <p style={{lineHeight:'50px',marginTop:'50px'}}>
                        {footerstr1}<br/>
                        {footerstr2}
                    </p>        
                </Col>
                <Col lg={{span:8}} xs={{span:0}}>
                    <BackTop>
                    </BackTop>
                </Col>
            </Row>
        )
    }
}
