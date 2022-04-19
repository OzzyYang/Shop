<template>
	<view>
		<!-- 商品列表 -->
		<view class="goodsListContainer">
			<block v-for="(item,index) in goodsList" :key="index">
				<my-goods-item :goodsItem="item"></my-goods-item>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//请求参数对象
				queryList: {
					//查询关键词
					query: '',
					//商品分类Id
					cid: '',
					//页码值
					pagenum: 1,
					//每页显示多少条数据
					pagesize: 10
				},
				//返回的商品列表和列表大小，后者用于实现分页
				goodsList: [],
				listSize: 0,
				//是否正在请求数据,用于节流，防止短时间内重复请求数据
				isLoading: false

			};
		},
		methods: {
			async getGoodsList(complete) {
				try {
					//节流阀
					this.isLoading = true
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/goods/search', this.queryList)
					if (res.meta.status === 200) {
						this.queryList.pagenum += 1
						console.log("商品列表数据请求成功", res.meta.status, res.message.goods)
						this.goodsList = [...this.goodsList, ...res.message.goods]
						this.listSize = res.message.total
					}
				} catch (e) {
					console.log("商品列表数据请求失败", this.queryList, res, e)
					return uni.$showMsg()
				} finally {
					this.isLoading = false
					// 只要数据请求完毕，就立即按需调用 complete 回调函数
					complete && complete()
				}
			}

		},
		/**
		 * 上拉刷新事件
		 */
		onReachBottom() {
			//判断节流阀的状态
			if (this.isLoading) return
			//判断是否还有下一页数据
			if (this.queryList.pagenum * this.queryList.pagesize > this.listSize) {
				return uni.$showMsg("数据全部加载完毕", 1500, 'none')
			}
			this.getGoodsList()
		},
		onPullDownRefresh() {
			//重置关键数据
			this.queryList.pagenum = 1
			this.listSize = 0
			this.goodsList = []
			this.isLoading = false

			//重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())

		},
		onLoad(options) {
			//获取查询的参数
			this.queryList.query = options.query || ''
			this.queryList.cid = options.cid || ''
			this.getGoodsList()
		}
	}
</script>

<style lang="scss">
	.goodsListContainer {
		display: flex;
		flex-direction: column;
	}
</style>
