export const characterAttributesMapping = {
    id: 'ID',
    name: 'Tópico',
    email: 'Correo electrónico',
    contact: {
      _prefix: 'Contacto ',
      street: 'Calle',
      streetNumber: 'Número',
      zip: 'CP',
      city: 'Ciudad'
    },
    skills: {
      _prefix: 'Accion ',
      _listField: true
    }
  };

  export interface Character {
    id: string;
    name: string;
    email: string;
    contact: {
      street: string;
      streetNumber: string;
      zip: string;
      city: string;
    };
    skills: string[];
  }
