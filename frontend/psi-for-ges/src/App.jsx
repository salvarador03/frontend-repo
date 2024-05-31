import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './views/user/components/common/Header/Header';
import Footer from './views/user/components/common/Footer/Footer';
import AdminNavbar from './views/admin/components/common/AdminNavbar/AdminNavbar';
import AdminFooter from './views/admin/components/common/AdminFooter/AdminFooter';
import ErrorBoundary from './views/user/components/Error/ErrorBoundary';
import Loader from './views/user/components/features/Loader/Loader';
import PersonalInfoLoader from './views/user/components/SobreMi/PersonalInfoLoader';
import './views/user/components/SobreMi/css/styles.css';
import { useAuth } from './views/user/components/features/Context/AuthContext';
import Information from './views/user/components/Account/Information';
import AdminInformation from './views/admin/components/Account/AdminInformation';
import PaginaNoEncontrada from './views/user/components/common/PaginasError/PaginaNoEncontrada';
import PaginaProhibida from './views/user/components/common/PaginasError/PaginaProhibida';
import PaginaUsuarioBloqueado from './views/user/components/common/PaginasError/PaginaUsuarioBloqueado';
import PreguntasFrecuentes from './views/user/components/PreguntasFrecuentes/PreguntasFrecuentes';
import BackgroundSVG from './views/user/components/common/BackgroundSVG/BackgroundSVG';
import Search from './views/user/components/common/Search/Search';
import MenuButton from './views/user/components/common/MenuButton/MenuButton';
import AdminFAQ from './views/admin/components/Faq/AdminFaq';
import SubscriptionDialog from './views/user/components/common/SubscriptionDialog/SubscriptionDialog';
import PublicacionPage from './views/admin/components/MyBlog/PublicacionPage';
import EditarPublicacion from './views/admin/components/MyBlog/EditarPublicacion';
import CustomKanban from './views/admin/components/Casos/CustomKanban';
import GestionPage from './views/admin/components/Gestion/GestionPage';
import FormularioCasoParent from './views/admin/components/Casos/FormularioCasoParent';
import BotonIA from './views/user/components/common/BotonIA/BotonIA';
import UsuarioPublicaciones from './views/user/components/MyBlogUser/UsuarioPublicaciones';
import UserPublicacionPage from './views/user/components/MyBlogUser/UserPublicacionPage';
import Success from './views/user/components/common/SubscriptionDialog/Success';
import Cancel from './views/user/components/common/SubscriptionDialog/Cancel';

const ForgotPassword = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/features/Login/ForgotPassword'));
});

const ResetPassword = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/features/Login/ResetPassword'));
});

const FormularioPublicacion = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/admin/components/MyBlog/FormularioPublicacion'));
});

const AdminPublicaciones = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/admin/components/MyBlog/AdminPublicaciones'));
});

const Register = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/features/Register/Register'));
});

const Login = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/features/Login/Login'));
});

const Servicios = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/Servicios/Servicios'));
});

const SobreMi = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/SobreMi/SobreMi'));
});

const Contacto = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/Contacto/Contacto'));
});

const AdminAccountManagement = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/admin/components/Account/AdminAccountManagement'));
});

const UserAccountManagement = lazy(() => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // Retrasa la carga 2 segundos
  }).then(() => import('./views/user/components/Account/UserAccountManagement'));
});

