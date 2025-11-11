import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: 'default' | 'error' | 'success';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      required = false,
      variant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const variantClasses = {
      default: 'input',
      error: 'input-error',
      success: 'input-success',
    };

    const finalVariant = error ? 'error' : variant;
    const finalClasses = [variantClasses[finalVariant], className].filter(Boolean).join(' ');

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-label-large font-medium text-neutral-900"
          >
            {label}
            {required && (
              <span className="text-error-600 ml-1" aria-label="Required field">
                *
              </span>
            )}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={finalClasses}
          required={required}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        {error && (
          <p 
            id={errorId} 
            className="text-body-small text-error-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={helperId} 
            className="text-body-small text-neutral-600"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;