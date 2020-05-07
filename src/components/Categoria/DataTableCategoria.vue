<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="categorias"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hide-default-footer
        sort-by="Nombre"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Categorias</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nueva Categoria</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="editedItem.selectLocales.selects"
                          :items="editedItem.selectLocales.items"
                          chips
                          label="Locales asignados"
                          multiple
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="3" md="6">
                        <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="9" md="6">
                        <v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
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
    loading: false,
    dialog: false,
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Acciones", value: "acciones", sortable: false }
    ],
    categorias: [],
    editedItem: {
      id: 0,
      nombre: "",
      descripcion: "",
      selectLocales: {
        selects: [],
        items: []
      }
    },
    defaultItem: {
      id: 0,
      nombre: "",
      descripcion: "",
      selectLocales: {
        selects: [],
        items: []
      }
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.id === 0 ? "Nuevo categoria" : "Editar categoria";
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
      this.loading = true;
      this.obtenerCategorias(0, this.itemsPerPage, "Id");
      this.loading = false;
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
      this.loading = true;
      this.locales = obtenerCategorias(rowI, rowF, "Id");
      this.loading = false;
    },

    obtenerCategorias(filaInicio, filaFinal, factorOrden) {
      let me = this;
      axios
        .post("/Categoria/Listar", {
          FilaInicio: filaInicio,
          FilaFinal: filaFinal,
          FactorOrden: factorOrden
        })
        .then(function(response) {
          me.categorias = response.data.rows;
          me.pageCount = Math.ceil(response.data.totalFilas / me.itemsPerPage);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    obtenerSelectLocalesCategorias(id) {
      let me = this;
      axios
        .get("/Local/MultipleSelectLocalCategoria", {
          params: {
            idCategoria: id
          }
        })
        .then(function(response) {
          console.log(me);
          me.editedItem.selectLocales.selects = response.data
            .filter(x => x.select == true)
            .map(a => a.value);
          me.editedItem.selectLocales.items = response.data.map(
            a => new Object({ value: a.value, text: a.text })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedItem.id = item.id;
      this.editedItem.nombre = item.nombre;
      this.editedItem.descripcion = item.descripcion;
      this.obtenerSelectLocalesCategorias(item.id);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.locales.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.locales.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.obtenerSelectLocalesCategorias(0);
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.locales[this.editedIndex], this.editedItem);
      } else {
        this.locales.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>