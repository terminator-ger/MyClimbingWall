<template>
  <div id="app">
    <login-popup />
    <f7-views>
      <f7-view main url="/home/" navbar-through :dynamic-navbar="$theme.material" />
    </f7-views>
  </div>
</template>
