import "./Messenger.css";
import Conversation from "./Conversation";
import React from 'react';
import Messege from "./Messege";

const Messenger = (props)=>{
    return(
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
                    <Conversation />
                    <Conversation />
                    <Conversation />
                    <Conversation />
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