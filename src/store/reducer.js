
const intialstate={islogin:false,user:'',number:0,nickname:'',headurl:'',articlecollect:[],messagelist:[],
articlelist:[],collectlist:[],detailcomments:[]};
export default function reducer(state=intialstate,action){
    switch(action.type){
        case 'getlogin':{
            return {
                ...state,islogin:action.value
                }
            } 
        case 'getlogout':{
            return{
                ...state,islogin:action.value
            }
        }
        case 'getuser':{
            return{
                ...state,user:action.value
            }
        }
        case 'addone':{
            return{
                ...state,number:action.value
            }
        }
        case 'getnickname':{
            return{
                ...state,nickname:action.value
            }
        }
        case 'getheadurl':{
            return{
                ...state,headurl:action.value
            }
        } 
        case 'getarticlecollect':{
            return{
                ...state,articlecollect:action.value
            }
        }
        case 'getarticlelist':{
            return{
                ...state,articlelist:action.value
            }
        }
        case 'getmessagelist':{
            return{
                ...state,messagelist:action.value
            }
        }
        case 'getcollectlist':{
            return{
                ...state,collectlist:action.value
            }
        }
        case 'getdetailcomments':{
            return{
                ...state,detailcomments:action.value
            }
        }
        default :return state;
    }
}