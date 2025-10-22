import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Step = {
  title: string;
  component: ReactNode;
};

type MultiStepFormProps = {
  steps: Step[];
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitError?: string;
  // Propiedades alternativas para compatibilidad
  loading?: boolean;
  error?: string;
};

const MultiStepForm: React.FC<MultiStepFormProps> = ({ 
  steps, 
  currentStep: propCurrentStep, 
  setCurrentStep: propSetCurrentStep, 
  onSubmit, 
  isSubmitting, 
  submitError,
  loading,
  error
}) => {
  // Estado interno para el paso actual si no se proporciona desde props
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Usar valores de props o valores internos
  const currentStep = propCurrentStep !== undefined ? propCurrentStep : internalCurrentStep;
  const setCurrentStep = propSetCurrentStep || setInternalCurrentStep;
  
  // Usar isSubmitting o loading
  const isSubmittingState = isSubmitting !== undefined ? isSubmitting : loading;
  
  // Usar submitError o error
  const errorMessage = submitError || error;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (index: number) => {
    // Permitir navegación a cualquier paso sin restricciones
    setCurrentStep(index);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLastStep) {
      onSubmit();
    } else {
      goToNextStep();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      {/* Barra de progreso */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => goToStep(index)}
                className={`flex items-center ${
                  index <= currentStep
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                } hover:text-primary-700 dark:hover:text-primary-300 transition-colors`}
                disabled={isSubmittingState}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                    index < currentStep
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : index === currentStep
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
              
              {index < steps.length - 1 && (
                <div className="flex-grow mx-2 h-0.5 bg-gray-200 dark:bg-gray-700 max-w-[50px]"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            {steps[currentStep].title}
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].component}
            </motion.div>
          </AnimatePresence>

          {/* Botones de navegación */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className={`px-4 py-2 rounded-md ${isFirstStep ? 'opacity-50 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              disabled={isFirstStep || isSubmittingState}
            >
              Anterior
            </button>
            
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'} text-white`}
              disabled={isSubmittingState}
            >
              {isSubmittingState ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : isLastStep ? 'Enviar' : 'Siguiente'}
            </button>
          </div>
          
          {/* Mensaje de error */}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-t border-red-200 dark:border-red-800">
              {errorMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
