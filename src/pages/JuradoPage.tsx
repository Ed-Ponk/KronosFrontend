import React, { useState, useEffect } from 'react';
import { FormJurado } from '../components/jurado/JuradoForm';
import TablaJurado from '../components/jurado/TablaJurado';
import axios from 'axios';
import { User } from '../types/User';
import httpClient from '../hooks/httpClient';

const JuradoPage = () =>{
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("http://127.0.0.1:5000/usuarios/session", { withCredentials: true });
        console.log(resp)
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);


  
  if (!user) {
    return (
      <div>
        <p>Usted no se ha identificado</p>
        <div>
          <a href="/login">
            <button>Login</button>
          </a>
         
        </div>
      </div>
    );
  }

  if (user.rol !== 'Jurado') {
    return (
      <div>
        <p>No tiene permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <div className='flex-1 flex flex-col'>
        <FormJurado />
        <TablaJurado />
      </div>
    </div>
  );
};

export default JuradoPage;
