<script lang="ts">
    import { consultarDatosCiudad } from "../servicios/clima";
    let { ciudad, latitud, longitud } = $props();

    let datosDias : { fecha: string; temperaturaMaxima: number; temperaturaMinima: number }[] = $state([]);

    let fechasDias = $state([]);
    let temperaturasMaximas = $state([]);
    let temperaturasMinimas = $state([]);

    async function consultarDatosDias() {
        const datos = await consultarDatosCiudad(latitud, longitud);
        fechasDias = datos.daily.time;
        temperaturasMaximas = datos.daily.temperature_2m_max;
        temperaturasMinimas = datos.daily.temperature_2m_min;
        datosDias = fechasDias.map((fecha: string, index: number) => ({
            fecha,
            temperaturaMaxima: temperaturasMaximas[index],
            temperaturaMinima: temperaturasMinimas[index],
        }));
    }

    $effect(() => {
        if (latitud && longitud) {
            consultarDatosDias();
        }
    });

</script>

<div>
    {#if datosDias && datosDias.length > 0}
        <h2>Pronóstico por días</h2>
        <ul>
            {#each datosDias as dia}
                <li>
                    <strong>{dia.fecha}</strong>: Máxima: {dia.temperaturaMaxima} °C, Mínima: {dia.temperaturaMinima} °C
                </li>
            {/each}
        </ul>
    {:else}
        <p>No hay datos de pronóstico por días disponibles.</p>
    {/if}
</div>