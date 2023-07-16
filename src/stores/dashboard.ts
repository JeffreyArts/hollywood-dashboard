import { defineStore } from "pinia"
import _ from "lodash"
import gsap from "gsap"
import {DashboardPosition} from "@/types/dashboard"

export const dashboard = defineStore({
    id: "dashboard",
    state: () => ({
        elements: [] as HTMLElement[],
        container: null as null | HTMLElement,
        orientation: "portrait" as "portrait" | "landscape",
        layoutType: "A",
        inTransition: false,
        activeIndex: null as null | number,
        activeElement: null as null | HTMLElement,
        animationDuration: .8,
        animationEasing: "elastic.out(1.1, 0.9)",
    }),
    actions: {
        setContainer(container: HTMLElement) {
            if (!!(this.container instanceof HTMLElement)) {
                return
            }
            
            window.addEventListener("resize", this.updatePositions)
            this.container = container
            container.clientHeight > container.clientWidth ? this.orientation = "portrait" : this.orientation = "landscape"

        },
        updatePositions() {
            if (!this.container) {
                return
            }

            this.container.clientHeight > this.container.clientWidth ? this.orientation = "portrait" : this.orientation = "landscape"
            this.elements = this.container.children as unknown as HTMLElement[]

            if (this.elements.length <= 1) {
                return
            }

            _.forEach(this.elements, (element, index) => {
                element.removeEventListener("click",this.focusElement)
                element.addEventListener("click", this.focusElement)
                
            })
            
            if (this.elements.length == 2) {
                this.update2ElementsDashboard(this.layoutType)
            }
            if (this.elements.length == 3) {
                this.update3ElementsDashboard(this.layoutType)
            }
            if (this.elements.length == 4) {
                this.update4ElementsDashboard(this.layoutType)
            }
        },
        focusElement(event: MouseEvent) {
            if (this.inTransition) {
                return
            }
            
            const target = event.currentTarget as HTMLElement
            if (target.classList.contains("__isActive")) {
                return
            }

            _.forEach(this.elements, (element, index) => {
                if (element == target) {
                    this.activeIndex = index
                    target.classList.add("__isActive")
                    this.activeElement = target
                } else {
                    element.classList.remove("__isActive")  
                }
            })
            
            this.updatePositions()
        },
        update2ElementsDashboard(layoutType = "A" as string) {

            if (!this.container)  {
                console.warn("No dashboard container set, can't update positions")
                return
            }

            const width = this.container.clientWidth
            const height = this.container.clientHeight

            const positions = _.map(this.elements, (el, index) => {

                const size = 128
                const position = {
                    width:  0,
                    height: 0,
                    left:   0,
                    top:    0,
                    unit: "px",
                    element: el,
                } as DashboardPosition
                switch (index) {
                case 0:
                    position.top    = this.orientation == "portrait" ? 0 : 0
                    position.left   = this.orientation == "portrait" ? 0 : 0
                    position.width  = this.orientation == "portrait" ? width : width/2
                    position.height = this.orientation == "portrait" ? height/2: height
                    if (this.activeIndex == 0) {
                        position.top    = this.orientation == "portrait" ? 0 : 0
                        position.left   = this.orientation == "portrait" ? 0 : 0
                        position.width  = this.orientation == "portrait" ? width : width-size
                        position.height = this.orientation == "portrait" ? height-size : height
                    } else if(this.activeIndex == 1) {
                        position.top    = this.orientation == "portrait" ? 0 : 0
                        position.left   = this.orientation == "portrait" ? 0 : 0
                        position.width  = this.orientation == "portrait" ? width : size
                        position.height = this.orientation == "portrait" ? size : height
                    } 
                    break
                case 1:
                    position.left   = this.orientation == "portrait" ? 0 : width/2
                    position.top    = this.orientation == "portrait" ? height/2 : 0
                    position.width  = this.orientation == "portrait" ? width : width/2
                    position.height = this.orientation == "portrait" ? height/2 : height

                    if (this.activeIndex == 0) {
                        position.top    = this.orientation == "portrait" ? height-size : 0
                        position.left   = this.orientation == "portrait" ? 0 : width-size
                        position.width  = this.orientation == "portrait" ? width : size
                        position.height = this.orientation == "portrait" ? size : height
                    } else if(this.activeIndex == 1) {
                        position.top    = this.orientation == "portrait" ? size : 0
                        position.left   = this.orientation == "portrait" ? 0 : size
                        position.width  = this.orientation == "portrait" ? width : width-size
                        position.height = this.orientation == "portrait" ? height-size : height
                    }
                    break
                }
                return position
            })
            this.animatePositions(positions)
        },
        update3ElementsDashboard(layoutType = "A" as string) {
          
            const positions = _.map(this.elements, (el, index) => {

                const position = {
                    width:  0,
                    height: 0,
                    left:   0,
                    top:    0,
                    unit: "%",
                    element: el,
                } as DashboardPosition

                if (layoutType == "A") {
                    switch (index) {
                    case 0:
                        position.top    = this.orientation == "portrait" ? 0 : 0
                        position.left   = this.orientation == "portrait" ? 0 : 0
                        position.width  = this.orientation == "portrait" ? 100 : 50
                        position.height = this.orientation == "portrait" ? 50 : 100
                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if(this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 20
                            position.height = this.orientation == "portrait" ? 10 : 50
                        } else if(this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 0 : 50
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 50 : 20
                            position.height = this.orientation == "portrait" ? 20 : 50
                        }
                        break
                    case 1:
                        position.left   = this.orientation == "portrait" ? 0 : 50
                        position.top    = this.orientation == "portrait" ? 50 : 0
                        position.width  = this.orientation == "portrait" ? 100 : 50
                        position.height = this.orientation == "portrait" ? 50 : 50

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 80
                            position.width  = this.orientation == "portrait" ? 50 : 20
                            position.height = this.orientation == "portrait" ? 50 : 50
                        } else if(this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 10 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 20
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if(this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 50 : 0
                            position.width  = this.orientation == "portrait" ? 50 : 20
                            position.height = this.orientation == "portrait" ? 20 : 50
                        }
                        break
                    case 2:
                        position.top    = this.orientation == "portrait" ? 50 : 50
                        position.left   = this.orientation == "portrait" ? 50 : 50
                        position.width  = this.orientation == "portrait" ? 100 : 50
                        position.height = this.orientation == "portrait" ? 50 : 50

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : 50
                            position.left   = this.orientation == "portrait" ? 50 : 80
                            position.width  = this.orientation == "portrait" ? 100 : 20
                            position.height = this.orientation == "portrait" ? 80 : 50
                        } else if(this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 90 : 50
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 20
                            position.height = this.orientation == "portrait" ? 10 : 50
                        }  else if(this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 20 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 20
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } 
                        break
                    }
                }



                if (layoutType == "B") {
                    const size = 100/3
                    switch (index) {
                    case 0:
                        position.top    = this.orientation == "portrait" ? 0 : 0
                        position.left   = this.orientation == "portrait" ? 0 : 0
                        position.width  = this.orientation == "portrait" ? 100 : size
                        position.height = this.orientation == "portrait" ? size : 100

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : size*2.4
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : size*0.3
                            position.height = this.orientation == "portrait" ? size*0.3 : 100
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : size*0.3
                            position.height = this.orientation == "portrait" ? size*0.3 : 100
                        }
                        break
                    case 1:
                        position.top    = this.orientation == "portrait" ? size : 0
                        position.left   = this.orientation == "portrait" ? 0 : size
                        position.width  = this.orientation == "portrait" ? 100 : size
                        position.height = this.orientation == "portrait" ? size : 100

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : size*2.4
                            position.width  = this.orientation == "portrait" ? 100 : size*0.3
                            position.height = this.orientation == "portrait" ? 10 : 100
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? size*0.3 : 0
                            position.left   = this.orientation == "portrait" ? 0 : size*0.3
                            position.width  = this.orientation == "portrait" ? 100 : size*2.4
                            position.height = this.orientation == "portrait" ? size*2.4 : 100
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? size*0.3 : 0
                            position.left   = this.orientation == "portrait" ? 0 : size*0.3
                            position.width  = this.orientation == "portrait" ? 100 : size*0.3
                            position.height = this.orientation == "portrait" ? size*0.3 : 100
                        }
                        break
                    case 2:
                        position.top    = this.orientation == "portrait" ? size*2 : 0
                        position.left   = this.orientation == "portrait" ? 0 : size*2
                        position.width  = this.orientation == "portrait" ? 100 : size
                        position.height = this.orientation == "portrait" ? size : 100


                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 90 : 0
                            position.left   = this.orientation == "portrait" ? 0 : size*2.7
                            position.width  = this.orientation == "portrait" ? 100 : size*0.3
                            position.height = this.orientation == "portrait" ? 10 : 100
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? size*2.7 : 0
                            position.left   = this.orientation == "portrait" ? 0 : size*2.7
                            position.width  = this.orientation == "portrait" ? 100 : size*0.3
                            position.height = this.orientation == "portrait" ? size*0.3 : 100
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? size*0.6 : 0
                            position.left   = this.orientation == "portrait" ? 0 : size*0.6
                            position.width  = this.orientation == "portrait" ? 100 : size*2.4
                            position.height = this.orientation == "portrait" ? size*2.4 : 100
                        }
                        break
                    }
                }

                
                return position
            })
            this.animatePositions(positions)
        },
        update4ElementsDashboard(layoutType = "A" as string) {
            

            const positions = _.map(this.elements, (el, index) => {
                
                const position = {
                    width:  0,
                    height: 0,
                    left:   0,
                    top:    0,
                    unit: "%",
                    element: el,
                } as DashboardPosition

                if (layoutType == "A") { 
                    const size = 100/3
                    switch (index) {
                    case 0:
                        position.top    = this.orientation == "portrait" ? 0 : 0
                        position.left   = this.orientation == "portrait" ? 0 : 0
                        position.width  = this.orientation == "portrait" ? 50 : 50
                        position.height = this.orientation == "portrait" ? 50 : 50

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if (this.activeIndex == 1 ) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } 
                        break
                    case 1:
                        position.top    = this.orientation == "portrait" ? 0 : 0
                        position.left   = this.orientation == "portrait" ? 50 : 50
                        position.width  = this.orientation == "portrait" ? 50 : 50
                        position.height = this.orientation == "portrait" ? 50 : 50

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } 
                        break
                    case 2:
                        position.top    = this.orientation == "portrait" ? 50 : 50
                        position.left   = this.orientation == "portrait" ? 0 : 0
                        position.width  = this.orientation == "portrait" ? 50 : 50
                        position.height = this.orientation == "portrait" ? 50 : 50

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } 
                        break
                        
                    case 3:
                        position.top    = this.orientation == "portrait" ? 50 : 50
                        position.left   = this.orientation == "portrait" ? 50 : 50
                        position.width  = this.orientation == "portrait" ? 50 : 50
                        position.height = this.orientation == "portrait" ? 50 : 50

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 80
                            position.width  = this.orientation == "portrait" ? size : 20
                            position.height = this.orientation == "portrait" ? 20 : size
                        }  else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } 

                        break
                    }
                }


                if (layoutType == "B") { 
                    const size = 100/3
                    switch (index) {
                    case 0:
                        position.top    = this.orientation == "portrait" ? 0 : 0
                        position.left   = this.orientation == "portrait" ? 0 : 0
                        position.width  = this.orientation == "portrait" ? 100 : 60
                        position.height = this.orientation == "portrait" ? 60 : 100

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 80
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if (this.activeIndex == 1 ) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } 
                        break
                    case 1:
                        position.top    = this.orientation == "portrait" ? 60 : 0
                        position.left   = this.orientation == "portrait" ? 0 : 60
                        position.width  = this.orientation == "portrait" ? size : 40
                        position.height = this.orientation == "portrait" ? 40 : size

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 60
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } 
                        break
                    case 2:
                        position.top    = this.orientation == "portrait" ? 60 : size
                        position.left   = this.orientation == "portrait" ? size : 60
                        position.width  = this.orientation == "portrait" ? size : 40
                        position.height = this.orientation == "portrait" ? 40 : size

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 80 : size
                            position.left   = this.orientation == "portrait" ? size : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 60
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } 
                        break
                        
                    case 3:
                        position.top    = this.orientation == "portrait" ? 60 : size*2
                        position.left   = this.orientation == "portrait" ? size*2 : 60
                        position.width  = this.orientation == "portrait" ? size : 40
                        position.height = this.orientation == "portrait" ? 40 : size

                        if (this.activeIndex == 0) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 1) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        } else if (this.activeIndex == 2) {
                            position.top    = this.orientation == "portrait" ? 80 : size*2
                            position.left   = this.orientation == "portrait" ? size*2 : 60
                            position.width  = this.orientation == "portrait" ? size : 40
                            position.height = this.orientation == "portrait" ? 20 : size
                        }  else if (this.activeIndex == 3) {
                            position.top    = this.orientation == "portrait" ? 0 : 0
                            position.left   = this.orientation == "portrait" ? 0 : 0
                            position.width  = this.orientation == "portrait" ? 100 : 60
                            position.height = this.orientation == "portrait" ? 80 : 100
                        } 

                        break
                    }
                }
                return position
            })
            this.animatePositions(positions)

        },
        clearSelection() {
            this.activeIndex = null
            this.activeElement = null
            this.updatePositions()
        },
        animatePositions(positions: DashboardPosition[]) {
            _.forEach(positions, (posData) => {
                this.inTransition = true

                gsap.to(posData.element, {
                    top:    posData.unit == "px" ? `${posData.top}px`   : `${posData.top}%`,
                    left:   posData.unit == "px" ? `${posData.left}px`  : `${posData.left}%`,
                    width:  posData.unit == "px" ? `${posData.width}px` : `${posData.width}%`,
                    height: posData.unit == "px" ? `${posData.height}px`: `${posData.height}%`,
                    ease: this.animationEasing,
                    duration: this.animationDuration, 
                    onComplete: () => {
                        this.inTransition = false
                    }
                })
            })
        }
    },
    getters: {
    }
})

export default dashboard