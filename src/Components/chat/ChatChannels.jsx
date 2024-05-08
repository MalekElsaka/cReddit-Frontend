import { useContext, useEffect, useState } from "react";
import Channel from "./Channel";
import { getRequest } from "@/services/Requests";
import { baseUrl } from "@/constants";
import { ChatContext } from "@/context/ChatContext";
import Loading from "../Loading/Loading";

const ChatChannels = () => {
  const [page, setPage] = useState(1);
  const { rooms, setRooms, reRenderSide } = useContext(ChatContext);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  useEffect(() => {
    setPage(1);

    const getChatChannels = async () => {
      setIsLoadingRooms(true);
      const response = await getRequest(`${baseUrl}/chat?page=${page}&limit=30`);
      if (response.status === 200) {
        setRooms(response.data);
        setIsLoadingRooms(false);
      } else {
        console.log(response.data.message);
      }

    }
    getChatChannels();
    console.log('reRenderSide', reRenderSide);
  }, [reRenderSide])


  return (isLoadingRooms && page === 1 ? <Loading /> :


    <div className="flex flex-col border-r gap-1 h-200  pb-51 border-gray-800 overflow-y-auto">
      {rooms && rooms.map((room, index) => (
        <Channel key={index} roomInfo={room} index={index} />
      ))}
    </div>

  );
}

export default ChatChannels;