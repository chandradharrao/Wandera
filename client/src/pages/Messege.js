import "./Messege.css";
import React from "react";

const Messege = ({is_my_msg,data,timestamp})=>{
    return(
        <div className={is_my_msg?"message my_msg":"message"}>

            <div className="messageTop">
                <img
                    className={is_my_msg?"messageImg my_msg":"messageImg"}
                    src="https://picsum.photos/id/1/200/300"
                ></img>

                <p className={is_my_msg?"messageText my_msg":"messageText"}>{data}</p>
            </div>

        <div className="messageTime">{timestamp}</div>
    </div>
    )
};

export default Messege;