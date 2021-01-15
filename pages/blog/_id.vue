<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text v-html="body"></v-card-text>
    </v-card>
  </v-container>
</template>

<script>
const head = {
  title: "Not Found",
  meta: [],
};

export default {
  head,
  async asyncData({ app }) {
    if (process.browser) return;
    const { id } = app.context.route.params;
    const db = app.database().ref("v0/blog_posts");
    const ref = db.child(id);
    const snapshot = await ref.get();
    const data = snapshot.val();
    head.title = data.title;
    head.meta.push({
      name: "title",
      content: data.title,
    });
    head.meta.push({
      hid: "description",
      name: "description",
      content: data.body.replace(/[^\w\d\s]/gm, ""),
    });
    // this.$head.title = data.title
    return data;
  },
};
</script>
