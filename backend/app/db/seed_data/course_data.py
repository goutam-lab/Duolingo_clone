"""Deterministic seed definitions for courses, units, skills, lessons, and exercises."""

COURSE_SEED_DATA = {
    "code": "en-hi",
    "title": "English for Hindi Speakers",
    "source_language": "Hindi",
    "target_language": "English",
    "description": "Learn conversational and practical English from Hindi with interactive exercises and vocabulary.",
    "is_active": True,
    "units": [
        # =========================================================================
        # UNIT 1 - BASICS
        # =========================================================================
        {
            "order_index": 1,
            "title": "Unit 1: Basics",
            "description": "Start with common greetings, personal introductions, and counting numbers.",
            "skills": [
                {
                    "order_index": 1,
                    "title": "Greetings",
                    "description": "Say hello, goodbye, and thank you with politeness.",
                    "icon_key": "greetings",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Saying Hello",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Namaste' in English?",
                                    "question_data_json": {"options": ["Hello", "Goodbye", "Thank you", "Sorry"]},
                                    "answer_data_json": {"correct_option": "Hello"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Good morning' into Hindi.",
                                    "question_data_json": {"source_text": "Good morning"},
                                    "answer_data_json": {"accepted_answers": ["suprabhat", "shubh prabhat", "सुप्रभात", "शुभ प्रभात"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Build the English sentence for: 'नमस्ते, आप कैसे हैं?'",
                                    "question_data_json": {"words": ["are", "you", "Hello,", "how", "fine", "I"]},
                                    "answer_data_json": {"correct_order": ["Hello,", "how", "are", "you"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match the greeting pairs.",
                                    "question_data_json": {
                                        "left": ["Hello", "Goodbye", "Thank you", "Please"],
                                        "right": ["Kripya", "Alvida", "Namaste", "Dhanyawad"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Hello", "Namaste"],
                                            ["Goodbye", "Alvida"],
                                            ["Thank you", "Dhanyawad"],
                                            ["Please", "Kripya"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "Fill in the missing word: 'Good ___, have a nice day!'",
                                    "question_data_json": {"prefix": "Good ", "suffix": ", have a nice day!"},
                                    "answer_data_json": {"accepted_answers": ["morning", "afternoon", "evening"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "What is the English word for 'Dhanyawad'?",
                                    "question_data_json": {"prompt": "What is the English word for 'Dhanyawad'?"},
                                    "answer_data_json": {"accepted_answers": ["thank you", "thanks"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Saying Goodbye",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which phrase means 'Phir milenge'?",
                                    "question_data_json": {"options": ["See you later", "Welcome", "Excuse me", "Good night"]},
                                    "answer_data_json": {"correct_option": "See you later"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Goodbye' into Hindi.",
                                    "question_data_json": {"source_text": "Goodbye"},
                                    "answer_data_json": {"accepted_answers": ["alvida", "namaste", "अलविदा"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'See you tomorrow'",
                                    "question_data_json": {"words": ["tomorrow", "See", "you", "today", "yesterday"]},
                                    "answer_data_json": {"correct_order": ["See", "you", "tomorrow"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match the farewell expressions.",
                                    "question_data_json": {
                                        "left": ["Goodbye", "See you", "Good night", "Take care"],
                                        "right": ["Apna khayal rakhna", "Alvida", "Shubh raatri", "Phir milenge"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Goodbye", "Alvida"],
                                            ["See you", "Phir milenge"],
                                            ["Good night", "Shubh raatri"],
                                            ["Take care", "Apna khayal rakhna"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "Complete: 'Good ___, sleep well.'",
                                    "question_data_json": {"prefix": "Good ", "suffix": ", sleep well."},
                                    "answer_data_json": {"accepted_answers": ["night"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the opposite of 'Hello':",
                                    "question_data_json": {"prompt": "Type the opposite of 'Hello':"},
                                    "answer_data_json": {"accepted_answers": ["goodbye", "bye"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Polite Expressions",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Kripya' in English?",
                                    "question_data_json": {"options": ["Please", "Sorry", "Thanks", "No"]},
                                    "answer_data_json": {"correct_option": "Please"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Excuse me' into Hindi.",
                                    "question_data_json": {"source_text": "Excuse me"},
                                    "answer_data_json": {"accepted_answers": ["maaf kijiye", "kshama karein", "माफ़ कीजिए", "क्षमा करें"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'You are welcome'",
                                    "question_data_json": {"words": ["welcome", "You", "are", "sorry", "thank"]},
                                    "answer_data_json": {"correct_order": ["You", "are", "welcome"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match polite words.",
                                    "question_data_json": {
                                        "left": ["Please", "Sorry", "Welcome", "Pardon"],
                                        "right": ["Swagat hai", "Kripya", "Kshama", "Maaf karna"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Please", "Kripya"],
                                            ["Sorry", "Maaf karna"],
                                            ["Welcome", "Swagat hai"],
                                            ["Pardon", "Kshama"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'I am ___ for being late.'",
                                    "question_data_json": {"prefix": "I am ", "suffix": " for being late."},
                                    "answer_data_json": {"accepted_answers": ["sorry"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word meaning 'Kripya':",
                                    "question_data_json": {"prompt": "Type the word meaning 'Kripya':"},
                                    "answer_data_json": {"accepted_answers": ["please"]},
                                },
                            ],
                        },
                    ],
                },
                {
                    "order_index": 2,
                    "title": "Introductions",
                    "description": "Introduce yourself and ask basic information from others.",
                    "icon_key": "introductions",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "My Name Is...",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Mera naam Rahul hai'?",
                                    "question_data_json": {"options": ["My name is Rahul", "His name is Rahul", "I Rahul am", "Your name Rahul"]},
                                    "answer_data_json": {"correct_option": "My name is Rahul"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I am a student' into Hindi.",
                                    "question_data_json": {"source_text": "I am a student"},
                                    "answer_data_json": {"accepted_answers": ["main ek vidyarthi hoon", "main chhatra hoon", "मैं एक विद्यार्थी हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Construct: 'My name is John'",
                                    "question_data_json": {"words": ["name", "is", "My", "John", "her", "your"]},
                                    "answer_data_json": {"correct_order": ["My", "name", "is", "John"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match pronouns.",
                                    "question_data_json": {
                                        "left": ["I", "You", "He", "She"],
                                        "right": ["Aap", "Wah (ladka)", "Main", "Wah (ladki)"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["I", "Main"],
                                            ["You", "Aap"],
                                            ["He", "Wah (ladka)"],
                                            ["She", "Wah (ladki)"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'I ___ happy to meet you.'",
                                    "question_data_json": {"prefix": "I ", "suffix": " happy to meet you."},
                                    "answer_data_json": {"accepted_answers": ["am"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "What is the English word for 'Naam'?",
                                    "question_data_json": {"prompt": "What is the English word for 'Naam'?"},
                                    "answer_data_json": {"accepted_answers": ["name"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Asking Names",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you ask 'Aapka naam kya hai?'",
                                    "question_data_json": {"options": ["What is your name?", "Where is your name?", "Who is your name?", "How are you?"]},
                                    "answer_data_json": {"correct_option": "What is your name?"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Nice to meet you' into Hindi.",
                                    "question_data_json": {"source_text": "Nice to meet you"},
                                    "answer_data_json": {"accepted_answers": ["aapse milkar khushi hui", "aapse milkar accha laga", "आपसे मिलकर खुशी हुई"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'What is your name?'",
                                    "question_data_json": {"words": ["your", "name?", "What", "is", "how", "are"]},
                                    "answer_data_json": {"correct_order": ["What", "is", "your", "name?"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match question words.",
                                    "question_data_json": {
                                        "left": ["What", "Who", "Where", "How"],
                                        "right": ["Kaun", "Kya", "Kaise", "Kahan"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["What", "Kya"],
                                            ["Who", "Kaun"],
                                            ["Where", "Kahan"],
                                            ["How", "Kaise"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'What ___ your friend's name?'",
                                    "question_data_json": {"prefix": "What ", "suffix": " your friend's name?"},
                                    "answer_data_json": {"accepted_answers": ["is"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the missing word: 'Nice to ___ you.'",
                                    "question_data_json": {"prompt": "Type the missing word: 'Nice to ___ you.'"},
                                    "answer_data_json": {"accepted_answers": ["meet"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Where Are You From?",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Translate: 'I am from India.'",
                                    "question_data_json": {"options": ["Main Bharat se hoon", "Main Bharat jaa raha hoon", "Main Bharat mein rehta hoon", "Bharat sundar hai"]},
                                    "answer_data_json": {"correct_option": "Main Bharat se hoon"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I live in Delhi' into Hindi.",
                                    "question_data_json": {"source_text": "I live in Delhi"},
                                    "answer_data_json": {"accepted_answers": ["main dilli mein rehta hoon", "main delhi mein rehti hoon", "मैं दिल्ली में रहता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Assemble: 'Where are you from?'",
                                    "question_data_json": {"words": ["are", "Where", "from?", "you", "go", "to"]},
                                    "answer_data_json": {"correct_order": ["Where", "are", "you", "from?"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match locations.",
                                    "question_data_json": {
                                        "left": ["Country", "City", "Village", "Home"],
                                        "right": ["Sheher", "Desh", "Ghar", "Gaaon"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Country", "Desh"],
                                            ["City", "Sheher"],
                                            ["Village", "Gaaon"],
                                            ["Home", "Ghar"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'I come ___ Mumbai.'",
                                    "question_data_json": {"prefix": "I come ", "suffix": " Mumbai."},
                                    "answer_data_json": {"accepted_answers": ["from"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the English word for 'Desh':",
                                    "question_data_json": {"prompt": "Type the English word for 'Desh':"},
                                    "answer_data_json": {"accepted_answers": ["country"]},
                                },
                            ],
                        },
                    ],
                },
                {
                    "order_index": 3,
                    "title": "Numbers",
                    "description": "Learn numbers from 1 to 10 and count items.",
                    "icon_key": "numbers",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Numbers 1 to 5",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is the number 'Teen' in English?",
                                    "question_data_json": {"options": ["Three", "Two", "Four", "One"]},
                                    "answer_data_json": {"correct_option": "Three"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'One, two, three' into Hindi.",
                                    "question_data_json": {"source_text": "One, two, three"},
                                    "answer_data_json": {"accepted_answers": ["ek, do, teen", "ek do teen", "एक दो तीन"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Order the numbers: 'One, two, three, four, five'",
                                    "question_data_json": {"words": ["two,", "One,", "three,", "five", "four,", "six"]},
                                    "answer_data_json": {"correct_order": ["One,", "two,", "three,", "four,", "five"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match numbers 1 to 4.",
                                    "question_data_json": {
                                        "left": ["1 (One)", "2 (Two)", "3 (Three)", "4 (Four)"],
                                        "right": ["Do", "Chaar", "Ek", "Teen"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["1 (One)", "Ek"],
                                            ["2 (Two)", "Do"],
                                            ["3 (Three)", "Teen"],
                                            ["4 (Four)", "Chaar"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'One, two, ___, four.'",
                                    "question_data_json": {"prefix": "One, two, ", "suffix": ", four."},
                                    "answer_data_json": {"accepted_answers": ["three"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for '5':",
                                    "question_data_json": {"prompt": "Type the word for '5':"},
                                    "answer_data_json": {"accepted_answers": ["five"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Numbers 6 to 10",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is the number 'Das' in English?",
                                    "question_data_json": {"options": ["Ten", "Seven", "Nine", "Eight"]},
                                    "answer_data_json": {"correct_option": "Ten"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Seven' into Hindi.",
                                    "question_data_json": {"source_text": "Seven"},
                                    "answer_data_json": {"accepted_answers": ["saat", "सात"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'Six seven eight nine ten'",
                                    "question_data_json": {"words": ["seven", "Six", "nine", "eight", "ten", "five"]},
                                    "answer_data_json": {"correct_order": ["Six", "seven", "eight", "nine", "ten"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match numbers 6 to 9.",
                                    "question_data_json": {
                                        "left": ["Six", "Seven", "Eight", "Nine"],
                                        "right": ["Aath", "Chheh", "Nau", "Saat"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Six", "Chheh"],
                                            ["Seven", "Saat"],
                                            ["Eight", "Aath"],
                                            ["Nine", "Nau"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'Eight, nine, ___.'",
                                    "question_data_json": {"prefix": "Eight, nine, ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["ten"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the English word for 'Chheh' (6):",
                                    "question_data_json": {"prompt": "Type the English word for 'Chheh' (6):"},
                                    "answer_data_json": {"accepted_answers": ["six"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Counting Objects",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Translate: 'Two books'",
                                    "question_data_json": {"options": ["Do kitabein", "Ek kitaab", "Teen kitabein", "Chaar kitabein"]},
                                    "answer_data_json": {"correct_option": "Do kitabein"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I have three pens' into Hindi.",
                                    "question_data_json": {"source_text": "I have three pens"},
                                    "answer_data_json": {"accepted_answers": ["mere paas teen pen hain", "mere paas teen kalam hain", "मेरे पास तीन पेन हैं"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Build: 'I have two cats'",
                                    "question_data_json": {"words": ["two", "I", "cats", "have", "one", "dogs"]},
                                    "answer_data_json": {"correct_order": ["I", "have", "two", "cats"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match quantities.",
                                    "question_data_json": {
                                        "left": ["One car", "Two apples", "Three dogs", "Four chairs"],
                                        "right": ["Chaar kursiyan", "Ek gaadi", "Teen kutte", "Do seb"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["One car", "Ek gaadi"],
                                            ["Two apples", "Do seb"],
                                            ["Three dogs", "Teen kutte"],
                                            ["Four chairs", "Chaar kursiyan"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'She has five ___.' (pens)",
                                    "question_data_json": {"prefix": "She has five ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["pens", "books", "apples"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the plural of 'apple':",
                                    "question_data_json": {"prompt": "Type the plural of 'apple':"},
                                    "answer_data_json": {"accepted_answers": ["apples"]},
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        # =========================================================================
        # UNIT 2 - EVERYDAY WORDS
        # =========================================================================
        {
            "order_index": 2,
            "title": "Unit 2: Everyday Words",
            "description": "Vocabulary for family members, food & drink, and expressions of time.",
            "skills": [
                {
                    "order_index": 1,
                    "title": "Family",
                    "description": "Talk about parents, siblings, and family relationships.",
                    "icon_key": "family",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Parents & Siblings",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Mataji' in English?",
                                    "question_data_json": {"options": ["Mother", "Father", "Sister", "Brother"]},
                                    "answer_data_json": {"correct_option": "Mother"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'He is my brother' into Hindi.",
                                    "question_data_json": {"source_text": "He is my brother"},
                                    "answer_data_json": {"accepted_answers": ["wah mera bhai hai", "yeh mera bhai hai", "वह मेरा भाई है"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'She is my sister'",
                                    "question_data_json": {"words": ["sister", "is", "my", "She", "brother", "mother"]},
                                    "answer_data_json": {"correct_order": ["She", "is", "my", "sister"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match family words.",
                                    "question_data_json": {
                                        "left": ["Father", "Mother", "Brother", "Sister"],
                                        "right": ["Mata", "Behen", "Pita", "Bhai"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Father", "Pita"],
                                            ["Mother", "Mata"],
                                            ["Brother", "Bhai"],
                                            ["Sister", "Behen"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'This is my ___.' (father)",
                                    "question_data_json": {"prefix": "This is my ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["father", "mother", "brother", "sister"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the English word for 'Pita':",
                                    "question_data_json": {"prompt": "Type the English word for 'Pita':"},
                                    "answer_data_json": {"accepted_answers": ["father", "dad"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Extended Family",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What does 'Grandmother' mean?",
                                    "question_data_json": {"options": ["Dadi / Nani", "Dada / Nana", "Chachi", "Mami"]},
                                    "answer_data_json": {"correct_option": "Dadi / Nani"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'My uncle lives here' into Hindi.",
                                    "question_data_json": {"source_text": "My uncle lives here"},
                                    "answer_data_json": {"accepted_answers": ["mere chacha yahan rehte hain", "mere mama yahan rehte hain", "मेरे चाचा यहाँ रहते हैं"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Construct: 'My grandfather is kind'",
                                    "question_data_json": {"words": ["grandfather", "is", "My", "kind", "sister", "tall"]},
                                    "answer_data_json": {"correct_order": ["My", "grandfather", "is", "kind"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match relatives.",
                                    "question_data_json": {
                                        "left": ["Grandfather", "Grandmother", "Uncle", "Aunt"],
                                        "right": ["Chachi / Mami", "Dada / Nana", "Dadi / Nani", "Chacha / Mama"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Grandfather", "Dada / Nana"],
                                            ["Grandmother", "Dadi / Nani"],
                                            ["Uncle", "Chacha / Mama"],
                                            ["Aunt", "Chachi / Mami"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'My ___ is my father's sister.'",
                                    "question_data_json": {"prefix": "My ", "suffix": " is my father's sister."},
                                    "answer_data_json": {"accepted_answers": ["aunt", "bua"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Dada':",
                                    "question_data_json": {"prompt": "Type the word for 'Dada':"},
                                    "answer_data_json": {"accepted_answers": ["grandfather", "grandpa"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Describing Family",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Hamara parivar chhota hai'?",
                                    "question_data_json": {"options": ["Our family is small", "My family is big", "Their family is good", "We are family"]},
                                    "answer_data_json": {"correct_option": "Our family is small"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I love my family' into Hindi.",
                                    "question_data_json": {"source_text": "I love my family"},
                                    "answer_data_json": {"accepted_answers": ["main apne parivar se pyar karta hoon", "main apne parivar se prem karti hoon", "मैं अपने परिवार से प्यार करता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Assemble: 'We have a happy family'",
                                    "question_data_json": {"words": ["happy", "family", "We", "a", "have", "are"]},
                                    "answer_data_json": {"correct_order": ["We", "have", "a", "happy", "family"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match descriptions.",
                                    "question_data_json": {
                                        "left": ["Big", "Small", "Happy", "Loving"],
                                        "right": ["Chhota", "Bada", "Pyaar karne wala", "Khush"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Big", "Bada"],
                                            ["Small", "Chhota"],
                                            ["Happy", "Khush"],
                                            ["Loving", "Pyaar karne wala"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'I have a big ___.'",
                                    "question_data_json": {"prefix": "I have a big ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["family", "house", "room"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the English word for 'Parivar':",
                                    "question_data_json": {"prompt": "Type the English word for 'Parivar':"},
                                    "answer_data_json": {"accepted_answers": ["family"]},
                                },
                            ],
                        },
                    ],
                },
                {
                    "order_index": 2,
                    "title": "Food",
                    "description": "Names of drinks, meals, fruits, and ordering food.",
                    "icon_key": "food",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Common Drinks",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Paani' in English?",
                                    "question_data_json": {"options": ["Water", "Tea", "Milk", "Juice"]},
                                    "answer_data_json": {"correct_option": "Water"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I drink milk' into Hindi.",
                                    "question_data_json": {"source_text": "I drink milk"},
                                    "answer_data_json": {"accepted_answers": ["main doodh peeta hoon", "main doodh peeti hoon", "मैं दूध पीता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Build: 'I want cold water'",
                                    "question_data_json": {"words": ["cold", "water", "I", "want", "drink", "hot"]},
                                    "answer_data_json": {"correct_order": ["I", "want", "cold", "water"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match beverages.",
                                    "question_data_json": {
                                        "left": ["Water", "Tea", "Coffee", "Milk"],
                                        "right": ["Doodh", "Chai", "Paani", "Coffee"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Water", "Paani"],
                                            ["Tea", "Chai"],
                                            ["Coffee", "Coffee"],
                                            ["Milk", "Doodh"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'Please give me a glass of ___.'",
                                    "question_data_json": {"prefix": "Please give me a glass of ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["water", "milk", "juice"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Chai':",
                                    "question_data_json": {"prompt": "Type the word for 'Chai':"},
                                    "answer_data_json": {"accepted_answers": ["tea"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Fruits & Vegetables",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Seb' in English?",
                                    "question_data_json": {"options": ["Apple", "Banana", "Orange", "Mango"]},
                                    "answer_data_json": {"correct_option": "Apple"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Mango is sweet' into Hindi.",
                                    "question_data_json": {"source_text": "Mango is sweet"},
                                    "answer_data_json": {"accepted_answers": ["aam meetha hai", "aam meetha hota hai", "आम मीठा है"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Order: 'He eats an apple'",
                                    "question_data_json": {"words": ["an", "He", "eats", "apple", "a", "drinks"]},
                                    "answer_data_json": {"correct_order": ["He", "eats", "an", "apple"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match fruits.",
                                    "question_data_json": {
                                        "left": ["Apple", "Banana", "Mango", "Potato"],
                                        "right": ["Aam", "Aloo", "Seb", "Kela"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Apple", "Seb"],
                                            ["Banana", "Kela"],
                                            ["Mango", "Aam"],
                                            ["Potato", "Aloo"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'An ___ a day keeps the doctor away.'",
                                    "question_data_json": {"prefix": "An ", "suffix": " a day keeps the doctor away."},
                                    "answer_data_json": {"accepted_answers": ["apple"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the English word for 'Kela':",
                                    "question_data_json": {"prompt": "Type the English word for 'Kela':"},
                                    "answer_data_json": {"accepted_answers": ["banana"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Meals & Dining",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Naashta' in English?",
                                    "question_data_json": {"options": ["Breakfast", "Lunch", "Dinner", "Snack"]},
                                    "answer_data_json": {"correct_option": "Breakfast"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Dinner is ready' into Hindi.",
                                    "question_data_json": {"source_text": "Dinner is ready"},
                                    "answer_data_json": {"accepted_answers": ["raat ka khana taiyar hai", "dinner taiyar hai", "रात का खाना तैयार है"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Assemble: 'The food is delicious'",
                                    "question_data_json": {"words": ["delicious", "is", "The", "food", "tasty", "was"]},
                                    "answer_data_json": {"correct_order": ["The", "food", "is", "delicious"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match meal times.",
                                    "question_data_json": {
                                        "left": ["Breakfast", "Lunch", "Dinner", "Bread"],
                                        "right": ["Raat ka khana", "Roti", "Dopahar ka khana", "Naashta"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Breakfast", "Naashta"],
                                            ["Lunch", "Dopahar ka khana"],
                                            ["Dinner", "Raat ka khana"],
                                            ["Bread", "Roti"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'I eat ___ at 1 PM.'",
                                    "question_data_json": {"prefix": "I eat ", "suffix": " at 1 PM."},
                                    "answer_data_json": {"accepted_answers": ["lunch", "food"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Khana':",
                                    "question_data_json": {"prompt": "Type the word for 'Khana':"},
                                    "answer_data_json": {"accepted_answers": ["food", "meal"]},
                                },
                            ],
                        },
                    ],
                },
                {
                    "order_index": 3,
                    "title": "Time",
                    "description": "Days of the week, parts of the day, and tell time.",
                    "icon_key": "time",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Days of the Week",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What day is 'Somvaar' in English?",
                                    "question_data_json": {"options": ["Monday", "Tuesday", "Sunday", "Friday"]},
                                    "answer_data_json": {"correct_option": "Monday"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Sunday is a holiday' into Hindi.",
                                    "question_data_json": {"source_text": "Sunday is a holiday"},
                                    "answer_data_json": {"accepted_answers": ["ravivaar chhutti hai", "itwaar chhutti hai", "रविवार को छुट्टी है"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Construct: 'Today is Sunday'",
                                    "question_data_json": {"words": ["Sunday", "is", "Today", "Monday", "was"]},
                                    "answer_data_json": {"correct_order": ["Today", "is", "Sunday"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match days.",
                                    "question_data_json": {
                                        "left": ["Monday", "Friday", "Saturday", "Sunday"],
                                        "right": ["Shukravaar", "Somvaar", "Ravivaar", "Shanivaar"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Monday", "Somvaar"],
                                            ["Friday", "Shukravaar"],
                                            ["Saturday", "Shanivaar"],
                                            ["Sunday", "Ravivaar"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'Tomorrow is ___.'",
                                    "question_data_json": {"prefix": "Tomorrow is ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Ravivaar':",
                                    "question_data_json": {"prompt": "Type the word for 'Ravivaar':"},
                                    "answer_data_json": {"accepted_answers": ["sunday"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Times of Day",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Shaam' in English?",
                                    "question_data_json": {"options": ["Evening", "Morning", "Night", "Afternoon"]},
                                    "answer_data_json": {"correct_option": "Evening"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'In the morning' into Hindi.",
                                    "question_data_json": {"source_text": "In the morning"},
                                    "answer_data_json": {"accepted_answers": ["subah mein", "subah ko", "सुबह में"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'I study in the evening'",
                                    "question_data_json": {"words": ["study", "evening", "in", "the", "I", "morning"]},
                                    "answer_data_json": {"correct_order": ["I", "study", "in", "the", "evening"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match parts of the day.",
                                    "question_data_json": {
                                        "left": ["Morning", "Afternoon", "Evening", "Night"],
                                        "right": ["Dopahar", "Raat", "Subah", "Shaam"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Morning", "Subah"],
                                            ["Afternoon", "Dopahar"],
                                            ["Evening", "Shaam"],
                                            ["Night", "Raat"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'The stars shine at ___.'",
                                    "question_data_json": {"prefix": "The stars shine at ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["night"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Subah':",
                                    "question_data_json": {"prompt": "Type the word for 'Subah':"},
                                    "answer_data_json": {"accepted_answers": ["morning"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Clock Time",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Kitaney baje hain?'",
                                    "question_data_json": {"options": ["What time is it?", "Where is the clock?", "How is the time?", "What is the day?"]},
                                    "answer_data_json": {"correct_option": "What time is it?"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'It is five o'clock' into Hindi.",
                                    "question_data_json": {"source_text": "It is five o'clock"},
                                    "answer_data_json": {"accepted_answers": ["paanch baje hain", "paanch baj rahe hain", "पाँच बजे हैं"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Build: 'It is two o'clock'",
                                    "question_data_json": {"words": ["two", "It", "is", "o'clock", "three", "at"]},
                                    "answer_data_json": {"correct_order": ["It", "is", "two", "o'clock"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match time words.",
                                    "question_data_json": {
                                        "left": ["Hour", "Minute", "Second", "Clock"],
                                        "right": ["Ghadi", "Ghanta", "Second", "Minute"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Hour", "Ghanta"],
                                            ["Minute", "Minute"],
                                            ["Second", "Second"],
                                            ["Clock", "Ghadi"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'What ___ is it?'",
                                    "question_data_json": {"prefix": "What ", "suffix": " is it?"},
                                    "answer_data_json": {"accepted_answers": ["time"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Ghanta':",
                                    "question_data_json": {"prompt": "Type the word for 'Ghanta':"},
                                    "answer_data_json": {"accepted_answers": ["hour"]},
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        # =========================================================================
        # UNIT 3 - SIMPLE SENTENCES
        # =========================================================================
        {
            "order_index": 3,
            "title": "Unit 3: Simple Sentences",
            "description": "Common verbs, daily actions, and routine sentences.",
            "skills": [
                {
                    "order_index": 1,
                    "title": "Common Verbs",
                    "description": "Master essential action verbs like eat, drink, go, and come.",
                    "icon_key": "verbs",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Action Verbs",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Jaana' in English?",
                                    "question_data_json": {"options": ["To go", "To come", "To eat", "To sleep"]},
                                    "answer_data_json": {"correct_option": "To go"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I go to school' into Hindi.",
                                    "question_data_json": {"source_text": "I go to school"},
                                    "answer_data_json": {"accepted_answers": ["main school jaata hoon", "main school jaati hoon", "मैं स्कूल जाता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Construct: 'They eat bread'",
                                    "question_data_json": {"words": ["eat", "They", "bread", "water", "drinks"]},
                                    "answer_data_json": {"correct_order": ["They", "eat", "bread"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match action verbs.",
                                    "question_data_json": {
                                        "left": ["Eat", "Drink", "Sleep", "Read"],
                                        "right": ["Sona", "Peena", "Padhna", "Khana"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Eat", "Khana"],
                                            ["Drink", "Peena"],
                                            ["Sleep", "Sona"],
                                            ["Read", "Padhna"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'We ___ books every day.'",
                                    "question_data_json": {"prefix": "We ", "suffix": " books every day."},
                                    "answer_data_json": {"accepted_answers": ["read"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the English word for 'Aana':",
                                    "question_data_json": {"prompt": "Type the English word for 'Aana':"},
                                    "answer_data_json": {"accepted_answers": ["come", "to come"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Sensory Verbs",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Dekhna' in English?",
                                    "question_data_json": {"options": ["See / Look", "Hear / Listen", "Speak", "Touch"]},
                                    "answer_data_json": {"correct_option": "See / Look"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I hear music' into Hindi.",
                                    "question_data_json": {"source_text": "I hear music"},
                                    "answer_data_json": {"accepted_answers": ["main sangeet sunta hoon", "main gana sunta hoon", "मैं संगीत सुनता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Assemble: 'I see a bird'",
                                    "question_data_json": {"words": ["see", "bird", "a", "I", "hear", "tree"]},
                                    "answer_data_json": {"correct_order": ["I", "see", "a", "bird"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match sensory verbs.",
                                    "question_data_json": {
                                        "left": ["See", "Hear", "Speak", "Listen"],
                                        "right": ["Dhyan se sunna", "Sunna", "Dekhna", "Bolna"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["See", "Dekhna"],
                                            ["Hear", "Sunna"],
                                            ["Speak", "Bolna"],
                                            ["Listen", "Dhyan se sunna"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'Please ___ to me.'",
                                    "question_data_json": {"prefix": "Please ", "suffix": " to me."},
                                    "answer_data_json": {"accepted_answers": ["listen", "talk", "speak"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Bolna':",
                                    "question_data_json": {"prompt": "Type the word for 'Bolna':"},
                                    "answer_data_json": {"accepted_answers": ["speak", "talk"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "To Have and To Be",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Choose the correct form: 'She ___ a doctor.'",
                                    "question_data_json": {"options": ["is", "am", "are", "be"]},
                                    "answer_data_json": {"correct_option": "is"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'We are friends' into Hindi.",
                                    "question_data_json": {"source_text": "We are friends"},
                                    "answer_data_json": {"accepted_answers": ["hum dost hain", "hum mitra hain", "हम दोस्त हैं"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'He has a bicycle'",
                                    "question_data_json": {"words": ["has", "He", "bicycle", "a", "have", "is"]},
                                    "answer_data_json": {"correct_order": ["He", "has", "a", "bicycle"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match verb pairings.",
                                    "question_data_json": {
                                        "left": ["I am", "You are", "He is", "They have"],
                                        "right": ["Wah hai", "Unke paas hai", "Main hoon", "Aap hain"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["I am", "Main hoon"],
                                            ["You are", "Aap hain"],
                                            ["He is", "Wah hai"],
                                            ["They have", "Unke paas hai"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'They ___ students.'",
                                    "question_data_json": {"prefix": "They ", "suffix": " students."},
                                    "answer_data_json": {"accepted_answers": ["are"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Complete: 'I have, but he ___.'",
                                    "question_data_json": {"prompt": "Complete: 'I have, but he ___.'"},
                                    "answer_data_json": {"accepted_answers": ["has"]},
                                },
                            ],
                        },
                    ],
                },
                {
                    "order_index": 2,
                    "title": "Daily Routine",
                    "description": "Express habits, waking up, and daily schedule.",
                    "icon_key": "routine",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Morning Habits",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Translate: 'Main subah 6 baje uthta hoon.'",
                                    "question_data_json": {"options": ["I wake up at 6 AM", "I sleep at 6 AM", "I walk at 6 AM", "I eat at 6 AM"]},
                                    "answer_data_json": {"correct_option": "I wake up at 6 AM"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I brush my teeth' into Hindi.",
                                    "question_data_json": {"source_text": "I brush my teeth"},
                                    "answer_data_json": {"accepted_answers": ["main daant saaf karta hoon", "main brush karta hoon", "मैं दाँत साफ करता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Construct: 'I take a shower'",
                                    "question_data_json": {"words": ["shower", "take", "I", "a", "bath", "drink"]},
                                    "answer_data_json": {"correct_order": ["I", "take", "a", "shower"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match morning actions.",
                                    "question_data_json": {
                                        "left": ["Wake up", "Brush teeth", "Wash face", "Eat breakfast"],
                                        "right": ["Daant saaf karna", "Muh dhona", "Uthna", "Naashta karna"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Wake up", "Uthna"],
                                            ["Brush teeth", "Daant saaf karna"],
                                            ["Wash face", "Muh dhona"],
                                            ["Eat breakfast", "Naashta karna"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'I wake ___ early every day.'",
                                    "question_data_json": {"prefix": "I wake ", "suffix": " early every day."},
                                    "answer_data_json": {"accepted_answers": ["up"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Subah jaldi':",
                                    "question_data_json": {"prompt": "Type the word for 'Jaldi':"},
                                    "answer_data_json": {"accepted_answers": ["early"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Work & Study",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Office' in Hindi?",
                                    "question_data_json": {"options": ["Daftar / Karyalay", "Ghar", "Dukan", "Aspataal"]},
                                    "answer_data_json": {"correct_option": "Daftar / Karyalay"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I work from home' into Hindi.",
                                    "question_data_json": {"source_text": "I work from home"},
                                    "answer_data_json": {"accepted_answers": ["main ghar se kaam karta hoon", "main ghar se kaam karti hoon", "मैं घर से काम करता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Assemble: 'She works at an office'",
                                    "question_data_json": {"words": ["works", "at", "She", "an", "office", "a"]},
                                    "answer_data_json": {"correct_order": ["She", "works", "at", "an", "office"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match work words.",
                                    "question_data_json": {
                                        "left": ["Work", "Study", "Office", "School"],
                                        "right": ["Vidyalay", "Padhai", "Kaam", "Daftar"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Work", "Kaam"],
                                            ["Study", "Padhai"],
                                            ["Office", "Daftar"],
                                            ["School", "Vidyalay"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'He goes to ___ by bus.'",
                                    "question_data_json": {"prefix": "He goes to ", "suffix": " by bus."},
                                    "answer_data_json": {"accepted_answers": ["work", "school", "office"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Kaam':",
                                    "question_data_json": {"prompt": "Type the word for 'Kaam':"},
                                    "answer_data_json": {"accepted_answers": ["work", "job"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Evening Habits",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Translate: 'Main raat ko kitaab padhta hoon.'",
                                    "question_data_json": {"options": ["I read a book at night", "I write a book", "I buy a book", "I close the book"]},
                                    "answer_data_json": {"correct_option": "I read a book at night"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I go to bed at 10 PM' into Hindi.",
                                    "question_data_json": {"source_text": "I go to bed at 10 PM"},
                                    "answer_data_json": {"accepted_answers": ["main 10 baje sota hoon", "main raat ko 10 baje sota hoon", "मैं १० बजे सोता हूँ"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'I relax after dinner'",
                                    "question_data_json": {"words": ["relax", "after", "I", "dinner", "lunch", "before"]},
                                    "answer_data_json": {"correct_order": ["I", "relax", "after", "dinner"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match evening activities.",
                                    "question_data_json": {
                                        "left": ["Dinner", "Watch TV", "Read book", "Sleep"],
                                        "right": ["Sona", "Raat ka khana", "Kitaab padhna", "TV dekhna"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Dinner", "Raat ka khana"],
                                            ["Watch TV", "TV dekhna"],
                                            ["Read book", "Kitaab padhna"],
                                            ["Sleep", "Sona"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'It is time to ___.' (sleep)",
                                    "question_data_json": {"prefix": "It is time to ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["sleep", "rest"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Sona' (rest/sleep):",
                                    "question_data_json": {"prompt": "Type the word for 'Sona':"},
                                    "answer_data_json": {"accepted_answers": ["sleep"]},
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        # =========================================================================
        # UNIT 4 - DAILY CONVERSATION
        # =========================================================================
        {
            "order_index": 4,
            "title": "Unit 4: Daily Conversation",
            "description": "Form questions, seek directions, and communicate during travel.",
            "skills": [
                {
                    "order_index": 1,
                    "title": "Questions",
                    "description": "Form WH-questions (what, where, when, why, who, how).",
                    "icon_key": "questions",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "What and Who",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you ask 'Yeh kya hai?' in English?",
                                    "question_data_json": {"options": ["What is this?", "Who is this?", "Where is this?", "Why is this?"]},
                                    "answer_data_json": {"correct_option": "What is this?"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Who is that person?' into Hindi.",
                                    "question_data_json": {"source_text": "Who is that person?"},
                                    "answer_data_json": {"accepted_answers": ["wah vyakti kaun hai?", "wah kaun hai?", "वह व्यक्ति कौन है?"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Build: 'What do you want?'",
                                    "question_data_json": {"words": ["do", "What", "want?", "you", "are", "have"]},
                                    "answer_data_json": {"correct_order": ["What", "do", "you", "want?"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match question phrases.",
                                    "question_data_json": {
                                        "left": ["What is this?", "Who are you?", "What happened?", "Who called?"],
                                        "right": ["Aap kaun hain?", "Kya hua?", "Yeh kya hai?", "Kisne call kiya?"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["What is this?", "Yeh kya hai?"],
                                            ["Who are you?", "Aap kaun hain?"],
                                            ["What happened?", "Kya hua?"],
                                            ["Who called?", "Kisne call kiya?"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'___ is your favorite color?'",
                                    "question_data_json": {"prefix": "", "suffix": " is your favorite color?"},
                                    "answer_data_json": {"accepted_answers": ["What", "Which"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the question word for 'Kaun':",
                                    "question_data_json": {"prompt": "Type the question word for 'Kaun':"},
                                    "answer_data_json": {"accepted_answers": ["who"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Where and When",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What does 'Where are you going?' mean?",
                                    "question_data_json": {"options": ["Aap kahan jaa rahe hain?", "Aap kab aayenge?", "Aap kiske saath hain?", "Aap kya kar rahe hain?"]},
                                    "answer_data_json": {"correct_option": "Aap kahan jaa rahe hain?"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'When is the train?' into Hindi.",
                                    "question_data_json": {"source_text": "When is the train?"},
                                    "answer_data_json": {"accepted_answers": ["train kab hai?", "gaadi kab aayegi?", "ट्रेन कब है?"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'Where is the hospital?'",
                                    "question_data_json": {"words": ["hospital?", "the", "Where", "is", "when", "are"]},
                                    "answer_data_json": {"correct_order": ["Where", "is", "the", "hospital?"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match location and time questions.",
                                    "question_data_json": {
                                        "left": ["Where is it?", "When will you come?", "Where do you live?", "When does it open?"],
                                        "right": ["Aap kab aayenge?", "Yeh kahan hai?", "Yeh kab khulta hai?", "Aap kahan rehte hain?"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Where is it?", "Yeh kahan hai?"],
                                            ["When will you come?", "Aap kab aayenge?"],
                                            ["Where do you live?", "Aap kahan rehte hain?"],
                                            ["When does it open?", "Yeh kab khulta hai?"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'___ is the bus stop?'",
                                    "question_data_json": {"prefix": "", "suffix": " is the bus stop?"},
                                    "answer_data_json": {"accepted_answers": ["Where"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the question word for 'Kab':",
                                    "question_data_json": {"prompt": "Type the question word for 'Kab':"},
                                    "answer_data_json": {"accepted_answers": ["when"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "Why and How",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What does 'Why are you laughing?' mean?",
                                    "question_data_json": {"options": ["Aap kyon hans rahe hain?", "Aap kaise hain?", "Aap kya chahte hain?", "Aap kab hansenge?"]},
                                    "answer_data_json": {"correct_option": "Aap kyon hans rahe hain?"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'How much does it cost?' into Hindi.",
                                    "question_data_json": {"source_text": "How much does it cost?"},
                                    "answer_data_json": {"accepted_answers": ["iski keemat kya hai?", "yeh kitne ka hai?", "यह कितने का है?"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Assemble: 'How are you today?'",
                                    "question_data_json": {"words": ["today?", "you", "How", "are", "why", "fine"]},
                                    "answer_data_json": {"correct_order": ["How", "are", "you", "today?"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match why/how phrases.",
                                    "question_data_json": {
                                        "left": ["Why not?", "How much?", "How many?", "Why late?"],
                                        "right": ["Kitna?", "Kyon nahi?", "Der kyon hui?", "Kitne?"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Why not?", "Kyon nahi?"],
                                            ["How much?", "Kitna?"],
                                            ["How many?", "Kitne?"],
                                            ["Why late?", "Der kyon hui?"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'___ are you crying?'",
                                    "question_data_json": {"prefix": "", "suffix": " are you crying?"},
                                    "answer_data_json": {"accepted_answers": ["Why"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the question word for 'Kyon':",
                                    "question_data_json": {"prompt": "Type the question word for 'Kyon':"},
                                    "answer_data_json": {"accepted_answers": ["why"]},
                                },
                            ],
                        },
                    ],
                },
                {
                    "order_index": 2,
                    "title": "Travel",
                    "description": "Navigate transit, ask for directions, and buy tickets.",
                    "icon_key": "travel",
                    "node_type": "skill",
                    "total_lessons": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Directions",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Daayein' in English?",
                                    "question_data_json": {"options": ["Right", "Left", "Straight", "Back"]},
                                    "answer_data_json": {"correct_option": "Right"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'Turn left' into Hindi.",
                                    "question_data_json": {"source_text": "Turn left"},
                                    "answer_data_json": {"accepted_answers": ["baayein mudiye", "baayein mudho", "बाएं मुड़िए"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Construct: 'Go straight ahead'",
                                    "question_data_json": {"words": ["straight", "ahead", "Go", "turn", "right", "back"]},
                                    "answer_data_json": {"correct_order": ["Go", "straight", "ahead"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match directional words.",
                                    "question_data_json": {
                                        "left": ["Left", "Right", "Straight", "Near"],
                                        "right": ["Seedhe", "Paas", "Daayein", "Baayein"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Left", "Baayein"],
                                            ["Right", "Daayein"],
                                            ["Straight", "Seedhe"],
                                            ["Near", "Paas"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'The bank is on the ___ side.' (left)",
                                    "question_data_json": {"prefix": "The bank is on the ", "suffix": " side."},
                                    "answer_data_json": {"accepted_answers": ["left", "right", "other"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the English word for 'Seedhe':",
                                    "question_data_json": {"prompt": "Type the English word for 'Seedhe':"},
                                    "answer_data_json": {"accepted_answers": ["straight"]},
                                },
                            ],
                        },
                        {
                            "order_index": 2,
                            "title": "Transportation",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "What is 'Rail gaadi' called in English?",
                                    "question_data_json": {"options": ["Train", "Bus", "Aeroplane", "Car"]},
                                    "answer_data_json": {"correct_option": "Train"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'I need a taxi' into Hindi.",
                                    "question_data_json": {"source_text": "I need a taxi"},
                                    "answer_data_json": {"accepted_answers": ["mujhe taxi chahiye", "mujhe ek taxi chahiye", "मुझे टैक्सी चाहिए"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Arrange: 'The bus has arrived'",
                                    "question_data_json": {"words": ["arrived", "bus", "The", "has", "train", "late"]},
                                    "answer_data_json": {"correct_order": ["The", "bus", "has", "arrived"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match vehicles.",
                                    "question_data_json": {
                                        "left": ["Train", "Bus", "Aeroplane", "Bicycle"],
                                        "right": ["Hawaai jahaj", "Rail gaadi", "Cycle", "Bus"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Train", "Rail gaadi"],
                                            ["Bus", "Bus"],
                                            ["Aeroplane", "Hawaai jahaj"],
                                            ["Bicycle", "Cycle"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'I travel by ___.'",
                                    "question_data_json": {"prefix": "I travel by ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["train", "bus", "car", "plane"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Ticket':",
                                    "question_data_json": {"prompt": "Type the word for 'Ticket':"},
                                    "answer_data_json": {"accepted_answers": ["ticket"]},
                                },
                            ],
                        },
                        {
                            "order_index": 3,
                            "title": "At the Station",
                            "xp_reward": 10,
                            "estimated_seconds": 180,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Where do you board a train?",
                                    "question_data_json": {"options": ["Platform", "Runway", "Port", "Highway"]},
                                    "answer_data_json": {"correct_option": "Platform"},
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate",
                                    "prompt": "Translate 'One ticket to Delhi please' into Hindi.",
                                    "question_data_json": {"source_text": "One ticket to Delhi please"},
                                    "answer_data_json": {"accepted_answers": ["kripya dilli ke liye ek ticket", "dilli ka ek ticket kripya", "दिल्ली के लिए एक टिकट कृपया"]},
                                },
                                {
                                    "order_index": 3,
                                    "type": "word_bank",
                                    "prompt": "Assemble: 'Where is platform number two?'",
                                    "question_data_json": {"words": ["platform", "two?", "Where", "number", "is", "train"]},
                                    "answer_data_json": {"correct_order": ["Where", "is", "platform", "number", "two?"]},
                                },
                                {
                                    "order_index": 4,
                                    "type": "match_pairs",
                                    "prompt": "Match station terms.",
                                    "question_data_json": {
                                        "left": ["Platform", "Ticket Counter", "Luggage", "Passenger"],
                                        "right": ["Samaan", "Platform", "Yatri", "Ticket khidki"],
                                    },
                                    "answer_data_json": {
                                        "pairs": [
                                            ["Platform", "Platform"],
                                            ["Ticket Counter", "Ticket khidki"],
                                            ["Luggage", "Samaan"],
                                            ["Passenger", "Yatri"],
                                        ]
                                    },
                                },
                                {
                                    "order_index": 5,
                                    "type": "fill_blank",
                                    "prompt": "'The train is on platform ___.'",
                                    "question_data_json": {"prefix": "The train is on platform ", "suffix": "."},
                                    "answer_data_json": {"accepted_answers": ["one", "two", "three", "four", "five"]},
                                },
                                {
                                    "order_index": 6,
                                    "type": "type_answer",
                                    "prompt": "Type the word for 'Station':",
                                    "question_data_json": {"prompt": "Type the word for 'Station':"},
                                    "answer_data_json": {"accepted_answers": ["station"]},
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
