<template>
    <div class="test">
        <p>The counter is set to <b>{{counter}}</b>.</p>
        <button @click="counter += 1">Click +1</button>
        <button @click="counter -= 1">Click -1</button>
        <button @click="counter = initCounter">Reset</button>
    </div>
</template>

<script>
export default {
  name: 'Counter', // vue component name
  data() {
    return {
      counter: 5,
      initCounter: 5
    };
  }
};
</script>

<style lang="postcss" module>
.test {
  display: block;
  width: 400px;
  margin: 25px auto;
  border: 1px solid #ccc;
  background: #eaeaea;
  text-align: center;
  padding: 25px;
  p {
    margin: 0 0 1em;
  }
}
</style>