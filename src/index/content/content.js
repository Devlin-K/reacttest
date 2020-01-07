import React from 'react';
import { Carousel,Row } from 'antd';

const jpg1 = require('../../img/indexjpg/1.jpg');
const jpg2 = require('../../img/indexjpg/2.jpg');
const jpg3 = require('../../img/indexjpg/3.jpg');
const jpg4 = require('../../img/indexjpg/4.jpg');
const jpgli=[jpg1,jpg2,jpg3,jpg4];
let newli=[];
for(let i=0;i<jpgli.length;i++){
    newli.push( {backgroundImage:"url('"+jpgli[i]+"')",height:'500px'})
}

class Content extends React.PureComponent{
    render(){
        const settings = {
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            speed: 2000,
            autoplaySpeed: 2000,
            cssEase: "linear"
        };
        return(
            <Row>
                <Carousel {...settings}>
                    {jpgli.map((value,index)=>(
                        <div key ={value+index}><img src={value} alt={value} ></img></div>
                    ))}
                </Carousel>
            </Row>
        )
    }
}
export default Content;