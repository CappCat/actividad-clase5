<script lang="ts">
    import { consultarDatosCiudad } from "../servicios/clima";
    
    let { ciudad, latitud, longitud } = $props();

    let tiempos = $state([]);
    let temperaturas = $state([]);
    let datosDias: { fecha: string; temperaturaMaxima: number; temperaturaMinima: number }[] = $state([]);

    let datosHoras: { time: string; temperature_2m: number }[] = $state([]);
    let cargando = $state(false);
    let error = $state("");

    async function consultarDatosHoras() {
        cargando = true;
        error = "";
        try {
            const datos = await consultarDatosCiudad(latitud, longitud);
            tiempos = datos.hourly.time;
            temperaturas = datos.hourly.temperature_2m;
            datosHoras = tiempos.map((time: string, index: number) => ({
                time,
                temperature_2m: temperaturas[index],
            }));
            datosHoras = datosHoras.slice(0, 24); // Tomar solo las primeras 24 horas
        } catch (e) {
            error = e instanceof Error ? e.message : "No se pudo cargar el pronóstico por horas.";
            datosHoras = [];
        } finally {
            cargando = false;
        }
    }

    $effect(() => {
        if (latitud && longitud) {
            consultarDatosHoras();
        }
    });
</script>

<section class="card border-0 shadow-sm rounded-4 mb-4">
    <div class="card-header bg-white border-0 px-3 px-md-4 pt-4 pb-2">
        <h2 class="h4 mb-1">Pronóstico por horas</h2>
        <p class="text-secondary mb-0">Temperaturas previstas para las próximas 24 horas</p>
    </div>
    <div class="card-body px-3 px-md-4 pb-4">
        {#if cargando}
            <div class="alert alert-light border mb-0" role="status">
                <span class="spinner-border spinner-border-sm text-primary me-2" aria-hidden="true"></span>
                Cargando el pronóstico por horas...
            </div>
        {:else if error}
            <div class="alert alert-danger mb-0" role="alert">{error}</div>
        {:else if datosHoras && datosHoras.length > 0}
            <div class="hourly-grid">
                {#each datosHoras as hora}
                    <article class="hour-card text-center p-3 rounded-3">
                        <strong class="d-block text-primary mb-2">{hora.time}</strong>
                        <span class="fs-4" aria-hidden="true">🌤️</span>
                        <span class="d-block fw-bold mt-2">{hora.temperature_2m} °C</span>
                    </article>
                {/each}
            </div>
        {:else}
            <div class="alert alert-info mb-0">No hay datos de pronóstico por horas disponibles.</div>
        {/if}
    </div>
</section>