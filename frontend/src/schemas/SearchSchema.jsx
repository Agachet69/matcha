import { object, string, number, array, lazy, mixed } from "yup";
import GenderEnum from "../Enum/GenderEnum";
import SexualityEnum from "../Enum/SexualityEnum";

const RegisterSchema = () =>
	object().shape({
		age_limit: object().notRequired().shape({
			min: number().required().min(18, "Min value is 18").max(99, "Max value is 99").notRequired(),
			max: number().required().min(18, "Min value is 18").max(99, "Max value is 99").notRequired()
		}),
		fame_rate_limit: object().notRequired().shape({
			min: number().required().min(0, "Min value is 0").max(999, "Max value is 999").notRequired(),
			max: number().required().min(0, "Min value is 0").max(999, "Max value is 999").notRequired()
		}),
		location_limit: object().notRequired().shape({
			min: number().required().min(0, "Min value is 0").max(500, "Max value is 500").notRequired(),
			max: number().required().min(0, "Min value is 0").max(500, "Max value is 500").notRequired()
		}),
		tags: array().notRequired()
	})

export default RegisterSchema;