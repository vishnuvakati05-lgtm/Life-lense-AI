"""
LifeLens AI — Curated Food Additive & Ingredient Knowledge Base

Grounding data with authoritative references from:
- FSSAI (Food Safety and Standards Authority of India)
- WHO / FAO JECFA (Joint FAO/WHO Expert Committee on Food Additives)
- EFSA (European Food Safety Authority)
- US FDA (Food and Drug Administration)

Rules:
- Never equate synthetic with dangerous.
- Explain why manufacturers use it and its technical function.
- Clearly present evidence-based concerns and what is NOT known.
- Provide multilingual summaries in English, Hindi, and Telugu.
"""

from typing import Dict, Any

ADDITIVES_DB: Dict[str, Dict[str, Any]] = {
    # --- FLAVOUR ENHANCERS (600s) ---
    "621": {
        "ins_number": "INS 621",
        "e_number": "E621",
        "name": "Monosodium Glutamate",
        "common_names": ["MSG", "Ajinomoto", "Sodium Glutamate", "L-Glutamic acid sodium salt"],
        "category": "Flavour Enhancer",
        "technical_function": "Enhances umami (savory) taste profile by stimulating glutamate receptors on the tongue.",
        "why_added": "Manufacturers add MSG to savory snacks, soups, seasonings, and noodles to intensify savory flavor and reduce the amount of table salt while maintaining palatability.",
        "safety_assessment": "Approved worldwide by FSSAI, JECFA, US FDA, and EFSA. JECFA has assigned an Acceptable Daily Intake (ADI) of 'not specified' (indicating very low toxicity under standard dietary use).",
        "evidence_concerns": "Anecdotal reports of temporary sensitivity ('Chinese Restaurant Syndrome' — mild headache, numbness, flushing) have been studied in placebo-controlled double-blind trials; systematic reviews have generally failed to demonstrate a consistent causal link in the general population at normal dietary intake levels.",
        "what_we_do_not_know": "Individual sensitivity thresholds in self-reported hypersensitive individuals; exact long-term cumulative effects when combined with high-sodium ultra-processed dietary patterns.",
        "sources": [
            {"title": "JECFA Evaluation of Certain Food Additives (31st Report)", "publisher": "WHO / FAO", "year": "1988", "url": "https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2464"},
            {"title": "FSSAI Compendium of Food Additives Regulations", "publisher": "FSSAI India", "year": "2020", "url": "https://www.fssai.gov.in"},
            {"title": "Questions and Answers on Monosodium glutamate (MSG)", "publisher": "US FDA", "year": "2018", "url": "https://www.fda.gov/food/food-additives-petitions/questions-and-answers-monosodium-glutamate-msg"}
        ],
        "translations": {
            "hi": {
                "name": "मोनोसोडियम ग्लूटामेट (MSG)",
                "category": "स्वाद बढ़ाने वाला (Flavour Enhancer)",
                "why_added": "नमकीन स्नैक्स और सूप में तीखा उमामी (नमकीन) स्वाद बढ़ाने और नमक की मात्रा कम रखते हुए स्वाद बनाए रखने के लिए मिलाया जाता है।",
                "short_summary": "वैश्विक स्तर पर स्वीकृत स्वाद वर्धक। अधिकांश लोगों के लिए सुरक्षित मात्रा में मान्य।"
            },
            "te": {
                "name": "మోనోసోడియం గ్లూటామేట్ (MSG)",
                "category": "రుచి పెంచే పదార్థం (Flavour Enhancer)",
                "why_added": "ఆహారానికి ఉమామి (రుచికరమైన) రుచిని జోడించడానికి మరియు ఉప్పు వినియోగాన్ని తగ్గించడానికి ఉపయోగిస్తారు.",
                "short_summary": "ప్రపంచవ్యాప్తంగా ఆహార సంస్థలచే ఆమోదించబడిన రుచి వర్ధకం."
            }
        }
    },
    "627": {
        "ins_number": "INS 627",
        "e_number": "E627",
        "name": "Disodium Guanylate",
        "common_names": ["Sodium Guanylate", "GMP"],
        "category": "Flavour Enhancer",
        "technical_function": "Works synergistically with glutamates (MSG) to multiply savory umami intensity.",
        "why_added": "Added to noodle tastemakers, potato chips, and savory sauces alongside MSG to produce a rich savory punch at lower total additive concentrations.",
        "safety_assessment": "Evaluated by JECFA with ADI 'not specified'. Metabolized naturally into uric acid.",
        "evidence_concerns": "Individuals with gout or purine metabolic disorders are advised to monitor intake because guanylates degrade into purines.",
        "what_we_do_not_know": "Synergistic effects of ribonucleotide mixtures on gut microbiota composition in long-term human studies.",
        "sources": [
            {"title": "Toxicological Evaluation of Certain Food Additives (JECFA)", "publisher": "WHO", "year": "1993", "url": "https://apps.who.int"},
            {"title": "FSSAI Flavouring Regulations", "publisher": "FSSAI", "year": "2020", "url": "https://www.fssai.gov.in"}
        ],
        "translations": {
            "hi": {
                "name": "डाईसोडियम गुआनाइलेट (INS 627)",
                "category": "स्वाद बढ़ाने वाला (Flavour Enhancer)",
                "why_added": "मसालों और नूडल्स में उमामी स्वाद को कई गुना बढ़ाने के लिए MSG के साथ मिलाया जाता है।",
                "short_summary": "स्वीकृत स्वाद वर्धक; गाउट के रोगियों को प्यूरीन सामग्री पर ध्यान देना चाहिए।"
            },
            "te": {
                "name": "డైసోడియం గ్వానిలేట్ (INS 627)",
                "category": "రుచి పెంచే పదార్థం (Flavour Enhancer)",
                "why_added": "MSGతో కలిసి ఉమామి రుచిని మరింత బలంగా చేయడానికి ఉపయోగిస్తారు.",
                "short_summary": "ఆమోదించబడిన రుచి వర్ధకం."
            }
        }
    },
    "631": {
        "ins_number": "INS 631",
        "e_number": "E631",
        "name": "Disodium Inosinate",
        "common_names": ["Sodium Inosinate", "IMP"],
        "category": "Flavour Enhancer",
        "technical_function": "Umami synergist that enhances meaty and savory flavors when combined with MSG.",
        "why_added": "Frequently paired with INS 627 and INS 621 in chips, snacks, and seasonings to give a balanced savory taste.",
        "safety_assessment": "Approved by JECFA with ADI 'not specified'. Recognized safe by FSSAI and EFSA.",
        "evidence_concerns": "Breaks down into uric acid; caution for individuals sensitive to dietary purines or with gout.",
        "what_we_do_not_know": "May be derived from animal (meat/fish) or tapioca/microbial fermentation; origin is not always declared on Indian packaging unless vegetarian mark is present.",
        "sources": [
            {"title": "JECFA Evaluation: Disodium Inosinate", "publisher": "WHO / FAO", "year": "1993", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "डाईसोडियम इनोसिनेट (INS 631)",
                "category": "स्वाद बढ़ाने वाला (Flavour Enhancer)",
                "why_added": "स्नैक्स में नमकीन और चटपटा स्वाद बढ़ाने के लिए MSG के साथ प्रयुक्त होता है।",
                "short_summary": "मानक स्वीकृत स्वाद वर्धक।"
            },
            "te": {
                "name": "డైసోడియం ఇనోసినేట్ (INS 631)",
                "category": "రుచి పెంచే పదార్థం (Flavour Enhancer)",
                "why_added": "ఆహారానికి మాంసకృత్తుల తరహా రుచిని అందించడానికి కలుపుతారు.",
                "short_summary": "ఆమోదించబడిన సురక్షిత రుచి వర్ధకం."
            }
        }
    },

    # --- ANTIOXIDANTS (300s) ---
    "319": {
        "ins_number": "INS 319",
        "e_number": "E319",
        "name": "Tertiary Butylhydroquinone",
        "common_names": ["TBHQ", "tert-Butylhydroquinone"],
        "category": "Antioxidant",
        "technical_function": "Retards oxidative rancidity in edible oils and fats, preventing off-flavors and peroxide formation.",
        "why_added": "Added to frying oils, instant noodles, chips, and baked goods to extend shelf life and prevent rancid oil taste.",
        "safety_assessment": "Permitted by FSSAI, JECFA, and US FDA with strict maximum permissible limits (typically 200 mg/kg in pure oil/fat). JECFA ADI is 0-0.7 mg/kg body weight.",
        "evidence_concerns": "High-dose animal studies indicated biochemical stress on liver enzymes. However, regulatory authorities find it safe when consumed within standard dietary limits.",
        "what_we_do_not_know": "Combined cocktail effects of multiple synthetic phenolic antioxidants (TBHQ + BHA + BHT) across diverse age cohorts.",
        "sources": [
            {"title": "JECFA Chemical Summary: Tertiary Butylhydroquinone", "publisher": "WHO JECFA", "year": "1998", "url": "https://apps.who.int"},
            {"title": "Scientific Opinion on the re-evaluation of TBHQ (E 319)", "publisher": "EFSA Journal", "year": "2004", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "टर्शियरी ब्यूटाइलहाइड्रोक्विनोन (TBHQ)",
                "category": "एंटीऑक्सीडेंट (Antioxidant)",
                "why_added": "खाद्य तेलों और तले हुए स्नैक्स को खराब होने और दुर्गंध से बचाने के लिए मिलाया जाता है।",
                "short_summary": "तेल को खराब होने से बचाने वाला स्वीकृत एंटीऑक्सीडेंट; सख्त सुरक्षा सीमाओं के अधीन।"
            },
            "te": {
                "name": "టెర్షియరీ బ్యూటైల్‌హైడ్రోక్వినోన్ (TBHQ)",
                "category": "యాంటీఆక్సిడెంట్ (Antioxidant)",
                "why_added": "నూనెలు మరియు వేయించిన ఆహారాలు పాడవకుండా ఎక్కువ రోజులు తాజాగా ఉండటానికి కలుపుతారు.",
                "short_summary": "నూనెలను తాజాగా ఉంచే పరిమిత యాంటీఆక్సిడెంట్."
            }
        }
    },
    "320": {
        "ins_number": "INS 320",
        "e_number": "E320",
        "name": "Butylated Hydroxyanisole",
        "common_names": ["BHA"],
        "category": "Antioxidant",
        "technical_function": "Synthetic antioxidant that prevents oxidative degradation of fats and fat-soluble vitamins.",
        "why_added": "Added to vegetable fats, cereals, butter substitutes, and chewing gums to prevent lipid oxidation.",
        "safety_assessment": "Regulated by FSSAI and JECFA with an ADI of 0-0.5 mg/kg body weight.",
        "evidence_concerns": "Classified by IARC as possibly carcinogenic to humans based on animal rodent forestomach tumors at very high experimental doses (humans do not possess a forestomach).",
        "what_we_do_not_know": "Endocrine interaction potential at cumulative lifetime low doses in combination with other synthetic additives.",
        "sources": [
            {"title": "IARC Monographs on the Evaluation of Carcinogenic Risks to Humans: BHA", "publisher": "WHO IARC", "year": "1986", "url": "https://monographs.iarc.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "ब्यूटिलेटेड हाइड्रॉक्सीएनीसोल (BHA)",
                "category": "एंटीऑक्सीडेंट (Antioxidant)",
                "why_added": "वसा और तेलों को खराब होने से बचाने के लिए मिलाया जाता है।",
                "short_summary": "वसा संरक्षक एंटीऑक्सीडेंट; अनुमत सीमा में सुरक्षित।"
            },
            "te": {
                "name": "బ్యూటైలేటెడ్ హైడ్రాక్సీఅనిసోల్ (BHA)",
                "category": "యాంటీఆక్సిడెంట్ (Antioxidant)",
                "why_added": "కొవ్వులు పాడవకుండా ఉండటానికి కలుపుతారు.",
                "short_summary": "పరిమిత మోతాదులో అనుమతించబడిన యాంటీఆక్సిడెంట్."
            }
        }
    },
    "300": {
        "ins_number": "INS 300",
        "e_number": "E300",
        "name": "Ascorbic Acid",
        "common_names": ["Vitamin C", "L-Ascorbic Acid"],
        "category": "Antioxidant / Flour Treatment Agent",
        "technical_function": "Oxygen scavenger that prevents enzymatic browning and strengthens gluten network in bread dough.",
        "why_added": "Added to juices, cured meats, and flours to maintain color, improve dough volume, and provide Vitamin C fortification.",
        "safety_assessment": "Essential human nutrient. JECFA ADI is 'not specified'. Highly safe under all dietary applications.",
        "evidence_concerns": "Excessive supplemental intake (>2000 mg/day) may cause osmotic diarrhea or kidney stones, but dietary additive levels are far below this threshold.",
        "what_we_do_not_know": "Interactions when combined with high concentrations of sodium benzoate in low pH liquids exposed to high heat.",
        "sources": [
            {"title": "JECFA Evaluation: Ascorbic Acid", "publisher": "WHO / FAO", "year": "1974", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "एस्कॉर्बिक एसिड (विटामिन सी)",
                "category": "एंटीऑक्सीडेंट / विटामिन",
                "why_added": "भोजन का रंग बनाए रखने, आटे की गुणवत्ता सुधारने और पोषण बढ़ाने के लिए मिलाया जाता है।",
                "short_summary": "प्राकृतिक विटामिन सी; अत्यंत सुरक्षित और स्वास्थ्यवर्धक।"
            },
            "te": {
                "name": "ఆస్కార్బిక్ యాసిడ్ (విటమిన్ సి)",
                "category": "యాంటీఆక్సిడెంట్ / విటమిన్",
                "why_added": "ఆహారం రంగు మారకుండా కాపాడటానికి మరియు పోషక విలువలను పెంచడానికి ఉపయోగిస్తారు.",
                "short_summary": "సహజ విటమిన్ సి; అత్యంత సురక్షితం."
            }
        }
    },
    "330": {
        "ins_number": "INS 330",
        "e_number": "E330",
        "name": "Citric Acid",
        "common_names": ["Nimbu Sat", "Sour Salt", "Acidulant"],
        "category": "Acidity Regulator / Antioxidant Synergist",
        "technical_function": "Lowers food pH, imparts sharp tart flavor, and enhances effectiveness of antioxidants.",
        "why_added": "Added to soft drinks, candy, fruit snacks, biscuits, and sauces for tartness, microbial stability, and color retention.",
        "safety_assessment": "Naturally occurring in citrus fruits; produced industrially via microbial fermentation (Aspergillus niger). ADI is 'not specified' by JECFA. Considered exceptionally safe.",
        "evidence_concerns": "High and frequent consumption of sour, acidic candies or beverages can cause dental enamel erosion over time due to low pH.",
        "what_we_do_not_know": "Extremely rare mold sensitivity in persons with severe Aspergillus allergy, though commercial purification leaves negligible residual fungal proteins.",
        "sources": [
            {"title": "JECFA Monograph: Citric acid", "publisher": "FAO / WHO JECFA", "year": "1974", "url": "https://apps.who.int"},
            {"title": "FSSAI Standards for Acidulants", "publisher": "FSSAI", "year": "2016", "url": "https://fssai.gov.in"}
        ],
        "translations": {
            "hi": {
                "name": "साइट्रिक एसिड (INS 330)",
                "category": "अम्लता नियामक (Acidity Regulator)",
                "why_added": "खट्टा स्वाद देने और भोजन को सुरक्षित रखने के लिए उपयोग किया जाता है।",
                "short_summary": "नींबू जैसा प्राकृतिक अम्ल; वैश्विक स्तर पर अत्यंत सुरक्षित माना गया है।"
            },
            "te": {
                "name": "సిట్రిక్ యాసిడ్ (INS 330)",
                "category": "ఆమ్లత్వ నియంత్రకం (Acidity Regulator)",
                "why_added": "పుల్లని రుచి మరియు ఆహారం తాజాగా ఉండటానికి జోడిస్తారు.",
                "short_summary": "సహజసిద్ధమైన పులుపు పదార్థం; చాలా సురక్షితమైనదిగా పరిగణించబడుతుంది."
            }
        }
    },
    "331": {
        "ins_number": "INS 331",
        "e_number": "E331",
        "name": "Sodium Citrates",
        "common_names": ["Trisodium Citrate", "Monosodium Citrate", "Disodium Citrate"],
        "category": "Acidity Regulator / Emulsifying Salt",
        "technical_function": "Controls pH, buffers acidity, prevents protein precipitation, and sequesters calcium ions.",
        "why_added": "Essential in carbonated sodas, processed cheese slices, gelatin desserts, and energy drinks to smooth out acid sharpness and stabilize emulsions.",
        "safety_assessment": "Approved worldwide by FSSAI, JECFA, and US FDA. JECFA ADI is 'not limited'.",
        "evidence_concerns": "Contributes to total sodium intake. Individuals on strict medically supervised sodium-restricted diets should calculate its sodium contribution.",
        "what_we_do_not_know": "None of clinical significance; naturally metabolized through the citric acid cycle (Krebs cycle).",
        "sources": [
            {"title": "JECFA Chemical Summary: Sodium Citrates", "publisher": "WHO / FAO", "year": "1974", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "सोडियम साइट्रेट्स (INS 331)",
                "category": "अम्लता नियामक (Acidity Regulator)",
                "why_added": "कोल्ड ड्रिंक्स और चीज में खटास को संतुलित करने और बनावट को स्थिर रखने के लिए उपयोग किया जाता है।",
                "short_summary": "अत्यंत सुरक्षित अम्लता नियंत्रक; सोडियम की मात्रा पर ध्यान दें।"
            },
            "te": {
                "name": "సోడియం సిట్రేట్ (INS 331)",
                "category": "ఆమ్లత్వ నియంత్రకం (Acidity Regulator)",
                "why_added": "కూల్ డ్రింక్స్ మరియు చీజ్‌లలో ఆమ్లత్వాన్ని సమతుల్యం చేయడానికి కలుపుతారు.",
                "short_summary": "చాలా సురక్షితమైన ఆమ్లత్వ సమతుల్యకారి."
            }
        }
    },

    # --- PRESERVATIVES (200s) ---
    "211": {
        "ins_number": "INS 211",
        "e_number": "E211",
        "name": "Sodium Benzoate",
        "common_names": ["Benzoate of Soda"],
        "category": "Preservative",
        "technical_function": "Inhibits growth of yeasts, molds, and bacteria in acidic food environments (pH < 4.5).",
        "why_added": "Added to carbonated beverages, fruit juices, pickles, sauces, and jams to prevent spoilage and extend shelf life.",
        "safety_assessment": "Generally recognized as safe (GRAS) by US FDA; approved by FSSAI and EFSA. ADI established at 0-5 mg/kg body weight.",
        "evidence_concerns": "When combined with Vitamin C (Ascorbic Acid / INS 300) in the presence of heat or UV light, trace amounts of benzene (a known carcinogen) can form. Modern food formulation guidelines mandate testing to ensure benzene remains well below drinking water limits (<5 ppb).",
        "what_we_do_not_know": "Long-term low-level exposure effects in young children when consumed alongside synthetic artificial food dyes.",
        "sources": [
            {"title": "Evaluation of Certain Food Additives and Contaminants (Benzoic acid and its salts)", "publisher": "WHO / JECFA", "year": "1996", "url": "https://apps.who.int"},
            {"title": "FSSAI Food Products Standards and Food Additives", "publisher": "FSSAI", "year": "2011", "url": "https://www.fssai.gov.in"}
        ],
        "translations": {
            "hi": {
                "name": "सोडियम बेंजोएट (INS 211)",
                "category": "परिरक्षक (Preservative)",
                "why_added": "अम्लीय पेय पदार्थों, सॉस और जैम में फफूंद और बैक्टीरिया को रोकने के लिए उपयोग किया जाता है।",
                "short_summary": "फफूंद और बैक्टीरिया रोकने वाला मानक प्रिजर्वेटिव; विटामिन सी के साथ अधिक गर्मी से बचाना चाहिए।"
            },
            "te": {
                "name": "సోడియం బెంజోయేట్ (INS 211)",
                "category": "ప్రిజర్వేటివ్ (Preservative)",
                "why_added": "పానీయాలు, జామ్‌లు, సాస్‌లు బూజు పట్టకుండా మరియు పాడవకుండా కాపాడటానికి వాడతారు.",
                "short_summary": "ఆహార పదార్థాలు పాడవకుండా కాపాడే ప్రామాణిక ప్రిజర్వేటివ్."
            }
        }
    },
    "202": {
        "ins_number": "INS 202",
        "e_number": "E202",
        "name": "Potassium Sorbate",
        "common_names": ["Sorbate of Potassium"],
        "category": "Preservative",
        "technical_function": "Potent antimicrobial agent effective against molds and yeasts in a wide pH range (up to pH 6.5).",
        "why_added": "Added to cheese, bread, wine, fruit syrups, dips, and baked desserts to inhibit fungal growth without altering taste.",
        "safety_assessment": "Metabolized naturally in the human body into water and carbon dioxide like a dietary fatty acid. JECFA ADI is 0-25 mg/kg body weight.",
        "evidence_concerns": "Very low toxicity profile. Occasional mild skin hypersensitivity observed in manufacturing workers handling pure dust.",
        "what_we_do_not_know": "No significant evidence gaps for general consumer dietary consumption.",
        "sources": [
            {"title": "Scientific Opinion on the re-evaluation of sorbic acid (E 200) and potassium sorbate (E 202)", "publisher": "EFSA Journal", "year": "2015", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "पोटेशियम सोर्बेट (INS 202)",
                "category": "परिरक्षक (Preservative)",
                "why_added": "चीज, ब्रेड और मिठाइयों में फफूंद को रोकने के लिए उपयोग किया जाता है।",
                "short_summary": "एक अत्यंत सुरक्षित और व्यापक रूप से स्वीकृत फफूंद-रोधी प्रिजर्वेटिव।"
            },
            "te": {
                "name": "పొటాషియం సోర్బేట్ (INS 202)",
                "category": "ప్రిజర్వేటివ్ (Preservative)",
                "why_added": "బ్రెడ్, చీజ్ మరియు పండ్ల ఉత్పత్తులకు బూజు పట్టకుండా కాపాడుతుంది.",
                "short_summary": "శరీరంలో సహజంగా జీర్ణమయ్యే చాలా సురక్షితమైన ప్రిజర్వేటివ్."
            }
        }
    },
    "282": {
        "ins_number": "INS 282",
        "e_number": "E282",
        "name": "Calcium Propionate",
        "common_names": ["Propionate of Calcium", "Bread Preservative"],
        "category": "Preservative",
        "technical_function": "Inhibits mold spores and rope-forming bacteria (Bacillus mesentericus) in baked goods without killing yeast.",
        "why_added": "Added to commercial sliced bread, buns, wraps, and pizza crusts to ensure 7-14 days mold-free shelf life in warm climates.",
        "safety_assessment": "Propionic acid is naturally produced in the human colon by gut bacteria. JECFA ADI is 'not limited'.",
        "evidence_concerns": "A small 2002 Australian trial suggested a minority of children may show irritability or sleep disturbance with high intake, but larger epidemiological studies have not confirmed causality.",
        "what_we_do_not_know": "Potential metabolic modulation of insulin sensitivity at high doses in pre-diabetic individuals.",
        "sources": [
            {"title": "JECFA Evaluation: Propionic Acid and its Calcium Salt", "publisher": "WHO / FAO", "year": "1974", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "कैल्शियम प्रोपियोनेट (INS 282)",
                "category": "परिरक्षक (Preservative)",
                "why_added": "पैक्ड ब्रेड और पाव में फफूंद लगने से बचाने के लिए मिलाया जाता है।",
                "short_summary": "ब्रेड को सुरक्षित रखने वाला मानक घटक; शरीर द्वारा आसानी से पच जाता है।"
            },
            "te": {
                "name": "కాల్షియం ప్రొపియోనేట్ (INS 282)",
                "category": "ప్రిజర్వేటివ్ (Preservative)",
                "why_added": "బ్రెడ్ మరియు బేకరీ ఆహారాలు బూజు పట్టకుండా ఎక్కువ రోజులు తాజాగా ఉండటానికి కలుపుతారు.",
                "short_summary": "బేకరీలలో విస్తృతంగా ఉపయోగించే సురక్షిత ప్రిజర్వేటివ్."
            }
        }
    },
    "223": {
        "ins_number": "INS 223",
        "e_number": "E223",
        "name": "Sodium Metabisulphite",
        "common_names": ["Disodium Disulfite", "Sulphite"],
        "category": "Preservative / Antioxidant / Bleaching Agent",
        "technical_function": "Releases sulphur dioxide (SO2) to prevent microbial growth and enzymatic browning; relaxes gluten in biscuit dough.",
        "why_added": "Used in dried fruits, wine, potato flakes, and biscuit manufacturing to improve dough machinability and prevent darkening.",
        "safety_assessment": "Approved with an ADI of 0-0.7 mg/kg body weight (as SO2). Strictly regulated allergen declaration mandatory.",
        "evidence_concerns": "Known potent trigger for bronchospasm and severe acute asthmatic attacks in sulfite-sensitive individuals. Mandatory warning required if >10 ppm.",
        "what_we_do_not_know": "Exact genetic mechanism why ~5-10% of asthmatics have sulfite sensitivity.",
        "sources": [
            {"title": "Scientific Opinion on the re-evaluation of sulfur dioxide (E 220) and sulfites", "publisher": "EFSA Journal", "year": "2016", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "सोडियम मेटाबाइसल्फाइट (INS 223)",
                "category": "परिरक्षक / सल्फाइट (Sulphite)",
                "why_added": "बिस्कुट के आटे को ढीला करने और सूखे मेवों को भूरा होने से बचाने के लिए उपयोग किया जाता है।",
                "short_summary": "सल्फाइट घटक; अस्थमा रोगियों में सांस की तकलीफ पैदा कर सकता है।"
            },
            "te": {
                "name": "సోడియం మెటాబైసల్ఫైట్ (INS 223)",
                "category": "ప్రిజర్వేటివ్ / సల్ఫైట్",
                "why_added": "బిస్కెట్లు మరియు డ్రై ఫ్రూట్స్ రంగు మారకుండా కాపాడటానికి ఉపయోగిస్తారు.",
                "short_summary": "ఆస్తమా ఉన్నవారికి సున్నితత్వం కలిగించే అవకాశం ఉన్న సల్ఫైట్."
            }
        }
    },

    # --- EMULSIFIERS, THICKENERS & STABILIZERS (400s) ---
    "322": {
        "ins_number": "INS 322",
        "e_number": "E322",
        "name": "Lecithins",
        "common_names": ["Soy Lecithin", "Sunflower Lecithin", "Egg Lecithin"],
        "category": "Emulsifier",
        "technical_function": "Binds oil and water phases together, reducing surface tension and controlling fat crystallization.",
        "why_added": "Essential in chocolate to control viscosity during molding, in bakery items to improve dough elasticity, and in instant drinks to improve wettability.",
        "safety_assessment": "Naturally found in egg yolks, soybeans, and cell membranes. ADI is 'not limited' by JECFA.",
        "evidence_concerns": "Soy lecithin is derived from soybeans; while mostly refined fat, highly sensitive soy-allergic individuals should exercise caution unless derived from sunflower.",
        "what_we_do_not_know": "Exact botanical source unless explicitly declared on the label (e.g. Soy vs Sunflower).",
        "sources": [
            {"title": "JECFA Chemical Summary: Lecithins", "publisher": "WHO / FAO JECFA", "year": "1973", "url": "https://apps.who.int"},
            {"title": "FSSAI Labelling and Display Regulations", "publisher": "FSSAI", "year": "2020", "url": "https://www.fssai.gov.in"}
        ],
        "translations": {
            "hi": {
                "name": "लेसिथिन (INS 322)",
                "category": "पायसीकारी (Emulsifier)",
                "why_added": "चॉकलेट और बेकरी उत्पादों में तेल और पानी को एकसार मिलाने और चिकनाई देने के लिए प्रयुक्त।",
                "short_summary": "प्राकृतिक पायसीकारी; सोया एलर्जी वाले लोगों को सावधानी बरतनी चाहिए।"
            },
            "te": {
                "name": "లెసిథిన్ (INS 322)",
                "category": "ఎమల్సిఫైయర్ (Emulsifier)",
                "why_added": "చాక్లెట్ మరియు బిస్కెట్లలో పదార్థాలు సమానంగా కలవడానికి ఉపయోగిస్తారు.",
                "short_summary": "సహజసిద్ధమైన ఎమల్సిఫైయర్; సోయా అలర్జీ ఉన్నవారు గమనించాలి."
            }
        }
    },
    "412": {
        "ins_number": "INS 412",
        "e_number": "E412",
        "name": "Guar Gum",
        "common_names": ["Guaran", "Cluster Bean Gum"],
        "category": "Thickener / Stabilizer",
        "technical_function": "Hydrocolloid that hydrates in cold water to produce high viscosity and prevent phase separation.",
        "why_added": "Added to ice cream to prevent ice crystal formation, to noodle dough to improve elasticity, and to dressings for mouthfeel.",
        "safety_assessment": "Derived from Indian guar beans (Cyamopsis tetragonoloba). JECFA ADI is 'not specified'. Highly safe soluble dietary fiber.",
        "evidence_concerns": "High consumption can cause mild flatulence or bloating due to fermentation by colon microbiota.",
        "what_we_do_not_know": "Exact prebiotic oligosaccharide fermentation rates across different gut microbiomes.",
        "sources": [
            {"title": "JECFA Evaluation of Guar Gum", "publisher": "WHO / FAO", "year": "1975", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "ग्वार गम (INS 412)",
                "category": "गाढ़ा करने वाला (Thickener / Stabilizer)",
                "why_added": "नूडल्स, आइसक्रीम और सॉस को गाढ़ा और मुलायम बनाने के लिए ग्वार फली से निकाला गया प्राकृतिक रेशा।",
                "short_summary": "भारतीय ग्वार फली से बना प्राकृतिक सुरक्षित फाइबर।"
            },
            "te": {
                "name": "గ్వార్ గమ్ (INS 412)",
                "category": "చిక్కదనాన్ని ఇచ్చేది (Thickener)",
                "why_added": "ఆహార పదార్థాలు చిక్కగా మరియు మృదువుగా ఉండటానికి గోరుచిక్కుడు గింజల నుండి తీసిన సహజ ఫైబర్.",
                "short_summary": "సహజమైన మరియు చాలా సురక్షితమైన చిక్కదనపు ఏజెంట్."
            }
        }
    },
    "415": {
        "ins_number": "INS 415",
        "e_number": "E415",
        "name": "Xanthan Gum",
        "common_names": ["Xanthan"],
        "category": "Stabilizer / Thickener",
        "technical_function": "Pseudoplastic polysaccharide providing high viscosity at rest and thinning under shear (pourability).",
        "why_added": "Added to salad dressings, sauces, gluten-free baked goods, and syrups to suspend particulates and provide rich body.",
        "safety_assessment": "Produced by fermentation using Xanthomonas campestris. JECFA ADI is 'not specified'. Approved globally.",
        "evidence_concerns": "Functions as a soluble dietary fiber; high consumption may cause mild intestinal gas or loose stools.",
        "what_we_do_not_know": "Growth substrate (corn, soy, or wheat glucose) is rarely disclosed, though purification removes residual proteins.",
        "sources": [
            {"title": "Re-evaluation of xanthan gum (E 415) as a food additive", "publisher": "EFSA Journal", "year": "2017", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "जैंथन गम (INS 415)",
                "category": "स्थिरीकारक (Stabilizer / Thickener)",
                "why_added": "सॉस और पेय पदार्थों को गाढ़ा रखने और अवयवों को नीचे बैठने से रोकने के लिए प्रयुक्त।",
                "short_summary": "प्राकृतिक किण्वन से बना सुरक्षित गाढ़ा करने वाला एजेंट।"
            },
            "te": {
                "name": "జాంథాన్ గమ్ (INS 415)",
                "category": "స్టెబిలైజర్ (Stabilizer / Thickener)",
                "why_added": "సాస్‌లు, డ్రింక్స్ చిక్కగా ఉండటానికి మరియు వేరుపడకుండా ఉండటానికి కలుపుతారు.",
                "short_summary": "సురక్షితమైన కిణ్వ ప్రక్రియ ద్వారా తయారైన ఫైబర్."
            }
        }
    },
    "471": {
        "ins_number": "INS 471",
        "e_number": "E471",
        "name": "Mono- and Diglycerides of Fatty Acids",
        "common_names": ["Monoglycerides", "Diglycerides", "Glycerol Monostearate"],
        "category": "Emulsifier",
        "technical_function": "Stabilizes water-in-oil and oil-in-water emulsions; complexes with starch to retard staling in bread.",
        "why_added": "Added to bakery goods, margarine, whipped toppings, and ice cream to keep fats uniformly mixed and maintain softness.",
        "safety_assessment": "Formed naturally during normal fat digestion in humans. JECFA ADI is 'not limited'.",
        "evidence_concerns": "May contain small amounts of trans fats depending on hydrogenation level of raw oil; strictly monitored by FSSAI limits.",
        "what_we_do_not_know": "Whether the source fatty acid is plant-based (palm/soy) or animal tallow unless verified by green vegetarian logo.",
        "sources": [
            {"title": "JECFA Chemical Summary: Mono- and Diglycerides", "publisher": "WHO / FAO", "year": "1974", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "फैटी एसिड के मोनो और डाइग्लिसराइड्स (INS 471)",
                "category": "पायसीकारी (Emulsifier)",
                "why_added": "ब्रेड और बेकरी उत्पादों को लंबे समय तक मुलायम रखने और तेल-पानी को मिलाने के लिए प्रयुक्त।",
                "short_summary": "मानक पायसीकारी; भारत में शाकाहारी निशान (Green Dot) देखकर स्रोत सुनिश्चित करें।"
            },
            "te": {
                "name": "మోనో మరియు డైగ్లిజరైడ్స్ (INS 471)",
                "category": "ఎమల్సిఫైయర్ (Emulsifier)",
                "why_added": "బేకరీ ఆహారాలు మెత్తగా ఉండటానికి మరియు కొవ్వులు సరిగ్గా కలవడానికి ఉపయోగిస్తారు.",
                "short_summary": "సాధారణ ఎమల్సిఫైయర్."
            }
        }
    },
    "407": {
        "ins_number": "INS 407",
        "e_number": "E407",
        "name": "Carrageenan",
        "common_names": ["Irish Moss Extract", "Red Seaweed Gum"],
        "category": "Gelling Agent / Thickener / Stabilizer",
        "technical_function": "Reacts with milk proteins (casein) to form delicate gels and suspend cocoa or calcium in plant/dairy milks.",
        "why_added": "Widely used in chocolate milk, dairy desserts, vegan meats, and ice cream for creamy mouthfeel and protein suspension.",
        "safety_assessment": "Food-grade (undegraded) carrageenan is approved by JECFA, US FDA, and FSSAI. ADI is 'not specified'.",
        "evidence_concerns": "Degraded carrageenan (poligeenan, not permitted in food) causes gut inflammation in animals. Some consumer advocates suggest sensitive gut individuals (IBD/IBS) observe personal tolerance.",
        "what_we_do_not_know": "Whether low-molecular-weight fractions persist in human digestion and impact mucosal permeability.",
        "sources": [
            {"title": "Safety evaluation of certain food additives: Carrageenan", "publisher": "WHO JECFA", "year": "2015", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "कैरेगीनन (INS 407)",
                "category": "जेलिंग एजेंट / थिकनर",
                "why_added": "चॉकलेट दूध और आइसक्रीम को गाढ़ा करने और दूध के प्रोटीन को स्थिर रखने के लिए समुद्री शैवाल से प्राप्त।",
                "short_summary": "लाल समुद्री शैवाल से प्राप्त घटक; संवेदनशील आंत वाले व्यक्ति सतर्क रहें।"
            },
            "te": {
                "name": "కారేజీనన్ (INS 407)",
                "category": "జెల్లింగ్ ఏజెంట్ / థిక్‌నర్",
                "why_added": "పాల ఉత్పత్తులు మరియు చాక్లెట్ డ్రింక్స్ చిక్కగా ఉండటానికి సముద్రపు నాచు నుండి తీస్తారు.",
                "short_summary": "సహజ సముద్రపు నాచు నుండి తయారైన ఏజెంట్."
            }
        }
    },

    # --- ACIDITY REGULATORS & RAISING AGENTS (500s) ---
    "500": {
        "ins_number": "INS 500",
        "e_number": "E500",
        "name": "Sodium Carbonates",
        "common_names": ["Baking Soda", "Sodium Bicarbonate", "Soda Ash", "Meetha Soda"],
        "category": "Raising Agent / Acidity Regulator",
        "technical_function": "Releases carbon dioxide gas when heated or reacting with acids, causing dough and batter to rise.",
        "why_added": "Universal raising agent in cakes, biscuits, cookies, and noodles; creates airy, crisp, and porous crumb structure.",
        "safety_assessment": "Naturally occurring mineral compound. JECFA ADI is 'not limited'. Used in household cooking worldwide.",
        "evidence_concerns": "Contributes to dietary sodium. Consuming excessive baking soda directly can disrupt stomach acid balance.",
        "what_we_do_not_know": "No scientific uncertainty regarding standard food consumption.",
        "sources": [
            {"title": "JECFA Chemical Summary: Sodium Carbonate", "publisher": "WHO / FAO", "year": "1965", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "सोडियम कार्बोनेट्स / बेकिंग सोडा (INS 500)",
                "category": "उभारने वाला एजेंट (Raising Agent)",
                "why_added": "बिस्कुट और केक को फूलाने, हल्का और कुरकुरा बनाने के लिए प्रयुक्त मीठा सोडा।",
                "short_summary": "पारंपरिक बेकिंग सोडा; अत्यंत सुरक्षित घरेलू घटक।"
            },
            "te": {
                "name": "సోడియం కార్బోనేట్స్ / బేకింగ్ సోడా (INS 500)",
                "category": "బేకింగ్ ఏజెంట్ (Raising Agent)",
                "why_added": "బిస్కెట్లు మరియు కేకులు పొంగడానికి మరియు కరకరలాడటానికి ఉపయోగించే వంట సోడా.",
                "short_summary": "సాధారణ వంట సోడా; చాలా సురక్షితమైనది."
            }
        }
    },
    "501": {
        "ins_number": "INS 501",
        "e_number": "E501",
        "name": "Potassium Carbonates",
        "common_names": ["Potassium Bicarbonate", "Kansui Component"],
        "category": "Acidity Regulator / Raising Agent",
        "technical_function": "Provides alkaline pH in noodle dough (Kansui effect), imparting springy yellow texture and firm bite.",
        "why_added": "Key ingredient in ramen and instant noodles to prevent dough sogginess during boiling and control pH.",
        "safety_assessment": "Approved by JECFA with ADI 'not limited'. Recognized safe by FSSAI and EFSA.",
        "evidence_concerns": "Patients with severe chronic kidney disease requiring strict potassium restriction should note potassium-based food additives.",
        "what_we_do_not_know": "None; basic inorganic mineral salt.",
        "sources": [
            {"title": "JECFA Evaluation: Potassium Carbonate", "publisher": "WHO / FAO", "year": "1965", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "पोटेशियम कार्बोनेट्स (INS 501)",
                "category": "अम्लता नियामक / उभारने वाला एजेंट",
                "why_added": "नूडल्स को लचीला और मजबूत बनाने और अम्लता संतुलित करने के लिए मिलाया जाता है।",
                "short_summary": "नूडल्स में उपयोग होने वाला मानक खनिज घटक; किडनी रोगियों के लिए पोटैशियम सावधानी।"
            },
            "te": {
                "name": "పొటాషియం కార్బోనేట్ (INS 501)",
                "category": "ఆమ్లత్వ నియంత్రకం / బేకింగ్ ఏజెంట్",
                "why_added": "నూడుల్స్ దృఢంగా మరియు సాగే గుణంతో ఉండటానికి కలుపుతారు.",
                "short_summary": "నూడుల్స్‌లో ఉపయోగించే సురక్షితమైన లవణం."
            }
        }
    },
    "503": {
        "ins_number": "INS 503",
        "e_number": "E503",
        "name": "Ammonium Carbonates",
        "common_names": ["Ammonium Bicarbonate", "Baker's Ammonia", "Hartshorn"],
        "category": "Raising Agent",
        "technical_function": "Thermal decomposition into ammonia, carbon dioxide, and water vapor at oven temperatures, creating extra-crisp texture in low-moisture baked goods.",
        "why_added": "Used in crisp biscuits, crackers, and cookies; evaporates completely during baking leaving zero residual taste.",
        "safety_assessment": "Approved worldwide by FSSAI and JECFA. ADI is 'not limited'.",
        "evidence_concerns": "Ammonium gas is generated during baking, so it is strictly used in thin, low-moisture goods where gas escapes easily.",
        "what_we_do_not_know": "Trace contribution to acrylamide formation in very high-temperature wheat flour baking.",
        "sources": [
            {"title": "JECFA Chemical Summary: Ammonium Carbonate", "publisher": "WHO / FAO", "year": "1965", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "अमोनियम कार्बोनेट्स (INS 503)",
                "category": "उभारने वाला एजेंट (Raising Agent)",
                "why_added": "बिस्कुट और कुकीज़ को अतिरिक्त कुरकुरा और खस्ता बनाने के लिए प्रयुक्त बेकिंग घटक।",
                "short_summary": "पारंपरिक बेकर्स अमोनिया; बेक होने पर पूरी तरह वाष्पित हो जाता है।"
            },
            "te": {
                "name": "అమ్మోనియం కార్బోనేట్స్ (INS 503)",
                "category": "బేకింగ్ ఏజెంట్ (Raising Agent)",
                "why_added": "బిస్కెట్లు క్రిస్పీగా మరియు కరకరలాడేలా చేయడానికి ఉపయోగిస్తారు.",
                "short_summary": "బేకింగ్‌లో ఉపయోగించే ప్రామాణిక ఏజెంట్; వేడికి ఆవిరైపోతుంది."
            }
        }
    },
    "551": {
        "ins_number": "INS 551",
        "e_number": "E551",
        "name": "Silicon Dioxide",
        "common_names": ["Silica", "Synthetic Amorphous Silica"],
        "category": "Anti-caking Agent",
        "technical_function": "Absorbs ambient moisture and coats food particles to prevent clumping and maintain free-flowing powders.",
        "why_added": "Added to table salt, spice blends, instant soup powders, and coffee creamers to keep them powdery and easy to dispense.",
        "safety_assessment": "Approved by FSSAI, JECFA, and US FDA. Synthetic amorphous silica is biologically inert and excreted unchanged.",
        "evidence_concerns": "Distinguished from crystalline silica (which is hazardous when inhaled as industrial dust). In 2018, EFSA requested further characterization of nanoscale particle distribution in food-grade silica.",
        "what_we_do_not_know": "Exact percentage and potential gut epithelial interactions of sub-100nm nanoparticle fractions in modern processing.",
        "sources": [
            {"title": "Scientific Opinion on the re-evaluation of silicon dioxide (E 551)", "publisher": "EFSA Journal", "year": "2018", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "सिलिकॉन डाइऑक्साइड (INS 551)",
                "category": "गांठ रोधी एजेंट (Anti-caking Agent)",
                "why_added": "नमक, मसालों और पाउडर वाले खाद्य पदार्थों को नमी से जमने से रोकने और उन्हें भुरभुरा रखने के लिए प्रयुक्त।",
                "short_summary": "पाउडर को जमने से रोकने वाला सुरक्षित अक्रिय घटक।"
            },
            "te": {
                "name": "సిలికాన్ డయాక్సైడ్ (INS 551)",
                "category": "ముద్దకట్టకుండా నిరోధించేది (Anti-caking Agent)",
                "why_added": "ఉప్పు మరియు మసాలా పొడులు గడ్డకట్టకుండా పొడిపొడిగా ఉండేలా చేయడానికి కలుపుతారు.",
                "short_summary": "పొడులు గడ్డకట్టకుండా కాపాడే సురక్షిత ఏజెంట్."
            }
        }
    },

    # --- SWEETENERS (900s) ---
    "955": {
        "ins_number": "INS 955",
        "e_number": "E955",
        "name": "Sucralose",
        "common_names": ["Splenda", "Trichlorogalactosucrose"],
        "category": "Sweetener",
        "technical_function": "High-intensity artificial sweetener approximately 600 times sweeter than sucrose with zero calories.",
        "why_added": "Added to sugar-free beverages, diet snacks, protein bars, and chewing gums to provide clean sweet taste without dental decay or glycemic spikes.",
        "safety_assessment": "Extensively evaluated across >110 scientific studies. Approved by FSSAI, US FDA, EFSA, and JECFA. ADI is 0-15 mg/kg body weight.",
        "evidence_concerns": "Some rodent studies report potential changes in gut microbiome composition or generation of chloropropanols if baked above 250°C. Human clinical trials show no adverse glycemic disruption at typical dietary intake levels.",
        "what_we_do_not_know": "Long-term decade-long impacts of non-nutritive sweeteners on appetite neurochemistry and gut microbiome diversity in diverse cohorts.",
        "sources": [
            {"title": "JECFA Chemical Summary: Sucralose", "publisher": "WHO JECFA", "year": "1991", "url": "https://apps.who.int"},
            {"title": "Additional scientific evaluation of sucralose", "publisher": "EFSA Journal", "year": "2017", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "सुक्रालोज़ (INS 955)",
                "category": "स्वीटनर / कृत्रिम मिठास (Sweetener)",
                "why_added": "बिना कैलोरी और बिना ब्लड शुगर बढ़ाए चीनी जैसी मिठास देने के लिए डाइट ड्रिंक्स और स्नैक्स में उपयोग किया जाता है।",
                "short_summary": "चीनी से 600 गुना मीठा शून्य-कैलोरी स्वीटनर; वैश्विक रूप से स्वीकृत।"
            },
            "te": {
                "name": "సుక్రలోజ్ (INS 955)",
                "category": "తీపి పదార్థం (Sweetener)",
                "why_added": "షుగర్ పెరగకుండా మరియు క్యాలరీలు లేకుండా తియ్యదనం ఇవ్వడానికి ఉపయోగిస్తారు.",
                "short_summary": "పంచదార కన్నా 600 రెట్లు తీపి కలిగిన సురక్షిత జీరో-క్యాలరీ స్వీటెనర్."
            }
        }
    },
    "950": {
        "ins_number": "INS 950",
        "e_number": "E950",
        "name": "Acesulfame Potassium",
        "common_names": ["Acesulfame K", "Ace-K"],
        "category": "Sweetener",
        "technical_function": "Zero-calorie high-intensity sweetener ~200 times sweeter than sucrose with high thermal stability.",
        "why_added": "Almost always blended with sucralose (INS 955) or aspartame (INS 951) in zero-sugar sodas because their sweetness curves mask each other's aftertastes.",
        "safety_assessment": "Approved by US FDA, EFSA, and FSSAI. JECFA ADI is 0-15 mg/kg body weight. Excreted unchanged in urine.",
        "evidence_concerns": "Contains methylene chloride in manufacturing solvents, but modern analytical testing confirms zero residual limits. Consumer advocacy groups occasionally urge further long-term cancer testing.",
        "what_we_do_not_know": "Long-term environmental accumulation since it passes through human digestion and wastewater treatment intact.",
        "sources": [
            {"title": "Toxicological evaluation of certain food additives: Acesulfame Potassium", "publisher": "WHO JECFA", "year": "1991", "url": "https://apps.who.int"}
        ],
        "translations": {
            "hi": {
                "name": "एसेसल्फेम पोटैशियम (INS 950)",
                "category": "स्वीटनर / कृत्रिम मिठास (Sweetener)",
                "why_added": "जीरो-शुगर कोल्ड ड्रिंक्स में सुक्रालोज़ के साथ मिलाकर स्वादिष्ट मिठास देने के लिए उपयोग किया जाता है।",
                "short_summary": "ताप-स्थिर शून्य-कैलोरी स्वीटनर; शरीर में बिना पचे बाहर निकल जाता है।"
            },
            "te": {
                "name": "ఎసిసల్ఫేమ్ పొటాషియం (INS 950)",
                "category": "తీపి పదార్థం (Sweetener)",
                "why_added": "డైట్ డ్రింక్స్ మరియు జ్యూస్‌లలో సుక్రలోజ్‌తో కలిపి వాడే జీరో-క్యాలరీ స్వీటెనర్.",
                "short_summary": "ఆమోదించబడిన సురక్షిత జీరో-క్యాలరీ స్వీటెనర్."
            }
        }
    },
    "951": {
        "ins_number": "INS 951",
        "e_number": "E951",
        "name": "Aspartame",
        "common_names": ["NutraSweet", "Equal"],
        "category": "Sweetener",
        "technical_function": "Dipeptide non-nutritive sweetener ~200 times sweeter than sucrose; breaks down during prolonged heating.",
        "why_added": "Used in diet sodas, sugar-free desserts, and breath mints for a sugar-like sweetness profile.",
        "safety_assessment": "JECFA reaffirmed ADI of 0-40 mg/kg body weight. In 2023, WHO IARC classified it as Group 2B ('possibly carcinogenic to humans' on limited evidence), while WHO JECFA reaffirmed current dietary intake levels as safe.",
        "evidence_concerns": "Contains phenylalanine; strictly hazardous for individuals with the rare genetic disorder Phenylketonuria (PKU). Clear warning required by law.",
        "what_we_do_not_know": "Epidemiological disputes regarding association with subtle cancer risks versus confounding lifestyle factors.",
        "sources": [
            {"title": "Joint FAO/WHO Expert Committee on Food Additives: Aspartame Review", "publisher": "WHO", "year": "2023", "url": "https://www.who.int/news/item/14-07-2023-aspartame-hazard-and-risk-assessment-results-released"}
        ],
        "translations": {
            "hi": {
                "name": "एस्पार्टेम (INS 951)",
                "category": "स्वीटनर (Sweetener)",
                "why_added": "डाइट सोडा और च्युइंग गम में बिना चीनी के मिठास देने के लिए प्रयुक्त।",
                "short_summary": "स्वीकृत कृत्रिम स्वीटनर; PKU रोगियों के लिए फेनिलएलनिन चेतावनी अनिवार्य।"
            },
            "te": {
                "name": "అస్పార్టేమ్ (INS 951)",
                "category": "తీపి పదార్థం (Sweetener)",
                "why_added": "డైట్ సోడాలలో పంచదారకు బదులుగా వాడే స్వీటెనర్.",
                "short_summary": "PKU ఉన్నవారు అస్సలు తీసుకోకూడని స్వీటెనర్."
            }
        }
    },

    # --- FOOD COLOURS (100s) ---
    "102": {
        "ins_number": "INS 102",
        "e_number": "E102",
        "name": "Tartrazine",
        "common_names": ["FD&C Yellow No. 5", "Acid Yellow 23"],
        "category": "Synthetic Food Colour",
        "technical_function": "Imparts vibrant lemon-yellow coloration to foods and drinks.",
        "why_added": "Added to fruit sodas, packaged sweets, confectionery, instant noodles, and snacks to provide appetizing golden-yellow visual appeal.",
        "safety_assessment": "Permitted by FSSAI, US FDA, and EFSA with strict maximum allowable limits (100-200 mg/kg depending on category). JECFA ADI is 0-10 mg/kg body weight.",
        "evidence_concerns": "Known to trigger urticaria (hives) or asthma in a tiny percentage of aspirin-sensitive individuals. In Europe, labels require a warning regarding hyperactivity in children.",
        "what_we_do_not_know": "Whether food dye sensitivity is purely immunological or mediated by histamine release mechanisms.",
        "sources": [
            {"title": "Scientific Opinion on the re-evaluation of Tartrazine (E 102)", "publisher": "EFSA Journal", "year": "2009", "url": "https://www.efsa.europa.eu"},
            {"title": "FSSAI Permitted Synthetic Food Colours", "publisher": "FSSAI", "year": "2018", "url": "https://www.fssai.gov.in"}
        ],
        "translations": {
            "hi": {
                "name": "टार्ट्राज़ीन (INS 102)",
                "category": "सिंथेटिक खाद्य रंग (Synthetic Colour)",
                "why_added": "पेय पदार्थों, मिठाइयों और नमकीन में चमकीला पीला रंग देने के लिए मिलाया जाता है।",
                "short_summary": "स्वीकृत पीला सिंथेटिक रंग; एस्पिरिन-संवेदनशील लोगों में एलर्जी पैदा कर सकता है।"
            },
            "te": {
                "name": "టార్ట్రాజిన్ (INS 102)",
                "category": "కృత్రిమ రంగు (Synthetic Colour)",
                "why_added": "ఆహారాలు మరియు డ్రింక్స్‌కు ఆకర్షణీయమైన పసుపు రంగును ఇవ్వడానికి ఉపయోగిస్తారు.",
                "short_summary": "ఆమోదించబడిన పసుపు రంగు; ఆస్తమా లేదా అలర్జీ ఉన్నవారు జాగ్రత్త వహించాలి."
            }
        }
    },
    "110": {
        "ins_number": "INS 110",
        "e_number": "E110",
        "name": "Sunset Yellow FCF",
        "common_names": ["FD&C Yellow No. 6", "Orange Yellow S"],
        "category": "Synthetic Food Colour",
        "technical_function": "Imparts vivid orange-yellow coloration.",
        "why_added": "Added to orange sodas, biscuits, chips, instant noodles, and sweets for appetizing orange visual vibrancy.",
        "safety_assessment": "Permitted under FSSAI regulations with strict maximum concentration limits. JECFA ADI is 0-4 mg/kg body weight.",
        "evidence_concerns": "Included in the 'Southampton Six' colorants linked in a 2007 UK study to mild behavioral hyperactivity in sensitive children.",
        "what_we_do_not_know": "Individual genetic susceptibilities causing behavioral alterations in children.",
        "sources": [
            {"title": "Scientific Opinion on the re-evaluation of Sunset Yellow FCF (E 110)", "publisher": "EFSA Journal", "year": "2014", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "सनसेट येलो FCF (INS 110)",
                "category": "सिंथेटिक खाद्य रंग (Synthetic Colour)",
                "why_added": "ऑरेंज ड्रिंक्स, चिप्स और बिस्कुट में चमकीला नारंगी रंग देने के लिए उपयोग किया जाता है।",
                "short_summary": "स्वीकृत नारंगी रंग; बच्चों में अतिसक्रियता (Hyperactivity) की चेतावनी के अधीन।"
            },
            "te": {
                "name": "సన్‌సెట్ ఎల్లో FCF (INS 110)",
                "category": "కృత్రిమ రంగు (Synthetic Colour)",
                "why_added": "ఆరెంజ్ డ్రింక్స్ మరియు బిస్కెట్లకు నారింజ రంగు ఇవ్వడానికి కలుపుతారు.",
                "short_summary": "ఆమోదించబడిన నారింజ రంగు."
            }
        }
    },
    "150d": {
        "ins_number": "INS 150d",
        "e_number": "E150d",
        "name": "Sulphite Ammonia Caramel",
        "common_names": ["Caramel Colour Class IV", "Acid-proof Caramel"],
        "category": "Food Colour",
        "technical_function": "Provides rich dark brown to black coloration with high acid stability.",
        "why_added": "The primary coloring agent in cola beverages, soy sauces, dark beers, and gravies.",
        "safety_assessment": "Approved worldwide. JECFA ADI is 0-200 mg/kg body weight. Very widely consumed food additive.",
        "evidence_concerns": "Contains trace byproduct 4-Methylimidazole (4-MEI). In 2011 California Proposition 65 listed 4-MEI; beverage companies responded by optimizing manufacturing to reduce 4-MEI to negligible trace amounts.",
        "what_we_do_not_know": "Long-term cumulative risks of high daily consumption of dark caramel-colored sodas.",
        "sources": [
            {"title": "Scientific Opinion on the re-evaluation of caramel colours (E 150a,b,c,d)", "publisher": "EFSA Journal", "year": "2011", "url": "https://www.efsa.europa.eu"}
        ],
        "translations": {
            "hi": {
                "name": "सल्फाइट अमोनिया कारमेल (INS 150d)",
                "category": "खाद्य रंग (Food Colour)",
                "why_added": "कोला ड्रिंक्स और डार्क सॉस में गहरा भूरा या काला रंग देने के लिए उपयोग किया जाता है।",
                "short_summary": "कोला में प्रयुक्त मानक कारमेल रंग; आधुनिक उत्पादन में कड़े सुरक्षा मानकों के तहत।"
            },
            "te": {
                "name": "కారామెల్ కలర్ క్లాస్ IV (INS 150d)",
                "category": "ఆహార రంగు (Food Colour)",
                "why_added": "కోలా పానీయాలు మరియు డార్క్ సాస్‌లకు ముదురు గోధుమ రంగు ఇవ్వడానికి ఉపయోగిస్తారు.",
                "short_summary": "కోలా డ్రింక్స్‌లో సాధారణంగా వాడే కారామెల్ రంగు."
            }
        }
    }
}

