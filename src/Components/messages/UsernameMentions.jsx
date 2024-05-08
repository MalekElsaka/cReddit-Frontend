import React, { useState, useEffect } from "react";
import { getRequest } from "@/services/Requests";
import { baseUrl, messagesLimit } from "@/constants";
import MessagesInbox from "./MessagesInbox";
import Pagination from "./Pagination";

/**
 * Component for displaying messages with username mentions.
 * @returns {JSX.Element} JSX element representing the username mentions component.
 */
const UsernameMentions = () => {
  const [usernameMentions, setUsernameMentions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreContent, setHasMoreContent] = useState(false);

  useEffect(() => {
    /**
     * Fetch messages with username mentions from the server.
     */
    const getUsernameMentions = async () => {
      try {
        const response = await getRequest(
          `${baseUrl}/message/username-mentions?page=${currentPage}&limit=${messagesLimit}`
        );
        if (response.status === 200 || response.status === 201) {
          setUsernameMentions(response.data);
          setHasMoreContent(response.data.length === messagesLimit);
        }
      } catch (error) {
        console.error("Error fetching username mentions:", error);
      }
    };
    getUsernameMentions();
  }, [currentPage]);

  /**
   * Moves to the next page of messages with username mentions.
   */
  const nextPage = () => {
    if (hasMoreContent) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Moves to the previous page of messages with username mentions.
   */
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div id="username-mentions">
      <div className="flex flex-col justify-center items-center">
        {usernameMentions.map((message, index) => (
          <MessagesInbox
            key={index}
            id={message._id}
            from={message.from}
            to={message.to}
            subject={message.subject}
            text={message.text}
            isRead={message.isRead}
            isDeleted={message.isDeleted}
            createdAt={message.createdAt}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        hasMoreContent={hasMoreContent}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};

export default UsernameMentions;
