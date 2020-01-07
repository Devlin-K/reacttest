import React from 'react';
import {connect} from 'react-redux';



class Notfond extends React.Component{
    render(){
       
        return(
            <div style={{fontSize:50}}>404page</div>


        )
    }
}
export default connect((props,state)=>(Object.assign({},props,state)),{})(Notfond)