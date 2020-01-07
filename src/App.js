import React from 'react';
import './App.css';
import Notfound from './404page/404page';
import Home from './index/home';
import {connect} from 'react-redux';
import {BrowserRouter as Router,Switch} from 'react-router-dom';
import { Layout } from 'antd';
import Routercontrol from './routercontrol'


class App extends React.Component{
    render(){
        return(
            <Router>
            <Layout>
            <Switch>
               <Routercontrol homename={Home} articlename={Home} messagename={Home} loginname={Home} 
                notfondname={Notfound} ueditorname={Home} detailname={Home} profiledetailname={Home}
                articlecollectname={Home}></Routercontrol>
            </Switch>
            </Layout>
            </Router>
        )
    }
}
export default connect((state,props)=>(Object.assign({},props,state)),{})(App)