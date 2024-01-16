import { Tooltip } from "@mui/material"
import GenderEnum from "../Enum/GenderEnum"
import { Age, ChatIcon, CogIcon, FemaleIcon, HeartIcon, MaleIcon, Star4, UserIcon } from "./icons/Icons"
import '../styles/userCard.scss'
import { useNavigate } from "react-router"

const UserCard = ({ user, me, onLikeUser, selector = false, onClick, onBlockUser = undefined }) => {
	const navigate = useNavigate()
	console.log(user)
	if (user)
	return (
	<div className="user-card-item" onWheel={e => { e.currentTarget.scrollLeft += e.deltaY }} onClick={() => onClick(user.id)}>
		<img src={user.photos.find(photo => photo.main) ? `http://localhost:8000/${user.photos.find(photo => photo.main).path}` : null} className='background' alt="" />
		<div className="item-content">
			<div className="image">
				<img src={user.photos.find(photo => photo.main) ? `http://localhost:8000/${user.photos.find(photo => photo.main).path}` : null} alt="" />
			</div>
			<div className="name">{user.username}</div>
			<div className="limiter" />
			<div className="info">
				<div className="icon">
					<UserIcon />
				</div>
				<div className="text">
					{user.firstName}
				</div>
				<div className="text">
					{user.lastName}
				</div>
			</div>
			<div className="limiter" />
			<div className="info">
				<div className="icon">
					<Age />
				</div>
				<div className="text">
					{user.age}
				</div>
			</div>
			<div className="limiter" />
			<div className="info">
				<div className="icon">
					<Star4 />
				</div>
				<div className="text">
					{user.fame_rate}
				</div>
			</div>
			<div className="limiter" />
			<div className="info">
				<div className="icon">
					{user.gender == GenderEnum.MALE ? <MaleIcon /> : <FemaleIcon />}
				</div>
			</div>
			<div className="limiter" />
			<div className="info">
				<div className="text">
					{user.status}
				</div>
			</div>
			{!selector &&
				<div className="actions">
					{onBlockUser && <Tooltip title={"Block"}>
						<div className="like" onClick={() => onBlockUser(user.id)}>
							<CogIcon />
						</div>
					</Tooltip>}
					<Tooltip title="chat">
					{me.matches.find(match => match.user_A_id == user.id || match.user_B_id == user.id) != undefined &&
						<div className="like" onClick={() => {navigate(`/chat/${user.id}`)}}>
							<ChatIcon />
						</div>
					}
					</Tooltip>
					<Tooltip title={me.likes.find(like => like.user_target_id == user.id) ? "Un-like" : me.matches.find(match => match.user_A_id == user.id || match.user_B_id == user.id) ? "un-match" : "Like"}>
						<div className="like" onClick={() => onLikeUser(user.id)}>
							<HeartIcon />
						</div>
					</Tooltip>
			</div>
}
		</div>
	</div>)
	}

export default UserCard;
