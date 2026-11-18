<script lang="ts">
    import { consultarDatosCiudad } from "../servicios/clima";
    import PronosticoHoras from "./PronosticoHoras.svelte";
    import PronosticoDias from "./PronosticoDias.svelte";

    let { ciudad, latitud, longitud } = $props();

    let datosClima = $state({
        temperatura: 0,
        humedad: 0,
        velocidadViento: 0,
    });


    

    async function consultarDatosClima() {
        const datos = await consultarDatosCiudad(latitud, longitud);
        datosClima = {
            temperatura: datos.current.temperature_2m,
            humedad: datos.current.relative_humidity_2m,
            velocidadViento: datos.current.wind_speed_10m,
        };
        
    }

    $effect(() => {
        if (latitud && longitud) {
            consultarDatosClima();
        }
    });
</script>

<div>
    {#if ciudad}
        <h2>Clima actual de {ciudad}</h2>
        <p>Temperatura: {datosClima.temperatura} °C</p>
        <p>Humedad: {datosClima.humedad} %</p>
        <p>Velocidad del viento: {datosClima.velocidadViento} m/s</p>
        <button onclick={consultarDatosClima}>Actualizar datos</button>

        <PronosticoHoras ciudad={ciudad} latitud={latitud} longitud={longitud} />
        <PronosticoDias ciudad={ciudad} latitud={latitud} longitud={longitud} />
        

    {:else}
        <p>Ingrese el nombre de una ciudad para ver el clima actual.</p>
    {/if}
    
</div>

