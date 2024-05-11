import { baseUrl } from "../../../constants";
import {
  getRequest,
  postRequestImg,
  patchRequest,
} from "../../../services/Requests";

export async function submitComment(postId, image, text) {
  let url = `${baseUrl}/comment`;

  const formData = new FormData();
  formData.append("postId", postId);

  if (!image) formData.append("content", text);
  else formData.append("images", image);

  let res = await postRequestImg(url, formData);
  if (res.status !== 200 && res.status != 201) {
    setIsPaginationLoading(false);
    return null;
  }

  res = await getRequest(`${baseUrl}/comment/${res.data.commentId}`);
  if (res.status != 200 && res.status != 201) return null;

  const newComment = res.data;
  return newComment;
}

export async function UpDownVoteComment(commentId, voteType) {
  const url = `${baseUrl}/post/${commentId}/${true ? "upvote" : "downvote"}`;
  const res = await patchRequest(url);
  return res.status === 200 || res.status === 201;
}

export async function Save(commentId, isSaved) {
  const url = `${baseUrl}/post/${commentId}/save`;
  const res = await patchRequest(url, { isSaved: !isSaved });
  return res.status === 200 || res.status === 201;
}
