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

<input type="text" bind:value={ciudad} placeholder="Ingrese el nombre de la ciudad" />
<button onclick={buscarCiudad} disabled={cargando}>{cargando ? "Buscando..." : "Buscar"}</button>

{#if error}
    <p>{error}</p>
{:else if respuestas.length > 0}
    <ul>
        {#each respuestas as respuesta}
            <li>
                <button onclick={() => manejarRespuesta(respuesta)}>
                    {respuesta.name} - {respuesta.country} - Lat: {respuesta.latitude}, Lon: {respuesta.longitude}
                </button>
            </li>
        {/each}
    </ul>
{:else if !ciudadBuscada}
    <p>Ingrese el nombre de una ciudad para buscar.</p>
{:else}
    <p>No se encontraron resultados.</p>
{/if}
