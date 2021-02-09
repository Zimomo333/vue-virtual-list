<template>
  <div class="v_scroll_list">
    <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
        <!-- <van-list
          v-if="loading || refreshing || itemList.length !== 0"
          v-model="loading"
          loading-text="加载中..."
          :finished="finished"
          finished-text="没有更多了~"
        > -->
          <!-- 考虑到通用化，使用了index作为key，请避免列表增删操作 -->
          <!-- <component
            :is="itemComponent"
            v-for="(item,itemIndex) in itemList"
            :key="itemIndex"
            :item="item"
          /> -->
          <virtual-list
            v-if="loading || refreshing || itemList.length !== 0"
            :style="{height: listHeight + 'px', 'overflow': 'auto'}"
            :data-key="'uid'"
            :data-sources="itemList"
            :data-component="itemComponent"
            :keeps="30"
            @tobottom="getItemList"
          />
        <!-- </van-list> -->
        <div class="empty_list" v-else>
          <img class="empty_icon" :src="emptyTips.icon" />
          <p class="empty_tip">{{ emptyTips.text }}</p>
        </div>
        <div class="tips">
          <span v-if="loading">加载中...</span>
          <span v-if="finished">没有更多了~</span>
        </div>
    <!-- </van-pull-refresh> -->
  </div>
</template>

<script>
// import { PullRefresh } from 'vant';
import VirtualList from 'vue-virtual-scroll-list';
import axios from 'axios';

export default {
  name: 'scroll-list',
  props: {
    // 请求url、首页码、步长
    queryParam: {
      type: Object,
      required: true,
    },
    // 自定义参数
    otherParam: Object,
    // 自定义子组件
    itemComponent: {
      type: Object,
      required: true,
    },
    // 列表高度
    listHeight: Number,
    // 暂无数据文案
    emptyTips: {
      type: Object,
      default() {
        return {
          icon: require('@/assets/images/empty-list.png'),
          text: '暂无数据',
        };
      },
    },
  },
  components: {
    // VanList: List,
    // VanPullRefresh: PullRefresh,
    'virtual-list': VirtualList,
  },
  data() {
    return {
      pageSize: '',
      pageNo: '',
      loading: true,
      finished: false,
      refreshing: false,
      itemList: [],
    };
  },
  created() {
    (this.pageNo = this.queryParam.pageNo), (this.pageSize = this.queryParam.pageSize), this.getItemList();
  },
  methods: {
    getItemList() {
      this.loading = true;
      axios({
        url: this.queryParam.fetchUrl,
        method: 'GET',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          ...this.otherParam,
        },
      })
        .then(res => {
          if (res.data.length < this.pageSize) {
            this.finished = true;
          }
          if (this.refreshing) {
            this.refreshing = false;
          }
          this.itemList.push(...res.data);
          this.loading = false;
          this.pageNo++;
        })
        .catch(err => {
          console.error('[getItemList]', err);
          this.loading = false;
          this.refreshing = false;
        });
    },

    onRefresh() {
      this.pageNo = this.queryParam.pageNo;
      this.itemList = [];
      this.finished = false;
      this.loading = true;
      this.getItemList();
    },
  },
};
</script>

<style lang="scss">
@import '../assets/scss/mixin.scss';

.v_scroll_list {
  .empty_list {
    padding: px2rem(80px) 0;
    text-align: center;
    .empty_icon {
      @include setWH(350px, 350px);
    }
    .empty_tip {
      font-size: px2rem(65px);
      color: #333;
    }
  }
  .tips {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>
