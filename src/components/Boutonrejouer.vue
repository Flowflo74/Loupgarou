<template>
  <button class="btn-rejouer" @click="rejouer">Rejouer</button>
</template>

<script setup>
const emit = defineEmits(["rejouer"]);
function rejouer() {
  emit("rejouer");
}
</script>

<style scoped>
.btn-rejouer {
  background: linear-gradient(90deg, #ffae00, #ffec70 100%);
  color: #23243a;
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  padding: 0.7rem 2.2rem;
  margin: 2rem auto 0 auto;
  display: block;
  cursor: pointer;
  box-shadow: 0 2px 8px #000a;
  transition: background 0.2s, transform 0.2s;
}
.btn-rejouer:hover {
  background: linear-gradient(90deg, #ffec70 0%, #ffae00 100%);
  transform: scale(1.08);
}
</style>