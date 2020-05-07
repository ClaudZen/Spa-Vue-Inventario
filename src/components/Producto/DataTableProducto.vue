<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="productos"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hide-default-footer
        sort-by="Nombre"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Productos</v-toolbar-title>
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
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="editedItem.categoria"
                          :items="categorias"
                          @change="categoriaChange"
                          chips
                          label="Categoria"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" v-show="editedItem.categoria!=0">
                        <v-select
                          v-model="editedItem.locales"
                          :items="locales"
                          chips
                          label="Locales"
                          multiple
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="9" md="6">
                        <v-text-field
                          v-model="editedItem.codigo"
                          label="Codigo"
                          prepend-icon="mdi-camera-plus"
                          @click:prepend="dialogCamera = !dialogCamera"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="9" md="6">
                        <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
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
            <v-dialog v-model="dialogCamera" max-width="300">
              <v-card>
                <v-card-title class="headline">scanee codigo de barra</v-card-title>

                <scann-bar-code
                  @text-bar-Code="readCodeBar"
                  :show-dialog="dialogCamera"
                  ref="barcode"
                />
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
import ScannBarCode from "@/components/Producto/ScannBarCode";
export default {
  components: { ScannBarCode },
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    loading: false,
    dialog: false,
    dialogCamera: false,
    headers: [
      { text: "Codigo", value: "codigo" },
      { text: "Nombre", value: "nombre" },
      { text: "Categoria", value: "nombreCategoria" },
      { text: "Acciones", value: "acciones", sortable: false }
    ],
    categorias: [],
    locales: [],
    productos: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      codigo: "",
      nombre: "",
      categoria: 0,
      locales: []
    },
    defaultItem: {
      id: 0,
      codigo: "",
      nombre: "",
      categoria: 0,
      locales: []
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.id === 0 ? "Nuevo Producto" : "Editar Producto";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogCamera(val) {
      val || this.closeDialogCamera();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.loading = true;
      this.obtenerProductos(0, this.itemsPerPage, "Id");
      this.obtenerSelectCategoriasProductos(0);
      this.loading = false;
    },
    readCodeBar(text) {
      this.editedItem.codigo = text;
      this.dialogCamera = false;
    },
    closeDialogCamera() {
      this.$refs.barcode.close();
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
      obtenerProductos(rowI, rowF, "Id");
      this.loading = false;
    },
    categoriaChange() {
      this.obtenerSelectLocalesProductos(this.editedItem.categoria);
    },

    obtenerProductos(filaInicio, filaFinal, factorOrden) {
      let me = this;
      axios
        .post("/Producto/Listar", {
          FilaInicio: filaInicio,
          FilaFinal: filaFinal,
          FactorOrden: factorOrden
        })
        .then(function(response) {
          me.productos = response.data.rows;
          me.pageCount = Math.ceil(response.data.totalFilas / me.itemsPerPage);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    obtenerSelectLocalesProductos(id) {
      let me = this;
      axios
        .get("/Local/MultipleSelectLocalProducto", {
          params: {
            idCategoria: id
          }
        })
        .then(function(response) {
          me.editedItem.locales = response.data
            .filter(x => x.select == true)
            .map(a => a.value);
          me.locales = response.data.map(
            a => new Object({ value: a.value, text: a.text })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    obtenerSelectCategoriasProductos(id) {
      let me = this;
      axios
        .get("/Categoria/SelectCategoriaProducto", {
          params: {
            idProducto: id
          }
        })
        .then(function(response) {
          me.categorias = response.data.map(
            a => new Object({ value: a.value, text: a.text })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedItem.id = item.id;
      this.editedItem.codigo = item.codigo;
      this.editedItem.nombre = item.nombre;
      this.editedItem.categoria = item.idCategoria;
      this.obtenerSelectLocalesProductos(item.idCategoria);
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
        this.obtenerSelectCategoriasProductos(0);
        this.locales = [];
        this.editedItem.locales = [];
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