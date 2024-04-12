
import Share from './Share';
import CommentIcon from './CommentIcon';
import Vote from './Vote';
import { useState, useEffect, useRef } from "react";
import { getRequest, patchRequest } from '@/services/Requests';
import { BookmarkIcon, EllipsisHorizontalIcon, EyeSlashIcon, FlagIcon, ExclamationTriangleIcon, ArrowLeftIcon, EyeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { baseUrl } from "../../constants";
// import {useHistory} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from "moment";
import HiddenPost from './HiddenPost';
import {Save} from './comment/CommentUtils';

const Post = ({
    id,
    postId,
    title,
    username,
    communityName,
    content,
    createdAt,
    commentCount,
    netVote,
    isUpvoted,
    isDownvoted,
    type,
    profilePicture,
    isNSFW,
    isSpoiler,
    isJoined,
    pollOptions,
    expirationDate,
    isHidden,
    isSaved,
    isSinglePostSelected
}) => {
    const menuRefDots = useRef();
    const [isOpenDots, setIsOpenDots] = useState(false);
    const [hoverJoin, setHoverJoin] = useState(false);
    const [editedPollOptions, setEditedPollOptions] = useState(pollOptions);
    const [enableVote, setEnableVote] = useState(false);
    const uploadedFrom = moment(createdAt).fromNow();
    const durationRemaining = moment(expirationDate).fromNow();
    const [Blured, setBlured] = useState(isSpoiler || isNSFW);
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const [hasVoted, setHasVoted] = useState(pollOptions?.find(option => option.isVoted === true) ? true : false);
    const [hasExpired, setHasExpired] = useState(moment(expirationDate).isBefore(moment()));
    const [currentIsHidden, setCurrentIsHidden] = useState(isHidden);
    const [isHiddenMsg, setIsHiddenMsg] = useState("");
    const [saved, setSaved] = useState(isSaved);


    const navigate = useNavigate();


    async function handleClickSave() {
        setSaved((prev) => !prev);
        if (!await Save(id, saved)) {
        setSaved((prev) => !prev);
        }
      }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num;
        }
    }

    useEffect(() => {
        let closeDropdown = (e) => {
            if (menuRefDots.current && !menuRefDots.current.contains(e.target)) {
                setIsOpenDots(false);
            }
        };
        document.addEventListener("click", closeDropdown);

        const scrollingElement = document.getElementById("mainfeed");
        const handleScroll = () => {
            const scrollThreshold = 30;
            if (!menuRefDots.current) {
                return;
            }
            const rect = menuRefDots.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < scrollThreshold || rect.bottom > viewportHeight - scrollThreshold) {
                setIsOpenDots(false);
            }
        };

        if (scrollingElement) {
            scrollingElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            document.removeEventListener("click", closeDropdown);

            if (scrollingElement) {
                scrollingElement.removeEventListener("scroll", handleScroll);
            }
        };
    });

    const getTotalVotes = (pollOptions) => {
        return pollOptions.reduce((total, option) => total + option.votes, 0);
    }

    const getMaxVotes = (pollOptions) => {
        let maxVotes = 0;
        for (let option of pollOptions) {
            if (option.votes > maxVotes) {
                maxVotes = option.votes;
            }
        }
        return maxVotes;
    };
    const getVoteWidth = (votes) => {
        let voteWidth = votes / getMaxVotes(editedPollOptions) * 100 + "%";
        return voteWidth;
    };

    const handleOptionChange = (index) => {
        const newPollOptions = editedPollOptions.map((option, i) => {
            if (i === index) {
                return {
                    ...option,
                    isVoted: true,
                    votes: option.votes + 1,
                };
            } else {
                return {
                    ...option,
                    isVoted: false,
                };
            }
        });

        setEditedPollOptions(newPollOptions);
        setIsOptionSelected(true);
    };

    const handleVote = async () => {
        if (!isOptionSelected) {
            return;
        }
        setHasVoted(true);
        const votedOption = editedPollOptions.find(option => option.isVoted === true);
        const votedOptionText = votedOption ? votedOption.text : null;
        const response = await patchRequest(`${baseUrl}/post/${id}/vote-poll`, { pollOption: votedOptionText });
        if (response.status == 200 || response.status == 201) {

        }
        else {
            setEditedPollOptions(pollOptions);
            setHasVoted(false);
        }
    };

    const joinBtnStyle = {
        backgroundColor: hoverJoin ? '#196FF4' : '#0045AC',
    };

    const handleHidePost = async () => {
        setCurrentIsHidden(prev => !prev);
        setIsOpenDots(false);
        const response = await patchRequest(`${baseUrl}/post/${id}/hidden`, { isHidden: !currentIsHidden });
        if (response.status == 200 || response.status == 201) {
            setIsHiddenMsg(response.data.message);
        }
        else {
            console.log("post couldn't be hidden");
            setIsHiddenMsg(response.data.message);
            setCurrentIsHidden(prev => !prev);
        }
    }
    return (
        currentIsHidden ? <HiddenPost id={id} handleHidePost={handleHidePost} /> :
            <div
                id={"mainfeed_" + id + "_full"}
                className={`flex flex-col bg-reddit_greenyDark ${isSinglePostSelected ? "" : 'hover:bg-reddit_hover'} ${isOpenDots ? "bg-reddit_hover" : ""
                    } px-3 pt-2.5 mt-1 pb-1 rounded-2xl w-full h-fit`}
            >
                <div className="flex flex-row items-center w-full h-6 ">
                    <div
                        id={"mainfeed_" + id + "_community"}
                        href=""
                        className="flex items-center w-fit"
                    >
                        {isSinglePostSelected &&
                            <div onClick={() => navigate('/')} className='flex flex-row justify-center items-center hover:bg-reddit_search_light min-w-8 w-8 h-8 rounded-full bg-reddit_search cursor-pointer mr-2'>
                                <ArrowLeftIcon className='text-white w-6 h-6' />
                            </div>}
                        <img src={profilePicture} alt="Logo" className={`${isSinglePostSelected ? 'w-8 h-8' : 'w-6 h-6'} rounded-full `} />
                        <p className="text-gray-300 font-semibold text-xs ml-2 hover:text-cyan-600">
                            {communityName && communityName.trim() != "" ? `r/${communityName}` : `u/${username}`}
                        </p>
                    </div>

                    <div className=' flex flex-row w-[20%] xs:w-[40%] items-center '>
                        <p className="text-gray-400 font-bold text-xs ml-2 mb-1.5"></p>
                        <p className="text-gray-400 w-70% truncate font-extralight text-xs ml-1.5">
                            {uploadedFrom}
                        </p>
                    </div>

                    <div ref={menuRefDots} className="relative ml-auto flex items-center flex-row ">
                        {!isJoined && <div onMouseEnter={() => setHoverJoin(true)} onMouseLeave={() => setHoverJoin(false)} className='w-[50px] h-[25px]  cursor-pointer flex flex-row justify-center items-center bg-blue-600 -mt-[4px] mr-1 rounded-full' style={joinBtnStyle}>
                            <h1 className='text-[12px] font-medium text-white'>Join</h1>
                        </div>}
                        <div
                            id={"mainfeed_" + id + "_menu"}
                            className="h-7 w-7 ml-auto text-white rounded-full flex justify-center cursor-pointer items-center hover:bg-reddit_search_light"
                        >
                            <EllipsisHorizontalIcon
                                onClick={(e) => {

                                    setIsOpenDots((prev) => !prev);
                                }}
                                className="h-6 w-6 outline-none"
                            />
                        </div>

                        {isOpenDots && (
                            <div className="z-1 w-30 h-37 bg-reddit_lightGreen absolute -ml-[24px] mt-47 text-white text-sm py-2 rounded-lg font-extralight flex flex-col">
                                <div onClick={handleClickSave}
                                    id={"mainfeed_" + id + "_menu_save"}
                                    className="w-full pl-6 hover:bg-reddit_hover h-12 flex items-center cursor-pointer"
                                >
                                    {!saved ? <BookmarkIcon className="h-4.5 w-5 text-white " />
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-5 h-4.5">
                                            <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                                        </svg>
                                    }
                                    <p className="ml-2 no-select">{saved ? "Unsave" : "Save"}</p>
                                </div>
                                <div onClick={handleHidePost}
                                    id={"mainfeed_" + id + "_menu_hide"}
                                    className="w-full pl-6 hover:bg-reddit_hover h-12 flex rounded-b-lg items-center cursor-pointer"
                                >
                                    {currentIsHidden ? <EyeIcon className="h-4.5 w-5 text-white" /> : <EyeSlashIcon className="h-4.5 w-5 text-white" />}
                                    <p className="ml-2 no-select">{currentIsHidden ? "unHide" : "Hide"}</p>
                                </div>

                                <div
                                    id={"mainfeed_" + id + "_menu_report"}
                                    className="w-full pl-6 hover:bg-reddit_hover h-12 flex rounded-b-lg items-center cursor-pointer"
                                >
                                    <FlagIcon className="h-4.5 w-5 text-white " />
                                    {/* Todo change the icon, make the buttons change color when clicked, and when any click anyhwere else, close the dropdown */}
                                    <p className="ml-2 no-select">Report</p>
                                </div>
                            </div>

                        )}
                    </div>
                </div>

                <div className="mt-1 w-full h-fit flex flex-col">
                    {(isSpoiler || isNSFW) && <div className="text-white items-center mt-1.5 flex-row flex font-medium text-lg">

                        {isSpoiler && <div onClick={(e) => { setBlured(true) }} className='flex cursor-pointer flex-row items-center'>
                            <ExclamationTriangleIcon className='h-[22px]  text-reddit_navbar fill-red-600 w-[23px]' />
                            <h1 className='text-[12.5px] text-red-600 mr-3 ml-[1px]'>SPOILER</h1>
                        </div>}
                        {isNSFW && <div onClick={(e) => { setBlured(true) }} className='cursor-pointer flex flex-row items-center'>
                            <svg rpl="" className="inline-block" fill="#E00296" height="19" icon-name="nsfw-fill" viewBox="0 0 20 20" width="19" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 10.967a1.593 1.593 0 0 0-1.363 0 1.2 1.2 0 0 0-.475.414 1.02 1.02 0 0 0-.173.576.967.967 0 0 0 .18.574c.122.172.29.307.482.393.21.095.438.143.668.14a1.51 1.51 0 0 0 .671-.146 1.2 1.2 0 0 0 .475-.4.985.985 0 0 0 .173-.569 1.024 1.024 0 0 0-.17-.57 1.2 1.2 0 0 0-.469-.412Z"></path><path d="M11.747 9.227c.177.095.374.143.574.14.2.003.396-.045.572-.14a1.057 1.057 0 0 0 .402-1.462.984.984 0 0 0-.406-.37 1.317 1.317 0 0 0-1.137 0 1 1 0 0 0-.557.902 1.047 1.047 0 0 0 .551.932l.001-.002Z"></path><path d="M18.636 6.73 13.27 1.363a4.634 4.634 0 0 0-6.542 0L1.364 6.73a4.627 4.627 0 0 0 0 6.542l5.365 5.365a4.633 4.633 0 0 0 6.542 0l5.366-5.365a4.634 4.634 0 0 0 0-6.542ZM8.204 14.5H6.288V8.277L4.648 9V7.23l2.988-1.367h.568V14.5Zm6.862-1.148c-.29.4-.683.714-1.136.912a4.11 4.11 0 0 1-3.24-.006 2.8 2.8 0 0 1-1.134-.918 2.172 2.172 0 0 1-.41-1.283c0-.42.12-.83.345-1.184a2.6 2.6 0 0 1 .944-.879 2.488 2.488 0 0 1-.636-.832c-.152-.32-.23-.67-.229-1.025a2.117 2.117 0 0 1 .378-1.248c.256-.362.604-.65 1.008-.832.43-.198.9-.298 1.374-.293.474-.004.942.099 1.371.3.403.182.749.47 1 .834.249.368.378.804.37 1.248a2.371 2.371 0 0 1-.868 1.851c.383.21.708.51.944.877a2.24 2.24 0 0 1-.074 2.481l-.007-.003Z"></path>
                            </svg>
                            <h1 className='text-sm ml-1 text-[#E00296]'>NSFW</h1>
                        </div>}

                    </div>}
                    <div id={"mainfeed_" + id + "_title"} className="text-white mt-1.5 font-medium text-lg">
                        <h1>{title}</h1>
                    </div>

                    <div className="relative w-full h-full">

                        {(Blured) && <div onClick={(e) => { setBlured(false) }} className={`w-[94px] z-10 left-[calc(50%-47px)] top-[calc(50%-10px)]  h-[30px] text-[13px] font-semibold flex-row flex items-center justify-center cursor-pointer absolute text-white rounded-3xl bg-[#090E0FB9] hover:bg-black `} >
                            <EyeIcon className='w-5 mr-1.5 h-5' />
                            View
                        </div>}

                        {type != "Images & Video" && <div id={"mainfeed_" + id + "_content"} onClick={(e) => { setBlured(false) }} className={`text-gray-400  text-sm mt-1.5  ${Blured ? 'filter blur-[10px]' : ''}`}>
                            <>
                                {type != "Link" ? (<p style={{ wordBreak: 'break-all' }}>{content}</p>) :
                                    (<a href={content} className=' underline cursor-pointer text-blue-600 hover:text-blue-500' style={{ wordBreak: 'break-all' }}>{content}</a>)}
                            </>
                        </div>}

                        {
                            type == "Images & Video" &&
                            <div
                                id={"mainfeed_" + id + "_" + type}
                                className="w-full h-full mt-2">
                                <div className={`relative flex-row rounded-lg py-3 flex justify-center bg-black ${Blured ? 'filter blur-[10px]' : ''}`}>
                                    {
                                        content.endsWith('.mp4') ?
                                            <video src={content} alt="Post" className={`rounded-2xl`} controls /> :
                                            <img src={content} alt="Post" className={`rounded-2xl`} />
                                    }

                                    {Blured && <div onClick={(e) => { setBlured(false) }} className="absolute inset-0 bg-black opacity-60 rounded-2xl"></div>}
                                </div>
                            </div>
                        }

                        {
                            type == "Poll" &&
                            <div
                                id={"mainfeed_" + id + "_" + type}
                                className="w-full mt-2">
                                <div className={`relative h-fit w-full ${Blured ? 'filter blur-[10px]' : ''}`}>
                                    <div className='w-full rounded-xl bg-transparent border-[0.5px] border-gray-600 h-fit px-[14px] pb-2 pt-1 flex flex-col'>
                                        <div className='w-full h-9 pt-1 items-center border-b-[0.5px] border-gray-600 text-[11px] flex flex-row '>
                                            <h1 className='mr-1 text-gray-300 font-light'>{hasExpired ? "Closed" : "Open"} .</h1>
                                            <h1 className='text-gray-300 font-light'>{!hasVoted ? formatNumber(getTotalVotes(pollOptions)) : formatNumber(getTotalVotes(editedPollOptions))} total votes</h1>
                                        </div>
                                        <div id={"mainfeed_" + id + "_polloptions"} className='w-full flex flex-col h-fit min-h-13 text-[11px] px-2 space-y-3.5 mt-3'>
                                            {editedPollOptions.map((option, index) => (

                                                <div key={index} className='flex items-center flex-row w-full'>
                                                    {
                                                        !hasVoted && !hasExpired ? (
                                                            <div className='w-fit hit flex-row'>
                                                                <input
                                                                    type="radio"
                                                                    name={id + "PollOption" + index}
                                                                    className="radio bg-inherit outline-gray-200 focus:outline-none"
                                                                    checked={option.isVoted}
                                                                    onChange={() => handleOptionChange(index)}
                                                                />
                                                                <label className='text-gray-200 text-[14px] whitespace-nowrap font-light ml-2'>{option.text}</label>
                                                            </div>
                                                        ) : (
                                                            <div className='w-7/12'>
                                                                <div style={{ width: `${getVoteWidth(option.votes)}` }} className={` ${option.votes == getMaxVotes(editedPollOptions) ? 'bg-[#33464C]' : 'bg-reddit_search_light'}  items-center h-8 rounded-[5px] flex flex-row`}>
                                                                    <h1 className='text-gray-100 text-[14px] font-semibold ml-5 mr-4'>{option.votes}</h1>
                                                                    <label className='text-gray-200 text-[14px] whitespace-nowrap font-light ml-2'>{option.text}</label>
                                                                    {option.isVoted ? <CheckIcon className='w-[23px] min-w-[23px] min-h-[23px] h-[23px] ml-2 text-white' /> : null}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                            ))}
                                        </div>

                                        <div className='flex flex-row w-full mt-3 items-center'>
                                            {!hasVoted && !hasExpired && <div onClick={handleVote} className={`flex items-center justify-center w-12 h-8 rounded-full ${isOptionSelected ? 'bg-black cursor-pointer' : 'bg-[#1C1E20] cursor-not-allowed'} text-[13px] text-white`}>
                                                <h1>Vote</h1>
                                            </div>}
                                            {!hasExpired ? <h1 className='text-[11px] ml-2.5 font-light text-gray-300'>Closes {durationRemaining}</h1> : null}
                                        </div>
                                    </div>
                                    {Blured && <div onClick={(e) => { setBlured(false) }} className="absolute inset-0 bg-black opacity-60 rounded-2xl"></div>}
                                </div>

                            </div>
                        }
                    </div>
                </div>

                <div className="flex flex-row mt-1 items-center w-full h-13 space-x-2.5 no-select ">
                    <Vote
                        id={id}
                        netVotes={netVote}
                        isUpvoted={isUpvoted}
                        isDownvoted={isDownvoted}
                    />
                    <CommentIcon id={id} postId={postId} username={username} communityName={communityName} commentCount={commentCount} />
                    <Share id={id} />
                </div>
            </div>

    );
};

export default Post;