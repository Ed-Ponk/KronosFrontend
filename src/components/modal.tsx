// ModalComponent.tsx
import React from 'react';
import Modal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  children: React.ReactNode;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    width: '90%',
    maxWidth: '700px',
    zIndex: 50,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
};

Modal.setAppElement('#root'); // Asegúrate de que el elemento con id 'root' esté presente en tu HTML

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-900">&times;</button>
      </div>
      {children}
    </Modal>
  );
};

export default ModalComponent;
