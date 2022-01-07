import SaberAttributes, { Quality, SaberComponent } from "./saber-attributes.js"

export default class SaberPiece
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
