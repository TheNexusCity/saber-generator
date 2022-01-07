import SaberPiece from "./saber-piece.js"
export default class SaberRegistry
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

