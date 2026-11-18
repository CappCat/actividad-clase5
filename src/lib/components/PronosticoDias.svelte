<script lang="ts">
    import { consultarDatosCiudad } from "../servicios/clima";
    let { ciudad, latitud, longitud } = $props();

    let datosDias : { fecha: string; temperaturaMaxima: number; temperaturaMinima: number }[] = $state([]);

    let fechasDias = $state([]);
    let temperaturasMaximas = $state([]);
    let temperaturasMinimas = $state([]);
    let cargando = $state(false);
    let error = $state("");

    async function consultarDatosDias() {
        cargando = true;
        error = "";
        try {
            const datos = await consultarDatosCiudad(latitud, longitud);
            fechasDias = datos.daily.time;
            temperaturasMaximas = datos.daily.temperature_2m_max;
            temperaturasMinimas = datos.daily.temperature_2m_min;
            datosDias = fechasDias.map((fecha: string, index: number) => ({
                fecha,
                temperaturaMaxima: temperaturasMaximas[index],
                temperaturaMinima: temperaturasMinimas[index],
            }));
        } catch (e) {
            error = e instanceof Error ? e.message : "No se pudo cargar el pronóstico diario.";
            datosDias = [];
        } finally {
            cargando = false;
        }
    }

    $effect(() => {
        if (latitud && longitud) {
            consultarDatosDias();
        }
    });

</script>

<section class="card border-0 shadow-sm rounded-4 mb-4">
    <div class="card-header bg-white border-0 px-3 px-md-4 pt-4 pb-2">
        <h2 class="h4 mb-1">Pronóstico por días</h2>
        <p class="text-secondary mb-0">Temperaturas máximas y mínimas de los próximos siete días</p>
    </div>
    <div class="card-body px-3 px-md-4 pb-4">
        {#if cargando}
            <div class="alert alert-light border mb-0" role="status">
                <span class="spinner-border spinner-border-sm text-primary me-2" aria-hidden="true"></span>
                Cargando el pronóstico de los próximos siete días...
            </div>
        {:else if error}
            <div class="alert alert-danger mb-0" role="alert">{error}</div>
        {:else if datosDias && datosDias.length > 0}
            <div class="row g-3">
                {#each datosDias.slice(0, 7) as dia, indice}
                    <div class="col-6 col-md-4 col-lg-3 col-xl">
                        <article class="day-card h-100 text-center p-3 rounded-3">
                            <p class="fw-semibold mb-2">{indice === 0 ? "Hoy" : dia.fecha}</p>
                            <div class="fs-3 mb-2" aria-hidden="true">☀️</div>
                            <div>
                                <span class="text-danger fw-bold">{dia.temperaturaMaxima}°</span>
                                <span class="text-secondary"> / {dia.temperaturaMinima}°</span>
                            </div>
                            <small class="text-secondary d-block">Máx. / mín.</small>
                        </article>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="alert alert-info mb-0">No hay datos de pronóstico por días disponibles.</div>
        {/if}
    </div>
</section>