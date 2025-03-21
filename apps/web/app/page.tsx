"use client"
import Image, { type ImageProps } from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId,setRoomId] = useState("");
  const router = useRouter();

  return (
   <div>
    <input type="text" value={roomId} onChange={e=>setRoomId(e.target.value)} placeholder="Room id" />
    <button type="submit" onClick={()=>router.push(`/room/${roomId}`)}>Join room</button>
   </div>
  );
}
