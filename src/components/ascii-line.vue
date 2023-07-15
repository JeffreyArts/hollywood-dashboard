<template>
    <div class="ascii-line" ref="line">{{ line }}</div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "acii-line",
    props: {
        character: {
            type: String,
            required: false,
            default: "-"
        },
    },
    data: () => {
        return {
        }
    },
    computed: {
        line() {
            return this.character.repeat(512)
        }
    },
    mounted() {
        if (this.$refs["line"] instanceof HTMLElement) {
            const fontSize = window.getComputedStyle(this.$refs["line"]).fontSize.replace("px", "")
            this.$refs["line"].style.height = `${fontSize}px`
        }
    },
    methods: {
        
    }
})
</script>

<style lang="scss" scoped>
@import "./../assets/scss/variables.scss";
.ascii-line {
    width: 100%;
    display: inline-block;
    word-wrap: anywhere;
    overflow: hidden;
}
</style>
