import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Disponibilidad {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

interface DisponibilidadData {
  disponibilidad: Disponibilidad[];
  hora_asesoria_semanal: number;
  nombre_completo: string;
  semestre_jurado_id: number;
}

interface DisponibilidadGrouped {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  asesores: string[];
}

const NuevaPage: React.FC = () => {
  const [disponiblesData, setDisponiblesData] = useState<DisponibilidadData[]>([]);
  const [filteredData, setFilteredData] = useState<DisponibilidadGrouped[]>([]);
  const [nombreFilter, setNombreFilter] = useState<string>('');
  const [fechaFilter, setFechaFilter] = useState<string>('');
  const [horaInicioFilter, setHoraInicioFilter] = useState<string>('');
  const [horaFinFilter, setHoraFinFilter] = useState<string>('');

  useEffect(() => {
    const storedDisponiblesData = JSON.parse(localStorage.getItem('disponiblesData') || '[]');
    const groupedData = groupData(storedDisponiblesData);
    setDisponiblesData(storedDisponiblesData);
    setFilteredData(groupedData);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [nombreFilter, fechaFilter, horaInicioFilter, horaFinFilter]);

  const applyFilters = () => {
    let filtered = groupData(disponiblesData);

    if (nombreFilter) {
      filtered = filtered.filter((item) =>
        item.asesores.some((asesor) =>
          asesor.toLowerCase().includes(nombreFilter.toLowerCase())
        )
      );
    }

    if (fechaFilter) {
      filtered = filtered.filter((item) => item.fecha === fechaFilter);
    }

    if (horaInicioFilter && horaFinFilter) {
      filtered = filtered.filter(
        (item) =>
          item.hora_inicio >= horaInicioFilter && item.hora_fin <= horaFinFilter
      );
    }

    setFilteredData(filtered);
  };

  const groupData = (data: DisponibilidadData[]): DisponibilidadGrouped[] => {
    const grouped: { [key: string]: DisponibilidadGrouped } = {};

    data.forEach((item) => {
      item.disponibilidad.forEach((disp) => {
        const key = `${disp.fecha}-${disp.hora_inicio}-${disp.hora_fin}`;
        if (!grouped[key]) {
          grouped[key] = {
            fecha: disp.fecha,
            hora_inicio: disp.hora_inicio,
            hora_fin: disp.hora_fin,
            asesores: [],
          };
        }
        grouped[key].asesores.push(item.nombre_completo);
      });
    });

    return Object.values(grouped);
  };

  const columns: TableColumn<DisponibilidadGrouped>[] = [
    {
      name: 'Fecha',
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: 'Hora Inicio',
      selector: (row) => row.hora_inicio,
      sortable: true,
    },
    {
      name: 'Hora Fin',
      selector: (row) => row.hora_fin,
      sortable: true,
    },
    {
      name: 'Asesores Disponibles',
      cell: (row) => (
        <div>
          {row.asesores.map((asesor, index) => (
            <div key={index}>{asesor}</div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Datos de Disponibilidad</h1>

      <div className="mb-4 flex gap-4 items-end">
        <input
          type="text"
          placeholder="Filtrar por Nombre"
          value={nombreFilter}
          onChange={(e) => setNombreFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          placeholder="Filtrar por Fecha"
          value={fechaFilter}
          onChange={(e) => setFechaFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="time"
          step="3600"
          placeholder="Hora Inicio"
          value={horaInicioFilter}
          onChange={(e) => setHoraInicioFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="time"
          step="3600"
          placeholder="Hora Fin"
          value={horaFinFilter}
          onChange={(e) => setHoraFinFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      {filteredData.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          pointerOnHover
          responsive
          striped
          noHeader
        />
      ) : (
        <p>No hay datos de disponibilidad.</p>
      )}
    </div>
  );
};

export default NuevaPage;
