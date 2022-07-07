import "./Messenger.css";
import Conversation from "./Conversation";
import React, { useEffect, useState, useRef } from 'react';
import Messege from "./Messege";
import {io} from "socket.io-client";
import {useHistory} from "react-router-dom";

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

    //dom element to scroll to
    const scrollTo = useRef();

    //client socket
    const [socket,setSocket] = useState(null); 

    //online users
    const [onlineFriends,setOnlineFriends] = useState(new Set());

    //search bar text
    const [searchData,setSearchData] = useState('');

    //all friends list
    const [allFriends,setAllFriends] = useState([]);

    //handle change in the text area data
    const handleTextareaChange = (event)=>{
        setSendMessege(event.target.value);
        console.log(event.target.value);
    }

    //handle send button press
    const postMessege = async ()=>{
        if(!currChat) return;

        const conversation_id = currChat.conversation_id;
        const data = sendMessege;
        const recieverID = currChat.other;
        const post_data = {
            conversation_id:conversation_id,
            data:data,
            recieverID:recieverID
        };

        if(sendMessege!=null){
            //send it to socket server for instant server push of the message to other client
            socket.emit("postMessege",post_data);

            //posting it to regular server for archiving in mongodb
            const reqOptions = {
                method:'POST',
                headers:{'Content-Type':'application/json','Authorization':"Bearer " + localStorage.getItem('jwt')},
                body:JSON.stringify(post_data)
            };

            try{
                const _ = await fetch("/createChat",reqOptions);
                //clear the tetx area
                setSendMessege('');
            }   
            catch(err){
                if(err) throw err;
                console.log(err);
            }
        }
    }

    const handleSearchBar = (event)=>{
        setSearchData(event.target.value);
    }

    const history = useHistory();

    useEffect(()=>{
        console.log(searchData);
        let stored_conv = JSON.parse(localStorage.getItem("conversations"));

        if (stored_conv && conversations){
            let filtered_convs = stored_conv.filter((c)=>{
                if(!c) return false;

                console.log(c.otherName.includes(searchData))
                return c.otherName.includes(searchData)
            })
            setConversations(filtered_convs);
        }
    },[searchData])


    //whenever server pushes message to client, the socket object is updated which triggers this use-effect.
    //Also trigger this only when we have a value for currChat state
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

            socket.on("transportMessege",({data,authorID})=>{
                console.log("Recieved: " + data + " " + authorID);
                console.log("Current chat "+JSON.stringify(currChat))

                if(currChat){
                    const {conversation_id} = currChat;
                    const stored_msgs = JSON.parse(localStorage.getItem(conversation_id));
                    console.log("Messeges in local store: ");
                    for(let i = 0;i<stored_msgs.length;i++){
                        console.log(JSON.stringify(stored_msgs[i]))
                    }
                    console.log();
                    if(stored_msgs){
                        const new_msgs = [...stored_msgs,{"created_at":(new Date()).toString(),data,authorID}]
                        setMesseges(new_msgs)
                        localStorage.setItem(conversation_id,JSON.stringify(new_msgs));
                    }
                    else
                        console.log("currChat is null??")
                }
            })
        }

    },[socket,currChat])

    useEffect(()=>{
        console.log("CurrChat changed??")
    },[currChat])
    
    //whenever page refreshes, fetch all the conversations
    useEffect(()=>{

        //create a connection to the server
        const conn = io("ws://localhost:8900");
        setSocket(conn);
        console.log(conn);

        //get all the conversations 
        getConversations()
            .then(({conversations})=>{
                setConversations(conversations);
                console.log("State set!");

                localStorage.setItem("conversations",JSON.stringify(conversations));
            })
            .catch(err=>console.log(err));

        //get all friends
        const getReqOpt = {headers:{"Authorization":"Bearer "+localStorage.getItem('jwt')}}
        fetch("/getFriends",getReqOpt).
        then(response=>response.json())
        .then(({friends})=>{
            console.log("Friends " + JSON.stringify(friends));
            setAllFriends(friends);
        })
    },[]); //loaded only once

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

                    //localstore these messeges
                    localStorage.setItem(conversation_id,JSON.stringify(data.data))
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

    },[currChat])

    useEffect(()=>{
        console.log("Messages set!");
        console.log(messeges);

        //scroll into the reference dom element
        if(scrollTo.current){
            scrollTo.current.scrollIntoView({behaviour:"smooth"});
        }
        
    },[messeges])


    //add this event listener only after we have currChat and sendMesseges with us
    useEffect(()=>{
        //allow sending of messege when enter is pressed by adding event listener to "Enter" when component is mounted
        const enter_evnt_listener = (event)=>{
            if(event.code=="Enter" || event.code=="NumpadEnter"){
                event.preventDefault();
                postMessege().then(()=>{
                    console.log("Successfull!");
                }).catch(err=>{
                    if(err) throw err;
                    console.log(err);
                })
            }
        }
        document.addEventListener("keydown",enter_evnt_listener);

        //clean up
        return ()=>{
            document.removeEventListener("keydown",enter_evnt_listener);
        }
    },[currChat,sendMessege])


    const createConversation = (e)=>{
        const to_id = e.target.id;
        console.log("Creating conversation with " + to_id);

        //create a conversation
        const postOpt = {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                "Authorization":'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({user2_id:to_id})
        }

        fetch("/createConversation",postOpt)
        .then(response=>response.json())
        .then(({status,messege})=>{
            console.log(messege)

            //re-fetch the conversations from server and set the state
            if(status){
                getConversations().then(()=>{
                    getConversations()
                    .then(({conversations})=>{
                        // setConversations(conversations);
                        console.log("State set!");

                        localStorage.setItem("conversations",JSON.stringify(conversations));
                        setConversations(conversations);
                    })
                    .catch(err=>console.log(err));
                })
            }
        })
        .catch(err=>{if(err) throw err; console.log(err)});
    }

    return(
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for Conversations" 
                    value = {searchData}
                    onChange={handleSearchBar}
                    className="chatMenuInput" />
                    {console.log("Conv")}
                    {console.log(conversations)}
                    {
                        //returns an array of the result
                        conversations.map((c,i)=>{
                            return <div onClick={()=>{console.log("creating component");console.log(c);setChat(c)}}><Conversation conversation={c} isOnline={onlineFriends.has(c.other)} key={i}/></div>
                        })
                    }
                </div>

                <div className="chat-navbar">
                    <ul><a href="/main" className="exit"> {"Exit out of Chat?"}</a></ul>
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
                            console.log(JSON.stringify(m));
                            return m?<div ref={scrollTo}><Messege is_my_msg={m.authorID.toString() === my_id.toString()} data={m.data} key={i} timestamp={m.created_at}/></div>:<div></div>
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
            <div className="allFriendsList">
                <div className="allFriendsListWrapper">
                    <div className="friendslist-title">
                        Create a new conversation
                    </div>
                    {
                        allFriends?allFriends.map((f,i)=>{
                            return <div className="friend-add-pair">
                                <button className="add">+</button>
                                <div className="friend" onClick={(e)=>{return createConversation(e)}} key={i} id={f._id}> {f.username} </div>
                            </div>
                        }):null
                    }
                </div>
            </div>
        </div>
    )
};

export default Messenger;