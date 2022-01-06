import * as THREE from "three"
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"

import { SaberRegistry, SaberPiece } from "../staging/saber-registry"

import registry from "./_registry.json"
import { Scene, DirectionalLight, AmbientLight, Color } from "three"
import { TIMEOUT } from "dns"
import { prototype } from "events"

export class SaberGenerator
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
        var paths = []
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
        loadedList?.replaceChildren()
        var loadPromises = new Array<Promise<void>>()
        paths.forEach((thisPath) => 
        {
            const loadPromise = this.loader.loadAsync(thisPath.glbPath)
            loadPromises.push
            (
                loadPromise.then((gltf) => 
                {
                    var loadedElt = document.createElement("li")
                    loadedElt.appendChild(new Text(/[_-\w]+\.glb$/.exec(thisPath.glbPath)?.at(0)))
                    document.querySelector<HTMLUListElement>("#loaded-pieces")?.appendChild(
                        loadedElt
                    )
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
            if(saveBtn != undefined)
            {
                saveBtn.disabled = false
            }
        })
        
        /*var nLoaded = 0

        paths.forEach((thisPath) => {
            validItem(thisPath)
            this.loader.load(thisPath.glbPath, (gltf) => {
                gltf.scene.children.forEach((child) => 
                {
                    child.name += "_SABERPIECE"
                    this.scene.add(child)
                })
                nLoaded += 1 //lol this is me stubbornly refusing to use async code
            })
        })
        var WaitForLoads = () => 
        {
            if(nLoaded < paths.length)
            {
                setTimeout(WaitForLoads, 5000)
            }
            else
            {
                /*
                console.log(this.scene)
                this.exporter.parse(this.scene, (result:object) =>
                {
                    const saveGLTF = (outGL:object, filename:string) => 
                    {
                        save(new Blob([JSON.stringify(outGL)], {type: 'application/json'}), filename)
                    }
                    saveGLTF(result, outPath)
                }, {binary:false})
                */
                /*
                this.exporter.parse(this.scene, (result) => {
                    const saveBuffer = (buffer:ArrayBuffer, filename:string) => {
                        save(new Blob([buffer], {type: 'application/octet-stream'}), filename)
                    }
                    saveBuffer(result as ArrayBuffer, outPath)
                }, 
                {binary:true})
            }
        }
        WaitForLoads()*/
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


