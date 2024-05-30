// PaginaPrincipal.jsx
import React, { useState, useEffect } from 'react';
import { FormJurado } from '../components/JuradoForm';
import TablaJurado from '../components/TablaJurado';
import axios from 'axios';

const Jurado = () => {
  const [jurados, setJurados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchJurados = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/jurados');
        setJurados(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchJurados();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Página Principal</h1>
      <FormJurado />
      <TablaJurado jurados={jurados} />
    </div>
  );
};

export default Jurado;
