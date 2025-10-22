import React, { useState } from 'react';
import { saveOrganizacionForm } from '@/lib/api';

type FormularioOrganizacionProps = {
  datosUsuario?: {
    cuil: string;
    nombre: string;
    apellido: string;
  };
};

const FormularioOrganizacion: React.FC<FormularioOrganizacionProps> = ({ datosUsuario }) => {
  const [formData, setFormData] = useState({
    // Datos del representante
    representante: {
      cuil: datosUsuario?.cuil || '',
      nombre: datosUsuario?.nombre || '',
      apellido: datosUsuario?.apellido || '',
      cargo: '',
      telefono: '',
      email: '',
    },
    // Datos de la organización
    organizacion: {
      nombre: '',
      tipo: '',
      cuit: '',
      fechaConstitucion: '',
      numeroRegistro: '',
      cantidadMiembros: '',
      actividadPrincipal: '',
    },
    // Domicilio de la organización
    domicilio: {
      calle: '',
      numero: '',
      piso: '',
      oficina: '',
      barrio: '',
      localidad: '',
      provincia: 'Córdoba',
      codigoPostal: '',
    },
    // Información adicional
    informacionAdicional: {
      zonasOperacion: [] as string[],
      proyectosActuales: '',
      necesidadesCapacitacion: '',
      necesidadesFinanciamiento: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Manejar campos anidados
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
      setFormData(prevData => ({
        ...prevData,
        informacionAdicional: {
          ...prevData.informacionAdicional,
          zonasOperacion: [...prevData.informacionAdicional.zonasOperacion, name],
        },
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        informacionAdicional: {
          ...prevData.informacionAdicional,
          zonasOperacion: prevData.informacionAdicional.zonasOperacion.filter(zona => zona !== name),
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await saveOrganizacionForm(formData);
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
        <p className="mb-4">Los datos de la organización han sido registrados correctamente en el sistema de Economía Popular.</p>
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
      <h2 className="text-2xl font-bold mb-6 text-primary-700">Registro de Organización - Economía Popular</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Datos del Representante</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="representante.cuil" className="form-label">CUIL</label>
              <input
                type="text"
                id="representante.cuil"
                name="representante.cuil"
                value={formData.representante.cuil}
                onChange={handleChange}
                className="form-input"
                required
                disabled={!!datosUsuario?.cuil}
              />
            </div>
            
            <div>
              <label htmlFor="representante.nombre" className="form-label">Nombre</label>
              <input
                type="text"
                id="representante.nombre"
                name="representante.nombre"
                value={formData.representante.nombre}
                onChange={handleChange}
                className="form-input"
                required
                disabled={!!datosUsuario?.nombre}
              />
            </div>
            
            <div>
              <label htmlFor="representante.apellido" className="form-label">Apellido</label>
              <input
                type="text"
                id="representante.apellido"
                name="representante.apellido"
                value={formData.representante.apellido}
                onChange={handleChange}
                className="form-input"
                required
                disabled={!!datosUsuario?.apellido}
              />
            </div>
            
            <div>
              <label htmlFor="representante.cargo" className="form-label">Cargo en la Organización</label>
              <input
                type="text"
                id="representante.cargo"
                name="representante.cargo"
                value={formData.representante.cargo}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="representante.telefono" className="form-label">Teléfono</label>
              <input
                type="tel"
                id="representante.telefono"
                name="representante.telefono"
                value={formData.representante.telefono}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="representante.email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="representante.email"
                name="representante.email"
                value={formData.representante.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Datos de la Organización</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="organizacion.nombre" className="form-label">Nombre de la Organización</label>
              <input
                type="text"
                id="organizacion.nombre"
                name="organizacion.nombre"
                value={formData.organizacion.nombre}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="organizacion.tipo" className="form-label">Tipo de Organización</label>
              <select
                id="organizacion.tipo"
                name="organizacion.tipo"
                value={formData.organizacion.tipo}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Cooperativa">Cooperativa</option>
                <option value="Asociación Civil">Asociación Civil</option>
                <option value="Fundación">Fundación</option>
                <option value="Mutual">Mutual</option>
                <option value="Emprendimiento Social">Emprendimiento Social</option>
                <option value="Organización Comunitaria">Organización Comunitaria</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="organizacion.cuit" className="form-label">CUIT</label>
              <input
                type="text"
                id="organizacion.cuit"
                name="organizacion.cuit"
                value={formData.organizacion.cuit}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="organizacion.fechaConstitucion" className="form-label">Fecha de Constitución</label>
              <input
                type="date"
                id="organizacion.fechaConstitucion"
                name="organizacion.fechaConstitucion"
                value={formData.organizacion.fechaConstitucion}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="organizacion.numeroRegistro" className="form-label">Número de Registro</label>
              <input
                type="text"
                id="organizacion.numeroRegistro"
                name="organizacion.numeroRegistro"
                value={formData.organizacion.numeroRegistro}
                onChange={handleChange}
                className="form-input"
              />
              <small className="text-gray-500">Si corresponde</small>
            </div>
            
            <div>
              <label htmlFor="organizacion.cantidadMiembros" className="form-label">Cantidad de Miembros</label>
              <input
                type="number"
                id="organizacion.cantidadMiembros"
                name="organizacion.cantidadMiembros"
                value={formData.organizacion.cantidadMiembros}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="organizacion.actividadPrincipal" className="form-label">Actividad Principal</label>
              <input
                type="text"
                id="organizacion.actividadPrincipal"
                name="organizacion.actividadPrincipal"
                value={formData.organizacion.actividadPrincipal}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Domicilio de la Organización</h3>
          
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
              <label htmlFor="domicilio.oficina" className="form-label">Oficina</label>
              <input
                type="text"
                id="domicilio.oficina"
                name="domicilio.oficina"
                value={formData.domicilio.oficina}
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
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Información Adicional</h3>
          
          <div className="mb-4">
            <label className="form-label">Zonas de Operación (seleccione las que correspondan)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="zonaA"
                  name="Capital"
                  checked={formData.informacionAdicional.zonasOperacion.includes('Capital')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="zonaA">Capital</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="zonaB"
                  name="Norte Provincial"
                  checked={formData.informacionAdicional.zonasOperacion.includes('Norte Provincial')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="zonaB">Norte Provincial</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="zonaC"
                  name="Sur Provincial"
                  checked={formData.informacionAdicional.zonasOperacion.includes('Sur Provincial')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="zonaC">Sur Provincial</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="zonaD"
                  name="Este Provincial"
                  checked={formData.informacionAdicional.zonasOperacion.includes('Este Provincial')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="zonaD">Este Provincial</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="zonaE"
                  name="Oeste Provincial"
                  checked={formData.informacionAdicional.zonasOperacion.includes('Oeste Provincial')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="zonaE">Oeste Provincial</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="zonaF"
                  name="Toda la Provincia"
                  checked={formData.informacionAdicional.zonasOperacion.includes('Toda la Provincia')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="zonaF">Toda la Provincia</label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="informacionAdicional.proyectosActuales" className="form-label">Proyectos Actuales</label>
            <textarea
              id="informacionAdicional.proyectosActuales"
              name="informacionAdicional.proyectosActuales"
              value={formData.informacionAdicional.proyectosActuales}
              onChange={handleChange}
              className="form-input h-24"
              placeholder="Describa brevemente los proyectos actuales de la organización"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="informacionAdicional.necesidadesCapacitacion" className="form-label">Necesidades de Capacitación</label>
            <textarea
              id="informacionAdicional.necesidadesCapacitacion"
              name="informacionAdicional.necesidadesCapacitacion"
              value={formData.informacionAdicional.necesidadesCapacitacion}
              onChange={handleChange}
              className="form-input h-24"
              placeholder="Indique qué tipo de capacitaciones serían útiles para su organización"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="informacionAdicional.necesidadesFinanciamiento" className="form-label">Necesidades de Financiamiento</label>
            <textarea
              id="informacionAdicional.necesidadesFinanciamiento"
              name="informacionAdicional.necesidadesFinanciamiento"
              value={formData.informacionAdicional.necesidadesFinanciamiento}
              onChange={handleChange}
              className="form-input h-24"
              placeholder="Describa las necesidades de financiamiento de la organización"
            ></textarea>
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

export default FormularioOrganizacion;
