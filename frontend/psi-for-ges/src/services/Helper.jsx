const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const FormatearFechaPersonalizada = (fecha) => {
    const f = new Date(fecha);
    return `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()} ${f.getHours()}:${f.getMinutes()}`;
};

export function TextoPersonalizado(props) {
    return <span style={{ color: '#bb2d3b' }}>{props.children}</span>;
}
