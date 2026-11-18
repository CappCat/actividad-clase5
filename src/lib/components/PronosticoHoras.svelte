<script lang="ts">
    import { consultarDatosCiudad } from "../servicios/clima";
    
    let { ciudad, latitud, longitud } = $props();

    let tiempos = $state([]);
    let temperaturas = $state([]);
    let datosDias: { fecha: string; temperaturaMaxima: number; temperaturaMinima: number }[] = $state([]);

    let datosHoras: { time: string; temperature_2m: number }[] = $state([]);

    async function consultarDatosHoras() {
        const datos = await consultarDatosCiudad(latitud, longitud);
        tiempos = datos.hourly.time;
        temperaturas = datos.hourly.temperature_2m;
        datosHoras = tiempos.map((time: string, index: number) => ({
            time,
            temperature_2m: temperaturas[index],
        }));
        datosHoras = datosHoras.slice(0, 24); // Tomar solo las primeras 24 horas
    }

    $effect(() => {
        if (latitud && longitud) {
            consultarDatosHoras();
        }
    });
</script>

<div>
    {#if datosHoras && datosHoras.length > 0}
        <h2>Pronóstico por horas</h2>
        <ul>
            {#each datosHoras as hora}
                <li>
                    <strong>{hora.time}</strong>: {hora.temperature_2m} °C
                </li>
            {/each}
        </ul>
    {:else}
        <p>No hay datos de pronóstico por horas disponibles.</p>
    {/if}
</div>