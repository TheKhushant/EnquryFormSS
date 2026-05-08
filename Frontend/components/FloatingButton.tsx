import { FaWhatsapp } from "react-icons/fa";

const FloatingButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/919999999999", "_blank"); // change number
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300"
    >
      <FaWhatsapp size={24} />
    </button>
  );
};

export default FloatingButton;