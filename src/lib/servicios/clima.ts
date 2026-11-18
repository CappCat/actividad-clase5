const COORDENADAS_CIUDAD_URL="https://geocoding-api.open-meteo.com/v1/search?name=&count=10&language=es&format=json";
const DATOS_CIUDAD_URL="https://api.open-meteo.com/v1/forecast?latitude=&longitude=&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto";


export async function consultarCoordenadas(ciudad:string){
    const url = new URL(COORDENADAS_CIUDAD_URL);
    url.searchParams.set("name", ciudad);
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error(`No se pudieron consultar las coordenadas (${respuesta.status})`);
    }
    const datos = await respuesta.json();
    return datos.results ?? [];
}

export async function consultarDatosCiudad(latitud:string,longitud:string){
    const url = DATOS_CIUDAD_URL.replace("latitude=",`latitude=${latitud}`).replace("longitude=",`longitude=${longitud}`);
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error(`No se pudieron consultar los datos del clima (${respuesta.status})`);
    }
    const datos = await respuesta.json();
    return datos;
}