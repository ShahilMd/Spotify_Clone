import React, {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import axios from "axios";
import  {Toaster , toast} from 'react-hot-toast'


const server = 'http://localhost:4000'
export interface  User{
    _id:string,
    name:string,
    email:string,
    role:string,
    playlist:string[],
}
interface UserContextType{
    user:User | null,
    isAuth:boolean,
    loading: boolean,
    btnLoading:boolean,
    loginUser: (email:string,password:string,navigate:(path:string)=>void) => Promise<void>,
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
    children:ReactNode
}

export const UserProvider:React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [btnLoading, setBtnLoading] = useState<boolean>(false)

    async function loginUser(email:string,password:string, navigate:(path:string) => void){
        setBtnLoading(true)
        try {
            const {data} = await  axios.post(`${server}/api/v1/user/login`,{
                email,
                password,
            })
            toast.success(data.message)
            localStorage.setItem('token', data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate('/')
        } catch (error:any) {
            toast.error(error?.response?.data?.message || 'An error occurred')
            setBtnLoading(false)
        }
    }

    async function fetchUser(){
        try {
            const data:User = await axios.get(`${server}/api/v1/user/profile`,{
                headers:{
                    token: localStorage.getItem('token')
                }
            })

            setUser(data)
            setIsAuth(true)
            setLoading(false)

        } catch (error) {
            console.error(error);
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchUser()
    }, []);

    return <UserContext.Provider value={{user , loading , isAuth,btnLoading,loginUser}}>{children}</UserContext.Provider>
}

export const useuserData = ():UserContextType => {
    const context = useContext(UserContext)

    if(!context){
        throw new Error(`UserData must be used within a USerProvider`)
    }
    return  context;
}