import "./Messenger.css";
import Conversation from "./Conversation";
import React, { useEffect, useState } from 'react';
import Messege from "./Messege";

const getConversations = async ()=>{
    try{
        const response = await fetch(
            "/conversations",
            {
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }
            );
        const convsersationFriends = await response.json();
        console.log(convsersationFriends);
        return convsersationFriends;
    }
    catch(err){
        if(err) throw err;
        console.log(err);
    }
}

const Messenger = (props)=>{
    //intiially conversations is empty list
    const [conversations,setConversations] = useState([]);
    
    //whenever page refreshes, fetch all the conversations
    useEffect(()=>{
        getConversations()
            .then(convsersationFriends=>{
                setConversations(convsersationFriends);
            })
            .catch(err=>console.log(err));
    },[])

    return(
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
                    {
                        //returns an array of the result
                        conversations.map(c=>{
                            <Conversation conversation={c} />
                        })
                    }
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {/* is_my_msg prop is a boolean indicating weather i wrote the message or friend wrote it so that CSS can be applied! */}
                    <Messege is_my_msg={true}/>
                    <Messege />
                    <Messege />
                    <Messege is_my_msg={true}/>
                    <Messege is_my_msg={true}/>
                    <Messege />
                    <Messege />
                    <Messege is_my_msg={true}/>
                </div>
                <div className="chatBoxBottom">
                    <textarea 
                    placeholder="whats on your mind?"
                    className="messageInput"
                    ></textarea>

                    <button
                        className="sendMessage"
                    >Send</button>
                </div>
            </div>
        </div>
    )
};

export default Messenger;