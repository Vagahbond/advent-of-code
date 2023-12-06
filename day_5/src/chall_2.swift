import Foundation;

func parseRecMaps(lines: [String]) -> [[[Int64]]] {
    var maps = [[[Int64]]]()

    var i = 1

    var nb_maps = 0;
    while i < lines.count  {
                   // skip header and space
            i += 2

            
            while i < lines.count && !lines[i].isEmpty {
                let map = lines[i].components(separatedBy: " ").map({
                    (str: String) -> Int64 in 
                    return Int64(str) ?? 0
                })
                
                if maps.count < nb_maps + 1 {
                    maps.append([[Int64]]())
                }

                maps[nb_maps].append(map)

                i += 1
            }
            
            nb_maps += 1
        }

    return maps
}

func adapt_map(source_map: [Int64], dest_map: [Int64]) -> [Int64]? {
    if source_map[0] != source_map[1] {
        print("ADAPTING A MAP THATS NOT AN INTERVAL !!!!! sourcemap: \(source_map), dest_map: \(dest_map)")
    }


    if dest_map[1] > source_map[1] + source_map[2] || dest_map[1] + dest_map[2] < source_map[0] {
        return Optional.none
    }

    var res = [Int64]()

    if source_map[1] > dest_map[1] {
        let diff = source_map[1] - dest_map[1]
        
        res.append(dest_map[0] + diff ) 
        res.append(dest_map[1] + diff )
    } else {
        res.append(dest_map[0])
        res.append(dest_map[1])
    }

    let max_bound = [source_map[1] + source_map[2], dest_map[1] + dest_map[2]].min()!


    res.append(max_bound - res[1]) 

    return Optional.some(res)
}

    

func default_map(maps: [[Int64]], current_map: [Int64]) -> [Int64] {
    // avoid overlap
    var def = current_map
    
    for map in maps {
        // map's start is inside current map
        if map[1] < def[1] + def[2] && map[1] > def[1]  {
            let diff = map[1] - def[1]
            def[2] = diff
        }

        //map's end is inside current_map
        let map_end = map[1] + map[2]
        if (map_end > def[1] && map_end < def[1] + def[2]) {
            def[0] = map_end
            def[1] = map_end
        }

    }

    // print("default generated : \(def), for  current_map \(current_map), maps \(maps)")
    return def
}

func explore(maps: [[[Int64]]], current_map: [Int64], depth: Int = 0) -> Int64 {
    let offset_current_map = [current_map[0], current_map[0], current_map[2]]

    if maps.count == depth {
        return offset_current_map[0]
    }
    
    var explored_maps = [Int64]()

    let maps_to_explore = maps[depth] 

    for map_to_explore in maps[depth] {
            // print("current map \(current_map) offset map \(offset_current_map) exploring \(map_to_explore) adapted to \(adapted), depth: \(depth)")

        if let adapted = adapt_map(source_map: offset_current_map, dest_map: map_to_explore) { 

            let explored = explore(maps: maps, current_map: adapted, depth:  depth + 1) 
            explored_maps.append(explored);
        }
    }

    if explored_maps.isEmpty {
        let def = default_map(maps: maps_to_explore, current_map: offset_current_map)
        explored_maps.append(explore(maps: maps, current_map: def, depth:  depth + 1))
    }

    if (explored_maps.min()! == 0) {    
        print("explored_maps \(explored_maps), current_map: \(current_map), depth: \(depth)")
    }

    let res: Int64 = explored_maps.min()!
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

var c: Int = 0
let recMaps = parseRecMaps(lines: lines)


var min = Int64.max 
while c < seeds.count - 1 {
 
    
    let explored = explore(maps: recMaps, current_map:[seeds[c], seeds[c], seeds[c + 1]])
    
    if explored < min {
        min = explored
    }

    c += 2
}

print(min)

