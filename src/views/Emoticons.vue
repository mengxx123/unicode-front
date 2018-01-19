<template>
    <my-page title="颜文字">
        <ul id="example-1" class="symbol-list">
            <div>收集了 100+ 颜文字</div>
            <li class="symbol-item" ng-model="symbols" v-for="symbol in symbols">
                <span>{{symbol.text}}</span>
                <!--<a class="copy" href="#" v-on:click="copySymbol">复制</a>-->
            </li>
        </ul>
    </my-page>
</template>

<script>
    import symbols from '../data/emoticons.json'
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
    .symbol-list {
        overflow: hidden;
    }
    .symbol-list .symbol-item {
        display: inline-block;
        float: left;
        width: 320px;
        margin: 0 12px 13px 0;
        background: #FFF;
        text-align: center;
        color: #293232;
        border: 1px solid;
        border-radius: 3px;
        border-color: #E5E6E7 #E1E2E3 #DCDDDE;
        font-size: 24px;
    }
    .symbol-list span {
        line-height: 60px;
        display: block;
        font-size: 24px;
        border-bottom: 1px solid #EAEBEC;
        transition: all .3s;
    }
    .symbol-list .symbol-item:hover {
        box-shadow: 0 0 6px #C1C2C3;
        border: 1px solid #C5C6C7;
        color: #000;
    }
    .symbol-list .symbol-item:hover span {
        /*font-size: 48px;*/
    }
    .symbol-list a {
        line-height: 24px;
        padding-bottom: 1px;
        font-size: 12px;
        display: block;
        color: #BDBEBF;
        cursor: pointer;
    }
</style>
