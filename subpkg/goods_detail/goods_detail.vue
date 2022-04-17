<template>
	<view>
		商品详情页<br>
		当前的页面参数为：<br>
		cid={{cid}}<br>
		goods_id={{goods_id}}<br>
		query={{query}}<br>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cid: "无",
				goods_id: "无",
				query: "无"
			};
		},
		onLoad(option) {
			console.log(option.cid, option.goods_id, option.query)
			this.cid = option.cid
			this.goods_id = option.goods_id
			this.query = option.query
		}
	}
</script>

<style lang="scss">

</style>
