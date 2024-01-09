import { object, string, number, array, lazy, mixed } from "yup";

const MessageSchema = () =>
	object().shape({
		message: string().required('Message is required.')
			.min(1, "Message must have at least 0 characters.")
			.max(128, "Message length must be less than 128 long."),
	})

export default MessageSchema;