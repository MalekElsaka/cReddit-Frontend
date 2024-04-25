const ProfileHead = ({ imgSrc, displayName, userName }) => {
    return (
        <div className="flex flex-row items-center justify-start h-22 p-4 mt-4">
            <img src={imgSrc} alt="profile" className="w-19 h-19 rounded-full" />

            <div className="flex flex-col ml-4">
                <h1 className="text-white text-2xl font-bold">{displayName}</h1>
                <p className="text-gray-400 text-sm">u/{userName}</p>
            </div>
        </div>
    );
}

export default ProfileHead;