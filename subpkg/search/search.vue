<template>
	<view>
		<!-- 搜索框 -->
		<view class="searchBoxContainer">
			<uni-search-bar @input="searchInput" radius="15" placeholder="请输入搜索内容" bgColor="#f7f7f7" cancelButton="none"
				:focus="true" :value="searchContent">
			</uni-search-bar>
		</view>
		<!-- 搜索建议栏 -->
		<view class="adviceListContainer">
			<navigator class="adviceListItem" v-for="(item,index) in searchAdvice" :key="index"
				:url="'../goods_detail/goods_detail?goods_id='+item.goods_id">
				<view class="adviceItemTitle">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</navigator>
		</view>
		<!-- 历史栏 -->
		<view class="historyListContainer">
			<view class="historyTitle">
				<view>搜索历史</view>
				<uni-icons type="trash-filled" size="20"></uni-icons>
			</view>
			<view class="historyList">
				<button class="historyListItem" v-for="(item,index) in historyList" :key="index" size="mini"
					plain="true" @click="inputHistory(item)">
					{{item}}
				</button>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//用户输入的搜索内容和对应的搜索建议列表
				searchContent: "",
				searchAdvice: [],
				historyList: ['小米', '电视机', 'Apple'],
				//用户输入间隔的延时器
				inputTimer: null
			};
		},
		methods: {
			searchInput(input) {
				//清楚延时器
				clearTimeout(this.inputTimer)
				//重新启动一个延时器
				this.inputTimer = setTimeout(() => {
					//如果1秒内没有输入触发新的输入事件，则为搜索词赋值
					this.searchContent = input

					this.getSearchAdvice()
				}, 1000)
			},
			/**
			 * 根据用户输入的搜索词获取搜索建议列表
			 */
			async getSearchAdvice() {
				//判断有没有输入内容
				if (this.searchContent === "") {
					this.searchAdvice = []
					return
				}
				//根据搜索词请求搜索建议列表
				try {
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/goods/qsearch', {
						query: this.searchContent
					})
					console.log(res)
					if (res.meta.status === 200) {
						this.searchAdvice = res.message
						// console.log(res)
					}
				} catch (e) {
					console.log('搜索建议数据请求失败', e)
				}
			},
			inputHistory(input) {
				this.searchContent = input
			}
		}
	}
</script>

<style lang="scss">
	.searchBoxContainer {
		background-color: "#f00000";
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.adviceListContainer {
		padding: 0 10upx;

		.adviceListItem {
			font-size: 24upx;
			padding: 26upx 0;
			border-bottom: 2upx solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.adviceItemTitle {
				//文字不允许换行
				white-space: nowrap;
				//溢出部分隐藏
				overflow: hidden;
				//文本溢出后，用...代替
				text-overflow: ellipsis;
				margin-right: 6upx;
			}
		}
	}

	.historyListContainer {
		.historyTitle {
			padding: 10upx 10upx;
			display: flex;
			justify-content: space-between;
			border: 2upx solid #efefef;
			font-size: 28upx;
		}

		.historyList {
			margin: 15upx;
			display: flex;
			flex-wrap: wrap;

			.historyListItem {
				margin: 10upx;
				//文字不允许换行
				white-space: nowrap;
				//溢出部分隐藏
				overflow: hidden;
				//文本溢出后，用...代替
				text-overflow: ellipsis;
				// background-color: #f3f3f3;
				border-color: #c00000;
				color: #c00000;
			}
		}
	}
</style>
