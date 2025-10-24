package utils

import (
	srand "crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"math/rand"
	"os"
	"strings"

	"golang.org/x/crypto/argon2"
	"golang.org/x/crypto/bcrypt"
)

var nouns []string = []string{"able", "accord", "act", "action", "active", "actor", "addax", "adult", "advice", "africa", "age", "agency", "agenda", "air", "airbus", "airplane", "alarm", "alibi", "alley", "alloy", "alpaca", "alto", "amago", "amount", "angel", "anger", "angle", "angler", "angora", "animal", "anime", "ankle", "answer", "ant", "aoudad", "ape", "appeal", "apple", "april", "arch", "archer", "area", "arena", "argali", "argon", "aries", "arm", "armor", "army", "arrow", "art", "aruana", "ash", "asia", "ass", "aster", "atm", "atom", "attack", "attic", "audio", "august", "aunt", "aura", "author", "automobile", "avenue", "ayu", "babies", "baboon", "baby", "back", "bacon", "badge", "badger", "bag", "bagel", "bail", "bait", "baker", "bakery", "ball", "balloon", "bamboo", "banana", "band", "bangle", "bango", "bangu", "banjo", "bank", "banker", "bar", "barb", "barbel", "barber", "barge", "barium", "base", "basin", "basket", "bass", "bat", "bath", "battle", "bay", "beach", "bead", "beam", "bean", "bear", "beard", "beast", "beat", "beauty", "beaver", "bed", "bee", "beech", "beef", "beer", "beet", "beetle", "beggar", "belief", "bell", "belt", "bench", "bengal", "beret", "berry", "betta", "betty", "bichir", "bigeye", "bike", "bill", "birch", "bird", "birth", "bison", "bit", "bite", "black", "blade", "blast", "bleak", "blenny", "block", "blood", "blouse", "blow", "blue", "boar", "board", "boat", "bobcat", "body", "boga", "bolt", "bomb", "bomber", "bone", "bongo", "bonito", "bonsai", "book", "boot", "border", "boron", "boston", "botany", "bottle", "bottom", "bow", "bowfin", "bowl", "box", "boy", "bra", "brace", "brain", "brake", "branch", "brand", "brandy", "brass", "brazil", "bread", "break", "bream", "breath", "breeze", "brian", "brick", "bridge", "broker", "bronze", "brow", "brown", "brush", "bubble", "buck", "bucket", "budget", "buffer", "buffet", "bug", "buggy", "bugle", "bulb", "bull", "bumper", "bun", "bunny", "burbot", "buri", "burma", "burn", "burro", "burst", "bus", "bush", "butane", "butter", "button", "cable", "cactus", "cafe", "cake", "calf", "call", "camel", "camera", "camp", "can", "canada", "canary", "cancer", "candle", "canna", "cannon", "canoe", "canvas", "cap", "car", "carbon", "card", "care", "carol", "carp", "carrot", "cart", "cartoon", "case", "cash", "cast", "cat", "catla", "catsup", "cattle", "caucus", "cause", "cave", "cd", "cedar", "celery", "cell", "cellar", "cello", "cement", "cent", "cereal", "cerium", "cesium", "chain", "chair", "chalk", "chance", "change", "char", "chard", "check", "cheek", "cheese", "cheetah", "chef", "cheque", "cherry", "chess", "chest", "chick", "chief", "child", "chill", "chime", "chin", "china", "chip", "chive", "chord", "chrome", "chub", "church", "cicada", "cinema", "cipher", "circle", "cirrus", "cisco", "city", "civet", "clam", "class", "claus", "clave", "clef", "clerk", "click", "client", "climb", "clock", "close", "closet", "cloth", "cloud", "cloudy", "clover", "club", "clutch", "coach", "coal", "coast", "coat", "coati", "cobalt", "cobia", "cobweb", "cock", "cocoa", "coconut", "cod", "code", "codlet", "coffee", "coil", "coin", "coke", "cold", "collar", "colon", "colony", "color", "colt", "column", "comb", "comedy", "comet", "comic", "comma", "condor", "cone", "conga", "congo", "cony", "cook", "copper", "copy", "cord", "core", "cork", "corn", "corner", "cornet", "corset", "cost", "cotton", "couch", "cougar", "cough", "count", "course", "court", "cousin", "cover", "cow", "coyote", "crab", "crack", "crate", "crayon", "cream", "credit", "creek", "crib", "crime", "crocus", "crook", "crop", "cross", "crow", "crowd", "crown", "crush", "crust", "cry", "cub", "cuban", "cuchia", "cup", "curium", "curler", "curtain", "curve", "cut", "cycle", "cymbal", "dab", "dace", "dad", "dahlia", "daisy", "damage", "dance", "dancer", "danger", "daniel", "danio", "darter", "dash", "data", "date", "datum", "david", "day", "dead", "deal", "death", "debt", "debtor", "decade", "deck", "deer", "degree", "deity", "delete", "den", "denim", "desert", "design", "desire", "desk", "detail", "device", "devil", "dew", "diamond", "dibble", "digger", "dill", "dime", "dimple", "dinghy", "dingo", "dinner", "dirt", "disc", "discus", "dish", "disk", "diver", "diving", "dock", "doctor", "doe", "dog", "doll", "dollar", "dolphin", "domain", "donald", "dongle", "donkey", "donna", "door", "dorab", "dorado", "dory", "dot", "double", "doubt", "dove", "dragon", "drain", "drake", "drama", "draw", "drawer", "dream", "dress", "drill", "drink", "drive", "driver", "drone", "drop", "drug", "drum", "dry", "dryer", "duck", "dugong", "dugout", "dust", "eagle", "ear", "earth", "ease", "east", "edge", "edger", "editor", "edward", "eel", "effect", "egg", "eggnog", "egypt", "eight", "eland", "elbow", "elder", "elephant", "elk", "elver", "email", "emerald", "emery", "end", "enemy", "energy", "engine", "eon", "epoch", "epoxy", "era", "erbium", "ermine", "error", "europe", "event", "ewe", "exit", "expert", "eye", "face", "fact", "factor", "faith", "falce", "fall", "family", "fan", "fang", "farm", "farmer", "fat", "fate", "father", "faucet", "fawn", "fax", "fear", "feast", "feet", "felony", "female", "fence", "fender", "ferret", "ferry", "fetish", "fiber", "fibre", "field", "fifth", "fight", "file", "filly", "film", "finch", "find", "fine", "finger", "fir", "fire", "fired", "fish", "fix", "flag", "flame", "flamingo", "flare", "flash", "flat", "flavor", "flax", "flesh", "flight", "float", "flock", "flood", "floor", "flour", "flower", "flute", "fly", "foam", "fog", "fold", "folder", "font", "food", "foot", "force", "forest", "fork", "form", "format", "forum", "four", "fowl", "fox", "frame", "france", "free", "freeze", "french", "freon", "friday", "fridge", "friend", "frog", "front", "frost", "frown", "fruit", "fry", "fuel", "fund", "fur", "fuscia", "galaxy", "galley", "gallon", "game", "gander", "gar", "garage", "garden", "garlic", "gas", "gate", "gator", "gauge", "gaze", "gear", "geese", "gemini", "gender", "george", "german", "ghana", "ghetto", "ghost", "ghoul", "giant", "gila", "giraffe", "girdle", "girl", "glass", "glider", "glove", "glue", "gluten", "gnu", "goal", "goat", "goby", "god", "gold", "golf", "gong", "goose", "gopher", "grade", "grain", "gram", "grape", "grass", "grasshopper", "gray", "grease", "greece", "greek", "green", "grey", "grill", "grip", "groove", "ground", "group", "grouse", "growth", "grunt", "guide", "guilt", "guilty", "guitar", "gulper", "gum", "gun", "gunnel", "guppy", "guru", "gut", "guy", "gym", "hacker", "hail", "hair", "hake", "hakea", "hall", "hamlet", "hammer", "hand", "handle", "harbor", "hare", "harp", "hash", "hat", "hate", "hawk", "head", "health", "heap", "heart", "heat", "heaven", "hedge", "height", "helen", "helium", "hell", "helmet", "help", "hemp", "hen", "herd", "heron", "hill", "hip", "hippo", "hockey", "hoe", "hog", "hole", "home", "honey", "hood", "hook", "hope", "horn", "horror", "horse", "hose", "hot", "hotel", "hour", "house", "hub", "hubcap", "huchen", "human", "humor", "hunt", "hyena", "ibex", "ice", "icicle", "icon", "ide", "idea", "idol", "iguana", "ilisha", "image", "impala", "inanga", "inch", "income", "index", "india", "indium", "iniom", "ink", "input", "insect", "iodine", "iran", "iraq", "iris", "iron", "island", "israel", "issue", "italy", "jack", "jackal", "jacket", "jade", "jaguar", "jail", "jam", "james", "japan", "jar", "jargon", "jason", "jaw", "jeans", "jeep", "jeff", "jelly", "jenny", "jerboa", "jet", "jewel", "jitter", "john", "join", "joke", "joseph", "judge", "judo", "juice", "july", "jumbo", "jump", "jumper", "june", "jungle", "jury", "jute", "kale", "kalium", "kaluga", "kangaroo", "kanyu", "karate", "karen", "kayak", "kendo", "kenya", "kettle", "kevin", "key", "kick", "kid", "kidney", "king", "kiss", "kite", "kitten", "kitty", "knee", "knife", "knight", "knot", "koala", "koi", "kokopu", "koodoo", "korean", "kudzu", "lace", "lagena", "lake", "lamb", "lamp", "lan", "land", "laptop", "larch", "lark", "latex", "lathe", "laugh", "laura", "law", "lawyer", "layer", "lead", "leaf", "leek", "leg", "legal", "lemon", "lemur", "lenok", "lentil", "leo", "letter", "level", "liar", "libra", "lier", "life", "lift", "light", "lightning", "lilac", "lily", "limia", "limit", "linda", "line", "linen", "ling", "link", "lion", "lip", "liquid", "liquor", "lisa", "list", "litter", "liver", "lizard", "llama", "loach", "loaf", "loan", "lock", "locket", "locust", "look", "loss", "lotion", "lotus", "lounge", "louvar", "love", "low", "lumber", "lump", "lunch", "lung", "lunge", "lute", "lycra", "lynx", "lyre", "lyric", "madtom", "magic", "magma", "magnolia", "maid", "mail", "makeup", "male", "mall", "mallet", "man", "mango", "mantle", "mantra", "manx", "map", "maple", "maraca", "marble", "march", "mare", "margin", "maria", "mark", "market", "marlin", "mars", "marten", "mary", "mask", "mass", "match", "math", "may", "meal", "meat", "medaka", "media", "medium", "melody", "memory", "men", "menu", "metal", "meter", "mexico", "miasma", "mice", "middle", "mile", "milk", "mimosa", "mind", "mine", "mink", "minnow", "mint", "minute", "mirror", "mist", "mitten", "moat", "mob", "modem", "mohawk", "mola", "mole", "molly", "mom", "monday", "money", "monkey", "month", "mood", "moon", "moose", "mora", "mosque", "mother", "motion", "motorcycle", "mountain", "mouse", "mouth", "move", "movie", "mrigal", "mule", "mullet", "murder", "muscle", "museum", "music", "musk", "mynah", "nail", "name", "nancy", "napkin", "nase", "nation", "nature", "neck", "need", "needle", "neon", "nepal", "nephew", "nerve", "nest", "net", "news", "newt", "ngine", "nic", "nickel", "niece", "night", "nine", "node", "noise", "noodle", "north", "nose", "note", "notify", "nova", "novel", "nuke", "number", "nurse", "nut", "nylon", "oak", "oat", "object", "oboe", "ocean", "ocelot", "octave", "octopus", "offer", "office", "oil", "okapi", "okra", "old", "olive", "one", "onion", "opah", "open", "opera", "option", "orange", "orchestra", "orchid", "order", "oreo", "organ", "oryx", "osmium", "other", "otter", "ounce", "output", "oval", "oven", "owl", "owner", "ox", "oxygen", "oyster", "pack", "packet", "pacus", "page", "pail", "pain", "paint", "pair", "pajama", "palm", "pan", "panda", "pansy", "pantry", "pants", "panty", "paper", "parade", "parcel", "parent", "park", "parrot", "part", "party", "pass", "pasta", "paste", "pastor", "pastry", "patch", "path", "patio", "paul", "pea", "peace", "peach", "peak", "peanut", "pear", "peen", "pen", "pencil", "penguin", "penny", "peony", "pepper", "perch", "period", "person", "peru", "pest", "pet", "petrol", "phlox", "phoenix", "phone", "photo", "piano", "pickle", "pie", "piece", "pig", "pigeon", "pike", "pile", "pill", "pillow", "pilot", "pimple", "pin", "pine", "pineapple", "ping", "pink", "pint", "pipe", "piracy", "pirate", "pisces", "pistol", "pitch", "pizza", "place", "plaice", "plain", "plane", "planet", "plant", "plate", "platy", "play", "pleco", "plier", "plot", "plough", "plow", "pluto", "pocket", "poet", "point", "poison", "poland", "pole", "police", "polish", "polo", "pond", "pony", "poppy", "porch", "porgy", "port", "porter", "possum", "pot", "potato", "pound", "powder", "powen", "power", "prairie", "press", "price", "priest", "print", "prison", "profit", "prose", "pruner", "public", "puffin", "pull", "puma", "pump", "punch", "pup", "puppy", "purple", "push", "pvc", "pyjama", "quagga", "quail", "quart", "quartz", "queen", "quiet", "quill", "quilt", "quince", "quit", "quiver", "rabbi", "rabbit", "raccoon", "race", "racing", "radar", "radio", "radish", "radium", "radon", "raft", "rage", "raid", "rail", "rain", "rake", "ram", "ramie", "random", "range", "rap", "rat", "rate", "ratio", "raven", "ray", "rayon", "reason", "recess", "record", "red", "refund", "regret", "relish", "remora", "repair", "report", "rest", "result", "reward", "rhino", "rhythm", "rice", "riddle", "rifle", "right", "ring", "riot", "rise", "risk", "river", "roach", "road", "roast", "robert", "robin", "rock", "rocket", "rod", "rodent", "rohu", "roll", "ronald", "roof", "room", "root", "rose", "rosebud", "rotate", "roughy", "route", "router", "rub", "rubber", "ruby", "rudd", "ruffe", "rugby", "rule", "run", "rush", "russia", "rust", "ruth", "sabalo", "sack", "safe", "sail", "sailor", "salad", "salary", "sale", "saliva", "salmon", "salt", "sampan", "sand", "sandra", "santa", "sarah", "satin", "saturn", "sauce", "sauger", "saury", "save", "saw", "sax", "scale", "scarf", "scat", "scene", "scent", "school", "screen", "screw", "scup", "sea", "seal", "search", "season", "seat", "second", "secret", "secure", "seed", "seeder", "select", "self", "sense", "server", "seven", "sex", "shad", "shade", "shadow", "shake", "shame", "shape", "share", "shark", "sharon", "shears", "sheep", "sheet", "shelf", "shell", "shield", "shiner", "ship", "shirt", "shoal", "shock", "shoe", "shop", "shore", "shorts", "shot", "shovel", "show", "shrew", "shrimp", "shrine", "shrub", "side", "sight", "sign", "silica", "silk", "silver", "sing", "singer", "single", "sink", "siren", "sister", "sitter", "six", "size", "skate", "skates", "skiing", "skill", "skin", "skirt", "skunk", "sky", "slash", "slave", "sled", "sleep", "sleet", "slice", "slide", "slime", "slip", "slope", "sloth", "slum", "small", "smash", "smell", "smelt", "smile", "smoke", "snail", "snake", "sneeze", "snoek", "snook", "snow", "soap", "soccer", "sock", "socks", "soda", "sodium", "sofa", "soil", "sole", "son", "song", "sorrow", "sort", "soul", "sound", "soup", "soy", "space", "spade", "spain", "spam", "spark", "sparrow", "spear", "sphere", "sphynx", "spider", "spike", "spleen", "sponge", "spoon", "spork", "spot", "sprat", "spread", "spring", "sprout", "spruce", "spy", "square", "squash", "squid", "squirrel", "stage", "stamp", "star", "start", "state", "steam", "steel", "steer", "stem", "step", "steven", "stew", "stick", "stitch", "stock", "stone", "stool", "stop", "store", "stork", "storm", "story", "stove", "straw", "stream", "street", "string", "study", "stuff", "subway", "sucker", "sudan", "suede", "sugar", "suit", "sulfur", "summer", "sun", "sunday", "supper", "supply", "susan", "sushi", "swamp", "swan", "sweets", "swim", "swing", "swiss", "switch", "sword", "sycamore", "syria", "syrup", "system", "table", "tail", "tailor", "taimen", "taiwan", "talk", "talon", "tan", "tang", "tank", "tanker", "tapir", "target", "tarpon", "task", "taste", "taurus", "tax", "taxi", "tea", "team", "teapot", "tear", "teeth", "teller", "temper", "temple", "tempo", "ten", "tench", "tendon", "tennis", "tenor", "tent", "tenuis", "terrain", "test", "tetra", "text", "theory", "thing", "thomas", "thread", "three", "thrill", "throat", "throne", "thumb", "ticket", "tide", "tie", "tiger", "tights", "tile", "tim", "time", "timer", "tin", "tip", "tire", "titan", "title", "toad", "toast", "toe", "toilet", "tom", "tomato", "ton", "tone", "tongue", "tool", "tooth", "top", "tope", "torque", "touch", "towel", "tower", "town", "toy", "track", "trade", "trail", "train", "tramp", "trance", "trash", "tray", "tree", "trial", "trick", "trip", "trout", "trowel", "truck", "true", "trumpet", "trunk", "trust", "truth", "tub", "tuba", "tube", "tulip", "tuna", "tune", "turbot", "turkey", "turn", "turnip", "turret", "turtle", "tv", "twig", "twine", "twist", "two", "tyvek", "uganda", "umbrella", "uncle", "unicorn", "unit", "use", "user", "vacuum", "valley", "value", "van", "vase", "vault", "veil", "vein", "velvet", "venus", "vermin", "verse", "vessel", "vest", "vicuna", "video", "view", "villa", "vimba", "vine", "vinyl", "viola", "violet", "violin", "virgo", "virus", "vise", "vision", "voice", "volume", "voodoo", "voyage", "wahoo", "waiter", "walk", "wall", "wallet", "walrus", "walu", "war", "warm", "wash", "washer", "wasp", "waste", "watch", "water", "wave", "wax", "way", "wealth", "weapon", "weasel", "wedge", "weed", "weeder", "week", "weever", "weight", "whale", "wheat", "wheel", "whiff", "whip", "white", "whorl", "willow", "win", "wind", "window", "wine", "wing", "winter", "wire", "wish", "witch", "wolf", "woman", "wombat", "women", "wonder", "wood", "wool", "woolen", "word", "work", "world", "worm", "wound", "wrasse", "wren", "wrench", "wrist", "writer", "xenon", "yacht", "yak", "yam", "yard", "yarn", "year", "yellow", "yew", "yogurt", "yoke", "zander", "zebra", "zebu", "zephyr", "zero", "ziege", "zinc", "zingel", "zipper", "zombie", "zone", "zoo"}
var adjectives []string = []string{"aback", "abaft", "abject", "ablaze", "able", "aboard", "above", "abrupt", "absent", "absurd", "aching", "acid", "acidic", "acrid", "active", "actual", "acute", "added", "adept", "adhoc", "adored", "afraid", "aged", "agile", "agreed", "ahead", "ajar", "alert", "alike", "alive", "all", "allied", "alone", "aloof", "ample", "amuck", "amused", "ancient", "angry", "annual", "antique", "antiquet", "antsy", "any", "apt", "aqua", "aquatic", "arab", "arctic", "arid", "armed", "asian", "asleep", "astral", "atomic", "aural", "awake", "aware", "awful", "baby", "back", "bad", "baggy", "baked", "bare", "barren", "basic", "batty", "bawdy", "beefy", "bent", "best", "better", "big", "biting", "bitter", "black", "bland", "blank", "bleak", "blind", "blond", "blonde", "bloody", "blue", "bogus", "bold", "bony", "bored", "boring", "bossy", "both", "bottle", "bottled", "bottom", "bouncy", "bowed", "brainy", "brash", "brave", "brawny", "breeze", "breezy", "brief", "bright", "brisk", "broad", "broken", "bronze", "brown", "bubbly", "bulky", "bumpy", "burly", "busty", "busy", "calm", "candid", "canine", "caring", "casual", "causal", "charming", "cheap", "cheeky", "cheerful", "cheery", "chief", "chilly", "chosen", "chubby", "chummy", "chunky", "civic", "civil", "clammy", "classy", "clean", "clear", "cleaver", "clever", "close", "closed", "cloudy", "clumsy", "coarse", "cold", "coming", "common", "cooing", "cooked", "cool", "copper", "corny", "costly", "crabby", "crafty", "craven", "crazy", "creamy", "creepy", "crisp", "crispy", "crude", "cruel", "cuddly", "curly", "curved", "curvy", "cut", "cute", "cyan", "daily", "damp", "dapper", "daring", "dark", "dead", "deadly", "deaf", "dear", "decent", "deep", "deeply", "delightful", "dense", "dental", "dim", "direct", "dirty", "dismal", "divine", "dizzy", "dopey", "doting", "dotted", "double", "down", "drab", "drafty", "dreary", "droopy", "drunk", "dry", "dual", "due", "dull", "dusty", "dutch", "dying", "dynamic", "each", "eager", "early", "earthy", "east", "easy", "edible", "eerie", "eight", "elated", "eldest", "elegant", "elfin", "elite", "emerald", "empty", "entire", "equal", "erect", "ethnic", "even", "every", "evil", "exact", "excess", "excited", "exotic", "expert", "extra", "faded", "faint", "fair", "fake", "false", "famous", "fancy", "far", "fast", "fat", "fatal", "faulty", "fearless", "feeble", "feisty", "feline", "fellow", "female", "festive", "few", "fickle", "fierce", "fiery", "filthy", "final", "fine", "firm", "first", "fiscal", "fit", "five", "fixed", "flaky", "flashy", "flat", "flawed", "flimsy", "floppy", "fluffy", "fluid", "flying", "foamy", "fond", "forked", "formal", "four", "fragile", "frail", "frank", "frayed", "free", "french", "fresh", "fried", "friendly", "frigid", "frilly", "frizzy", "front", "frosty", "frothy", "frozen", "frugal", "full", "fun", "funny", "furry", "fussy", "future", "fuzzy", "gamy", "gaping", "gaudy", "gay", "gentle", "german", "giant", "giddy", "gifted", "gigantic", "given", "giving", "glad", "glass", "glib", "global", "gloomy", "glossy", "glum", "godly", "gold", "golden", "good", "goofy", "gothic", "graceful", "grand", "grateful", "gratis", "grave", "gray", "grea", "greasy", "great", "greedy", "greek", "green", "grey", "grim", "grimy", "gritty", "groovy", "gross", "grown", "grubby", "grumpy", "guilty", "gummy", "gusty", "hairy", "half", "handy", "happy", "hard", "harsh", "hasty", "head", "heady", "hearty", "heavy", "hefty", "help", "helpful", "hidden", "high", "hoarse", "hollow", "holy", "homely", "hon", "honest", "horny", "hot", "huge", "human", "humble", "hungry", "hurt", "hushed", "husky", "icky", "icy", "ideal", "idle", "ill", "imaginary", "impish", "impure", "inborn", "inc", "indian", "inland", "innate", "inner", "intact", "intent", "invisible", "iraqi", "irate", "irish", "itchy", "jade", "jaded", "jagged", "jaunty", "jazzy", "jewish", "joint", "jolly", "jovial", "joyful", "joyous", "juicy", "jumbo", "jumpy", "junior", "just", "keen", "key", "kind", "kindly", "klutzy", "knobby", "knotty", "known", "kooky", "korean", "kosher", "labour", "lame", "lanky", "large", "last", "late", "latin", "lavish", "lawful", "lazy", "leafy", "lean", "left", "legal", "lesser", "lethal", "level", "lewd", "liable", "light", "like", "likely", "lime", "limp", "linear", "lined", "liquid", "little", "live", "lively", "livid", "living", "local", "lone", "lonely", "long", "loose", "lost", "loud", "lovely", "loving", "low", "lowly", "loyal", "ltd", "lucky", "lumpy", "lunar", "lush", "lying", "macho", "mad", "madly", "magic", "magical", "main", "major", "male", "manic", "manual", "many", "marine", "marked", "mass", "mature", "meager", "mealy", "mean", "measly", "meaty", "medium", "meek", "mellow", "melodic", "melted", "mental", "mere", "merry", "messy", "mid", "middle", "mighty", "mild", "milky", "minor", "minty", "minute", "misty", "mixed", "mobile", "modern", "modest", "moist", "moldy", "moody", "moral", "muddy", "murky", "mushy", "musty", "mute", "muted", "mutual", "naive", "naked", "nappy", "narrow", "nasty", "native", "naval", "near", "nearby", "neat", "needy", "net", "new", "next", "nice", "nifty", "nimble", "nine", "nippy", "noble", "noisy", "normal", "north", "nosy", "noted", "novel", "null", "numb", "nutty", "obese", "oblong", "odd", "oily", "ok", "okay", "old", "one", "only", "onyx", "open", "oral", "orange", "ordinary", "ornate", "ornery", "other", "our", "outer", "oval", "overt", "painless", "pale", "paltry", "past", "pastel", "peaceful", "peach", "perfect", "perky", "pesky", "petite", "petty", "phobic", "phony", "pink", "placid", "plain", "plant", "plucky", "plump", "plush", "poised", "polish", "polite", "poor", "portly", "posh", "precious", "pretty", "pricey", "prime", "prior", "prize", "proper", "proud", "public", "puffy", "pumped", "puny", "pure", "purple", "pushy", "putrid", "quain", "quaint", "queasy", "quick", "quie", "quiet", "quirky", "racial", "ragged", "rainy", "random", "rapid", "rare", "rash", "raspy", "ratty", "raw", "ready", "real", "rear", "rebel", "recent", "red", "regal", "remote", "retail", "rich", "right", "rigid", "ringed", "ripe", "rising", "ritzy", "rival", "robust", "rocky", "roman", "roomy", "rosy", "rotten", "rotund", "rough", "round", "rowdy", "royal", "rubber", "ruby", "ruddy", "rude", "rugged", "ruling", "runny", "rural", "rustic", "rusty", "sacred", "sad", "safe", "salty", "same", "sandy", "sane", "sassy", "savory", "scaly", "scant", "scarce", "scared", "scary", "second", "secret", "secure", "sedate", "seemly", "select", "senior", "serene", "severe", "sexual", "shabby", "shady", "shaggy", "shaky", "shared", "sharp", "sheer", "shiny", "shoddy", "short", "showy", "shrill", "shut", "shy", "sick", "silent", "silky", "silly", "silver", "simple", "sinful", "single", "six", "skinny", "sleepy", "slender", "slight", "slim", "slimy", "sloppy", "slow", "slushy", "small", "smarmy", "smart", "smelly", "smiling", "smoggy", "smooth", "smug", "snappy", "sneaky", "snoopy", "snotty", "snug", "social", "soft", "soggy", "solar", "sole", "solid", "somber", "some", "sonic", "sordid", "sore", "sorry", "sound", "soupy", "sour", "south", "soviet", "spare", "sparse", "speedy", "spicy", "spiffy", "spiky", "spooky", "spotty", "spry", "square", "stable", "staid", "stale", "stark", "starry", "static", "steady", "steamy", "steel", "steep", "sticky", "stiff", "still", "stingy", "stormy", "stout", "strange", "strict", "strong", "stuck", "stupid", "sturdy", "subtle", "sudden", "sugary", "sulky", "sunny", "super", "superb", "sure", "svelte", "swanky", "sweaty", "sweet", "swift", "swiss", "tacit", "tacky", "tall", "tame", "tan", "tangy", "tart", "tasty", "taut", "tawdry", "teeny", "ten", "tender", "tense", "tepid", "tested", "testy", "that", "then", "these", "thick", "thin", "third", "thirsty", "this", "thorny", "those", "thoughtful", "three", "tidy", "tight", "timely", "tinted", "tiny", "tired", "top", "torn", "torpid", "tory", "total", "tough", "toxic", "tragic", "trashy", "tricky", "trim", "trite", "true", "trusty", "tubby", "twin", "two", "ugly", "ultra", "unable", "uneven", "unfair", "unfit", "unique", "united", "unripe", "unruly", "unsung", "untidy", "untrue", "unused", "unusual", "upbeat", "upper", "uppity", "upset", "urban", "urgent", "usable", "used", "useful", "usual", "utter", "vacant", "vague", "vain", "valid", "vanilla", "vapid", "varied", "vast", "verbal", "versed", "very", "vexed", "violet", "visual", "vital", "vivid", "wacky", "wan", "warm", "warped", "wary", "watery", "wavy", "weak", "weary", "webbed", "wee", "weekly", "weepy", "weird", "well", "welsh", "west", "wet", "which", "white", "whole", "wicked", "wide", "wiggly", "wild", "wilde", "wilted", "windy", "winged", "wiry", "wise", "witty", "wobbly", "woeful", "wonderful", "wooden", "woozy", "wordy", "worn", "worse", "worst", "worthy", "wrong", "wry", "yearly", "yellow", "young", "yummy", "zany", "zesty", "zigzag", "zippy", "zonked"}

