import Separator from '../sidebar/Nav-Icons/Separator';
import RecentRow from './RecentRow';
import Usercard from '../usercard/Usercard';
import { getRequest, deleteRequest } from '@/services/Requests';
import { useEffect, useState, useContext } from 'react';
import { baseUrl } from '@/constants';
import { UserContext } from '@/context/UserContext';
import { ServerContext } from '@/context/ServerContext';
import Loading from '../Loading/Loading';

const Recent = () => {
    const [recentPosts, setRecentPosts] = useState([]);
    const { isLoggedIn } = useContext(UserContext);
    const { setServerError } = useContext(ServerContext);
    useEffect(() => {
        async function getRecentPosts() {
            const response = await getRequest(`${baseUrl}/user/history`);
            if (response.status === 200 || response.status === 201) {
                setRecentPosts(response.data);
            } else {
                setRecentPosts([]);
            }
        }
        getRecentPosts();
    }, [isLoggedIn])

    async function handleClearRecentPosts() {
        const response = await deleteRequest(`${baseUrl}/user/clear-history`);
        if (response.status === 200 || response.status === 201) {
            setRecentPosts([]);
        } else {
            console.log("serverError is set");
            setServerError(true);
        }
    }

    if (!isLoggedIn) {
        return (<div className='  hidden lg:flex flex-col h-fit pt-3 pb-1 mb-10 rounded-2xl w-88 xl:w-82 ml-3 mt-9 mr-auto'></div>)
    }

    return (

        recentPosts.length !== 0 ? (

            <div className=' bg-reddit_darkRecent hidden lg:flex flex-col h-fit pt-3 pb-1 mb-10 rounded-2xl w-88 xl:w-82 ml-3 mt-9 mr-auto'>

                <div className=' h-6 w-full mb-2 flex items-center px-3 flex-row'>
                    <p className=' text-xs text-gray-400 font-medium lette tracking-widest '>RECENT POSTS</p>
                    <p onClick={handleClearRecentPosts} id="recent_posts_clear" className=' text-sm text-blue-400 font-normal cursor-pointer hover:underline lette no-select ml-auto '>Clear</p>
                </div>


                <div className=' space-y-4'>
                    {recentPosts.length !== 0 && recentPosts.map((post, index) => {
                        if (post.type === 'Poll') { return null; }
                        return (
                            <RecentRow key={index} id={post.postId} post={post} />
                        );
                    })}



                </div>
            </div>) :
            (<div className='hidden lg:flex flex-col h-fit pt-3 pb-1 mb-10 rounded-2xl w-88 xl:w-82 ml-3 mt-9 mr-auto'></div>)

    );
}

export default Recent; 