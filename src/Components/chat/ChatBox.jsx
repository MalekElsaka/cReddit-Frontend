import { useState } from "react";
import Separator from "../sidebar/Nav-Icons/Separator";
import { Cog6ToothIcon, CameraIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import InputEmoji from "react-input-emoji"
import Message from "./Message";
const ChatBox = () => {
    const [isOpenSetting, setIsOpenSetting] = useState(false);
    const [textMessage, setTextMessage] = useState("");
    return (

        <div className="flex  flex-col w-full h-full">
            {/* Chatbox Head  */}
            <div className="flex flex-row justify-between items-center w-full py-2 px-3">
                <p className="text-white font-bold text-lg "> Samir Name </p>
                <div id="chat-setting" data-testid="chat-setting" className="flex flex-row justify-center items-center w-9 h-9 rounded-full hover:bg-reddit_hover cursor-pointer"
                    onClick={() => { setIsOpenSetting(prev => !prev) }} >
                    <Cog6ToothIcon className="h-6 w-6 text-gray-500 " />
                </div>

            </div>

            <Separator />

            {/* ChatBox chat imgs */}
            <div className="user-info w-full flex flex-col flex-grow items-center justify-center gap-2 min-h-[250px]">
                <img src="https://random.imagecdn.app/500/150" className="h-12 w-12 rounded-full" />
                <p className="text-gray-500 text-lg font-bold">samir samir </p>
            </div>
            <Separator />

            <Message Message="Hello" isFirstMessage={true} />
            <Message Message="can you get me a new piece of shit" isFirstMessage={false} />
            <Message Message="Yes, I can eat shit" isFirstMessage={false} />
            <Message Message="can I fix him" isFirstMessage={true} />
            <Message Message="I need to get married" isFirstMessage={false} />
            <Message Message="Hello" isFirstMessage={false} />


            <div className="flex flex-row p-1 justify-center items-center">

                <CameraIcon className="h-7 w-7 ml-1 text-gray-500 cursor-pointer" />

                <InputEmoji placeholder="send message"
                    type="text"
                    onChange={(e) => { setTextMessage(e) }}
                    value={textMessage}
                    borderColor="transparent"
                    background="#1A282C"
                    placeholderColor="#415054"
                    color="#ffff"

                />
                <PaperAirplaneIcon className="h-7 w-7 text-gray-500 cursor-pointer" />

            </ div>



        </div>
    );
}

export default ChatBox;