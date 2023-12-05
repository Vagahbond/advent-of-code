import Foundation;

// Read lines from a file on the file system
let path = "./inputs_.txt"
let fileContents = try String(contentsOfFile: path, encoding: String.Encoding.utf8)
let lines = fileContents.components(separatedBy: "\n")

var seeds = lines[0].components(separatedBy: " ").map({
        (str: String) -> Int in 
        return Int(str) ?? 0
})

seeds = Array(seeds[1...seeds.count-1])


var i = 1

while i < lines.count  {
    // skip header and space
    i += 2
    
    var changed = seeds.map({
        (_: Int) -> Bool in 
        return false
    })


    while i < lines.count && !lines[i].isEmpty {
        let map = lines[i].components(separatedBy: " ").map({
            (str: String) -> Int in 
            return Int(str) ?? 0
        })

                for (index, seed) in seeds.enumerated() {
            if seed >= map[1] && seed < map[1] + map[2] && !changed[index] {
                seeds[index] = seed - (map[1] - map[0])
                changed[index] = true
            }
        }
       
                print("\(seeds[1]) -> \(map)")
        i += 1
    }


}

print("Seeds: \(seeds)")
print("Result: \(seeds.min())")



