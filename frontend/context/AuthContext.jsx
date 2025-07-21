import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // CHECK IF THE USER IS AUTHENTICATED AND IF SO, SET THE USER DATA AND CONNECT THE SOCKET
    const checkAuth = async () => {
        try{
            const {data} = await axios.get("/api/auth/check");

            if(data.success) {
                console.log("Authenticated user:", data.user);
                setAuthUser(data.user);

                connectSocket(data.user);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // LOGIN / SIGNUP FUNCTION TO HANDLE USER AUTHENTICATION AND SOCKET CONNECTION
    const login = async (state, credentials) => {
        try{
            const {data} = await axios.post(`/api/auth/${state}`, credentials); // CREDENTIAL IS EMAIL OR PASSWORD
            console.log("[LOGIN] Server response:", data);
            
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                console.log("[LOGIN] Token stored in axios, state, and localStorage");

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    // LOGOUT FUNCTION TO HANDLE USER LOGOUT AND SOCKET DISCONNECTION
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
        if (socket?.connected) {
            socket.disconnect();
            console.log("[LOGOUT] Socket disconnected");
        }
    }

    // UPDATE PROFILE FUNCTION TO HANDLE USER PROFILE UPDATES
    const updateProfile = async (body) => {
        try{
            const {data} = await axios.put("/api/auth/update-profile", body);
            console.log("Server response:", data);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }

        } catch(error){
            toast.error(error.message);
        }
    }

    // CONNECT SOCKET FUNCTION TO HANDLE SOCKET CONNECTION AND ONLINE USERS UPDATES
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    // whenever page opens check if authenticated
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        // gets token from local storage and adds this token to all API request made using axios, sends when sending request for authenticated user

        checkAuth();
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value = {value}>
            { children }
        </AuthContext.Provider>
    )
}


{/*
    
    axios always returns a response object which looks like this:

    {
        data: ...,        // <-- This is the actual response body from the server
        status: 200,      // HTTP status code
        statusText: "OK",
        headers: {...},
        config: {...},
        request: {...}
    }

    A common backend response might be:
    DATA => :
    {
        "success": true,
        "user": {
            "_id": "abc123",
            "name": "Sha",
            "email": "sha@example.com",
        }
    }

    So in your frontend:
    data.success would be true
    data.user would be the user object
    You can then store data.user using setAuthUser(data.user)


    
*/}