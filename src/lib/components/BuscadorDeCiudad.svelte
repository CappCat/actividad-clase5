<script lang="ts">
    import { consultarCoordenadas } from "../servicios/clima";

    let { ciudad, manejarRespuesta } = $props();

    let ciudadBuscada:string = $state("");

    let respuestas: { name: string; country: string; latitude: number; longitude: number }[] = $state([]);
    let cargando = $state(false);
    let error = $state("");

    async function buscarCiudad() {
        if (!ciudad.trim()) {
            respuestas = [];
            error = "Ingrese el nombre de una ciudad.";
            return;
        }

        cargando = true;
        error = "";

        try {
            respuestas = await consultarCoordenadas(ciudad.trim());
        } catch (e) {
            respuestas = [];
            error = e instanceof Error ? e.message : "No se pudo realizar la búsqueda.";
        } finally {
            cargando = false;
            ciudadBuscada = ciudad.trim();
        }


    }


</script>

<div class="row g-2 align-items-end mb-3">
    <div class="col-md-9">
        <label for="ciudad" class="form-label fw-semibold">Buscar ciudad</label>
        <input id="ciudad" class="form-control form-control-lg" type="search" bind:value={ciudad} placeholder="Ingrese el nombre de la ciudad" />
    </div>
    <div class="col-md-3 d-grid">
        <button class="btn btn-primary btn-lg" onclick={buscarCiudad} disabled={cargando}>
            {#if cargando}
                <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Buscando...
            {:else}
                Buscar
            {/if}
        </button>
    </div>
</div>

{#if error}
    <div class="alert alert-danger mb-0" role="alert">{error}</div>
{:else if cargando}
    <div class="alert alert-light border mb-0" role="status">
        <span class="spinner-border spinner-border-sm text-primary me-2" aria-hidden="true"></span>
        Consultando ciudades disponibles...
    </div>
{:else if respuestas.length > 0}
    <p class="fw-semibold mb-2">Selecciona una ubicación:</p>
    <div class="list-group">
        {#each respuestas as respuesta}
            <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick={() => {manejarRespuesta(respuesta); respuestas = []; ciudadBuscada = "";}}>
                <span>
                    <strong>{respuesta.name}</strong> · {respuesta.country}
                    <small class="d-block text-secondary">Lat: {respuesta.latitude}, Lon: {respuesta.longitude}</small>
                </span>
                <span aria-hidden="true">→</span>
            </button>
        {/each}
    </div>
{:else if !ciudadBuscada}
    <div class="alert alert-secondary mb-0">Ingrese el nombre de una ciudad para buscar.</div>
{:else}
    <div class="alert alert-warning mb-0">No se encontraron resultados.</div>
{/if}
