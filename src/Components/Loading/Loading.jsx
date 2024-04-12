import LoadingGift from '../../assets/Loading.gif';
import RedditLogo from '../../assets/reddit_logo.svg';
const Loading = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <img src={RedditLogo} alt="Reddit Logo" className="h-17 w-14" />
            <img src={LoadingGift} alt="Loading" className='h-8 w-17' />
        </div>
    );
}

export default Loading;