import React, { useState } from 'react';


export const FormJurado: React.FC = () => {
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedFileName(file.name);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const fileInput = event.currentTarget.elements.namedItem('file') as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            console.log("Archivo seleccionado:", file.name);
        }
    };

    return (
        <div className="">
        <div className="flex flex-col w-full max-w-lg   mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5">
            <h1 className="block font-medium leading-6 text-gray-900 mb-4">
                Registrar Jurado
            </h1>
            <form className="flex-none md:flex-1 p-5 " id="uploadForm" onSubmit={handleSubmit}>
              <div className="flex-auto mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                <div className="text-center">
               
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Ingresa tu archivo</span>
                      <input id="file-upload" name="file"  type="file" className="sr-only" accept=".xlsx, .xls" onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || "")} ></input>
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">.xlsx , .xls hasta 10MB</p>
                </div>
              </div>
              {selectedFileName && ( // Muestra el nombre del archivo seleccionado si existe
                <p className="text-sm text-gray-700 mt-2">Archivo seleccionado: {selectedFileName}</p>
              )}
              <div className='mt-5 w-100  flex-auto flex justify-end'>
              <button className=' rounded-md  bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' type="submit">Cargar Archivo</button>
              </div>
        </form>
        </div>
    </div>
        
          
           
    );
};