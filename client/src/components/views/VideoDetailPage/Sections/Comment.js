import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const [commentValue, setcommentValue] = useState()
    const user = useSelector(state => state.user);
    const videoId = props.postId;

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variable = {
            writer: user.userData._id,
            postId: videoId,
            content: commentValue
        }

        Axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if (response.data.success) {
                    setcommentValue("")
                    props.refreshFunction(response.data.result);
                } else {
                    alert('코멘트를 저장하지 못 했습니다.');
                }
            });

    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}

            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && 
                    <React.Fragment key={index}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                        <ReplyComment parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists} />
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
