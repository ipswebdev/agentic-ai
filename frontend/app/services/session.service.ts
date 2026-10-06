export const getLocalStorage = (key) => {
    const localStorage = window.localStorage;
    const localStorageData = localStorage.getItem(key)
    if(localStorageData){
        return JSON.parse(localStorageData)
    }else{
        return null
    }
    
}

export const setLocalStorage = (payload) => {
    window.localStorage.setItem('userDetails',JSON.stringify(payload.data));
}

export const clearLocalStorage = () => {
    window.localStorage.clear();
}
