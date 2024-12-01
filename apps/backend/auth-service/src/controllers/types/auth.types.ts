export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface VerifyUserRequest {
  username: string;
  confirmCode: string;
}
export interface SignInRequest {
  username: string;
  password: string;
}
