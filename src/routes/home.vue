<template>
    <div class="home">
        <dashboard @click="clearSelection">
            <div class="block" style="background-color: cyan">
                &nbsp;
            </div>
            <div class="block" style="background-color: magenta">
                &nbsp;
            </div>
            <div class="block" style="background-color: yellow" v-if="amount>=3">
                &nbsp;
            </div>
            <div class="block" style="background-color: #333" v-if="amount>=4">
                D
            </div>
        </dashboard>
        <div class="layout-modifiers">
            <input type="number" v-model="amount" min="2" max="4">
            <button @click="changeLayout" class="layout-button" v-if="amount >= 3">
                Change layout
            </button>
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import DashboardStore from "@/stores/dashboard"
import Dashboard from "@/components/dashboard.vue"
import _ from "lodash"

export default defineComponent ({ 
    name: "homePage",
    components: {Dashboard},
    props: [],
    setup() {
        const dashboard = DashboardStore()
        return {
            dashboard
        }
    },
    data() {
        return {
            confirmMessage: "",
            amount: 4,
            clearTimeout: 0,
        }
    },
    methods: {
        changeLayout() {
            if (this.dashboard.layoutType == "A") {
                this.dashboard.layoutType = "B"
            } else {
                this.dashboard.layoutType = "A"
            }
            clearTimeout(this.clearTimeout)
            
            this.dashboard.clearSelection()
            this.dashboard.updatePositions()
        },
        clearSelection() {
            clearTimeout(this.clearTimeout)
            
            this.clearTimeout = setTimeout(() => {
                this.dashboard.clearSelection()
            }, 10000)
        },
    },
})

</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";

.home {
    min-height:100%;
    min-width: 100%;

    .dashboard {
        height: 100vh;
        width: 100vw;
    }
    .layout-modifiers {
        position: absolute;
        left: 50%;
        bottom: 32px;
        transform: translateX(-50%);
    }
}

</style>