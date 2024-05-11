import killbill from "@/assets/kill_bill.jpg";

/**
 * Represents a scheduled post displayed in the inbox.
 * @param {Object} props - Component props.
 * @param {string} props.username - The username of the sender.
 * @param {string} props.content - The content of the message.
 * @param {string} props.title - The title of the scheduled post.
 * @param {boolean} props.isSpoiler - Indicates if the post is marked as a spoiler.
 * @param {boolean} props.isNsfw - Indicates if the post is marked as NSFW (Not Safe For Work).
 * @returns {JSX.Element} A React component representing a scheduled post.
 */
const ScheduledPost = ({ username, content, title, isSpoiler, isNsfw }) => {
  return (
    <div className="flex flex-col h-fit w-1/2 ">
      <div className="flex flex-row items-center h-7 mb-2 w-full">
        <img
          className="w-6 min-w-6 h-6 rounded-full mr-2"
          src={killbill}
          alt=""
        />

        <h1 className="text-gray-400 min-w-fit text-[13px] tracking-wide font-medium">
          u/{username}
        </h1>
      </div>

      <div className="flex flex-row items-center h-6 mb-2 w-full">
        {isNsfw && (
          <div className="flex flex-row">
            <svg
              rpl=""
              fill="#C60E88"
              height="16"
              icon-name="nsfw-fill"
              viewBox="0 0 20 20"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 10.967a1.593 1.593 0 0 0-1.363 0 1.2 1.2 0 0 0-.475.414 1.02 1.02 0 0 0-.173.576.967.967 0 0 0 .18.574c.122.172.29.307.482.393.21.095.438.143.668.14a1.51 1.51 0 0 0 .671-.146 1.2 1.2 0 0 0 .475-.4.985.985 0 0 0 .173-.569 1.024 1.024 0 0 0-.17-.57 1.2 1.2 0 0 0-.469-.412Z"></path>
              <path d="M11.747 9.227c.177.095.374.143.574.14.2.003.396-.045.572-.14a1.057 1.057 0 0 0 .402-1.462.984.984 0 0 0-.406-.37 1.317 1.317 0 0 0-1.137 0 1 1 0 0 0-.557.902 1.047 1.047 0 0 0 .551.932l.001-.002Z"></path>
              <path d="M18.636 6.73 13.27 1.363a4.634 4.634 0 0 0-6.542 0L1.364 6.73a4.627 4.627 0 0 0 0 6.542l5.365 5.365a4.633 4.633 0 0 0 6.542 0l5.366-5.365a4.634 4.634 0 0 0 0-6.542ZM8.204 14.5H6.288V8.277L4.648 9V7.23l2.988-1.367h.568V14.5Zm6.862-1.148c-.29.4-.683.714-1.136.912a4.11 4.11 0 0 1-3.24-.006 2.8 2.8 0 0 1-1.134-.918 2.172 2.172 0 0 1-.41-1.283c0-.42.12-.83.345-1.184a2.6 2.6 0 0 1 .944-.879 2.488 2.488 0 0 1-.636-.832c-.152-.32-.23-.67-.229-1.025a2.117 2.117 0 0 1 .378-1.248c.256-.362.604-.65 1.008-.832.43-.198.9-.298 1.374-.293.474-.004.942.099 1.371.3.403.182.749.47 1 .834.249.368.378.804.37 1.248a2.371 2.371 0 0 1-.868 1.851c.383.21.708.51.944.877a2.24 2.24 0 0 1-.074 2.481l-.007-.003Z"></path>
            </svg>

            <h1 className="font-semibold text-[13px] ml-1 text-[#C60E88] uppercase">
              NSFW
            </h1>
          </div>
        )}

        {isSpoiler && (
          <div className="flex ml-3 flex-row">
            <svg
              rpl=""
              fill="red"
              height="16"
              icon-name="spoiler-fill"
              viewBox="0 0 20 20"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m18.628 6.73-5.364-5.365a4.626 4.626 0 0 0-6.542 0L1.355 6.73a4.634 4.634 0 0 0 0 6.542l5.367 5.365a4.627 4.627 0 0 0 6.542 0l5.364-5.365a4.627 4.627 0 0 0 0-6.542ZM11.162 5l-.28 6.747H9.117L8.837 5h2.325Zm-.038 9.536a1.29 1.29 0 0 1-.462.472 1.24 1.24 0 0 1-.655.178 1.286 1.286 0 1 1 1.117-.65Z"></path>
            </svg>

            <h1 className="font-semibold text-[13px] ml-1 text-red-600 uppercase">
              Spoiler
            </h1>
          </div>
        )}
      </div>

      <h1 className="text-gray-200 mb-[9px] text-[16px] font-medium">
        {title}
      </h1>

      <p className="text-gray-400 text-[14px] ">{content}</p>
    </div>
  );
};

export default ScheduledPost;
