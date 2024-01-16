import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialiseUser, selectUser } from "../../store/slices/userSlice";
import { BoltIcon, Cancel, CheckBadgeIcon, Trash, UnBoltIcon } from "../icons/Icons";
import "../../styles/otherProfil/relation.scss";
import { addLike } from "../../services/like";
import { getToken } from "../../store/slices/authSlice";

const Relation = ({ userSeen }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(getToken);
  const [hoverElement, setHoverElement] = useState(false);

  async function addMyCrush() {
    try {
      const res = await addLike(userSeen.id, token);
      dispatch(initialiseUser(res.data));
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'appel :", error);
    }
  }

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

  if (isMatched())
    return (
      <div
        onClick={addMyCrush}
        className={
          !hoverElement ? "matchContainer" : "matchContainer deleteContainer"
        }
        onMouseEnter={() => setHoverElement(true)}
        onMouseLeave={() => setHoverElement(false)}
      >
        <div className="match">
          <CheckBadgeIcon />
          <p> match </p>
        </div>
        <div className="delete">
          <Cancel />
          <p> Supprimer ce match </p>
        </div>
      </div>
    );
  else if (hasMyCrush())
    return (
      <div
        onClick={addMyCrush}
        className={
          !hoverElement ? "matchContainer" : "matchContainer deleteContainer"
        }
        onMouseEnter={() => setHoverElement(true)}
        onMouseLeave={() => setHoverElement(false)}
      >
        <div className="match">
          <BoltIcon />
          <p> It&apos;s your crush </p>
        </div>
        <div className="delete">
          <UnBoltIcon />
          <p> Supprimer ce crush </p>
        </div>
      </div>
    );
  else if (hasCrushOnme())
    return (
      <div
        onClick={addMyCrush}
        className={
          !hoverElement ? "matchContainer" : "matchContainer addCrushContainer"
        }
        onMouseEnter={() => setHoverElement(true)}
        onMouseLeave={() => setHoverElement(false)}
      >
        <div className="match">
          <BoltIcon />
          <p> crush on you </p>
        </div>
        <div className="addCrush">
          <CheckBadgeIcon />
          <p> match with {userSeen.username} </p>
        </div>
      </div>
    );
  else
    return (
      <div className="addCrush" onClick={addMyCrush}>
        <BoltIcon />
        <p> start crush on {userSeen.username}? </p>
      </div>
    );
};

export default Relation;
