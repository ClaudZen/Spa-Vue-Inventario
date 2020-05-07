import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Local from "../views/Local.vue";
import Inventario from "../views/Inventario.vue";
import Stock from "../views/Stock.vue";
import Venta from "../views/Venta.vue";
import Categoria from "../views/Categoria.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Local",
    name: "Local",
    component: Local,
  },
  {
    path: "/Inventario",
    name: "Inventario",
    component: Inventario,
  },
  {
    path: "/Stock",
    name: "Stock",
    component: Stock,
  },
  {
    path: "/Venta",
    name: "Venta",
    component: Venta,
  },
  {
    path: "/Categoria",
    name: "Categoria",
    component: Categoria,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
