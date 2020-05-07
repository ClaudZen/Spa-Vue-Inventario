<template>
  <v-container>
    <v-card-text style="height: 100px; position: relative">
      <v-fab-transition>
        <v-btn @click="dialog =!dialog" color="pink" dark absolute top right fab>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-card-text>
    <v-row justify="center">
      <v-dialog v-model="dialog" scrollable max-width="300px">
        <v-card>
          <v-card-title>Selecciona una camara</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px;">
            <v-radio-group v-model="camera" column>
              <v-radio
                v-for="item in cameras"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { BrowserQRCodeReader } from "@zxing/library";
export default {
  data: () => {
    return {
      dialog: false,
      cameras: [],
      camera: {}
    };
  },
  created() {
    this.inicializar();
  },
  methods: {
    inicializar() {
      const codeReader = new BrowserQRCodeReader();
      codeReader
        .listVideoInputDevices()
        .then(videoInputDevices => {
          this.cameras = videoInputDevices.map(
            a => new Object({ value: a.deviceId, text: a.label })
          );
          if (this.cameras.length > 0) {
            this.camera = this.cameras[0].value;
          }
        })
        .catch(err => console.error(err));
    }
  }
};
</script>