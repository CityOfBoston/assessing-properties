import React from 'react';
import styles from './MessageBox.module.scss';

interface MessageBoxProps {
  children: React.ReactNode;
  className?: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({ children, className }) => {
  return (
    <div className={`${styles.messageBox} ${className || ''}`.trim()}>
      {children}
    </div>
  );
};

export default MessageBox; 