func NewPassword() string {
	noun1 := nouns[rand.Intn(len(nouns))]
	noun2 := nouns[rand.Intn(len(nouns))]
	adj := adjectives[rand.Intn(len(adjectives))]
	num1 := rand.Intn(1000)
	num2 := rand.Intn(1000)
	return fmt.Sprintf("%s%03d%s%03d%s", noun1, num1, adj, num2, noun2)
}

// HashPassword takes a plaintext password and returns the hashed version of it.
//
// By default, it uses Argon2id for hashing. If the environment variable
// PASSWORD_HASH_ALGO is set to "bcrypt", it will use bcrypt instead.
func HashPassword(password string) (string, error) {
	if os.Getenv("PASSWORD_HASH_ALGO") == "bcrypt" {
		return hashBcrypt(password)
	}
	return hashArgon2(password)
}

var (
	argon2Prefix = "$argon2id$"
	bcryptPrefix = "$2"
)

// CheckPassword compares a plaintext password with a hashed password
// and returns nil if they match, or an error if they do not.
//
// It supports both Argon2id and bcrypt hashed passwords.
func CheckPassword(password, hashedPassword string) error {
	var err error
	if strings.HasPrefix(hashedPassword, argon2Prefix) {
		err = verifyArgon2(password, hashedPassword)
	} else if strings.HasPrefix(hashedPassword, bcryptPrefix) {
		err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	} else {

	}
	if err != nil {
		return fmt.Errorf("password verification failed: %w", err)
	}
	return nil
}

