<script setup>
import { ref, computed, onMounted } from 'vue'
import PaisCard from './components/PaisCard.vue'

//Configuración de la API
const API_URL = 'https://api.restcountries.com/countries/v5'

const API_KEY = 'rc_live_32a68d8373c14a86a511964363f1a383'

//Variables reactivas (ref)
const paises = ref([])        
const cargando = ref(true)   
const error = ref('')       
const detalle = ref('')       
const aviso = ref('')        
const busqueda = ref('')     
const regionElegida = ref('') 

//Normalizar: pasa cada país al formato que usa la interfaz
function desdeV5(p) {
  return {
    codigo: p.codes?.alpha_3 ?? p.uuid,
    nombre: p.names?.common ?? 'Sin nombre',
    bandera: p.flag?.url_png ?? '',
    capital: p.capitals?.[0]?.name ?? 'Sin capital',
    region: p.region || 'Sin región',
    poblacion: p.population ?? 0,
  }
}

//Petición con fetch()
async function pedirPaises() {
  const todos = []
  let offset = 0
  let hayMas = true

  while (hayMas && offset < 1000) {
    const url = `${API_URL}?limit=100&offset=${offset}&api-key=${API_KEY}&pretty=1`
    const respuesta = await fetch(url)
    if (!respuesta.ok) throw new Error('Error HTTP ' + respuesta.status)

    const json = await respuesta.json()
    todos.push(...json.data.objects.map(desdeV5))

    hayMas = json.data.meta?.more === true
    offset += 100
  }
  return todos
}

//onMounted: la primera llamada se hace aquí
onMounted(async () => {
  try {
    paises.value = await pedirPaises()
    if (API_KEY === 'rc_live_demo') {
      aviso.value = 'Estás usando la clave demo: la API solo devuelve un país de ejemplo.'
    }
  } catch (e) {
    console.error(e) 
    error.value = 'No fue posible obtener los datos de la API'
    detalle.value =
      e instanceof TypeError
        ? 'El navegador bloqueó la petición (CORS). Usa tu propia clave y agrega este dominio en restcountries.com/api-keys.'
        : e.message
  } finally {
    cargando.value = false 
  }
})

//Propiedades calculadas
const regiones = computed(() =>
  [...new Set(paises.value.map((p) => p.region))].sort()
)

// Países que cumplen con el texto buscado y la región elegida
const paisesFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()
  return paises.value
    .filter((p) => p.nombre.toLowerCase().includes(texto))
    .filter((p) => !regionElegida.value || p.region === regionElegida.value)
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
})
</script>

<template>
  <main class="contenedor">
    <h1>Explorador de Países</h1>

    <!-- Filtros: v-model enlaza cada campo con su variable -->
    <section class="filtros">
      <input v-model="busqueda" type="search" placeholder="Buscar país por nombre..." />
      <select v-model="regionElegida">
        <option value="">Todas las regiones</option>
        <option v-for="r in regiones" :key="r" :value="r">{{ r }}</option>
      </select>
    </section>

    <p v-if="aviso" class="aviso">{{ aviso }}</p>

    <!-- v-if / v-else-if / v-else: muestra solo UN estado a la vez -->
    <p v-if="cargando" class="estado">Cargando países...</p>
    <p v-else-if="error" class="estado error">{{ error }}</p>
    <p v-else-if="paisesFiltrados.length === 0" class="estado">No se encontraron países.</p>

    <!-- v-for: una tarjeta por cada país -->
    <section v-else class="rejilla">
      <PaisCard v-for="pais in paisesFiltrados" :key="pais.codigo" :pais="pais" />
    </section>

    <p v-if="detalle" class="aviso">{{ detalle }}</p>
  </main>
</template>