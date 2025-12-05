import useStore from '@/_shared/store/store';
import { ReactNode } from 'react';

interface ModalProps {
  modalName: string;
  children: ReactNode;
}

const ModalWrapper: React.FC<ModalProps> = ({ modalName, children }) => {
  const { modals, closeModal } = useStore((state: any) => ({
    modals: state.modals,
    closeModal: state.closeModal,
  }));

  if (!modals[modalName]) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => closeModal(modalName)}
    >
      <div
        className="rounded bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
          onClick={() => closeModal(modalName)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalWrapper;
