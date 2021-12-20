import * as THREE from "three"
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"

import { SaberRegistry, SaberPiece } from "../staging/saber-registry"

const root = "./pieces/"
import registry from "./_registry.json"
import { Scene, DirectionalLight, AmbientLight, Color } from "three"
import { TIMEOUT } from "dns"

export class SaberGenerator{
    loader : GLTFLoader
    exporter : GLTFExporter
    registry : SaberRegistry

    scene : Scene

    constructor()
    {
        this.loader = new GLTFLoader()
        const draco = new DRACOLoader()
        draco.setDecoderConfig({ type: 'js' });
        draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        this.loader.setDRACOLoader(draco)
        this.exporter = new GLTFExporter()
        this.registry = registry
        this.scene = new Scene()
        this.scene.background = new Color(0.5, 0.5, 0.5)
        const light = new DirectionalLight(undefined, 4.0)
        const amb = new AmbientLight(undefined, 3.0)
        this.scene.add(amb)
        this.scene.add(light)
        console.log(this.registry)
        /*
        this.loader.load(root + registry.guards[0], (gltf) => {
            console.log(gltf.scene)
        })
        */
        this.GenerateRandom("saber.glb")

        console.log("success")
    }

    GenerateRandom(outPath:string) 
    {
        this.scene.children
            .filter((child) => /.*_SABERPIECE/.test(child.name))
            .forEach((child) => this.scene.remove(child))

        const randIdx = (arr : SaberPiece[]) => Math.floor(Math.random() * arr.length)
        const randItem = (arr : SaberPiece[]) => arr[randIdx(arr)]
        const gripPath = randItem(registry.grips)
        const guardPath = randItem(registry.guards)
        const pommelPath = randItem(registry.pommels)

        var paths = [guardPath, pommelPath, gripPath]
        var nLoaded = 0

        paths.forEach((thisPath) => {
            this.loader.load(root + thisPath.glbPath, (gltf) => {

                
                gltf.scene.children.forEach((child) => 
                {
                    child.name += "_SABERPIECE"
                    this.scene.add(child)
                })
                nLoaded += 1
            })
        })
        var WaitForLoads = () => 
        {
            if(nLoaded < paths.length)
            {
                setTimeout(WaitForLoads, 500)
            }
            else
            {
                console.log(this.scene)
                /*
                this.exporter.parse(this.scene, (result) => {
                    const saveBuffer = (buffer:ArrayBuffer, filename:string) => {
                        save(new Blob([buffer], {type: 'application/octet-stream'}), filename)
                    }
                    saveBuffer(result as ArrayBuffer, outPath)
                }, 
                {binary:true})*/
            }
        }
        WaitForLoads()
        

    }
}

function save(blob:Blob, filename:string) {
    const link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link)
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
