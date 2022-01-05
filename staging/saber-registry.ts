
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

    GetPiecePaths(pieceRoot:string):Array<string>
    {
        var result = new Array<string>()
        var piecePaths = fs.readdirSync(pieceRoot, {withFileTypes:true})
        while(piecePaths.length > 0)
        {
            var dirElt = piecePaths.pop()
            if(dirElt == undefined) break
            console.log(dirElt)
            if(!/.*\.glb/.test(dirElt.name))
            {
                var nuPaths = this.GetPiecePaths(path.join(pieceRoot, dirElt.name))
                nuPaths.forEach((nuPath) => result.push(nuPath))
            }
            else
            {
                result.push(dirElt.name)
            }
        }
        return result
    }

    constructor(pieceRoot:string)
    {
        this.guards = new Array()
        this.grips = new Array()
        this.pommels = new Array()

        var piecePaths = this.GetPiecePaths(pieceRoot)
        for(var piecePath in piecePaths)
        {
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