"""
LifeLens AI — Allergen Dictionary

Comprehensive, extensible allergen synonym database.
Each allergen maps to a list of known ingredient names, derivatives, and synonyms.
This list is NOT exhaustive — users should always verify with the manufacturer.
"""

ALLERGEN_DICTIONARY = {
    "milk": {
        "display_name": "Milk / Dairy",
        "terms": [
            "milk", "dairy", "butter", "cheese", "cream", "curd", "curds",
            "ghee", "casein", "caseinate", "sodium caseinate", "calcium caseinate",
            "whey", "whey protein", "whey powder", "lactose", "lactalbumin",
            "lactoglobulin", "lactoferrin", "yogurt", "yoghurt", "dahi",
            "paneer", "khoa", "khoya", "mawa", "condensed milk",
            "evaporated milk", "skimmed milk", "skim milk", "whole milk",
            "milk powder", "milk solids", "milk fat", "buttermilk",
            "butterfat", "butter oil", "cream cheese", "cottage cheese",
            "ricotta", "mozzarella", "parmesan", "gouda", "cheddar",
            "half and half", "half-and-half", "sour cream", "ice cream",
            "custard", "pudding mix", "nougat", "galactose",
            "hydrolysate", "casein hydrolysate", "rennet casein",
            "dulce de leche", "malted milk"
        ],
        "partial_matches": [
            "milk", "dairy", "cream", "butter", "cheese", "whey", "casein",
            "lacto", "lact"
        ]
    },
    "eggs": {
        "display_name": "Eggs",
        "terms": [
            "egg", "eggs", "egg white", "egg yolk", "egg powder",
            "dried egg", "egg solids", "egg protein", "egg lecithin",
            "albumin", "albumen", "globulin", "lysozyme", "mayonnaise",
            "meringue", "ovalbumin", "ovomucin", "ovomucoid", "ovovitellin",
            "ovoglobulin", "livetin", "egg wash", "egg nog", "eggnog",
            "anda", "surimi"
        ],
        "partial_matches": [
            "egg", "albumin", "ovo"
        ]
    },
    "peanuts": {
        "display_name": "Peanuts",
        "terms": [
            "peanut", "peanuts", "groundnut", "groundnuts", "arachis",
            "arachis oil", "arachis hypogaea", "peanut butter",
            "peanut flour", "peanut oil", "peanut protein",
            "monkey nuts", "earth nuts", "beer nuts",
            "moongphali", "mungfali", "shengdana"
        ],
        "partial_matches": [
            "peanut", "groundnut", "arachis"
        ]
    },
    "tree_nuts": {
        "display_name": "Tree Nuts",
        "terms": [
            "almond", "almonds", "cashew", "cashews", "walnut", "walnuts",
            "pecan", "pecans", "pistachio", "pistachios", "macadamia",
            "hazelnut", "hazelnuts", "filbert", "brazil nut", "brazil nuts",
            "pine nut", "pine nuts", "chestnut", "chestnuts",
            "praline", "marzipan", "almond paste", "nougat",
            "gianduja", "pesto", "nut butter", "nut meal", "nut flour",
            "nut oil", "nut paste", "nut extract",
            "badam", "kaju", "akhrot", "pista",
            "coconut"
        ],
        "partial_matches": [
            "almond", "cashew", "walnut", "pecan", "pistachio",
            "macadamia", "hazelnut", "filbert", "praline", "marzipan",
            "nut"
        ]
    },
    "soy": {
        "display_name": "Soy / Soya",
        "terms": [
            "soy", "soya", "soybean", "soybeans", "soy protein",
            "soy lecithin", "soy flour", "soy milk", "soy sauce",
            "soy oil", "soybean oil", "soy isolate",
            "soy protein isolate", "soy protein concentrate",
            "textured soy protein", "textured vegetable protein",
            "tvp", "tofu", "tempeh", "miso", "edamame",
            "soya chunks", "soy granules", "soy nuggets",
            "hydrolyzed soy protein", "soy fiber"
        ],
        "partial_matches": [
            "soy", "soja"
        ]
    },
    "wheat": {
        "display_name": "Wheat / Gluten",
        "terms": [
            "wheat", "wheat flour", "whole wheat", "wheat starch",
            "wheat protein", "wheat germ", "wheat bran", "wheat gluten",
            "gluten", "flour", "all-purpose flour", "bread flour",
            "cake flour", "pastry flour", "semolina", "durum",
            "farina", "couscous", "bulgur", "spelt", "kamut",
            "einkorn", "emmer", "triticale", "seitan",
            "bread crumbs", "breadcrumbs", "cracker meal",
            "maida", "atta", "suji", "sooji", "rava", "daliya",
            "modified food starch", "modified wheat starch",
            "hydrolyzed wheat protein"
        ],
        "partial_matches": [
            "wheat", "gluten", "semolina", "durum", "flour"
        ]
    },
    "sesame": {
        "display_name": "Sesame",
        "terms": [
            "sesame", "sesame seeds", "sesame oil", "sesame paste",
            "tahini", "halvah", "halva", "hummus",
            "sesame flour", "sesame protein", "sesame salt",
            "gomashio", "til", "gingelly", "gingelly oil",
            "til oil", "nuvvulu"
        ],
        "partial_matches": [
            "sesame", "tahini", "gingelly", "til"
        ]
    },
    "fish": {
        "display_name": "Fish",
        "terms": [
            "fish", "cod", "salmon", "tuna", "sardine", "sardines",
            "anchovy", "anchovies", "herring", "mackerel", "trout",
            "bass", "haddock", "halibut", "perch", "pollock",
            "tilapia", "catfish", "swordfish", "mahi mahi",
            "fish sauce", "fish oil", "fish paste", "fish stock",
            "fish gelatin", "fish extract", "surimi",
            "worcestershire sauce", "caesar dressing",
            "machli", "meen", "chapa"
        ],
        "partial_matches": [
            "fish", "anchov", "sardine", "salmon", "tuna"
        ]
    },
    "shellfish": {
        "display_name": "Crustacean Shellfish",
        "terms": [
            "shellfish", "shrimp", "prawn", "prawns", "crab",
            "lobster", "crayfish", "crawfish", "langoustine",
            "scampi", "krill", "barnacle",
            "crustacean", "crustaceans",
            "shrimp paste", "shrimp sauce",
            "jhinga", "jheenga", "chemmin"
        ],
        "partial_matches": [
            "shrimp", "prawn", "crab", "lobster", "crustacean",
            "shellfish", "crawfish", "crayfish"
        ]
    }
}


