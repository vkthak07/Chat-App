import { createContext, useContext, useEffect, useState } from "react";
import {AuthContext, useAuthContext} from './AuthContext.jsx'
import io from "socket.io-client";


export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children}) => {
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const {authUser} = useAuthContext();

    useEffect(()=>{
        if(authUser){
            const socket = io("https://chat-app-29v0.onrender.com/",{
                query:{
                    userId: authUser._id,
                }
            });
            setSocket(socket);
// socket.on is used to listen to the events. This can be used both on client side and server side
            socket.on("getOnlineUsers",(users)=>{
                setOnlineUsers(users);
            });

            return ()=>socket.close();
        }
        else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    },[authUser]);

    return <SocketContext.Provider value={{socket,onlineUsers}}>{children}</SocketContext.Provider>;
};