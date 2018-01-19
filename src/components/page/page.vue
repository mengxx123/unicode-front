<template>
    <ui-page :title="title || page.title" :page="page" ref="page" :containerMaxWidth="containerMaxWidth">
        <div slot="drawer">
            <ui-appbar title=""></ui-appbar>
            <ui-list @itemClick="toggle()">
                <ui-list-item title="Unicode" to="/">
                    <ui-icon value="home" slot="left" />
                </ui-list-item>
                <ui-list-item title="常用特殊符号" to="/common">
                    <ui-icon value="remove_red_eye" slot="left" />
                </ui-list-item>
                <ui-list-item title="颜文字" to="/emoticons">
                    <ui-icon value="remove_red_eye" slot="left" />
                </ui-list-item>
                <ui-list-item title="编码解码" to="/coding">
                    <ui-icon value="remove_red_eye" slot="left" />
                </ui-list-item>
                <ui-list-item title="关于" to="/about">
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
</style>
