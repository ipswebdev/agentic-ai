import { clearLocalStorage, getLocalStorage } from "./session.service"

export const get = async (url,headers) => {
    let options = {}
    let headersObj = {}
    const authData = getLocalStorage('userDetails');
    if(authData && authData.jwt){
        headersObj = {...headersObj,"Authorization": `Bearer ${authData.jwt}`}
    }
    if(!!headers){
        headersObj = {...headersObj,...headers}
        options = {...options,headers:{...headersObj}}
    }
    const results = await fetch(url,{
        method:'GET',...options
    })
    console.log('apiClientGet',results)
    if(results.status === 401){
        clearLocalStorage();
        return null
    }
    return results
}

export const post = async (url,headers,body) => {
    let options = {}
    let headersObj = {}
    const authData = getLocalStorage('userDetails');
    if(authData && authData.jwt){
        headersObj = {...headersObj,"Authorization": `Bearer ${authData.jwt}`}
    }
    if(!!headers){
        headersObj = {...headersObj,...headers}
        options = {...options,headers:{...headersObj}}
    }
    if(!!body){
        options = {...options,body:body}
    }
    
    console.log('api client post url',url,authData)
    const results = await fetch(url,{
        ...options,
        method:'POST',
    })
    if(results.status === 401){
        clearLocalStorage();
        return null
    }
    return results
}
