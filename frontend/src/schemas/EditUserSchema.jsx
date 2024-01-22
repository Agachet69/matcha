import { object, string, number, array, lazy, mixed } from "yup";
import GenderEnum from "../Enum/GenderEnum";
import SexualityEnum from "../Enum/SexualityEnum";

const EditUserSchema = () =>
  object().shape({
    username: string()
      .min(3, "Username must have at least 3 characters.")
      .max(30, "Username length must be less than 30 long.")
      .required("Username is required.")
      .test(
        "onlyASCIIAndUnderScore",
        "The only characters allowed are [aA-zZ] [0-9] and '_'",
        (value) => /^[a-zA-Z0-9_]+$/.test(value)
      ),
    lastName: string()
      .min(3, "Last name must have at least 3 characters.")
      .max(30, "Last name length must be less than 30 long.")
      .required("Last name is required.")
      .test(
        "onlyASCIIAndUnderScore",
        "The only characters allowed are [aA-zZ]",
        (value) => /^[a-zA-Z0-9_]+$/.test(value)
      ),
    firstName: string()
      .min(3, "First name must have at least 3 characters.")
      .max(30, "First name length must be less than 30 long.")
      .required("First name is required.")
      .test(
        "onlyASCIIAndUnderScore",
        "The only characters allowed are [aA-zZ]",
        (value) => /^[a-zA-Z]+$/.test(value)
      ),
    email: string()
      .email("Invalid email format.")
      .required("Email is required."),
    age: number()
      .min(18, "Wait for ur majority!")
      .max(122, "Call the Guinness Book, you've broken a record!")
      .required("Age is required."),
    gender: string()
      .oneOf(Object.keys(GenderEnum), "Gender is not good.")
      .required("Gender is required."),
    sexuality: string()
      .oneOf(Object.keys(SexualityEnum), "Sexuality is not good.")
      .required("Sexuality is required."),
    bio: string().max(400, "Bio length must be less than 400 long."),
  });

export default EditUserSchema;
