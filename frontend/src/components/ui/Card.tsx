import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = '',
      variant = 'default',
      padding = 'medium',
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'card',
      elevated: 'card-elevated',
      outlined: 'card-outlined',
    };

    const paddingClasses = {
      none: '',
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
    };

    const finalClasses = [
      variantClasses[variant],
      paddingClasses[padding],
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={finalClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;