# Precautionary statement patterns
PRECAUTIONARY_PATTERNS = [
    "may contain",
    "may contain traces of",
    "may contain traces",
    "traces of",
    "produced in a facility that also processes",
    "produced in a facility that processes",
    "manufactured in a facility that processes",
    "manufactured in a facility that also processes",
    "manufactured on equipment that also processes",
    "manufactured on equipment that processes",
    "manufactured on equipment",
    "manufactured on shared equipment",
    "produced on shared equipment",
    "processed in a facility",
    "made in a facility",
    "made on equipment",
    "not suitable for",
    "contains traces",
    "cross contamination",
    "cross-contamination",
    "shared equipment",
    "shared facility",
    "same facility",
    "same line",
    "same equipment"
]


# Common "contains" declaration patterns
CONTAINS_PATTERNS = [
    "contains:",
    "contains",
    "allergens:",
    "allergen information:",
    "allergy advice:",
    "allergy information:",
    "for allergens see ingredients in bold",
    "for allergens, see ingredients"
]


def get_all_allergen_terms():
    """Return a flat dict mapping each term to its allergen category."""
    term_map = {}
    for allergen_id, data in ALLERGEN_DICTIONARY.items():
        for term in data['terms']:
            term_map[term.lower()] = allergen_id
    return term_map


def get_allergen_display_name(allergen_id):
    """Get the display name for an allergen."""
    if allergen_id in ALLERGEN_DICTIONARY:
        return ALLERGEN_DICTIONARY[allergen_id]['display_name']
    return allergen_id.replace('_', ' ').title()
