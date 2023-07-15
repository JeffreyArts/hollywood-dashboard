<template>
    <div class="home">
        <section class="container">
            
            <h1 class="home-title">
                <span class="left">
                    Jeff-frontend boilerplate
                </span>
                <span class="right">
                    <Icon type="calendar" />{{ currentDate }}
                </span>
            </h1>

            <ascii-line character="-"/>

            <div class="home-description">
                <p>
                    This is a boilerplate for a frontend application using Vue 3, Typescript, Vue Router, Pinia, Vite, Lodash, PouchDB, Sass & normalize.css.
                </p>
                <p>
                    It is made as a scaffolding framework to quickly get up and running to develop a webapplication build upon the headless <a href="https://strapi.io">Strapi</a> CMS.
                </p>
            </div>

                
            <ascii-line class="divider-line" character="="/>

            <div class="strapi-test">
                <h1>Test Strapi REST connection</h1>
                <em>Configure the .env file of your project to match it with the right Strapi server configuration.</em>
                <br>
                <br>
                <rest-demo />

                <details>
                    <summary>Route inspiration</summary>
                    <p>Some routes you can use to test the connection.</p>
                    <ul>
                        <li>/users/me - Returns details of the authorized user</li>
                        <li>/auth/local/register - Register as a new user</li>
                        <li>/auth/forgot-password - Request password reset flow</li>
                        <li>...</li>
                    </ul>
                    <p>Look in the <a :href="adminUrl" target="_blank">Strapi admin panel</a> for more details upon the available endpoints <span class="highlight">Settings</span> &gt; <span class="highlight">Users & Permissions plugin</span> &gt; <span class="highlight">Roles</span></p>
                </details>
            </div>

            <ascii-line class="divider-line" character="~"/>

            <div class="strapi-test">
                <h1>Test Strapi authentication</h1>
                <div class="test-auth-container">

                    <div class="test-auth-section">
                        <div class="unauthenticated" v-if="!Strapi.self && !confirmMessage">
                            <h3>Login</h3>
                            <authentication @requestPasswordSuccess="showConfirmMessage"/>
                        </div>
                        <div class="authenticated" v-if="Strapi.self && !confirmMessage">
                            <h3>Welcome {{ Strapi.self.username }}</h3>
                            <button @click="logout">
                                Logout
                            </button>
                        </div>
                        <div v-if="confirmMessage">
                            If there is an existing account for {{ confirmMessage }}, than there will be an e-mail on its way with a password reset link.
                        </div>
                    </div>
                    <div class="test-auth-section">
                        <div class="unauthenticated" v-if="!Strapi.self">
                            <h3>Register account</h3>
                            <register />
                        </div>
                        <pre v-if="Strapi.self">{{ Strapi.self }}</pre>
                    </div>
                </div>
            </div>

        </section>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import LocalDB from "@/stores/localdb"
import strapiStore from "@/stores/strapi"
import gsap from "gsap"
import Icon from "@/components/icon.vue"
import asciiLine from "@/components/ascii-line.vue"
import restDemo from "@/components/rest-demo.vue"
import register from "@/components/auth/register.vue"
import authentication from "@/components/auth/login.vue"
import dayjs from "dayjs"
import _ from "lodash"

export default defineComponent ({ 
    name: "homePage",
    components: {Icon, asciiLine, restDemo, authentication,register},
    props: [],
    setup() {
        const localDB = LocalDB()
        const Strapi = strapiStore()

        return { localDB, Strapi}
    },
    data() {
        return {
            confirmMessage: "",
            consoleEvents: [] as Array<string>,
            adminUrl: `${import.meta.env.VITE_STRAPI_REST_ENDPOINT}/admin/settings/users-permissions/roles`
        }
    },
    computed: {
        currentDate() {
            return dayjs().format("DD-MM-YYYY")
        }
    },
    mounted() {
        gsap.fromTo(".home-title .right", {
            opacity: 0, 
            x: 24
        }, {
            opacity: 1, 
            x:0, 
            ease: "elastic.out(1, 0.3)",
            duration: 2.4
        })
        gsap.fromTo(".home-description, .divider-line,  .strapi-test", {
            opacity: 0, 
            y: 24
        }, {
            opacity: 1, 
            y:0, 
            ease: "circ.out",
            duration: .64,
            stagger: .16
        })
    },
    methods: {
        postRequest(data: any) {
            this.consoleEvents.push(`${dayjs().format("HH:mm:ss")} | Post request send`)
            fetch(`${import.meta.env.VITE_REST_API}/test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
        },
        logout(event: Event) {
            this.Strapi.logout()
        },
        showConfirmMessage(email:string) {
            this.confirmMessage = email
        }
    }
})

</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";

.home {
    min-height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;


    // BAD PRACTICE
    // I generally discourage others to use class prefixes instead of doing this kind of bubbling.
    // I have good reasons though to not follow my own advice here.
    // If you want to know why, send me a message.
    pre {
        display: inline-block;
        background-color: $textColor;
        color: $white;
        padding: 8px;
        border-radius: 4px;
        margin: 0;
        cursor: pointer;
    }
    .highlight {
        display: inline-block;
        padding: 0 5px;
        background-color: #eee;
        border-radius: 3px;
    }

    .strapi-test {
        margin: 24px 0;
    }

    .test-auth-section {
        width: 100%;
        
        .auth-form-field,
        .register-form-field {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 16px;
        }
        label {
            display: inline-block;
            width: 128px;
        }
        .auth-form-field,
        .register-form-field {
            margin-bottom: 8px;
        }
        input {
            width: calc(100% - 128px);
        }

        @media (min-width: 640px) {
            width: 50%;
        }
    }
    .test-auth-container {
        width: 100%;
        display: flex;
        gap: 32px;
    }
}

.home-title {
    width: 100%;
    text-align: right;
    font-size:16px;
    font-weight: normal;
    .icon {
        height: 1.2em;
        translate: -8px 4px;
        display: inline-block;
    }   
    .left {
        float: left;
        font-weight: bold;
        display: inline-block;
    }
    .right {
        display: inline-block;
    }
}

.home-button-right {
    float: right;
}

.home-description {
    padding: 32px 0;
}

.home-console {
    width: 100%;
    display: block;
}

.home-console-entry {
    display: inline-block;
    width: 100%;
    &:before {
        content: "> ";
        font-weight: bold;
    }
}
</style>