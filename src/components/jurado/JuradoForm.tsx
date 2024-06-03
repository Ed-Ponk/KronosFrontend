import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const FormJurado: React.FC = () => {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFileName(file.name);
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fileInput = fileInputRef.current;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      MySwal.fire({
        title: 'Archivo no seleccionado',
        text: 'Por favor selecciona un archivo para subir',
        icon: 'info',
      });
      return;
    }

    const file = fileInput.files[0];

    // Validar tipo de archivo
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/vnd.ms-excel') {
      MySwal.fire({
        title: 'Archivo no válido',
        text: 'Por favor selecciona un archivo Excel (.xlsx o .xls)',
        icon: 'error',
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;

      // Enviar los datos del archivo al servidor
      fetch('http://127.0.0.1:5000/jurados/registro-jurado', {
        method: 'POST',
        body: data as ArrayBuffer, // Enviar los datos del archivo en bruto
        headers: {
          'Content-Type': 'application/octet-stream', // Tipo de contenido para datos en bruto
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            MySwal.fire({
              title: 'Éxito',
              text: data.message,
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          } else {
            MySwal.fire({
              title: 'Error',
              text: 'Error: ' + data.message,
              icon: 'error',
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          MySwal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar el archivo Excel',
            icon: 'error',
          });
        });
    };

    reader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
  };

  const handleInfoClick = () => {
    MySwal.fire({
      title: 'Instrucciones',
      html: `
      <p>El formato del archivo Excel debe contar con la siguiente estructura:</p>
      <table class="table-fixed mt-2 border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-xs">semestre</th>
            <th class="border border-gray-300 px-4 py-2 text-xs">email</th>
            <th class="border border-gray-300 px-4 py-2 text-xs">apellidos y nombres</th>
            <th class="border border-gray-300 px-4 py-2 text-xs">dedicacion</th>
            <th class="border border-gray-300 px-4 py-2 text-xs">telefono</th>
            <th class="border border-gray-300 px-4 py-2 text-xs">horas de asesoria semanal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 px-4 py-2 text-xs">2024-I</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">ejemplo1@gmail.com</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">Ramize Portcarrero Juan</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">TP</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">946123456</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">8</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-2 text-xs">2024-I</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">ejemplo2@gmail.com</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">López Martínez Ana</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">TC</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">946123456</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">3</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-4 py-2 text-xs">2024-I</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">ejemplo3@gmail.com</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">González Rodríguez María</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">TP</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">946123456</td>
            <td class="border border-gray-300 px-4 py-2 text-xs">7</td>
          </tr>
        </tbody>
      </table>
    `,
      icon: 'info',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'w-3/4 max-w-3xl', // Adjust the width of the alert
      },
    });
  };

  return (
    <div className="flex flex-col mt-2 w-3/5 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="block font-medium leading-6 text-gray-900 dark:text-gray-200">
          Registrar Jurado
        </h1>
        <button onClick={handleInfoClick} className="">
          <svg className="w-6 h-6 text-yellow-500 dark:text-gray" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
            <path d="M9 0C4.029 0 0 4.029 0 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zm1 15h-2V7h2v8zm-1-9.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
          </svg>
        </button>
      </div>
      <form className="flex-none md:flex-1 p-5" id="uploadForm" onSubmit={handleSubmit} onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className="flex-auto mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2 dark:border-white">
          <div className="text-center">
            <div className="mt-4 flex text-sm leading-6 text-gray-600 ">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Ingresa tu archivo</span>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  className="sr-only"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || "")}
                />
              </label>
              <p className="pl-1 dark:text-gray-200">o arrastrar y soltar</p>
            </div>
            <p className="text-xs leading-5 text-gray-600 dark:text-gray-200">.xlsx , .xls hasta 10MB</p>
          </div>
        </div>
        {selectedFileName && (
          <p className="text-sm text-gray-700 mt-2 dark:text-gray-200">Archivo seleccionado: {selectedFileName}</p>
        )}
        <div className='mt-5 w-100 flex-auto flex justify-end'>
          <button
            className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            type="submit"
          >
            Cargar Archivo
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormJurado;
