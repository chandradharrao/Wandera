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

    //current chat under display
    const [currChat,setChat] = useState(null);

    //all messages corresponding to a certain chat
    const [messeges,setMesseges] = useState(null);

    //current user id
    const my_id = JSON.parse(localStorage.getItem("user"))._id;
    
    //whenever page refreshes, fetch all the conversations
    useEffect(()=>{
        getConversations()
            .then(({conversations})=>{
                setConversations(conversations);
                console.log("State set!");
            })
            .catch(err=>console.log(err));
    },[])

    //when a chat is clicked, fetch all the messeges related to it
    useEffect(()=>{
        const getMesseges = async ()=>{
            console.log("Current chat clicked:")
            console.log(currChat);

            if(currChat!=null){
                const {conversation_id} = currChat;

                const reqOptions = {
                    method:'POST',
                    headers:{'Content-Type':'application/json',"Authorization":'Bearer '+localStorage.getItem('jwt')},
                    body:JSON.stringify({conversation_id:conversation_id})
                };
            
                try{
                    const response = await fetch("/getMessages",reqOptions);
                    const data = await response.json();
                    console.log("The messeges retrived ");
                    console.log(data);
                    setMesseges(data.data);
                }
                catch(err){
                    if(err) throw err;
                    console.log(err);
                }
            }
        }

        getMesseges()
    },[currChat])

    useEffect(()=>{
        console.log("Messages set!");
        console.log(messeges);
    },[messeges])

    return(
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
                    {
                        //returns an array of the result
                        conversations.map((c,i)=>{
                            return <div onClick={()=>{console.log(c);setChat(c)}}><Conversation conversation={c} key={i}/></div>
                        })
                    }
                </div>
            </div>

            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {/* is_my_msg prop is a boolean indicating weather i wrote the message or friend wrote it so that CSS can be applied! */}
                    {console.log("User " + JSON.parse(localStorage.getItem("user"))._id)}
                    {
                        //only if a chat is selected, display messages of the chat. Else display no messages.
                        !currChat?<span className="no-conversation">Open a conversation to begin chatting!</span>:messeges?
                        messeges.map((m,i)=>{
                            return <div><Messege is_my_msg={m.authorID.toString() === my_id.toString()} data={m.data} key={i} timestamp={'1 hour ago'}/></div>
                        })
                        :null
                    }
                </div>
                <div className="chatBoxBottom">
                    {
                        currChat?
                        <>
                            <textarea 
                            placeholder="whats on your mind?"
                            className="messageInput"
                            ></textarea>

                            <button
                                className="sendMessage"
                            >Send</button>
                        </>:<></>
                    }
                </div>
            </div>
        </div>
    )
};

export default Messenger;