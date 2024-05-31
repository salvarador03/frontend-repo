import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Notification from "../Notification/Notification";
import PaginaErrorTokenInvalido from "../../common/PaginasError/PaginaErrorTokenInvalido";
import { verifyResetToken, resetPassword } from "../../../../../services/FeaturesService";

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: '' });
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setValidToken(false);
        return;
      }

      try {
        const isValid = await verifyResetToken(token);
        setValidToken(isValid);
      } catch (error) {
        console.error("Error verifying token:", error);
        setValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const responseData = await resetPassword(token, data.newPassword);
      setNotification({ isOpen: true, message: responseData.message, type: 'success' });
    } catch (error) {
      setNotification({ isOpen: true, message: error.message, type: 'error' });
    }
  };

  if (!validToken) {
    return <PaginaErrorTokenInvalido />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-zinc-900">
          Reset Password
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 flex items-center">
                <FaLock className="mr-2" />
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none block w-full px-3 py-2 pr-10 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md"
                {...register("newPassword", { required: true })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 top-5 flex items-center px-3 text-zinc-700 hover:text-zinc-900"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.newPassword && <span className="text-red-500">This field is required</span>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
            >
              Reset Password
            </button>
          </div>
        </form>
        {notification.isOpen && (
          <Notification
            type={notification.type}
            message={notification.message}
            isOpen={notification.isOpen}
            onClose={() => setNotification({ isOpen: false })}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
