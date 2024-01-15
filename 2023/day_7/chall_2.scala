def getLines(fileName: String): Array[String] = scala.io.Source.fromFile(fileName).mkString.split("\n")

class Hand(cards: String, bid: Int){
  val mCards: String = cards
  val mBid: Int = bid
  
  private def addCardToCountMap(c: Map[Char, Int], n: Char): Map[Char, Int] = c ++ Map(n -> (c.get(n).getOrElse(0) + 1))
  def occurences: Map[Char, Int] = mCards.foldLeft(Map.empty[Char, Int]) (addCardToCountMap)
  def sortedOccurences: List[Int] =  {
    val nb_jokers = occurences.get('J').getOrElse(0)
    val occurences_wo_j = occurences ++ Map('J' -> 0)

    var res = occurences_wo_j.values.toList.sortWith(_ > _) 
    res.updated(0, res(0) + nb_jokers)
  }
}

object Hand {
  def fromLine(line: String): Hand = {
    val cards = line.split(" ")(0)
    val bid = line.split(" ")(1).toInt
  
    new Hand(cards, bid)
  }

  def getCardStrength(c: Char): Int = c match {
    case 'A' => 13
    case 'K' => 12
    case 'Q' => 11
    case 'J' => 0
    case 'T' => 9
    case n: Char => n.asDigit - 1
  }

  def compareHands(a: Hand, b: Hand): Boolean = {

    val scores = Array(a, b).map {(v) => v.sortedOccurences }

    var i = 0

    while (i < (scores(0).length min scores(1).length)) {

      if (scores(0)(i) != scores(1)(i)) 
        return scores(0)(i) < scores(1)(i) 
      i += 1 
    }

    i = 0
    while (i < a.mCards.length) {
      if (a.mCards(i) != b.mCards(i)) 
        return Hand.getCardStrength(a.mCards(i)) < Hand.getCardStrength(b.mCards(i))
      i += 1
    }

    throw new RuntimeException("should not happen")
    
  }
}

val hands = getLines("inputs_.txt") map (Hand.fromLine)
val ordered_bids = hands.sortWith(Hand.compareHands) map (h => h.mBid)
val ordered_hands = hands.sortWith(Hand.compareHands) map (h => h.mCards)

println(ordered_bids.zipWithIndex.map{case (value, index) => value * (index + 1)}.sum )

/*
var t_hands = Array.empty[Hand]

t_hands = t_hands :+ Hand.fromLine("AAAAA 1")
assert(t_hands(0).mCards == "AAAAA")
assert(t_hands(0).mBid == 1)

assert(t_hands(0).sortedOccurences.sameElements(Array(5)))

t_hands = t_hands :+ Hand.fromLine("AAJAA 1")
assert(t_hands(1).mCards == "AAJAA")
assert(t_hands(1).mBid == 1)

assert(t_hands(1).sortedOccurences.sameElements(Array(4, 1)))

t_hands = t_hands :+ Hand.fromLine("2333J 1")
assert(t_hands(2).mCards == "2333J")
assert(t_hands(2).mBid == 1)

assert(t_hands(2).sortedOccurences.sameElements(Array(3, 1, 1)))

t_hands = t_hands :+ Hand.fromLine("TTTJ8 1")
assert(t_hands(3).mCards == "TTTJ8")
assert(t_hands(3).mBid == 1)

assert(t_hands(3).sortedOccurences.sameElements(Array(3, 1, 1)))

t_hands = t_hands :+ Hand.fromLine("23J32 1")
assert(t_hands(4).mCards == "23J32")
assert(t_hands(4).mBid == 1)

assert(t_hands(4).sortedOccurences.sameElements(Array(2, 2, 1)))

t_hands = t_hands :+ Hand.fromLine("233J2 1")
assert(t_hands(5).mCards == "233J2")
assert(t_hands(5).mBid == 1)

assert(t_hands(5).sortedOccurences.sameElements(Array(2, 2, 1)))

t_hands = t_hands :+ Hand.fromLine("2J332 1")
assert(t_hands(6).mCards == "2J332")
assert(t_hands(6).mBid == 1)

assert(t_hands(6).sortedOccurences.sameElements(Array(2, 2, 1)))

t_hands = t_hands :+ Hand.fromLine("JJJJ8 1")
assert(t_hands(7).mCards == "JJJJ8")
assert(t_hands(7).mBid == 1)

assert(t_hands(7).sortedOccurences.sameElements(Array(4, 1)))

val t_ordered_bids = t_hands.sortWith(Hand.compareHands) map (h => h.mBid)
val t_ordered_hands = t_hands.sortWith(Hand.compareHands) map (h => h.mCards)

println("got: ")
t_ordered_hands map println
println("expected: ")
Array("AAAAA", "AAJAA", "AAJAA", "JJJJ8", "TTTJ8", "2333J", "2J332", "23J32", "233J2") map println
assert(t_ordered_hands.sameElements(Array("AAAAA", "AAJAA",  "JJJJ8", "TTTJ8", "2333J", "2J332", "23J32", "233J2")))
 
var t_i = t_ordered_bids.length - 1
var t_res = 0;

 while (t_i >= 0) {
  println(t_ordered_hands(t_i))
  t_res = t_res + t_ordered_bids(t_i) * (t_i + 1)
  t_i -= 1
} 

println(t_res)


*/
