const { Socket } = require("socket.io");

const io = require("socket.io")(8900,{
	cors:{
		origin: "http://localhost:3000"
	}
});

//hashset that stores the user_id and sockid mapping as socketid is regernerated at client side. We can identify all the active users using this.
let userid_sockid = new Map();

const addUser = (user_id,sock_id)=>{
	userid_sockid.set(user_id,sock_id);
	console.log(userid_sockid);
}

//filter out friends who are online currently
const fetch_online_friends = (all_friends)=>{
	console.log("All friends",JSON.stringify(all_friends));

	//return <friend_id:isOnline> of online friends
	const online_friends = [];
	all_friends.forEach(friend => {
		//ignore null values
		if(friend){
			online_friends.push({[friend]:userid_sockid.has(friend)})
		}
	});
	console.log(online_friends)

	return  online_friends;
}

io.on("connection",(client_sock)=>{
	console.log("a user connected!!");

	/* client_sock is the connection of the server with the client */
	client_sock.emit("onboardingEvent","[server] Connected to socket server on 8900!");

	//store the socketid of the user
	client_sock.on("addUser",(user_id)=>{
		addUser(user_id,client_sock.id);
	});

	//return all
	client_sock.on("getOnlineFriends",({all_friends})=>{
		console.log("emititing to:"+client_sock);
		io.to(client_sock.id).emit("returnOnlineFriends",{online_friends:fetch_online_friends(all_friends)})
	})


	//when socket is disconnected
	client_sock.on("disconnect",(reason)=>{
		console.log("removed user "+userid_sockid);
		userid_sockid.delete(client_sock.id);
	})
});

