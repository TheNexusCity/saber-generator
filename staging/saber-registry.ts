
import * as fs from "fs"
import * as path from "path"
export class SaberAttributes
{

}

export class SaberPiece
{
    glbPath:string
    thumbnailPath:string
    attributes:SaberAttributes
    constructor(_glbPath:string)
    {
        this.glbPath = _glbPath
        this.thumbnailPath = ""
        this.attributes = {}
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

export class RegistryStager
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
            if(/.*grip.*/.test(piecePath))
            {
                registry.grips.push(nuPiece)
            } 
            else
            if(/.*guard.*/.test(piecePath))
            {
                registry.guards.push(nuPiece)
            } 
            else
            if(/.*pommel.*/.test(piecePath))
            {
                registry.pommels.push(nuPiece)
            }
            else
            {
                registry.composites.push(nuPiece)
            }
        })
        fs.writeFileSync("src/_registry.json", JSON.stringify(registry))
        return registry
    }
}