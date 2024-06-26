import Share from "./Share";
import CommentIcon from "./CommentIcon";
import Vote from "./Vote";
import * as marked from 'marked';
import { useState, useEffect, useRef, useContext } from "react";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "@/services/Requests";
import {
  BookmarkIcon,
  EllipsisHorizontalIcon,
  EyeSlashIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  EyeIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { baseUrl } from "../../constants";
import { useNavigate } from 'react-router-dom';


import moment from "moment";
import HiddenPost from "./HiddenPost";
import { Save } from './comment/CommentUtils';
import { UserContext } from '@/context/UserContext';
import ReactMarkdown from 'react-markdown';
import Tiptap from "../tiptap/Tiptap";
import { ReportModal } from "./ReportModal";





/**
 * Post component for displaying a post.
 * @component
 * @param {Object} props - The properties passed to the component.
 * @returns {JSX.Element} - The rendered Post component.
 */
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
  isSinglePostSelected,
  setPosts,
  showAlertForTime,
  lastPostRef
}) => {
  const menuRefDots = useRef();
  const shareMenuRef = useRef();
  const [isOpenDots, setIsOpenDots] = useState(false);
  const [hoverJoin, setHoverJoin] = useState(false);
  const [editedPollOptions, setEditedPollOptions] = useState(pollOptions);
  const uploadedFrom = moment(createdAt).fromNow();
  const durationRemaining = moment(expirationDate).fromNow();
  const [Blured, setBlured] = useState(isSpoiler || isNSFW);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [editPostContent, setEditPostContent] = useState(type == "Post" ? content : "");
  const [commentsNumber, setCommentsNumber] = useState(commentCount);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const [communityRules, setCommunityRules] = useState([]);
  const [hasVoted, setHasVoted] = useState(
    pollOptions?.find((option) => option.isVoted === true) ? true : false
  );
  const [hasExpired, setHasExpired] = useState(
    moment(expirationDate).isBefore(moment())
  );
  const [currentIsHidden, setCurrentIsHidden] = useState(isHidden);
  const [currentIsDeleted, setCurrentIsDeleted] = useState(false);
  const [isHiddenMsg, setIsHiddenMsg] = useState("");
  const [EditedSpoiler, setEditedSpoiler] = useState(isSpoiler);
  const [EditedNSFW, setEditedNSFW] = useState(isNSFW);
  const [saved, setSaved] = useState(isSaved);
  const [isSubbredditJoined, setIsSubbredditJoined] = useState(isJoined);
  const [isShareMenuOpened, setIsShareMenuOpened] = useState(false);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const reportModalRef = useRef();

  useEffect(() => {
    setEditedPollOptions(pollOptions);
  }, [pollOptions]);

  useEffect(() => {
    setCommentsNumber(commentCount);
  }, [commentCount]);

  useEffect(() => {
    setEditPostContent(content);
  }, [content]);


  /**
   * Function to handle saving a post.
   *
   * @async
   * @function handleClickSave
   */
  async function handleClickSave() {
    setSaved((prev) => !prev);
    if (!(await Save(id, saved))) {
      setSaved((prev) => !prev);
    }
  }

  /**
   * Function to format a number to a more readable format.
   *
   * @function formatNumber
   * @param {number} num - The number to format.
   * @returns {string} The formatted number.
   */
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num;
    }
  }


  const getCommunityRules = async () => {
    const response = await getRequest(`${baseUrl}/subreddit/${communityName}/rules`);
    if (response.status === 200 || response.status === 201) {
      setCommunityRules(response.data);
    }
  }

  const submitCrossPost = async () => {
    const response = await postRequest(`${baseUrl}/post`, { type: "Cross Post", title: crossPostTitle, postId: id });
    if (response.status == 200 || response.status == 201) {
      setShareMode(false);
      navigate(`/u/${username}/comments/${response.data.postId}`);
    }
    else {
      showAlertForTime("error", response.data.message);
    }
  }



  const copyLink = (e) => {
    e.stopPropagation(); setIsShareMenuOpened(false);
    navigator.clipboard.writeText(communityName ? `creddit.tech/r/${communityName}/comments/${id}` : `creddit.tech/u/${username}/comments/${id}`).then(function () {
      showAlertForTime("success", "Link copied");

    }, function (err) {
      showAlertForTime("error", "Failed to copy link");
    });
  }


  useEffect(() => {
    if (!username && !communityName)
      setCurrentIsDeleted(true);

  }, []);


  useEffect(() => {
    if (!EditedSpoiler && !EditedNSFW)
      setBlured(false);

    if (EditedSpoiler || EditedNSFW)
      setBlured(true);

  }, [EditedNSFW, EditedSpoiler]);

  useEffect(() => {
    let closeDropdown = (e) => {
      if (menuRefDots.current && !menuRefDots.current.contains(e.target))
        setIsOpenDots(false);

      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target))
        setIsShareMenuOpened(false);

      if (reportModalRef.current && !reportModalRef.current.contains(e.target))
        setIsOpenReportModal(false);

    };
    document.addEventListener("click", closeDropdown);

    const scrollingElement = document.getElementById("homefeed");

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

      if (!shareMenuRef.current) {
        return;
      }
      const rectShare = shareMenuRef.current.getBoundingClientRect();
      if (rectShare.top < scrollThreshold || rectShare.bottom > viewportHeight - scrollThreshold) {
        setIsShareMenuOpened(false);
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

  /**
   * Function to get the total votes of a poll.
   *
   * @function getTotalVotes
   * @param {Array} pollOptions - The options of the poll.
   * @returns {number} The total votes.
   */

  const getTotalVotes = (pollOptions) => {
    return pollOptions.reduce((total, option) => total + option.votes, 0);
  };

  /**
   * Function to get the maximum votes of a poll.
   *
   * @function getMaxVotes
   * @param {Array} pollOptions - The options of the poll.
   * @returns {number} The maximum votes.
   */
  const getMaxVotes = (pollOptions) => {
    let maxVotes = 0;
    for (let option of pollOptions) {
      if (option.votes > maxVotes) {
        maxVotes = option.votes;
      }
    }
    return maxVotes;
  };

  /**
   * Function to get the vote width of a poll.
   *
   * @function getVoteWidth
   * @param {number} votes - The votes of the poll.
   * @returns {string} The vote width.
   */
  const getVoteWidth = (votes) => {
    let voteWidth = (votes / getMaxVotes(editedPollOptions)) * 100 + "%";
    return voteWidth;
  };

  /**
   * Function to handle the change of an option in a poll.
   *
   * @function handleOptionChange
   * @param {number} index - The index of the option.
   */
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

  /**
   * Function to handle voting in a poll.
   *
   * @async
   * @function handleVote
   */
  const handleVote = async (e) => {
    e.stopPropagation();
    if (!isOptionSelected) {
      return;
    }
    setHasVoted(true);
    const votedOption = editedPollOptions.find(
      (option) => option.isVoted === true
    );
    const votedOptionText = votedOption ? votedOption.text : null;
    const response = await patchRequest(`${baseUrl}/post/${id}/vote-poll`, {
      pollOption: votedOptionText,
    });
    if (response.status == 200 || response.status == 201) {
    } else {
      setEditedPollOptions(pollOptions);
      setHasVoted(false);
    }
  };


  const handleReportPost = (e) => {
    e.stopPropagation();
    setIsOpenDots(false);
    setIsOpenReportModal(true);
    getCommunityRules();
  };


  const markAsSpoiler = async () => {
    const response = await patchRequest(`${baseUrl}/post/${id}/mark-spoiler`, {
      isSpoiler: !EditedSpoiler
    });
    if (response.status == 200 || response.status == 201) {
      setEditedSpoiler(!EditedSpoiler);
      setPosts(prev => prev.map(post => post._id === id ? { ...post, isSpoiler: !EditedSpoiler } : post));
    } else {
      showAlertForTime("error", response.data.message);
    }
  }


  const markAsNSFW = async () => {
    const response = await patchRequest(`${baseUrl}/post/${id}/mark-nsfw`, {
      isNSFW: !EditedNSFW
    });
    if (response.status == 200 || response.status == 201) {
      setEditedNSFW(!EditedNSFW);
      setPosts(prev => prev.map(post => post._id === id ? { ...post, isNSFW: !EditedNSFW } : post));
    }
    else {
      showAlertForTime("error", response.data.message);
    }

  }



  const submitEditedPost = async () => {
    const response = await patchRequest(`${baseUrl}/post/${id}`, {
      newContent: editPostContent
    });
    if ((response.status == 200 || response.status == 201)) {
      setEditMode(false);
      setPosts(prev => prev.map(post => post._id === id ? { ...post, content: editPostContent } : post));
    } else {
      showAlertForTime("error", response.data.message);
    }
  }

  const joinBtnStyle = {
    backgroundColor: hoverJoin ? "#196FF4" : "#0045AC",
  };

  /**
   * Function to handle hiding a post.
   *
   * @async
   * @function handleHidePost
   */
  const handleHidePost = async () => {
    setCurrentIsHidden((prev) => !prev);
    setIsOpenDots(false);
    const response = await patchRequest(`${baseUrl}/post/${id}/hidden`, {
      isHidden: !currentIsHidden,
    });
    if (response.status == 200 || response.status == 201) {
      setIsHiddenMsg(response.data.message);
      setPosts(prev => prev.map(post => post._id === id ? { ...post, isHidden: !currentIsHidden } : post));
    } else {
      setIsHiddenMsg(response.data.message);
      setCurrentIsHidden((prev) => !prev);
    }
  };

  /**
   * Function to handle joining a subreddit.
   *
   * @async
   * @function handleJoinSubreddit
   */
  const handleJoinSubreddit = async () => {

    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.communityName === communityName) {

          return {
            ...post,
            isJoined: !post.isJoined,
          };
        }
        return post;
      });
    });

    let response = null;
    if (isSubbredditJoined) {
      response = await deleteRequest(`${baseUrl}/subreddit/${communityName}/join`);
    } else {
      response = await postRequest(`${baseUrl}/subreddit/${communityName}/join`
      );
    }
    if (!(response.status === 200 || response.status === 201)) {
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post.communityName === communityName) {
            return {
              ...post,
              isJoined: !post.isJoined,
            };
          }
          return post;
        });
      });
    }

  };

  useEffect(() => {
    setIsSubbredditJoined(isJoined);
  }, [isJoined])


  const enterEditMode = () => {
    setIsOpenDots(false);
    setShareMode(false);
    setEditMode(true);
  }




  const deletePost = async () => {
    setCurrentIsDeleted(true);
    setIsOpenDots(false);
    const response = await deleteRequest(`${baseUrl}/post/${id}`);
    if (!response.status == 200 && !response.status == 201) {
      showAlertForTime("error", response.data.message);
      setCurrentIsDeleted(false);
    }
    else {
      setPosts(prev => prev.filter(post => post._id !== id));
    }

  }

  return currentIsHidden ? (
    <HiddenPost id={id} handleHidePost={handleHidePost} />
  ) : currentIsDeleted ? <HiddenPost id={id} /> : (
    <div
      ref={lastPostRef}
      id={"mainfeed_" + id + "_full"}
      className={`flex flex-col ${shareMode ? 'pb-[11px]' : ''} bg-reddit_greenyDark ${isSinglePostSelected || editMode ? "" : "hover:bg-reddit_hover"} ${isOpenDots ? "bg-reddit_hover" : ""}  pl-1 pr-1 xs:px-3 pt-2.5 mt-1 rounded-2xl w-full h-fit`}>


      {shareMode &&
        <div className="flex flex-col justify-center">
          <div className="flex flex-row  items-center  w-full mb-[3px]">
            <img id="my_profile_img" onClick={() => navigate(`/my-user/${userInfo.username}`)} src={userInfo.profilePicture} alt="" className="w-7 cursor-pointer peer mr-2 h-7 rounded-full" />
            <h1 id="my_username" onClick={() => navigate(`/my-user/${userInfo.username}`)} className="text-white text-[13px] peer-hover:underline cursor-pointer hover:underline font-medium">u/{userInfo.username}</h1>
          </div>

          <div className="flex items-center h-fit flex-row w-[calc(100%-16px)] mx-auto  border-gray-400 rounded-lg ">
            <h1 className="min-w-fit text-white text-[14px] pl-[3px] ">Add your title :</h1>
            <textarea maxLength={300} className="h-[40px] flex flex-row items-center text-white text-[14px] tracking-wide outline-none bg-transparent focus:outline-none focus:ring-0 border-none focus:border-gray-500 resize-none w-full" name="" id="share_new_title"></textarea>
          </div>
        </div>

      }


      <div className={`flex flex-col ${shareMode ? 'px-[16px] mx-[6px] pt-[10px] bg-[#04090A] rounded-xl' : ''}`}>

        <div className="flex  flex-row items-center w-full h-6 ">
          <div
            id={"mainfeed_" + id + "_community"}
            href=""
            className="flex flex-row items-center w-fit"
          >
            {isSinglePostSelected && (

              <div onClick={() => navigate(-1)} className='flex flex-row justify-center items-center hover:bg-reddit_search_light min-w-8 w-8 h-8 rounded-full bg-reddit_search cursor-pointer mr-2'>
                <ArrowLeftIcon className="text-white w-6 h-6" />
              </div>
            )}

            <div className="flex flex-row cursor-pointer items-center"
              onClick={(e) => {
                navigate(communityName && communityName.trim() != "" ? `/r/${communityName}` : `/user/${username}`);
              }}>
              <img
                src={profilePicture}
                alt="Logo"
                className={`peer ${isSinglePostSelected ? "w-8 h-8" : "w-6 h-6"} rounded-full `}
              />


              <p className="text-gray-300 peer-hover:underline  font-semibold text-xs ml-2 hover:underline">
                {!communityName || communityName.trim() == "" || (location.pathname.includes("/r/") && !location.pathname.includes("/comments")) ? `u/${username}` : `r/${communityName}`}
              </p>
            </div>
          </div>

          <div className=" flex flex-row w-[40%] xs:w-[40%] items-center ">
            <p className="text-gray-400 font-bold text-xs ml-2 mb-1.5"></p>
            <p className="text-gray-400 w-70% truncate font-extralight text-xs ml-1.5">
              {uploadedFrom}
            </p>
          </div>

          <div ref={menuRefDots} className="relative ml-auto flex items-center flex-row ">
            {(communityName !== null) && !isSubbredditJoined && !location.pathname.includes("/r/") && !location.pathname.includes("/user/") && !location.pathname.includes("/my-user/") && <div id={`join` + id} onClick={handleJoinSubreddit} onMouseEnter={() => setHoverJoin(true)} onMouseLeave={() => setHoverJoin(false)} className='w-[50px] h-[25px]  cursor-pointer flex flex-row justify-center items-center bg-blue-600 -mt-[4px] mr-1 rounded-full' style={joinBtnStyle}>
              <h1 className='text-[12px] font-medium text-white'>Join</h1>
            </div>}
            {!shareMode && <div
              id={"mainfeed_" + id + "_menu"}
              className="h-7 w-7 ml-auto text-white rounded-full flex justify-center cursor-pointer items-center hover:bg-reddit_search_light"
            >
              <EllipsisHorizontalIcon
                onClick={(e) => {
                  setIsOpenDots((prev) => !prev);
                }}
                className="h-6 w-6 outline-none"
              />
            </div>}
            {isOpenDots && (
              <div className={`z-20 w-48 ${(username == userInfo.username && type == "Post") ? 'h-72 mt-78' : (username == userInfo.username) ? 'h-54 mt-62' : (username !== userInfo.username && !communityName) ? 'h-26 mt-36' : 'h-37 mt-47'}  bg-reddit_lightGreen absolute text-white text-sm py-2 rounded-lg font-extralight flex flex-col ${communityName != null ? '-ml-[150px]' : '-ml-[156px]'}`}>
                <div onClick={handleClickSave}
                  id={"mainfeed_" + id + "_menu_save"}
                  className="w-full pl-6 hover:bg-reddit_hover h-12 flex items-center cursor-pointer" >
                  {!saved ? <BookmarkIcon className="h-4.5 w-5 text-white " />
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-4.5">
                      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
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



                {username == userInfo.username && type == "Post" &&
                  <div onClick={enterEditMode}
                    id={"mainfeed_" + id + "_menu_report"}
                    className="w-full pl-6 hover:bg-reddit_hover h-12 flex rounded-b-lg items-center cursor-pointer"
                  >
                    <svg rpl="" fill="white" height="20" icon-name="edit-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m18.236 3.158-1.4-1.4a2.615 2.615 0 0 0-3.667-.021L1.336 13.318a1.129 1.129 0 0 0-.336.8v3.757A1.122 1.122 0 0 0 2.121 19h3.757a1.131 1.131 0 0 0 .8-.337L18.256 6.826a2.616 2.616 0 0 0-.02-3.668ZM5.824 17.747H2.25v-3.574l9.644-9.435L15.259 8.1l-9.435 9.647ZM17.363 5.952l-1.23 1.257-3.345-3.345 1.257-1.23a1.362 1.362 0 0 1 1.91.01l1.4 1.4a1.364 1.364 0 0 1 .008 1.908Z"></path> </svg>
                    <p className="ml-2 no-select">Edit</p>
                  </div>}


                {username == userInfo.username &&
                  <div onClick={markAsSpoiler}
                    id={"mainfeed_" + id + "_menu_report"}
                    className="w-full pl-6 hover:bg-reddit_hover h-12 flex rounded-b-lg items-center cursor-pointer"
                  >
                    <svg rpl="" fill="currentColor" height="20" icon-name="spoiler-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M9.463 15.384A1.092 1.092 0 0 1 9.076 15a1.033 1.033 0 0 1-.143-.537c-.002-.186.047-.369.143-.529.093-.16.227-.293.387-.387.16-.097.345-.148.533-.147a1.05 1.05 0 0 1 .537.141 1.076 1.076 0 0 1 .537.921c0 .188-.051.373-.148.535-.096.159-.23.292-.39.386a1.042 1.042 0 0 1-.536.143 1.026 1.026 0 0 1-.533-.142Zm-.141-3.329L9.13 5.342h1.73l-.192 6.713H9.322Zm.667 7.935a4.6 4.6 0 0 1-3.27-1.354l-5.367-5.365a4.634 4.634 0 0 1 0-6.542l5.367-5.365a4.626 4.626 0 0 1 6.54 0l5.366 5.364a4.627 4.627 0 0 1 0 6.542l-5.364 5.365a4.6 4.6 0 0 1-3.272 1.355Zm0-18.73a3.353 3.353 0 0 0-2.386.988L2.237 7.614a3.375 3.375 0 0 0 0 4.772l5.366 5.366a3.46 3.46 0 0 0 4.771 0l5.365-5.366a3.374 3.374 0 0 0 0-4.772L12.374 2.25A3.349 3.349 0 0 0 9.99 1.26Z"></path></svg>
                    {!EditedSpoiler && <p className="ml-2 no-select">Add spoiler tag</p>}
                    {EditedSpoiler && <p className="ml-2 no-select">Remove spoiler tag</p>}
                  </div>}


                {username == userInfo.username &&
                  <div onClick={markAsNSFW}
                    id={"mainfeed_" + id + "_menu_report"}
                    className="w-full pl-6 hover:bg-reddit_hover h-12 flex rounded-b-lg items-center cursor-pointer"
                  >
                    {!EditedNSFW &&
                      <>
                        <svg rpl="" fill="currentColor" height="20" icon-name="nsfw-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"> <path d="m4.47 7.123 2.653-1.26h.47V14.5H6.15V7.668l-1.68.8V7.123Zm9.9 3.69a2.288 2.288 0 0 1-.02 2.54 2.7 2.7 0 0 1-1.085.91 3.699 3.699 0 0 1-3.068 0A2.774 2.774 0 0 1 9.1 13.35a2.253 2.253 0 0 1-.019-2.532c.257-.383.61-.69 1.025-.893A2.372 2.372 0 0 1 9.4 9.11a2.21 2.21 0 0 1-.257-1.048 2.1 2.1 0 0 1 .342-1.175c.233-.353.557-.637.938-.82.409-.202.86-.305 1.315-.3.451-.005.897.098 1.3.3.377.185.697.468.926.82.227.352.345.762.34 1.18a2.2 2.2 0 0 1-.255 1.05 2.3 2.3 0 0 1-.706.8c.415.202.77.512 1.026.896ZM12.54 13.2c.235-.11.437-.28.583-.495.142-.207.216-.454.214-.705a1.267 1.267 0 0 0-.205-.7 1.468 1.468 0 0 0-.57-.51 1.776 1.776 0 0 0-.83-.19c-.29-.004-.577.061-.836.19a1.5 1.5 0 0 0-.583.513 1.262 1.262 0 0 0 .003 1.4c.147.216.348.388.583.5.256.124.537.186.821.182a1.86 1.86 0 0 0 .82-.185Zm-1.474-6.083a1.194 1.194 0 0 0-.468.422 1.11 1.11 0 0 0-.173.615c-.002.224.058.444.173.636.113.192.275.35.468.46.201.114.429.173.66.17.23.002.456-.055.656-.167a1.233 1.233 0 0 0 .638-1.099 1.132 1.132 0 0 0-.635-1.037 1.507 1.507 0 0 0-1.319 0ZM10 19.988a4.616 4.616 0 0 1-3.27-1.352l-5.366-5.365a4.627 4.627 0 0 1 0-6.542L6.73 1.364a4.634 4.634 0 0 1 6.542 0l5.366 5.365a4.634 4.634 0 0 1 0 6.542l-5.366 5.365a4.615 4.615 0 0 1-3.27 1.352Zm0-18.726a3.362 3.362 0 0 0-2.386.987L2.25 7.614a3.374 3.374 0 0 0 0 4.772l5.366 5.365a3.38 3.38 0 0 0 4.773 0l5.365-5.365a3.375 3.375 0 0 0 0-4.772L12.387 2.25A3.364 3.364 0 0 0 10 1.262Z"></path></svg>
                        <p className="ml-2 no-select">Add NSFW tag</p>
                      </>}
                    {EditedNSFW &&
                      <>
                        <svg rpl="" fill="white" height="20" icon-name="nsfw-fill" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"> <path d="M13 10.967a1.593 1.593 0 0 0-1.363 0 1.2 1.2 0 0 0-.475.414 1.02 1.02 0 0 0-.173.576.967.967 0 0 0 .18.574c.122.172.29.307.482.393.21.095.438.143.668.14a1.51 1.51 0 0 0 .671-.146 1.2 1.2 0 0 0 .475-.4.985.985 0 0 0 .173-.569 1.024 1.024 0 0 0-.17-.57 1.2 1.2 0 0 0-.469-.412Z"></path><path d="M11.747 9.227c.177.095.374.143.574.14.2.003.396-.045.572-.14a1.057 1.057 0 0 0 .402-1.462.984.984 0 0 0-.406-.37 1.317 1.317 0 0 0-1.137 0 1 1 0 0 0-.557.902 1.047 1.047 0 0 0 .551.932l.001-.002Z"></path><path d="M18.636 6.73 13.27 1.363a4.634 4.634 0 0 0-6.542 0L1.364 6.73a4.627 4.627 0 0 0 0 6.542l5.365 5.365a4.633 4.633 0 0 0 6.542 0l5.366-5.365a4.634 4.634 0 0 0 0-6.542ZM8.204 14.5H6.288V8.277L4.648 9V7.23l2.988-1.367h.568V14.5Zm6.862-1.148c-.29.4-.683.714-1.136.912a4.11 4.11 0 0 1-3.24-.006 2.8 2.8 0 0 1-1.134-.918 2.172 2.172 0 0 1-.41-1.283c0-.42.12-.83.345-1.184a2.6 2.6 0 0 1 .944-.879 2.488 2.488 0 0 1-.636-.832c-.152-.32-.23-.67-.229-1.025a2.117 2.117 0 0 1 .378-1.248c.256-.362.604-.65 1.008-.832.43-.198.9-.298 1.374-.293.474-.004.942.099 1.371.3.403.182.749.47 1 .834.249.368.378.804.37 1.248a2.371 2.371 0 0 1-.868 1.851c.383.21.708.51.944.877a2.24 2.24 0 0 1-.074 2.481l-.007-.003Z"></path> </svg>
                        <p className="ml-2 no-select">Remove NSFW tag</p>
                      </>}
                  </div>}



                {username == userInfo.username &&
                  <div onClick={deletePost}
                    id={"mainfeed_" + id + "_menu_report"}
                    className="w-full pl-6 hover:bg-reddit_hover h-12 flex rounded-b-lg items-center cursor-pointer"
                  >
                    <svg rpl="" fill="white" height="20" icon-name="delete-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"> <path d="M15.751 6.023 17 6.106l-.761 11.368a2.554 2.554 0 0 1-.718 1.741A2.586 2.586 0 0 1 13.8 20H6.2a2.585 2.585 0 0 1-1.718-.783 2.553 2.553 0 0 1-.719-1.737L3 6.106l1.248-.083.761 11.369c-.005.333.114.656.333.908.22.252.525.415.858.458h7.6c.333-.043.64-.207.859-.46.22-.254.338-.578.332-.912l.76-11.363ZM18 2.983v1.243H2V2.983h4v-.372A2.737 2.737 0 0 1 6.896.718 2.772 2.772 0 0 1 8.875.002h2.25c.729-.03 1.44.227 1.979.716.538.488.86 1.169.896 1.893v.372h4Zm-10.75 0h5.5v-.372a1.505 1.505 0 0 0-.531-1.014 1.524 1.524 0 0 0-1.094-.352h-2.25c-.397-.03-.79.097-1.094.352-.304.256-.495.62-.531 1.014v.372Z"></path></svg>
                    <p className="ml-2 no-select">Delete</p>
                  </div>}



                {userInfo.username !== username && communityName != null && <div onClick={(e) =>
                  handleReportPost(e)
                }
                  id={"mainfeed_" + id + "_menu_report"}
                  className="w-full pl-6 hover:bg-reddit_hover h-12 flex rounded-b-lg items-center cursor-pointer"
                >
                  <FlagIcon className="h-4.5 w-5 text-white " />
                  {/* Todo change the icon, make the buttons change color when clicked, and when any click anyhwere else, close the dropdown */}
                  <p className="ml-2 no-select">Report</p>
                </div>}
              </div>
            )}
          </div>
        </div>

        <div className={`mt-1 ${shareMode ? 'mb-[10px]' : ''}  w-full h-fit flex flex-col`}>
          {(EditedSpoiler || EditedNSFW) && (
            <div className="text-white items-center mt-1.5 flex-row flex font-medium text-lg">
              {EditedSpoiler && (
                <div
                  onClick={(e) => {
                    setBlured(true);
                  }}
                  className="flex cursor-pointer flex-row items-center"
                >
                  <ExclamationTriangleIcon className="h-[22px]  text-reddit_navbar fill-red-600 w-[23px]" />
                  <h1 className="text-[12.5px] text-red-600 mr-3 ml-[1px]">
                    SPOILER
                  </h1>
                </div>
              )}
              {EditedNSFW && (
                <div
                  onClick={(e) => {
                    setBlured(true);
                  }}
                  className="cursor-pointer flex flex-row items-center"
                >
                  <svg
                    rpl=""
                    className="inline-block"
                    fill="#E00296"
                    height="19"
                    icon-name="nsfw-fill"
                    viewBox="0 0 20 20"
                    width="19"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13 10.967a1.593 1.593 0 0 0-1.363 0 1.2 1.2 0 0 0-.475.414 1.02 1.02 0 0 0-.173.576.967.967 0 0 0 .18.574c.122.172.29.307.482.393.21.095.438.143.668.14a1.51 1.51 0 0 0 .671-.146 1.2 1.2 0 0 0 .475-.4.985.985 0 0 0 .173-.569 1.024 1.024 0 0 0-.17-.57 1.2 1.2 0 0 0-.469-.412Z"></path>
                    <path d="M11.747 9.227c.177.095.374.143.574.14.2.003.396-.045.572-.14a1.057 1.057 0 0 0 .402-1.462.984.984 0 0 0-.406-.37 1.317 1.317 0 0 0-1.137 0 1 1 0 0 0-.557.902 1.047 1.047 0 0 0 .551.932l.001-.002Z"></path>
                    <path d="M18.636 6.73 13.27 1.363a4.634 4.634 0 0 0-6.542 0L1.364 6.73a4.627 4.627 0 0 0 0 6.542l5.365 5.365a4.633 4.633 0 0 0 6.542 0l5.366-5.365a4.634 4.634 0 0 0 0-6.542ZM8.204 14.5H6.288V8.277L4.648 9V7.23l2.988-1.367h.568V14.5Zm6.862-1.148c-.29.4-.683.714-1.136.912a4.11 4.11 0 0 1-3.24-.006 2.8 2.8 0 0 1-1.134-.918 2.172 2.172 0 0 1-.41-1.283c0-.42.12-.83.345-1.184a2.6 2.6 0 0 1 .944-.879 2.488 2.488 0 0 1-.636-.832c-.152-.32-.23-.67-.229-1.025a2.117 2.117 0 0 1 .378-1.248c.256-.362.604-.65 1.008-.832.43-.198.9-.298 1.374-.293.474-.004.942.099 1.371.3.403.182.749.47 1 .834.249.368.378.804.37 1.248a2.371 2.371 0 0 1-.868 1.851c.383.21.708.51.944.877a2.24 2.24 0 0 1-.074 2.481l-.007-.003Z"></path>
                  </svg>
                  <h1 className="text-sm ml-1 text-[#E00296]">NSFW</h1>
                </div>
              )}
            </div>
          )}
          <div className={`${!editMode ? `cursor-pointer` : ''}`} onClick={() => {
            if (Blured || editMode)
              return;

            if (!location.pathname.includes("/comments/")) {
              if (content.endsWith(".mp4"))
                return;
              if (communityName == null)
                navigate(`/u/${username}/comments/${id}`);
              else
                navigate(`/r/${communityName}/comments/${id}`);
            }
          }
          }>
            <div
              id={"mainfeed_" + id + "_title"}
              className="text-white mt-1.5 cursor-text font-medium text-lg"
            >
              <h1>{title}</h1>
            </div>

            <div className="relative w-full h-fit">

              {(Blured) && <div onClick={(e) => { setBlured(false) }} className={`w-[94px] z-10 left-[calc(50%-47px)] top-[calc(50%-10px)]  h-[30px] text-[13px] font-semibold flex-row flex items-center justify-center cursor-pointer absolute text-white rounded-3xl bg-[#090E0FB9] hover:bg-black `} >
                <EyeIcon className='w-5 mr-1.5 h-5' />
                View
              </div>}

              {type != "Images & Video" && <div id={"mainfeed_" + id + "_content"} onClick={(e) => { setBlured(false) }} className={`text-gray-400  text-sm mt-1.5  ${Blured ? 'filter blur-[10px]' : ''}`}>
                <>
                  {type != "Link" && !editMode && (<div style={{ wordBreak: 'break-all' }}><ReactMarkdown>{editPostContent}</ReactMarkdown></div>)}
                  {type != "Link" && editMode && (
                    <div className=" h-[200px] mb-2 mt-[12px]">
                      <Tiptap initialContent={marked.marked(editPostContent)} setDescription={setEditPostContent} />
                    </div>
                  )}
                  {type == "Link" && (<a href={content} className=' underline cursor-pointer text-blue-600 hover:text-blue-500' style={{ wordBreak: 'break-all' }}>{content}</a>)}
                </>
              </div>}

              {
                type == "Images & Video" &&
                <div
                  id={"mainfeed_" + id + "_" + type} className="w-full h-full mt-2">
                  <div className={`relative flex-row rounded-2xl overflow-clip border-[0.5px] border-gray-700 flex justify-center`}>

                    <div className={`${Blured ? 'block' : "absolute"} inset-0 flex flex-row w-full `} onClick={(e) => { setBlured(false) }} >
                      {content.endsWith('.mp4') ? <video src={content} alt="" className={`blur-[50px] max-h-[500px] object-cover w-full `} /> :
                        <img src={content} alt="" className=' blur-[50px] max-h-[500px] object-cover w-full' />}
                    </div>

                    {content.endsWith(".mp4") ? (
                      <video
                        src={content}
                        alt="Post"
                        className={`${Blured ? "rounded-[40px] hidden" : "z-10"
                          } max-h-[500px] w-full object-contain `}
                        controls
                      />
                    ) : (
                      <img
                        src={content}
                        alt="Post"
                        className={`${Blured ? "rounded-[40px] hidden" : "z-10"
                          }  max-h-[500px] w-full object-contain `}
                      />
                    )}
                  </div>
                </div>
              }



              {type == "Poll" && (
                <div id={"mainfeed_" + id + "_" + type} className="w-full mt-2">
                  <div
                    className={`relative h-fit w-full ${Blured ? "filter blur-[10px]" : ""
                      }`}
                  >
                    <div className="w-full rounded-xl bg-transparent border-[0.5px] border-gray-600 h-fit px-[14px] pb-2 pt-1 flex flex-col">
                      <div className="w-full h-9 pt-1 items-center border-b-[0.5px] border-gray-600 text-[11px] flex flex-row ">
                        <h1 className="mr-1 text-gray-300 font-light">
                          {hasExpired ? "Closed" : "Open"} .
                        </h1>
                        <h1 className="text-gray-300 font-light">
                          {!hasVoted
                            ? formatNumber(getTotalVotes(pollOptions))
                            : formatNumber(getTotalVotes(editedPollOptions))}{" "}
                          total votes
                        </h1>
                      </div>
                      <div
                        id={"mainfeed_" + id + "_polloptions"}
                        className="w-full flex flex-col h-fit min-h-13 text-[11px] px-2 space-y-3.5 mt-3"
                        onClick={(e) => { e.stopPropagation() }}
                      >
                        {editedPollOptions &&
                          editedPollOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center flex-row w-full"
                            >
                              {!hasVoted && !hasExpired ? (
                                <div className="w-fit hit flex-row">
                                  <input
                                    type="radio"
                                    name={id + "PollOption" + index}
                                    className="radio bg-inherit outline-gray-200 focus:outline-none"
                                    checked={option.isVoted}
                                    onChange={() => handleOptionChange(index)}
                                  />
                                  <label className="text-gray-200 text-[14px] whitespace-nowrap font-light ml-2">
                                    {option.text}
                                  </label>
                                </div>
                              ) : (
                                <div className="w-7/12">
                                  <div
                                    style={{
                                      width: `${getVoteWidth(option.votes)}`,
                                    }}
                                    className={` ${option.votes == getMaxVotes(editedPollOptions)
                                      ? "bg-[#33464C]"
                                      : "bg-reddit_search_light"
                                      }  items-center h-8 rounded-[5px] flex flex-row`}
                                  >
                                    <h1 className="text-gray-100 text-[14px] font-semibold ml-5 mr-4">
                                      {option.votes}
                                    </h1>
                                    <label className="text-gray-200 text-[14px] whitespace-nowrap font-light ml-2">
                                      {option.text}
                                    </label>
                                    {option.isVoted ? (
                                      <CheckIcon className="w-[23px] min-w-[23px] min-h-[23px] h-[23px] ml-2 text-white" />
                                    ) : null}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      <div className="flex flex-row w-full mt-3 items-center">
                        {!hasVoted && !hasExpired && (
                          <div
                            onClick={(e) => handleVote(e)}
                            className={`flex items-center justify-center w-12 h-8 rounded-full ${isOptionSelected
                              ? "bg-black cursor-pointer"
                              : "bg-[#1C1E20] cursor-not-allowed"
                              } text-[13px] text-white`}
                          >
                            <h1>Vote</h1>
                          </div>
                        )}
                        {!hasExpired ? (
                          <h1 className="text-[11px] ml-2.5 font-light text-gray-300">
                            Closes {durationRemaining}
                          </h1>
                        ) : null}
                      </div>
                    </div>
                    {Blured && (
                      <div
                        onClick={(e) => {
                          setBlured(false);
                        }}
                        className="absolute inset-0 bg-black opacity-60 rounded-2xl"
                      ></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>



      <div className="flex flex-row mt-1 items-center w-full h-13 space-x-2.5 no-select ">
        <Vote
          id={id}
          netVotes={netVote}
          isUpvoted={isUpvoted}
          isDownvoted={isDownvoted}
          setPosts={setPosts}
        />
        <CommentIcon
          id={id}
          postId={postId}
          username={username}
          communityName={communityName}
          commentCount={commentsNumber}
        />

        {!shareMode && <div ref={shareMenuRef} className="relative flex flex-col">
          <Share id={id} setIsShareMenuOpened={setIsShareMenuOpened} />

          {isShareMenuOpened && (
            <div className="flex-col absolute mt-[38px] flex w-[190px] z-20 h-fit py-1 space-y-1  bg-reddit_hover rounded-lg ">

              <div onClick={(e) => {
                            copyLink(e);
              }} id="copy_link" className="w-full cursor-pointer pl-[14px] h-10 hover:bg-reddit_search_light flex flex-row items-center">
                <svg rpl="" className="mt-[1px] ml-[4px]" fill="white" height="20" icon-name="link-post-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.111 12.5a3.701 3.701 0 0 1-1.09 2.41c-.479.47-.928.922-1.378 1.373-.45.45-.894.9-1.368 1.366a3.852 3.852 0 0 1-2.698 1.099 3.852 3.852 0 0 1-2.698-1.099 3.738 3.738 0 0 1-1.116-2.659c0-.997.402-1.953 1.116-2.658.479-.472.928-.923 1.378-1.375.45-.45.893-.9 1.368-1.365A3.936 3.936 0 0 1 9.638 8.59a3.968 3.968 0 0 1 2.24.258c.27-.269.546-.54.812-.806l.131-.13a5.086 5.086 0 0 0-3.182-.624A5.052 5.052 0 0 0 6.732 8.71c-.48.471-.929.922-1.377 1.373-.449.451-.894.9-1.37 1.366A4.982 4.982 0 0 0 2.5 14.992c0 1.328.534 2.602 1.486 3.543A5.13 5.13 0 0 0 7.58 20a5.13 5.13 0 0 0 3.595-1.465c.478-.471.927-.923 1.377-1.374.451-.451.894-.9 1.368-1.366a4.993 4.993 0 0 0 1.263-2.071c.243-.781.288-1.61.132-2.412L14.11 12.5Z"></path><path d="M16.017 1.467A5.123 5.123 0 0 0 12.422 0a5.123 5.123 0 0 0-3.595 1.467c-.478.471-.926.923-1.377 1.374-.45.451-.894.9-1.367 1.366a4.966 4.966 0 0 0-1.106 1.624 4.907 4.907 0 0 0-.291 2.86l1.2-1.19a3.699 3.699 0 0 1 1.092-2.41c.478-.472.928-.923 1.377-1.374.45-.45.894-.9 1.368-1.366a3.844 3.844 0 0 1 2.698-1.101c1.012 0 1.982.396 2.698 1.101a3.736 3.736 0 0 1 1.116 2.66c0 .996-.401 1.953-1.116 2.658-.478.471-.927.922-1.377 1.373-.45.451-.893.9-1.368 1.367a3.933 3.933 0 0 1-2.014 1.003 3.966 3.966 0 0 1-2.24-.26c-.273.274-.551.549-.818.818l-.123.12a5.087 5.087 0 0 0 3.183.624 5.053 5.053 0 0 0 2.906-1.423c.477-.472.926-.923 1.376-1.375.45-.452.894-.9 1.368-1.365A4.977 4.977 0 0 0 17.5 5.008a4.977 4.977 0 0 0-1.488-3.543l.005.002Z"></path>
                </svg>
                <h1 className="text-gray-300 ml-3 text-[15px]">Copy Link</h1>
              </div>


              <div onClick={
                () => { setIsShareMenuOpened(false); setEditMode(false); setShareMode(true); }
              } id="cross_post" className="w-full cursor-pointer pl-[18px] h-10 hover:bg-reddit_search_light flex flex-row items-center">
                <svg rpl="" class="mt-[1px] ml-[4px]" fill="white" height="20" icon-name="crosspost-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="m15.944 11.926-.888.879 1.925 1.945H12A4.873 4.873 0 0 1 7.138 10 4.873 4.873 0 0 1 12 5.25h4.971l-1.915 1.936.888.878L18.875 5.1a.727.727 0 0 0-.007-1.025l-2.929-2.9-.878.888L17.011 4H12a6.128 6.128 0 0 0-6.056 5.25H1v1.625h4.981A6.117 6.117 0 0 0 12 16h5l-1.94 1.92.878.89 2.929-2.9a.726.726 0 0 0 .006-1.025l-2.929-2.96Z"></path>
                </svg>

                <h1 className="text-gray-300 ml-3 text-[15px]">Cross Post</h1>
              </div>

            </div>
          )
          }

        </div>
        }





        {editMode &&
          <div className="flex flex-row w-full items-center">



            <div onClick={() => { setEditMode(false); setEditedNSFW(isNSFW); setEditedSpoiler(isSpoiler); setEditPostContent(content); }} id={`${id}_save_cancel`} className="w-14 h-8 items-center ml-auto flex flex-row justify-center hover:bg-reddit_search_light cursor-pointer bg-reddit_search rounded-2xl">
              <p className="text-white text-[12px] font-medium">Cancel</p>
            </div>


            <div id={`${id}_save_edit`} onClick={submitEditedPost} className="w-14 h-8 items-center flex flex-row justify-center hover:bg-reddit_light_blue cursor-pointer bg-[#0045AC] rounded-2xl ml-3">
              <p className="text-white text-[12px] font-medium">Save</p>
            </div>

          </div>
        }




        {shareMode &&
          <div className="w-full flex items-center flex-row">

            <div onClick={() => setShareMode(false)} className="ml-auto w-14 h-[36px] mr-3 hover:bg-reddit_search_light cursor-pointer bg-reddit_search  flex flex-row justify-center items-center rounded-3xl">
              <h1 className="text-white text-[12px] font-medium ">Cancel</h1>

            </div>
            <div onClick={submitCrossPost} className={` w-14 h-[34px] ${crossPostTitle.trim() !== "" ? 'hover:bg-reddit_light_blue bg-[#0045AC] cursor-pointer' : 'bg-gray-500 cursor-not-allowed'}  flex flex-row justify-center items-center rounded-3xl`}>
              <h1 className="text-white text-[12px] font-medium ">Share</h1>
            </div>
          </div>
        }
      </div>

      {isOpenReportModal && <ReportModal showAlertForTime={showAlertForTime} setIsOpenReportModal={setIsOpenReportModal} isOpenReportModal={isOpenReportModal} postId={id} reportModalRef={reportModalRef} communityRules={communityRules} />}
    </div >

  );
};

export default Post;
