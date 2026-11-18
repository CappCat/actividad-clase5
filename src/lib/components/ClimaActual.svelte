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
    let cargando = $state(false);
    let error = $state("");

    async function consultarDatosClima() {
        cargando = true;
        error = "";
        try {
            const datos = await consultarDatosCiudad(latitud, longitud);
            datosClima = {
                temperatura: datos.current.temperature_2m,
                humedad: datos.current.relative_humidity_2m,
                velocidadViento: datos.current.wind_speed_10m,
            };
        } catch (e) {
            error = e instanceof Error ? e.message : "No se pudieron cargar los datos del clima.";
        } finally {
            cargando = false;
        }
    }

    $effect(() => {
        if (latitud && longitud) {
            consultarDatosClima();
        }
    });
</script>

<section class="card border-0 shadow-sm rounded-4 mb-4">
    <div class="card-body p-3 p-md-4">
    {#if ciudad}
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
            <div>
                <p class="text-uppercase text-primary fw-bold small mb-1">Condiciones actuales</p>
                <h2 class="h3 mb-0">Clima actual de {ciudad}</h2>
            </div>
            <button class="btn btn-outline-primary align-self-start" onclick={consultarDatosClima} disabled={cargando}>
                {cargando ? "Actualizando..." : "Actualizar datos"}
            </button>
        </div>
        {#if cargando}
            <div class="alert alert-light border" role="status">
                <span class="spinner-border spinner-border-sm text-primary me-2" aria-hidden="true"></span>
                Cargando las condiciones actuales de {ciudad}...
            </div>
        {:else if error}
            <div class="alert alert-danger" role="alert">{error}</div>
        {:else}
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="metric-card h-100 p-3 rounded-3">
                        <span class="fs-3 d-block" aria-hidden="true">🌡️</span>
                        <small class="d-block text-secondary">Temperatura</small>
                        <strong class="fs-3">{datosClima.temperatura} °C</strong>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="metric-card h-100 p-3 rounded-3">
                        <span class="fs-3 d-block" aria-hidden="true">💧</span>
                        <small class="d-block text-secondary">Humedad relativa</small>
                        <strong class="fs-3">{datosClima.humedad} %</strong>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="metric-card h-100 p-3 rounded-3">
                        <span class="fs-3 d-block" aria-hidden="true">💨</span>
                        <small class="d-block text-secondary">Velocidad del viento</small>
                        <strong class="fs-3">{datosClima.velocidadViento} km/h</strong>
                    </div>
                </div>
            </div>
        {/if}

        <div class="mt-4">
            <PronosticoHoras ciudad={ciudad} latitud={latitud} longitud={longitud} />
            <PronosticoDias ciudad={ciudad} latitud={latitud} longitud={longitud} />
        </div>
    {:else}
        <div class="alert alert-secondary mb-0">Ingrese el nombre de una ciudad para ver el clima actual.</div>
    {/if}
    </div>
</section>
