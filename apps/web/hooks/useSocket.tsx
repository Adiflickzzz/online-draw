import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket] = useState<WebSocket>()

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDU2OTU0Mi0yMWY2LTQ5YzktYWQ4Yy03MDAxOWVmNmVjNDYiLCJpYXQiOjE3NDIyMjM0MjR9.WRNcJAmIJUg3l7NsduA942gi4J6WVgfTrbHbDX9WiWM`)
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws)
        }
    },[])

    return{
        socket,
        loading
    }

}