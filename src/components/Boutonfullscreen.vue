<template>
<button class="fullscreen-btn" @click="toggleFullscreen" title="Plein écran">
  <img src="/public/fullscreenlogo.svg" alt="Fullscreen" width="28" height="28" />
</button>
</template>

<script setup>

function toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    el.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
</script>

<style>
.fullscreen-btn {
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s;
  z-index: 10;
}
.fullscreen-btn:hover {
  background: #ece1c833;
}
.fullscreen-btn img {
  vertical-align: middle;
  filter: drop-shadow(0 2px 8px #fffcf5cc);
}
</style>