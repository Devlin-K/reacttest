
import React from 'react';
import Headerpage from './header/header';
import Footerpage from './footer/footer';


class Home extends React.Component{
    render(){
        const {path}=this.props.match;
        return(
            <div>
                <Headerpage path={path}/>         
                <Footerpage />
            </div>
        )
    }
}

export default Home;