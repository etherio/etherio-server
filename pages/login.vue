<template>
  <v-row justify="center" class="mt-8">
    <v-col cols="11" sm="8">
      <v-card max-width="600px" min-width="100%" class="mx-auto">
        <v-stepper v-model="stepper">
          <v-stepper-items>
            <v-form ref="signInForm" @submit.prevent="submitSignInForm">
              <v-stepper-content step="0">
                <v-text-field
                  v-model="credential.email"
                  type="email"
                  label="Email Address"
                  single-line
                  :rules="rules.email"
                  :disabled="loading"
                />
                <v-btn
                  block
                  color="primary"
                  @click="continueSignIn"
                  :loading="loading"
                >
                  Continue
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="1">
                <div class="text-center mt-2 mb-3">
                  <v-chip @click="stepper = 0">{{ credential.email }}</v-chip>
                </div>

                <v-text-field
                  v-model="credential.password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :rules="rules.password"
                  single-line
                />
                <v-btn block color="primary" type="submit">Log In</v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <div class="text-center mt-2 mb-3">
                  <v-chip @click="stepper = 0">{{ credential.email }}</v-chip>
                </div>

                <v-text-field
                  v-model="credential.password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :rules="rules.password"
                  single-line
                />

                <v-btn block color="primary" type="submit">
                  Create new account
                </v-btn>
              </v-stepper-content>
            </v-form>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import firebase from "~/plugins/firebase";

const auth = firebase().auth();

export default {
  data: () => ({
    credential: {
      email: null,
      password: null,
    },
    rules: {
      email: [(input) => !!input],
      password: [(input) => !!input],
    },
    stepper: 0,
    loading: false,
    showPassword: false,
  }),

  methods: {
    continueSignIn() {
      const { email } = this.credential;
      this.loading = true;
      auth
        .fetchSignInMethodsForEmail(email)
        .then((signInMethods) => {
          this.loading = false;
          this.stepper = signInMethods.length ? 1 : 2;
        })
        .catch((err) => {
          this.credential = { email: "", password: "" };
          this.loading = false;
          this.stepper = 0;
        });
    },

    createUserWithEmailAndPassword() {
      if (!this.$refs.signInForm.validate()) return;
      this.loading = true;
      auth
        .createUserWithEmailAndPassword(
          this.credential.email,
          this.credential.password
        )
        .then((user) => {
          this.$root.user = user;
          this.loading = false;
        })
        .catch((err) => {
          this.credential.password = "";
          this.loading = false;
        });
    },

    signInWithEmailAndPassword() {
      if (!this.$refs.signInForm.validate()) return;
      this.loading = true;
      auth
        .signInWithEmailAndPassword(
          this.credential.email,
          this.credential.password
        )
        .then((user) => {
          this.$root.user = user;
          this.loading = false;
        })
        .catch((err) => {
          switch (err.code) {
            case "auth/user-not-found":
              this.credential = { email: "", password: "" };
              this.stepper = 0;
              break;
          }
          this.loading = false;
        });
    },

    submitSignInForm() {
      if (!this.$refs.signInForm.validate()) return;

      switch (this.stepper) {
        case 0:
          return this.continueSignIn();

        case 1:
          return this.signInWithEmailAndPassword();

        case 2:
          return this.createUserWithEmailAndPassword();
      }
    },
  },

  beforeMount() {
    if (auth.currentUser) {
      this.$router.push("/");
    }
  },
};
</script>
