use regex::Regex;

fn read_file(filename: String) -> Vec<String> {
    // Read lines from "inputs.txt" into an array of strings and return inputs
    let contents =
        std::fs::read_to_string(filename).expect("Something went wrong reading the file");
    let inputs: Vec<String> = contents.lines().map(|s| s.to_string()).collect();
    return inputs;
}

fn parse_line(line: String, re: &regex::Regex) -> (i32, Vec<i32>, Vec<i32>) {
    println!("{}", line);

    let card_nb: i32;

    let mut winning_numbers = vec![];

    let mut scrapped_numbers = vec![];

    let caps = re.captures(line.as_str()).unwrap();

    card_nb = caps[1].parse::<i32>().unwrap();

    for i in 2..12 {
        winning_numbers.push(caps[i].parse::<i32>().unwrap());
    }

    // loop to the end of scrapped_numbers
    for i in 12..37 {
        scrapped_numbers.push(caps[i].parse::<i32>().unwrap());
    }

    println!(
        " parsed card nb : {}, found \n {:?}\n {:?}\n",
        card_nb, winning_numbers, scrapped_numbers,
    );
    return (card_nb, winning_numbers, scrapped_numbers);
}

fn main() {
    let re: regex::Regex = Regex::new(
    r"Card +(\d+): {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) \| {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2}) {1,2}(\d{1,2})",
).unwrap();

    let lines = read_file("inputs.txt".to_string());

    let mut total_score = 0;

    for i in lines.iter() {
        let mut score = 0;

        let (card_id, winning_numbers, scrapped_numbers) = parse_line(i.to_string(), &re);

        for i in winning_numbers.iter() {
            if scrapped_numbers.contains(i) {
                if score == 0 {
                    score = 1;
                } else {
                    score *= 2;
                }
            }
        }
        println!("Card {} has a score of {}", card_id, score);
        total_score += score;
    }
    println!("{}", total_score);
}
