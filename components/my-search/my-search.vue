<template>
	<view>
		<view class="mySearchContainer" :style="{'background-color':customBgcolor}">
			<!-- 模拟Input搜索框 -->
			<view class="mySearchBox" :style="{'border-radius':customRaidus+'px'}" @click="toSearch()">
				<uni-icons type="search"></uni-icons>
				<text class="searchText">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			/*用户自定义属性*/
			//背景颜色
			customBgcolor: {
				type: String,
				default: '#c00000'
			},
			//圆角尺寸
			customRaidus: {
				typer: Number,
				default: 18 //单位是px
			}
		},
		name: "my-search",
		data() {
			return {

			};
		},
		methods:{
			toSearch(){
				uni.navigateTo({
					url:'../../subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.mySearchContainer {
		// background-color: #c00000;
		height: 70upx;
		padding: 0 10upx;
		display: flex;
		align-items: center;
		justify-content: center;

		.mySearchBox {
			height: 50upx;
			background-color: #ffffff;
			// border-radius: 30upx;
			width: 98%;
			display: flex;
			align-items: center;
			justify-content: center;

			.searchText {
				font-size: 25upx;
				margin-left: 10upx;
				color: #babab9;
			}
		}
	}
</style>
