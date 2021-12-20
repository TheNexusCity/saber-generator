
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
    constructor(pieceRoot:string)
    {
        this.guards = new Array()
        this.grips = new Array()
        this.pommels = new Array()

        var piecePaths = fs.readdirSync(pieceRoot, {withFileTypes: true})

        while(piecePaths.length > 0)
        {
            var dirElt = piecePaths.pop()
            if(dirElt == undefined) break
            console.log(dirElt)
            if(!/.*\.glb/.test(dirElt.name))
            {
                var nuPaths = fs.readdirSync(path.join(pieceRoot, dirElt.name), {withFileTypes:true})
                const nPaths = nuPaths.length
                for(var i = 0; i < nPaths; i++)
                {
                    var nuPath = nuPaths[i]
                    nuPath.name = path.join(dirElt.name, nuPath.name)
                    nuPaths[i] = nuPath
                }
                nuPaths.forEach((nuPath) => piecePaths.push(nuPath))
                continue
            }
            const piecePath = dirElt.name
            if(/.*grip.*/.test(piecePath))
            {
                this.grips.push(new SaberPiece(piecePath))
            } else
            if(/.*guard.*/.test(piecePath))
            {
                this.guards.push(new SaberPiece(piecePath))
            } else
            if(/.*pommel.*/.test(piecePath))
            {
                this.pommels.push(new SaberPiece(piecePath))
            }
        }

        fs.writeFileSync("src/_registry.json", JSON.stringify(this))
    }
}