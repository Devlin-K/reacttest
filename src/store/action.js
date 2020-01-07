
export function getlogin(){
    return {
        type:'getlogin',
        value:true
    }
}
export function getlogout(){
    return{
        type:'getlogout',
        value:false
    }
}
export function getuser(username){
    return{
        type:'getuser',
        value:username
    }
}
export function addone(value){
    return{
        type:'addone',
        value:value
    }
}
export function getnickname(value){
    return{
        type:'getnickname',
        value:value
    }
}
export function getheadurl(value){
    return{
        type:'getheadurl',
        value:value
    }
}
export function getarticlecollect(value){
    return{
        type:'getarticlecollect',
        value:value
    }
}
export function getarticlelist(value){
    return{
        type:'getarticlelist',
        value:value
    }
}
export function getmessagelist(value){
    return{
        type:'getmessagelist',
        value:value
    }
}
export function getcollectlist(value){
    return{
        type:'getcollectlist',
        value:value
    }
}
export function getdetailcomments(value){
    return{
        type:'getdetailcomments',
        value:value
    }
}