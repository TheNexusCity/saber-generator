import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import SaberPiece from "./saber-piece"
import SaberRegistry from "./saber-registry"
import LoadedPiece from "@editor/loadedPiece"
import registry from "../_registry.json"
import { Scene, DirectionalLight, AmbientLight, Color } from "three"
import ReactDOM from "react-dom"


export default class SaberGenerator
{
    loader : GLTFLoader
    exporter : GLTFExporter
    downloadLink : HTMLElement | undefined
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
        

        console.log("success")
    }



    public async GenerateRandom(outPath:string) 
    {
        const saveBtn = document.querySelector<HTMLButtonElement>("#save_saber")
        if(saveBtn != undefined)
        {
            saveBtn.disabled = true
        }

        this.scene.children
            .filter((child) => /.*_SABERPIECE/.test(child.name))
            .forEach((child) => this.scene.remove(child))

        const randIdx = (arr : SaberPiece[]) => Math.floor(Math.random() * arr.length)
        const randItem = (arr : SaberPiece[]) => arr[randIdx(arr)]

        const query = (x:string) => document.querySelector<HTMLInputElement>(x)?.checked
        const useCommon = query("#toggle-common")
        const useUncommon = query("#toggle-uncommon")
        const useRare = query("#toggle-rare")
        const useSpecial = query("#toggle-special")

        const validItem = (piece : SaberPiece) => 
        {
            const tier = /(?<=Sabers\/)\w+(?=\/)/.exec(piece.glbPath)?.at(0)
            /*console.log("for " + piece.glbPath + "\nfound " + tier)
            console.log("common: " + useCommon)
            console.log("uncommon: " + useUncommon)
            console.log("rare: " + useRare)*/

            switch(tier)
            {
                case "Common":
                    return useCommon
                case "Uncommon":
                    return useUncommon
                case "Rare":
                    return useRare
                case "Zodiac":
                    return useSpecial
                default:
                    return false
            }
        }
        var paths = new Array<SaberPiece>()
        if(useSpecial && 
            (
                Math.random() < 0.25 || 
                ![useCommon, useUncommon, useRare].reduce((x,y) => x || y)
            ))
        {
            paths = [randItem(registry.composites)]
        }
        else{
            const gripPath = randItem(registry.grips.filter(validItem))
            const guardPath = randItem(registry.guards.filter(validItem))
            const pommelPath = randItem(registry.pommels.filter(validItem))
    
            paths = [guardPath, pommelPath, gripPath]
        }
        const loadedList = document.querySelector("#loaded-pieces")
        if(loadedList)
        {
            ReactDOM.unmountComponentAtNode(loadedList)
        }
        
        var loadPromises = new Array<Promise<void>>()
        paths.forEach((thisPath) => 
        {
            const loadPromise = this.loader.loadAsync(thisPath.glbPath)
            loadPromises.push
            (
                loadPromise.then((gltf) => 
                {
                    gltf.scene.children.forEach((child) => 
                    {
                        child.name += "_SABERPIECE"
                        this.scene.add(child)
                    })
                })
            )
        })
        Promise.all(loadPromises).then(() => {
            console.log("loaded scene(s)")

            ReactDOM.render(
                paths.map((p:SaberPiece) => <LoadedPiece piece={p} />),
                loadedList
            )

            if(saveBtn != undefined)
            {
                saveBtn.disabled = false
            }
        })
    }
    public Save()
    {
        const saveBtn = document.querySelector<HTMLButtonElement>("#save_saber")
        if(saveBtn != undefined)
        {
            saveBtn.disabled = true
        }

        this.exporter.parse
        (
            this.scene, 
            (gltf) =>
            {
                this.SaveBlob(new Blob([gltf as ArrayBuffer], {type: 'application/octet-stream'}), "saber.glb")
            }, 
            {binary:true}
        )
    }
    SaveBlob(blob:Blob, filename:string) 
    {
        this.downloadLink?.remove()
        const link = document.createElement('a')
        this.downloadLink = link
        link.style.display = 'none'
        document.body.appendChild(link)
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        const saveBtn = document.querySelector<HTMLButtonElement>("#save_saber")
        if(saveBtn != undefined)
        {
            saveBtn.disabled = false
        }
        link.click();
    }
}


