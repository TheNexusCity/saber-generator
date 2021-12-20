
var fs = require("fs")
var path = require("path")

const pieceRoot = "./pieces/"

var staging = require("./staging/saber-registry")

var registry = new staging.SaberRegistry(pieceRoot)

