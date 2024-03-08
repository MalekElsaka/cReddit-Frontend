import { useState } from "react";

import propsTypes from "prop-types";

EmptyStart.propTypes = {
    color: propsTypes.string
}

function EmptyStart({ color }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke={color}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="{2}"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
        </svg>



    );
}

const CommunityIcon = ({ text }) => {

    const [isHover, setIsHover] = useState(false)
    return (
        <div className="flex flex-row justify-between px-4 py-2 SideIcon-Container">
            <div className="flex flex-row justify-start">
                <img src="https://xsgames.co/randomusers/avatar.php?g=pixel " className="h-6 w-6 rounded-xl" alt="randomImgs" />
                <span className="text-gray-300 text-sm font-light ml-3">{text}</span>
            </div>
            <span
                className="h-5 w-5 mr-2"
                role="button"
                onMouseEnter={() => { setIsHover(!isHover) }}
                onMouseLeave={() => { setIsHover(!isHover) }}
            > <EmptyStart color={"white"} /> </span>

        </div>
    );
}
CommunityIcon.propTypes = {
    text: propsTypes.string

}
export default CommunityIcon;