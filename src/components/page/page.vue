<template>
    <ui-page :title="title || page.title" :page="page" :backable="backable" ref="page" :containerMaxWidth="containerMaxWidth">
        <div slot="drawer">
            <div class="header">
                <img class="logo" src="/static/img/unicode_symbol.svg">
            </div>
            <ui-list @itemClick="toggle()">
                <ui-list-item title="Unicode" to="/">
                    <ui-icon value="home" slot="left" />
                </ui-list-item>
                <ui-list-item title="特殊符号" to="/common">
                    <ui-icon value="remove_red_eye" slot="left" />
                </ui-list-item>
                <ui-list-item title="颜文字" to="/emoticons">
                    <ui-icon value="remove_red_eye" slot="left" />
                </ui-list-item>
                <ui-list-item title="编码解码" to="/coding">
                    <ui-icon value="remove_red_eye" slot="left" />
                </ui-list-item>
                <ui-list-item title="关于" href="https://project.yunser.com/products/e7739c200e8a11e99f2863e9d9681573" target="_blank">
                    <ui-icon value="info" slot="left" />
                </ui-list-item>
            </ui-list>
        </div>
        <slot></slot>
    </ui-page>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: {
            page: {
                type: Object,
                default: function () {
                    return {
                        title: '云设'
                    }
                }
            },
            title: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: '11'
            },
            containerMaxWidth: {
                type: Number,
                default: 1000
            },
            backable: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
        },
        methods: {
            toggle() {
                this.$refs.page.hideDrawerIfMobile()
            }
        }
    }
</script>

<style lang="scss" scoped>
.header {
    padding: 40px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.logo {
    display: block;
    width: 80px;
    margin: 0 auto;
}
.ui-position-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>
