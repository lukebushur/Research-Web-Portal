export interface SignupBody {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  universityLocation?: string | null;
  accountType?: number | null;
  GPA?: string | null;
  Major?: string | null;
};

export interface LoginBody {
  email?: string | null;
  password?: string | null;
};

export interface ConfirmResetPasswordBody {
  email: string | null;
  passwordResetToken: string | null;
  provisionalPassword?: string | null;
};
