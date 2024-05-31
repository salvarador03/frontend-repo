import{r as s,a as C,j as e,L as x,n as k,t as P,w as E,x as L,p as A,R as D,q as M,y as S,z as m,D as F}from"./index-pt3s4JTT.js";const R=()=>{const[o,r]=s.useState([]),[g,n]=s.useState(null),[u,b]=s.useState(0),[h,i]=s.useState(!1),p=C(),l=3,c=u*l;s.useEffect(()=>{(async()=>{try{const a=await m();r(Array.isArray(a)?a:[])}catch(a){console.error("Error cargando publicaciones:",a),r([])}})()},[]);const y=t=>{p(`/admin/editar-publicacion/${t.pid}`)},j=t=>{n(t),i(!0)},f=async()=>{try{await F(g.pid);const t=await m();r(Array.isArray(t)?t:[]),i(!1),n(null)}catch(t){console.error("Error eliminando publicación:",t)}},N=Math.ceil(o.length/l),v=({selected:t})=>{b(t)},d=()=>{i(!1),n(null)},w=t=>{const a=document.createElement("div");return a.innerHTML=t,a.textContent||a.innerText||""};return e.jsxs("div",{className:"admin-publicaciones container mx-auto p-4",children:[e.jsx("h1",{className:"text-3xl font-bold mb-4 text-center",children:"Administración de Publicaciones"}),e.jsx("div",{className:"relative inline-block text-left mb-6",children:e.jsx("div",{children:e.jsxs(x,{to:"/frontend-repo/admin/crear-publicaciones",className:"inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500",children:[e.jsx(k,{className:"mr-2"})," Añadir Publicación"]})})}),e.jsx("ul",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:e.jsx(P,{children:o.slice(c,c+l).map(t=>e.jsxs(E.li,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.3},className:"p-4 border border-gray-200 rounded-lg flex flex-col bg-white shadow-sm",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:`data:image/jpeg;base64,${t.foto}`,alt:t.titulo,className:"w-full h-48 object-cover rounded-t-lg"}),e.jsx("span",{className:"absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded",children:t.categoria})]}),e.jsxs("div",{className:"flex items-center mt-4",children:[t.usuarioFoto?e.jsx("img",{src:`data:image/jpeg;base64,${t.usuarioFoto}`,alt:t.username,className:"w-10 h-10 rounded-full mr-4"}):e.jsx("div",{className:"w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center mr-4",children:t.username.charAt(0)}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold",children:t.titulo}),e.jsxs("p",{className:"text-sm text-gray-600",children:[w(t.contenido).slice(0,100),"..."]}),e.jsx(x,{to:`/frontend-repo/publicacion/${t.pid}`,className:"text-purple-500 hover:text-purple-700",children:"Leer más »"})]})]}),e.jsxs("div",{className:"flex items-center justify-between mt-4",children:[e.jsx("span",{className:"text-sm text-gray-500",children:new Date(t.fechaCreacion).toLocaleDateString()}),e.jsxs("span",{className:"text-sm text-gray-500",children:[t.comentarios?t.comentarios.length:0," comentarios"]})]}),e.jsxs("div",{className:"flex flex-row-reverse mt-4",children:[e.jsx("button",{onClick:()=>y(t),className:"p-2 text-blue-500 hover:text-blue-700",children:e.jsx(L,{})}),e.jsx("button",{onClick:()=>j(t),className:"p-2 text-red-500 hover:text-red-700",children:e.jsx(A,{})})]})]},t.pid))})}),e.jsx(D,{previousLabel:"Anterior",nextLabel:"Siguiente",pageCount:N,onPageChange:v,containerClassName:"pagination flex justify-center items-center mt-4 space-x-2",previousLinkClassName:"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition",nextLinkClassName:"py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition",disabledClassName:"paginationDisabled text-gray-400",activeClassName:"paginationActive bg-blue-500 text-black border border-gray-300",pageClassName:"page-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition",pageLinkClassName:"page-link",breakLabel:"...",breakClassName:"break-item py-2 px-4 bg-white text-black text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition"}),e.jsx(M,{isOpen:h,onClose:d,hideCloseButton:!0,children:e.jsxs("div",{className:"text-center",children:[e.jsx(S,{className:"text-red-500 text-3xl mx-auto mb-4"}),e.jsx("h2",{className:"text-2xl mb-4",children:"¿Estás seguro?"}),e.jsx("p",{className:"mb-4",children:"¿Realmente deseas eliminar esta publicación? Este proceso no se puede deshacer."}),e.jsx("button",{onClick:f,className:"bg-red-500 text-white p-2 rounded w-full mb-2",children:"Sí, eliminar"}),e.jsx("button",{type:"button",onClick:d,className:"p-2 w-full text-center rounded bg-gray-300 text-gray-700",children:"Cancelar"})]})})]})};export{R as default};
