/*eslint-disable */
import propsTypes from "prop-types";
import { XMarkIcon, GlobeAltIcon, EyeIcon, LockClosedIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import "./CreateCommunity.css";
import redditCare from "../../assets/reddit_care.png";
import { useState } from "react";
import Separator from "../sidebar/Nav-Icons/Separator";
import CommunityType from "./CommunityType";
import SwitchButton from "./SwitchButton";

const CreateCommunity = ({ setIsCommunityOpen }) => {

    const [communityName, setCommunityName] = useState("");
    const [selectedRadio, setSelectedRadio] = useState(""); // ids= ${type}-community-type q
    const [isMature, setIsMature] = useState(false);

    const handleRadioChange = (e) => {
        setSelectedRadio(e.target.id);
    }


    // const handleCreateCommunity = () => {

    // }

    return (
        <div className="community-modal flex flex-row items-center justify-center">
            <div className="overlay"></div>
            <div id="community-card" className="bg-reddit_greenyDark fixed z-10 text-white rounded-xl w-70% min-w-93 sm:w-99 md:w-125 h-160 md:h-150 px-3 py-2">
                <div className="card-header flex flex-row justify-center sm:justify-between"  >
                    <span className="flex flex-col sm:flex-row justify-center sm:content-center">
                        <img src={redditCare} alt="redditCare" className="h-12 w-12  mx-auto" />
                        <span className="flex items-center text-2xl xs:text-2xl font-semibold pt-1 ml-3 mb-1 sm:mb-0">Create a Community</span>
                    </span>
                    <button onClick={() => { setIsCommunityOpen(false) }} className="h-8 w-8 rounded-full mt-2 bg-reddit_search  hover:bg-reddit_search_light"> <XMarkIcon className="h-6 w-6 ml-1 text-gray-50" /> </button>
                </div>
                <div id="card-content" className="flex flex-col">
                    <p className="mb-3 text-sm text-gray-400 hidden sm:block">Build and grow a community about something you care about. We will help you set things up.</p>
                    <input type="text"
                        id="community-name"
                        className="bg-reddit_search h-13 px-3 rounded-3xl hover:bg-reddit_search_light"
                        placeholder="Name"
                        value={communityName}
                        onChange={(e) => setCommunityName(e.target.value)}
                        maxLength="21"
                        required
                    />
                    <div className="flex flex-col">
                        <p className="text-sm mt-4 mb-2"><strong>Type</strong></p>

                        <CommunityType type="Public" typeDescription="Anyone can view, post, and comment to this community" handleRadioChange={handleRadioChange} >
                            <GlobeAltIcon className="h-7 w-7 mr-3 text-gray-50" />
                        </ CommunityType >
                        <CommunityType type="Restricted" typeDescription="Anyone can view, post, and comment to this community" handleRadioChange={handleRadioChange} >
                            <EyeIcon className="h-7 w-7 mr-3 text-gray-50" />
                        </ CommunityType >
                        <CommunityType type="Private" typeDescription="Anyone can view, post, and comment to this community" handleRadioChange={handleRadioChange} >
                            <LockClosedIcon className="h-7 w-7 mr-3 text-gray-50" />
                        </ CommunityType >

                    </div>
                    <div className="mt-3 mb-3">
                        <Separator />
                    </div>

                    <div className="commuity-type flex flex-row px-3 py-3 items-center justify-between hover:bg-reddit_search rounded-xl">
                        <div className="flex flex-row">
                            < ShieldExclamationIcon className="h-7 w-7 mr-3 text-gray-50" />
                            <span className="flex flex-col justify-center">
                                <p className="text-sm">Mature (+18) </p>
                                <p className="text-xs">Must be over 18 to view and contribute  </p>
                            </span>
                        </div>
                        <div id="ismature-switch-btn">
                            <SwitchButton isSwtched={isMature} setIsSwitched={setIsMature} />
                        </div>
                    </div>



                    <div className="flex justify-end">
                        <button id="cancel-create-community" onClick={() => { setIsCommunityOpen(false) }} className="bg-reddit_search hover:bg-reddit_search_light mx-2 my-3 px-3 py-3 h-10 rounded-full flex items-center">Cancel</button>

                        <button id="name-create-community" className={`my-3 px-3 py-3 h-10 rounded-full flex items-center ${communityName.length === 0 ? `bg-reddit_search hover:bg-reddit_search_light opacity-60` : `bg-reddit_blue hover:bg-reddit_light_blue`}`} disabled={communityName.length === 0}>{communityName.length === 0 ? "Create your community" : `r/${communityName}`}</button>
                    </div>
                </div>
            </div>

        </div >
    );
}

CreateCommunity.propTypes = {
    setIsOpen: propsTypes.func
}

export default CreateCommunity;