import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, register, refresh_token} from "../endpoints/api";
import { login } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticted] = useState(false);
    const [loading, setLoading] = useState(true)
    const nav = useNavigate();

    const get_authenticted = async () => {
        try {
            await refresh_token();
            const success = await is_authenticated();
            setIsAuthenticted(success)
        }catch{
            setIsAuthenticted(false)
        }finally{
            setLoading(false)
        }
    }

    const login_user = async (username, password) => {
        const success = await login(username, password);
        if (success){
            setIsAuthenticted(true)
            nav('/')
        }

    }

    const register_user = async (username, email, password, confirmPassword) =>{
        if (password === confirmPassword){
            try{
                await register(username, email, password)
                alert('successfully registered user')
            }catch{
                alert('error registering the user')
            }
        }else {
            alert('password dont match')
        }
    }

    useEffect(() => { //everytime we go to new url we chck if use is authenticated
        get_authenticted();
    }, [window.location.pathname])
    return (
        <AuthContext.Provider value={{isAuthenticated, loading, login_user, register_user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);