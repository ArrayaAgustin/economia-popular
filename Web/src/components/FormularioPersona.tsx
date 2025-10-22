import React, { useState } from 'react';
import { savePersonForm } from '@/lib/api';

type FormularioPersonaProps = {
  datosPreCargados?: {
    cuil: string;
    nombre: string;
    apellido: string;
    // Otros datos que vengan de CIDI
  };
};

const FormularioPersona: React.FC<FormularioPersonaProps> = ({ datosPreCargados }) => {
  const [formData, setFormData] = useState({
    cuil: datosPreCargados?.cuil || '',
    nombre: datosPreCargados?.nombre || '',
    apellido: datosPreCargados?.apellido || '',
    fechaNacimiento: '',
    genero: '',
    estadoCivil: '',
    nacionalidad: '',
    domicilio: {
      calle: '',
      numero: '',
      piso: '',
      departamento: '',
      barrio: '',
      localidad: '',
      provincia: 'Córdoba',
      codigoPostal: '',
    },
    contacto: {
      telefono: '',
      email: '',
    },
    situacionLaboral: '',
    actividadEconomica: '',
    ingresos: '',
    programasSociales: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Manejar campos anidados (domicilio, contacto)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...(prevData[parent as keyof typeof prevData] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        programasSociales: [...formData.programasSociales, name],
      });
    } else {
      setFormData({
        ...formData,
        programasSociales: formData.programasSociales.filter(program => program !== name),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await savePersonForm(formData);
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Ocurrió un error al guardar el formulario. Por favor, intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
        <h2 className="text-2xl font-bold mb-4">¡Registro Exitoso!</h2>
        <p className="mb-4">Sus datos han sido registrados correctamente en el sistema de Economía Popular.</p>
        <p>Un agente se pondrá en contacto con usted para los siguientes pasos.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary-700">Registro de Persona - Economía Popular</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Datos Personales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cuil" className="form-label">CUIL</label>
              <input
                type="text"
                id="cuil"
                name="cuil"
                value={formData.cuil}
                onChange={handleChange}
                className="form-input"
                required
                disabled={!!datosPreCargados?.cuil}
              />
            </div>
            
            <div>
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
                required
                disabled={!!datosPreCargados?.nombre}
              />
            </div>
            
            <div>
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="form-input"
                required
                disabled={!!datosPreCargados?.apellido}
              />
            </div>
            
            <div>
              <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="genero" className="form-label">Género</label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No Binario">No Binario</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="estadoCivil" className="form-label">Estado Civil</label>
              <select
                id="estadoCivil"
                name="estadoCivil"
                value={formData.estadoCivil}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Soltero/a">Soltero/a</option>
                <option value="Casado/a">Casado/a</option>
                <option value="Divorciado/a">Divorciado/a</option>
                <option value="Viudo/a">Viudo/a</option>
                <option value="Unión Convivencial">Unión Convivencial</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="nacionalidad" className="form-label">Nacionalidad</label>
              <input
                type="text"
                id="nacionalidad"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Domicilio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="domicilio.calle" className="form-label">Calle</label>
              <input
                type="text"
                id="domicilio.calle"
                name="domicilio.calle"
                value={formData.domicilio.calle}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="domicilio.numero" className="form-label">Número</label>
              <input
                type="text"
                id="domicilio.numero"
                name="domicilio.numero"
                value={formData.domicilio.numero}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="domicilio.piso" className="form-label">Piso</label>
              <input
                type="text"
                id="domicilio.piso"
                name="domicilio.piso"
                value={formData.domicilio.piso}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="domicilio.departamento" className="form-label">Departamento</label>
              <input
                type="text"
                id="domicilio.departamento"
                name="domicilio.departamento"
                value={formData.domicilio.departamento}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="domicilio.barrio" className="form-label">Barrio</label>
              <input
                type="text"
                id="domicilio.barrio"
                name="domicilio.barrio"
                value={formData.domicilio.barrio}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="domicilio.localidad" className="form-label">Localidad</label>
              <input
                type="text"
                id="domicilio.localidad"
                name="domicilio.localidad"
                value={formData.domicilio.localidad}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="domicilio.provincia" className="form-label">Provincia</label>
              <input
                type="text"
                id="domicilio.provincia"
                name="domicilio.provincia"
                value={formData.domicilio.provincia}
                onChange={handleChange}
                className="form-input"
                disabled
              />
            </div>
            
            <div>
              <label htmlFor="domicilio.codigoPostal" className="form-label">Código Postal</label>
              <input
                type="text"
                id="domicilio.codigoPostal"
                name="domicilio.codigoPostal"
                value={formData.domicilio.codigoPostal}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Información de Contacto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contacto.telefono" className="form-label">Teléfono</label>
              <input
                type="tel"
                id="contacto.telefono"
                name="contacto.telefono"
                value={formData.contacto.telefono}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="contacto.email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="contacto.email"
                name="contacto.email"
                value={formData.contacto.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Situación Socioeconómica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="situacionLaboral" className="form-label">Situación Laboral</label>
              <select
                id="situacionLaboral"
                name="situacionLaboral"
                value={formData.situacionLaboral}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Desempleado/a">Desempleado/a</option>
                <option value="Trabajador/a Informal">Trabajador/a Informal</option>
                <option value="Trabajador/a Independiente">Trabajador/a Independiente</option>
                <option value="Trabajador/a Formal Tiempo Parcial">Trabajador/a Formal Tiempo Parcial</option>
                <option value="Trabajador/a Formal Tiempo Completo">Trabajador/a Formal Tiempo Completo</option>
                <option value="Jubilado/a o Pensionado/a">Jubilado/a o Pensionado/a</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="actividadEconomica" className="form-label">Actividad Económica Principal</label>
              <input
                type="text"
                id="actividadEconomica"
                name="actividadEconomica"
                value={formData.actividadEconomica}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="ingresos" className="form-label">Ingresos Mensuales Aproximados</label>
              <select
                id="ingresos"
                name="ingresos"
                value={formData.ingresos}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Menos de $100.000">Menos de $100.000</option>
                <option value="Entre $100.000 y $200.000">Entre $100.000 y $200.000</option>
                <option value="Entre $200.000 y $300.000">Entre $200.000 y $300.000</option>
                <option value="Entre $300.000 y $400.000">Entre $300.000 y $400.000</option>
                <option value="Más de $400.000">Más de $400.000</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="form-label">Programas Sociales (seleccione los que correspondan)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="programaA"
                  name="Asignación Universal por Hijo"
                  checked={formData.programasSociales.includes('Asignación Universal por Hijo')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="programaA">Asignación Universal por Hijo</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="programaB"
                  name="Tarjeta Alimentar"
                  checked={formData.programasSociales.includes('Tarjeta Alimentar')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="programaB">Tarjeta Alimentar</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="programaC"
                  name="Potenciar Trabajo"
                  checked={formData.programasSociales.includes('Potenciar Trabajo')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="programaC">Potenciar Trabajo</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="programaD"
                  name="Progresar"
                  checked={formData.programasSociales.includes('Progresar')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="programaD">Progresar</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="programaE"
                  name="Pensión no Contributiva"
                  checked={formData.programasSociales.includes('Pensión no Contributiva')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="programaE">Pensión no Contributiva</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="btn-secondary mr-4"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPersona;
