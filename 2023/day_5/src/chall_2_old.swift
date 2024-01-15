import Foundation;

func runSeed(seed: Int64, lines: [String], maps: [[Int64]]) -> Int64 {
    var res = seed

    var op = false;

    for map in maps {
        if map[3] == 0 {
            op = false
        }


        if seed >= map[1] && seed < map[1] + map[2] && !op  {

            res = res - (map[1] - map[0])
            op = true
        }

    }

        return res
}



// Read lines from a file on the file system
let path = "./inputs_.txt"
let fileContents = try String(contentsOfFile: path, encoding: String.Encoding.utf8)
let lines = fileContents.components(separatedBy: "\n")

var seeds = lines[0].components(separatedBy: " ").map({
        (str: String) -> Int64 in 
        return Int64(str) ?? 0
})

seeds = Array(seeds[1...seeds.count-1])

var total_iter: Int64 = 0
var current_iters: Int64 = 0;
var c: Int = 0

while c < seeds.count - 1 {
    total_iter += seeds[c + 1]
    c += 2
}


var maps = [[Int64]]()

var i = 1

while i < lines.count  {
        // skip header and space
        i += 2

        var nb_lines: Int64 = 0;

        while i < lines.count && !lines[i].isEmpty {
            var map = lines[i].components(separatedBy: " ").map({
                (str: String) -> Int64 in 
                return Int64(str) ?? 0
            })
            
            map.append(nb_lines)
            maps.append(map)
        

            nb_lines += 1

            i += 1

        }
    }


c = 0

var min = Int64.max 
while c < seeds.count - 1 {
    for cc in seeds[c]..<(seeds[c] + seeds[c + 1]) {
        
        let res = runSeed(seed: cc, lines: lines, maps:  maps)
        
        if min > res {
            min = res
        }

        if current_iters % 100000 == 0 {
            print("Done \(current_iters * 100 / total_iter)% (\(current_iters)/\(total_iter)) !")
        }
        current_iters+=1
    }


    

    c += 2
}



print(min)


