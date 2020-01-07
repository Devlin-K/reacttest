import React from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';


class Routercontrol extends React.Component{
    render(){
        return(
       
            <div>
                <Route path='/' exact component={this.props.homename}/>
                <Route exact path='/home' component={this.props.homename}/>
                <Route path='/article' component={this.props.articlename}/>
                <Route path='/message' component={this.props.messagename}/>
                <Route path='/login/' component={this.props.loginname}></Route>
                <Route component={this.props.notfoundname}></Route>
                <Route path='/createueditor' component={this.props.ueditorname}></Route>
                <Route path='/articledetail/:id' component={this.props.detailname}></Route>
                <Route path='/profiledetail'  component={this.props.profiledetailname}></Route>
                <Route path='/articlecollect' component={this.props.articlecollectname}></Route>
            </div>
        )
    }
}
export default connect((state,props)=>(Object.assign({},props,state)),{})(Routercontrol)