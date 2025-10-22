import React, { useState } from 'react';
import Layout from '@/components/Layout';
import MultiStepForm from '@/components/MultiStepForm';
import { motion } from 'framer-motion';
import { saveOrganizacionForm } from '@/lib/api';
import { useAuth } from '@/lib/authService';

// Definir tipos para el formulario
interface FormData {
  cuit: string;
  nombre: string;
  tipoOrganizacion: string;
  fechaConstitucion: string;
  domicilio: {
    calle: string;
    numero: string;
    piso: string;
    oficina: string;
    barrio: string;
    localidad: string;
    provincia: string;
    codigoPostal: string;
  };
  contacto: {
    telefono: string;
    email: string;
    sitioWeb: string;
  };
  actividad: {
    sectorEconomico: string;
    actividadPrincipal: string;
    cantidadEmpleados: string;
    facturacionAnual: string;
  };
  informacionAdicional: {
    participaPrograma: boolean;
    recibeSubsidios: boolean;
    esExportadora: boolean;
    necesitaCapacitacion: boolean;
    necesitaFinanciamiento: boolean;
    observaciones: string;
  };
}

interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Componentes para cada paso del formulario
const DatosBasicosStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Datos Básicos de la Organización</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cuit" className="form-label">CUIT *</label>
          <input
            type="text"
            id="cuit"
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="30-12345678-9"
          />
        </div>
        
        <div>
          <label htmlFor="nombre" className="form-label">Nombre/Razón Social *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Ingrese el nombre de la organización"
          />
        </div>
        
        <div>
          <label htmlFor="tipoOrganizacion" className="form-label">Tipo de Organización *</label>
          <select
            id="tipoOrganizacion"
            name="tipoOrganizacion"
            value={formData.tipoOrganizacion}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Cooperativa">Cooperativa</option>
            <option value="Asociación Civil">Asociación Civil</option>
            <option value="Fundación">Fundación</option>
            <option value="Empresa Social">Empresa Social</option>
            <option value="Sociedad Anónima">Sociedad Anónima</option>
            <option value="SRL">SRL</option>
            <option value="Monotributista Social">Monotributista Social</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="fechaConstitucion" className="form-label">Fecha de Constitución *</label>
          <input
            type="date"
            id="fechaConstitucion"
            name="fechaConstitucion"
            value={formData.fechaConstitucion}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
      </div>
    </div>
  );
};

const DomicilioStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    setFormData(prevData => ({
      ...prevData,
      [parent]: {
        ...prevData[parent as keyof typeof prevData] as Record<string, any>,
        [child]: value,
      },
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Domicilio Legal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="domicilio.calle" className="form-label">Calle *</label>
          <input
            type="text"
            id="domicilio.calle"
            name="domicilio.calle"
            value={formData.domicilio.calle}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Nombre de la calle"
          />
        </div>
        
        <div>
          <label htmlFor="domicilio.numero" className="form-label">Número *</label>
          <input
            type="text"
            id="domicilio.numero"
            name="domicilio.numero"
            value={formData.domicilio.numero}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Número de edificio"
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
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Si corresponde"
          />
        </div>
        
        <div>
          <label htmlFor="domicilio.oficina" className="form-label">Oficina/Depto</label>
          <input
            type="text"
            id="domicilio.oficina"
            name="domicilio.oficina"
            value={formData.domicilio.oficina}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Si corresponde"
          />
        </div>
        
        <div>
          <label htmlFor="domicilio.barrio" className="form-label">Barrio *</label>
          <input
            type="text"
            id="domicilio.barrio"
            name="domicilio.barrio"
            value={formData.domicilio.barrio}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Nombre del barrio"
          />
        </div>
        
        <div>
          <label htmlFor="domicilio.localidad" className="form-label">Localidad *</label>
          <input
            type="text"
            id="domicilio.localidad"
            name="domicilio.localidad"
            value={formData.domicilio.localidad}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Localidad"
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
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            disabled
          />
        </div>
        
        <div>
          <label htmlFor="domicilio.codigoPostal" className="form-label">Código Postal *</label>
          <input
            type="text"
            id="domicilio.codigoPostal"
            name="domicilio.codigoPostal"
            value={formData.domicilio.codigoPostal}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Ej: 5000"
          />
        </div>
      </div>
    </div>
  );
};

const ContactoStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    setFormData(prevData => ({
      ...prevData,
      [parent]: {
        ...prevData[parent as keyof typeof prevData] as Record<string, any>,
        [child]: value,
      },
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Información de Contacto</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contacto.telefono" className="form-label">Teléfono *</label>
          <input
            type="tel"
            id="contacto.telefono"
            name="contacto.telefono"
            value={formData.contacto.telefono}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Ej: 351-1234567"
          />
        </div>
        
        <div>
          <label htmlFor="contacto.email" className="form-label">Correo Electrónico *</label>
          <input
            type="email"
            id="contacto.email"
            name="contacto.email"
            value={formData.contacto.email}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="organizacion@ejemplo.com"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="contacto.sitioWeb" className="form-label">Sitio Web</label>
          <input
            type="url"
            id="contacto.sitioWeb"
            name="contacto.sitioWeb"
            value={formData.contacto.sitioWeb}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="https://www.ejemplo.com"
          />
        </div>
      </div>
    </div>
  );
};

const ActividadStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    setFormData(prevData => ({
      ...prevData,
      [parent]: {
        ...prevData[parent as keyof typeof prevData] as Record<string, any>,
        [child]: value,
      },
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Actividad Económica</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="actividad.sectorEconomico" className="form-label">Sector Económico *</label>
          <select
            id="actividad.sectorEconomico"
            name="actividad.sectorEconomico"
            value={formData.actividad.sectorEconomico}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Agricultura y Ganadería">Agricultura y Ganadería</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Artesanías">Artesanías</option>
            <option value="Comercio">Comercio</option>
            <option value="Construcción">Construcción</option>
            <option value="Educación">Educación</option>
            <option value="Manufactura">Manufactura</option>
            <option value="Reciclaje">Reciclaje</option>
            <option value="Servicios">Servicios</option>
            <option value="Textil">Textil</option>
            <option value="Turismo">Turismo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="actividad.actividadPrincipal" className="form-label">Actividad Principal *</label>
          <input
            type="text"
            id="actividad.actividadPrincipal"
            name="actividad.actividadPrincipal"
            value={formData.actividad.actividadPrincipal}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Describa la actividad principal"
          />
        </div>
        
        <div>
          <label htmlFor="actividad.cantidadEmpleados" className="form-label">Cantidad de Empleados/Asociados *</label>
          <select
            id="actividad.cantidadEmpleados"
            name="actividad.cantidadEmpleados"
            value={formData.actividad.cantidadEmpleados}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="1-5">1-5</option>
            <option value="6-10">6-10</option>
            <option value="11-20">11-20</option>
            <option value="21-50">21-50</option>
            <option value="51-100">51-100</option>
            <option value="Más de 100">Más de 100</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="actividad.facturacionAnual" className="form-label">Facturación Anual Aproximada *</label>
          <select
            id="actividad.facturacionAnual"
            name="actividad.facturacionAnual"
            value={formData.actividad.facturacionAnual}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Menos de $1.000.000">Menos de $1.000.000</option>
            <option value="$1.000.000 - $5.000.000">$1.000.000 - $5.000.000</option>
            <option value="$5.000.001 - $10.000.000">$5.000.001 - $10.000.000</option>
            <option value="$10.000.001 - $50.000.000">$10.000.001 - $50.000.000</option>
            <option value="Más de $50.000.000">Más de $50.000.000</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const InformacionAdicionalStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'informacionAdicional.observaciones') {
      setFormData(prevData => ({
        ...prevData,
        informacionAdicional: {
          ...prevData.informacionAdicional,
          observaciones: value,
        },
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const field = name.split('.')[1]; // Obtener el nombre del campo después del punto
    
    setFormData(prevData => ({
      ...prevData,
      informacionAdicional: {
        ...prevData.informacionAdicional,
        [field]: checked,
      },
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Información Adicional</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-3">
          <p className="form-label mb-2">Seleccione las opciones que correspondan:</p>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="informacionAdicional.participaPrograma"
              name="informacionAdicional.participaPrograma"
              checked={formData.informacionAdicional.participaPrograma}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="informacionAdicional.participaPrograma">Participa en algún programa de Economía Popular</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="informacionAdicional.recibeSubsidios"
              name="informacionAdicional.recibeSubsidios"
              checked={formData.informacionAdicional.recibeSubsidios}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="informacionAdicional.recibeSubsidios">Recibe subsidios o ayudas estatales</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="informacionAdicional.esExportadora"
              name="informacionAdicional.esExportadora"
              checked={formData.informacionAdicional.esExportadora}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="informacionAdicional.esExportadora">Realiza exportaciones</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="informacionAdicional.necesitaCapacitacion"
              name="informacionAdicional.necesitaCapacitacion"
              checked={formData.informacionAdicional.necesitaCapacitacion}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="informacionAdicional.necesitaCapacitacion">Necesita capacitación</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="informacionAdicional.necesitaFinanciamiento"
              name="informacionAdicional.necesitaFinanciamiento"
              checked={formData.informacionAdicional.necesitaFinanciamiento}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="informacionAdicional.necesitaFinanciamiento">Necesita financiamiento</label>
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="informacionAdicional.observaciones" className="form-label">Observaciones o Comentarios Adicionales</label>
          <textarea
            id="informacionAdicional.observaciones"
            name="informacionAdicional.observaciones"
            value={formData.informacionAdicional.observaciones}
            onChange={handleChange}
            className="form-input h-32 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Ingrese cualquier información adicional que considere relevante"
          />
        </div>
      </div>
    </div>
  );
};

const ConfirmacionStep: React.FC<{formData: FormData}> = ({ formData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Confirmación de Datos</h3>
      
      <p className="mb-4 text-gray-600 dark:text-gray-300">Por favor, verifique que todos los datos ingresados sean correctos antes de enviar el formulario.</p>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Datos Básicos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">CUIT:</span> {formData.cuit}</div>
          <div><span className="font-medium">Nombre/Razón Social:</span> {formData.nombre}</div>
          <div><span className="font-medium">Tipo de Organización:</span> {formData.tipoOrganizacion}</div>
          <div><span className="font-medium">Fecha de Constitución:</span> {formData.fechaConstitucion}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Domicilio Legal</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Calle:</span> {formData.domicilio.calle}</div>
          <div><span className="font-medium">Número:</span> {formData.domicilio.numero}</div>
          {formData.domicilio.piso && <div><span className="font-medium">Piso:</span> {formData.domicilio.piso}</div>}
          {formData.domicilio.oficina && <div><span className="font-medium">Oficina/Depto:</span> {formData.domicilio.oficina}</div>}
          <div><span className="font-medium">Barrio:</span> {formData.domicilio.barrio}</div>
          <div><span className="font-medium">Localidad:</span> {formData.domicilio.localidad}</div>
          <div><span className="font-medium">Provincia:</span> {formData.domicilio.provincia}</div>
          <div><span className="font-medium">Código Postal:</span> {formData.domicilio.codigoPostal}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Contacto</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Teléfono:</span> {formData.contacto.telefono}</div>
          <div><span className="font-medium">Email:</span> {formData.contacto.email}</div>
          {formData.contacto.sitioWeb && <div><span className="font-medium">Sitio Web:</span> {formData.contacto.sitioWeb}</div>}
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Actividad Económica</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Sector Económico:</span> {formData.actividad.sectorEconomico}</div>
          <div><span className="font-medium">Actividad Principal:</span> {formData.actividad.actividadPrincipal}</div>
          <div><span className="font-medium">Cantidad de Empleados/Asociados:</span> {formData.actividad.cantidadEmpleados}</div>
          <div><span className="font-medium">Facturación Anual Aproximada:</span> {formData.actividad.facturacionAnual}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Información Adicional</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div>
            <span className="font-medium">Participa en algún programa de Economía Popular:</span> 
            {formData.informacionAdicional.participaPrograma ? ' Sí' : ' No'}
          </div>
          <div>
            <span className="font-medium">Recibe subsidios o ayudas estatales:</span> 
            {formData.informacionAdicional.recibeSubsidios ? ' Sí' : ' No'}
          </div>
          <div>
            <span className="font-medium">Realiza exportaciones:</span> 
            {formData.informacionAdicional.esExportadora ? ' Sí' : ' No'}
          </div>
          <div>
            <span className="font-medium">Necesita capacitación:</span> 
            {formData.informacionAdicional.necesitaCapacitacion ? ' Sí' : ' No'}
          </div>
          <div>
            <span className="font-medium">Necesita financiamiento:</span> 
            {formData.informacionAdicional.necesitaFinanciamiento ? ' Sí' : ' No'}
          </div>
          {formData.informacionAdicional.observaciones && (
            <div className="mt-2">
              <span className="font-medium">Observaciones:</span> 
              <p className="mt-1 whitespace-pre-wrap">{formData.informacionAdicional.observaciones}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="confirmacion"
            className="mr-2"
            required
          />
          <label htmlFor="confirmacion" className="text-sm">
            Declaro que los datos proporcionados son verídicos y acepto los términos y condiciones del programa.
          </label>
        </div>
      </div>
    </div>
  );
};

const FormularioOrganizacionPage = () => {
  const [formData, setFormData] = useState<FormData>({
    cuit: '',
    nombre: '',
    tipoOrganizacion: '',
    fechaConstitucion: '',
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
    contacto: {
      telefono: '',
      email: '',
      sitioWeb: '',
    },
    actividad: {
      sectorEconomico: '',
      actividadPrincipal: '',
      cantidadEmpleados: '',
      facturacionAnual: '',
    },
    informacionAdicional: {
      participaPrograma: false,
      recibeSubsidios: false,
      esExportadora: false,
      necesitaCapacitacion: false,
      necesitaFinanciamiento: false,
      observaciones: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await saveOrganizacionForm(formData);
      alert('¡Solicitud enviada con éxito!');
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Ocurrió un error al guardar el formulario. Por favor, intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Estado para controlar el paso actual
  const [currentStep, setCurrentStep] = useState(0);

  // Definir los pasos del formulario con la estructura esperada por MultiStepForm
  const steps = [
    {
      title: 'Datos Básicos',
      component: <DatosBasicosStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: 'Domicilio',
      component: <DomicilioStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: 'Contacto',
      component: <ContactoStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: 'Actividad',
      component: <ActividadStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: 'Información Adicional',
      component: <InformacionAdicionalStep formData={formData} setFormData={setFormData} />,
    },
    {
      title: 'Confirmación',
      component: <ConfirmacionStep formData={formData} />,
    },
  ];

  if (success) {
    return (
      <Layout title="Registro de Organización - Economía Popular">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-6 rounded-lg relative mb-6"
          >
            <h2 className="text-2xl font-bold mb-4">¡Registro Exitoso!</h2>
            <p className="mb-4">Los datos de su organización han sido registrados correctamente en el sistema de Economía Popular.</p>
            <p className="mb-6">Un agente se pondrá en contacto con usted para los siguientes pasos.</p>
            <div className="flex justify-center">
              <motion.button 
                onClick={() => window.location.href = '/'}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Volver al inicio
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Registro de Organización - Economía Popular">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-400">Registro de Organización - Economía Popular</h1>
          
          <MultiStepForm
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onSubmit={handleSubmit}
            isSubmitting={loading}
            submitError={error}
          />
        </motion.div>
      </div>
    </Layout>
  );
}

export default FormularioOrganizacionPage;
