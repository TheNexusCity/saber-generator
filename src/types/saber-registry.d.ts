
import * as fs from "fs"
import * as path from "path"
import { Quality, SaberComponent } from "../editor/loadedPiece"

export class SaberAttributes
{
    quality:Quality
    component:SaberComponent
}

export class SaberPiece
{
    name:string
    glbPath:string
    thumbnailPath:string
    attributes:SaberAttributes
    constructor(_glbPath:string)
}

export class SaberRegistry
{
    grips:Array<SaberPiece>
    guards:Array<SaberPiece>
    pommels:Array<SaberPiece>

    composites:Array<SaberPiece>

    constructor()
}

export class RegistryStager
{
    static GetPiecePaths(pieceRoot:string):Array<string>


    public static Stage(pieceRoot:string):SaberRegistry
}