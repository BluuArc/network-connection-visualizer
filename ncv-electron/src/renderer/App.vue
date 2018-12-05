<template>
  <div id="app">
    <v-app dark>
      <!-- <v-navigation-drawer
        fixed
        v-model="drawer"
        app>
        <v-list>
          <v-list-tile 
            router
            :to="item.to"
            :key="i"
            v-for="(item, i) in items"
            exact
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer> -->
      <v-toolbar fixed app>
        <!-- <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon> -->
        <v-toolbar-title v-text="title"></v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid :fill-height="false">
          <v-slide-y-transition mode="out-in">
            <router-view/>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <v-footer app>
        <v-spacer/>
        <span>&copy; 2018</span>
        <v-spacer/>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'ncv-electron',
    data: () => ({
      drawer: false,
      items: [
        { icon: 'bubble_chart', title: 'Visualize', to: '/' },
        { icon: 'apps', title: 'About', to: '/about' },
      ],
      title: 'NCV'
    })
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  /* Global CSS */
</style>
