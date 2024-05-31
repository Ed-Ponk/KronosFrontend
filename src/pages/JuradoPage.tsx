import React, { useState, useEffect } from 'react';
import { FormJurado } from '../components/JuradoForm';
import TablaJurado from '../components/TablaJurado';
import axios from 'axios';

const JuradoPage = () =>{
  
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
