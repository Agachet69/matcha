import { forwardRef, useEffect } from "react"
import { useSocket } from "./PrivateRoutes"
import { SnackbarProvider, enqueueSnackbar, closeSnackbar, SnackbarContent } from 'notistack'
import '../styles/SnackBarsManager.scss'
import { CrossIcon, UserIcon } from "../components/icons/Icons"
import { Tooltip } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { initialiseUser } from "../store/slices/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { getToken } from "../store/slices/authSlice"
import axios from "axios"

export const getActions = (notif_type, data_user_id) => id => {
	const navigate = useNavigate()
	return (<>
		{(notif_type == 'LIKE' || notif_type == 'MATCH') &&
			<Tooltip title='view profile'>
				<div className="snackbar-icon" onClick={() => { navigate(`/profil/${data_user_id}`) }}>
					<UserIcon />
				</div>
			</Tooltip>}

		<Tooltip title='close'>
			<div className="snackbar-icon" onClick={() => { closeSnackbar(id) }}>
				<CrossIcon />
			</div>
		</Tooltip>

	</>)
}

const SnackBarsManager = () => {
	const socket = useSocket()
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const getMe = () => axios.get("http://localhost:8000/users/me", {
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
	}).then(({ data }) => {
		dispatch(initialiseUser(data));
	}).catch((error) => {
		navigate("/login")
	})

	useEffect(() => {
		if (socket)
			socket.on('add-notification', ({ type, data, data_user_id }) => {
				getMe()
				enqueueSnackbar(data, {
					variant: 'info', action: getActions(type, data_user_id)
				})
			}
			)
	}, [socket])

	return <>
		<SnackbarProvider
			className="provider"
			hideIconVariant
			preventDuplicate
			maxSnack={10}
			action={(snackbarId) => (
				<button onClick={() => closeSnackbar(snackbarId)}>
					Dismiss
				</button>
			)} />
	</>
}

export default SnackBarsManager