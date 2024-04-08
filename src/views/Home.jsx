import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/navbar/Navbar';
import Sidebar from '../Components/sidebar/Sidebar';
import Mainfeed from '../Components/mainfeed/Mainfeed';
import Recent from '../Components/mainfeed/Recent';
import { getRequest } from '@/services/Requests';
import { baseUrl } from '@/constants';
import CreateCommunity from '../Components/createCommunity/CreateCommunity';
import { UserContext } from '@/context/UserContext';
import { useState, useEffect, useRef, useContext } from 'react';


const Home = ({ isVisibleLeftSidebar, setIsVisibleLeftSidebar, navbarRef }) => {
    const [isCommunityOpen, setIsCommunityOpen] = useState(false);
    const [userHistoryRes, setUserHistoryRes] = useState(null);
    const { isLoggedIn } = useContext(UserContext);
    const sidebarRef = useRef();
    const recentRef = useRef();
    const mainfeedRef = useRef();
    const communiyCardRef = useRef();
    const communityButtonRef = useRef();

    useEffect(() => {
        async function getHistory() {
            const response = await getRequest(`${baseUrl}/user/history`);
            setUserHistoryRes(response);
            if (response.status == 200 || response.status == 201)
                localStorage.setItem('userHistory', JSON.stringify(response.data));
            else
                localStorage.setItem('userHistory',(null));
        }
        getHistory();
    }, [isLoggedIn])

    useEffect(() => {
        let handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)
                && navbarRef.current && !navbarRef.current.contains(e.target)) {
                setIsVisibleLeftSidebar(false);
            }
            if (communiyCardRef.current && !communiyCardRef.current.contains(e.target)
                && communityButtonRef.current && !communityButtonRef.current.contains(e.target)) {
                setIsCommunityOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1200px)');

        const handleResize = () => {
            if (mediaQuery.matches) {
                setIsVisibleLeftSidebar(false);
            }
        };

        mediaQuery.addEventListener('change', handleResize);
        handleResize();

        return () => mediaQuery.removeEventListener('change', handleResize);
    });

    useEffect(() => { //Todo: Optimize the code of handling the disappearing of scrolling
        let timer = null;

        const handleScroll = () => {
            clearTimeout(timer);

            if (!recentRef.current.classList.contains('scrolling')) {
                recentRef.current.classList.add('scrolling');
            }

            if (!sidebarRef.current.classList.contains('scrolling')) {
                sidebarRef.current.classList.add('scrolling');
            }

            if (!mainfeedRef.current.classList.contains('scrolling')) {
                mainfeedRef.current.classList.add('scrolling');
            }

            timer = setTimeout(function () {
                if (recentRef.current.classList.contains('scrolling')) {
                    recentRef.current.classList.remove('scrolling');
                }
                if (sidebarRef.current.classList.contains('scrolling')) {
                    sidebarRef.current.classList.remove('scrolling');
                }
                if (mainfeedRef.current.classList.contains('scrolling')) {
                    mainfeedRef.current.classList.remove('scrolling');
                }
            }, 440);
        };

        recentRef.current.addEventListener('scroll', handleScroll);
        sidebarRef.current.addEventListener('scroll', handleScroll);
        mainfeedRef.current.addEventListener('scroll', handleScroll);

        return () => {
            if (recentRef.current) {
                recentRef.current.removeEventListener('scroll', handleScroll);
            }
            if (sidebarRef.current) {
                sidebarRef.current.removeEventListener('scroll', handleScroll);
            }
            if (mainfeedRef.current) {
                mainfeedRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    });
    return (
        <>

            <div className="w-full mt-14 inline-flex flex-row justify-center overflow-hidden">

                <div className={`relative flex flex-row w-fit xl:ml-2 lg:mr-5 xl:mr-2% mxl:mr-4 h-full`}>

                    <div ref={sidebarRef} className={`h-full ${isVisibleLeftSidebar ? 'absolute xl:relative xl:flex  bg-reddit_navbar w-70' : 'hidden xl:flex'} z-10 mt-2 w-68 min-w-60 border-r border-neutral-800 pt-2 mr-2 no-select ml-auto overflow-auto scrollbar_mod overflow-x-hidden`}>
                        <Sidebar setIsCommunityOpen={setIsCommunityOpen} communityButtonRef={communityButtonRef} setIsVisibleLeftSidebar={setIsVisibleLeftSidebar} userHistoryRes={userHistoryRes} />
                    </div>
                    <div className="">
                        {isCommunityOpen && <CreateCommunity setIsCommunityOpen={setIsCommunityOpen} communityCardRef={communiyCardRef} />}
                    </div>

                    <div className='mxl:w-192 mt-2 flex flex-row flex-grow lg:flex-grow-0 xl:ml-0 w-65% xl:w-51% mr-2 ml-1 lg:ml-2 lg:mr-2 ' ref={mainfeedRef}>
                        <Mainfeed />
                    </div>

                    <div className='w-fit min-w-fit h-full overflow-auto overflow-x-hidden scrollbar_mod' ref={recentRef}>
                        <Recent userHistoryRes={userHistoryRes} />
                    </div>

                </div>

            </div >
        </>




    );
}

export default Home;