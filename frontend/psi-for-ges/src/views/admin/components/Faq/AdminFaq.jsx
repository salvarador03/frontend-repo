import React, { useState, useEffect } from 'react';
import { fetchFaqs, createFaq, updateFaq, deleteFaq } from '../../../../services/FaqService';
import { FaEdit, FaTrash, FaPlus, FaSave, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPaginate from 'react-paginate';
import CustomModal from '../common/CustomModal/CustomModal';

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ id: null, question: '', answer: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [formModalIsOpen, setFormModalIsOpen] = useState(false);

  const faqsPerPage = 3;
  const pagesVisited = pageNumber * faqsPerPage;

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await fetchFaqs();
        setFaqs(data);
      } catch (error) {
        console.error('Error cargando FAQs:', error);
      }
    };

    loadFaqs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateFaq(form.id, form);
      } else {
        await createFaq(form);
      }
      const data = await fetchFaqs();
      setFaqs(data);
      setForm({ id: null, question: '', answer: '' });
      setIsEditing(false);
      setFormModalIsOpen(false);
    } catch (error) {
      console.error('Error guardando FAQ:', error);
    }
  };

  const handleEdit = (faq) => {
    setForm(faq);
    setIsEditing(true);
    setFormModalIsOpen(true);
  };

  const openDeleteModal = (faq) => {
    setCurrentFaq(faq);
    setDeleteModalIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteFaq(currentFaq.id);
      const data = await fetchFaqs();
      setFaqs(data);
      setDeleteModalIsOpen(false);
      setCurrentFaq(null);
    } catch (error) {
      console.error('Error eliminando FAQ:', error);
    }
  };

  const pageCount = Math.ceil(faqs.length / faqsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setCurrentFaq(null);
  };

  const closeFormModal = () => {
    setFormModalIsOpen(false);
    setForm({ id: null, question: '', answer: '' });
    setIsEditing(false);
  };

  return (
    <div className="admin-faq container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Administración de FAQs</h1>
      <div className="relative inline-block text-left mb-6">
        <div>
          <button
            type="button"
            onClick={() => setFormModalIsOpen(true)}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500"
          >
            <FaPlus className="mr-2" /> Añadir FAQ
          </button>
        </div>
      </div>
      <CustomModal isOpen={formModalIsOpen} onClose={closeFormModal}>
        <div className="relative">
          <button
            onClick={closeFormModal}
            className="absolute top-0 right-0 p-2 text-black"
          >
          </button>
          <h2 className="text-2xl mb-4">{isEditing ? 'Editar FAQ' : 'Crear FAQ'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="question"
                placeholder="Pregunta"
                value={form.question}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="answer"
                placeholder="Respuesta"
                value={form.answer}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                rows={4}
              />
            </div>
            <button
              type="submit"
              className={`p-2 rounded ${isEditing ? 'bg-yellow-500' : 'bg-green-500'} text-white flex items-center justify-center w-full`}
            >
              {isEditing ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />}
              {isEditing ? 'Actualizar FAQ' : 'Crear FAQ'}
            </button>
          </form>
        </div>
      </CustomModal>
      <CustomModal isOpen={deleteModalIsOpen} onClose={closeDeleteModal} hideCloseButton={true}>
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
          <h2 className="text-2xl mb-4">¿Estás seguro?</h2>
          <p className="mb-4">¿Realmente deseas eliminar esta FAQ? Este proceso no se puede deshacer.</p>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded w-full mb-2"
          >
            Sí, eliminar
          </button>
          <button
            type="button"
            onClick={closeDeleteModal}
            className="p-2 w-full text-center rounded bg-gray-300 text-gray-700"
          >
            Cancelar
          </button>
        </div>
      </CustomModal>
      <ul className="space-y-4">
        <AnimatePresence>
          {faqs.slice(pagesVisited, pagesVisited + faqsPerPage).map((faq) => (
            <motion.li
              key={faq.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <strong className="block text-lg"><FaQuestionCircle className="inline mr-2 text-blue-500" />{faq.question}</strong>
                <p>{faq.answer}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(faq)} className="p-2 text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
                <button onClick={() => openDeleteModal(faq)} className="p-2 text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"pagination flex justify-center items-center mt-4 space-x-2"}
        previousLinkClassName={"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
        nextLinkClassName={"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
        disabledClassName={"paginationDisabled text-gray-400"}
        activeClassName={"paginationActive bg-blue-500 text-black border border-gray-300"}
        pageClassName={"page-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
        pageLinkClassName={"page-link"}
        breakLabel={"..."}
        breakClassName={"break-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}
      />
    </div>
  );
};

export default AdminFAQ;
