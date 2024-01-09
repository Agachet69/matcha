import { object, string, number, array, lazy, mixed } from "yup";

const LoginSchema = () =>
	object().shape({
		username: string()
			.min(3, "Username must have at least 3 characters.")
			.max(50, "Username length must be less than 50 long.")
			.required("Username is required.").test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ] [0-9] and '_'", value => /^[a-zA-Z0-9_]+$/.test(value)),
		password: string().required("Password is required.")
			// .min(8, "Password must have at least 8 characters.")
			// .test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ] [0-9] and !@#$%^&*()_\-+=\{\}\[\]|\\:;'\"<>,.?\/", value => /^[a-zA-Z0-9!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]+$/.test(value))
			// .test("atLeastOneMaj", "Password must contain at least one upper character.", value => /[A-Z]/.test(value))
			// .test("atLeastOneNumber", "Password must contain at least one number.", value => /[0-9]/.test(value))
			// .test("atLeastOneSpecial", "Password must contain at least one special characters.", value => /[!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]/.test(value))
		,
	})

export default LoginSchema;