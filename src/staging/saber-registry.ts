
import * as fs from "fs"
import * as path from "path"
import { Quality, SaberComponent } from "./loadedPiece.js"

export class SaberAttributes
{
    quality:Quality = Quality.COMMON
    component:SaberComponent = SaberComponent.COMPOSITE
}

export class SaberPiece
{
    name:string
    glbPath:string
    thumbnailPath:string
    attributes:SaberAttributes
    constructor(_glbPath:string)
    {
        this.glbPath = _glbPath
        const name = /[-_\w]+(?=\.glb$)/.exec(_glbPath)?.at(0)
        this.name = name != undefined ? name : "null"
        this.thumbnailPath = ""
        this.attributes = new SaberAttributes()

        const compType = (path:string) => 
        {
            if(/.*grip.*/.test(path))
            {
                return SaberComponent.GRIP
            } 
            else
            if(/.*guard.*/.test(path))
            {
                return SaberComponent.GUARD
            } 
            else
            if(/.*pommel.*/.test(path))
            {
                return SaberComponent.POMMEL
            }
            else
            {
                return SaberComponent.COMPOSITE
            }
        }

        const quality = (path:string) =>
        {
            class qTest 
            { 
                test:RegExp 
                qual:Quality 
                constructor(t:RegExp, q:Quality) 
                {
                    this.test = t
                    this.qual = q
                } 
            }
            const tests = 
            [
                new qTest(/Common/, Quality.COMMON),
                new qTest(/Uncommon/, Quality.UNCOMMON),
                new qTest(/Rare/, Quality.RARE),
                new qTest(/Zodiac/, Quality.SPECIAL)
            ]
            return tests.map((x) => x.test.test(path) ? x.qual : Quality.COMMON).reduce((x, y) => x>y ? x : y)
        }

        this.attributes.component = compType(this.glbPath)
        this.attributes.quality = quality(this.glbPath)
    }
}

export class SaberRegistry
{
    grips:Array<SaberPiece>
    guards:Array<SaberPiece>
    pommels:Array<SaberPiece>

    composites:Array<SaberPiece>

    constructor()
    {
        this.guards = new Array()
        this.grips = new Array()
        this.pommels = new Array()
        this.composites = new Array()
    }
}

export default class RegistryStager
{
    static GetPiecePaths(pieceRoot:string):Array<string>
    {
        var result = new Array<string>()
        var piecePaths = fs.readdirSync(pieceRoot, {withFileTypes:true})
        //console.log("---\nwith root " + pieceRoot + ", \npiecePaths: " + piecePaths + "\n---")
        while(piecePaths.length > 0)
        {
            var dirElt = piecePaths.pop()
            if(dirElt == undefined) break
            //console.log("on piecePath" + dirElt.name)
            if(!/.*\.glb/.test(dirElt.name))
            {
                //console.log("is folder")
                var nuPaths = this.GetPiecePaths(path.join(pieceRoot, dirElt.name))
                nuPaths.forEach((nuPath) => result.push(nuPath))
            }
            else
            {
                //console.log("is not folder")
                result.push(path.join(pieceRoot, dirElt.name))
            }
        }
        return result
    }

    public static Stage(pieceRoot:string):SaberRegistry
    {
        var registry = new SaberRegistry()
        var piecePaths = this.GetPiecePaths(pieceRoot)
        piecePaths.forEach((piecePath) =>
        {
            var nuPiece = new SaberPiece(piecePath)
            console.log(nuPiece)
            switch(nuPiece.attributes.component)
            {
                case SaberComponent.GUARD:
                    registry.guards.push(nuPiece)
                    break;
                case SaberComponent.GRIP:
                    registry.grips.push(nuPiece)
                    break;
                case SaberComponent.POMMEL:
                    registry.pommels.push(nuPiece)
                    break;
                case SaberComponent.COMPOSITE:
                    registry.composites.push(nuPiece)
                    break;
            }
        })
        fs.writeFileSync("src/_registry.json", JSON.stringify(registry))
        
        return registry
    }
}