import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";

const Relation = ({ userSeen }) => {
  const user = useSelector(selectUser);

  const isMatched = () => {
    if (
      user.matches.filter((match) => {
        if (
          (match.user_A_id === user.id || match.user_A_id === userSeen.id) &&
          (match.user_B_id === user.id || match.user_B_id === userSeen.id)
        )
          return match;
      }).length > 0
    )
      return true;
    return false;
  };

  const hasMyCrush = () => {
    return user.likes.some((like) => like.user_target_id === userSeen.id);
  };

  const hasCrushOnme = () => {
    return userSeen.likes.some((like) => like.user_target_id === user.id);
  };

  if (isMatched()) return <div>C'est un match !</div>;
  else if (hasMyCrush()) return <div onClick={isMatched}>je t'ai like</div>;
  else if (hasCrushOnme()) return <div> a un crush on me</div>;
  else return <div>Rien du tout</div>;
};

export default Relation;