# --- COMMON CULINARY INGREDIENTS DATABASE ---
COMMON_INGREDIENTS_DB: Dict[str, Dict[str, Any]] = {
    "maida": {
        "name": "Refined Wheat Flour (Maida)",
        "category": "Cereal Grain / Flour",
        "technical_function": "Provides gluten matrix and starch structure for noodles, bakery goods, and snacks.",
        "why_added": "Primary structural base of instant noodles, biscuits, and breads.",
        "safety_assessment": "Standard staple dietary ingredient. Highly refined wheat flour with bran and germ stripped away.",
        "evidence_concerns": "High glycemic index (can cause rapid blood sugar rises); contains gluten (unsafe for Celiac disease patients).",
        "what_we_do_not_know": "Degree of unbleached versus chemically treated flour when not specified.",
        "sources": [{"title": "FSSAI Cereal and Flour Standards", "publisher": "FSSAI", "year": "2020", "url": "https://www.fssai.gov.in"}]
    },
    "wheat flour": {
        "name": "Wheat Flour",
        "category": "Cereal Grain",
        "technical_function": "Structural flour base providing gluten and dietary carbohydrates.",
        "why_added": "Fundamental substrate for noodles, pasta, and baked products.",
        "safety_assessment": "Recognized dietary staple worldwide.",
        "evidence_concerns": "Contains gluten proteins (gliadin and glutenin); triggers immune reaction in individuals with Celiac disease or wheat allergy.",
        "what_we_do_not_know": "Extraction rate / ash content.",
        "sources": [{"title": "Codex Standard for Wheat Flour", "publisher": "Codex Alimentarius", "year": "1995", "url": "https://www.fao.org"}]
    },
    "palm oil": {
        "name": "Edible Palm Oil",
        "category": "Vegetable Fat",
        "technical_function": "High-stability frying medium; provides crispness and room-temperature solid fat structure.",
        "why_added": "Used in instant noodles, biscuits, and snacks due to high oxidative heat resistance and low cost.",
        "safety_assessment": "Permitted vegetable oil. Composed of approximately 50% saturated fatty acids (mainly palmitic acid).",
        "evidence_concerns": "High dietary consumption of saturated fat is linked with elevated LDL cholesterol. Industrial high-heat refining can generate 3-MCPD esters if not properly controlled.",
        "what_we_do_not_know": "Fractionation level (palm olein vs palm stearin) unless labeled.",
        "sources": [{"title": "FSSAI Standards for Edible Fats and Oils", "publisher": "FSSAI", "year": "2021", "url": "https://fssai.gov.in"}]
    },
    "salt": {
        "name": "Iodised Salt",
        "category": "Mineral Seasoning",
        "technical_function": "Enhances flavor, controls microbial activity, and improves protein hydration in dough.",
        "why_added": "Essential taste enhancer and preservative in savory foods.",
        "safety_assessment": "Essential mineral nutrient (Sodium Chloride). Mandated in India to be fortified with iodine.",
        "evidence_concerns": "High intake (>5g salt or 2000mg sodium per day) is a leading cause of hypertension and cardiovascular disease.",
        "what_we_do_not_know": "Exact sodium ratio in proprietary seasoning blends.",
        "sources": [{"title": "WHO Guideline: Sodium intake for adults and children", "publisher": "WHO", "year": "2012", "url": "https://www.who.int"}]
    },
    "sugar": {
        "name": "Sugar (Sucrose)",
        "category": "Carbohydrate Sweetener",
        "technical_function": "Imparts sweetness, tenderizes crumb, retains moisture, and aids browning (Maillard reaction).",
        "why_added": "Primary sweetener in biscuits, beverages, chocolates, and breakfast cereals.",
        "safety_assessment": "Natural disaccharide extracted from sugarcane or sugar beet.",
        "evidence_concerns": "High intake of free/added sugars is linked to dental caries, obesity, fatty liver, and type 2 diabetes.",
        "what_we_do_not_know": "Exact added versus intrinsic sugar ratio on packages lacking modern nutrition breakdown.",
        "sources": [{"title": "WHO Guideline: Sugars intake for adults and children", "publisher": "WHO", "year": "2015", "url": "https://www.who.int"}]
    },
    "caffeine": {
        "name": "Caffeine",
        "category": "Active Ingredient / Stimulant",
        "technical_function": "Central nervous system stimulant providing alertness and bitter taste profile.",
        "why_added": "Added to energy drinks, cola beverages, and pre-workout formulas to increase mental alertness and reduce fatigue.",
        "safety_assessment": "Safe for healthy adults up to 400 mg/day (approx. 4 cups of coffee). EFSA single-dose limit is 200 mg.",
        "evidence_concerns": "Can cause insomnia, anxiety, jitters, elevated heart rate in sensitive individuals. Restricted for children and pregnant individuals (max 200 mg/day).",
        "what_we_do_not_know": "Exact individual caffeine metabolism rate (CYP1A2 enzyme genetic variations).",
        "sources": [{"title": "Scientific Opinion on the safety of caffeine", "publisher": "EFSA Journal", "year": "2015", "url": "https://www.efsa.europa.eu"}]
    }
}
