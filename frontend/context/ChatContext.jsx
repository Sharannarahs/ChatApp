import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages,setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // FUNCTION TO GET ALL USERS FOR SIDEBAR
    const getUsers = async () => {
        try{
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }

        }catch (error){
            toast.error(error.message);
        }
    }

    // FUNCTION TO GET MESSAGES FOR SELECTD USERS
    const getMessages = async (userId) => {
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch(error){
            toast.error(error.message);
        }
    }

    // FUNCTION TO SEND MESSAGES TO SELECTED USER
    const sendMessage = async (messageData) => {
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages) =>[...prevMessages, data.newMessage])
            } else {
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    // FUNCTION TO SUBSCRIBE TO MESSAGES FOR SELECTED USER
    const subscribeToMessage = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);

                axios.put(`/api/messages/mark/${newMessage._id}`);

            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId] : 
                    prevUnseenMessages[newMessage.senderId] ? 
                    prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // FUNCTION TO UNSUBSCRIBE FROM MESSAGES
    const unsubscribeFromMessages = async () => {
        if(socket){
            socket.off("newMessage");
        }
    }

    useEffect(() =>{
        subscribeToMessage();
        return () => unsubscribeFromMessages();
    },[socket, selectedUser]);



    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages
    }

    return(
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}