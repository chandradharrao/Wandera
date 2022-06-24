import './Conversation.css';
import React, { useEffect,useState } from 'react';

const Conversation = ({conversation})=>{
    const isOnline = false;
    const [otherName,setOtherName] = useState('');

    const getName = async (otherId)=>{
        const res = await fetch("/name?otherid="+otherId);
        const data = await res.json();
        console.log(data.name);
        return data.name;
    }

    useEffect(()=>{
        console.log("USe effect of conv.js");
        let other = conversation.other;
        if(other){
            getName(conversation.other.toString())
            .then(name=>{
                setOtherName(name);
                console.log("Set name!");
            })
            .catch(err=>console.log(err));
        }
        else{
            setOtherName("Me");
        }

        //clean callback called by useEffect
        return ()=>{
            setOtherName('')
        }
    },[])
    
    return(
        <div className="conversation">
            <img 
            className="conversationImg"
            src = "https://picsum.photos/id/1/200/300"
            ></img>

        <div className="conversationRight"></div>
            <div className="conversationName">{otherName}</div>
            <div className={isOnline?"status online":"status offline"}>{isOnline?"Online":"Offline"}</div>
        </div>
    )
};

export default Conversation;
