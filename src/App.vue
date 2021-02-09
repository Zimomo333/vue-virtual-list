<template>
  <div id="app">
    <scroll-list
      :query-param="queryParam"
      :other-param="otherParam"
      :item-component="itemComponent"
      :list-height="listHeight"
      :empty-tips="emptyTips"
    />
  </div>
</template>

<script>
import ScrollList from './components/ScrollList';
import Item from './components/Item';
import util from './util/util';

export default {
  name: 'App',
  components: {
    ScrollList,
  },
  data() {
    return {
      queryParam: {
        fetchUrl: 'http://zimomo333.com:3021/getItems',
        pageNo: 1,
        pageSize: 60,
      },
      itemComponent: Item,
      listHeight: 0,
      emptyTips: {
        icon: require('@/assets/images/empty-list.png'),
        text: '暂无数据',
      },
      otherParam: {
        other: 'other',
      },
    };
  },
  mounted () {
    this.listHeight = util.calcScrollHeight(
      ['body'],
      [],
      {}
    )
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html {
  height: 100%;
}
</style>
