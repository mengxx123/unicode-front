<template>
    <my-page title="Unicode 查询" :page="_page">
        <section class="search-box">
            <h2 class=title>特殊符号搜索（找符号、求出处、搜相似）</h2>
            <ui-text-field v-model="keyword" hintText="输入一个字符或四位编号"/>
            <br>
            <div class="btns">
                <ui-raised-button class="btn" primary label="搜索" @click="search"/>
                <ui-raised-button class="btn" secondary label="查看字符块" @click="toggleBlock"/>
            </div>
        </section>

        <!-- <h3 class="all-text">在这里可以找到所有国家的文字：</h3>
        <ui-select-field v-model="block" :maxHeight="300">
            <ui-menu-item value="" title="无"/>
            <ui-menu-item :value="block.range" :title="block.title" v-for="block in getBlocks()" :key="block"/>
        </ui-select-field> -->
      
        <ui-drawer class="data-box" right :open="list.length" @close="toggle()">
            <ui-appbar :title="title">
                <ui-icon-button icon="close" slot="left" @click="toggle" />
            </ui-appbar>
            <div class="body">
                <ul class="unicode-list" v-if="list">
                    <li class="item" v-for="item in list" title="" @click="viewUnicode(item)">
                        <span>{{ item }}</span>
                    </li>
                </ul>
                <div v-if="page < totalPage">
                    <ui-raised-button label="加载更多" @click="loadMore" />
                </div>
                {{ page }} / {{ totalPage }}
            </div>
        </ui-drawer>
        <ui-drawer class="result-box" right :open="resultVisible" @close="toggleResult()">
            <ui-appbar title="详情">
                <ui-icon-button icon="close" slot="left" @click="toggleResult" />
            </ui-appbar>
            <div class="body">
                <div class="unicode-card" v-if="searchResult">
                    <div class="text">{{ searchResult.text }}</div>
                    <div class="info">Unicode编号：<code>{{ searchResult.unicode }}</code></div>
                    <div class="info">HTML代码：<code>{{ searchResult.html }}</code></div>
                    <div class="info">Block：<a href="" @click="codelist($event, searchResult.range, searchResult.title)">{{ searchResult.block }}</a> </div>
                </div>
            </div>
        </ui-drawer>
        <ui-drawer class="block-box" right :open="blockVisible" @close="toggleBlock()">
            <ui-appbar title="字符块">
                <ui-icon-button icon="close" slot="left" @click="toggleBlock" />
            </ui-appbar>
            <div class="body">
                <ui-list>
                    <ui-list-item
                        :value="block.range"
                        :title="block.title"
                        v-for="block in getBlocks()"
                        @click="setBlock(block.range)"
                        :key="block"/>
                </ui-list>
            </div>
        </ui-drawer>
    </my-page>
</template>

