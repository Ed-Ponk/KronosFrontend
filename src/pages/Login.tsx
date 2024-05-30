import React from 'react';
import LoginForm  from '../components/LoginForm';

const Login = () =>{
  return(
    <div className="flex flex-col items-center  h-full bg-gray-100">
      <div className="flex flex-col items-center py-20">
        <h1 className="text-3xl font-bold text-gray-800">Iniciar sesión</h1>
        <p className="text-gray-600 mt-2">Bienvenido de nuevo, inicia sesión para acceder a tu cuenta.</p>
      </div>

      <LoginForm />
    </div>
  );
}

export default Login;
