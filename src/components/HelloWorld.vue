<template>
  <h1>{{ msg }}</h1>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"
      >Vite Documentation</a
    >
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button @click="state.count++">count is: {{ state.count }}</button>
  <button @click="count1++">count1 is: {{ count1 }}</button>
  <button @click="$store.commit('add')">count1 is: {{ $store.state.counter }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script setup>
import { defineProps, reactive, ref } from "vue";
import { userModule } from "api";

userModule.createUser({
  userName: "Exris",
  password: "HExris0818",
}).then((res) => {
  console.log(res);
});

defineProps({
  msg: {
    type: String,
    default: 'Hello World'
  },
});

const state = reactive({ count: 0 });
const count1 = ref(0);
console.log(count1)
</script>

<style scoped>
a {
  color: #42b983;
}
</style>