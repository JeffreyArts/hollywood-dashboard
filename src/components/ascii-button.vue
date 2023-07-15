<template>
    <div class="ascii-button" ref="button">
        <div class="ascii-button-top" ref="top"></div>
        <div class="ascii-button-center" ref="center">
            | <slot /> |
        </div>
        <div class="ascii-button-bottom" ref="bottom"></div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "acii-button",
    props: {
        character: {
            type: String,
            required: false,
            default: "─"
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
        if (this.$refs["button"] instanceof HTMLElement) {
            const fontSize = Math.floor(parseInt(window.getComputedStyle(this.$refs["button"]).fontSize.replace("px", ""),10))
            // this.$refs['button'].style.height = `${fontSize}px`
            this.$refs["button"].style.padding = `${fontSize}px 0`
            this.fillLine("top")
            this.fillLine("bottom")
        }
    },
    methods: {
        fillLine(side: "top" | "bottom") {
            const $ref = this.$refs[side] as HTMLElement | null
            let string = ""
            if (this.$refs["center"] instanceof HTMLElement) {
                string = this.$refs["center"].innerText
            }

            const startChar = side === "top" ? "┌" : "└"
            const endChar = side === "top" ? "┐" : "┘"
            if ($ref) {
                $ref.innerHTML = startChar + this.character.repeat(string.length-2) + endChar
            }
            $ref?.classList.add("__isLoaded")
        },
    }
})
</script>

<style lang="scss" scoped>
@import "./../assets/scss/variables.scss";
.ascii-button {
    font-family: monospace;
    width: auto;
    display: inline-block;
    position: relative;
    cursor: pointer;
    line-height:1.2em;
    overflow: hidden;

    &:hover,
    &:focus {
        color: $accentColor;
        letter-spacing: .1em;

        .ascii-button-hover-bg {
            opacity: 0.1;
        }
        .ascii-button-top {
            top: -4px;
        }
        .ascii-button-bottom {
            bottom: -6px;
            // letter-spacing: 1px;
        }
    }
}

.ascii-button-top {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    word-wrap: break-word;
    overflow: hidden;
    transition: $transitionFast;

    &.__isLoaded {
        word-wrap: normal;
    }
}

.ascii-button-center {
    margin-top: -1px;
    display: inline-block;
    transition: $transitionFast;
}

.ascii-button-bottom {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    display: inline-block;
    word-wrap: break-word;
    transition: $transitionFast;

    &.__isLoaded {
        word-wrap: normal;
    }
}

</style>
