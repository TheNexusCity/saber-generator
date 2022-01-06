
var fs = require("fs")
var path = require("path")

const pieceRoot = "./pieces/"

var staging = require("./staging/saber-registry")

staging.RegistryStager.Stage(pieceRoot)

