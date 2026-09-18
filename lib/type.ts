export type LoginState ={
    success:boolean,
    message:string
}
export type RegistrationPayload = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  profilePhoto?: string | null;
};
 export type RegistrationState = {
  error?: string | null;
  success?: boolean;
  message?:string 
};
export type IULoging = {

  email: string;
  password: string;

};


export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  image?: FileList;
};