<template>
  <v-container>
    <filtro-valor-producto @codigo="readCodigo" />
    <data-table-valor-producto ref="tableValorProducto" />
  </v-container>
</template>
<script>
// @ is an alias to /src
import FiltroValorProducto from "@/components/Producto/FiltroValorProducto.vue";
import DataTableValorProducto from "@/components/Producto/DataTableValorProducto.vue";
export default {
  name: "Local",
  components: {
    FiltroValorProducto,
    DataTableValorProducto
  },
  methods: {
    readCodigo(text) {
      console.log(text);
      this.$refs.tableValorProducto.obtenerValoresProducto(text);
    }
  }
};
</script>