import React from 'react';
import './button.css';

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  width?: string;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  width,
  ...props
}: ButtonProps) => {
  // Assigning the correct class based on the "primary" prop.
  const mode = primary ? 'button--primary' : 'button--secondary';

  return (
    <button
      type="button"
      // Using an array to manage all the class names and then joining them.
      className={['button', `button--${size}`, mode].join(' ')}
      style={{ backgroundColor, width: width || 'auto' }} // use the width prop if provided
      {...props}
    >
      {label}
    </button>
  );
};
