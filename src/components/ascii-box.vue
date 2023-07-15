<!-- 
use the .ascii-box-content for styling the content inside the box. Best way is to style it via the parent component/route that you put this element in.
 -->

<template>
    <div class="ascii-box" ref="box">
        <div class="ascii-box-top" ref="top" />
        <div class="ascii-box-left" ref="left" />
        <div class="ascii-box-right" ref="right" />
        <div class="ascii-box-bottom" ref="bottom" />

        <div class="ascii-box-content" ref="slot">
            <slot />
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "acii-box",
    props: {
        character: {
            type: String,
            required: false,
            default: "─"
        },
    },
    data: () => {
        return {
            fontSize: 32,
            observer: null as null | MutationObserver
        }
    },
    computed: {
        line() {
            return this.character.repeat(512)
        }
    },
    watch: {
        fontSize(newSize) {
            if (!newSize) {
                this.fontSize = 32
            }
        }
    },
    mounted() {
        const observer = new MutationObserver(this.updateBoxLayout)
        if (this.$refs["slot"] instanceof HTMLElement) {
            observer.observe(this.$refs["slot"], {
                childList: true,
                subtree: true 
            })
            this.observer = observer
        }

        window.addEventListener("resize", this.updateBoxLayout)


        if (this.$refs["box"] instanceof HTMLElement && this.$refs["top"] && this.$refs["bottom"]) {
            this.fontSize = Math.floor(parseInt(window.getComputedStyle(this.$refs["box"]).fontSize.replace("px", ""),10))
            if (!this.fontSize) {
                this.fontSize = 32
            }
            this.$refs["box"].style.padding = `${this.fontSize}px`
            
        }
    },
    beforeUnmount() {
        if (this.observer) {
            this.observer.disconnect()
        }
        window.removeEventListener("resize", this.updateBoxLayout)
    },
    methods: {
        updateBoxLayout() {
            this.fillLine("top")
            this.fillLine("bottom")
            this.fillSide("left")
            this.fillSide("right")
        },
        fillLine(side: "top" | "bottom") {
            const $ref = this.$refs[side] as HTMLInputElement | null
            const startHeight = this.fontSize as number
            const startChar = side === "top" ? "┌" : "└"
            const endChar = side === "top" ? "┐" : "┘"
            if ($ref) {
                let i = 1
                while ($ref.clientHeight < startHeight * 2  && i < 512) {
                    i++
                    $ref.innerHTML = startChar + this.character.repeat(i) + endChar
                }
                $ref.innerHTML = startChar + this.character.repeat(i - 1) + endChar
            }
        },
        fillSide(side: "left" | "right") {
            const $box = this.$refs["box"] as HTMLInputElement | null
            const $ref = this.$refs[side] as HTMLInputElement | null

            if ($ref && $box) {
                let i = 1
                $ref.innerHTML = ""
                while ($ref.clientHeight <= $box.clientHeight-this.fontSize  && i < 512) {
                    $ref.innerHTML = "|".repeat(i )
                    i++
                }
                $ref.innerHTML = "|".repeat(i-2)
                let padding = `${this.fontSize}px 0 0`
                if (side == "right") {
                    padding = `${this.fontSize}px ${this.fontSize}px 0 0`
                }
                $ref.style.padding = padding
            }
        },
        fillBottomLine() {
            const $ref = this.$refs["bottom"] as HTMLInputElement | null
            const startHeight = this.fontSize as number

            if ($ref) {
                let i = 1
                while ($ref.clientHeight < startHeight * 2  && i < 512) {
                    i++
                    $ref.innerHTML = "└" + this.character.repeat(i) + "┘"
                }
                $ref.innerHTML = "└" + this.character.repeat(i - 1) + "┘"
            }
        }
    }
})
</script>

<style lang="scss" scoped>
@import "./../assets/scss/variables.scss";
.ascii-box {
    font-family: monospace;
    display: inline-block;
    position: relative;
    line-height:1.2em;
    overflow: hidden;
}

.ascii-box-top {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    word-wrap: anywhere;
    overflow: hidden;
    transition: $transitionFast;
}

.ascii-box-content {
    // max-height: 100px;
    // oaverflow: auto;
}

.ascii-box-bottom {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    display: inline-block;
    word-wrap: break-word;
    transition: $transitionFast;
}

.ascii-box-left {
    width: 1px;
    word-wrap: anywhere;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 1.2em;
}

.ascii-box-right {
    width: 1px;
    word-wrap: anywhere;
    position: absolute;
    right: 0;
    top: 0;
    line-height: 1.2em;
}

</style>
