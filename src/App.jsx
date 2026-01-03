import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, BookmarkPlus, ChevronDown } from 'lucide-react';
const quotes = [
  {
    quote: "بينما أقنعنا كوبرنيكوس بالاعتقاد، خلافًا لجميع حواسنا، بأن الأرض لا تقف ساكنة، علّمنا بوسكوفيتش التخلي عن الاعتقاد في آخر جزء من الأرض الذي كان 'يقف ساكنًا'، الاعتقاد في 'المادة'، في 'المادي'، في القطعة المتبقية من الأرض وكتلة الذرة: كان ذلك أعظم انتصار على الحواس عرفه العالم على الإطلاق.",
    author: "فريدريك نيتشه",
    book: "ما وراء الخير والشر"
  },
  {
    quote: "حول البطل يتحول كل شيء إلى مأساة، وحول نصف إله يتحول كل شيء إلى مسرحية ساخرة؛ وحول الله يتحول كل شيء إلى — ماذا تظنون؟ ربما 'العالم'؟—",
    author: "فريدريك نيتشه",
    book: "ما وراء الخير والشر"
  },
  {
    quote: "من يحتقر نفسه لا يزال يحترم نفسه كمن يحتقر.",
    author: "فريدريك نيتشه",
    book: "ما وراء الخير والشر"
  },
  {
    quote: "لا يمكنك أبدًا إقناع قرد بأن يعطيك موزة بوعده بموز لا محدود بعد الموت في جنة القرود.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "كيف تجعل الناس يؤمنون بنظام متخيل مثل المسيحية أو الديمقراطية أو الرأسمالية؟ أولاً، لا تعترف أبدًا بأن النظام متخيل.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "تميل الثقافة إلى القول إنها تحظر فقط ما هو غير طبيعي. لكن من منظور بيولوجي، لا شيء غير طبيعي. كل ما هو ممكن فهو بالتعريف طبيعي أيضًا.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "إحدى القوانين الحديدية القليلة في التاريخ هي أن الكماليات تميل إلى أن تصبح ضروريات وتولد التزامات جديدة.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "الثبات هو ملعب العقول البليدة.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "لم نُدجن القمح. هو الذي دجننا.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "المال هو أكثر نظام عالمي وأكثر كفاءة للثقة المتبادلة تم ابتكاره على الإطلاق.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "أدى غسيل الدماغ الأحادي لألفي عام إلى جعل معظم الغربيين يرون التعددية الإلهية على أنها عبادة أصنام جاهلة وطفولية. هذا صورة نمطية غير عادلة.",
    author: "يوفال نوح حراري",
    book: "سابيينس: تاريخ موجز للجنس البشري"
  },
  {
    quote: "الكلمات يمكن أن تكون كالأشعة السينية إذا استخدمتها بشكل صحيح – فهي تخترق أي شيء. تقرأ وتُخترق.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "لكني لا أريد الراحة. أريد الله، أريد الشعر، أريد الخطر الحقيقي، أريد الحرية، أريد الخير. أريد الخطيئة.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "السعادة الحقيقية تبدو دائمًا بائسة نسبيًا مقارنة بالتعويضات الزائدة عن البؤس. السعادة ليست عظيمة أبدًا.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "إذا كان المرء مختلفًا، فهو محكوم عليه بالوحدة.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "أريد أن أعرف ما هي العاطفة. أريد أن أشعر بشيء بقوة.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "يؤمن المرء بالأشياء لأنه تم تهيئته ليؤمن بها.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "أنا أنا، وأتمنى لو لم أكن.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "لدى معظم البشر قدرة شبه لا نهائية على أخذ الأشياء كأمر مسلم به.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "الندم المزمن شعور غير مرغوب فيه للغاية. التمرغ في الوحل ليس أفضل طريقة للتنظيف.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "أحب أن أكون نفسي. نفسي وقذرًا.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "سيكبر معظم الرجال والنساء ليحبوا عبوديتهم ولن يحلموا أبدًا بالثورة.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "حسنًا إذن، أنا أطالب بحقي في أن أكون تعيسًا. ناهيك عن الحق في الشيخوخة والقبح والعجز الجنسي؛ الحق في الإصابة بالزهري والسرطان؛ الحق في قلة الطعام؛ الحق في أن أكون قذرًا؛ الحق في العيش في قلق دائم مما قد يحدث غدًا؛ الحق في الإصابة بالتيفوئيد؛ الحق في التعذيب بآلام لا تُوصف من كل نوع. أطالب بها جميعًا.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "لا استقرار اجتماعي بدون استقرار فردي.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "أفضل أن أكون نفسي. نفسي وقذرًا. لا شخصًا آخر، مهما كان مرحًا.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "أكلت الحضارة. سمتني؛ تدنست. ثم أكلت شري نفسي.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "الدولة الشمولية الأكثر كفاءة هي تلك التي يحب فيها الناس عبوديتهم.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "الواقع، مهما كان مثاليًا، هو شيء يشعر الناس بالحاجة إلى أخذ إجازات متكررة منه.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "يؤمن الناس بالله لأنهم تم تهيئتهم ليؤمنوا.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "التخلص من كل شيء غير سار بدلاً من تعلم تحمله أمر سهل للغاية.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "إحدى الوظائف الرئيسية للصديق هي أن يتحمل عقوبات رمزية نيابة عنا.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "حب الطبيعة لا يبقي المصانع مشغولة.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "عظيم هو الحق، لكن أعظم منه الصمت عن الحق.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "كل مزايا المسيحية والكحول؛ بدون أي من عيوبهما.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "من الطبيعي أن يؤمن المرء بالله عندما يكون وحيدًا تمامًا، في الليل، يفكر في الموت.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "النهاية أفضل من الإصلاح.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "نحن لسنا سادة أنفسنا.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "يجب تحفيز الغدد الكظرية لدى الرجال والنساء من وقت لآخر.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "نفضل فعل الأشياء براحة.",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "أليس هناك شيء في العيش بخطر؟",
    author: "ألدوس هكسلي",
    book: "عالم جديد شجاع"
  },
  {
    quote: "الألم والمعاناة لا مفر منهما دائمًا للذكاء الكبير والقلب العميق. يجب أن يكون للرجال العظماء حقًا، أعتقد، حزن كبير على الأرض.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "السير في طريقك الخاطئ أفضل من السير في طريق شخص آخر الصحيح.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "يحتاج الأمر إلى شيء أكثر من الذكاء للتصرف بذكاء.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "نصادف أحيانًا أشخاصًا، حتى غرباء تمامًا، يبدأون في إثارة اهتمامنا من النظرة الأولى، فجأة وبشكل مفاجئ، قبل أن تُنطق كلمة واحدة.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "اتخاذ خطوة جديدة، أو نطق كلمة جديدة، هو ما يخافه الناس أكثر من أي شيء.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "أسوأ خطيئتك هي أنك دمرت وخنت نفسك من أجل لا شيء.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "كنت أحلل نفسي حتى آخر خيط، أقارن نفسي بالآخرين، أتذكر أصغر النظرات والابتسامات والكلمات لمن حاولت أن أكون صريحًا معهم، أفسر كل شيء بضوء سيء، أضحك بشراسة على محاولاتي 'أن أكون مثل الباقين' – وفجأة، في وسط ضحكي، أستسلم للحزن، أقع في كآبة سخيفة وأبدأ العملية كلها من جديد – باختصار، كنت أدور كالسناجب على عجلة.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "الإنسان ذو الضمير يعاني وهو يعترف بخطيئته. تلك هي عقوبته.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "عندما يفشل العقل، يساعد الشيطان!",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "لم أنحنِ لك، بل انحنيت لكل معاناة الإنسانية.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "مئة شك لا تصنع دليلاً.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "وتعرفون، كنت أسأل نفسي حينها: لماذا أنا غبي إلى هذا الحد بحيث إذا كان الآخرون أغبياء – وأنا أعرف أنهم كذلك – فلماذا لا أكون أحكم؟",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "هل تعتقدون أن جريمة صغيرة واحدة لن تمحى بآلاف الأعمال الطيبة؟",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "الوجود وحده لم يكن كافيًا له أبدًا؛ كان يريد دائمًا المزيد. ربما كان فقط من قوة رغباته أنه اعتبر نفسه رجلاً يُسمح له بأكثر مما يُسمح للآخرين.",
    author: "فيودور دوستويفسكي",
    book: "الجريمة والعقاب"
  },
  {
    quote: "حديقة للمشي فيها وفضاء لا نهائي للحلم فيه – ماذا يمكن أن يطلب أكثر؟ بعض الزهور عند قدميه وفوقه النجوم.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "أمامه رأى طريقين، كلاهما مستقيم بنفس القدر؛ لكنه رأى اثنين؛ وهذا أرعبه – هو الذي لم يعرف في حياته سوى خط مستقيم واحد. ويا للألم المر، هذان الطريقان متناقضان.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "وتذكروا الحقيقة التي قيلت ذات مرة: أن تحب شخصًا آخر هو أن ترى وجه الله.",
    author: "هربرت كريتزمر",
    book: "البؤساء"
  },
  {
    quote: "طالما بقيت الجهل والبؤس على الأرض، فإن كتبًا مثل هذه ستكون ضرورية.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "كان ماريوس وكوزيت في الظلام بالنسبة لبعضهما. لم يتحدثا، لم ينحنيا، لم يتعارفا؛ كانا يريان بعضهما؛ ومثل النجوم في السماء المفصولة بملايين الفراسخ، عاشا بالنظر إلى بعضهما.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "لا أحد يحب النور مثل الأعمى.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "أريد شرابًا. أرغب في نسيان الحياة. الحياة اختراع بشع من شخص لا أعرفه. لا تدوم، وهي لا تصلح لشيء. تكسر رقبتك فقط بالعيش.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "وهل تعرف السيد ماريوس؟ أعتقد أنني كنت قليلاً في حبك.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "الأخلاق هي الحقيقة في ازدهارها الكامل.",
    author: "فيكتور هوغو",
    book: "البؤساء"
  },
  {
    quote: "أنا غابة، وليلة من الأشجار الداكنة: لكن من لا يخاف ظلمتي، سيجد ضفافًا مليئة بالورود تحت سروي.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "كلما ارتفعنا، بدنا أصغر لمن لا يستطيعون الطيران.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "يجب أن تكون مستعدًا لحرق نفسك في لهيبك الخاص؛ كيف يمكنك أن تنهض من جديد إذا لم تصبح رمادًا أولاً؟",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "الصمت أسوأ؛ كل الحقائق التي تُكتم تصبح سامة.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "الوحيد يمد يده بسرعة كبيرة لمن يصادفه.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "يرد الجميل للمعلم ردًا سيئًا إذا بقي دائمًا مجرد تلميذ.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "هناك حكمة أكثر في جسدك من في فلسفتك الأعمق.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "كن من أنت!",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "أسوأ عدو قد تواجهه سيكون دائمًا نفسك؛ أنت تتربص بنفسك في الكهوف والغابات. أيها الوحيد، أنت تسير في طريق نحو نفسك!",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "وبمجرد أن تستيقظ، ستبقى مستيقظًا إلى الأبد.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "يجب أن تكون بحرًا لتستقبل تيارًا ملوثًا دون أن تصبح نجسًا.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "لكن الأمر مع الإنسان كما مع الشجرة. كلما سعى للارتفاع نحو الارتفاع والنور، كلما قاومت جذوره الأرض بقوة أكبر، نحو الأسفل، نحو الظلام، نحو العمق – نحو الشر.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "الإنسان شيء يجب تجاوزه. الإنسان حبل مشدود بين الوحش والإنسان الأعلى — حبل فوق هاوية. ما هو عظيم في الإنسان أنه جسر وليس غاية.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "من يتسلق أعلى الجبال يضحك على كل المآسي، الحقيقية أو المتخيلة.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "لا راعٍ وقطيع واحد! الجميع يريد الشيء نفسه، الجميع متشابه: من يشعر باختلاف يذهب طوعًا إلى مصحة المجانين.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "يجب أن يكون لديك فوضى داخلك لتلد نجمًا راقصًا.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "تنظر إلى الأعلى عندما ترغب في الارتقاء. وأنا أنظر إلى الأسفل لأنني مرتفع.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "أتغير بسرعة كبيرة: اليوم ينفي أمس. عندما أصعد غالبًا ما أقفز فوق الدرجات، ولا درجة تسامحني على ذلك.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "تقول 'أنا' وتفتخر بهذه الكلمة. لكن أعظم من ذلك – رغم أنك لن تصدق – هو جسدك وذكاؤه العظيم، الذي لا يقول 'أنا' بل يؤدي 'أنا'.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "من يطيع، لا يسمع نفسه!",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "من كل ما كُتب أحب فقط ما كتبه الإنسان بدمه الخاص.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  },
  {
    quote: "تعلم المشي: منذ ذلك الحين أركض. تعلمت الطيران: منذ ذلك الحين لا أحتاج إلى دفع لأتحرك. الآن أنا خفيف، الآن أطير، الآن أرى نفسي تحت نفسي، الآن يرقص إله داخلي.",
    author: "فريدريك نيتشه",
    book: "هكذا تكلم زرادشت"
  }
];
export default function PhilosophyFeed() {
  const [shuffledQuotes, setShuffledQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const shuffled = [...quotes].sort(() => Math.random() - 0.5);
    setShuffledQuotes(shuffled);
  }, []);

  const handleLike = (index) => {
    setLikes(prev => ({...prev, [index]: !prev[index]}));
  };

  const handleSave = (index) => {
    setSaved(prev => ({...prev, [index]: !prev[index]}));
  };

  const goToNext = () => {
    if (currentIndex < shuffledQuotes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    if (touchStart - touchEnd > 75) {
      goToNext();
    }
    if (touchStart - touchEnd < -75) {
      goToPrevious();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') goToNext();
      if (e.key === 'ArrowUp') goToPrevious();
    };
    
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        goToNext();
      } else if (e.deltaY < 0) {
        goToPrevious();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex]);

  if (shuffledQuotes.length === 0) return null;

  const currentQuote = shuffledQuotes[currentIndex];
  const likeCount = Math.floor(Math.random() * 50000) + 1000 + (likes[currentIndex] ? 1 : 0);
  const commentCount = Math.floor(Math.random() * 5000) + 100;
  const shareCount = Math.floor(Math.random() * 10000) + 200;

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .feed-container {
          position: relative;
          width: 100%;
          height: 100vh;
          background: black;
          overflow: hidden;
        }

        .swipe-area {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .background-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(147, 51, 234, 0.2), black, black);
        }

        .animated-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top right, rgba(236, 72, 153, 0.1), transparent, rgba(59, 130, 246, 0.1));
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .content-wrapper {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
        }

        .quote-card {
          padding: 0 24px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .quote-content {
          max-width: 800px;
          text-align: center;
        }

        .quote-text {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 24px;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
        }

        @media (max-width: 768px) {
          .quote-text {
            font-size: 1.5rem;
          }
        }

        .author-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(to bottom right, #ec4899, #a855f7, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: bold;
          font-size: 1rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        .book-name {
          font-size: 0.875rem;
          color: #d1d5db;
        }

        .actions-sidebar {
          position: absolute;
          right: 8px;
          bottom: 112px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
        }

        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .action-button:active {
          transform: scale(0.9);
        }

        .action-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(31, 41, 55, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
        }

        .action-icon {
          width: 32px;
          height: 32px;
          transition: all 0.2s;
        }

        .action-icon.liked {
          fill: #ef4444;
          color: #ef4444;
          transform: scale(1.1);
        }

        .action-icon.saved {
          fill: #fbbf24;
          color: #fbbf24;
          transform: scale(1.1);
        }

        .action-count {
          font-size: 0.75rem;
          font-weight: bold;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        .top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
        }

        .app-logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          letter-spacing: 0.05em;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        .counter {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 0.75rem;
          color: #9ca3af;
          background: rgba(0, 0, 0, 0.5);
          padding: 4px 8px;
          border-radius: 9999px;
        }

        .scroll-hint {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.6);
          animation: bounce 2s ease-in-out infinite;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scroll-hint:hover {
          color: rgba(255, 255, 255, 0.9);
        }

        .scroll-hint:active {
          transform: translateX(-50%) scale(0.95);
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }

        .scroll-hint-text {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .scroll-arrow {
          width: 24px;
          height: 24px;
        }
      `}</style>

      <div className="feed-container">
        <div
          ref={containerRef}
          className="swipe-area"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="background-gradient" />
          <div className="animated-overlay" />
          
          <div className="content-wrapper">
            <div className="quote-card">
              <div className="quote-content">
                <p className="quote-text">
                  "{currentQuote.quote}"
                </p>
                <div className="author-info">
                  <div className="avatar">
                    {currentQuote.book.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="author-details">
                    <p className="author-name">{currentQuote.book}</p>
                    <p className="book-name">by {currentQuote.author}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="actions-sidebar">
              <button
                onClick={() => handleLike(currentIndex)}
                className="action-button"
              >
                <div className="action-icon-wrapper">
                  <Heart
                    className={`action-icon ${likes[currentIndex] ? 'liked' : ''}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="top-bar">
          <div className="app-logo">ShelfTok</div>
        </div>

        <div className="counter">
          {currentIndex + 1}/{shuffledQuotes.length}
        </div>

        {currentIndex < shuffledQuotes.length - 1 && (
          <button onClick={goToNext} className="scroll-hint">
            <span className="scroll-hint-text">Scroll</span>
            <ChevronDown className="scroll-arrow" />
          </button>
        )}
      </div>
    </>
  );
}