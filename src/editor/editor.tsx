import * as React from "react"
import SaberGenerator from "@core/saber-generator"
import "./style.scss"
import {WebGLRenderer, PerspectiveCamera, DirectionalLight} from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

export class SaberEditor
{

    generator:SaberGenerator


    constructor()
    {
        this.generator = new SaberGenerator()
        const renderer = new WebGLRenderer()

        const scene = this.generator.scene

        const container = document.querySelector('.App')
        if(container != undefined)
        {
            
            const fov = 35;
            const aspect = container.clientWidth / container.clientHeight;
            const near = 0.1;
            const far = 100;

            const camera = new PerspectiveCamera(fov, aspect, near, far)
            

            camera.position.set(0,0,0.5) 
            
            const genBtn = document.querySelector("#generate_saber")
            if(genBtn != undefined)
            {
                genBtn.addEventListener("click", () => {this.generator.GenerateRandom("saber.gltf")})
                console.log("added button")
            }

            const saveBtn = document.querySelector<HTMLButtonElement>("#save_saber")
            if(saveBtn != undefined)
            {
                
                saveBtn.addEventListener("click", () => {this.generator.Save()})
            }

            renderer.setSize(container.clientWidth, container.clientHeight)
            renderer.setPixelRatio(window.devicePixelRatio)
            container.append(renderer.domElement)
        
            
            const controls = new OrbitControls(camera, renderer.domElement)
            const animate = () => 
            {
                controls.update()
                requestAnimationFrame( animate )
                renderer.render(scene, camera)
            }
            animate()
        }
    }
}


export default function Editor()
{
    return (
        <React.Fragment>
            <div className="ExportPanel">
                <EditorToggle label="Common" id="toggle-common" />
                <EditorToggle label="Uncommon" id="toggle-uncommon" />
                <EditorToggle label="Rare"   id="toggle-rare"   />
                <EditorToggle label="Special" id="toggle-special" />
                <div>
                    <button id="generate_saber">
                        Generate Saber
                    </button>
                </div>
                <hr />
                <label>Loaded Pieces:</label>
                <div id="loaded-pieces">
                    

                </div>
                <div>
                    <button id="save_saber" className="save" disabled={true}>
                        Save
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

interface EditorToggleProps{
    label: string;
    id: string
}
export function EditorToggle(props: EditorToggleProps)
{
    const {label, id} = props
    return (
        <React.Fragment>
            <div>
                <span>
                    <label className="switch">
                        <input type="checkbox" id={id} />
                        <span className="slider"></span>
                    </label>
                    
                        {label}
                    
                </span>
                
            </div>
        </React.Fragment>
    )
}

