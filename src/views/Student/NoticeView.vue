<template>
    <div>

        <el-collapse @change="handleChange" v-if="length!=0">
            <el-collapse-item title="会议通知" name="1">
                <div>请在{{ btime }}到{{ addreess }},{{ meeRmName }}开会</div>
            </el-collapse-item>

        </el-collapse>
        <el-empty v-else description="暂时没有通知"></el-empty>
    </div>
</template>

<script>

import axios from 'axios';
export default {
    data() {
        return {
            length:0,
            meet: '',
            btime: '',
            addreess: '',
            meeRmName: "",
            mee:[]
        }
    },
    methods: {
        handleChange(val) {
            console.log(val);
        },
        // selectMeet() {
        //     axios.get("/main")
        // },
    },
    created() {
        this.selectMeet()
      
    }
}
</script>