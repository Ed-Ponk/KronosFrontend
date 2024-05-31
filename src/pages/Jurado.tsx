// PaginaPrincipal.jsx
import React, { useState, useEffect } from 'react';
import { FormJurado } from '../components/JuradoForm';
import TablaJurado from '../components/TablaJurado';
import axios from 'axios';

const Jurado = () => {
 

  return (
    <div>
      <FormJurado />
      <TablaJurado  />
    </div>
  );
};

export default Jurado;
