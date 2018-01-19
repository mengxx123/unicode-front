<template>
    <my-page title="常用特殊符号">
        <ul id="example-1" class="unicode-list">
            <li class="item" ng-model="symbols" v-for="symbol in symbols">
                <span>{{symbol.text}}</span>
                <!--<a class="copy" href="#" v-on:click="copySymbol">复制</a>-->
            </li>
        </ul>
    </my-page>
</template>

<script>
    import symbols from '../data/data.json'
    console.log(symbols)
    export default {
        data () {
            return {
                symbols: symbols.list
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
</style>
