const { Socket } = require("socket.io");

const io = require("socket.io")(8900,{
	cors:{
		origin: "http://localhost:3000"
	}
});

//hashset that stores the user_id and sockid mapping as socketid is regernerated at client side. We can identify all the active users using this.
let userid_sockid = new Map();
let sockid_userid = new Map();

const addUser = (user_id,sock_id)=>{
	userid_sockid.set(user_id,sock_id);
	sockid_userid.set(sock_id,user_id);
	console.log(userid_sockid);
}

io.on("connection",(client_sock)=>{
	console.log("a user connected!!");

	/* client_sock is the connection of the server with the client */
	client_sock.emit("onboardingEvent","[server] Connected to socket server on 8900!");

	//store the socketid of the user
	client_sock.on("addUser",(user_id)=>{
		addUser(user_id,client_sock.id);

		//update all other sockets about arrival of new device
		Array.from(userid_sockid.values()).forEach(sid => {
			io.to(sid).emit("returnOnlineFriends",{online_friends:Array.from(userid_sockid.keys())})
		});
	});

	//return all users online 
	client_sock.on("getOnlineFriends",()=>{
		console.log("emititing to:"+client_sock.id);
		console.log(Array.from(userid_sockid.keys()));

		io.to(client_sock.id).emit("returnOnlineFriends",{online_friends:Array.from(userid_sockid.keys())})
	})


	//when socket is disconnected
	client_sock.on("disconnect",(reason)=>{
		console.log("removed user "+sockid_userid.get(client_sock.id));
		//delete from both the dictionaries
		userid_sockid.delete(sockid_userid.get(client_sock.id));
		sockid_userid.delete(client_sock.id);

		console.log("Remaining users: ",userid_sockid)

		//notify others about leaving user
		Array.from(userid_sockid.values()).forEach(sid => {
			console.log("updating "+sid);
			io.to(sid).emit("returnOnlineFriends",{online_friends:Array.from(userid_sockid.keys())})
		});
	})
});