function App() {
  const { user, isLoggedIn, cookiesAccepted, acceptCookies, isRegistered } = useAuth();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const shouldExcludeModal = (path) => {
    const excludedPaths = [
      '/login', '/register', '/reset-password', '/forgot-password',
      '/sobremi', '/contacto', '/search', '/success', '/cancel'  // Añadir success y cancel
    ];
    return excludedPaths.includes(path);
  };

  useEffect(() => {
    if (!shouldExcludeModal(location.pathname) && !isLoggedIn && (!cookiesAccepted || !isRegistered)) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location, isLoggedIn, cookiesAccepted, isRegistered, navigate]);

  const handleAcceptCookiesAndRegister = () => {
    acceptCookies();
    navigate('/register');
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    acceptCookies();
    navigate('/login');
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundSVG />
      <div className="relative z-10">
        {isAdmin ? <AdminNavbar /> : <Header />}
        {/* <Advertisement /> */}
        <div className="container mx-auto px-4 mt-32">
          <AnimatePresence exitBeforeEnter>
            <Suspense fallback={<Loader />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
                <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
                <Route path="/servicios" element={<ErrorBoundary><Servicios /></ErrorBoundary>} />
                <Route path="/sobremi" element={
                  <ErrorBoundary>
                    <Suspense fallback={<PersonalInfoLoader />}>
                      <SobreMi />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="/contacto" element={<ErrorBoundary><Contacto /></ErrorBoundary>} />
                <Route path="/forgot-password" element={<ErrorBoundary><ForgotPassword /></ErrorBoundary>} />
                <Route path="/reset-password" element={<ErrorBoundary><ResetPassword /></ErrorBoundary>} />
                <Route path="/success" element={<Success />} />  {/* Añadir ruta de éxito */}
                <Route path="/cancel" element={<Cancel />} />    {/* Añadir ruta de cancelación */}
                {isAdmin ? (
                  <>
                    <Route path="/admin/crear-publicaciones" element={<ErrorBoundary><FormularioPublicacion /></ErrorBoundary>} />
                    <Route path="/admin/publicaciones" element={<ErrorBoundary><AdminPublicaciones /></ErrorBoundary>} />
                    <Route path="/admin/kanban/casos" element={<ErrorBoundary><CustomKanban /></ErrorBoundary>} />
                    <Route path="/admin/caso/:id" element={<ErrorBoundary><FormularioCasoParent /></ErrorBoundary>} />
                    <Route path="/admin/nuevo-caso" element={<ErrorBoundary><FormularioCasoParent /></ErrorBoundary>} />
                    <Route path="/admin/gestion" element={<ErrorBoundary><GestionPage /></ErrorBoundary>} />
                    <Route path="/publicacion/:publicacionid" element={<PublicacionPage />} />
                    <Route path="/admin/editar-publicacion/:id" element={<EditarPublicacion />} />
                    <Route path="/admin/account-management" element={<ErrorBoundary><AdminAccountManagement /></ErrorBoundary>} />
                    <Route path="/admin/faq" element={<ErrorBoundary><AdminFAQ /></ErrorBoundary>} />
                    <Route path="/admin/account-management/information" element={<ErrorBoundary><AdminInformation /></ErrorBoundary>} />
                  </>
                ) : (
                  <Route path="/admin/*" element={<PaginaProhibida />} />
                )}
                <Route path="/preguntas" element={<ErrorBoundary><PreguntasFrecuentes /></ErrorBoundary>} />
                <Route path="/account-management" element={<ErrorBoundary><UserAccountManagement /></ErrorBoundary>} />
                <Route path="/account-management/information" element={<ErrorBoundary><Information /></ErrorBoundary>} />
                <Route path="/search" element={<ErrorBoundary><Search /></ErrorBoundary>} />
                <Route path="/publicaciones" element={<ErrorBoundary><UsuarioPublicaciones /></ErrorBoundary>} />
                <Route path="/publicacion/:publicacionid" element={<UserPublicacionPage />} />
                <Route path="/bloqueado" element={<PaginaUsuarioBloqueado />} />
                <Route path="/" element={<Navigate to="/sobremi" />} />
                <Route path="*" element={<PaginaNoEncontrada />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </div>
        <div className="fixed bottom-20 right-20 flex flex-col space-y-4 z-50">
          <MenuButton />
          <BotonIA />
        </div>
        {isAdmin ? <AdminFooter /> : <Footer />}
      </div>
      {!shouldExcludeModal(location.pathname) && (
        <SubscriptionDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAcceptCookies={handleAcceptCookiesAndRegister}
          isLoggedIn={isLoggedIn}
          onRegister={handleAcceptCookiesAndRegister}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
