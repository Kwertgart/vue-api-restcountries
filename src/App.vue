<script setup>
import { ref, computed, onMounted } from 'vue'
import PaisCard from './components/PaisCard.vue'

// ---------- Configuración de la API ----------
const API_URL = 'https://api.restcountries.com/countries/v5'
const API_KEY = 'rc_live_demo'
// La clave demo solo regresa 1 país de ejemplo (Canadá), así que para
// llenar la lista también se usa la versión pública de REST Countries.
const API_LISTA = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,cca3'

// ---------- Variables reactivas (ref) ----------
const paises = ref([])      // todos los países obtenidos
const cargando = ref(true)  // true mientras se esperan los datos
const error = ref('')       // mensaje si algo falla
const aviso = ref('')       // mensaje informativo (no es error)
const busqueda = ref('')    // texto del campo de búsqueda (v-model)
const regionElegida = ref('') // región elegida en el select (v-model)

// ---------- Normalizar: cada API usa nombres distintos ----------
// Se convierte cada país a un mismo formato para la interfaz.
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

function desdeV3(p) {
  return {
    codigo: p.cca3,
    nombre: p.name?.common ?? 'Sin nombre',
    bandera: p.flags?.png ?? '',
    capital: p.capital?.[0] ?? 'Sin capital',
    region: p.region || 'Sin región',
    poblacion: p.population ?? 0,
  }
}

// ---------- Peticiones con fetch() ----------
async function pedirPrimerPais() {
  const respuesta = await fetch(`${API_URL}?q=Canada&api-key=${API_KEY}&pretty=1`)
  if (!respuesta.ok) throw new Error('Error HTTP ' + respuesta.status)
  const json = await respuesta.json()
  return json.data.objects.map(desdeV5)
}

async function pedirListaCompleta() {
  const respuesta = await fetch(API_LISTA)
  if (!respuesta.ok) throw new Error('Error HTTP ' + respuesta.status)
  const json = await respuesta.json()
  return json.map(desdeV3)
}

// ---------- onMounted: la primera llamada se hace aquí ----------
onMounted(async () => {
  try {
    // 1) Primera llamada: la API indicada en la actividad
    const lista = await pedirPrimerPais()

    // 2) Completar la lista (si falla, se sigue con lo que ya hay)
    if (lista.length < 10) {
      try {
        const extra = await pedirListaCompleta()
        const porCodigo = new Map(extra.map((p) => [p.codigo, p]))
        lista.forEach((p) => porCodigo.set(p.codigo, p)) // los de la API v5 tienen prioridad
        paises.value = [...porCodigo.values()]
      } catch {
        paises.value = lista
        aviso.value = 'Solo se pudo cargar el país de ejemplo de la API.'
      }
    } else {
      paises.value = lista
    }
  } catch (e) {
    // Manejo de errores (opcional en la actividad)
    error.value = 'No fue posible obtener los datos de la API'
  } finally {
    cargando.value = false // se apaga el indicador de carga
  }
})

// ---------- Propiedades calculadas ----------
// Regiones únicas para llenar el <select>
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
  </main>
</template>
