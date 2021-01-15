<template>
  <v-form ref="blogPostForm" @submit.prevent="publishBlogPost">
    <v-card :loading="loading">
      <v-card-title>
        <h4>Add Blog Post</h4>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="title"
          label="Title"
          :rules="rules.title"
          ref="title"
        />
        <v-textarea v-model="body" label="Body" :rules="rules.title" />
        <v-combobox
          v-model="categories"
          :items="categoriesAutocomplete"
          label="Categories"
          chips
          multiple
          deletable-chips
        />
        <v-combobox
          v-model="tags"
          :items="tagsAutocomplete"
          label="Tags"
          chips
          multiple
          deletable-chips
        />
        <v-text-field
          v-model="slug"
          label="{slug}"
          prefix="/blog/"
          @click="clearTitleWatcher"
          counter="100"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn type="reset" color="secondary lighten-3" @click="draftBlogPost">
          Save Draft
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red" dark @click="discardBlogPost">Discard</v-btn>
        <v-btn type="submit" color="primary">Publish</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="confirm" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Discard this post?
        </v-card-title>

        <v-card-text> </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancelAction">
            {{ actions[0] }}
          </v-btn>
          <v-btn color="primary" text @click="confirmAction">
            {{ actions[1] }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import firebase from "firebase/app";

let titleWatcher = (self, value) => {
  self.slug = encodeURIComponent(
    value.trim().toLowerCase().replace(/\s/gm, "-")
  ).substr(0, 100);
};

export default {
  head: {
    title: "Create Blog Post",
  },

  async asyncData({ app }) {
    if (process.browser) return;
    const db = app.database().ref("v0/meta");
    const _categories = db
      .orderByKey()
      .startAt("category_")
      .endAt("category_\uf8ff");
    const _tags = db.orderByKey().startAt("tag_").endAt("tag_\uf8ff");
    const categoriesRef = await _categories.get();
    const tagRef = await _tags.get();
    let meta_categories = [],
      meta_tags = [];
    if (categoriesRef.exists()) {
      meta_categories = Object.entries(categoriesRef.val()).map(
        ([_id, value]) => ({
          _id,
          ...value,
        })
      );
    }
    if (tagRef.exists()) {
      meta_tags = Object.entries(categoriesRef.val()).map(([_id, value]) => ({
        _id,
        ...value,
      }));
    }
    return { meta_categories, meta_tags };
  },

  data: () => ({
    title: "",
    body: "",
    tags: [],
    images: [],
    slug: "",
    rules: {
      title: [(value) => !!value],
      body: [(value) => !!value],
      slug: [(value) => !!value],
    },
    categories: null,
    loading: false,
    confirm: false,
    actions: ["Cancel", "Discard"],
  }),
  methods: {
    clearTitleWatcher() {
      titleWatcher = () => null;
    },
    publishBlogPost() {
      if (!this.$refs.blogPostForm.validate()) {
        this.$ref.title.scrollIntoView({
          behavior: "smooth",
        });
        return;
      }
      this.loading = true;
      const blog_post = {
        title: this.title,
        body: this.body,
        categories: this.categories || [],
        tags: this.tags || [],
        slug: this.slug,
      };
      this.$axios({ method: "POST", url: "/api", data: blog_post })
        .then(({ data }) => {
          this.$router.push(`/blog/${data._id}`);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    draftBlogPost() {
      //
    },
    discardBlogPost() {
      this.confirm = true;
    },
    confirmAction() {
      this.$router.push("/blog");
      this.confirm = false;
    },
    cancelAction() {
      this.confirm = false;
    },
  },
  watch: {
    title(value) {
      typeof value === "string" && titleWatcher(this, value);
    },
  },
  computed: {
    categoriesAutocomplete() {
      const categories = [].concat(...this.meta_categories);
      return categories.map(({ title }) => title);
    },
    tagsAutocomplete() {
      const tags = [].concat(...this.meta_tags);
      return tags.map(({ title }) => title);
    },
  },
};
</script>

<style>
input[type="text"],
textarea {
  font-family: "Padauk", sans-serif !important;
}
</style>
