export interface LoginBody {
  email?: string | null;
  password?: string | null;
}

export interface ConfirmResetPasswordBody {
  email: string | null;
  passwordResetToken: string | null;
  provisionalPassword?: string | null;
}
