import { motion, AnimatePresence } from "framer-motion";

export default function JobApplicationModal({ job, isOpen, onClose }) {
  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-[#e0e5ec] p-8 rounded-3xl w-[90%] max-w-lg shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]"
        >
          <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
          <p className="mb-4 text-gray-600">{job.company}</p>

          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}