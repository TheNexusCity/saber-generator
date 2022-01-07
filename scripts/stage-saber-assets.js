import registry from "../src/staging/saber-registry.js"
export default function Main()
{
    const pieceRoot = "./pieces/"

    registry.Stage(pieceRoot)

    console.log("Staging successful")
}
Main()

