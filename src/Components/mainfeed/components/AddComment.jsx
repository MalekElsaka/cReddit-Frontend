import CommentSection from "./CommentSection";

function AddComment({ postId, isCommenting, setIsCommenting, onAddComment }) {
  return (
    <div className="w-full mt-2 inline-flex flex-row  justify-center">
      <button
        className="w-full h-10 bg-greenyDark flex flex-row items-center rounded-3xl border border-gray-600 font-plex"
        hidden={isCommenting}
        onClick={() => {
          setIsCommenting(true);
        }}
      >
        <p className="text-gray-600 text-sm ml-5">Add Comment</p>
      </button>

      <CommentSection
        postId={postId}
        onAddComment={onAddComment}
        isCommenting={isCommenting}
        setIsCommenting={setIsCommenting}
      />
    </div>
  );
}

export default AddComment;