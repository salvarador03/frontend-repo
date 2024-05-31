import{j as e,w as n,r as m,b as j,X as p,Y as l,L as b}from"./index-pt3s4JTT.js";import{u as d}from"./index-Dehxwa9k.js";const o=({children:s,direction:t="left",duration:a=2,imageDuration:r=3})=>{const i={hidden:{x:-300,opacity:0},visible:{x:0,opacity:1,transition:{type:"spring",stiffness:120,duration:a}}},c={hidden:{x:300,opacity:0},visible:{x:0,opacity:1,transition:{type:"spring",stiffness:120,duration:a}}},[x,h]=d({triggerOnce:!0,threshold:.1});return e.jsx("div",{className:"flex mb-24",children:e.jsx(n.div,{ref:x,initial:"hidden",animate:h?"visible":"hidden",variants:t==="left"?i:c,className:"max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8",children:s})})},f=({images:s})=>{const[t,a]=d({triggerOnce:!0,threshold:.1}),r={hidden:{scale:0,opacity:0},visible:{scale:1,opacity:1,transition:{duration:.8}}};return e.jsx("div",{ref:t,className:"flex justify-around my-8",children:s.map((i,c)=>e.jsx(n.img,{src:i,alt:`Gallery image ${c+1}`,className:"rounded-lg",initial:"hidden",animate:a?"visible":"hidden",variants:r,style:{width:"30%",height:"auto"}},c))})},u=()=>{const[s,t]=m.useState({}),{language:a}=j();m.useEffect(()=>{p(a).then(i=>t(i)).catch(i=>console.error("Error loading the messages:",i))},[a]);const r={hidden:{opacity:0,x:50},visible:{opacity:1,x:0}};return e.jsxs("div",{children:[e.jsx(l,{name:"top",className:"element"}),e.jsx("div",{className:"mt-80",children:e.jsx(n.div,{className:"max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-40 md:p-10",initial:"hidden",animate:"visible",variants:r,transition:{duration:1.5},children:e.jsxs("div",{className:"flex flex-col md:flex-row",children:[e.jsx("div",{className:"md:w-1/3 flex justify-center mb-4 md:mb-0",children:e.jsx("img",{src:"https://placehold.co/300x300",alt:"Profile Picture",className:"rounded-lg w-48 h-48 md:w-full md:h-auto"})}),e.jsxs("div",{className:"md:w-2/3 md:pl-6",children:[e.jsx("h3",{className:"mt-4 text-lg font-semibold",children:"Pablo Alvarado Ramos"}),e.jsx("p",{className:"text-zinc-600",children:"M-25747"}),e.jsx("h2",{className:"text-2xl font-bold mb-3",children:s["text.sobremi.info"]}),e.jsx("p",{className:"mt-2",children:s["text.sobremi.parrafo1"]}),e.jsx("p",{className:"mt-2",children:s["text.sobremi.parrafo2"]}),e.jsx("p",{className:"mt-2",children:s["text.sobremi.parrafo3"]}),e.jsx("p",{className:"mt-2",children:s["text.sobremi.parrafo4"]}),e.jsx("p",{className:"mt-2",children:s["text.sobremi.parrafo5"]}),e.jsx(b,{to:"/frontend-repo/contacto",className:"mt-2 font-semibold text-blue-600",children:s["text.sobremi.parrafo6"]})]})]})},"sobreMiMotionDiv")}),e.jsx(l,{name:"gallery",className:"element",children:e.jsx("div",{className:"mb-24",children:e.jsx(f,{images:["https://placehold.co/600x400","https://placehold.co/600x400","https://placehold.co/600x400"]})})}),e.jsx(l,{name:"trabajo",className:"element",children:e.jsx(o,{direction:"left",duration:1.5,children:e.jsxs("div",{className:"flex flex-col md:flex-row items-start",children:[e.jsxs("div",{className:"md:w-1/2 p-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-3",children:s["text.sobremi.trabajo"]}),e.jsx("p",{children:s["text.sobremi.parrafo7"]}),e.jsx("h3",{className:"font-semibold mt-4",children:s["text.sobremi.areas"]}),e.jsxs("ul",{className:"list-disc ml-5",children:[e.jsx("li",{children:s["text.sobremi.area1"]}),e.jsx("li",{children:s["text.sobremi.area2"]}),e.jsx("li",{children:s["text.sobremi.area3"]}),e.jsx("li",{children:s["text.sobremi.area4"]}),e.jsx("li",{children:s["text.sobremi.area5"]}),e.jsx("li",{children:s["text.sobremi.area6"]})]})]}),e.jsx("div",{className:"md:w-1/2",children:e.jsx("img",{src:"https://placehold.co/600x400",alt:"Forensic Psychology Image",className:"w-full h-auto"})})]})})}),e.jsx(l,{name:"experiencia",className:"element",children:e.jsx(o,{direction:"right",duration:1.5,children:e.jsxs("div",{className:"flex flex-col md:flex-row items-start",children:[e.jsx("div",{className:"md:w-1/2",children:e.jsx("img",{src:"https://placehold.co/600x400",alt:"Health Psychology Image",className:"w-full h-auto"})}),e.jsxs("div",{className:"md:w-1/2 p-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-3",children:s["text.sobremi.experiencia"]}),e.jsx("p",{children:s["text.sobremi.parrafo8"]}),e.jsx("p",{children:s["text.sobremi.parrafo9"]})]})]})})}),e.jsx(l,{name:"intereses",className:"element",children:e.jsx(o,{direction:"left",duration:1.5,children:e.jsxs("div",{className:"flex flex-col md:flex-row items-start",children:[e.jsxs("div",{className:"md:w-1/2 p-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-3",children:s["text.sobremi.intereses"]}),e.jsx("p",{children:s["text.sobremi.parrafo10"]}),e.jsx("p",{children:s["text.sobremi.parrafo11"]}),e.jsx("h3",{className:"font-semibold mt-4",children:s["text.sobremi.areas"]}),e.jsxs("ul",{className:"list-disc ml-5",children:[e.jsx("li",{children:s["text.sobremi.area1"]}),e.jsx("li",{children:s["text.sobremi.area2"]}),e.jsx("li",{children:s["text.sobremi.area3"]}),e.jsx("li",{children:s["text.sobremi.area4"]}),e.jsx("li",{children:s["text.sobremi.area5"]}),e.jsx("li",{children:s["text.sobremi.area6"]})]})]}),e.jsx("div",{className:"md:w-1/2",children:e.jsx("img",{src:"https://placehold.co/600x400",alt:"Forensic Psychology Image",className:"w-full h-auto"})})]})})}),e.jsx("div",{className:"pb-20"})," "]})};export{u as default};
