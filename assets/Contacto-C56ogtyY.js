import{u as j,b as g,m as v,r as i,X as w,Z as N,j as e,B as S,N as z,$ as k,a0 as C}from"./index-DAMA4hZh.js";const F=()=>{const{register:t,handleSubmit:u,formState:{errors:a}}=j(),{language:d}=g(),{user:m}=v(),[s,x]=i.useState({}),[l,r]=i.useState({isOpen:!1,type:"",message:""}),[c,p]=i.useState("contact"),[f,b]=i.useState([]);i.useEffect(()=>{w(d).then(o=>x(o)).catch(o=>console.error("Failed to load i18n messages:",o)),N().then(o=>b(o)).catch(o=>console.error("Failed to load services list:",o))},[d]);const h=async o=>{try{if(c==="service"){const n=await k({...o,servicio:o.servicio,usuario:{id:m.id,nombre:m.name,email:o.email},descripcionConsulta:o.descripcionConsulta});r(n===200?{isOpen:!0,type:"success",message:"Se ha realizado la consulta del servicio."}:{isOpen:!0,type:"error",message:"Error al realizar la consulta."})}else{const n=await C(o);r(n===200?{isOpen:!0,type:"success",message:"Mensaje enviado correctamente."}:{isOpen:!0,type:"error",message:"Error al enviar el mensaje."})}}catch{r({isOpen:!0,type:"error",message:"Error al procesar la solicitud."})}},y=()=>{r({...l,isOpen:!1})};return e.jsxs("div",{className:"flex items-center justify-center bg-zinc-100 px-4 pt-48 sm:px-6 lg:px-8 min-h-screen",children:[e.jsxs("div",{className:"max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg mb-40",children:[e.jsx(S,{}),e.jsx("h2",{className:"text-center text-3xl font-extrabold text-zinc-900",children:s["text.formulario.contacto.titulo"]}),e.jsxs("form",{className:"space-y-4",onSubmit:u(h),children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"tipoServicio",className:"block text-sm font-medium text-zinc-700",children:s["text.formulario.contacto.tipoServicio"]}),e.jsxs("select",{id:"tipoServicio",name:"tipoServicio",className:"block w-full px-3 py-2 border border-yellow-400 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm rounded-md",...t("tipoServicio",{required:!0}),onChange:o=>p(o.target.value),children:[e.jsx("option",{value:"contact",children:"Contacto"}),e.jsx("option",{value:"service",children:"Contratar Servicio"})]}),a.tipoServicio&&e.jsx("span",{className:"text-red-500",children:"Este campo es requerido"})]}),c==="service"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"servicio",className:"block text-sm font-medium text-zinc-700",children:s["text.formulario.contacto.servicio"]}),e.jsx("select",{id:"servicio",name:"servicio",className:"block w-full px-3 py-2 border border-yellow-400 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm rounded-md",...t("servicio",{required:!0}),children:f.map(o=>e.jsx("option",{value:o.id,children:o.nombre},o.id))}),a.servicio&&e.jsx("span",{className:"text-red-500",children:"Este campo es requerido"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"descripcionConsulta",className:"block text-sm font-medium text-zinc-700",children:s["text.formulario.contacto.descripcionConsulta"]}),e.jsx("textarea",{id:"descripcionConsulta",name:"descripcionConsulta",rows:"4",className:"appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md",...t("descripcionConsulta",{required:!0})}),a.descripcionConsulta&&e.jsx("span",{className:"text-red-500",children:"Este campo es requerido"})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"nombre",className:"block text-sm font-medium text-zinc-700",children:s["text.formulario.contacto.nombre"]}),e.jsx("input",{id:"nombre",name:"nombre",type:"text",className:"appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md",...t("nombre",{required:!0})}),a.nombre&&e.jsx("span",{className:"text-red-500",children:"El nombre es requerido"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-zinc-700",children:s["text.formulario.contacto.email"]}),e.jsx("input",{id:"email",name:"email",type:"email",className:"appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md",...t("email",{required:!0})}),a.email&&e.jsx("span",{className:"text-red-500",children:"El email es requerido"})]}),c==="contact"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"asunto",className:"block text-sm font-medium text-zinc-700",children:s["text.formulario.contacto.asunto"]}),e.jsx("input",{id:"asunto",name:"asunto",type:"text",className:"appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md",...t("asunto")})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"mensaje",className:"block text-sm font-medium text-zinc-700",children:s["text.formulario.contacto.mensaje"]}),e.jsx("textarea",{id:"mensaje",name:"mensaje",rows:"4",className:"appearance-none block w-full px-3 py-2 border border-yellow-400 placeholder-zinc-500 text-gray-900 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm hover:border-yellow-600 transition rounded-md",...t("mensaje")})]})]}),e.jsxs("div",{className:"text-sm text-zinc-600",children:[s["text.formulario.contacto.privacidad"]," ",e.jsx("a",{href:"#",className:"text-green-600",children:s["text.formulario.contacto.privacidad.enlace"]})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",className:"group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition",children:s["text.formulario.contacto.boton"]})})]})]}),e.jsx(z,{type:l.type,message:l.message,isOpen:l.isOpen,onClose:y})]})};export{F as default};
