
<template>
  <video id="video" width="300" height="200" style="border: 1px solid gray"></video>
</template>
<script>
import { BrowserBarcodeReader } from "@zxing/library";
export default {
  props: ["showDialog"],
  data: () => {
    return {
      codeReader: null
    };
  },
  watch: {
    showDialog: function() {
      if (this.showDialog) {
        this.start();
      }
    }
  },
  created() {
    this.start();
  },
  methods: {
    start() {
      let me = this;
      this.codeReader = new BrowserBarcodeReader();
      this.codeReader.decodeFromVideoDevice(
        undefined,
        "video",
        (result, err) => {
          if (result) {
            me.$emit("text-bar-Code", result.text);
          }
        }
      );
    },
    close() {
      this.codeReader.reset();
    }
  }
};
</script>