import { useState, useEffect } from 'react'


export function useLocalStorage<T>(key : string, initialValue : T | (() => T)){
    const [value, setValue] = useState(() => {
        const JSONvalue = localStorage.getItem(key)
        
        if (JSONvalue == null){
            if (typeof initialValue === 'function'){
                return (initialValue as () => T)()
            }else{
                return initialValue
            }
        } else {
            return JSON.parse(JSONvalue)
        }

    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [ value, setValue] as [T, typeof setValue]
}

export default useLocalStorage