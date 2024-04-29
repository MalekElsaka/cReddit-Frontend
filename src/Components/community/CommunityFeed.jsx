import Separator from "../sidebar/Nav-Icons/Separator";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { ChevronDownIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import Post from "../mainfeed/Post";
import { UserContext } from "@/context/UserContext";
import {
  postRequest,
  getRequest,
  postRequestImg,
} from "../../services/Requests";
import { baseUrl } from "../../constants";
import Loading from "../Loading/Loading";
import { useLocation } from "react-router-dom";
import Comment from "../mainfeed/comment/Comment";

/**
 * CommunityFeed is a React component that renders a feed of posts for a specific subreddit.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.subredditName - The name of the subreddit for which to fetch and display posts.
 *
 * @example
 * <CommunityFeed subredditName="reactjs" />
 *
 * @returns {React.Element} The rendered component.
 */
const CommunityFeed = ({ subredditName }) => {
  const [isOpenCateg, setIsOpenCateg] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const { isLoggedIn } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [isSinglePostSelected, setIsSinglePostSelected] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [homeFeedScroll, setHomeFeedScroll] = useState(0);
  const commfeedRef = useRef();

  const [selectedSort, setSelectedSort] = useState(() => {
    const storedSort = localStorage.getItem("homeSelectedSort");
    if (storedSort) {
      return storedSort;
    } else {
      localStorage.setItem("homeSelectedSort", "Best");
      return "Best";
    }
  });
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [feedLoading, setIsFeedLoading] = useState(false);

  const menuRefCateg = useRef();
  const menuRefView = useRef();
  const navigate = useLocation();
  const prevSelectedSort = useRef(selectedSort);

  const getSinglePost = async (selectedPostId) => {
    setLoadingPost(true);
    const existingPost = posts.find((post) => post._id === selectedPostId);
    if (existingPost) {
      setSelectedPost(existingPost);
    } else {
      const response = await getRequest(`${baseUrl}/post/${selectedPostId}`);
      if (response.status == 200 || response.status == 201) {
        setSelectedPost(response.data);
      }
    }
    setLoadingPost(false);
  };

  useEffect(() => {
    let isSortChanged = prevSelectedSort.current !== selectedSort;
    let pageNum = isSortChanged ? 1 : page;
    const getHomeFeed = async () => {
      setLoading(true);
      setError(false);
      if (pageNum === 1) {
        setIsFeedLoading(true);
      }

      try {
        const response = await getRequest(
          `${baseUrl}/subreddit/${subredditName}/posts?page=${pageNum}&limit=15&sort=${selectedSort.toLowerCase()}`
        );
        console.log(response.data);
        if (response.status == 200 || response.status == 201) {
          if (isSortChanged) {
            setPosts(response.data);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...response.data]);
          }
          setHasMore(response.data.length > 0);
          setIsFeedLoading(false);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!navigate.pathname.includes("/comments/")) {
      getHomeFeed();
      prevSelectedSort.current = selectedSort;
    }
  }, [isLoggedIn, navigate.pathname, page, selectedSort]);

  useEffect(() => {
    const url = navigate.pathname;
    const regex = /.*\/comments\/([A-Za-z0-9]*)\/?.*/;
    const match = url.match(regex);
    if (match) {
      const selectedPostId = match[1];
      setIsSinglePostSelected(true);
      getSinglePost(selectedPostId);
    } else {
      setIsSinglePostSelected(false);
    }
  }, [navigate.pathname]);

  /**
   * Handles the scroll event for the main feed. If the user has scrolled to the bottom,
   * it increments the page number to load more posts.
   * @callback handleScroll
   */
  const handleScroll = useCallback(() => {
    const commfeedElement = document.getElementById("community-feed");
    const threshold = 10;
    if (
      !hasScrolledToEnd &&
      commfeedElement.scrollTop + commfeedElement.clientHeight >=
      commfeedElement.scrollHeight - threshold
    ) {
      setPage((prevPage) => prevPage + 1);
      setHasScrolledToEnd(true);
    } else if (
      commfeedElement.scrollTop + commfeedElement.clientHeight <
      commfeedElement.scrollHeight
    ) {
      setHasScrolledToEnd(false);
    }
  }, [hasScrolledToEnd]);

  useEffect(() => {
    const commfeedElement = document.getElementById("community-feed");

    if (commfeedElement) {
      commfeedElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (commfeedElement) {
        commfeedElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    let closeDropdown = (e) => {
      if (menuRefCateg.current && !menuRefCateg.current.contains(e.target)) {
        setIsOpenCateg(false);
      }
      if (menuRefView.current && !menuRefView.current.contains(e.target)) {
        setIsOpenView(false);
      }
    };
    document.addEventListener("click", closeDropdown);

    const commfeedElement = document.getElementById("community-feed");

    const handleScroll = () => {
      const scrollThreshold = 58;
      setHomeFeedScroll(commfeedElement.scrollTop);
      if (commfeedElement.scrollTop > scrollThreshold) {
        setIsOpenCateg(false);
        setIsOpenView(false);
      }
    };

    if (commfeedElement) {
      commfeedElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("click", closeDropdown);
      if (commfeedElement) {
        commfeedElement.removeEventListener("scroll", handleScroll);
      }
    };
  });

  useEffect(() => {
    if (navigate.pathname.includes("/comments/")) {
      localStorage.setItem("homeFeedScroll", homeFeedScroll);
    } else {
      setTimeout(() => {
        commfeedRef.current.scrollTop = localStorage.getItem("homeFeedScroll");
      }, 10);
    }
  }, [navigate.pathname]);

  return (
    <div
      ref={commfeedRef}
      id="community-feed"
      className="flex flex-col w-full h-full bg-reddit_greenyDark no-select px-1 py-1  overflow-hidden "
    >
      {!isSinglePostSelected && (
        <div className="flex items-center h-8 min-h-8 mb-2 px-2 w-full">
          <div
            id="commfeed_category_dropdown"
            ref={menuRefCateg}
            className="relative"
          >
            <div
              onClick={() => setIsOpenCateg((prev) => !prev)}
              className={`flex w-14 h-7 rounded-full hover:bg-reddit_search_light ${isOpenCateg ? "bg-reddit_search_light" : ""
                } justify-center items-center cursor-pointer`}
            >
              <p className="text-gray-500 font-semibold text-xs no-select ">
                {selectedSort}
              </p>
              <ChevronDownIcon className="h-3 ml-0.5 w-3 text-gray-400" />
            </div>

            {isOpenCateg && (
              <div className=" w-20 h-60 bg-reddit_search absolute mt-2.5 -ml-2.5 text-white text-sm pt-2.5 z-20 rounded-lg  font-extralight flex flex-col">
                <div className="w-full pl-4 rounded-lg h-9 flex items-center font-normal">
                  <p className="no-select">Sort by</p>
                </div>

                <div
                  onClick={() => {
                    setSelectedSort("Best");
                    setIsOpenCateg(false);
                    localStorage.setItem("homeSelectedSort", "Best");
                  }}
                  id="commfeed_category_best"
                  href=""
                  className="w-full pl-4 hover:bg-reddit_hover h-12 flex items-center cursor-pointer"
                >
                  <p className="no-select">Best</p>
                </div>

                <div
                  onClick={() => {
                    setSelectedSort("Hot");
                    setIsOpenCateg(false);
                    localStorage.setItem("homeSelectedSort", "Hot");
                  }}
                  id="commfeed_category_hot"
                  href=""
                  className="w-full pl-4 hover:bg-reddit_hover h-12 flex items-center cursor-pointer"
                >
                  <p className="no-select">Hot</p>
                </div>

                <div
                  onClick={() => {
                    setSelectedSort("New");
                    setIsOpenCateg(false);
                    localStorage.setItem("homeSelectedSort", "New");
                  }}
                  id="commfeed_category_new"
                  href=""
                  className="w-full pl-4  hover:bg-reddit_hover h-12 flex items-center cursor-pointer"
                >
                  <p className="no-select">New</p>
                </div>

                <div
                  onClick={() => {
                    setSelectedSort("Top");
                    setIsOpenCateg(false);
                    localStorage.setItem("homeSelectedSort", "Top");
                  }}
                  id="commfeed_category_top"
                  href=""
                  className="w-full pl-4  hover:bg-reddit_hover h-12 flex items-center cursor-pointer"
                >
                  <p className="no-select">Top</p>
                </div>
              </div>
            )}
          </div>
          <div ref={menuRefView} className="relative">
            <div
              id="commfeed_view_type"
              onClick={() => setIsOpenView((prev) => !prev)}
              className={`flex w-14 h-7 rounded-full hover:bg-reddit_search_light ${isOpenView ? "bg-reddit_search_light" : ""
                } justify-center items-center cursor-pointer`}
            >
              <ViewColumnsIcon className="h-4.5 w-5 text-gray-500 rotate-90" />
              <ChevronDownIcon className="h-3 ml-0.5 w-3 text-gray-400" />
            </div>

            {isOpenView && (
              <div className=" w-30 h-33  bg-reddit_search absolute -ml-7 mt-2.5 text-white text-sm pt-2 z-20 rounded-lg  font-extralight flex flex-col">
                <div className="w-full pl-3  rounded-lg h-8 flex items-center font-medium">
                  <p className="no-select">View</p>
                </div>
                <a
                  id="commfeed_view_card"
                  href=""
                  className="w-full pl-6 hover:bg-reddit_hover h-11 flex items-center cursor-pointer"
                >
                  <ViewColumnsIcon className="h-4.5 w-5 text-white rotate-90" />
                  <p className="ml-2 no-select">Card</p>
                </a>
                <a
                  id="commfeed_view_classic"
                  href=""
                  className="w-full pl-6 hover:bg-reddit_hover h-11 flex rounded-b-lg items-center cursor-pointer"
                >
                  <ViewColumnsIcon className="h-4.5 w-5 text-white rotate-90" />
                  {/* Todo change the icon, make the buttons change color when clicked, and when any click anyhwere else, close the dropdown */}
                  <p className="ml-2 no-select">Classic</p>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={`${isSinglePostSelected ? "hidden" : ""
          } h-1 px-2.5 flex w-full`}
      >
        <Separator />
      </div>

      {feedLoading ? (
        <Loading />
      ) : (
        <>
          {!isSinglePostSelected &&
            posts.map((post, i) => (
              <Post
                id={post._id}
                key={i}
                setPosts={setPosts}
                isSinglePostSelected={isSinglePostSelected}
                {...post}
                inSubreddit={true}
              />
            ))}
        </>
      )}

      {/* {isSinglePostSelected && loadingPost && <Loading />} */}

      {isSinglePostSelected &&
        (loadingPost ? (
          <Loading />
        ) : (
          <>
            <Post
              id={selectedPost._id}
              setPosts={setPosts}
              isSinglePostSelected={isSinglePostSelected}
              {...selectedPost}
            />
            <Comment postId={selectedPost._id} />
          </>
        ))}

      {
        <div className="w-full max-h-15 mt-10">
          {loading && !isSinglePostSelected && !feedLoading && <Loading />}
          {
            <div className="w-full h-6 mt-2">
              <div className="relative w-full h-full">
                <div className="text-gray-400 text-sm mt-1.5">
                  <p className=" text-transparent">
                    Tabgo corpus texo. Cicuta dsdsdsdddddddddddddsdsdsds dsdsdsddsdsdsdsffffffffffff in quaerat caveo corpus bellicus. Voluptates terror via curis deludo supra somniculosus bibo.
                  </p>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  );
};

export default CommunityFeed;
