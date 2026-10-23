<script setup>
// Recibe un objeto "pais" desde App.vue (props)
defineProps({
  pais: { type: Object, required: true },
})
</script>

<template>
  <article class="tarjeta">
    <!-- v-bind (forma corta ":"): enlaza el src y el alt con datos del país -->
    <img class="bandera" :src="pais.bandera" :alt="'Bandera de ' + pais.nombre" loading="lazy" />
    <div class="info">
      <h2>{{ pais.nombre }}</h2>
      <p><strong>Capital:</strong> {{ pais.capital }}</p>
      <p><strong>Región:</strong> {{ pais.region }}</p>
      <p><strong>Población:</strong> {{ pais.poblacion.toLocaleString('es-MX') }}</p>
    </div>
  </article>
</template>
