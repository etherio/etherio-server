<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt></nuxt>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "mdi-home",
          title: "Homepage",
          to: "/",
        },
        {
          icon: "mdi-account",
          title: "Login",
          to: "/login",
        },
      ],
      drawer: false,
      title: "Vuetify.js",
    };
  },
};
</script>
