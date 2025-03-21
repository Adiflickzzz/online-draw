import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config'
import { prismaClient } from "@repo/db/client"

const PORT = 8080;
const wss = new WebSocketServer({port:8080})

interface Users {
    ws:WebSocket,
    rooms:string[],
    userId:string
}

const users : Users[] = []

function checkUser(token:string): string | null {
    try{

        const decoded = jwt.verify(token,JWT_SECRET!);
        
        if(typeof decoded == "string"){
            return null
    }
    
    if(!decoded || !(decoded as JwtPayload).userId){
        return null
    }
    
    return decoded.userId;
    } catch(e){
        throw e
    }

}

wss.on('connection',function connection(ws,request){
    const url = request.url;

    if(!url){
        return
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || ""
    const userId = checkUser(token);

    if(userId == null){
        ws.close()
        return
    }

    users.push({
        userId,
        rooms:[],
        ws
    })

    ws.on('message',async function message(data){
        const parsedData = JSON.parse(data as unknown as string)

        //Todo check the db is the roomid exists & chck it the user has the permission to join
        if(parsedData.type == "join_room"){
            const user = users.find(x=>x.ws === ws);
            user?.rooms.push(parsedData.roomId)
        }

        if(parsedData.type == "leave_room"){
            const user = users.find(x=>x.ws === ws);

            if(!user){
                return;
            }

            user.rooms = user?.rooms.filter(x=> x === parsedData.room)
        }

        if(parsedData.type == "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message

            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId
                    }))
                }
            })

            await prismaClient.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            })
        }
    })

})

console.log('ws server running on port :',PORT)