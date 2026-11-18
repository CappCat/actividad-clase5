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



<BuscadorDeCiudad ciudad={ciudad} manejarRespuesta={manejarRespuesta} /> 
<ClimaActual ciudad={ciudad} latitud={latitud} longitud={longitud} />

