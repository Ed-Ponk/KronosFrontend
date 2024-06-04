
export interface User {
  id: number;
  email: string;
  rol: 'ADMINISTRADOR' | 'JURADO';
}

export interface LoginResponse {
  email: User;
  password: string;
}


export interface UpdateUserProfile {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserList {
  users: User[];
}

