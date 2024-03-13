/*eslint-disable*/
import "./Nav-Icons.css";
import { PlusIcon } from "@heroicons/react/24/solid"
// import { useState } from "react";
// import CreateCommunity from "../../createCommunity/CreateCommunity";
const CreateCommunityIcon = ({ setIsCommunityOpen }) => {

    return (
        <>
            <div
                className="h-10 w-full SideIcon-Container text-sm font-light items-center flex flex-row my-2 relative justify-start content-center rounded-lg px-4 py-2"
                onClick={() => setIsCommunityOpen(true)}
            >
                <span className="items-center">
                    <PlusIcon className="h-6 w-6 mr-2 text-gray-50" />
                </span>
                <span className="text-gray-50 ml-1">Create a community</span>

            </div>

        </>

    );
}
// CreateCommunityIcon.PropTypes = {
//     setIsCommunityOpen: PropTypes.func.isRequired
// }

export default CreateCommunityIcon;