
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'jurado';
  token: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}


export interface UpdateUserProfile {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserList {
  users: User[];
}

