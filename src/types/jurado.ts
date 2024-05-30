export interface Jurado {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'jurado';
}
  
export interface JuradoList {
    jurados: Jurado[];
}
  

export interface JuradoList {
    jurado: JuradoList[];
}