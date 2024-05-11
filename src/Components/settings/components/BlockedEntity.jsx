import React from "react";
import moment from "moment";

// user profile picture is still to be added
function BlockedEntity({ entityName, timestamp, onUnblock }) {
  const timeAgo = moment(timestamp).fromNow();

  return (
    <div
      id={entityName}
      data-testid={entityName}
      className="flex flex-row mt-4 text-white font-plex"
    >
      <div className="w-full flex flex-row justify-start items-center">
        <h3 className="text-sm mr-2 pb-0.5">{entityName}</h3>
        <h6 className="text-xs text-gray-500">{timeAgo}</h6>
        <button
          className="bg-reddit_greenyDark ml-auto rounded-r-md font-bold text-sm"
          onClick={onUnblock}
        >
          REMOVE
        </button>
      </div>
    </div>
  );
}
export default BlockedEntity;
