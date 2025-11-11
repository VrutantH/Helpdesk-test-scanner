import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'medium',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      success: 'btn-success',
      error: 'btn-error',
      outline: 'btn-outline',
    };

    const sizeClasses = {
      small: 'px-4 py-2 text-label-medium min-h-9',
      medium: 'px-6 py-3 text-label-large min-h-11',
      large: 'px-8 py-4 text-title-medium min-h-12',
    };

    const disabledClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';
    const loadingClasses = isLoading ? 'cursor-wait' : '';

    const finalClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      disabledClasses,
      loadingClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={finalClasses}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;