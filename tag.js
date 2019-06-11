Vue.component('tag-t', {
    props: ['type', 'update-v', 'name', 'get-v', 'auto-save', 'input-value'],
    data: function () {
        return {
            list: [],
            count: 0,
            isAdding: false,
            showAlert: false,
            content: ''
        }
    },
    mounted() {
        this.list = this.getList();
        var _this = this;
        setTimeout(function () {
            _this.initStorage();
        }, 0);
    },
    methods: {
        initStorage: function () {

            var list = this.getList();
            this.list = list;
        },
        getList: function () {
            var list = (localStorage.getItem(this.type) || '').split(',');
            return list;
        },
        remove: function (item) {
            var list = this.getList();
            if (list.length) {
                if (item === localStorage.getItem(this.name) && this.autoSave) {
                    this.showAlert = true;
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 5000)
                }
                list.splice(list.indexOf(item), 1);
                localStorage.setItem(this.type, list);
                this.list = list;
            }
        },
        preAdd: function () {
            this.isAdding = true;
        },
        add: function (v) {
            var list = this.getList();
            const vv = typeof v === 'string' ? v : this.content;

            if (!list.includes(vv)) {
                list.push(vv);
                localStorage.setItem(this.type, list);
                this.list = list;
                this.isAdding = false;
                this.content = '';
            }

        },
        setV: function (v) {
            var list = this.getList();
            var originV = this.getV(this.name);
            if (list.includes(originV)) {
                this.updateV(this.name, v);
            } else {
                list.push(originV);
                localStorage.setItem(this.type, list);
                this.updateV(this.name, v);
                this.list = list;
            }
        }
    },
    template: `<span>
                <span v-for="item in list">
                    <span v-if="item !== ''" class="tag-wrap">
                        <span class="content" @click="setV(item)">{{item}}</span> <span class="close" @click="remove(item)">x</span>
                    </span>
                </span>
                <span v-if="isAdding === false" class="add" @click="preAdd">+</span>
                <span v-if="isAdding === true" class="preAdd" >
                    <input v-model="content" /> <button @click="add">&radic;</button>
                </span>
                <span class="text tips" v-if="showAlert">由于选中了"将输入的值存入对应tag中",而且本地记住的值和tag名相同,所以刷新页面将会再次将删除的值存入tag中</span>
            </span>`
});