import { object, string, number, array, lazy, mixed } from "yup";

const ChangePasswordSchema = () =>
  object().shape({
    last_password: string().required("Last password is required."),
    // .min(8, "Last password must have at least 8 characters.")
    // .max(256, "Last password length must be less than 256 long.")
    // .test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ] [0-9] and !@#$%^&*()_\-+=\{\}\[\]|\\:;'\"<>,.?\/", value => /^[a-zA-Z0-9!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]+$/.test(value))
    // .test("atLeastOneMaj", "Last password must contain at least one upper character.", value => /[A-Z]/.test(value))
    // .test("atLeastOneNumber", "Last password must contain at least one number.", value => /[0-9]/.test(value))
    // .test("atLeastOneSpecial", "Last password must contain at least one special characters.", value => /[!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]/.test(value))
    new_password: string().required("New password is required."),
    // .min(8, "New password must have at least 8 characters.")
    // .max(256, "New password length must be less than 256 long.")
    // .test("onlyASCIIAndUnderScore", "The only characters allowed are [aA-zZ] [0-9] and !@#$%^&*()_\-+=\{\}\[\]|\\:;'\"<>,.?\/", value => /^[a-zA-Z0-9!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]+$/.test(value))
    // .test("atLeastOneMaj", "New password must contain at least one upper character.", value => /[A-Z]/.test(value))
    // .test("atLeastOneNumber", "New password must contain at least one number.", value => /[0-9]/.test(value))
    // .test("atLeastOneSpecial", "New password must contain at least one special characters.", value => /[!@#$%^&*()_\-+=\{\}\[\]|\\:;'"<>,.?\/]/.test(value))
  });

export default ChangePasswordSchema;