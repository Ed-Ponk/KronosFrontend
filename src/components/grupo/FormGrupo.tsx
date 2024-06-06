import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


import MyCombobox from '../common/Combobox';
import ButtonPlus from './ButtonPlus';
import { Option, DataGrupo } from '../../types/Grupo';

const MySwal = withReactContent(Swal);

const FormEscuela = ({ selectedData, setSelectedData, fetchData }: { selectedData: DataGrupo | null, setSelectedData: (data: DataGrupo) => void, fetchData: () => void }) => {

    const [typeSubmit, setTypeSubmit] = useState(true); //True: Registrar, False: Editar
    const [idGrupoHorario, setIdGrupoHorario] = useState(0);

    //Estado para los grupos actuales para la tabla
    const [dataGrupos, setDataGrupos] = useState([]);

    //Estados para manejar los datos del combobox
    const [dataLetras, setDataLetras] = useState<Option[]>([]);
    const [dataSemestre, setDataSemestre] = useState<Option[]>([]);
    const [dataEscuela, setDataEscuela] = useState<Option[]>([]);
    const [dataCurso, setDataCurso] = useState<Option[]>([]);
    const [dataDocente, setDataDocente] = useState<Option[]>([]);


    //Estados para controlar los valores seleccionados en los combobox
    const [selectedGrupo, setSelectedGrupo] = useState<Option>();
    const [selectedSemestre, setSelectedSemestre] = useState<Option>();
    const [selectedEscuela, setSelectedEscuela] = useState<Option>();
    const [selectedCurso, setSelectedCurso] = useState<Option>();
    const [selectedDocente, setSelectedDocente] = useState<Option>();

    const fetchGrupos = async () => {
        try {
            const response = await axiosInstance.get('grupos');
            setDataGrupos(response.data.data);
        } catch (error) {
            console.error('Error fetching facultad data:', error);
        }
    }

    const fetchLetrasGrupos = async () => {
        try {
            const response = await axiosInstance.get('grupos/letras');
            let data: Option[] = [];
            //Damos el formato
            for (const letra of response.data.data) {
                let newOption: Option = { id: letra.grupo_id, name: letra.nombre, }
                data.push(newOption);
            }
            setDataLetras(data);
        } catch (error) {
            console.error('Error fetching letras data:', error);
        }
    }

    const fetchSemestres = async () => {
        try {
            const response = await axiosInstance.get('semestres');
            let data: Option[] = [];
            //Damos el formato
            for (const item of response.data.data) {
                let newItem: Option = { id: item.semestre_id, name: item.nombre_semestres, }
                data.push(newItem);
            }
            setDataSemestre(data);
        } catch (error) {
            console.error('Error fetching semestre data:', error);
        }
    }

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
                if (item.vigente == 'Activo' && selectedEscuela?.id == item.escuela_id) {
                    let newItem: Option = { id: item.curso_id, name: item.curso, }
                    data.push(newItem);
                }
            }
            setDataCurso(data);
        } catch (error) {
            console.error('Error fetching curso data:', error);
        }
    }

    const fetchDocentes = async () => {
        try {
            const response = await axiosInstance.get('jurados');
            let data: Option[] = [];
            for (const item of response.data.data) {
                let newItem: Option = { id: item.jurado_id, name: item.nombre_completo, }
                data.push(newItem);
            }
            setDataDocente(data);
        } catch (error) {
            console.error('Error fetching semestre data:', error);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const endpoint = typeSubmit ? '/grupos/registrar' : '/grupos/actualizar';
        const method = typeSubmit ? 'POST' : 'PUT';

        try {
            const response = await axiosInstance({
                method: method,
                url: endpoint,
                data: {
                    grupo_curso_id: !typeSubmit ? idGrupoHorario : undefined,
                    grupo_id: selectedGrupo?.id,
                    semestre_id: selectedSemestre?.id,
                    escuela_id: selectedEscuela?.id,
                    curso_id: selectedCurso?.id,
                    docente_id: selectedDocente?.id
                },
            });
            if (response.data.status) {
                MySwal.fire({
                    title: 'Éxito',
                    text: !typeSubmit ? 'Grupo horario actualizado con éxito' : 'Grupo horario registrado con éxito',
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
                text: 'Error al registrar la grupo horario. Inténtalo de nuevo más tarde.',
                icon: 'error',
            });
        }
    };

    const handleCancel = () => {
        setSelectedData(null)

        setTypeSubmit(true);
        setIdGrupoHorario(0);
        setSelectedGrupo(null);
        setSelectedSemestre(null);
        setSelectedEscuela(null);
        setSelectedCurso(null);
        setSelectedDocente(null);
    }

    useEffect(() => {
        if (typeSubmit)
            setSelectedCurso(null);
        fetchCursos();
    }, [selectedEscuela])

    useEffect(() => {
        if (selectedData) {
            setTypeSubmit(false);
            setIdGrupoHorario(selectedData?.grupo_curso_id); //si no tiene dato entonces 0
            setSelectedGrupo(selectedData?.grupo);
            setSelectedSemestre(selectedData?.nombre_semestre);
            setSelectedEscuela(selectedData?.escuela);
            setSelectedCurso(selectedData?.curso);
            setSelectedDocente(selectedData?.docente);
        } else {
            setTypeSubmit(true);
            setIdGrupoHorario(0);
            setSelectedGrupo(null);
            setSelectedSemestre(null);
            setSelectedEscuela(null);
            setSelectedCurso(null);
            setSelectedDocente(null);
        }
    }, [selectedData]);

    useEffect(() => {
        fetchGrupos();
        fetchLetrasGrupos();
        fetchSemestres();
        fetchEscuelas();
        fetchDocentes();
    }, []);

    return (
        <div className="flex flex-col w-11/12 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5">
            <h1 className="block font-medium leading-6 text-gray-900 mb-4">
                {!typeSubmit ? 'Editar Grupo Horario' : 'Registrar Grupo Horario'}
            </h1>
            <form className="space-y-3 " onSubmit={handleSubmit}>
                <div className='flex space-x-4'>
                    <label htmlFor="nombre" className="w-2/12 block text-sm place-self-center font-medium leading-6 text-gray-900">
                        Grupo:
                    </label>
                    <MyCombobox className='w-9/12' data_options={dataLetras} data={selectedGrupo} setData={setSelectedGrupo} />
                </div>

                <div className='flex space-x-4'>
                    <label htmlFor="nombre" className="w-2/12 block text-sm place-self-center font-medium leading-6 text-gray-900">
                        Semestre:
                    </label>
                    <MyCombobox className='w-9/12' data_options={dataSemestre} data={selectedSemestre} setData={setSelectedSemestre} />
                </div>

                <div className='flex space-x-4'>
                    <label htmlFor="nombre" className="w-2/12 block text-sm place-self-center font-medium leading-6 text-gray-900">
                        Escuela:
                    </label>
                    <MyCombobox className='w-9/12' data_options={dataEscuela} data={selectedEscuela} setData={setSelectedEscuela} />
                </div>

                <div className='flex space-x-4'>
                    <label htmlFor="nombre" className="w-2/12 block text-sm place-self-center font-medium leading-6 text-gray-900">
                        Curso:
                    </label>
                    <MyCombobox className='w-9/12' data_options={dataCurso} data={selectedCurso} setData={setSelectedCurso} />
                </div>

                <div className='flex space-x-4'>
                    <label htmlFor="nombre" className="w-2/12 block text-sm place-self-center font-medium leading-6 text-gray-900">
                        Docente:
                    </label>
                    <MyCombobox className='w-9/12' data_options={dataDocente} data={selectedDocente} setData={setSelectedDocente} />
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {typeSubmit ? 'Registrar' : 'Actualizar'} Grupo Horario
                    </button>
                    {typeSubmit || (
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

export default FormEscuela;