<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <template>
        <v-col>
          <v-text-field
            v-model="codigo"
            label="Codigo"
            prepend-icon="mdi-camera-plus"
            @click:prepend="dialogCamera = !dialogCamera"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="$emit('codigo',codigo)">Buscar Producto</v-btn>
        </v-col>
      </template>
    </v-row>
    <v-dialog v-model="dialogCamera" max-width="300">
      <v-card>
        <v-card-title class="headline">scanee codigo de barra</v-card-title>

        <scann-bar-code @text-bar-Code="readCodeBar" :show-dialog="dialogCamera" ref="barcode" />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import ScannBarCode from "@/components/Producto/ScannBarCode";
export default {
  components: { ScannBarCode },
  data: () => {
    return {
      codigo: "",
      dialogCamera: false,
      valid: true,
      lazy: false
    };
  },
  watch: {
    dialogCamera(val) {
      val || this.$refs.barcode.close();
    }
  },
  methods: {
    readCodeBar(text) {
      this.codigo = text;
      this.dialogCamera = false;
    }
  }
};
</script>