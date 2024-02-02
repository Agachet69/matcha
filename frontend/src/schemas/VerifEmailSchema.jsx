import { object, string, number, array, lazy, mixed } from "yup";

const VerifEmailSchema = () =>
  object().shape({
    code: string().required('Code is required.')
  });

export default VerifEmailSchema;