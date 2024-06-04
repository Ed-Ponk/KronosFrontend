import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DataItem } from '../../types/SemanaSustentacion';
import { Option } from '../../types/Grupo';
import ComboboxCustom from '../common/Combobox';


const MySwal = withReactContent(Swal);


interface FormSemanaSustentacionProps {
    selectedSemanaSustentacion: DataItem | null;
    setSelectedSemanaSustentacion: React.Dispatch<React.SetStateAction<DataItem | null>>;
    fetchData: () => void;
}

export const FormSemanaSustentacion: React.FC<FormSemanaSustentacionProps> = ({ selectedSemanaSustentacion, setSelectedSemanaSustentacion, fetchData }) => {
    const [typeSubmit, setTypeSubmit] = useState(true); //True: Registrar, False: Editar

    const [idFechaSustentacion, setIdFechaSustentacion] = useState(0);

    const [tipoSustentacion, setTipoSustentacion] = useState<Option>();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [duracion, setDuracion] = useState(30);
    const [compensasion, setCompensasion] = useState<Option>();
    const [escuela, setEscuela] = useState<Option>();
    const [curso, setCurso] = useState<Option>();


    //Estados para almacenar los datos de los comboboxs
    const [dataEscuela, setDataEscuela] = useState<Option[]>([]);
    const [dataCurso, setDataCurso] = useState<Option[]>([]);

    const fetchEscuelas = async () => {
        try {
            const response = await axiosInstance.get('escuela');
            let data: Option[] = [];
            //Damos el formato
            for (const item of response.data.data) {
                let newItem: Option = { id: item.escuela_id, name: item.escuela, }
                data.push(newItem);
            }
            setDataEscuela(data);
        } catch (error) {
            console.error('Error fetching escuela data:', error);
        }
    }

    const fetchCursos = async () => {
        try {
            const response = await axiosInstance.get('curso/lista-escuela-cursos');
            let data: Option[] = [];
            //Damos el formato
            for (const item of response.data.data) {
                if (item.vigente == 'Activo' && escuela?.id == item.escuela_id) {
                    let newItem: Option = { id: item.curso_id, name: item.curso, }
                    data.push(newItem);
                }
            }
            setDataCurso(data);
        } catch (error) {
            console.error('Error fetching curso data:', error);
        }
    }

    useEffect(() => {
        if (typeSubmit)
            setCurso(null);
        fetchCursos();
    }, [escuela])

    useEffect(() => {
        fetchEscuelas();
    }, [])

    useEffect(() => {
        if (selectedSemanaSustentacion) {
            //Actualizar
            setTypeSubmit(false)

            setTipoSustentacion(selectedSemanaSustentacion?.tipo_sustentacion);
            setCompensasion(selectedSemanaSustentacion?.compensacion_docente);
            setFechaInicio(selectedSemanaSustentacion.fecha_inicio);
            setFechaFin(selectedSemanaSustentacion.fecha_fin);
            setEscuela(selectedSemanaSustentacion.escuela_curso_id.escuela);
            setCurso(selectedSemanaSustentacion.escuela_curso_id.curso);
            setDuracion(selectedSemanaSustentacion.duracion_sustentacion)

        } else {
            //Registrar
            setTypeSubmit(true)

            setTipoSustentacion({ id: 0, name: 'Parcial' });
            setCompensasion({ id: 0, name: 'No' });
            setFechaInicio('');
            setFechaFin('');
            setEscuela();
            setCurso();
            setDuracion(30);
        }

    }, [selectedSemanaSustentacion]);

    const handleCancel = () => {
        setTypeSubmit(true);
        //TODO: Modificar
        setSelectedSemanaSustentacion(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        //TODO: Modificar
        event.preventDefault();

        const endpoint = typeSubmit ? `semana/registrar` : `semana/actualizar`;
        const method = typeSubmit ? 'POST' : 'PUT';


        try {
            const response = await axiosInstance({
                method: method,
                url: endpoint,
                data: {
                    grupo_curso_id: !typeSubmit ? idFechaSustentacion : undefined,
                    tipo_sustentacion: tipoSustentacion?.id,
                    //TODO: calcular las semanas pero en el backend 
                    //semanas:, 
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin,
                    duracion_sustentacion: duracion,
                    compensacion_docente: compensasion?.id,
                    escuela_id: escuela?.id,
                    curso_id: curso?.id
                },
            });
            if (response.data.status) {
                MySwal.fire({
                    title: 'Éxito',
                    text: !typeSubmit ? 'Fechas de sustentación actualizadas con éxito' : 'Fechas de sustentación registradas con éxito',
                    icon: 'success',
                });
                handleCancel();
                fetchData();
            } else {
                MySwal.fire({
                    title: 'Error',
                    text: response.data.message,
                    icon: 'error',
                });
            }
        } catch (e) {
            MySwal.fire({
                title: 'Error',
                text: 'Error al registrar las fechas de sustentación. Inténtalo de nuevo más tarde.',
                icon: 'error',
            });
        }
    };

    return (
        <div className="flex mt-2 flex-col w-11/12 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5">
            <h1 className="block font-medium leading-6 text-gray-900 dark:text-gray-200 mb-4">
                {selectedSemanaSustentacion ? 'Editar Fechas de Sustentación' : 'Registrar Fechas de Sustentación'}
            </h1>
            <form className="space-y-6" onSubmit={handleSubmit}>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="fecha_inicio" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Tipo de sustentación
                        </label>
                        <div className="mt-2">
                            <ComboboxCustom
                                data_options={[{ id: 0, name: 'Parcial' }, { id: 1, name: 'Final' }]}
                                data={tipoSustentacion}
                                setData={setTipoSustentacion} />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label htmlFor="fecha_fin" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Compensasión Docente
                        </label>
                        <div className="mt-2">
                            <ComboboxCustom
                                data_options={[{ id: 0, name: 'No' }, { id: 1, name: 'Si' }]}
                                data={compensasion}
                                setData={setCompensasion} />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="fecha_inicio" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Fecha de Inicio
                        </label>
                        <div className="mt-2">
                            <input
                                id="fecha_inicio"
                                name="fecha_inicio"
                                type="date"
                                required
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>


                    <div className="flex-1">
                        <label htmlFor="fecha_fin" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Fecha de Fin
                        </label>
                        <div className="mt-2">
                            <input
                                id="fecha_fin"
                                name="fecha_fin"
                                type="date"
                                required
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="fecha_inicio" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Escuela
                        </label>
                        <div className="mt-2">
                            <ComboboxCustom
                                data_options={dataEscuela}
                                data={escuela}
                                setData={setEscuela} />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label htmlFor="fecha_fin" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Curso
                        </label>
                        <div className="mt-2">
                            <ComboboxCustom
                                data_options={dataCurso}
                                data={curso}
                                setData={setCurso} />
                        </div>
                    </div>
                </div>

                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label htmlFor="nombre_semana_sustentacion" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                            Duración de la sustentación (min)
                        </label>
                        <div className="mt-2">
                            <input
                                id="duracion"
                                name="duracion"
                                type="number"
                                step={10}
                                min={20}
                                max={100}
                                required
                                value={duracion}
                                onChange={(e) => setDuracion(Number.parseInt(e.target.value))}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {selectedSemanaSustentacion ? 'Actualizar Fechas de Sustentación' : 'Registrar Fechas de Sustentación'}
                    </button>
                    {selectedSemanaSustentacion && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="ml-4 flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FormSemanaSustentacion;