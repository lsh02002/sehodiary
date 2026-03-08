import React, { useEffect, useState } from "react";
import { getCommentsByUserApi } from "../../api/sehodiary-api";
import { CommentResponseType } from "../../types/type";
import CommentCard1 from "../../components/card/CommentCard1";

const MyComments = () => {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    getCommentsByUserApi()
      .then((res) => {
        console.log(res);
        setCommentList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <h4 style={{ marginBottom: "20px" }}>
        내가쓴댓글({commentList?.length})
      </h4>
      {commentList && commentList?.length > 0 ? (
        commentList?.map((comment: CommentResponseType) => (
          <CommentCard1 key={comment?.commentId} comment={comment} />
        ))
      ) : (
        <div>해당 댓글이 없습니다!</div>
      )}
    </>
  );
};

export default MyComments;
