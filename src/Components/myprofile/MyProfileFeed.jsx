import Separator from "../sidebar/Nav-Icons/Separator";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { ChevronDownIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import Post from "../mainfeed/Post";
import { UserContext } from "@/context/UserContext";
import { postRequest, getRequest } from "@/services/Requests";
import { baseUrl } from "@/constants";
import Loading from "../Loading/Loading";
import { useLocation } from "react-router-dom";
import Comment from "../mainfeed/comment/Comment";
import PostComment from "../mainfeed/comment/PostComment";

const MyProfileFeed = ({ userName, selectedPage }) => {
  const [isOpenCateg, setIsOpenCateg] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [saved, setSaved] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [upvoted, setUpvoted] = useState([]);
  const [downvoted, setDownvoted] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const { isLoggedIn } = useContext(UserContext);
  const [isSinglePostSelected, setIsSinglePostSelected] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [homeFeedScroll, setHomeFeedScroll] = useState(0);
  const mainfeedRef = useRef();

  const [selectedSort, setSelectedSort] = useState(() => {
    const storedSort = localStorage.getItem("homeSelectedSort");
    if (storedSort) {
      return storedSort;
    } else {
      localStorage.setItem("homeSelectedSort", "Best");
      return "Best";
    }
  });
  const [page, setPage] = useState(1);
  const prevSort = useRef(selectedSort);
  const [hasMore, setHasMore] = useState(false);
  const [isSortChanged, setIsSortChanged] = useState(0);
  const [feedLoading, setIsFeedLoading] = useState(false);
  const menuRefCateg = useRef();
  const menuRefView = useRef();
  const navigate = useLocation();
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (feedLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          console.log("Intersecting");
        }
      });
      if (node) observer.current.observe(node);
    },
    [feedLoading, hasMore]
  );

  const limit = 5;

  console.log("selected page ", selectedPage);

  const getSinglePost = async (selectedPostId) => {
    setLoadingPost(true);
    const existingPost = posts.find((post) => post._id === selectedPostId);
    if (existingPost) {
      setSelectedPost(existingPost);
    } else {
      const response = await getRequest(`${baseUrl}/posts/${selectedPostId}`);
      if (response.status == 200 || response.status == 201) {
        setSelectedPost(response.data);
      }
    }
    setLoadingPost(false);
  };

  const fetchPosts = async (page, selectedSort) => {
    const response = await getRequest(
      `${baseUrl}/user/${userName}/posts?page=${page}&limit=${limit}&sort=${selectedSort.toLowerCase()}`
    );
    return response;
  };

  const fetchComments = async (page, selectedSort) => {
    const response = await getRequest(
      `${baseUrl}/user/${userName}/comments?page=${page}&limit=${limit}&sort=${selectedSort.toLowerCase()}`
    );
    return response;
  };

  const fetchSaved = async (page, selectedSort) => {
    const response = await getRequest(
      `${baseUrl}/user/saved?page=${page}&limit=${limit}&sort=${selectedSort.toLowerCase()}`
    );
    return response;
  };

  const fetchHidden = async (page, selectedSort) => {
    const response = await getRequest(
      `${baseUrl}/user/hidden-posts?page=${page}&limit=${limit}&sort=${selectedSort.toLowerCase()}`
    );
    return response;
  };

  const fetchUpvoted = async (page, selectedSort) => {
    const response = await getRequest(
      `${baseUrl}/user/upvoted?page=${page}&limit=${limit}&sort=${selectedSort.toLowerCase()}`
    );
    return response;
  };

  const fetchDownvoted = async (page, selectedSort) => {
    const response = await getRequest(
      `${baseUrl}/user/downvoted?page=${page}&limit=${limit}&sort=${selectedSort.toLowerCase()}`
    );
    return response;
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setComments([]);
    setIsSortChanged((prev) =>
      prevSort.current !== selectedSort ? prev + 1 : prev
    );
    console.log(
      "prevSort.current",
      prevSort.current,
      "selectedSort",
      selectedSort
    );
    console.log("useEffect1");
  }, [selectedSort]);

  useEffect(() => {
    const getHomeFeed = async () => {
      try {
        setHasMore(true);
        setIsFeedLoading(true);
        const { status, data } = await fetchPosts(page, selectedSort);
        if (status === 200 || status === 201) {
          setPosts((prevComments) => [...prevComments, ...data]);
          // setHasMore(data.length >= 10);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Error fetching comments");
        }
      } catch (error) {
      } finally {
        setIsFeedLoading(false);
      }
    };

    console.log("useEffect2");

    if (!navigate.pathname.includes("/comments/")) {
      getHomeFeed();
      prevSort.current = selectedSort;
    }
  }, [page, isSortChanged, navigate.pathname, isLoggedIn]);

  useEffect(() => {
    const getComments = async () => {
      console.log("comments selected sort ", selectedSort);
      try {
        setHasMore(true);
        setIsFeedLoading(true);
        const { status, data } = await fetchComments(page, selectedSort);
        if (status === 200 || status === 201) {
          setComments((prevComments) => [...prevComments, ...data]);
          // setHasMore(data.length >= 10);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Error fetching comments");
        }
      } catch (error) {
      } finally {
        setIsFeedLoading(false);
      }
    };

    getComments();
  }, [page, isSortChanged, navigate.pathname, isLoggedIn]);

  useEffect(() => {
    const getSaved = async () => {
      console.log("saved selected sort ", selectedSort);
      try {
        setHasMore(true);
        setIsFeedLoading(true);
        const { status, data } = await fetchSaved(page, selectedSort);
        if (status === 200 || status === 201) {
          setSaved((prevComments) => [...prevComments, ...data]);
          // setHasMore(data.length >= 10);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Error fetching saved");
        }
      } catch (error) {
      } finally {
        setIsFeedLoading(false);
      }
    };

    getSaved();
  }, [page, isSortChanged, navigate.pathname, isLoggedIn]);

  useEffect(() => {
    const getHidden = async () => {
      console.log("hidden selected sort ", selectedSort);
      try {
        setHasMore(true);
        setIsFeedLoading(true);
        const { status, data } = await fetchHidden(page, selectedSort);
        if (status === 200 || status === 201) {
          setHidden((prevComments) => [...prevComments, ...data]);
          // setHasMore(data.length >= 10);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Error fetching hidden");
        }
      } catch (error) {
      } finally {
        setIsFeedLoading(false);
      }
    };

    getHidden();
  }, [page, isSortChanged, navigate.pathname, isLoggedIn]);

  useEffect(() => {
    const getUpvoted = async () => {
      console.log("upvoted selected sort ", selectedSort);
      try {
        setHasMore(true);
        setIsFeedLoading(true);
        const { status, data } = await fetchUpvoted(page, selectedSort);
        if (status === 200 || status === 201) {
          setUpvoted((prevComments) => [...prevComments, ...data]);
          // setHasMore(data.length >= 10);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Error fetching Upvoted");
        }
      } catch (error) {
      } finally {
        setIsFeedLoading(false);
      }
    };

    getUpvoted();
  }, [page, isSortChanged, navigate.pathname, isLoggedIn]);

  useEffect(() => {
    const getDownvoted = async () => {
      console.log("downvoted selected sort ", selectedSort);
      try {
        setHasMore(true);
        setIsFeedLoading(true);
        const { status, data } = await fetchDownvoted(page, selectedSort);
        if (status === 200 || status === 201) {
          setDownvoted((prevComments) => [...prevComments, ...data]);
          // setHasMore(data.length >= 10);
          setHasMore(data.length > 0);
        } else {
          throw new Error("Error fetching downvoted");
        }
      } catch (error) {
      } finally {
        setIsFeedLoading(false);
      }
    };

    getDownvoted();
  }, [page, isSortChanged, navigate.pathname, isLoggedIn]);

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

    const mainfeedElement = document.getElementById("mainfeed");

    const handleScroll = () => {
      const scrollThreshold = 58;
      setHomeFeedScroll(mainfeedElement.scrollTop);
      if (mainfeedElement.scrollTop > scrollThreshold) {
        setIsOpenCateg(false);
        setIsOpenView(false);
      }
    };

    if (mainfeedElement) {
      mainfeedElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("click", closeDropdown);
      if (mainfeedElement) {
        mainfeedElement.removeEventListener("scroll", handleScroll);
      }
    };
  });

  useEffect(() => {
    if (navigate.pathname.includes("/comments/")) {
      localStorage.setItem("homeFeedScroll", homeFeedScroll);
    } else {
      setTimeout(() => {
        mainfeedRef.current.scrollTop = localStorage.getItem("homeFeedScroll");
      }, 10);
    }
  }, [navigate.pathname]);

  return (
    <div
      ref={mainfeedRef}
      id="mainfeed"
      className="flex flex-col w-full h-full bg-reddit_greenyDark no-select px-1 py-1 "
    >
      {!isSinglePostSelected && (
        <div className="flex items-center h-8 min-h-8 mb-2 px-2 w-full">
          <div
            id="mainfeed_category_dropdown"
            ref={menuRefCateg}
            className="relative"
          >
            <div
              onClick={() => setIsOpenCateg((prev) => !prev)}
              className={`flex w-14 h-7 rounded-full hover:bg-reddit_search_light ${
                isOpenCateg ? "bg-reddit_search_light" : ""
              } justify-center items-center cursor-pointer`}
            >
              <p className="text-gray-500 font-semibold text-xs no-select ">
                {selectedSort}
              </p>
              <ChevronDownIcon className="h-3 ml-0.5 w-3 text-gray-400" />
            </div>

            {isOpenCateg && (
              <div className=" w-20  bg-reddit_search absolute mt-2.5 -ml-2.5 text-white text-sm pt-2.5 z-20 rounded-lg  font-extralight flex flex-col">
                <div className="w-full pl-4 rounded-lg h-9 flex items-center font-normal">
                  <p className="no-select">Sort by</p>
                </div>
                {selectedPage !== "comments" && (
                  <div
                    onClick={() => {
                      setSelectedSort("Best");
                      setIsOpenCateg(false);
                      localStorage.setItem("homeSelectedSort", "Best");
                    }}
                    id="mainfeed_category_best"
                    href=""
                    className="w-full pl-4 hover:bg-reddit_hover h-12 flex items-center cursor-pointer"
                  >
                    <p className="no-select">Best</p>
                  </div>
                )}

                <div
                  onClick={() => {
                    setSelectedSort("Hot");
                    setIsOpenCateg(false);
                    localStorage.setItem("homeSelectedSort", "Hot");
                  }}
                  id="mainfeed_category_hot"
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
                  id="mainfeed_category_new"
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
                  id="mainfeed_category_top"
                  href=""
                  className="w-full pl-4  hover:bg-reddit_hover h-12 flex items-center cursor-pointer"
                >
                  <p className="no-select">Top</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={`${
          isSinglePostSelected ? "hidden" : ""
        } h-1 px-2.5 flex w-full`}
      >
        <Separator />
      </div>

      {feedLoading && page == 1 ? (
        selectedPage === "overview" || selectedPage === "submitted" ? (
          <Loading />
        ) : (
          <></>
        )
      ) : (
        <>
          {!isSinglePostSelected &&
            (selectedPage === "overview" || selectedPage === "submitted") &&
            posts.map((post, i) => {
              if (posts.length === i + 1) {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setPosts}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                    lastPostRef={lastPostRef}
                  />
                );
              } else {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setPosts}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                  />
                );
              }
            })}
        </>
      )}

      {feedLoading && page == 1 ? (
        selectedPage === "comments" ? (
          <Loading />
        ) : (
          <></>
        )
      ) : (
        <>
          {selectedPage === "comments" &&
            comments.map((comment, index) => {
              if (comment.length === index + 1) {
                return (
                  <PostComment
                    key={index}
                    id={comment._id}
                    {...comment}
                    lastCommentElementRef={lastPostRef}
                  />
                );
              } else {
                return (
                  <PostComment key={index} id={comment._id} {...comment} />
                );
              }
            })}
        </>
      )}

      {feedLoading && page == 1 ? (
        selectedPage === "saved" ? (
          <Loading />
        ) : (
          <></>
        )
      ) : (
        <>
          {!isSinglePostSelected &&
            selectedPage === "saved" &&
            saved.map((post, i) => {
              if (saved.length === i + 1) {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setSaved}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                    lastPostRef={lastPostRef}
                  />
                );
              } else {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setSaved}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                  />
                );
              }
            })}
        </>
      )}

      {feedLoading && page == 1 ? (
        selectedPage === "hidden" ? (
          <Loading />
        ) : (
          <></>
        )
      ) : (
        <>
          {!isSinglePostSelected &&
            selectedPage === "hidden" &&
            hidden.map((post, i) => {
              if (hidden.length === i + 1) {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setHidden}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                    lastPostRef={lastPostRef}
                  />
                );
              } else {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setHidden}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                  />
                );
              }
            })}
        </>
      )}

      {feedLoading && page == 1 ? (
        selectedPage === "upvoted" ? (
          <Loading />
        ) : (
          <></>
        )
      ) : (
        <>
          {!isSinglePostSelected &&
            selectedPage === "upvoted" &&
            upvoted.map((post, i) => {
              if (upvoted.length === i + 1) {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setUpvoted}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                    lastPostRef={lastPostRef}
                  />
                );
              } else {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setUpvoted}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                  />
                );
              }
            })}
        </>
      )}

      {feedLoading && page == 1 ? (
        selectedPage === "downvoted" ? (
          <Loading />
        ) : (
          <></>
        )
      ) : (
        <>
          {!isSinglePostSelected &&
            selectedPage === "downvoted" &&
            downvoted.map((post, i) => {
              if (downvoted.length === i + 1) {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setDownvoted}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                    lastPostRef={lastPostRef}
                  />
                );
              } else {
                return (
                  <Post
                    id={post._id}
                    key={i}
                    setPosts={setDownvoted}
                    isSinglePostSelected={isSinglePostSelected}
                    {...post}
                  />
                );
              }
            })}
        </>
      )}

      <div className="mt-14">
        {!isSinglePostSelected && feedLoading && page != 1 && <Loading />}
      </div>

      {
        <div className="w-full h-6 mt-2">
          <div className="relative w-full h-full">
            <div className="text-gray-400 text-sm mt-1.5">
              <p className=" text-transparent">
                Tabgo corpus texo. Cicuta dsdsdsdddddddddddddsdsdsds
                dsdsdsddsdsdsdsffffffffffff in quaerat caveo corpus bellicus.
                Voluptates terror via curis deludo supra somniculosus bibo.
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default MyProfileFeed;
