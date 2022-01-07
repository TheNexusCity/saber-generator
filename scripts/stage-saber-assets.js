import staging from "../src/staging/registry-stager.js"
export default function Main()
{
    const pieceRoot = "./pieces/"

    staging.Stage(pieceRoot)

    console.log("Staging successful")
}
Main()

