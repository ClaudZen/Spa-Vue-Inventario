<template>
  <v-container fluid>
    <data-table-producto />
    <select-camera />
  </v-container>
</template>
<script>
import DataTableProducto from "@/components/Producto/DataTableProducto";
import SelectCamera from "@/components/Producto/SelectCamera";
export default {
  name: "Producto",
  components: { DataTableProducto, SelectCamera }
};
</script>