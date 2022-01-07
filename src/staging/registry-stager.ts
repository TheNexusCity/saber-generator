import fs from "fs"
import path from "path"
import { SaberComponent } from "@core/saber-attributes.js"
import SaberPiece from "@core/saber-piece.js"
import SaberRegistry from "@core/saber-registry.js"

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