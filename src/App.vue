<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  width: 100vw;
  height: 100vh;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100%;
  height: 100%;

  --white: white;
  --black: black;
  --light-grey: #EBEBEB;
  --grey: #CFCFCF;
  --dark-grey: #646464;
  --green: #8CBC91;
  --gold: #EBD129;
  --silver: #B5B5B5;
  --bronze: #D28410;
}

* {
  box-sizing: border-box;
}
</style>