<script>
    function decode(text) {
        let jsonstr = '{"ustr": "' + text + '"}'
        let obj = JSON.parse(jsonstr)
        return obj.ustr
    }

    function padding0(text) {
        if (text.length === 2) {
            text = '00' + text
        } else if (text.length === 3) {
            text = '0' + text
        }
        return text
    }

    let blocks = [
//        {title: '控制字符', range: '0000—001F'}, // 控制字符无法显示
        {title: '基本拉丁字母', range: '0020—007F'},
        {title: '拉丁文补充1', range: '0080—00FF'},
        {title: '拉丁文扩展A', range: '0100—017F'},
        {title: '拉丁文扩展B', range: '0180—024F'},
        {title: '国际音标扩展', range: '0250—02AF'},
        {title: '占位修饰符号', range: '02B0—02FF'},
        {title: '结合附加符号', range: '0300—036F'},
        {title: '希腊字母及科普特字母', range: '0370—03FF'},
        {title: '西里尔字母', range: '0400—04FF'},
        {title: '西里尔字母补充', range: '0500—052F'},
        {title: '亚美尼亚字母', range: '0530—058F'},
        {title: '希伯来文', range: '0590—05FF'},
        {title: '阿拉伯文', range: '0600—06FF'},
        {title: '叙利亚文', range: '0700—074F'},
        {title: '阿拉伯文补充', range: '0750—077F'},
        {title: '它拿字母', range: '0780—07BF'},
        {title: '西非书面语言', range: '07C0—07FF'},
        {title: '撒玛利亚字母', range: '0800—083F'},
        {title: 'andaic', range: '0840—085FM'},
        {title: '阿拉伯语扩展', range: '08A0—08FF'},
        {title: '天城文', range: '0900—097F'},
        {title: '孟加拉文', range: '0980—09FF'},
        {title: '果鲁穆奇字母', range: '0A00—0A7F'},
        {title: '古吉拉特文', range: '0A80—0AFF'},
        {title: '奥里亚文', range: '0B00—0B7F'},
        {title: '泰米尔文', range: '0B80—0BFF'},
        {title: '泰卢固文', range: '0C00—0C7F'},
        {title: '卡纳达文', range: '0C80—0CFF'},
        {title: '马拉雅拉姆文', range: '0D00—0D7F'},
        {title: '僧伽罗文', range: '0D80—0DFF'},
        {title: '泰文', range: '0E00—0E7F'},
        {title: '老挝文', range: '0E80—0EFF'},
        {title: '藏文', range: '0F00—0FFF'},
        {title: '缅甸文', range: '1000—109F'},
        {title: '格鲁吉亚字母', range: '10A0—10FF'},
        {title: '谚文字母', range: '1100—11FF'},
        {title: '埃塞俄比亚语', range: '1200—137F'},
        {title: '埃塞俄比亚语补充', range: '1380—139F'},
        {title: '切罗基字母', range: '13A0—13FF'},
        {title: '统一加拿大原住民音节文字', range: '1400—167F'},
        {title: '欧甘字母', range: '1680—169F'},
        {title: '卢恩字母', range: '16A0—16FF'},
        {title: '他加禄字母', range: '1700—171F'},
        {title: '哈努诺文', range: '1720—173F'},
        {title: '布迪文', range: '1740—175F'},
        {title: '塔格巴努亚文', range: '1760—177F'},
        {title: '高棉文', range: '1780—17FF'},
        {title: '蒙古文', range: '1800—18AF'},
        {title: '统一加拿大原住民音节文字扩展', range: '18B0—18FF'},
        {title: '林布文', range: '1900—194F'},
        {title: '德宏傣文', range: '1950—197F'},
        {title: '新傣仂文', range: '1980—19DF'},
        {title: '高棉文符号', range: '19E0—19FF'},
        {title: '布吉文', range: '1A00—1A1F'},
        {title: '老傣文', range: '1A20—1AAF'},
//        {title: 'ombining Diacritical Marks Extended', range: '1AB0—1AFFC'},
        {title: '巴厘字母', range: '1B00—1B7F'},
        {title: '巽他字母', range: '1B80—1BBF'},
        {title: '巴塔克文', range: '1BC0—1BFF'},
        {title: '雷布查字母', range: '1C00—1C4F'},
        {title: 'l-Chiki', range: '1C50—1C7FO'},
//        {title: 'yrillic Extended C', range: '1C80—1C87C'},
        {title: '巽他字母补充', range: '1CC0—1CCF'},
        {title: '吠陀梵文', range: '1CD0—1CFF'},
        {title: '语音学扩展', range: '1D00—1D7F'},
        {title: '语音学扩展补充', range: '1D80—1DBF'},
        {title: '结合附加符号补充', range: '1DC0—1DFF'},
        {title: '拉丁文扩展附加', range: '1E00—1EFF'},
        {title: '希腊语扩展', range: '1F00—1FFF'},
        {title: '常用标点', range: '2000—206F'},
        {title: '上标及下标', range: '2070—209F'},
        {title: '货币符号', range: '20A0—20CF'},
        {title: '组合用记号', range: '20D0—20FF'},
        {title: '字母式符号', range: '2100—214F'},
        {title: '数字形式', range: '2150—218F'},
        {title: '箭头', range: '2190—21FF'},
        {title: '数学运算符', range: '2200—22FF'},
        {title: '杂项工业符号', range: '2300—23FF'},
        {title: '控制图片', range: '2400—243F'},
        {title: '光学识别符', range: '2440—245F'},
        {title: '带圈或括号的字母数字', range: '2460—24FF'},
        {title: '制表符', range: '2500—257F'},
        {title: '方块元素', range: '2580—259F'},
        {title: '几何图形', range: '25A0—25FF'},
        {title: '杂项符号', range: '2600—26FF'},
        {title: '印刷符号', range: '2700—27BF'},
        {title: '杂项数学符号A', range: '27C0—27EF'},
        {title: '追加箭头A', range: '27F0—27FF'},
        {title: '盲文点字模型', range: '2800—28FF'},
        {title: '追加箭头B', range: '2900—297F'},
        {title: '杂项数学符号B', range: '2980—29FF'},
        {title: '追加数学运算符', range: '2A00—2AFF'},
        {title: '杂项符号和箭头', range: '2B00—2BFF'},
        {title: '格拉哥里字母', range: '2C00—2C5F'},
        {title: '拉丁文扩展C', range: '2C60—2C7F'},
        {title: '科普特字母', range: '2C80—2CFF'},
        {title: '格鲁吉亚字母补充', range: '2D00—2D2F'},
        {title: '提非纳文', range: '2D30—2D7F'},
        {title: '埃塞俄比亚语扩展', range: '2D80—2DDF'},
        {title: '西里尔字母扩展', range: '2DE0—2DFF'},
        {title: '追加标点', range: '2E00—2E7F'},
        {title: '中日韩部首补充', range: '2E80—2EFF'},
        {title: '康熙部首', range: '2F00—2FDF'},
        {title: '表意文字描述符', range: '2FF0—2FFF'},
        {title: '中日韩符号和标点', range: '3000—303F'},
        {title: '日文平假名', range: '3040—309F'},
        {title: '日文片假名', range: '30A0—30FF'},
        {title: '注音字母', range: '3100—312F'},
        {title: '谚文兼容字母', range: '3130—318F'},
        {title: '象形字注释标志', range: '3190—319F'},
        {title: '注音字母扩展', range: '31A0—31BF'},
        {title: '中日韩笔画', range: '31C0—31EF'},
        {title: '日文片假名语音扩展', range: '31F0—31FF'},
        {title: '带圈中日韩字母和月份', range: '3200—32FF'},
        {title: '中日韩字符集兼容', range: '3300—33FF'},
        {title: '中日韩统一表意文字扩展A', range: '3400—4DBF'},
        {title: '易经六十四卦符号', range: '4DC0—4DFF'},
        {title: '中日韩统一表意文字', range: '4E00—9FFF'},
        {title: '彝文音节', range: 'A000—A48F'},
        {title: '彝文字根', range: 'A490—A4CF'},
        {title: 'isu', range: 'A4D0—A4FFL'},
        {title: '老傈僳文', range: 'A500—A63F'},
        {title: '西里尔字母扩展B', range: 'A640—A69F'},
        {title: '巴姆穆语', range: 'A6A0—A6FF'},
        {title: '声调修饰字母', range: 'A700—A71F'},
        {title: '拉丁文扩展D', range: 'A720—A7FF'},
        {title: '锡尔赫特文', range: 'A800—A82F'},
        {title: '印第安数字', range: 'A830—A83F'},
        {title: '八思巴文', range: 'A840—A87F'},
        {title: '索拉什特拉', range: 'A880—A8DF'},
        {title: '天城文扩展', range: 'A8E0—A8FF'},
        {title: '克耶字母', range: 'A900—A92F'},
        {title: '勒姜语', range: 'A930—A95F'},
        {title: '谚文字母扩展A', range: 'A960—A97F'},
        {title: '爪哇语', range: 'A980—A9DF'},
        {title: 'yanmar Extended-B', range: 'A9E0—A9FFM'},
        {title: '鞑靼文', range: 'AA00—AA5F'},
        {title: '缅甸语扩展', range: 'AA60—AA7F'},
        {title: '越南傣文', range: 'AA80—AADF'},
        {title: '曼尼普尔文扩展', range: 'AAE0—AAFF'},
        {title: '埃塞俄比亚文', range: 'AB00—AB2F'},
        {title: 'atin Extended-E', range: 'AB30—AB6FL'},
        {title: 'herokee Supplement', range: 'AB70—ABBFC'},
        {title: '曼尼普尔文', range: 'ABC0—ABFF'},
        {title: '谚文音节', range: 'AC00—D7AF'},
        {title: 'angul Jamo Extended-B', range: 'D7B0—D7FFH'},
        {title: '代理对高位字', range: 'D800—DB7F'},
        {title: '代理对私用区高位字', range: 'DB80—DBFF'},
        {title: '代理对低位字', range: 'DC00—DFFF'},
        {title: '私用区', range: 'E000—F8FF'},
        {title: '中日韩兼容表意文字', range: 'F900—FAFF'},
        {title: '字母表达形式（拉丁字母连字、亚美尼亚字母连字、希伯来文表现形式）', range: 'FB00—FB4F'},
        {title: '阿拉伯文表达形式A', range: 'FB50—FDFF'},
        {title: '异体字选择符', range: 'FE00—FE0F'},
        {title: '竖排形式', range: 'FE10—FE1F'},
        {title: '组合用半符号', range: 'FE20—FE2F'},
        {title: '中日韩兼容形式', range: 'FE30—FE4F'},
        {title: '小写变体形式', range: 'FE50—FE6F'},
        {title: '阿拉伯文表达形式B', range: 'FE70—FEFF'},
        {title: '半角及全角形式', range: 'FF00—FFEF'},
        {title: '特殊', range: 'FFF0—FFFF'},
        {title: 'Linear B Syllabary', range: '10000—1007F'},
        {title: 'Linear B Ideograms', range: '10080—100FF'},
        {title: 'Aegean Numbers', range: '10100—1013F'},
        {title: 'Ancient Greek Numbers', range: '10140—1018F'},
        {title: 'Ancient Symbols', range: '10190—101CF'},
        {title: 'Phaistos Disc', range: '101D0—101FF'},
        {title: 'Lycian', range: '10280—1029F'},
        {title: 'Carian', range: '102A0—102DF'},
        {title: 'Coptic Epact Numbers', range: '102E0—102FF'},
        {title: 'Old Italic', range: '10300—1032F'},
        {title: 'Gothic', range: '10330—1034F'},
        {title: 'Old Permic', range: '10350—1037F'},
        {title: 'Ugaritic', range: '10380—1039F'},
        {title: 'Old Persian', range: '103A0—103DF'},
        {title: 'Deseret', range: '10400—1044F'},
        {title: 'Shavian', range: '10450—1047F'},
        {title: 'Osmanya', range: '10480—104AF'},
        {title: 'Osage', range: '104B0—104FF'},
        {title: 'Elbasan', range: '10500—1052F'},
        {title: 'Caucasian Albanian', range: '10530—1056F'},
        {title: 'Linear A', range: '10600—1077F'},
        {title: 'Cypriot Syllabary', range: '10800—1083F'},
        {title: 'Imperial Aramaic', range: '10840—1085F'},
        {title: 'Palmyrene', range: '10860—1087F'},
        {title: 'Nabataean', range: '10880—108AF'},
        {title: 'Hatran', range: '108E0—108FF'},
        {title: 'Phoenician', range: '10900—1091F'},
        {title: 'Lydian', range: '10920—1093F'},
        {title: 'Meroitic Hieroglyphs', range: '10980—1099F'},
        {title: 'Meroitic Cursive', range: '109A0—109FF'},
        {title: 'Kharoshthi', range: '10A00—10A5F'},
        {title: 'Old South Arabian', range: '10A60—10A7F'},
        {title: 'Old North Arabian', range: '10A80—10A9F'},
        {title: 'Manichaean', range: '10AC0—10AFF'},
        {title: 'Avestan', range: '10B00—10B3F'},
        {title: 'Inscriptional Parthian', range: '10B40—10B5F'},
        {title: 'Inscriptional Pahlavi', range: '10B60—10B7F'},
        {title: 'Psalter Pahlavi', range: '10B80—10BAF'},
        {title: 'Old Turkic', range: '10C00—10C4F'},
        {title: 'Old Hungarian', range: '10C80—10CFF'},
        {title: 'Rumi Numeral Symbols', range: '10E60—10E7F'},
        {title: 'Brahmi', range: '11000—1107F'},
        {title: 'Kaithi', range: '11080—110CF'},
        {title: 'Sora Sompeng', range: '110D0—110FF'},
        {title: 'Chakma', range: '11100—1114F'},
        {title: 'Mahajani', range: '11150—1117F'},
        {title: 'Sharada', range: '11180—111DF'},
        {title: 'Sinhala Archaic Numbers', range: '111E0—111FF'},
        {title: 'Khojki', range: '11200—1124F'},
        {title: 'Multani', range: '11280—112AF'},
        {title: 'Khudawadi', range: '112B0—112FF'},
        {title: 'Grantha', range: '11300—1137F'},
        {title: 'Newa', range: '11400—1147F'},
        {title: 'Tirhuta', range: '11480—114DF'},
        {title: 'Siddham', range: '11580—115FF'},
        {title: 'Modi', range: '11600—1165F'},
        {title: 'Mongolian Supplement', range: '11660—1167F'},
        {title: 'Takri', range: '11680—116CF'},
        {title: 'Ahom', range: '11700—1173F'},
        {title: 'Warang Citi', range: '118A0—118FF'},
        {title: 'Pau Cin Hau', range: '11AC0—11AFF'},
        {title: 'Bhaiksuki', range: '11C00—11C6F'},
        {title: 'Marchen', range: '11C70—11CBF'},
        {title: 'Cuneiform', range: '12000—123FF'},
        {title: 'Cuneiform Numbers and Punctuation', range: '12400—1247F'},
        {title: 'Early Dynastic Cuneiform', range: '12480—1254F'},
        {title: 'Egyptian Hieroglyphs', range: '13000—1342F'},
        {title: 'Anatolian Hieroglyphs', range: '14400—1467F'},
        {title: 'Bamum Supplement', range: '16800—16A3F'},
        {title: 'Mro', range: '16A40—16A6F'},
        {title: 'Bassa Vah', range: '16AD0—16AFF'},
        {title: 'Pahawh Hmong', range: '16B00—16B8F'},
        {title: 'Miao', range: '16F00—16F9F'},
        {title: 'Ideographic Symbols and Punctuation', range: '16FE0—16FFF'},
        {title: 'Tangut', range: '17000—187FF'},
        {title: 'Tangut Components', range: '18800—18AFF'},
        {title: 'Kana Supplement', range: '1B000—1B0FF'},
        {title: 'Duployan', range: '1BC00—1BC9F'},
        {title: 'Shorthand Format Controls', range: '1BCA0—1BCAF'},
        {title: 'Byzantine Musical Symbols', range: '1D000—1D0FF'},
        {title: 'Musical Symbols', range: '1D100—1D1FF'},
        {title: 'Ancient Greek Musical Notation', range: '1D200—1D24F'},
        {title: 'Tai Xuan Jing Symbols', range: '1D300—1D35F'},
        {title: 'Counting Rod Numerals', range: '1D360—1D37F'},
        {title: 'Mathematical Alphanumeric Symbols', range: '1D400—1D7FF'},
        {title: 'Sutton SignWriting', range: '1D800—1DAAF'},
        {title: 'Glagolitic Supplement', range: '1E000—1E02F'},
        {title: 'Mende Kikakui', range: '1E800—1E8DF'},
        {title: 'Adlam', range: '1E900—1E95F'},
        {title: 'Arabic Mathematical Alphabetic Symbols', range: '1EE00—1EEFF'},
        {title: 'Mahjong Tiles', range: '1F000—1F02F'},
        {title: 'Domino Tiles', range: '1F030—1F09F'},
        {title: 'Playing Cards', range: '1F0A0—1F0FF'},
        {title: 'Enclosed Alphanumeric Supplement', range: '1F100—1F1FF'},
        {title: 'Enclosed Ideographic Supplement', range: '1F200—1F2FF'},
        {title: 'Miscellaneous Symbols and Pictographs', range: '1F300—1F5FF'},
        {title: 'Emoticons (Emoji)', range: '1F600—1F64F'},
        {title: 'Ornamental Dingbats', range: '1F650—1F67F'},
        {title: 'Transport and Map Symbols', range: '1F680—1F6FF'},
        {title: 'Alchemical Symbols', range: '1F700—1F77F'},
        {title: 'Geometric Shapes Extended', range: '1F780—1F7FF'},
        {title: 'Supplemental Arrows-C', range: '1F800—1F8FF'},
        {title: 'Supplemental Symbols and Pictographs', range: '1F900—1F9FF'},
        {title: 'CJK Unified Ideographs Extension B', range: '20000—2A6D6'},
        {title: 'CJK Unified Ideographs Extension C', range: '2A700—2B734'},
        {title: 'CJK Unified Ideographs Extension D', range: '2B740—2B81D'},
        {title: 'CJK Unified Ideographs Extension E', range: '2B820—2CEA1'},
        {title: 'CJK Compatibility Ideographs Supplement', range: '2F800—2FA1F'},
        {title: 'Tags', range: 'E0000—E007F'},
        {title: 'Variation Selectors Supplement', range: 'E0100—E01EF'}
    ]

    function type(code) {
        let item
        let arr
        for (let i = 0; i < blocks.length; i++) {
            item = blocks[i]
            arr = item.range.split('—')
            // console.log(item.title + '（' + item.range + '）')
            // console.log(code, parseInt(arr[0], 16),parseInt(arr[1], 16))
            if (code >= parseInt(arr[0], 16) && code <= parseInt(arr[1], 16)) {
                return {
                    title: item.title,
                    range: item.range
                }
            }
        }

        return ''
    }

    export default {
        data () {
            return {
                language: '',

                keyword: 'の',
                page: 1,
                totalPage: 1,
                // keyword: '20ac',
                searchResult: false,
                resultVisible: false,
                blockVisible: false,
                title: '',
                list: [],
                block: '',
                _page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            title: '帮助',
                            to: '/unicode/help'
                        }
                    ]
                }
            }
        },
        mounted() {
            let data = this.$route.query.data
            if (data) {
                this.keyword = data
                this.search()
            }
            // this.search()
        },
        methods: {
            toggle() {
                this.list = []
            },
            toggleResult() {
                this.resultVisible = !this.resultVisible
            },
            toggleBlock() {
                this.blockVisible = !this.blockVisible
            },
            viewUnicode(item) {
                this.keyword = item
                this.resultVisible = true
                this.search()
            },
            search() {
                this.resultVisible = true

                let text
                let code
                let hex
                if (this.keyword.length === 4) {
                    hex = this.keyword.toLowerCase()
                    text = decode('\\u' + hex)
                    code = text.charCodeAt(0)
                } else {
                    text = this.keyword.charAt(0)
                    code = text.charCodeAt(0)
                    hex = padding0(code.toString(16))
                    console.log(hex)
                }

                let t = type(code)
                this.searchResult = {
                    text: text,
                    unicode: ('U+' + hex).toUpperCase(),
                    html: '&#' + code + ';',
                    title: t.title,
                    range: t.range,
                    block: t.title + '（' + t.range + '）'
                }
            },
            codelist($event, range, title) {
                this.resultVisible = false

                $event.preventDefault()
                this._range = range
                let arr = range.split('—')
                let min = parseInt(arr[0], 16)
                let max = parseInt(arr[1], 16)
                this._min = min
                this._max = max
                this.title = title
                this.list = []
                console.log(min, max)
                let total = max - min + 1
                this.pageSize = 1000
                this.totalPage = Math.ceil(total / this.pageSize)
                this.page = 1
                for (let i = min; i < min + this.pageSize; i++) {
                    this.list.push(decode('\\u' + padding0(i.toString(16))))
                }
            },
            loadMore() {
                console.log('加载更多')
                if (this.page < this.totalPage) {
                    this.page++
                    for (let i = this._min + (this.page - 1) * this.pageSize; i < this._min + this.page * this.pageSize && i <= this._max; i++) {
                        this.list.push(decode('\\u' + padding0(i.toString(16))))
                    }
                }
            },
            getBlocks() {
                return blocks
            },
            getTitleByRange(range) {
                for (let block of blocks) {
                    console.log(block, range, block.range === range)
                    if (block.range === range) {
                        return block.title
                    }
                }
                return null
            },
            updateBlock() {
                let arr = this.block.split('—')
                let min = parseInt(arr[0], 16)
                let max = parseInt(arr[1], 16)
                this.title = this.getTitleByRange(this.block)
                console.log('this.block', this.block, this.title)
                this.list = []
                for (let i = min; i <= max; i++) {
                    this.list.push(decode('\\u' + padding0(i.toString(16))))
                }
            },
            setBlock(range) {
                // this.blockVisible = false
                this.block = range
                this.updateBlock()
            }
        },
        watch: {
            // block() {
            //     this.updateBlock()
            // }
        }
    }
