<template>
  	<f7-page with-subnavbar>

		<f7-navbar :title="$root.config.title">
			<f7-subnavbar sliding>
				<f7-button big fill raised bg="green" route-tab-link="#searchboulder" href="/searchboulder/">Search Boulder</f7-button>
			</f7-subnavbar>
		</f7-navbar>
  	</f7-page>
</template>

