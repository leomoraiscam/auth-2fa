interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  sign_in_attempts?: number;
  forgot_password_attempts?: number;
}

export default ICreateUserDTO;
