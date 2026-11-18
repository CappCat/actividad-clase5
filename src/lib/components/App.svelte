<script lang="ts">
    import BuscadorDeCiudad from "./BuscadorDeCiudad.svelte";
    import ClimaActual from "./ClimaActual.svelte";

    let ciudad = $state("");

    let latitud = $state(0);
    let longitud = $state(0);

    function manejarRespuesta(respuesta: { name: string; country: string; latitude: number; longitude: number }) {
        latitud = respuesta.latitude;
        longitud = respuesta.longitude;
        ciudad = respuesta.name;

        console.log("longitud: " + longitud);
        console.log("latitud: " + latitud);
    }


</script>

<main class="container py-4 py-md-5">
    <header class="text-center mb-4">
        <span class="badge rounded-pill text-bg-primary mb-2 px-3 py-2">Svelte 5 · Open-Meteo</span>
        <h1 class="fw-bold mb-2">Dashboard Meteorológico</h1>
        <p class="text-secondary mb-0">Consulta las condiciones y el pronóstico de una ciudad.</p>
    </header>

    <div class="card border-0 shadow-sm rounded-4 mb-4">
        <div class="card-body p-3 p-md-4">
            <BuscadorDeCiudad ciudad={ciudad} manejarRespuesta={manejarRespuesta} />
        </div>
    </div>

    <ClimaActual ciudad={ciudad} latitud={latitud} longitud={longitud} />
</main>
