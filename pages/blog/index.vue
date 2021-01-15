<template>
  <v-container>
    <v-row>
      <!-- main content -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h4>BLOG</h4>
            <v-spacer></v-spacer>
            <v-btn color="primary" depressed to="/blog/new">
              <v-icon small>mdi-plus</v-icon> Add
            </v-btn>
          </v-card-title>
          <v-card-text>
            ...
          </v-card-text>
        </v-card>
      </v-col>
      <!-- side content -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <h4>Categories</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  hi
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head: {
    title: "Blog",
  },
};
</script>
