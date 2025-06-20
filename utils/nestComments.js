function nestComments(flatComments) {
  const commentMap = {};
  const roots = [];

  flatComments.forEach(comment => {
    comment.replies = [];
    commentMap[comment.id] = comment;
  });

  flatComments.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentMap[comment.parent_id];
      if (parent) parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

module.exports = nestComments;
