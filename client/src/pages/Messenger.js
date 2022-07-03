import "./Messenger.css";
import Conversation from "./Conversation";
import React, { useEffect, useState, useRef } from 'react';
import Messege from "./Messege";
import {io} from "socket.io-client";

const getConversations = async ()=>{
    try{
        const response = await fetch("/conversations",{headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}});

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

    //user typed messege
    const [sendMessege,setSendMessege] = useState('');

    //re-fetch the messgae of current chat fater sending a messege
    const [refresh,setRefresh] = useState(false);

    //dom element to scroll to
    const scrollTo = useRef();

    //client socket
    const [socket,setSocket] = useState(null); 

    //online users
    const [onlineFriends,setOnlineFriends] = useState(new Set());

    //handle change in the text area data
    const handleTextareaChange = (event)=>{
        setSendMessege(event.target.value);
        console.log(event.target.value);
    }

    //handle send button press
    const postMessege = async ()=>{
        const conversation_id = currChat.conversation_id;
        const data = sendMessege;
        const recieverID = currChat.other;
        
        if(sendMessege!=null){
            const reqOptions = {
                method:'POST',
                headers:{'Content-Type':'application/json','Authorization':"Bearer " + localStorage.getItem('jwt')},
                body:JSON.stringify(
                    {
                        conversation_id:conversation_id,
                        data:data,
                        recieverID:recieverID
                    }
                )
            };

            try{
                const response = await fetch("/createChat",reqOptions);
                const data = await response.json();

                //trigger useeffect to re-fetch data from server
                setRefresh(!refresh);
            }   
            catch(err){
                if(err) throw err;
                console.log(err);
            }
        }
    }


    //whenever server pushes message to client, the socket object is updated
    useEffect(()=>{
        console.log("creating connection...")
        if(socket){
            console.log("Connection created with sock server!");

            socket.emit("addUser",my_id)

            socket.on("onboardingEvent",(msg)=>{
                console.log(msg);
            })

            socket.on("returnOnlineFriends",({online_friends})=>{
                console.log("IO recieved friends:");
                console.log(JSON.stringify(online_friends));
                setOnlineFriends(new Set(online_friends));
            })
        }

        //get the conversations everytime server pushes something to the socket
        getConversations()
            .then(({conversations})=>{
                setConversations(conversations);
                console.log("State set!");
            })
            .catch(err=>console.log(err));

    },[socket])
    
    //whenever page refreshes, fetch all the conversations
    useEffect(()=>{

        //create a connection to the server
        const conn = io("ws://localhost:8900");
        setSocket(conn);
        console.log(conn);
    },[])

    useEffect(()=>{
        if(socket){
            console.log("All conversations....");
            console.log(conversations);

            //get all online users
            socket.emit("getOnlineFriends")
        }

    },[conversations])

    //when a chat is clicked, fetch all the messeges related to it
    useEffect(()=>{
        console.log("Fetch messege use effect triggered!!");

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

        //scroll into the reference dom element
        if(scrollTo.current){
            scrollTo.current.scrollIntoView({behaviour:"smooth"});
        }

    },[currChat,refresh])

    useEffect(()=>{
        console.log("Messages set!");
        console.log(messeges);

        //scroll into the reference dom element
        if(scrollTo.current){
            scrollTo.current.scrollIntoView({behaviour:"smooth"});
        }
        
    },[messeges])

    return(
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
                    {console.log("Online friends recieved")}
                    {console.log(onlineFriends)}
                    {
                        //returns an array of the result
                        conversations.map((c,i)=>{
                            return <div onClick={()=>{console.log(c);setChat(c)}}><Conversation conversation={c} isOnline={onlineFriends.has(c.other)} key={i}/></div>
                        })
                    }
                </div>
            </div>

            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {/* is_my_msg prop is a boolean indicating weather i wrote the message or friend wrote it so that CSS can be applied! */}
                    {console.log("User " + JSON.parse(localStorage.getItem("user"))._id)}
                    {
                        /*only if a chat is selected, display messages of the chat. Else display no messages.*/
                        !currChat?<span className="no-conversation">Open a conversation to begin chatting!</span>:messeges?
                        messeges.map((m,i)=>{
                            return <div ref={scrollTo}><Messege is_my_msg={m.authorID.toString() === my_id.toString()} data={m.data} key={i} timestamp={m.created_at}/></div>
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
                            value = {sendMessege}
                            onChange = {handleTextareaChange}
                            />

                            <button
                                onClick={postMessege}
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