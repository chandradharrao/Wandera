import './Conversation.css';
import React, { useEffect,useState } from 'react';

const Conversation = ({conversation,isOnline})=>{

    return(
        <div className="conversation">
            <img 
            className="conversationImg"
            src = "https://picsum.photos/id/1/200/300"
            ></img>

        <div className="conversationRight"></div>
            <div className="conversationName">{conversation.otherName}</div>
            {console.log("Conversations to load!!")}
            {console.log(conversation)}
            <div className={isOnline||conversation.otherName=="Me"?"status online":"status offline"}>{isOnline||conversation.otherName=="Me"?"Online":"Offline"}</div>
        </div>
    )
};

export default Conversation;
