
export interface User {
  id: number;
  email: string;
  rol: 'Administrador' | 'Jurado';
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

