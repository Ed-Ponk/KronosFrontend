import React, { useState ,useEffect} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import httpClient from '../hooks/httpClient';
import { useUser } from '../contexts/UserContext';
import { User } from '../types/User';

const LoginForm: React.FC = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay una sesión activa y redirigir al usuario si es necesario
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const userData: User = JSON.parse(storedUser);
      navigate(userData.rol === 'ADMINISTRADOR' ? '/admin' : '/jurado');
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    
    event.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    try {
      const resp = await httpClient.post("http://127.0.0.1:5000/usuarios/validar-login", {
        email,
        password,
      },{ withCredentials: true });
      console.log(resp.data)

      if(resp.data.status == false){
        
        if (resp.data.message === 'El usuario no existe') {
          setEmailError('El usuario no existe');
        } else if (resp.data.message === 'Contraseña incorrecta') {
          setPasswordError('Contraseña incorrecta');
        } else {
          setGeneralError(resp.data.message);
        }
       
      }else{
        const userData: User = {
          id: resp.data.usuario_id,
          email: resp.data.email,
          rol: resp.data.rol
        };
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        navigate(resp.data.rol === 'ADMINISTRADOR' ? '/admin' : '/jurado');
       
      }

      
    } catch (error) {
      setGeneralError('Error en la comunicación con el servidor. Inténtalo de nuevo más tarde.');
    }
  };

  

  return (
    <div className="w-96 h-auto bg-white rounded-xl shadow-md px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-16 w-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Logo_USAT.png"
          alt="Your Company"
        />
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Iniciar sesión en su cuenta
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Correo Electrónico
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder='correo@correo.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 p-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${emailError ? 'ring-red-500' : 'focus:ring-indigo-600'} sm:text-sm sm:leading-6`}
              />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Contraseña
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-md p-1 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${passwordError ? 'ring-red-500' : 'focus:ring-indigo-600'} sm:text-sm sm:leading-6`}
              />
              {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
            </div>
          </div>

          <div>
            {generalError && <p className="text-red-600 text-sm mb-4">{generalError}</p>}
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
