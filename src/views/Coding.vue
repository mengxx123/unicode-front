<template>
    <my-page title="Unicode 转换">
        <div id="input-box" class="row">
            <div class="col-lg-6 col-sm-6">
                <section class="input-box">
                    <div class="tip"><h1></h1></div>
                    <ui-text-field v-model="text" hintText="输入要转换的内容" multiLine :rows="4" :rowsMax="4"/>
                    <div class="btns">
                        <ui-raised-button class="btn" primary label="文字转 Unicode" @click="encoder"/>
                        <ui-raised-button class="btn" secondary label="Unicode 转文字" @click="decode"/>
                        <ui-raised-button class="btn" label="重新输入" @click="clear"/>
                    </div>
                    <ui-text-field v-model="result" multiLine :rows="4" :rowsMax="4" v-if="result"/>
                </section>
            </div>
        </div>
    </my-page>
</template>

<script>
    function encoder(text) {
        let result = ''
        for (let i = 0; i < text.length; i++) {
            result += '\\u' + text.charCodeAt(i).toString(16)
        }
        return result
    }

    function decode(text) {
        let jsonstr = '{"ustr": "' + text + '"}'
        let obj = JSON.parse(jsonstr)
        return obj.ustr
    }

    export default {
        data () {
            return {
                text: '这是栗子',
                result: ''
            }
        },
        mounted() {
        },
        methods: {
            encoder: function () {
                this.result = encoder(this.text)
            },
            decode: function () {
                this.result = decode(this.text)
            },
            clear: function () {
                this.text = ''
                this.result = ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btns {
        margin-bottom: 16px;
        color: #999;
        .btn {
            margin-right: 8px;
        }
    }
</style>
