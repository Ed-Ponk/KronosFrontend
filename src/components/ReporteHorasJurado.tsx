import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';

interface CompensacionData {
  curso: string;
  tipo_sustentacion: string;
  horas_a_compensar: number;
}

const ReporteHorasJurado: React.FC = () => {
  const [data, setData] = useState<CompensacionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchCompensacion = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/jurados/obtener_horas_compensacion/${user.id}`
        );
        console.log(response.data)
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    if (user.id) {
      fetchCompensacion();
    } else {
      setError('User ID not found in session storage.');
      setLoading(false);
    }
  }, [user.id]);

  const columns: TableColumn<CompensacionData>[] = [
    {
      name: 'Curso',
      selector: (row) => row.curso,
      sortable: true,
    },
    {
      name: 'Tipo sustentacion',
      selector: (row) => row.tipo_sustentacion,
      sortable: true,
    },
    {
      name: 'Horas a compensar',
      selector: (row) => row.horas_a_compensar.toString(),
      sortable: true,
    },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="text-2xl font-bold mb-4">Reporte de Horas de Compensación</h1>
      {data.length > 0 ? (
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          pointerOnHover
          responsive
          striped
          noHeader
        />
      ) : (
        <p>No hay datos de compensación disponibles.</p>
      )}
    </div>
  );
};

export default ReporteHorasJurado;
