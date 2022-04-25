<template>
	<view class="myContainer">
		<my-login v-if="token===null || token===''"></my-login>
		<my-user-info v-else></my-user-info>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabBar_badge.js'


	export default {
		mixins: [badgeMix],
		computed: {
			...mapState('m_user', ['token'])
		},
		data() {
			return {

			}
		},
		methods: {

		},
		onLoad() {
		}
	}
</script>

<style>
	/* 微信小程序的每个页面最外层都有一个page节点 */
	page,
	.myContainer {
		height: 100%;
	}
</style>
