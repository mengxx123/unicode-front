<template>
    <my-page title="特殊符号">
        <div v-for="group in groups">
            <h2 class="section-title">{{ group.name }}</h2>
            <ul id="example-1" class="unicode-list">
                <li class="item btn"
                    :data-clipboard-text="symbol"
                    v-for="symbol in group.list">
                    <span>{{ symbol }}</span>
                    <!--<a class="copy" href="#" v-on:click="copySymbol">复制</a>-->
                </li>
            </ul>
        </div>
    </my-page>
</template>

<script>
    import groups from '../data/data'
    console.log(groups)
    const ClipboardJS = window.ClipboardJS

    export default {
        data () {
            return {
                groups: groups
            }
        },
        mounted() {
            this.clipboard = new ClipboardJS('.btn')
            this.clipboard.on('success', e => {
                this.$message({
                    type: 'success',
                    text: '复制成功'
                })
                console.info('Action:', e.action)
                console.info('Text:', e.text)
                console.info('Trigger:', e.trigger)
                e.clearSelection()
            })
            this.clipboard.on('error', e => {
                console.error('Action:', e.action)
                console.error('Trigger:', e.trigger)
            })
        },
        destroyed() {
            this.clipboard.destroy()
        }
    }
</script>

<style lang="scss" scoped>
.section-title {
    margin: 16px 0;
    font-size: 16px;
}
</style>
