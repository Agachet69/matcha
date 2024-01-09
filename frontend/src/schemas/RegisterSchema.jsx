import { object, string, number, array, lazy, mixed } from "yup";
import GenderEnum from "../Enum/GenderEnum";
import SexualityEnum from "../Enum/SexualityEnum";

const RegisterSchema = () =>
	object().shape({
		username: string()
			.min(3, "Username must have at least 3 characters.")
			.max(50, "Username length must be less than 50 long.")
			.required("Username is required.").test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ] [0-9] and '_'", value => /^[a-zA-Z0-9_]+$/.test(value)),
		lastName: string()
			.min(3, "Last Name must have at least 3 characters.")
			.max(50, "Last Name length must be less than 50 long.")
			.required("Last Name is required.").test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ]", value => /^[a-zA-Z0-9_]+$/.test(value)),
		firstName: string()
			.min(3, "First Name must have at least 3 characters.")
			.max(50, "First Name length must be less than 50 long.")
			.required("First Name is required.").test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ]", value => /^[a-zA-Z]+$/.test(value)),
		gender: string().oneOf(Object.keys(GenderEnum), "Gender is not good.").required("Gender is required."),
		sexuality: string().oneOf(Object.keys(SexualityEnum), "Sexuality is not good.").required("Sexuality is required."),
		bio: string().max(400, "Bio length must be less than 400 long."),
		password: string().required("Password is required.")
			// .min(8, "Password must have at least 8 characters.")
			// .test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ] [0-9] and !@#$%^&*()_\-+=\{\}\[\]|\\:;'\"<>,.?\/", value => /^[a-zA-Z0-9!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]+$/.test(value))
			// .test("atLeastOneMaj", "Password must contain at least one upper character.", value => /[A-Z]/.test(value))
			// .test("atLeastOneNumber", "Password must contain at least one number.", value => /[0-9]/.test(value))
			// .test("atLeastOneSpecial", "Password must contain at least one special characters.", value => /[!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]/.test(value))
		,
		age: number().min(18, 'Wait for ur majority!').required('Age is required.'),
		email: string().email('Invalid email format.').required('Email is required.'),

	})

export default RegisterSchema;