<template>
	<view>
		<!-- 搜索框 -->
		<view class="searchBoxContainer">
			<uni-search-bar @input="searchInput" @confirm="searchInputConfirm" radius="15" placeholder="请输入搜索内容"
				bgColor="#f7f7f7" cancelButton="none" :focus="true" :value="searchContent">
			</uni-search-bar>
		</view>
		<!-- 搜索建议栏 -->
		<view class="adviceListContainer" v-if="searchAdvice.length!==0">
			<navigator class="adviceListItem" v-for="(item,index) in searchAdvice" :key="index"
				:url="'../goods_detail/goods_detail?goods_id='+item.goods_id">
				<view class="adviceItemTitle">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</navigator>
		</view>
		<!-- 搜索历史栏 -->
		<view class="historyListContainer" v-else>
			<view class="historyTitle">
				<view>搜索历史</view>
				<uni-icons type="trash-filled" size="20" @click="clearHistory"></uni-icons>
			</view>
			<view class="historyList">
				<button class="historyListItem" v-for="(item,index) in historyListReversed" :key="index" size="mini"
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
				// historyList: [],
				historyList: ['小米', '苹果', '三星'],
				//用户输入间隔的延时器
				inputTimer: null
			};
		},
		computed: {
			//由于数组historyList是引用类型，所以不能直接基于原数组调用 reverse 方法
			//否则会修改原数组中元素的顺序
			historyListReversed() {
				//新建一个内存无关的数组，然后再反转
				return [...this.historyList].reverse()
			}
		},
		methods: {

			/**
			 * 对用户输入并确认的内容进行处理
			 * @param {Object} input 用户输入并确认的内容
			 */
			searchInputConfirm(input) {
				this.searchInput(input.value, true)
			},
			/**
			 * 根据用户输入的内容动态获取对应的搜索建议，防抖时间为500ms
			 * @param {Object} input 用户输入的内容，它是动态变化的
			 * @param {Object} isConfirm 如果是用户自行确认的内容，则不进行防抖
			 */
			searchInput(input, isConfirm) {
				//如果是用户自行确认输入内容，则不进行防抖
				const delay = isConfirm ? 0 : 500
				//清楚延时器
				clearTimeout(this.inputTimer)
				//重新启动一个延时器
				this.inputTimer = setTimeout(() => {
					//如果500毫秒内没有输入触发新的输入事件，则为搜索词赋值
					this.searchContent = input
					this.getSearchAdvice(isConfirm)
				}, delay)
			},
			/**
			 * 根据用户输入的搜索词获取搜索建议列表
			 */
			async getSearchAdvice(isConfirm) {

				//判断有没有输入内容
				if (this.searchContent === "") {
					this.searchAdvice = []
					return
				}
				//根据搜索词请求搜索建议列表
				try {
					console.log("搜索", this.searchContent)
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/goods/qsearch', {
						query: this.searchContent
					})
					if (res.meta.status === 200) {
						this.searchAdvice = res.message
						//保存用户确认并搜索成功的内容
						if (isConfirm) {
							this.saveSearchHistory()
							if (this.searchAdvice.length === 0) {
								uni.$showMsg("未搜索到内容", 2000, "none")
							}
						}
					}
				} catch (e) {
					console.log('搜索建议数据请求失败', e)
					this.saveSearchHistory()
				}
			},
			/**
			 * 根据用户点击的历史词条进行搜索，由于是采用search bar的value值和searchContent绑定来实现
			 * 所以只能在点击后500毫秒才开始进行搜索，这是由于searchInput(input, isConfirm)，同时也需要
			 * 重新调用一次saveSearchHistory()来保存历史词条，可以等系统学了JavaScrip和Vue后再来优化实现
			 * @param {Object} input 用户点击历史词条
			 */
			inputHistory(input) {
				this.searchContent = input
				// 2秒后再保存词条
				setTimeout(() => {
					this.saveSearchHistory()
				}, 3000)

			},
			saveSearchHistory() {
				// 将 Array 数组转化为 Set 对象
				const set = new Set(this.historyList)
				// 调用 Set 对象的 delete 方法，移除对应的元素
				set.delete(this.searchContent)
				// 调用 Set 对象的 add 方法，向 Set 中添加元素
				set.add(this.searchContent)
				// 将 Set 对象转化为 Array 数组
				this.historyList = Array.from(set)
				// 将搜索历史记录持久化存储到本地
				uni.setStorageSync('searchHistory', JSON.stringify(this.historyList))
			},
			clearHistory() {
				// 清空 data 中保存的搜索历史
				this.historyList = []
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('searchHistory', '[]')

			}

		},
		onLoad() {
			//加载历史数据
			this.historyList = JSON.parse(uni.getStorageSync('searchHistory') || '[]')
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