</script>

<style lang="scss" scoped>
    /*.col-sm-6 {*/
        /*float: left;*/
        /*width: 50%;*/
        /*padding: 0 16px;*/
    /*}*/
    @media all and (min-width: 1000px) {
        .col-sm-6 {
            float: left;
            width: 50%;
            padding: 0 16px;
        }
    }
    /**/
    .search-box {
        margin-bottom: 16px;
    }
    .search-box .title {
        margin-bottom: 16px;
    }
    .search-box .info {
        margin-bottom: 16px;
    }
    .unicode-card {
        padding: 16px;
        margin-bottom: 24px;
        border: 1px solid #ccc;
        border-radius: 4px;
        .text {
            margin: 0 auto;
            font-size: 80px;
            text-align: center;
        }
        .info {
            margin-bottom: 8px;
        }
    }
    .code-list-title {
        margin-bottom: 16px;
    }
    .all-text {
        margin: 16px 0;
    }
    .data-box {
        width: 100%;
        max-width: 400px;
        z-index: 10000;
        .body {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 16px;
            overflow: auto;
        }
    }
    .result-box {
        width: 100%;
        max-width: 400px;
        z-index: 10000;
        .body {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 16px;
            overflow: auto;
        }
    }
    .block-box {
        width: 100%;
        max-width: 400px;
        z-index: 1000;
        .body {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: auto;
        }
    }
    .btns {
        .btn {
            margin-right: 8px;
        }
    }
</style>
