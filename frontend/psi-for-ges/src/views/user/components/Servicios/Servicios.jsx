import React from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { motion } from 'framer-motion';
import { FaUserMd, FaGavel, FaComments, FaInfoCircle, FaShieldAlt, FaBalanceScale, FaLaptopMedical, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const Servicios = () => {
  const navigate = useNavigate();

  return (
    <ParallaxProvider>
      <motion.header
        className="bg-indigo-600 text-white text-center py-4 mt-64 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Ámbitos de actuación como perito psicológico</h1>
          <p>Informe psicológico forense, contrainformes y peritajes</p>
        </div>
      </motion.header>
      <div className="bg-white text-neutral-600 min-h-screen">
        <main className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-center items-stretch md:space-x-8 p-8">
            <ServiceAreaCard
              imgSrc="https://placehold.co/600x400"
              title="ÁMBITO CIVIL"
              items={[
                "Incapacidades y discapacidades",
                "Capacidad testamentaria y de obrar",
                "Guarda y custodia de menores",
                "Divorcios y separaciones",
                "Idoneidad de tutor o curador",
                "Evaluación de daño cerebral",
              ]}
            />
            <ServiceAreaCard
              imgSrc="https://placehold.co/600x400"
              title="ÁMBITO PENAL"
              items={[
                "Acoso y delitos sexuales",
                "Procedimientos de Violencia sobre la mujer",
                "Peligrosidad y reincidencia",
                "Valoración psicológica del denunciado",
                "Lesiones y/o secuelas",
                "Credibilidad del testimonio",
                "Crímenes contra la salud pública",
              ]}
            />
            <ServiceAreaCard
              imgSrc="https://placehold.co/600x400"
              title="ÁMBITO LABORAL"
              items={[
                "Evaluación de acoso laboral (Mobbing)",
                "Evaluación de estrés laboral",
                "Evaluación de riesgos psicosociales",
                "Conflictos laborales",
                "Bajas laborales",
                "Aptitud psicológica para el empleo",
              ]}
            />
          </div>

          <SectionWithAnimation>
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold">Servicios Profesionales</h2>
              <p>Descubre nuestros servicios profesionales en diferentes áreas de la psicología forense.</p>
            </div>
          </SectionWithAnimation>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 p-4">
            <ServiceCard icon={<FaUserMd className="text-3xl text-blue-500 mr-4" />} title="Evaluación Psicológica" description="Realizamos evaluaciones psicológicas exhaustivas y detalladas." />
            <ServiceCard icon={<FaGavel className="text-3xl text-blue-500 mr-4" />} title="Peritaje Forense" description="Ofrecemos servicios de peritaje forense para procesos judiciales." />
            <ServiceCard icon={<FaComments className="text-3xl text-blue-500 mr-4" />} title="Consultoría" description="Brindamos consultoría en casos legales y judiciales." />
            <ServiceCard icon={<FaInfoCircle className="text-3xl text-blue-500 mr-4" />} title="Información y Recursos" description="Proveemos recursos e información para profesionales y clientes." />
            <ServiceCard icon={<FaShieldAlt className="text-3xl text-blue-500 mr-4" />} title="Seguridad y Confidencialidad" description="Garantizamos la seguridad y confidencialidad de nuestros servicios." />
            <ServiceCard icon={<FaBalanceScale className="text-3xl text-blue-500 mr-4" />} title="Justicia y Ética" description="Nos comprometemos a actuar con justicia y ética en todos nuestros casos." />
          </section>

          <SectionWithAnimation>
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold">Servicios Adicionales</h2>
              <p>Además de nuestros servicios principales, ofrecemos servicios adicionales para su comodidad.</p>
            </div>
          </SectionWithAnimation>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 p-4">
            <AdditionalServiceCard icon={<FaLaptopMedical className="text-3xl text-purple-500 mr-4" />} title="Consultas Online" description="Ofrecemos consultas en línea para su comodidad, permitiéndole acceder a nuestros servicios desde cualquier lugar." />
            <AdditionalServiceCard icon={<FaPhoneAlt className="text-3xl text-purple-500 mr-4" />} title="Asesorías Telefónicas" description="Proveemos asesorías telefónicas para consultas rápidas y seguimiento de tratamientos." />
            <AdditionalServiceCard icon={<FaComments className="text-3xl text-purple-500 mr-4" />} title="Sesiones de Terapia" description="Realizamos sesiones de terapia individuales y grupales, adaptadas a las necesidades del paciente." />
          </section>

          <ContactSection navigate={navigate} />
        </main>
      </div>
    </ParallaxProvider>
  );
};

const SectionWithAnimation = ({ children }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.section
      className="bg-indigo-600 text-white text-center py-4 w-full"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.section>
  );
};

const ContactSection = ({ navigate }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="bg-indigo-700 text-white text-center py-8 w-full"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">¿Interesado en nuestros servicios?</h2>
        <p className="mb-6">Contáctanos para más información y descubre cómo podemos ayudarte.</p>
        <button
          className="bg-white text-indigo-700 font-semibold px-5 py-3 rounded"
          onClick={() => navigate('/contacto')}
        >
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-2xl" />
            Ir a la página de contacto
          </div>
        </button>
      </div>
    </motion.section>
  );
};

const ServiceCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-white text-gray-800 shadow-indigo-300 shadow-lg p-6"
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <p className="text-gray-700">{description}</p>
  </motion.div>
);

const AdditionalServiceCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-white text-gray-800 shadow-indigo-300 shadow-lg p-6"
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <p className="text-gray-700">{description}</p>
  </motion.div>
);

const ServiceAreaCard = ({ imgSrc, title, items }) => (
  <motion.div
    className="bg-white text-gray-800 p-4 mb-4 md:mb-0 flex-grow shadow-indigo-300 shadow-lg"
    whileHover={{ scale: 1.05 }}
  >
    <img src={imgSrc} alt={title} className="w-full mb-4" />
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </motion.div>
);

export default Servicios;