func hashBcrypt(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 8)
	if err != nil {
		return "", fmt.Errorf("failed to hash default admin password: %w", err)
	}
	newPassword := string(hashedPassword[:])
	return newPassword, nil
}

// Recommended parameters for Argon2id
var (
	memory      uint32 = 64 * 1024 // 64MB
	iterations  uint32 = 1
	parallelism uint8  = 4
	keyLen      uint32 = 32 // 32 bytes for a 256-bit key
)

type argon2Params struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLength  uint32
	keyLength   uint32
}

var ErrInvalidArgon2Hash = fmt.Errorf("invalid argon2 hash")
var ErrIncompatibleArgon2Version = fmt.Errorf("incompatible argon2 version")

func hashArgon2(password string) (string, error) {
	salt := make([]byte, 16) // 16-byte salt
	if _, err := srand.Read(salt); err != nil {
		return "", fmt.Errorf("failed to generate salt for argon2: %w", err)
	}

	derivedKey := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, keyLen)

	return encodeArgon2Hash(&argon2Params{
		memory:      memory,
		iterations:  iterations,
		parallelism: parallelism,
		saltLength:  uint32(len(salt)),
		keyLength:   uint32(len(derivedKey)),
	}, salt, derivedKey), nil
}

func verifyArgon2(password, encodedHash string) error {
	p, salt, hash, err := decodeArgon2Hash(encodedHash)
	if err != nil {
		return fmt.Errorf("failed to decode argon2 hash: %w", err)
	}

	derivedKey := argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, p.keyLength)

	if subtle.ConstantTimeCompare(hash, derivedKey) == 1 {
		return nil
	}
	return fmt.Errorf("password verification failed: %w", err)
}

