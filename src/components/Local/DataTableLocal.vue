<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="locales"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hide-default-footer
        sort-by="Nombre"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Locales</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Local</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="3" md="6">
                        <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="9" md="6">
                        <v-text-field v-model="editedItem.direccion" label="Dirección"></v-text-field>
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
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount" @input="pageChange"></v-pagination>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    factorOrden: "FechaCreacion",
    loading: false,
    dialog: false,
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Direccion", value: "direccion" },
      { text: "Fecha Creación", value: "fechaCreacion" },
      { text: "Acciones", value: "acciones", sortable: false }
    ],
    locales: [],
    editedItem: {
      Id: -1,
      Nombre: "",
      Direccion: ""
    },
    defaultItem: {
      Id: -1,
      Nombre: "",
      Direccion: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.Id === -1 ? "Nuevo Local" : "Editar Local";
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
    initialize() {
      this.obtenerLocales(0, this.itemsPerPage, this.factorOrden);
    },

    pageChange() {
      let rowI = 0;
      let rowF = 0;
      if (this.page === 1) {
        rowI = 0;
        rowF = this.itemsPerPage;
      } else {
        var r = this.page * this.itemsPerPage;
        rowI = r - (this.itemsPerPage - 1);
        rowF = r + 1;
      }
      this.obtenerLocales(rowI, rowF, this.factorOrden);
    },

    obtenerLocales(filaInicio, filaFinal, factorOrden) {
      let me = this;
      this.loading = true;
      axios
        .post("/Local/Listar", {
          FilaInicio: filaInicio,
          FilaFinal: filaFinal,
          FactorOrden: factorOrden
        })
        .then(function(response) {
          me.pageCount = Math.ceil(response.data.totalFilas / me.itemsPerPage);
          me.locales = response.data.rows;
        })
        .catch(function(error) {
          console.log(error);
          return [];
        })
        .finally(() => (this.loading = false));
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      confirm("¿Estas seguro de eliminar este Local");
      axios
        .post("/Local/Desactivar", item.id, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => this.pageChange())
        .catch(function(error) {
          console.log(error);
        });
    },

    close() {
      console.log("3");
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      }, 300);
    },

    save() {
      let url = "";
      let me = this;
      console.log(this.editedItem.Id);
      if (this.editedItem.Id === -1) {
        url = "/Local/Crear";
      } else {
        url = "/Local/Editar";
      }
      let model = me.editedItem;
      console.log(model);
      axios
        .post(url, model)
        .then(response => this.pageChange())
        .catch(function(error) {
          console.log(error);
        })
        .finally(() => (this.dialog = false));
    }
  }
};
</script>