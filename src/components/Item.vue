<template>
  <div>
    <div>{{ index }} - {{ source.uid }}</div>
  </div>
</template>

<script>
export default {
  name: 'item-component',
  props: {
    index: {
      type: Number,
    },
    source: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss">
</style>
