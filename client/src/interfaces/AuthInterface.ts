export interface UserDetails {
  account_type?: "student" | "personnel";
  user: {
    user_id: number;
    student_id?: number;
    personnel_id?: number;
    profile_picture?: string | null;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix_name?: string;
    role?: {
      role_id: number;
      role: string;
    };
    birth_date: string;
    age: string;
    username: string;
  };
  token?: string;
}

export interface LoginCredentialsErrorFields {
  username?: string[];
  password?: string[];
}
