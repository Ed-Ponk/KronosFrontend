import React, { useState, useEffect } from 'react';
import { FormJurado } from '../components/JuradoForm';
import TablaJurado from '../components/TablaJurado';
import axios from 'axios';

const JuradoPage = () =>{
  
  return (
    <div className='w-full h-full md:w-auto bg-gray-100 '>
      <FormJurado />
      <TablaJurado  />
    </div>
  );
}

export default JuradoPage;
