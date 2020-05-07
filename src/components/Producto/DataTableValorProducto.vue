<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="valores"
        :loading="loading"
        hide-default-footer
        sort-by="Nombre"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>valores</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nueva Producto</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="9" md="6">
                        <v-text-field v-model="editedItem.stock" label="Stock"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="9" md="6">
                        <v-text-field v-model="editedItem.precioCosto" label="Precio costo"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="9" md="6">
                        <v-text-field v-model="editedItem.precioVenta" label="Precio venta"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.acciones="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    loading: false,
    dialog: false,
    headers: [
      { text: "Local", value: "nombreLocal" },
      { text: "Stock", value: "stock" },
      { text: "Costo", value: "precioCosto" },
      { text: "Precio", value: "precioVenta" },
      { text: "Acciones", value: "acciones", sortable: false }
    ],
    valores: [],
    editedIndex: -1,
    editedItem: {
      idLocalCategoria: 0,
      idProducto: 0,
      stock: 0,
      precioCosto: 0,
      precioVenta: 0
    },
    defaultItem: {
      idLocalCategoria: 0,
      idProducto: 0,
      stock: 0,
      precioCosto: 0,
      precioVenta: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.id === 0 ? "Nuevo Producto" : "Editar Valores";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {},

    obtenerValoresProducto(codigoProducto) {
      let me = this;
      axios
        .get("/Producto/ListarValores", {
          params: {
            codigoProducto: codigoProducto
          }
        })
        .then(function(response) {
          console.log(response);
          me.valores = response.data.rows;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedItem = Object.assign({}, this.item);
      this.dialog = true;
    },

    deleteItem(item) {
      //   const index = this.locales.indexOf(item);
      //   confirm("Are you sure you want to delete this item?") &&
      //     this.locales.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      }, 300);
    },

    save() {
      //   if (this.editedIndex > -1) {
      //     Object.assign(this.locales[this.editedIndex], this.editedItem);
      //   } else {
      //     this.locales.push(this.editedItem);
      //   }
      this.close();
    }
  }
};
</script>