import './Conversation.css';
import React from 'react';

const Conversation = ({isOnline})=>{
    return(
        <div className='conversation'>
            <img 
            className="conversationImg"
            src = "https://picsum.photos/id/1/200/300"
            ></img>

        <div className="conversationRight"></div>
            <div className="conversationName">Test</div>
            <div className={isOnline?"status online":"status offline"}>{isOnline?"Online":"Offline"}</div>
        </div>
    )
};

export default Conversation;
