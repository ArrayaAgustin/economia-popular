import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MultiStepForm, { Step } from '@/components/MultiStepForm';
import { motion } from 'framer-motion';
import { savePersonForm, getPersonaData, getUsuarioData, getUsuarioCompletoData } from '@/lib/api';
import { Usuario } from '@/lib/authService';
import { useAuth } from '@/pages/_app';
import AuthGuard from '@/components/AuthGuard';

// Definir tipos para el formulario
interface FormData {
  cuil: string;
  nombre: string;
  apellido: string;
  genero: string;
  telefono: string;
  email: string;
  nivelEducativo: string;
  tituloProfesional: string;
  trabajosEconomiaSocial: string;
  ingresoTotalIndividual: string;
  tieneMonotributo: string;
  tieneTrabajoDependencia: string;
  salarioTrabajoDependencia: string;
  trabajoDependenciaPrincipal: string;
  fechaNacimiento: string;
  estadoCivil: string;
  nacionalidad: string;
  domicilio: {
    calle: string;
    numero: string;
    piso: string;
    departamento: string;
    barrio: string;
    localidad: string;
    provincia: string;
    codigoPostal: string;
  };
  contacto: {
    telefono: string;
    email: string;
  };
  situacionLaboral: string;
  actividadEconomica: string;
  ingresos: string;
  programasSociales: string[];
  formaTrabajoPrincipal: string;
  actividadPrincipal: string;
  otraActividadPrincipal: string;
  lugarTrabajoPrincipal: string;
  monotributoTrabajoPrincipal: string;
  ingresoMensualTrabajoPrincipal: string;
  suficienciaIngreso: string;
  constanciaIngreso: string;
  usaMediosElectronicos: string;
  tipoAplicaciones: string[];
  otrasAplicaciones: string;
  estrategiasPublicidad: string[];
  // Campos para el paso de Emprendimiento
  emprendimientoCalle: string;
  emprendimientoNumero: string;
  emprendimientoCodigoPostal: string;
  emprendimientoDepartamento: string;
  emprendimientoLocalidad: string;
  emprendimientoTieneNombre: string;
  emprendimientoNombre: string;
  emprendimientoTiempoFuncionamiento: string;
  emprendimientoMarcoOrganizacion: string;
  emprendimientoNombreOrganizacion: string;
  // Campos para el segundo trabajo
  tieneSegundoTrabajo: string;
  formaTrabajoSegundo: string;
  actividadSegundoTrabajo: string;
  otraActividadSegundoTrabajo: string;
  lugarTrabajoSegundo: string;
  monotributoTrabajoSegundo: string;
  ingresoMensualTrabajoSegundo: string;
  suficienciaIngresoSegundo: string;
  constanciaIngresoSegundo: string;
  usaMediosElectronicosSegundo: string;
  tipoAplicacionesSegundo: string[];
  otrasAplicacionesSegundo: string;
  estrategiasPublicidadSegundo: string[];
  // Campos para el segundo emprendimiento
  segundoEmprendimientoCalle: string;
  segundoEmprendimientoNumero: string;
  segundoEmprendimientoCodigoPostal: string;
  segundoEmprendimientoDepartamento: string;
  segundoEmprendimientoLocalidad: string;
  segundoEmprendimientoTieneNombre: string;
  segundoEmprendimientoNombre: string;
  segundoEmprendimientoTiempoFuncionamiento: string;
  segundoEmprendimientoMarcoOrganizacion: string;
  segundoEmprendimientoNombreOrganizacion: string;
}

interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Componentes para cada paso del formulario
const DatosPersonalesStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Datos Personales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="form-label">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Ingrese su nombre"
          />
        </div>
        
        <div>
          <label htmlFor="apellido" className="form-label">Apellido *</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Ingrese su apellido"
          />
        </div>
        
        <div>
          <label htmlFor="cuil" className="form-label">CUIL *</label>
          <input
            type="text"
            id="cuil"
            name="cuil"
            value={formData.cuil}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="20-12345678-9"
          />
        </div>
        
        <div>
          <label htmlFor="genero" className="form-label">Género *</label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Mujer">Mujer</option>
            <option value="Varon">Varon</option>
            <option value="Feminidad Trans/Travesti">Feminidad Trans/Travesti</option>
            <option value="Masculinidad Trans">Masculinidad Trans</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="telefono" className="form-label">Número de teléfono *</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Ej: 351-1234567"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Email que usas en tu emprendimiento *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="ejemplo@correo.com"
          />
        </div>
        
        <div>
          <label htmlFor="nivelEducativo" className="form-label">¿Cuál es tu máximo nivel educativo alcanzado hasta el momento? *</label>
          <select
            id="nivelEducativo"
            name="nivelEducativo"
            value={formData.nivelEducativo}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Sin estudios">Sin estudios</option>
            <option value="Primario Incompleto">Primario Incompleto</option>
            <option value="Secundario Incompleto">Secundario Incompleto</option>
            <option value="Secundario Completo">Secundario Completo</option>
            <option value="Terciario Incompleto">Terciario Incompleto</option>
            <option value="Terciario Completo">Terciario Completo</option>
            <option value="Universitario Incompleto">Universitario Incompleto</option>
            <option value="Universitario Completo">Universitario Completo</option>
            <option value="Educacion Especial">Educacion Especial</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="tituloProfesional" className="form-label">¿Tenés título profesional (universitario de grado)? *</label>
          <select
            id="tituloProfesional"
            name="tituloProfesional"
            value={formData.tituloProfesional}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Si, y ejerzo como tal">Si, y ejerzo como tal</option>
            <option value="Si, pero mi trabajo no se relaciona con mi profesión">Si, pero mi trabajo no se relaciona con mi profesión</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const DatosGeneralesStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Datos Generales Sobre Tus Trabajos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="trabajosEconomiaSocial" className="form-label">¿Cuántos trabajos tenes en la Economía Social/Popular? *</label>
          <select id="trabajosEconomiaSocial" name="trabajosEconomiaSocial" value={formData.trabajosEconomiaSocial} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Uno">Uno</option>
            <option value="Dos">Dos</option>
            <option value="Tres">Tres</option>
            <option value="Cuatro o mas">Cuatro o mas</option>
          </select>
        </div>
        <div>
          <label htmlFor="ingresoTotalIndividual" className="form-label">En relación a tu grupo conviviente ¿Tu ingreso total individual por tus trabajos en la Economía Social/Popular representa? *</label>
          <select id="ingresoTotalIndividual" name="ingresoTotalIndividual" value={formData.ingresoTotalIndividual} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Menos del 50% del ingreso de tu grupo conviviente">Menos del 50% del ingreso de tu grupo conviviente</option>
            <option value="El 50% del ingreso de tu grupo conviviente">El 50% del ingreso de tu grupo conviviente</option>
            <option value="Más del 50% del ingreso de tu grupo conviviente">Más del 50% del ingreso de tu grupo conviviente</option>
            <option value="El total del ingreso de tu grupo conviviente">El total del ingreso de tu grupo conviviente</option>
          </select>
        </div>
        <div>
          <label htmlFor="tieneMonotributo" className="form-label">¿Tenes Monotributo? *</label>
          <select id="tieneMonotributo" name="tieneMonotributo" value={formData.tieneMonotributo} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="tieneTrabajoDependencia" className="form-label">Además de tus trabajos en la Economía Social/Popular, ¿Tenes trabajo/s en relación de dependencia (esto es, si tenes patrón / empleador)? *</label>
          <select id="tieneTrabajoDependencia" name="tieneTrabajoDependencia" value={formData.tieneTrabajoDependencia} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        {formData.tieneTrabajoDependencia === 'Si' && (
          <>
            <div>
              <label htmlFor="salarioTrabajoDependencia" className="form-label">En relación a la pregunta anterior, ¿El salario que recibís por este/estos trabajo/s en relación de dependencia es? Puedes ver los valores desde <a href="https://www.argentina.gob.ar/trabajo/consejodelsalario" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">esta página</a> *</label>
              <select id="salarioTrabajoDependencia" name="salarioTrabajoDependencia" value={formData.salarioTrabajoDependencia} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
                <option value="">Seleccione...</option>
                <option value="Menor a dos Salario Mínimo Vital y Móvil">Menor a dos Salario Mínimo Vital y Móvil</option>
                <option value="Igual o mayor a Dos Salario Mínimo Vital y Móvil">Igual o mayor a Dos Salario Mínimo Vital y Móvil</option>
              </select>
            </div>
            <div>
              <label htmlFor="trabajoDependenciaPrincipal" className="form-label">¿Este trabajo en relación de dependencia es tu principal fuente de ingresos? *</label>
              <select id="trabajoDependenciaPrincipal" name="trabajoDependenciaPrincipal" value={formData.trabajoDependenciaPrincipal} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
                <option value="">Seleccione...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const SegundoEmprendimientoStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Only show this component if the user has more than one job
  if (formData.trabajosEconomiaSocial === 'Uno' || !formData.trabajosEconomiaSocial) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Datos del Segundo Emprendimiento</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="segundoEmprendimientoCalle" className="form-label">50) Calle del domicilio de tu segundo Emprendimiento (Si no tiene domicilio fijo indique "ambulante") *</label>
          <input
            type="text"
            id="segundoEmprendimientoCalle"
            name="segundoEmprendimientoCalle"
            value={formData.segundoEmprendimientoCalle || ''}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="segundoEmprendimientoNumero" className="form-label">51) Número del domicilio de tu segundo Emprendimiento *</label>
          <input
            type="number"
            id="segundoEmprendimientoNumero"
            name="segundoEmprendimientoNumero"
            value={formData.segundoEmprendimientoNumero || ''}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="segundoEmprendimientoCodigoPostal" className="form-label">52) Código Postal *</label>
          <input
            type="number"
            id="segundoEmprendimientoCodigoPostal"
            name="segundoEmprendimientoCodigoPostal"
            value={formData.segundoEmprendimientoCodigoPostal || ''}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="segundoEmprendimientoDepartamento" className="form-label">53) Departamento *</label>
          <select
            id="segundoEmprendimientoDepartamento"
            name="segundoEmprendimientoDepartamento"
            value={formData.segundoEmprendimientoDepartamento || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Calamuchita">Calamuchita</option>
            <option value="Capital">Capital</option>
            <option value="Colón">Colón</option>
            <option value="Cruz del Eje">Cruz del Eje</option>
            <option value="General Roca">General Roca</option>
            <option value="General San Martín">General San Martín</option>
            <option value="Ischilín">Ischilín</option>
            <option value="Juárez Celman">Juárez Celman</option>
            <option value="Marcos Juárez">Marcos Juárez</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="segundoEmprendimientoLocalidad" className="form-label">54) Localidad *</label>
          <select
            id="segundoEmprendimientoLocalidad"
            name="segundoEmprendimientoLocalidad"
            value={formData.segundoEmprendimientoLocalidad || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Alta Gracia">Alta Gracia</option>
            <option value="Arroyito">Arroyito</option>
            <option value="Bell Ville">Bell Ville</option>
            <option value="Capilla del Monte">Capilla del Monte</option>
            <option value="Carlos Paz (Villa Carlos Paz)">Carlos Paz (Villa Carlos Paz)</option>
            <option value="Cruz del Eje">Cruz del Eje</option>
            <option value="Córdoba (Capital)">Córdoba (Capital)</option>
            <option value="Corral de Bustos">Corral de Bustos</option>
            <option value="Cosquín">Cosquín</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="segundoEmprendimientoTieneNombre" className="form-label">55) ¿Tiene nombre este segundo emprendimiento donde trabajas? *</label>
          <select
            id="segundoEmprendimientoTieneNombre"
            name="segundoEmprendimientoTieneNombre"
            value={formData.segundoEmprendimientoTieneNombre || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        
        {formData.segundoEmprendimientoTieneNombre === 'Si' && (
          <div className="md:col-span-2">
            <label htmlFor="segundoEmprendimientoNombre" className="form-label">56) ¿Cuál es el nombre de este segundo emprendimiento? *</label>
            <input
              type="text"
              id="segundoEmprendimientoNombre"
              name="segundoEmprendimientoNombre"
              value={formData.segundoEmprendimientoNombre || ''}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        <div className="md:col-span-2">
          <label htmlFor="segundoEmprendimientoTiempoFuncionamiento" className="form-label">57) ¿Hace cuanto tiempo que está en funcionamiento este segundo emprendimiento? *</label>
          <select
            id="segundoEmprendimientoTiempoFuncionamiento"
            name="segundoEmprendimientoTiempoFuncionamiento"
            value={formData.segundoEmprendimientoTiempoFuncionamiento || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Menos de 1 año">Menos de 1 año</option>
            <option value="Entre 1 y 5 años">Entre 1 y 5 años</option>
            <option value="Hace más de 5 años">Hace más de 5 años</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="segundoEmprendimientoMarcoOrganizacion" className="form-label">58) ¿Realizas este segundo trabajo en el marco de una organización social/comunitaria? *</label>
          <select
            id="segundoEmprendimientoMarcoOrganizacion"
            name="segundoEmprendimientoMarcoOrganizacion"
            value={formData.segundoEmprendimientoMarcoOrganizacion || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        
        {formData.segundoEmprendimientoMarcoOrganizacion === 'Si' && (
          <div className="md:col-span-2">
            <label htmlFor="segundoEmprendimientoNombreOrganizacion" className="form-label">59) ¿Cuál es el nombre de la organización? *</label>
            <input
              type="text"
              id="segundoEmprendimientoNombreOrganizacion"
              name="segundoEmprendimientoNombreOrganizacion"
              value={formData.segundoEmprendimientoNombreOrganizacion || ''}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};

const EmprendimientoStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Datos del Emprendimiento</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="emprendimientoCalle" className="form-label">Calle del domicilio de tu Emprendimiento (Si no tiene domicilio fijo indique "ambulante") *</label>
          <input
            type="text"
            id="emprendimientoCalle"
            name="emprendimientoCalle"
            value={formData.emprendimientoCalle || ''}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="emprendimientoNumero" className="form-label">Número del domicilio de tu Emprendimiento *</label>
          <input
            type="number"
            id="emprendimientoNumero"
            name="emprendimientoNumero"
            value={formData.emprendimientoNumero || ''}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="emprendimientoCodigoPostal" className="form-label">Código Postal *</label>
          <input
            type="number"
            id="emprendimientoCodigoPostal"
            name="emprendimientoCodigoPostal"
            value={formData.emprendimientoCodigoPostal || ''}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="emprendimientoDepartamento" className="form-label">Departamento *</label>
          <select
            id="emprendimientoDepartamento"
            name="emprendimientoDepartamento"
            value={formData.emprendimientoDepartamento || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Calamuchita">Calamuchita</option>
            <option value="Capital">Capital</option>
            <option value="Colón">Colón</option>
            <option value="Cruz del Eje">Cruz del Eje</option>
            <option value="General Roca">General Roca</option>
            <option value="General San Martín">General San Martín</option>
            <option value="Ischilín">Ischilín</option>
            <option value="Juárez Celman">Juárez Celman</option>
            <option value="Marcos Juárez">Marcos Juárez</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="emprendimientoLocalidad" className="form-label">Localidad *</label>
          <select
            id="emprendimientoLocalidad"
            name="emprendimientoLocalidad"
            value={formData.emprendimientoLocalidad || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Alta Gracia">Alta Gracia</option>
            <option value="Arroyito">Arroyito</option>
            <option value="Bell Ville">Bell Ville</option>
            <option value="Capilla del Monte">Capilla del Monte</option>
            <option value="Carlos Paz (Villa Carlos Paz)">Carlos Paz (Villa Carlos Paz)</option>
            <option value="Cruz del Eje">Cruz del Eje</option>
            <option value="Córdoba (Capital)">Córdoba (Capital)</option>
            <option value="Corral de Bustos">Corral de Bustos</option>
            <option value="Cosquín">Cosquín</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="emprendimientoTieneNombre" className="form-label">¿Tiene nombre este emprendimiento donde trabajas? *</label>
          <select
            id="emprendimientoTieneNombre"
            name="emprendimientoTieneNombre"
            value={formData.emprendimientoTieneNombre || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        
        {formData.emprendimientoTieneNombre === 'Si' && (
          <div className="md:col-span-2">
            <label htmlFor="emprendimientoNombre" className="form-label">¿Cuál es el nombre de este emprendimiento? *</label>
            <input
              type="text"
              id="emprendimientoNombre"
              name="emprendimientoNombre"
              value={formData.emprendimientoNombre || ''}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        <div className="md:col-span-2">
          <label htmlFor="emprendimientoTiempoFuncionamiento" className="form-label">¿Hace cuanto tiempo que está en funcionamiento este emprendimiento? *</label>
          <select
            id="emprendimientoTiempoFuncionamiento"
            name="emprendimientoTiempoFuncionamiento"
            value={formData.emprendimientoTiempoFuncionamiento || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Menos de 1 año">Menos de 1 año</option>
            <option value="Entre 1 y 5 años">Entre 1 y 5 años</option>
            <option value="Hace más de 5 años">Hace más de 5 años</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="emprendimientoMarcoOrganizacion" className="form-label">¿Realizas este trabajo en el marco de una organización social/comunitaria? *</label>
          <select
            id="emprendimientoMarcoOrganizacion"
            name="emprendimientoMarcoOrganizacion"
            value={formData.emprendimientoMarcoOrganizacion || ''}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        
        {formData.emprendimientoMarcoOrganizacion === 'Si' && (
          <div className="md:col-span-2">
            <label htmlFor="emprendimientoNombreOrganizacion" className="form-label">¿Cuál es el nombre de la organización? *</label>
            <input
              type="text"
              id="emprendimientoNombreOrganizacion"
              name="emprendimientoNombreOrganizacion"
              value={formData.emprendimientoNombreOrganizacion || ''}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};

const SegundoTrabajoStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, dataset } = e.target;
    const stateKey = dataset.statekey as keyof FormData;

    if (typeof stateKey === 'string') {
        const currentValues = formData[stateKey] as string[] || [];
        let newValues: string[];

        if (checked) {
            newValues = [...currentValues, name];
        } else {
            newValues = currentValues.filter(item => item !== name);
        }

        setFormData(prevData => ({
            ...prevData,
            [stateKey]: newValues,
        }));
    }
  };

  // Only show this step if user has indicated they have more than one job
  if (formData.trabajosEconomiaSocial === 'Uno' || !formData.trabajosEconomiaSocial) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Segundo Trabajo en la Economía Social/Popular</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="formaTrabajoSegundo" className="form-label">38) ¿De qué manera realizas tu segundo trabajo en la Economía Social/Popular? *</label>
          <select id="formaTrabajoSegundo" name="formaTrabajoSegundo" value={formData.formaTrabajoSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Individual">Individual</option>
            <option value="En un emprendimiento familiar">En un emprendimiento familiar</option>
            <option value="En un emprendimiento asociativo/comunitario social (no familiar)">En un emprendimiento asociativo/comunitario social (no familiar)</option>
          </select>
        </div>

        <div>
          <label htmlFor="actividadSegundoTrabajo" className="form-label">39) Dentro de este emprendimiento, ¿a qué trabajo te dedicas principalmente? *</label>
          <select id="actividadSegundoTrabajo" name="actividadSegundoTrabajo" value={formData.actividadSegundoTrabajo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Agricultura">Agricultura</option>
            <option value="Acompañamiento de reinserción de liberados/as y recuperados/as">Acompañamiento de reinserción de liberados/as y recuperados/as</option>
            <option value="Actor/Actriz/Músicos/Artistas plásticos">Actor/Actriz/Músicos/Artistas plásticos</option>
            <option value="Acuicultura">Acuicultura</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

            {formData.actividadSegundoTrabajo === 'Otros' && (
              <div className="md:col-span-2">
                <label htmlFor="otraActividadSegundoTrabajo" className="form-label">40) Si no encontraste tu trabajo en la pregunta anterior, detalla qué tipo de trabajo realizas</label>
                <textarea
                  id="otraActividadSegundoTrabajo"
                  name="otraActividadSegundoTrabajo"
                  value={formData.otraActividadSegundoTrabajo || ''}
                  onChange={handleChange}
                  className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Detalle su trabajo"
                />
              </div>
            )}

            <div>
              <label htmlFor="lugarTrabajoSegundo" className="form-label">41) ¿Dónde realizas principalmente este trabajo? *</label>
              <select id="lugarTrabajoSegundo" name="lugarTrabajoSegundo" value={formData.lugarTrabajoSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
                <option value="">Seleccione...</option>
                <option value="En un local / oficina / establecimiento / negocio / taller / chacra / finca">En un local / oficina / establecimiento / negocio / taller / chacra / finca</option>
                <option value="En feria, puesto fijo o kiosco callejero">En feria, puesto fijo o kiosco callejero</option>
                <option value="En vehículos: bicicleta, moto, auto, barco, bote (no incluye servicio de transporte)">En vehículos: bicicleta, moto, auto, barco, bote (no incluye servicio de transporte)</option>
                <option value="En vehículo para transporte de personas y mercaderías - aéreos, marítimo, terrestre - incluye taxis, colectivos, camiones, furgones, transporte de combustible, mudanzas, etc.)">En vehículo para transporte de personas y mercaderías - aéreos, marítimo, terrestre - incluye taxis, colectivos, camiones, furgones, transporte de combustible, mudanzas, etc.)</option>
                <option value="En obras en construcción, de infraestructura, minería o similares">En obras en construcción, de infraestructura, minería o similares</option>
                <option value="En vivienda propia o en la de algún otro integrante del emprendimiento">En vivienda propia o en la de algún otro integrante del emprendimiento</option>
                <option value="En el domicilio del cliente">En el domicilio del cliente</option>
                <option value="En la calle, espacios públicos, ambulante, de casa en casa, puesto móvil callejero">En la calle, espacios públicos, ambulante, de casa en casa, puesto móvil callejero</option>
                <option value="En otro lugar">En otro lugar</option>
              </select>
            </div>

            <div>
              <label htmlFor="monotributoTrabajoSegundo" className="form-label">42) Para desarrollar este segundo trabajo, ¿estás registrado/a en el monotributo? *</label>
              <select id="monotributoTrabajoSegundo" name="monotributoTrabajoSegundo" value={formData.monotributoTrabajoSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
                <option value="">Seleccione...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="ingresoMensualTrabajoSegundo" className="form-label">43) ¿Por lo general tu ingreso mensual por este segundo trabajo es? *</label>
              <select id="ingresoMensualTrabajoSegundo" name="ingresoMensualTrabajoSegundo" value={formData.ingresoMensualTrabajoSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
                <option value="">Seleccione...</option>
                <option value="Menor al Salario Mínimo Vital y Móvil">Menor al Salario Mínimo Vital y Móvil</option>
                <option value="Igual o mayor al Salario Mínimo Vital y Móvil">Igual o mayor al Salario Mínimo Vital y Móvil</option>
                <option value="No recibo un ingreso por este trabajo">No recibo un ingreso por este trabajo</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Puedes ver los valores desde <a href="https://www.argentina.gob.ar/trabajo/consejodelsalario" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">esta página</a>.</p>
            </div>
            
            {formData.ingresoMensualTrabajoSegundo === 'Menor al Salario Mínimo Vital y Móvil' && (
                <div>
                    <label htmlFor="suficienciaIngresoSegundo" className="form-label">44) Consideras que tu ingreso por este segundo trabajo es</label>
                    <select id="suficienciaIngresoSegundo" name="suficienciaIngresoSegundo" value={formData.suficienciaIngresoSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <option value="">Seleccione...</option>
                        <option value="Suficiente, pero preciso complementar con otras fuentes de ingreso">Suficiente, pero preciso complementar con otras fuentes de ingreso</option>
                        <option value="Suficiente, vivo principalmente de este trabajo">Suficiente, vivo principalmente de este trabajo</option>
                        <option value="Insuficiente, estoy buscando otras fuentes de ingresos">Insuficiente, estoy buscando otras fuentes de ingresos</option>
                        <option value="Insuficiente, tengo otras fuentes de ingreso">Insuficiente, tengo otras fuentes de ingreso</option>
                    </select>
                </div>
            )}

            {formData.ingresoMensualTrabajoSegundo === 'Igual o mayor al Salario Mínimo Vital y Móvil' && (
                <div>
                    <label htmlFor="constanciaIngresoSegundo" className="form-label">45) La constancia del ingreso por este segundo trabajo, ¿por qué medio es?</label>
                    <select id="constanciaIngresoSegundo" name="constanciaIngresoSegundo" value={formData.constanciaIngresoSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <option value="">Seleccione...</option>
                        <option value="Factura (u otro comprobante del monotributo)">Factura (u otro comprobante del monotributo)</option>
                        <option value="Recibo de adelanto de retorno (cooperativa)">Recibo de adelanto de retorno (cooperativa)</option>
                        <option value="Otro">Otro</option>
                        <option value="No tengo ninguna constancia">No tengo ninguna constancia</option>
                    </select>
                </div>
            )}

            <div>
              <label htmlFor="usaMediosElectronicosSegundo" className="form-label">46) ¿Utilizas el celular u otro medio electrónico (computadora, tablet, etc.) para trabajar? *</label>
              <select id="usaMediosElectronicosSegundo" name="usaMediosElectronicosSegundo" value={formData.usaMediosElectronicosSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
                <option value="">Seleccione...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>

            {formData.usaMediosElectronicosSegundo === 'Si' && (
              <div className="md:col-span-2">
                <label className="form-label">47) ¿Qué tipo de aplicaciones utilizas? (se puede marcar más de una opción)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div><input type="checkbox" id="appDeliverySegundo" name="Aplicaciones de delivery (Rappi, Uber, otras)" data-statekey="tipoAplicacionesSegundo" checked={formData.tipoAplicacionesSegundo?.includes('Aplicaciones de delivery (Rappi, Uber, otras)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appDeliverySegundo">Aplicaciones de delivery (Rappi, Uber, otras)</label></div>
                    <div><input type="checkbox" id="appCobroSegundo" name="Aplicaciones de cobro (mercado pago, transferencias bancarias, otras)" data-statekey="tipoAplicacionesSegundo" checked={formData.tipoAplicacionesSegundo?.includes('Aplicaciones de cobro (mercado pago, transferencias bancarias, otras)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appCobroSegundo">Aplicaciones de cobro (mercado pago, transferencias bancarias, otras)</label></div>
                    <div><input type="checkbox" id="appRedesSegundo" name="Redes sociales para promocionar/vender tu producto o servicio (Whatsapp, Instagram; Facebook, marketplace, TikTok,otras)" data-statekey="tipoAplicacionesSegundo" checked={formData.tipoAplicacionesSegundo?.includes('Redes sociales para promocionar/vender tu producto o servicio (Whatsapp, Instagram; Facebook, marketplace, TikTok,otras)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appRedesSegundo">Redes sociales para promocionar/vender</label></div>
                    <div><input type="checkbox" id="appWebSegundo" name="Página web propia" data-statekey="tipoAplicacionesSegundo" checked={formData.tipoAplicacionesSegundo?.includes('Página web propia') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appWebSegundo">Página web propia</label></div>
                    <div><input type="checkbox" id="appOtrosSegundo" name="Otros" data-statekey="tipoAplicacionesSegundo" checked={formData.tipoAplicacionesSegundo?.includes('Otros') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appOtrosSegundo">Otros</label></div>
                </div>
                {formData.tipoAplicacionesSegundo?.includes('Otros') && (
                  <div className="mt-4">
                    <label htmlFor="otrasAplicacionesSegundo" className="form-label">48) Si respondiste "Otros", detallar qué tipo de aplicaciones utilizas:</label>
                    <textarea id="otrasAplicacionesSegundo" name="otrasAplicacionesSegundo" value={formData.otrasAplicacionesSegundo || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" rows={2} placeholder="Detalle otras aplicaciones" />
                  </div>
                )}
              </div>
            )}

        <div className="md:col-span-2">
          <label className="form-label">49) ¿Qué acciones o estrategias tomas para publicitar o visibilizar tu emprendimiento? (se puede marcar más de una opción)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div><input type="checkbox" id="pubBocaSegundo" name="De boca en boca" data-statekey="estrategiasPublicidadSegundo" checked={formData.estrategiasPublicidadSegundo?.includes('De boca en boca') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubBocaSegundo">De boca en boca</label></div>
            <div><input type="checkbox" id="pubImpresosSegundo" name="Recursos impresos (folleteria, imanes, revista de barrio, calcomanías, etc.)" data-statekey="estrategiasPublicidadSegundo" checked={formData.estrategiasPublicidadSegundo?.includes('Recursos impresos (folleteria, imanes, revista de barrio, calcomanías, etc.)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubImpresosSegundo">Recursos impresos</label></div>
            <div><input type="checkbox" id="pubDigitalNoPagaSegundo" name="Publicidad digital no paga (posteos en redes, fotos y videos de los productos, flyers digitales, etc.)" data-statekey="estrategiasPublicidadSegundo" checked={formData.estrategiasPublicidadSegundo?.includes('Publicidad digital no paga (posteos en redes, fotos y videos de los productos, flyers digitales, etc.)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubDigitalNoPagaSegundo">Publicidad digital no paga</label></div>
            <div><input type="checkbox" id="pubDigitalPagaSegundo" name="Publicidad digital paga (promoción en instagram, anuncios patrocinados en la web, etc.)" data-statekey="estrategiasPublicidadSegundo" checked={formData.estrategiasPublicidadSegundo?.includes('Publicidad digital paga (promoción en instagram, anuncios patrocinados en la web, etc.)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubDigitalPagaSegundo">Publicidad digital paga</label></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrabajoPrincipalStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, dataset } = e.target;
    const stateKey = dataset.statekey as keyof FormData;

    if (typeof stateKey === 'string') {
        const currentValues = formData[stateKey] as string[] || [];
        let newValues: string[];

        if (checked) {
            newValues = [...currentValues, name];
        } else {
            newValues = currentValues.filter(item => item !== name);
        }

        setFormData(prevData => ({
            ...prevData,
            [stateKey]: newValues,
        }));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Trabajo Principal en la Economía Social/Popular</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label htmlFor="formaTrabajoPrincipal" className="form-label">15) ¿De qué manera realizas tu trabajo principal en la Economía Social/Popular? *</label>
          <select id="formaTrabajoPrincipal" name="formaTrabajoPrincipal" value={formData.formaTrabajoPrincipal || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Individual">Individual</option>
            <option value="En un emprendimiento familiar">En un emprendimiento familiar</option>
            <option value="En un emprendimiento asociativo/comunitario social (no familiar)">En un emprendimiento asociativo/comunitario social (no familiar)</option>
          </select>
        </div>

        <div>
          <label htmlFor="actividadPrincipal" className="form-label">16) Dentro de este emprendimiento, ¿a qué trabajo te dedicas principalmente? *</label>
          <select id="actividadPrincipal" name="actividadPrincipal" value={formData.actividadPrincipal || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Agricultura">Agricultura</option>
            <option value="Acompañamiento de reinserción de liberados/as y recuperados/as">Acompañamiento de reinserción de liberados/as y recuperados/as</option>
            <option value="Actor/Actriz/Músicos/Artistas plásticos">Actor/Actriz/Músicos/Artistas plásticos</option>
            <option value="Acuicultura">Acuicultura</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        {formData.actividadPrincipal === 'Otros' && (
          <div className="md:col-span-2">
            <label htmlFor="otraActividadPrincipal" className="form-label">17) Si no encontraste tu trabajo en la pregunta anterior, detalla qué tipo de trabajo realizas</label>
            <textarea
              id="otraActividadPrincipal"
              name="otraActividadPrincipal"
              value={formData.otraActividadPrincipal || ''}
              onChange={handleChange}
              className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              rows={3}
              placeholder="Detalle su trabajo"
            />
          </div>
        )}

        <div>
          <label htmlFor="lugarTrabajoPrincipal" className="form-label">18) ¿ Dónde realizas principalmente tus trabajos? *</label>
          <select id="lugarTrabajoPrincipal" name="lugarTrabajoPrincipal" value={formData.lugarTrabajoPrincipal || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="En un local / oficina / establecimiento / negocio / taller / chacra / finca">En un local / oficina / establecimiento / negocio / taller / chacra / finca</option>
            <option value="En feria, puesto fijo o kiosco callejero">En feria, puesto fijo o kiosco callejero</option>
            <option value="En vehículos: bicicleta, moto, auto, barco, bote (no incluye servicio de transporte)">En vehículos: bicicleta, moto, auto, barco, bote (no incluye servicio de transporte)</option>
            <option value="En vehículo para transporte de personas y mercaderías - aéreos, marítimo, terrestre - incluye taxis, colectivos, camiones, furgones, transporte de combustible, mudanzas, etc.)">En vehículo para transporte de personas y mercaderías - aéreos, marítimo, terrestre - incluye taxis, colectivos, camiones, furgones, transporte de combustible, mudanzas, etc.)</option>
            <option value="En obras en construcción, de infraestructura, minería o similares">En obras en construcción, de infraestructura, minería o similares</option>
            <option value="En vivienda propia o en la de algún otro integrante del emprendimiento">En vivienda propia o en la de algún otro integrante del emprendimiento</option>
            <option value="En el domicilio del cliente">En el domicilio del cliente</option>
            <option value="En la calle, espacios públicos, ambulante, de casa en casa, puesto móvil callejero">En la calle, espacios públicos, ambulante, de casa en casa, puesto móvil callejero</option>
            <option value="En otro lugar">En otro lugar</option>
          </select>
        </div>

        <div>
          <label htmlFor="monotributoTrabajoPrincipal" className="form-label">19) Para desarrollar este trabajo, ¿estás registrado/a en el monotributo? *</label>
          <select id="monotributoTrabajoPrincipal" name="monotributoTrabajoPrincipal" value={formData.monotributoTrabajoPrincipal || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="ingresoMensualTrabajoPrincipal" className="form-label">20) ¿Por lo general tu ingreso mensual por este trabajo es? *</label>
          <select id="ingresoMensualTrabajoPrincipal" name="ingresoMensualTrabajoPrincipal" value={formData.ingresoMensualTrabajoPrincipal || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Menor al Salario Mínimo Vital y Móvil">Menor al Salario Mínimo Vital y Móvil</option>
            <option value="Igual o mayor al Salario Mínimo Vital y Móvil">Igual o mayor al Salario Mínimo Vital y Móvil</option>
            <option value="No recibo un ingreso por este trabajo">No recibo un ingreso por este trabajo</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Puedes ver los valores desde <a href="https://www.argentina.gob.ar/trabajo/consejodelsalario" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">esta página</a>.</p>
        </div>
        
        {formData.ingresoMensualTrabajoPrincipal === 'Menor al Salario Mínimo Vital y Móvil' && (
            <div>
                <label htmlFor="suficienciaIngreso" className="form-label">21) Consideras que tu ingreso por este trabajo es</label>
                <select id="suficienciaIngreso" name="suficienciaIngreso" value={formData.suficienciaIngreso || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <option value="">Seleccione...</option>
                    <option value="Suficiente, pero preciso complementar con otras fuentes de ingreso">Suficiente, pero preciso complementar con otras fuentes de ingreso</option>
                    <option value="Suficiente, vivo principalmente de este trabajo">Suficiente, vivo principalmente de este trabajo</option>
                    <option value="Insuficiente, estoy buscando otras fuentes de ingresos">Insuficiente, estoy buscando otras fuentes de ingresos</option>
                    <option value="Insuficiente, tengo otras fuentes de ingreso">Insuficiente, tengo otras fuentes de ingreso</option>
                </select>
            </div>
        )}

        {formData.ingresoMensualTrabajoPrincipal === 'Igual o mayor al Salario Mínimo Vital y Móvil' && (
            <div>
                <label htmlFor="constanciaIngreso" className="form-label">21) La constancia del ingreso por este trabajo, ¿por qué medio es?</label>
                <select id="constanciaIngreso" name="constanciaIngreso" value={formData.constanciaIngreso || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <option value="">Seleccione...</option>
                    <option value="Factura (u otro comprobante del monotributo)">Factura (u otro comprobante del monotributo)</option>
                    <option value="Recibo de adelanto de retorno (cooperativa)">Recibo de adelanto de retorno (cooperativa)</option>
                    <option value="Otro">Otro</option>
                    <option value="No tengo ninguna constancia">No tengo ninguna constancia</option>
                </select>
            </div>
        )}

        <div>
          <label htmlFor="usaMediosElectronicos" className="form-label">22) ¿Utilizas el celular u otro medio electrónico (computadora, tablet, etc.) para trabajar? *</label>
          <select id="usaMediosElectronicos" name="usaMediosElectronicos" value={formData.usaMediosElectronicos || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" required>
            <option value="">Seleccione...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>

        {formData.usaMediosElectronicos === 'Si' && (
          <div className="md:col-span-2">
            <label className="form-label">23) ¿Qué tipo de aplicaciones utilizas? (se puede marcar más de una opción)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div><input type="checkbox" id="appDelivery" name="Aplicaciones de delivery (Rappi, Uber, otras)" data-statekey="tipoAplicaciones" checked={formData.tipoAplicaciones?.includes('Aplicaciones de delivery (Rappi, Uber, otras)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appDelivery">Aplicaciones de delivery (Rappi, Uber, otras)</label></div>
                <div><input type="checkbox" id="appCobro" name="Aplicaciones de cobro (mercado pago, transferencias bancarias, otras)" data-statekey="tipoAplicaciones" checked={formData.tipoAplicaciones?.includes('Aplicaciones de cobro (mercado pago, transferencias bancarias, otras)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appCobro">Aplicaciones de cobro (mercado pago, transferencias bancarias, otras)</label></div>
                <div><input type="checkbox" id="appRedes" name="Redes sociales para promocionar/vender tu producto o servicio (Whatsapp, Instagram; Facebook, marketplace, TikTok,otras)" data-statekey="tipoAplicaciones" checked={formData.tipoAplicaciones?.includes('Redes sociales para promocionar/vender tu producto o servicio (Whatsapp, Instagram; Facebook, marketplace, TikTok,otras)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appRedes">Redes sociales para promocionar/vender</label></div>
                <div><input type="checkbox" id="appWeb" name="Página web propia" data-statekey="tipoAplicaciones" checked={formData.tipoAplicaciones?.includes('Página web propia') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appWeb">Página web propia</label></div>
                <div><input type="checkbox" id="appOtros" name="Otros" data-statekey="tipoAplicaciones" checked={formData.tipoAplicaciones?.includes('Otros') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="appOtros">Otros</label></div>
            </div>
            {formData.tipoAplicaciones?.includes('Otros') && (
              <div className="mt-4">
                <label htmlFor="otrasAplicaciones" className="form-label">24) Si respondiste “Otros”, detallar qué tipo de aplicaciones utilizas:</label>
                <textarea id="otrasAplicaciones" name="otrasAplicaciones" value={formData.otrasAplicaciones || ''} onChange={handleChange} className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" rows={2} placeholder="Detalle otras aplicaciones" />
              </div>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <label className="form-label">25) ¿Qué acciones o estrategias tomas para publicitar o visibilizar tu emprendimiento? (se puede marcar más de una opción)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div><input type="checkbox" id="pubBoca" name="De boca en boca" data-statekey="estrategiasPublicidad" checked={formData.estrategiasPublicidad?.includes('De boca en boca') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubBoca">De boca en boca</label></div>
            <div><input type="checkbox" id="pubImpresos" name="Recursos impresos (folleteria, imanes, revista de barrio, calcomanías, etc.)" data-statekey="estrategiasPublicidad" checked={formData.estrategiasPublicidad?.includes('Recursos impresos (folleteria, imanes, revista de barrio, calcomanías, etc.)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubImpresos">Recursos impresos</label></div>
            <div><input type="checkbox" id="pubDigitalNoPaga" name="Publicidad digital no paga (posteos en redes, fotos y videos de los productos, flyers digitales, etc.)" data-statekey="estrategiasPublicidad" checked={formData.estrategiasPublicidad?.includes('Publicidad digital no paga (posteos en redes, fotos y videos de los productos, flyers digitales, etc.)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubDigitalNoPaga">Publicidad digital no paga</label></div>
            <div><input type="checkbox" id="pubDigitalPaga" name="Publicidad digital paga (promoción en instagram, anuncios patrocinados en la web, etc.)" data-statekey="estrategiasPublicidad" checked={formData.estrategiasPublicidad?.includes('Publicidad digital paga (promoción en instagram, anuncios patrocinados en la web, etc.)') || false} onChange={handleCheckboxChange} className="mr-2" /><label htmlFor="pubDigitalPaga">Publicidad digital paga</label></div>
          </div>
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
        ...(prevData[parent as keyof typeof prevData] as Record<string, any>),
        [child]: value,
      },
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Domicilio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="domicilio.calle" className="form-label">Calle *</label>
          <input
            type="text"
            id="domicilio.calle"
            name="domicilio.calle"
            value={formData.domicilio?.calle || ''}
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
            value={formData.domicilio?.numero || ''}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Número de casa/edificio"
          />
        </div>
        
        <div>
          <label htmlFor="domicilio.piso" className="form-label">Piso</label>
          <input
            type="text"
            id="domicilio.piso"
            name="domicilio.piso"
            value={formData.domicilio?.piso || ''}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Si corresponde"
          />
        </div>
        
        <div>
          <label htmlFor="domicilio.departamento" className="form-label">Departamento</label>
          <input
            type="text"
            id="domicilio.departamento"
            name="domicilio.departamento"
            value={formData.domicilio?.departamento || ''}
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
            value={formData.domicilio?.barrio || ''}
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
            value={formData.domicilio?.localidad || ''}
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
            value={formData.domicilio?.provincia || ''}
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
            value={formData.domicilio?.codigoPostal || ''}
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    setFormData(prevData => ({
      ...prevData,
      [parent]: {
        ...(prevData[parent as keyof typeof prevData] as Record<string, any>),
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
            value={formData.contacto?.telefono || ''}
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
            value={formData.contacto?.email || ''}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="ejemplo@correo.com"
          />
        </div>
      </div>
    </div>
  );
};

const SituacionLaboralStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (checked) {
      setFormData(prevData => ({
        ...prevData,
        programasSociales: [...(prevData.programasSociales || []), name],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        programasSociales: (prevData.programasSociales || []).filter(item => item !== name),
      }));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Situación Laboral</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="situacionLaboral" className="form-label">Situación Laboral Actual *</label>
          <select
            id="situacionLaboral"
            name="situacionLaboral"
            value={formData.situacionLaboral}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Desempleado">Desempleado</option>
            <option value="Empleo Informal">Empleo Informal</option>
            <option value="Empleo Formal">Empleo Formal</option>
            <option value="Monotributista">Monotributista</option>
            <option value="Monotributista Social">Monotributista Social</option>
            <option value="Emprendedor">Emprendedor</option>
            <option value="Cooperativista">Cooperativista</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="actividadEconomica" className="form-label">Actividad Económica Principal *</label>
          <input
            type="text"
            id="actividadEconomica"
            name="actividadEconomica"
            value={formData.actividadEconomica}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
            placeholder="Describa su actividad principal"
          />
        </div>
        
        <div>
          <label htmlFor="ingresos" className="form-label">Ingresos Mensuales Aproximados *</label>
          <select
            id="ingresos"
            name="ingresos"
            value={formData.ingresos}
            onChange={handleChange}
            className="form-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Menos de $50.000">Menos de $50.000</option>
            <option value="Entre $50.000 y $100.000">Entre $50.000 y $100.000</option>
            <option value="Entre $100.000 y $150.000">Entre $100.000 y $150.000</option>
            <option value="Entre $150.000 y $200.000">Entre $150.000 y $200.000</option>
            <option value="Más de $200.000">Más de $200.000</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Programas Sociales (seleccione los que correspondan)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="programaA"
                name="Asignación Universal por Hijo"
                checked={formData.programasSociales?.includes('Asignación Universal por Hijo') || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="programaA">Asignación Universal por Hijo</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="programaB"
                name="Potenciar Trabajo"
                checked={formData.programasSociales?.includes('Potenciar Trabajo') || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="programaB">Potenciar Trabajo</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="programaC"
                name="Tarjeta Alimentar"
                checked={formData.programasSociales?.includes('Tarjeta Alimentar') || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="programaC">Tarjeta Alimentar</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="programaD"
                name="Progresar"
                checked={formData.programasSociales?.includes('Progresar') || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="programaD">Progresar</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="programaE"
                name="Programa Provincial"
                checked={formData.programasSociales?.includes('Programa Provincial') || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="programaE">Programa Provincial</label>
            </div>
          </div>
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
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Datos Personales</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">CUIL:</span> {formData.cuil}</div>
          <div><span className="font-medium">Nombre:</span> {formData.nombre}</div>
          <div><span className="font-medium">Apellido:</span> {formData.apellido}</div>
          <div><span className="font-medium">Fecha de Nacimiento:</span> {formData.fechaNacimiento}</div>
          <div><span className="font-medium">Género:</span> {formData.genero}</div>
          <div><span className="font-medium">Estado Civil:</span> {formData.estadoCivil}</div>
          <div><span className="font-medium">Nacionalidad:</span> {formData.nacionalidad}</div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Datos Generales Sobre Tus Trabajos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Trabajos en Economía Social/Popular:</span> {formData.trabajosEconomiaSocial}</div>
          <div><span className="font-medium">Ingreso Individual representa:</span> {formData.ingresoTotalIndividual}</div>
          <div><span className="font-medium">Monotributo:</span> {formData.tieneMonotributo}</div>
          <div><span className="font-medium">Trabajo en relación de dependencia:</span> {formData.tieneTrabajoDependencia}</div>
          {formData.tieneTrabajoDependencia === 'Si' && (
            <>
              <div><span className="font-medium">Salario (relación de dependencia):</span> {formData.salarioTrabajoDependencia}</div>
              <div><span className="font-medium">Principal fuente de ingresos (relación de dependencia):</span> {formData.trabajoDependenciaPrincipal}</div>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Trabajo Principal en la Economía Social/Popular</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Forma de trabajo:</span> {formData.formaTrabajoPrincipal}</div>
          <div><span className="font-medium">Actividad principal:</span> {formData.actividadPrincipal}</div>
          {formData.actividadPrincipal === 'Otros' && <div><span className="font-medium">Otra actividad:</span> {formData.otraActividadPrincipal}</div>}
          <div><span className="font-medium">Lugar de trabajo:</span> {formData.lugarTrabajoPrincipal}</div>
          <div><span className="font-medium">Monotributo:</span> {formData.monotributoTrabajoPrincipal}</div>
          <div><span className="font-medium">Ingreso mensual:</span> {formData.ingresoMensualTrabajoPrincipal}</div>
          {formData.ingresoMensualTrabajoPrincipal === 'Menor al Salario Mínimo Vital y Móvil' && <div><span className="font-medium">Suficiencia de ingreso:</span> {formData.suficienciaIngreso}</div>}
          {formData.ingresoMensualTrabajoPrincipal === 'Igual o mayor al Salario Mínimo Vital y Móvil' && <div><span className="font-medium">Constancia de ingreso:</span> {formData.constanciaIngreso}</div>}
          <div><span className="font-medium">Usa medios electrónicos:</span> {formData.usaMediosElectronicos}</div>
          {formData.usaMediosElectronicos === 'Si' && (
            <>
              <div className="md:col-span-2"><span className="font-medium">Aplicaciones:</span> {formData.tipoAplicaciones?.join(', ')}</div>
              {formData.tipoAplicaciones?.includes('Otros') && <div className="md:col-span-2"><span className="font-medium">Otras aplicaciones:</span> {formData.otrasAplicaciones}</div>}
            </>
          )}
          <div className="md:col-span-2"><span className="font-medium">Estrategias de publicidad:</span> {formData.estrategiasPublicidad?.join(', ')}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Datos del Emprendimiento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Calle:</span> {formData.emprendimientoCalle}</div>
          <div><span className="font-medium">Número:</span> {formData.emprendimientoNumero}</div>
          <div><span className="font-medium">Código Postal:</span> {formData.emprendimientoCodigoPostal}</div>
          <div><span className="font-medium">Departamento:</span> {formData.emprendimientoDepartamento}</div>
          <div><span className="font-medium">Localidad:</span> {formData.emprendimientoLocalidad}</div>
          <div><span className="font-medium">¿Tiene nombre?:</span> {formData.emprendimientoTieneNombre}</div>
          {formData.emprendimientoTieneNombre === 'Si' && (
            <div><span className="font-medium">Nombre del emprendimiento:</span> {formData.emprendimientoNombre}</div>
          )}
          <div><span className="font-medium">Tiempo en funcionamiento:</span> {formData.emprendimientoTiempoFuncionamiento}</div>
          <div><span className="font-medium">¿Trabajo en marco de organización?:</span> {formData.emprendimientoMarcoOrganizacion}</div>
          {formData.emprendimientoMarcoOrganizacion === 'Si' && (
            <div><span className="font-medium">Nombre de la organización:</span> {formData.emprendimientoNombreOrganizacion}</div>
          )}
        </div>
      </div>
      
      {(formData.trabajosEconomiaSocial === 'Dos' || formData.trabajosEconomiaSocial === 'Tres' || formData.trabajosEconomiaSocial === 'Cuatro o mas') && (
        <>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Segundo Trabajo en la Economía Social/Popular</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Forma de trabajo:</span> {formData.formaTrabajoSegundo}</div>
              <div><span className="font-medium">Actividad:</span> {formData.actividadSegundoTrabajo}</div>
              {formData.actividadSegundoTrabajo === 'Otros' && <div><span className="font-medium">Otra actividad:</span> {formData.otraActividadSegundoTrabajo}</div>}
              <div><span className="font-medium">Lugar de trabajo:</span> {formData.lugarTrabajoSegundo}</div>
              <div><span className="font-medium">Monotributo:</span> {formData.monotributoTrabajoSegundo}</div>
              <div><span className="font-medium">Ingreso mensual:</span> {formData.ingresoMensualTrabajoSegundo}</div>
              {formData.ingresoMensualTrabajoSegundo === 'Menor al Salario Mínimo Vital y Móvil' && <div><span className="font-medium">Suficiencia de ingreso:</span> {formData.suficienciaIngresoSegundo}</div>}
              {formData.ingresoMensualTrabajoSegundo === 'Igual o mayor al Salario Mínimo Vital y Móvil' && <div><span className="font-medium">Constancia de ingreso:</span> {formData.constanciaIngresoSegundo}</div>}
              <div><span className="font-medium">Usa medios electrónicos:</span> {formData.usaMediosElectronicosSegundo}</div>
              {formData.usaMediosElectronicosSegundo === 'Si' && (
                <>
                  <div className="md:col-span-2"><span className="font-medium">Aplicaciones:</span> {formData.tipoAplicacionesSegundo?.join(', ')}</div>
                  {formData.tipoAplicacionesSegundo?.includes('Otros') && <div className="md:col-span-2"><span className="font-medium">Otras aplicaciones:</span> {formData.otrasAplicacionesSegundo}</div>}
                </>
              )}
              <div className="md:col-span-2"><span className="font-medium">Estrategias de publicidad:</span> {formData.estrategiasPublicidadSegundo?.join(', ')}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">Datos del Segundo Emprendimiento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Calle:</span> {formData.segundoEmprendimientoCalle}</div>
              <div><span className="font-medium">Número:</span> {formData.segundoEmprendimientoNumero}</div>
              <div><span className="font-medium">Código Postal:</span> {formData.segundoEmprendimientoCodigoPostal}</div>
              <div><span className="font-medium">Departamento:</span> {formData.segundoEmprendimientoDepartamento}</div>
              <div><span className="font-medium">Localidad:</span> {formData.segundoEmprendimientoLocalidad}</div>
              <div><span className="font-medium">¿Tiene nombre?:</span> {formData.segundoEmprendimientoTieneNombre}</div>
              {formData.segundoEmprendimientoTieneNombre === 'Si' && (
                <div><span className="font-medium">Nombre del emprendimiento:</span> {formData.segundoEmprendimientoNombre}</div>
              )}
              <div><span className="font-medium">Tiempo en funcionamiento:</span> {formData.segundoEmprendimientoTiempoFuncionamiento}</div>
              <div><span className="font-medium">¿Trabajo en marco de organización?:</span> {formData.segundoEmprendimientoMarcoOrganizacion}</div>
              {formData.segundoEmprendimientoMarcoOrganizacion === 'Si' && (
                <div><span className="font-medium">Nombre de la organización:</span> {formData.segundoEmprendimientoNombreOrganizacion}</div>
              )}
            </div>
          </div>
        </>
      )}
      
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

const FormularioPersonaPage = () => {
  // Obtener datos del usuario autenticado con CiDi
  const { usuario, autenticado } = useAuth();
  
  // Estado para mostrar un mensaje cuando los datos se autocompletan
  const [datosAutocompletos, setDatosAutocompletos] = useState(false);
  // Estado para controlar la carga de datos
  const [cargandoDatos, setCargandoDatos] = useState(false);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState<FormData>({
    cuil: '',
    nombre: '',
    apellido: '',
    genero: '',
    telefono: '',
    email: '',
    nivelEducativo: '',
    tituloProfesional: '',
    trabajosEconomiaSocial: '',
    ingresoTotalIndividual: '',
    tieneMonotributo: '',
    tieneTrabajoDependencia: '',
    salarioTrabajoDependencia: '',
    trabajoDependenciaPrincipal: '',
    fechaNacimiento: '',
    estadoCivil: '',
    nacionalidad: '',
    domicilio: {
      calle: '',
      numero: '',
      piso: '',
      departamento: '',
      barrio: '',
      localidad: '',
      provincia: '',
      codigoPostal: ''
    },
    contacto: {
      telefono: '',
      email: ''
    },
    situacionLaboral: '',
    actividadEconomica: '',
    ingresos: '',
    programasSociales: [],
    formaTrabajoPrincipal: '',
    actividadPrincipal: '',
    otraActividadPrincipal: '',
    lugarTrabajoPrincipal: '',
    monotributoTrabajoPrincipal: '',
    ingresoMensualTrabajoPrincipal: '',
    suficienciaIngreso: '',
    constanciaIngreso: '',
    usaMediosElectronicos: '',
    tipoAplicaciones: [],
    otrasAplicaciones: '',
    estrategiasPublicidad: [],
    // Campos para el paso de Emprendimiento
    emprendimientoCalle: '',
    emprendimientoNumero: '',
    emprendimientoCodigoPostal: '',
    emprendimientoDepartamento: '',
    emprendimientoLocalidad: '',
    emprendimientoTieneNombre: '',
    emprendimientoNombre: '',
    emprendimientoTiempoFuncionamiento: '',
    emprendimientoMarcoOrganizacion: '',
    emprendimientoNombreOrganizacion: '',
    // Campos para el segundo trabajo
    tieneSegundoTrabajo: '',
    formaTrabajoSegundo: '',
    actividadSegundoTrabajo: '',
    otraActividadSegundoTrabajo: '',
    lugarTrabajoSegundo: '',
    monotributoTrabajoSegundo: '',
    ingresoMensualTrabajoSegundo: '',
    suficienciaIngresoSegundo: '',
    constanciaIngresoSegundo: '',
    usaMediosElectronicosSegundo: '',
    tipoAplicacionesSegundo: [],
    otrasAplicacionesSegundo: '',
    estrategiasPublicidadSegundo: [],
    // Campos para el segundo emprendimiento
    segundoEmprendimientoCalle: '',
    segundoEmprendimientoNumero: '',
    segundoEmprendimientoCodigoPostal: '',
    segundoEmprendimientoDepartamento: '',
    segundoEmprendimientoLocalidad: '',
    segundoEmprendimientoTieneNombre: '',
    segundoEmprendimientoNombre: '',
    segundoEmprendimientoTiempoFuncionamiento: '',
    segundoEmprendimientoMarcoOrganizacion: '',
    segundoEmprendimientoNombreOrganizacion: '',
  });

  // Estados para monitorear pruebas del sistema de caché
  const [tiemposPruebaCache, setTiemposPruebaCache] = useState<{inicial: number, repeticion: number} | null>(null);
  const [mostrarPruebaCache, setMostrarPruebaCache] = useState(false);
  const [datosUsuarioCompleto, setDatosUsuarioCompleto] = useState<any>(null);
  
  // Estado para el paso actual
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Estado para los pasos del formulario
  const [steps, setSteps] = useState<Array<{id: string; title: string; component: React.ReactNode}>>([]);
  
  // Efecto para cargar los datos de la persona cuando el usuario esté autenticado
  // Se utiliza una variable de estado para controlar si ya se hizo la carga inicial
  const [datosYaCargados, setDatosYaCargados] = useState(false);
  
  React.useEffect(() => {
    // Evitar múltiples solicitudes - solo cargar una vez
    if (datosYaCargados || cargandoDatos) return;
    
    const cargarDatosPersona = async () => {
      if (autenticado && usuario?.cuil) {
        try {
          setCargandoDatos(true);
          console.log('Iniciando carga de datos del usuario autenticado');
          
          // Primero, obtener datos del usuario desde /api/User/obtener-usuario
          console.log('Obteniendo datos del usuario desde /api/User/obtener-usuario');
          const datosUsuario = await getUsuarioData();
          console.log('Datos de usuario recibidos:', datosUsuario);
          
          // PRUEBA DEL SISTEMA DE CACHÉ: primera llamada (sin caché)
          console.log('=== PRUEBA DEL SISTEMA DE CACHÉ ===');
          console.log('Primera llamada (sin caché)...');
          const primeraLlamada = await getUsuarioCompletoData();
          const tiempoInicial = primeraLlamada.tiempoRespuesta || 0;
          console.log(`Primera llamada completada en ${tiempoInicial.toFixed(2)}ms`);
          setDatosUsuarioCompleto(primeraLlamada.usuario);
          
          // PRUEBA DEL SISTEMA DE CACHÉ: segunda llamada (debería ser desde caché)
          console.log('Segunda llamada (debería usar caché)...');
          const segundaLlamada = await getUsuarioCompletoData();
          const tiempoRepeticion = segundaLlamada.tiempoRespuesta || 0;
          console.log(`Segunda llamada completada en ${tiempoRepeticion.toFixed(2)}ms`);
          
          // Guardar tiempos para mostrar en la interfaz
          setTiemposPruebaCache({
            inicial: tiempoInicial,
            repeticion: tiempoRepeticion
          });
          setMostrarPruebaCache(true);
          
          // Variable para almacenar los datos de la persona
          let datosPersona = null;
          
          // Si se obtuvieron datos del usuario, intentar obtener datos completos de la persona
          if (datosUsuario && datosUsuario.exito) {
            console.log('Iniciando carga de datos completos de la persona con CUIL:', usuario.cuil);
            
            // Intentar obtener datos completos de la persona desde el backend
            datosPersona = await getPersonaData(usuario.cuil);
            console.log('Datos completos de persona recibidos:', datosPersona);
          }
          
          // Marcar que los datos ya se cargaron para evitar solicitudes repetidas
          setDatosYaCargados(true);
          
          if (datosUsuario && datosUsuario.exito && datosUsuario.usuario) {
            // Si se obtuvieron datos del usuario, actualizar el formulario con esos datos
            console.log('Autocompletando formulario con datos del usuario:', datosUsuario.usuario);
            
            // Si también tenemos datos completos de la persona, usarlos para completar más campos
            if (datosPersona && datosPersona.exito && datosPersona.datos) {
              const persona = datosPersona.datos;
              console.log('Complementando con datos completos de persona:', persona);
              
              setFormData(prevData => ({
                ...prevData,
                cuil: datosUsuario.usuario.cuil || usuario.cuil,
                nombre: datosUsuario.usuario.nombre || usuario.nombre,
                apellido: persona.apellido || usuario.apellido,
                fechaNacimiento: persona.fechaNacimiento || '',
                genero: persona.genero || '',
                estadoCivil: persona.estadoCivil || '',
                nacionalidad: persona.nacionalidad || '',
                domicilio: {
                  calle: persona.domicilio?.calle || '',
                  numero: persona.domicilio?.numero || '',
                  piso: persona.domicilio?.piso || '',
                  departamento: persona.domicilio?.departamento || '',
                  barrio: persona.domicilio?.barrio || '',
                  localidad: persona.domicilio?.localidad || '',
                  provincia: persona.domicilio?.provincia || '',
                  codigoPostal: persona.domicilio?.codigoPostal || ''
                },
                contacto: {
                  telefono: persona.contacto?.telefono || '',
                  email: persona.contacto?.email || datosUsuario.usuario.email || ''
                },
                situacionLaboral: persona.situacionLaboral || '',
                actividadEconomica: persona.actividadEconomica || '',
                ingresos: persona.ingresos || '',
                programasSociales: persona.programasSociales || []
              }));
              
              // Mostrar mensaje de autocompletado con datos completos
              setDatosAutocompletos(true);
              console.log('Formulario autocompletado con datos completos');
              setTimeout(() => setDatosAutocompletos(false), 5000);
            } else {
              // Si solo tenemos datos básicos del usuario, usar esos
              setFormData(prevData => ({
                ...prevData,
                cuil: datosUsuario.usuario.cuil || usuario.cuil,
                nombre: datosUsuario.usuario.nombre || usuario.nombre,
                apellido: datosUsuario.usuario.apellido || usuario.apellido,
                contacto: {
                  ...prevData.contacto,
                  email: datosUsuario.usuario.email || ''
                }
              }));
              
              // Mostrar mensaje de autocompletado con datos básicos
              setDatosAutocompletos(true);
              console.log('Formulario autocompletado con datos básicos del usuario');
              setTimeout(() => setDatosAutocompletos(false), 5000);
            }
          } else {
            // Si no se obtuvieron datos del usuario, usar solo los datos básicos de CiDi
            console.log('No se pudieron obtener datos del usuario, usando datos básicos de CiDi');
            setFormData(prevData => ({
              ...prevData,
              cuil: usuario.cuil,
              nombre: usuario.nombre,
              apellido: usuario.apellido
            }));
            
            // Mostrar mensaje de autocompletado con datos básicos
            setDatosAutocompletos(true);
            console.log('Formulario autocompletado solo con datos básicos de CiDi');
            setTimeout(() => setDatosAutocompletos(false), 5000);
          }
        } catch (error) {
          console.error('Error al cargar datos de la persona:', error);
          
          // Verificar si el error está relacionado con autenticación
          if (error && typeof error === 'object' && 'response' in error && 
              error.response && typeof error.response === 'object' && 'status' in error.response && 
              error.response.status === 401) {
            console.error('Error de autenticación. Verificar cookies y tokens.');
          }
          
          // En caso de error, usar solo los datos básicos de CiDi
          console.log('Usando datos básicos de CiDi debido a error');
          setFormData(prevData => ({
            ...prevData,
            cuil: usuario.cuil,
            nombre: usuario.nombre,
            apellido: usuario.apellido
          }));
          
          // Mostrar mensaje de autocompletado con advertencia
          setDatosAutocompletos(true);
          setTimeout(() => setDatosAutocompletos(false), 5000);
        } finally {
          setCargandoDatos(false);
        }
      }
    };
    
    cargarDatosPersona();
  }, [autenticado, usuario]);

  // Actualizar los pasos cuando cambia el número de trabajos
  useEffect(() => {
    // Determinar si se deben mostrar los pasos de segundo trabajo y segundo emprendimiento
    const mostrarSegundoTrabajo = formData.trabajosEconomiaSocial === 'Dos' || 
                                formData.trabajosEconomiaSocial === 'Tres' || 
                                formData.trabajosEconomiaSocial === 'Cuatro o mas';
    
    const stepsBase = [
      { id: 'datos-personales', title: 'Datos Personales', component: <DatosPersonalesStep formData={formData} setFormData={setFormData} /> },
      { id: 'datos-generales', title: 'Datos Generales', component: <DatosGeneralesStep formData={formData} setFormData={setFormData} /> },
      { id: 'trabajo-principal', title: 'Trabajo Principal', component: <TrabajoPrincipalStep formData={formData} setFormData={setFormData} /> },
      { id: 'emprendimiento', title: 'Emprendimiento', component: <EmprendimientoStep formData={formData} setFormData={setFormData} /> },
    ];
    
    const stepsSegundoTrabajo = mostrarSegundoTrabajo ? [
      { id: 'segundo-trabajo', title: 'Segundo Trabajo', component: <SegundoTrabajoStep formData={formData} setFormData={setFormData} /> },
      { id: 'segundo-emprendimiento', title: 'Segundo Emprendimiento', component: <SegundoEmprendimientoStep formData={formData} setFormData={setFormData} /> },
    ] : [];
    
    const stepsConfirmacion = [
      { id: 'confirmacion', title: 'Confirmación', component: <ConfirmacionStep formData={formData} /> },
    ];
    
    const newSteps = [...stepsBase, ...stepsSegundoTrabajo, ...stepsConfirmacion];
    setSteps(newSteps);
    
    // Si el paso actual es mayor que el número de pasos disponibles (porque se eliminaron pasos),
    // ajustar el paso actual al último paso disponible
    if (currentStep >= newSteps.length) {
      setCurrentStep(Math.max(0, newSteps.length - 1));
    }
  }, [formData.trabajosEconomiaSocial, formData, currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await savePersonForm(formData);
      console.log('Formulario enviado con éxito:', response);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitError('Ocurrió un error al enviar el formulario. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <Layout title="Formulario de Persona">
        <div className="container mx-auto px-4 py-8">
        {submitSuccess ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">¡Registro Completado!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Su información ha sido registrada correctamente. Pronto nos pondremos en contacto con usted.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-md transition-colors"
            >
              Volver al Inicio
            </motion.button>
          </motion.div>
        ) : (
          <>
            {cargandoDatos && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg relative mb-6"
              >
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Cargando sus datos personales...</span>
                </p>
              </motion.div>
            )}
            
            {datosAutocompletos && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg relative mb-6"
              >
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Se han autocompletado los campos con sus datos personales.</span>
                </p>
              </motion.div>
            )}
            
            {/* Mostrar resultados de la prueba del sistema de caché */}
            {mostrarPruebaCache && tiemposPruebaCache && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg relative mb-6"
              >
                <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">Prueba del Sistema de Caché</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-sm"><span className="font-medium">Primera llamada:</span> {tiemposPruebaCache.inicial.toFixed(2)}ms</p>
                    <p className="mb-1 text-sm"><span className="font-medium">Segunda llamada (caché):</span> {tiemposPruebaCache.repeticion.toFixed(2)}ms</p>
                    <p className="text-sm"><span className="font-medium">Mejora de rendimiento:</span> {((tiemposPruebaCache.inicial - tiemposPruebaCache.repeticion) / tiemposPruebaCache.inicial * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-sm">
                    <p>Los datos de usuarios ahora se almacenan en caché local por 6 horas, reduciendo las consultas a la base de datos y APIs externas.</p>
                  </div>
                </div>
              </motion.div>
            )}
            <MultiStepForm 
              steps={steps} 
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          </>
        )}
        </div>
      </Layout>
    </AuthGuard>
  );
};

// Exportar la página sin el HOC de autenticación, ya que ahora manejamos la autenticación a través del contexto
export default FormularioPersonaPage;
