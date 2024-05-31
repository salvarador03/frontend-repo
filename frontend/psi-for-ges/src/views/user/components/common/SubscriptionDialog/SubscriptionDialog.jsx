import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaCreditCard, FaPaypal, FaInfoCircle, FaCookieBite } from 'react-icons/fa';
import axios from 'axios';

Modal.setAppElement('#root'); // Configura el elemento raíz de la aplicación

const SubscriptionDialog = ({ isOpen, onClose, onAcceptCookies, isLoggedIn, onRegister, onLogin }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubscribe = () => {
    if (!isLoggedIn) {
      onRegister();
      return;
    }
    const paymentRequest = {
      tipoPago: selectedPayment,
      importe: 1.0,
      divisa: 'EUR',
      datosPago: {}
    };

    if (selectedPayment === 'creditCard') {
      paymentRequest.datosPago = {
        cardNumber: paymentDetails.cardNumber,
        expiryMonth: paymentDetails.expiryMonth,
        expiryYear: paymentDetails.expiryYear,
        cvc: paymentDetails.cvc
      };
    } else if (selectedPayment === 'paypal') {
      paymentRequest.datosPago = {};
    }

    axios.post('http://localhost:8080/api/payments', paymentRequest)
      .then(response => {
        console.log(response.data);
        if (response.status === 200) {
          if (selectedPayment === 'paypal') {
            // Si es PayPal, redirigir al usuario a la URL de aprobación
            const approvalUrl = response.data.approvalUrl;
            window.location.href = approvalUrl;
          } else {
            alert('Pago procesado exitosamente');
            window.location.href = '/success';
          }
        }
      })
      .catch(error => {
        console.error('Error en el procesamiento del pago:', error);
        alert('Error en el procesamiento del pago');
        window.location.href = '/cancel';
      });
  };

  const renderPaymentDetails = () => {
    switch (selectedPayment) {
      case 'creditCard':
        return (
          <div className="mt-2">
            <input
              type="text"
              name="cardNumber"
              className="border p-2 mb-2 w-full"
              placeholder="Número de tarjeta"
              value={paymentDetails.cardNumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="expiryMonth"
              className="border p-2 mb-2 w-full"
              placeholder="Mes de expiración (MM)"
              value={paymentDetails.expiryMonth}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="expiryYear"
              className="border p-2 mb-2 w-full"
              placeholder="Año de expiración (AAAA)"
              value={paymentDetails.expiryYear}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="cvc"
              className="border p-2 mb-4 w-full"
              placeholder="CVC"
              value={paymentDetails.cvc}
              onChange={handleInputChange}
            />
          </div>
        );
      case 'paypal':
        return (
          <div className="mt-2">
            <p className="text-gray-700">Será redirigido a PayPal para completar el pago.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnEsc={false} // Deshabilitar el cierre con Esc
      shouldCloseOnOverlayClick={false} // Deshabilitar el cierre al hacer clic en el overlay
    >
      <div className="p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Pablo Alvarado - Psicólogo Forense</h2>
        <p className="mb-4">Para mejorar tu experiencia en nuestra web, por favor elige una de las siguientes opciones:</p>
        <ul className="list-disc list-inside mb-4">
          <li className="flex items-center"><FaInfoCircle className="mr-2" /> Suscribirse por 1€ al mes para obtener contenido exclusivo y rechazar las cookies y publicidad</li>
          <li className="flex items-center"><FaCookieBite className="mr-2" /> Aceptar las cookies y registrarse para acceder a nuestro contenido</li>
        </ul>
        <div className="mb-4">
          <p className="font-semibold mb-2">Suscríbete por 1€ al mes:</p>
          <div className="mb-2">
            <button
              onClick={() => setSelectedPayment('creditCard')}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded w-full flex items-center justify-between"
            >
              <span><FaCreditCard className="inline mr-2" /> Tarjeta de crédito</span>
              {selectedPayment === 'creditCard' && <FaInfoCircle className="inline ml-2" />}
            </button>
            {selectedPayment === 'creditCard' && renderPaymentDetails()}
          </div>
          <div className="mb-2">
            <button
              onClick={() => setSelectedPayment('paypal')}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded w-full flex items-center justify-between"
            >
              <span><FaPaypal className="inline mr-2" /> PayPal</span>
              {selectedPayment === 'paypal' && <FaInfoCircle className="inline ml-2" />}
            </button>
            {selectedPayment === 'paypal' && renderPaymentDetails()}
          </div>
          <button
            onClick={handleSubscribe}
            className="bg-yellow-500 text-white py-2 px-4 rounded w-full"
          >
            Suscribirse
          </button>
          <p className="text-xs mt-2 text-gray-500">Al suscribirte, se te cobrará 1€ mensualmente.</p>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={onRegister}
            className="bg-gray-500 text-white py-2 px-4 rounded w-full"
          >
            Aceptar cookies y registrarse
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={onLogin}
            className="bg-blue-400 text-white py-2 px-4 rounded w-full"
          >
            Iniciar sesión
          </button>
        </div>
        <div className="text-sm">
          <button className="text-blue-500">Administrar opciones</button>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionDialog;