func encodeArgon2Hash(p *argon2Params, salt, hash []byte) string {
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	encodedHash := fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, p.memory, p.iterations, p.parallelism, b64Salt, b64Hash)

	return encodedHash
}

func decodeArgon2Hash(encodedHash string) (p *argon2Params, salt, hash []byte, err error) {
	vals := strings.Split(encodedHash, "$")
	if len(vals) != 6 {
		return nil, nil, nil, ErrInvalidArgon2Hash
	}

	var version int
	_, err = fmt.Sscanf(vals[2], "v=%d", &version)
	if err != nil {
		return nil, nil, nil, err
	}
	if version != argon2.Version {
		return nil, nil, nil, ErrIncompatibleArgon2Version
	}

	p = &argon2Params{}
	_, err = fmt.Sscanf(vals[3], "m=%d,t=%d,p=%d", &p.memory, &p.iterations, &p.parallelism)
	if err != nil {
		return nil, nil, nil, err
	}

	salt, err = base64.RawStdEncoding.Strict().DecodeString(vals[4])
	if err != nil {
		return nil, nil, nil, err
	}
	p.saltLength = uint32(len(salt))

	hash, err = base64.RawStdEncoding.Strict().DecodeString(vals[5])
	if err != nil {
		return nil, nil, nil, err
	}
	p.keyLength = uint32(len(hash))

	return p, salt, hash, nil
}
