import React, { useState, useEffect } from 'react';
import TableUsuario from '../components/Usuario/TableUsuario';
import FormUsuario from '../components/Usuario/FormUsuario';
import axios from 'axios';

type DataItem = {
  usuario_id: number;
  email: string;
  clave: string;
  estado: string;
  jurado_id: string;
  rol: string;
};

const UsuariosPage: React.FC = () => {
  const [selectedUsuario, setSelectedUsuario] = useState<DataItem | null>(null);
  const [records, setRecords] = useState<DataItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/usuarios');
      setRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Llama a la función fetchData al montar el componente
  }, []);

  return (
    <div className='w-full h-full md:w-auto bg-gray-100 '>
       <FormUsuario selectedUsuario={selectedUsuario} setSelectedUsuario={setSelectedUsuario} fetchData={fetchData} />
      <TableUsuario setSelectedUsuario={setSelectedUsuario} records={records} fetchData={fetchData} />
     
    </div>
  );
};

export default UsuariosPage;
